const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'questionnaire.db');
const DATA_DIR = path.join(__dirname, '..', 'data');

let db = null;

async function initDatabase() {
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();
  
  // Load existing database or create new one
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      markdown_file TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS invites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      client_email TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_company TEXT,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      submission_deadline DATETIME,
      is_revoked INTEGER DEFAULT 0,
      first_accessed_at DATETIME,
      last_accessed_at DATETIME,
      FOREIGN KEY (created_by) REFERENCES admins(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS invite_forms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invite_id INTEGER NOT NULL,
      form_id INTEGER NOT NULL,
      FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE CASCADE,
      FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
      UNIQUE(invite_id, form_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invite_id INTEGER NOT NULL,
      form_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in_progress',
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      submitted_at DATETIME,
      validation_data TEXT,
      FOREIGN KEY (invite_id) REFERENCES invites(id),
      FOREIGN KEY (form_id) REFERENCES forms(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS analytics_sent (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create attachments table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submissionId INTEGER NOT NULL,
      fileName TEXT NOT NULL,
      fileUrl TEXT NOT NULL,
      description TEXT,
      addedBy TEXT,
      addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submissionId) REFERENCES submissions(id) ON DELETE CASCADE
    )
  `);

  // Create audit log table for tracking all actions
  db.run(`
    CREATE TABLE IF NOT EXISTS submission_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      actor_type TEXT DEFAULT 'admin',
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
    )
  `);

  // Create submission_approvals table for approval workflow
  db.run(`
    CREATE TABLE IF NOT EXISTS submission_approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL UNIQUE,
      
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_access_code TEXT UNIQUE,
      client_approved_at DATETIME,
      client_comments TEXT,
      
      sponsor_name TEXT NOT NULL,
      sponsor_email TEXT NOT NULL,
      sponsor_access_code TEXT UNIQUE,
      sponsor_approved_at DATETIME,
      sponsor_comments TEXT,
      
      executive_name TEXT NOT NULL,
      executive_email TEXT NOT NULL,
      executive_access_code TEXT UNIQUE,
      executive_approved_at DATETIME,
      executive_comments TEXT,
      
      initiated_by TEXT,
      initiated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      status TEXT DEFAULT 'pending',
      
      FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
    )
  `);

  // Add validation_data column if it doesn't exist (migration)
  try {
    db.run(`ALTER TABLE submissions ADD COLUMN validation_data TEXT`);
  } catch (e) {
    // Column likely already exists
  }

  // Add user_validation_data column if it doesn't exist
  try {
    db.run(`ALTER TABLE submissions ADD COLUMN user_validation_data TEXT`);
  } catch (e) {}

  // Add validation_status column if it doesn't exist
  try {
    db.run(`ALTER TABLE submissions ADD COLUMN validation_status TEXT DEFAULT 'none'`);
  } catch (e) {}

  // Add filtered_fields column if it doesn't exist
  try {
    db.run(`ALTER TABLE submissions ADD COLUMN filtered_fields TEXT`);
  } catch (e) {}

  // Add admin_comments column if it doesn't exist
  try {
    db.run(`ALTER TABLE submissions ADD COLUMN admin_comments TEXT`);
  } catch (e) {}

  // Add approval_status column if it doesn't exist
  try {
    db.run(`ALTER TABLE submissions ADD COLUMN approval_status TEXT DEFAULT 'none'`);
  } catch (e) {}

  // Create default admin if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cloudstrucc.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  
  const existingAdmin = db.exec(`SELECT id FROM admins WHERE email = '${adminEmail}'`);
  if (!existingAdmin.length || !existingAdmin[0].values.length) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    db.run(`INSERT INTO admins (email, password, name) VALUES (?, ?, ?)`, 
      [adminEmail, hashedPassword, 'Administrator']);
    console.log('Default admin created:', adminEmail);
  }

  // Save database
  saveDatabase();

  return db;
}

function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Helper to run parameterized queries
function run(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  
  // Get last insert ID BEFORE saving (important!)
  const lastId = db.exec('SELECT last_insert_rowid()')[0]?.values[0][0] || 0;
  
  saveDatabase();
  return lastId;
}

// Helper to get all rows
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push(row);
  }
  stmt.free();
  return results;
}

// Helper to get single row
function get(sql, params = []) {
  const results = all(sql, params);
  return results.length > 0 ? results[0] : null;
}

// ============================================================
// STATS - for dashboard
// ============================================================
function getStats() {
  const activeInvites = get(`SELECT COUNT(*) as count FROM invites WHERE is_revoked = 0 AND expires_at > datetime('now')`)?.count || 0;
  const totalSubmissions = get(`SELECT COUNT(*) as count FROM submissions`)?.count || 0;
  const completedSubmissions = get(`SELECT COUNT(*) as count FROM submissions WHERE status = 'submitted'`)?.count || 0;
  const draftSubmissions = get(`SELECT COUNT(*) as count FROM submissions WHERE status = 'in_progress'`)?.count || 0;

  return {
    activeInvites,
    totalSubmissions,
    completedSubmissions,
    draftSubmissions
  };
}

// ============================================================
// INVITES
// ============================================================
function getAllInvites() {
  return all(`
    SELECT i.*, 
           (SELECT COUNT(*) FROM invite_forms WHERE invite_id = i.id) as formCount
    FROM invites i 
    ORDER BY created_at DESC
  `);
}

function getActiveInvites() {
  return all(`
    SELECT i.*, 
           (SELECT COUNT(*) FROM invite_forms WHERE invite_id = i.id) as formCount
    FROM invites i 
    WHERE is_revoked = 0 AND expires_at > datetime('now')
    ORDER BY created_at DESC
  `);
}

function getInviteByCode(code) {
  return get(`SELECT * FROM invites WHERE code = ? AND is_revoked = 0`, [code]);
}

function getInviteById(id) {
  return get(`SELECT * FROM invites WHERE id = ?`, [id]);
}

function createInvite(data) {
  const { code, clientEmail, clientName, clientCompany, createdBy, expiresAt, submissionDeadline } = data;
  const id = run(`
    INSERT INTO invites (code, client_email, client_name, client_company, created_by, expires_at, submission_deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [code, clientEmail, clientName, clientCompany || null, createdBy || null, expiresAt, submissionDeadline || null]);
  saveDatabase();
  return { id, code };
}

