const fs = require('fs');
const path = require('path');

// Support both templates dir and root directory for MD files
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const ROOT_DIR = path.join(__dirname, '..');

// Files to ignore when scanning for forms (case-insensitive)
const IGNORED_FILES = [
  'readme.md',
  'readme',
  'license.md',
  'license',
  'changelog.md',
  'changelog',
  'contributing.md',
  'contributing',
  'build_guide.md',
  'build-guide.md',
  'code_of_conduct.md',
  'code-of-conduct.md',
  'security.md',
  'support.md'
];

/**
 * Check if a file should be ignored
 */
function shouldIgnoreFile(filename) {
  const lower = filename.toLowerCase();
  return IGNORED_FILES.includes(lower) || 
         IGNORED_FILES.includes(lower.replace('.md', ''));
}

/**
 * Extract title from markdown content
 */
function extractTitle(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled Form';
}

/**
 * Extract description from markdown content
 */
function extractDescription(content) {
  const lines = content.split('\n');
  let foundHeader = false;
  let description = '';
  
  for (const line of lines) {
    if (line.startsWith('# ')) {
      foundHeader = true;
      continue;
    }
    if (foundHeader && line.startsWith('## ')) {
      break;
    }
    if (foundHeader && line.trim().length > 20 && !line.startsWith('*') && !line.startsWith('|')) {
      description = line.trim();
      break;
    }
  }
  
  return description.substring(0, 200);
}

/**
 * Check if markdown file looks like a form/checklist
 * SIMPLIFIED - just check for tables and title
 */
function isFormTemplate(content) {
  // Must have at least one H1 title
  const hasTitle = /^#\s+.+/m.test(content);
  
  // Should have markdown tables
  const hasTables = content.includes('|') && (content.includes('|---') || content.includes('| ---') || content.includes('---|'));
  
  console.log(`    Validation: hasTitle=${hasTitle}, hasTables=${hasTables}`);
  
  return hasTitle && hasTables;
}

/**
 * Generate URL-friendly slug from filename
 */
