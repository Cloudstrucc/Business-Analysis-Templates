const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { passport, ensureAuthenticated, ensureNotAuthenticated } = require('../config/passport');
const { run, all, get, saveDatabase } = require('../models/database');
const emailService = require('../utils/emailService');

// Login page
router.get('/login', ensureNotAuthenticated, (req, res) => {
  res.render('admin/login', { 
    title: 'Admin Login',
    messages: {
      error: req.flash('error')[0],
      success: req.flash('success')[0]
    }
  });
});

// Login handler
router.post('/login', ensureNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/admin/dashboard',
  failureRedirect: '/admin/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'You have been logged out');
    res.redirect('/admin/login');
  });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  // Get stats
  const totalInvites = get(`SELECT COUNT(*) as count FROM invites WHERE is_revoked = 0 AND expires_at > datetime('now')`)?.count || 0;
  
  const inProgress = get(`
    SELECT COUNT(DISTINCT s.invite_id) as count 
    FROM submissions s 
    JOIN invites i ON s.invite_id = i.id 
    WHERE s.status = 'in_progress' AND i.is_revoked = 0
  `)?.count || 0;
  
  const completed = get(`SELECT COUNT(*) as count FROM submissions WHERE status = 'submitted'`)?.count || 0;
  
  const expiringSoon = get(`
    SELECT COUNT(*) as count FROM invites 
    WHERE is_revoked = 0 AND expires_at > datetime('now') AND expires_at < datetime('now', '+7 days')
  `)?.count || 0;

  // Recent activity
  const recentActivity = all(`
    SELECT s.*, i.client_name, i.client_company, f.title as form_title
    FROM submissions s
    JOIN invites i ON s.invite_id = i.id
    JOIN forms f ON s.form_id = f.id
    ORDER BY s.updated_at DESC
    LIMIT 10
  `);

  // Expiring soon invites
  const expiringSoonList = all(`
    SELECT * FROM invites 
    WHERE is_revoked = 0 AND expires_at > datetime('now') AND expires_at < datetime('now', '+7 days')
    ORDER BY expires_at ASC
    LIMIT 5
  `);

  res.render('admin/dashboard', {
    title: 'Dashboard',
    isAdmin: true,
    isDashboard: true,
    admin: req.user,
    stats: { totalInvites, inProgress, completed, expiringSoon },
    recentActivity,
    expiringSoon: expiringSoonList,
    messages: {
      success: req.flash('success')[0],
      error: req.flash('error')[0]
    }
  });
});

// Invites list
router.get('/invites', ensureAuthenticated, (req, res) => {
  const { status, search } = req.query;
  
  let sql = `
    SELECT i.*, 
      (SELECT COUNT(*) FROM invite_forms WHERE invite_id = i.id) as form_count,
      COALESCE((SELECT MAX(progress) FROM submissions WHERE invite_id = i.id), 0) as progress,
      CASE WHEN i.expires_at < datetime('now') THEN 1 ELSE 0 END as is_expired
    FROM invites i
    WHERE 1=1
  `;
  const params = [];

  if (status === 'active') {
    sql += ` AND i.is_revoked = 0 AND i.expires_at > datetime('now')`;
  } else if (status === 'expired') {
    sql += ` AND i.expires_at <= datetime('now')`;
  } else if (status === 'revoked') {
    sql += ` AND i.is_revoked = 1`;
  }

  if (search) {
    sql += ` AND (i.client_name LIKE ? OR i.client_email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ` ORDER BY i.created_at DESC`;

  const invites = all(sql, params);

  res.render('admin/invites', {
    title: 'Manage Invites',
    isAdmin: true,
    isInvites: true,
    admin: req.user,
    invites,
    filters: { status, search },
    messages: {
      success: req.flash('success')[0],
      error: req.flash('error')[0]
    }
  });
});

// New invite form
router.get('/invites/new', ensureAuthenticated, (req, res) => {
  const forms = all(`SELECT * FROM forms WHERE is_active = 1 ORDER BY title`);
  
  res.render('admin/invite-new', {
    title: 'Create Invite',
    isAdmin: true,
    isInvites: true,
    admin: req.user,
    forms,
    messages: {
      error: req.flash('error')[0]
    }
  });
});

// Create invite
router.post('/invites/create', ensureAuthenticated, async (req, res) => {
  try {
    const { clientName, clientEmail, clientCompany, forms, expiresAt, submissionDeadline, sendEmail } = req.body;
    
    console.log('=== CREATE INVITE DEBUG ===');
    console.log('forms from request:', forms);
    console.log('forms type:', typeof forms);
    console.log('req.body:', JSON.stringify(req.body, null, 2));
    
    if (!clientName || !clientEmail || !forms || !expiresAt) {
      console.log('Validation failed - missing fields');
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/admin/invites/new');
    }

    const formIds = Array.isArray(forms) ? forms : [forms];
    console.log('formIds array:', formIds);
    
    // Generate unique code
    const code = uuidv4().substring(0, 8).toUpperCase();
    
    // Create invite
    run(`
      INSERT INTO invites (code, client_email, client_name, client_company, created_by, expires_at, submission_deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [code, clientEmail.toLowerCase(), clientName, clientCompany || null, req.user.id, expiresAt, submissionDeadline || null]);
    
    // Get the invite ID by querying for the code we just inserted
    const newInvite = get(`SELECT id FROM invites WHERE code = ?`, [code]);
    const inviteId = newInvite ? newInvite.id : 0;
    
    console.log('Created invite with ID:', inviteId, '(from code lookup)');

    // Link forms to invite (deduplicate first)
    const uniqueFormIds = [...new Set(formIds.map(id => parseInt(id)))];
    console.log('uniqueFormIds:', uniqueFormIds);
    
    for (const formId of uniqueFormIds) {
      console.log('Linking form', formId, 'to invite', inviteId);
      // Check if already exists
      const existing = get(`SELECT id FROM invite_forms WHERE invite_id = ? AND form_id = ?`, [inviteId, formId]);
      console.log('Existing link:', existing);
      if (!existing) {
        run(`INSERT INTO invite_forms (invite_id, form_id) VALUES (?, ?)`, [inviteId, formId]);
        console.log('Inserted invite_forms link');
      }
    }
    
    // Verify the links were created
    const linkedForms = all(`SELECT * FROM invite_forms WHERE invite_id = ?`, [inviteId]);
    console.log('Linked forms after insert:', linkedForms);

    // Get form details for email
    const formDetails = uniqueFormIds.length > 0 ? all(`SELECT * FROM forms WHERE id IN (${uniqueFormIds.join(',')})`) : [];

    // Send email if requested
    if (sendEmail === 'on') {
      emailService.initialize();
      await emailService.sendInvite({
        to: clientEmail,
        clientName,
        inviteCode: code,
        forms: formDetails,
        expiresAt,
        submissionDeadline
      });
    }

    req.flash('success', `Invite created successfully! Code: ${code}`);
    res.redirect('/admin/invites');
  } catch (error) {
    console.error('Error creating invite:', error);
    req.flash('error', 'Failed to create invite: ' + error.message);
    res.redirect('/admin/invites/new');
  }
});