function deleteInvite(id) {
  run(`DELETE FROM invite_forms WHERE invite_id = ?`, [id]);
  run(`DELETE FROM invites WHERE id = ?`, [id]);
  saveDatabase();
}

function revokeInvite(id) {
  run(`UPDATE invites SET is_revoked = 1 WHERE id = ?`, [id]);
  saveDatabase();
}

function addFormToInvite(inviteId, formId) {
  run(`INSERT OR IGNORE INTO invite_forms (invite_id, form_id) VALUES (?, ?)`, [inviteId, formId]);
  saveDatabase();
}

function getInviteForms(inviteId) {
  return all(`
    SELECT f.* FROM forms f
    INNER JOIN invite_forms inf ON f.id = inf.form_id
    WHERE inf.invite_id = ?
  `, [inviteId]);
}

function markInviteAccessed(code) {
  const invite = getInviteByCode(code);
  if (invite) {
    if (!invite.first_accessed_at) {
      run(`UPDATE invites SET first_accessed_at = CURRENT_TIMESTAMP, last_accessed_at = CURRENT_TIMESTAMP WHERE code = ?`, [code]);
    } else {
      run(`UPDATE invites SET last_accessed_at = CURRENT_TIMESTAMP WHERE code = ?`, [code]);
    }
    saveDatabase();
  }
}

// ============================================================
// SUBMISSIONS
// ============================================================
function getAllSubmissions() {
  return all(`
    SELECT 
      s.*,
      i.client_name as clientName,
      i.client_email as clientEmail,
      i.client_company as companyName,
      i.code as inviteCode,
      f.title as formName,
      f.slug as formSlug
    FROM submissions s
    LEFT JOIN invites i ON s.invite_id = i.id
    LEFT JOIN forms f ON s.form_id = f.id
    ORDER BY s.updated_at DESC
  `);
}

function getRecentSubmissions(limit = 5) {
  return all(`
    SELECT 
      s.*,
      i.client_name as clientName,
      i.client_email as clientEmail,
      i.client_company as companyName,
      i.code as inviteCode,
      f.title as formName,
      f.slug as formSlug
    FROM submissions s
    LEFT JOIN invites i ON s.invite_id = i.id
    LEFT JOIN forms f ON s.form_id = f.id
    ORDER BY s.updated_at DESC
    LIMIT ?
  `, [limit]);
}