function generateSlug(filename) {
  return filename
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Scan a directory for markdown files
 */
function scanDirectory(dir, isRoot = false) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.log(`   Directory does not exist: ${dir}`);
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip hidden files
    if (entry.name.startsWith('.')) continue;
    
    // Skip directories
    if (!entry.isFile()) continue;
    
    // Only .md files
    if (!entry.name.toLowerCase().endsWith('.md')) continue;
    
    // Skip ignored files
    if (shouldIgnoreFile(entry.name)) {
      console.log(`   Skipping ignored file: ${entry.name}`);
      continue;
    }
    
    const filePath = path.join(dir, entry.name);
    console.log(`   Checking file: ${entry.name}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it looks like a form
    if (isFormTemplate(content)) {
      files.push({
        filename: entry.name,
        filepath: filePath,
        relativePath: entry.name
      });
      console.log(`   ✓ Valid form template: ${entry.name}`);
    } else {
      console.log(`   ✗ Not a form template: ${entry.name}`);
    }
  }
  
  return files;
}

/**
 * Load a single markdown file into the database
 */
function loadForm(fileInfo, db) {
  const { run, get } = db;
  
  if (!fs.existsSync(fileInfo.filepath)) {
    console.error(`  ✗ File not found: ${fileInfo.filepath}`);
    return null;
  }

  const content = fs.readFileSync(fileInfo.filepath, 'utf8');
  const title = extractTitle(content);
  const description = extractDescription(content);
  const slug = generateSlug(fileInfo.filename);

  // Check if form already exists
  const existing = get(`SELECT id, title FROM forms WHERE slug = ?`, [slug]);
  
  if (existing) {
    run(`UPDATE forms SET title = ?, description = ?, markdown_file = ? WHERE slug = ?`,
      [title, description, fileInfo.relativePath, slug]);
    console.log(`  ↻ Updated: ${title}`);
    return { id: existing.id, action: 'updated', title, slug };
  } else {
    const id = run(`INSERT INTO forms (slug, title, description, markdown_file, is_active) VALUES (?, ?, ?, ?, 1)`,
      [slug, title, description, fileInfo.relativePath]);
    console.log(`  ✓ Added: ${title}`);
    return { id, action: 'added', title, slug };
  }
}

/**
 * Load all markdown files from templates directory
 */
function loadAllForms(options = {}) {
  const { verbose = true } = options;
  
  const db = require('../models/database');
  
  if (verbose) {
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║           FORM TEMPLATE AUTO-DISCOVERY                   ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');
  }
  
  const results = {
    added: [],
    updated: [],
    skipped: [],
    errors: []
  };
  
  // Ensure templates directory exists
  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
    console.log('Created templates/ directory\n');
  }
  
  // First try templates directory
  console.log('📂 Scanning templates/ directory...');
  console.log(`   Path: ${TEMPLATES_DIR}`);
  let templateFiles = scanDirectory(TEMPLATES_DIR, false);
  
  // If no templates found, try root directory
  if (templateFiles.length === 0) {
    console.log('\n📂 No templates in templates/, scanning root directory...');
    console.log(`   Path: ${ROOT_DIR}`);
    templateFiles = scanDirectory(ROOT_DIR, true);
    
    // Copy found files to templates directory
    if (templateFiles.length > 0) {
      console.log('\n   Copying found templates to templates/ directory...');
      for (const file of templateFiles) {
        const destPath = path.join(TEMPLATES_DIR, file.filename);
        fs.copyFileSync(file.filepath, destPath);
        file.filepath = destPath;
        console.log(`   → Copied: ${file.filename}`);
      }
    }
  }
  
  console.log(`\n   Found ${templateFiles.length} form template(s)\n`);
  
  // Load each form into database
  for (const file of templateFiles) {
    const result = loadForm(file, db);
    if (result) {
      if (result.action === 'added') results.added.push(result);
      else results.updated.push(result);
    }
  }
  
  // Summary
  console.log('\n──────────────────────────────────────────────────────────');
  console.log('SUMMARY:');
  console.log(`  ✓ Added:   ${results.added.length} form(s)`);
  console.log(`  ↻ Updated: ${results.updated.length} form(s)`);
  console.log(`  ⊘ Skipped: ${results.skipped.length} file(s)`);
  if (results.errors.length > 0) {
    console.log(`  ✗ Errors:  ${results.errors.length}`);
  }
  console.log('──────────────────────────────────────────────────────────\n');
  
  // Save database
  db.saveDatabase();
  
  return results;
}

/**
 * Get all active forms from database
 */
function getAllForms() {
  const { all } = require('../models/database');
  return all(`SELECT * FROM forms WHERE is_active = 1 ORDER BY title`);
}

/**
 * Get form statistics
 */
function getFormStats() {
  const { get, all } = require('../models/database');
  
  const total = get(`SELECT COUNT(*) as count FROM forms`)?.count || 0;
  const active = get(`SELECT COUNT(*) as count FROM forms WHERE is_active = 1`)?.count || 0;
  const forms = all(`SELECT slug, title, is_active, created_at FROM forms ORDER BY title`);
  
  return { total, active, forms };
}

// CLI support
if (require.main === module) {
  const { initDatabase } = require('../models/database');
  
  initDatabase().then(() => {
    const args = process.argv.slice(2);
    
    if (args.includes('--stats') || args.includes('-s')) {
      const stats = getFormStats();
      console.log('\nForm Statistics:');
      console.log(`  Total: ${stats.total}`);
      console.log(`  Active: ${stats.active}\n`);
      console.log('Forms:');
      stats.forms.forEach(f => {
        console.log(`  ${f.is_active ? '✓' : '✗'} ${f.title} (${f.slug})`);
      });
    } else {
      loadAllForms();
    }
  }).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = {
  loadForm,
  loadAllForms,
  getAllForms,
  getFormStats,
  scanDirectory,
  isFormTemplate,
  TEMPLATES_DIR,
  ROOT_DIR
};