// View invite details
router.get('/invites/:id', ensureAuthenticated, (req, res) => {
  const invite = get(`SELECT * FROM invites WHERE id = ?`, [req.params.id]);
  
  if (!invite) {
    req.flash('error', 'Invite not found');
    return res.redirect('/admin/invites');
  }

  const forms = all(`
    SELECT f.* FROM forms f
    JOIN invite_forms inf ON f.id = inf.form_id
    WHERE inf.invite_id = ?
  `, [req.params.id]);

  const submissions = all(`
    SELECT s.*, f.title as form_title
    FROM submissions s
    JOIN forms f ON s.form_id = f.id
    WHERE s.invite_id = ?
  `, [req.params.id]);

  res.render('admin/invite-detail', {
    title: 'Invite Details',
    isAdmin: true,
    isInvites: true,
    admin: req.user,
    invite,
    forms,
    submissions
  });
});

// Resend invite email
router.post('/invites/:id/resend', ensureAuthenticated, async (req, res) => {
  try {
    const invite = get(`SELECT * FROM invites WHERE id = ?`, [req.params.id]);
    
    if (!invite) {
      return res.json({ success: false, message: 'Invite not found' });
    }

    const forms = all(`
      SELECT f.* FROM forms f
      JOIN invite_forms inf ON f.id = inf.form_id
      WHERE inf.invite_id = ?
    `, [req.params.id]);

    emailService.initialize();
    const result = await emailService.sendInvite({
      to: invite.client_email,
      clientName: invite.client_name,
      inviteCode: invite.code,
      forms,
      expiresAt: invite.expires_at,
      submissionDeadline: invite.submission_deadline
    });

    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// Revoke invite
router.post('/invites/:id/revoke', ensureAuthenticated, (req, res) => {
  run(`UPDATE invites SET is_revoked = 1 WHERE id = ?`, [req.params.id]);
  req.flash('success', 'Invite revoked successfully');
  res.redirect('/admin/invites');
});

// Submissions list
router.get('/submissions', ensureAuthenticated, (req, res) => {
  const { status, form, search } = req.query;
  
  let sql = `
    SELECT s.*, i.client_name, i.client_company, i.client_email, f.title as form_title
    FROM submissions s
    JOIN invites i ON s.invite_id = i.id
    JOIN forms f ON s.form_id = f.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    sql += ` AND s.status = ?`;
    params.push(status);
  }

  if (form) {
    sql += ` AND s.form_id = ?`;
    params.push(form);
  }

  if (search) {
    sql += ` AND i.client_name LIKE ?`;
    params.push(`%${search}%`);
  }

  sql += ` ORDER BY s.updated_at DESC`;

  const submissions = all(sql, params);
  const forms = all(`SELECT id, title FROM forms ORDER BY title`);

  res.render('admin/submissions', {
    title: 'Submissions',
    isAdmin: true,
    isSubmissions: true,
    admin: req.user,
    submissions,
    forms,
    filters: { status, form, search },
    messages: {
      success: req.flash('success')[0],
      error: req.flash('error')[0]
    }
  });
});

// View submission details
router.get('/submissions/:id', ensureAuthenticated, (req, res) => {
  const submission = get(`SELECT * FROM submissions WHERE id = ?`, [req.params.id]);
  
  if (!submission) {
    req.flash('error', 'Submission not found');
    return res.redirect('/admin/submissions');
  }

  const invite = get(`SELECT * FROM invites WHERE id = ?`, [submission.invite_id]);
  const form = get(`SELECT * FROM forms WHERE id = ?`, [submission.form_id]);
  
  let responses = {};
  let responseCount = 0;
  
  try {
    responses = JSON.parse(submission.data || '{}');
    responseCount = Object.keys(responses).filter(k => responses[k] && responses[k].length > 0).length;
  } catch (e) {}

  // Group responses by section (simplified)
  const responseSections = [];
  const sectionMap = {};
  
  Object.entries(responses).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    
    const parts = key.split('_');
    const sectionName = parts[0] === 'header' ? 'Project Information' : 
                        parts[0] === 'signoff' ? 'Sign-Off' : 
                        parts.slice(0, 2).join(' ').replace(/_/g, ' ');
    
    if (!sectionMap[sectionName]) {
      sectionMap[sectionName] = { title: sectionName, fields: [] };
      responseSections.push(sectionMap[sectionName]);
    }
    
    sectionMap[sectionName].fields.push({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value,
      isArray: Array.isArray(value)
    });
  });

  res.render('admin/submission-detail', {
    title: 'Submission Details',
    isAdmin: true,
    isSubmissions: true,
    admin: req.user,
    submission,
    invite,
    form,
    responses: Object.keys(responses).length > 0,
    responseSections,
    responseCount
  });
});

// Export submission as PDF (placeholder)
router.get('/submissions/:id/export', ensureAuthenticated, (req, res) => {
  // TODO: Implement PDF export with puppeteer
  req.flash('error', 'PDF export coming soon');
  res.redirect('/admin/submissions/' + req.params.id);
});

// Forms management
router.get('/forms', ensureAuthenticated, (req, res) => {
  const forms = all(`
    SELECT f.*,
      (SELECT COUNT(*) FROM invite_forms WHERE form_id = f.id) as invite_count,
      (SELECT COUNT(*) FROM submissions WHERE form_id = f.id) as submission_count
    FROM forms f
    ORDER BY f.title
  `);

  res.render('admin/forms', {
    title: 'Manage Forms',
    isAdmin: true,
    isForms: true,
    admin: req.user,
    forms,
    messages: {
      success: req.flash('success')[0],
      error: req.flash('error')[0]
    }
  });
});

// Reload forms from markdown files
router.post('/forms/reload', ensureAuthenticated, (req, res) => {
  try {
    const formLoader = require('../utils/formLoader');
    formLoader.loadAllForms();
    req.flash('success', 'Forms reloaded successfully');
  } catch (error) {
    req.flash('error', 'Failed to reload forms: ' + error.message);
  }
  res.redirect('/admin/forms');
});

// Toggle form active status
router.post('/forms/:id/toggle', ensureAuthenticated, (req, res) => {
  const { active } = req.body;
  run(`UPDATE forms SET is_active = ? WHERE id = ?`, [active ? 1 : 0, req.params.id]);
  res.json({ success: true });
});

// Preview form
router.get('/forms/:id/preview', ensureAuthenticated, (req, res) => {
  const form = get(`SELECT * FROM forms WHERE id = ?`, [req.params.id]);
  
  if (!form) {
    req.flash('error', 'Form not found');
    return res.redirect('/admin/forms');
  }

  const MarkdownFormParser = require('../utils/markdownParser');
  const parser = new MarkdownFormParser();
  const fs = require('fs');
  const path = require('path');
  
  // Handle both "filename.md" and "templates/filename.md" formats
  let filePath;
  if (form.markdown_file.startsWith('templates/')) {
    filePath = path.join(__dirname, '..', form.markdown_file);
  } else {
    filePath = path.join(__dirname, '..', 'templates', form.markdown_file);
  }
  
  console.log('Preview form - looking for file:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    req.flash('error', 'Form template file not found: ' + form.markdown_file);
    return res.redirect('/admin/forms');
  }

  const formStructure = parser.parseFile(filePath);
  const formHtml = parser.generateFormHtml(formStructure);

  res.render('forms/questionnaire', {
    title: form.title + ' (Preview)',
    isAdmin: true,
    admin: req.user,
    form,
    invite: { client_name: 'Preview User', client_company: 'Preview Company' },
    inviteCode: 'PREVIEW',
    formHtml,
    progress: 0,
    savedData: {},
    savedDataJson: '{}'
  });
});

module.exports = router;