function getSubmissionById(id) {
  return get(`
    SELECT 
      s.*,
      i.client_name as clientName,
      i.client_email as clientEmail,
      i.client_company as companyName,
      i.code as inviteCode,
      f.title as formName,
      f.slug as formSlug
    FROM submissions s
    LEFT JOIN invites i ON s.invite_id = i.id
    LEFT JOIN forms f ON s.form_id = f.id
    WHERE s.id = ?
  `, [id]);
}

function getSubmissionByInviteAndForm(inviteId, formId) {
  return get(`SELECT * FROM submissions WHERE invite_id = ? AND form_id = ?`, [inviteId, formId]);
}

function createSubmission(inviteId, formId, data = '{}') {
  const id = run(`
    INSERT INTO submissions (invite_id, form_id, data, progress, status)
    VALUES (?, ?, ?, 0, 'in_progress')
  `, [inviteId, formId, typeof data === 'string' ? data : JSON.stringify(data)]);
  saveDatabase();
  return id;
}

function updateSubmissionData(id, data, progress) {
  const dataString = typeof data === 'string' ? data : JSON.stringify(data);
  run(`UPDATE submissions SET data = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, 
    [dataString, progress, id]);
  saveDatabase();
}

function submitSubmission(id) {
  run(`UPDATE submissions SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
  saveDatabase();
}

function deleteSubmission(id) {
  run(`DELETE FROM submissions WHERE id = ?`, [id]);
  saveDatabase();
}

// ============================================================
// VALIDATION (Admin)
// ============================================================
function updateSubmissionValidation(id, validationData) {
  const validationJson = typeof validationData === 'string' ? validationData : JSON.stringify(validationData);
  run(`UPDATE submissions SET validation_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [validationJson, id]);
  saveDatabase();
}

function getSubmissionValidation(id) {
  const submission = get(`SELECT validation_data FROM submissions WHERE id = ?`, [id]);
  if (submission && submission.validation_data) {
    try {
      return JSON.parse(submission.validation_data);
    } catch (e) {
      return {};
    }
  }
  return {};
}

// Validation status tracking
function updateSubmissionValidationStatus(id, validationStatus, actor = 'admin', filteredFields = null) {
  // Update status to waiting_for_validation when sending to client
  let auditAction = 'validation_status_updated';
  if (validationStatus === 'pending_user_validation') {
    run(`UPDATE submissions SET status = 'waiting_for_validation' WHERE id = ?`, [id]);
    auditAction = 'sent_for_validation';
  }
  
  // Store filtered fields if provided
  if (filteredFields !== null) {
    const filteredJson = typeof filteredFields === 'string' ? filteredFields : JSON.stringify(filteredFields);
    if (filteredFields && (Array.isArray(filteredFields) ? filteredFields.length > 0 : true)) {
      run(`UPDATE submissions SET validation_status = ?, filtered_fields = ? WHERE id = ?`, [validationStatus, filteredJson, id]);
    } else {
      run(`UPDATE submissions SET validation_status = ? WHERE id = ?`, [validationStatus, id]);
    }
  } else {
    run(`UPDATE submissions SET validation_status = ? WHERE id = ?`, [validationStatus, id]);
  }
  
  // Add audit log entry
  const details = filteredFields ? { filteredFieldCount: Array.isArray(filteredFields) ? filteredFields.length : 0 } : {};
  addAuditLog(id, auditAction, actor, 'admin', details);
  
  saveDatabase();
}

function getSubmissionValidationStatus(id) {
  const submission = get(`SELECT validation_status FROM submissions WHERE id = ?`, [id]);
  return submission?.validation_status || 'none';
}

function getSubmissionFilteredFields(id) {
  const submission = get(`SELECT filtered_fields FROM submissions WHERE id = ?`, [id]);
  if (submission && submission.filtered_fields) {
    try {
      return JSON.parse(submission.filtered_fields);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// User validation data (separate from admin validation)
function updateSubmissionUserValidation(id, userValidationData, actor = 'user') {
  const validationJson = typeof userValidationData === 'string' ? userValidationData : JSON.stringify(userValidationData);
  
  // Count met/not met
  let metCount = 0, notMetCount = 0;
  const data = typeof userValidationData === 'string' ? JSON.parse(userValidationData) : userValidationData;
  Object.values(data).forEach(v => {
    if (v.met === 'yes') metCount++;
    else if (v.met === 'no') notMetCount++;
  });
  
  // When user submits validation, set validation_status to user_submitted and status back to submitted
  run(`UPDATE submissions SET user_validation_data = ?, validation_status = 'user_submitted', status = 'submitted' WHERE id = ?`, [validationJson, id]);
  
  // Add audit log entry
  addAuditLog(id, 'user_validated', actor, 'user', { metCount, notMetCount });
  
  saveDatabase();
}

// Admin comments/replies to user validation
function updateSubmissionAdminComments(id, adminComments, actor = 'admin@cloudstrucc.com') {
  const commentsJson = typeof adminComments === 'string' ? adminComments : JSON.stringify(adminComments);
  run(`UPDATE submissions SET admin_comments = ? WHERE id = ?`, [commentsJson, id]);
  
  // Add audit log entry
  const commentCount = Object.keys(typeof adminComments === 'string' ? JSON.parse(adminComments) : adminComments).length;
  addAuditLog(id, 'admin_commented', actor, 'admin', { commentCount });
  
  saveDatabase();
}

function getSubmissionAdminComments(id) {
  const submission = get(`SELECT admin_comments FROM submissions WHERE id = ?`, [id]);
  if (submission && submission.admin_comments) {
    try {
      return JSON.parse(submission.admin_comments);
    } catch (e) {
      return {};
    }
  }
  return {};
}

function getSubmissionUserValidation(id) {
  const submission = get(`SELECT user_validation_data FROM submissions WHERE id = ?`, [id]);
  if (submission && submission.user_validation_data) {
    try {
      return JSON.parse(submission.user_validation_data);
    } catch (e) {
      return {};
    }
  }
  return {};
}

// ============================================================
// APPROVAL WORKFLOW
// ============================================================
function generateAccessCode() {
  return crypto.randomBytes(16).toString('hex');
}

function createApproval(submissionId, data) {
  const { clientName, clientEmail, sponsorName, sponsorEmail, executiveName, executiveEmail, initiatedBy } = data;
  
  const clientAccessCode = generateAccessCode();
  const sponsorAccessCode = generateAccessCode();
  const executiveAccessCode = generateAccessCode();
  
  const id = run(`
    INSERT INTO submission_approvals (
      submission_id, 
      client_name, client_email, client_access_code,
      sponsor_name, sponsor_email, sponsor_access_code,
      executive_name, executive_email, executive_access_code,
      initiated_by, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `, [
    submissionId,
    clientName, clientEmail, clientAccessCode,
    sponsorName, sponsorEmail, sponsorAccessCode,
    executiveName, executiveEmail, executiveAccessCode,
    initiatedBy
  ]);
  
  // Update submission approval status
  run(`UPDATE submissions SET approval_status = 'pending_approval' WHERE id = ?`, [submissionId]);
  
  // Add audit log
  addAuditLog(submissionId, 'approval_initiated', initiatedBy, 'admin', {
    stakeholders: [
      { role: 'client', name: clientName, email: clientEmail },
      { role: 'sponsor', name: sponsorName, email: sponsorEmail },
      { role: 'executive', name: executiveName, email: executiveEmail }
    ]
  });
  
  saveDatabase();
  
  return {
    id,
    clientAccessCode,
    sponsorAccessCode,
    executiveAccessCode
  };
}

function getApprovalBySubmissionId(submissionId) {
  return get(`SELECT * FROM submission_approvals WHERE submission_id = ?`, [submissionId]);
}

function getApprovalByAccessCode(accessCode) {
  const approval = get(`
    SELECT * FROM submission_approvals 
    WHERE client_access_code = ? OR sponsor_access_code = ? OR executive_access_code = ?
  `, [accessCode, accessCode, accessCode]);
  
  if (approval) {
    // Determine which role this access code belongs to
    if (approval.client_access_code === accessCode) {
      approval.accessRole = 'client';
      approval.accessName = approval.client_name;
      approval.accessEmail = approval.client_email;
    } else if (approval.sponsor_access_code === accessCode) {
      approval.accessRole = 'sponsor';
      approval.accessName = approval.sponsor_name;
      approval.accessEmail = approval.sponsor_email;
    } else if (approval.executive_access_code === accessCode) {
      approval.accessRole = 'executive';
      approval.accessName = approval.executive_name;
      approval.accessEmail = approval.executive_email;
    }
  }
  
  return approval;
}

function canApprove(approval, role) {
  switch (role) {
    case 'client':
      return !approval.client_approved_at;
    case 'sponsor':
      return approval.client_approved_at && !approval.sponsor_approved_at;
    case 'executive':
      return approval.sponsor_approved_at && !approval.executive_approved_at;
    default:
      return false;
  }
}

function submitApproval(accessCode, comments = '') {
  const approval = getApprovalByAccessCode(accessCode);
  if (!approval) return { success: false, error: 'Invalid access code' };
  
  const role = approval.accessRole;
  
  // Check if it's their turn
  if (!canApprove(approval, role)) {
    if (role === 'sponsor' && !approval.client_approved_at) {
      return { success: false, error: 'Waiting for client approval' };
    }
    if (role === 'executive' && !approval.sponsor_approved_at) {
      return { success: false, error: 'Waiting for sponsor approval' };
    }
    return { success: false, error: 'Already approved or not your turn' };
  }
  
  // Update the appropriate approval field
  const now = new Date().toISOString();
  let updateSql = '';
  let auditAction = '';
  
  switch (role) {
    case 'client':
      updateSql = `UPDATE submission_approvals SET client_approved_at = ?, client_comments = ? WHERE id = ?`;
      auditAction = 'client_approved';
      break;
    case 'sponsor':
      updateSql = `UPDATE submission_approvals SET sponsor_approved_at = ?, sponsor_comments = ? WHERE id = ?`;
      auditAction = 'sponsor_approved';
      break;
    case 'executive':
      updateSql = `UPDATE submission_approvals SET executive_approved_at = ?, executive_comments = ? WHERE id = ?`;
      auditAction = 'executive_approved';
      break;
  }
  
  run(updateSql, [now, comments, approval.id]);
  
  // Add audit log
  addAuditLog(approval.submission_id, auditAction, approval.accessEmail, 'stakeholder', {
    role: role,
    name: approval.accessName,
    comments: comments || null
  });
  
  // Check if all approvals are complete
  const updatedApproval = getApprovalBySubmissionId(approval.submission_id);
  if (updatedApproval.client_approved_at && updatedApproval.sponsor_approved_at && updatedApproval.executive_approved_at) {
    // All approved - mark as complete
    run(`UPDATE submission_approvals SET status = 'completed', completed_at = ? WHERE id = ?`, [now, approval.id]);
    run(`UPDATE submissions SET approval_status = 'approved' WHERE id = ?`, [approval.submission_id]);
    
    // Add completion audit log
    addAuditLog(approval.submission_id, 'approval_completed', 'system', 'system', {
      completedAt: now
    });
  }
  
  saveDatabase();
  
  return { success: true, role: role, isComplete: updatedApproval.client_approved_at && updatedApproval.sponsor_approved_at && updatedApproval.executive_approved_at };
}

function getApprovalStatus(submissionId) {
  const approval = getApprovalBySubmissionId(submissionId);
  if (!approval) return null;
  
  let approvedCount = 0;
  if (approval.client_approved_at) approvedCount++;
  if (approval.sponsor_approved_at) approvedCount++;
  if (approval.executive_approved_at) approvedCount++;
  
  return {
    ...approval,
    approvedCount,
    totalCount: 3,
    isComplete: approvedCount === 3,
    nextApprover: !approval.client_approved_at ? 'client' : 
                  !approval.sponsor_approved_at ? 'sponsor' : 
                  !approval.executive_approved_at ? 'executive' : null
  };
}

// ============================================================
// AUDIT LOG
// ============================================================
function addAuditLog(submissionId, action, actor, actorType = 'admin', details = {}) {
  const detailsJson = typeof details === 'string' ? details : JSON.stringify(details);
  run(`
    INSERT INTO submission_audit_log (submission_id, action, actor, actor_type, details)
    VALUES (?, ?, ?, ?, ?)
  `, [submissionId, action, actor, actorType, detailsJson]);
  saveDatabase();
}

function getAuditLog(submissionId) {
  const logs = all(`
    SELECT * FROM submission_audit_log 
    WHERE submission_id = ? 
    ORDER BY created_at DESC
  `, [submissionId]);
  
  return logs.map(log => {
    let details = {};
    try {
      details = log.details ? JSON.parse(log.details) : {};
    } catch (e) {}
    return {
      ...log,
      details
    };
  });
}

// ============================================================
// ATTACHMENTS
// ============================================================
function addSubmissionAttachment(submissionId, data) {
  const { fileName, fileUrl, description, addedBy, addedAt } = data;
  const id = run(`
    INSERT INTO attachments (submissionId, fileName, fileUrl, description, addedBy, addedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [submissionId, fileName, fileUrl, description || null, addedBy || 'admin', addedAt || new Date().toISOString()]);
  saveDatabase();
  return { id, submissionId, fileName, fileUrl, description, addedBy, addedAt };
}

function getSubmissionAttachments(submissionId) {
  return all(`SELECT * FROM attachments WHERE submissionId = ? ORDER BY addedAt DESC`, [submissionId]);
}

function deleteSubmissionAttachment(submissionId, attachmentId) {
  run(`DELETE FROM attachments WHERE id = ? AND submissionId = ?`, [attachmentId, submissionId]);
  saveDatabase();
}

// ============================================================
// FORMS
// ============================================================
function getAllForms() {
  return all(`SELECT * FROM forms WHERE is_active = 1 ORDER BY title`);
}

function getFormById(id) {
  return get(`SELECT * FROM forms WHERE id = ?`, [id]);
}

function getFormBySlug(slug) {
  return get(`SELECT * FROM forms WHERE slug = ?`, [slug]);
}

function createForm(data) {
  const { slug, title, description, markdownFile } = data;
  const id = run(`
    INSERT INTO forms (slug, title, description, markdown_file)
    VALUES (?, ?, ?, ?)
  `, [slug, title, description || null, markdownFile]);
  saveDatabase();
  return { id, slug };
}

function updateForm(id, data) {
  const { title, description, isActive } = data;
  run(`UPDATE forms SET title = ?, description = ?, is_active = ? WHERE id = ?`, 
    [title, description, isActive ? 1 : 0, id]);
  saveDatabase();
}

// ============================================================
// ADMINS
// ============================================================
function getAdminByEmail(email) {
  return get(`SELECT * FROM admins WHERE email = ?`, [email]);
}

function getAdminById(id) {
  return get(`SELECT * FROM admins WHERE id = ?`, [id]);
}

function updateAdminLastLogin(id) {
  run(`UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
  saveDatabase();
}

function verifyAdminPassword(email, password) {
  const admin = getAdminByEmail(email);
  if (!admin) return null;
  if (bcrypt.compareSync(password, admin.password)) {
    return admin;
  }
  return null;
}

module.exports = {
  initDatabase,
  saveDatabase,
  getDb,
  run,
  all,
  get,
  // Stats
  getStats,
  // Invites
  getAllInvites,
  getActiveInvites,
  getInviteByCode,
  getInviteById,
  createInvite,
  deleteInvite,
  revokeInvite,
  addFormToInvite,
  getInviteForms,
  markInviteAccessed,
  // Submissions
  getAllSubmissions,
  getRecentSubmissions,
  getSubmissionById,
  getSubmissionByInviteAndForm,
  createSubmission,
  updateSubmissionData,
  submitSubmission,
  deleteSubmission,
  // Validation
  updateSubmissionValidation,
  getSubmissionValidation,
  updateSubmissionValidationStatus,
  getSubmissionValidationStatus,
  getSubmissionFilteredFields,
  updateSubmissionUserValidation,
  getSubmissionUserValidation,
  updateSubmissionAdminComments,
  getSubmissionAdminComments,
  // Approval Workflow
  createApproval,
  getApprovalBySubmissionId,
  getApprovalByAccessCode,
  canApprove,
  submitApproval,
  getApprovalStatus,
  // Audit Log
  addAuditLog,
  getAuditLog,
  // Attachments
  addSubmissionAttachment,
  getSubmissionAttachments,
  deleteSubmissionAttachment,
  // Forms
  getAllForms,
  getFormById,
  getFormBySlug,
  createForm,
  updateForm,
  // Admins
  getAdminByEmail,
  getAdminById,
  updateAdminLastLogin,
  verifyAdminPassword
};