const express = require('express');
const router = express.Router();
const { run, all, get, saveDatabase } = require('../models/database');
const MarkdownFormParser = require('../utils/markdownParser');
const emailService = require('../utils/emailService');
const fs = require('fs');
const path = require('path');

// Home page
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Business Analysis Portal',
    currentYear: new Date().getFullYear()
  });
});

// Access form via code (GET - from homepage form)
router.get('/access', (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    req.flash('error', 'Please enter an access code');
    return res.redirect('/');
  }

  res.redirect('/form/' + code.toUpperCase().trim());
});

// Access form via code (POST)
router.post('/form/access', (req, res) => {
  const { code } = req.body;
  
  if (!code) {
    req.flash('error', 'Please enter an access code');
    return res.redirect('/');
  }

  res.redirect('/form/' + code.toUpperCase().trim());
});

// Form dashboard (shows available forms for invite)
router.get('/form/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  
  const invite = get(`SELECT * FROM invites WHERE code = ?`, [code]);
  
  if (!invite) {
    return res.render('error', {
      title: 'Invalid Access Code',
      message: 'The access code you entered is not valid. Please check your email for the correct code.',
      showAccessForm: true
    });
  }

  if (invite.is_revoked) {
    return res.render('error', {
      title: 'Access Revoked',
      message: 'This invitation has been revoked. Please contact Cloudstrucc for assistance.',
      showAccessForm: false
    });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return res.render('error', {
      title: 'Link Expired',
      message: 'This invitation link has expired. Please contact Cloudstrucc for a new invitation.',
      showAccessForm: false
    });
  }

  // Update access timestamps
  if (!invite.first_accessed_at) {
    run(`UPDATE invites SET first_accessed_at = CURRENT_TIMESTAMP WHERE id = ?`, [invite.id]);
  }
  run(`UPDATE invites SET last_accessed_at = CURRENT_TIMESTAMP WHERE id = ?`, [invite.id]);

  // Get assigned forms with submission status
  const forms = all(`
    SELECT f.*, s.id as submission_id, s.status, s.progress, s.submitted_at
    FROM forms f
    JOIN invite_forms inf ON f.id = inf.form_id
    LEFT JOIN submissions s ON s.form_id = f.id AND s.invite_id = ?
    WHERE inf.invite_id = ?
    ORDER BY f.title
  `, [invite.id, invite.id]);

  const totalForms = forms.length;
  const completedCount = forms.filter(f => f.status === 'submitted').length;
  const inProgressCount = forms.filter(f => f.status === 'in_progress').length;

  let deadlineFormatted = null;
  if (invite.submission_deadline) {
    deadlineFormatted = new Date(invite.submission_deadline).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  res.render('forms/dashboard', {
    title: 'Your Questionnaires',
    invite,
    inviteCode: code,
    clientName: invite.client_name,
    forms,
    totalForms,
    completedCount,
    inProgressCount,
    deadlineFormatted,
    currentYear: new Date().getFullYear()
  });
});

// View/fill specific form
router.get('/form/:code/:slug', (req, res) => {
  const code = req.params.code.toUpperCase();
  const slug = req.params.slug;

  const invite = get(`SELECT * FROM invites WHERE code = ?`, [code]);
  
  if (!invite || invite.is_revoked || new Date(invite.expires_at) < new Date()) {
    return res.redirect('/form/' + code);
  }

  // Check if form is assigned to this invite
  const formAssignment = get(`
    SELECT f.* FROM forms f
    JOIN invite_forms inf ON f.id = inf.form_id
    WHERE inf.invite_id = ? AND f.slug = ?
  `, [invite.id, slug]);

  if (!formAssignment) {
    req.flash('error', 'You do not have access to this form');
    return res.redirect('/form/' + code);
  }

  // Get or create submission
  let submission = get(`
    SELECT * FROM submissions WHERE invite_id = ? AND form_id = ?
  `, [invite.id, formAssignment.id]);

  if (!submission) {
    run(`
      INSERT INTO submissions (invite_id, form_id, data, progress, status)
      VALUES (?, ?, '{}', 0, 'in_progress')
    `, [invite.id, formAssignment.id]);
    // Fetch the newly created submission by invite_id and form_id
    submission = get(`SELECT * FROM submissions WHERE invite_id = ? AND form_id = ?`, [invite.id, formAssignment.id]);
  }

  // Check if submission exists and is already submitted
  if (submission && submission.status === 'submitted') {
    return res.redirect('/form/' + code);
  }
  
  // If still no submission, something went wrong
  if (!submission) {
    req.flash('error', 'Failed to create submission');
    return res.redirect('/form/' + code);
  }
  

  // Parse form template
  const parser = new MarkdownFormParser();
  // Handle both "filename.md" and "templates/filename.md" formats
  let filePath;
  if (formAssignment.markdown_file.startsWith('templates/')) {
    filePath = path.join(__dirname, '..', formAssignment.markdown_file);
  } else {
    filePath = path.join(__dirname, '..', 'templates', formAssignment.markdown_file);
  }
  
  if (!fs.existsSync(filePath)) {
    req.flash('error', 'Form template not found');
    return res.redirect('/form/' + code);
  }

  const formStructure = parser.parseFile(filePath);
  const formHtml = parser.generateFormHtml(formStructure);

  let savedData = {};
  try {
    savedData = JSON.parse(submission.data || '{}');
  } catch (e) {}

  res.render('forms/questionnaire', {
    title: formAssignment.title,
    invite,
    inviteCode: code,
    clientName: invite.client_name,
    form: formAssignment,
    formHtml,
    progress: submission.progress || 0,
    savedData,
    savedDataJson: JSON.stringify(savedData),
    lastSaved: submission.updated_at ? new Date(submission.updated_at).toLocaleTimeString() : null,
    currentYear: new Date().getFullYear()
  });
});

