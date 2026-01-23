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
    console.log('Database loaded from file');
  } else {
    db = new SQL.Database();
    console.log('New database created');
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

  // Create default admin if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cloudstrucc.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  
  const existingAdmin = get(`SELECT id FROM admins WHERE email = ?`, [adminEmail]);
  if (!existingAdmin) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    run(`INSERT INTO admins (email, password, name) VALUES (?, ?, ?)`, 
      [adminEmail, hashedPassword, 'Administrator']);
    console.log('Default admin created:', adminEmail);
  }

  // Save database
  saveDatabase();
  console.log('Database initialized');

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

// Helper to run parameterized queries (INSERT, UPDATE, DELETE)
function run(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    
    // Get the last inserted row ID
    const result = db.exec('SELECT last_insert_rowid() as id');
    const lastId = result[0]?.values[0]?.[0] || 0;
    
    // Auto-save after write operations
    saveDatabase();
    
    return lastId;
  } catch (error) {
    console.error('Database run error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// Helper to get all rows
function all(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row);
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Database all error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// Helper to get single row
function get(sql, params = []) {
  const results = all(sql, params);
  return results.length > 0 ? results[0] : null;
}

module.exports = {
  initDatabase,
  saveDatabase,
  getDb,
  run,
  all,
  get
};