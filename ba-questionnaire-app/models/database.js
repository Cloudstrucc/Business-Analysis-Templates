const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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

  // Add validation_data column if it doesn't exist (migration)
  try {
    db.run(`ALTER TABLE submissions ADD COLUMN validation_data TEXT`);
  } catch (e) {
    // Column likely already exists
  }

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
  const { code, clientEmail, clientName, clientCompany, expiresAt, submissionDeadline, createdBy } = data;
  const id = run(`
    INSERT INTO invites (code, client_email, client_name, client_company, expires_at, submission_deadline, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [code, clientEmail, clientName, clientCompany || null, expiresAt, submissionDeadline || null, createdBy || null]);
  
  console.log('Created invite with ID:', id, 'Code:', code);
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
  console.log('Adding form', formId, 'to invite', inviteId);
  run(`INSERT OR IGNORE INTO invite_forms (invite_id, form_id) VALUES (?, ?)`, [inviteId, formId]);
  saveDatabase();
}

function getInviteForms(inviteId) {
  return all(`
    SELECT f.* FROM forms f
    JOIN invite_forms if ON f.id = if.form_id
    WHERE if.invite_id = ?
  `, [inviteId]);
}

function markInviteAccessed(code) {
  const now = new Date().toISOString();
  const invite = getInviteByCode(code);
  if (invite) {
    if (!invite.first_accessed_at) {
      run(`UPDATE invites SET first_accessed_at = ?, last_accessed_at = ? WHERE code = ?`, [now, now, code]);
    } else {
      run(`UPDATE invites SET last_accessed_at = ? WHERE code = ?`, [now, code]);
    }
    saveDatabase();
  }
}

// ============================================================
// SUBMISSIONS
// ============================================================
function getAllSubmissions() {
  return all(`
    SELECT s.*, 
           i.client_name as clientName, 
           i.client_email as clientEmail,
           i.client_company as companyName,
           i.code as inviteCode,
           f.title as formName,
           f.slug as formSlug
    FROM submissions s
    LEFT JOIN invites i ON s.invite_id = i.id
    LEFT JOIN forms f ON s.form_id = f.id
    ORDER BY COALESCE(s.submitted_at, s.updated_at) DESC
  `);
}

function getRecentSubmissions(limit = 5) {
  return all(`
    SELECT s.*, 
           i.client_name as clientName, 
           i.client_email as clientEmail,
           i.client_company as companyName,
           i.code as inviteCode,
           f.title as formName,
           f.slug as formSlug
    FROM submissions s
    LEFT JOIN invites i ON s.invite_id = i.id
    LEFT JOIN forms f ON s.form_id = f.id
    ORDER BY COALESCE(s.submitted_at, s.updated_at) DESC
    LIMIT ?
  `, [limit]);
}

function getSubmissionById(id) {
  return get(`
    SELECT s.*, 
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
    INSERT INTO submissions (invite_id, form_id, data, status, progress)
    VALUES (?, ?, ?, 'in_progress', 0)
  `, [inviteId, formId, typeof data === 'string' ? data : JSON.stringify(data)]);
  saveDatabase();
  return { id };
}

function updateSubmissionData(id, data, progress = null) {
  const dataJson = typeof data === 'string' ? data : JSON.stringify(data);
  if (progress !== null) {
    run(`UPDATE submissions SET data = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [dataJson, progress, id]);
  } else {
    run(`UPDATE submissions SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [dataJson, id]);
  }
  saveDatabase();
}

function submitSubmission(id) {
  run(`UPDATE submissions SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP, progress = 100 WHERE id = ?`, [id]);
  saveDatabase();
}

function deleteSubmission(id) {
  run(`DELETE FROM attachments WHERE submissionId = ?`, [id]);
  run(`DELETE FROM submissions WHERE id = ?`, [id]);
  saveDatabase();
}

// ============================================================
// VALIDATION (NEW)
// ============================================================
function updateSubmissionValidation(id, validationData) {
  const validationJson = typeof validationData === 'string' ? validationData : JSON.stringify(validationData);
  run(`UPDATE submissions SET validation_data = ? WHERE id = ?`, [validationJson, id]);
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

// Validation workflow status management
function updateSubmissionValidationStatus(id, validationStatus) {
  // Add validation_status column if it doesn't exist
  try {
    run(`ALTER TABLE submissions ADD COLUMN validation_status TEXT DEFAULT 'none'`);
  } catch (e) {
    // Column likely already exists
  }
  
  // Map validation status to main status
  let mainStatus = null;
  if (validationStatus === 'pending_user_validation') {
    mainStatus = 'waiting_for_validation';
  } else if (validationStatus === 'user_submitted') {
    mainStatus = 'submitted';
  }
  
  // Update both validation_status and optionally the main status
  if (mainStatus) {
    run(`UPDATE submissions SET validation_status = ?, status = ? WHERE id = ?`, [validationStatus, mainStatus, id]);
  } else {
    run(`UPDATE submissions SET validation_status = ? WHERE id = ?`, [validationStatus, id]);
  }
  saveDatabase();
}

function getSubmissionValidationStatus(id) {
  const submission = get(`SELECT validation_status FROM submissions WHERE id = ?`, [id]);
  return submission?.validation_status || 'none';
}

// User validation data (separate from admin validation)
function updateSubmissionUserValidation(id, userValidationData) {
  // Add user_validation_data column if it doesn't exist
  try {
    run(`ALTER TABLE submissions ADD COLUMN user_validation_data TEXT`);
  } catch (e) {
    // Column likely already exists
  }
  const validationJson = typeof userValidationData === 'string' ? userValidationData : JSON.stringify(userValidationData);
  // When user submits validation, set validation_status to user_submitted and status back to submitted
  run(`UPDATE submissions SET user_validation_data = ?, validation_status = 'user_submitted', status = 'submitted' WHERE id = ?`, [validationJson, id]);
  saveDatabase();
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
// ATTACHMENTS (NEW)
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
  // Validation (NEW)
  updateSubmissionValidation,
  getSubmissionValidation,
  updateSubmissionValidationStatus,
  getSubmissionValidationStatus,
  updateSubmissionUserValidation,
  getSubmissionUserValidation,
  // Attachments (NEW)
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