// Auto-save form data
router.post('/form/:code/:slug/save', express.json(), (req, res) => {
  const code = req.params.code.toUpperCase();
  const slug = req.params.slug;
  const { data, progress } = req.body;

  try {
    const invite = get(`SELECT * FROM invites WHERE code = ?`, [code]);
    if (!invite || invite.is_revoked) {
      return res.json({ success: false, message: 'Invalid invite' });
    }

    const form = get(`
      SELECT f.id FROM forms f
      JOIN invite_forms inf ON f.id = inf.form_id
      WHERE inf.invite_id = ? AND f.slug = ?
    `, [invite.id, slug]);

    if (!form) {
      return res.json({ success: false, message: 'Form not found' });
    }

    run(`
      UPDATE submissions 
      SET data = ?, progress = ?, updated_at = CURRENT_TIMESTAMP
      WHERE invite_id = ? AND form_id = ? AND status != 'submitted'
    `, [JSON.stringify(data), progress || 0, invite.id, form.id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    res.json({ success: false, message: error.message });
  }
});

// Submit form
router.post('/form/:code/:slug/submit', express.urlencoded({ extended: true }), async (req, res) => {
  const code = req.params.code.toUpperCase();
  const slug = req.params.slug;

  try {
    const invite = get(`SELECT * FROM invites WHERE code = ?`, [code]);
    if (!invite || invite.is_revoked || new Date(invite.expires_at) < new Date()) {
      req.flash('error', 'Invalid or expired invitation');
      return res.redirect('/form/' + code);
    }

    const form = get(`
      SELECT f.* FROM forms f
      JOIN invite_forms inf ON f.id = inf.form_id
      WHERE inf.invite_id = ? AND f.slug = ?
    `, [invite.id, slug]);

    if (!form) {
      req.flash('error', 'Form not found');
      return res.redirect('/form/' + code);
    }

    // Process form data
    const data = {};
    Object.keys(req.body).forEach(key => {
      data[key] = req.body[key];
    });

    // Update submission
    run(`
      UPDATE submissions 
      SET data = ?, progress = 100, status = 'submitted', submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE invite_id = ? AND form_id = ?
    `, [JSON.stringify(data), invite.id, form.id]);

    const submission = get(`SELECT * FROM submissions WHERE invite_id = ? AND form_id = ?`, [invite.id, form.id]);

    // Send confirmation emails
    emailService.initialize();
    
    // Email to client
    await emailService.sendClientConfirmation({
      to: invite.client_email,
      clientName: invite.client_name,
      formTitle: form.title
    });

    // Email to admin
    await emailService.sendAdminNotification({
      clientName: invite.client_name,
      clientEmail: invite.client_email,
      clientCompany: invite.client_company,
      formTitle: form.title,
      submissionId: submission.id
    });

    // Check if there are more forms to complete
    const remainingForms = get(`
      SELECT COUNT(*) as count FROM forms f
      JOIN invite_forms inf ON f.id = inf.form_id
      LEFT JOIN submissions s ON s.form_id = f.id AND s.invite_id = ?
      WHERE inf.invite_id = ? AND (s.status IS NULL OR s.status != 'submitted')
    `, [invite.id, invite.id]);

    res.render('forms/success', {
      title: 'Submission Complete',
      invite,
      inviteCode: code,
      form,
      submittedAt: new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      hasMoreForms: remainingForms.count > 0,
      currentYear: new Date().getFullYear()
    });
  } catch (error) {
    console.error('Submit error:', error);
    req.flash('error', 'Failed to submit form: ' + error.message);
    res.redirect('/form/' + code + '/' + slug);
  }
});

module.exports = router;
