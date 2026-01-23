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

// Directories to ignore when scanning root
const IGNORED_DIRS = [
  'node_modules',
  '.git',
  'data',
  'public',
  'views',
  'routes',
  'utils',
  'models',
  'config',
  'middleware',
  'templates', // We handle templates separately
  'scripts',
  'test',
  'tests',
  'coverage',
  'dist',
  'build'
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
 * Looks for "This checklist" or similar intro text
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
    // Look for common intro patterns
    if (foundHeader && (
      line.toLowerCase().includes('this checklist') ||
      line.toLowerCase().includes('this document') ||
      line.toLowerCase().includes('this template') ||
      line.toLowerCase().includes('designed to help')
    )) {
      description = line.trim();
      break;
    }
  }
  
  return description.substring(0, 200);
}

/**
 * Check if markdown file looks like a form/checklist
 * (has tables with checkboxes or decision columns)
 */
function isFormTemplate(content) {
  // Must have at least one H1 title
  if (!content.match(/^#\s+.+$/m)) return false;
  
  // Should have tables with checkbox patterns or decision columns
  const hasCheckboxes = content.includes('☐') || content.includes('[ ]');
  const hasDecisionColumn = content.toLowerCase().includes('your decision') ||
                            content.toLowerCase().includes('your answer') ||
                            content.toLowerCase().includes('your choice');
  const hasTables = content.includes('|---|');
  
  return hasTables && (hasCheckboxes || hasDecisionColumn);
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
 * Scan a directory for markdown form files
 */
function scanDirectory(dir, isRoot = false) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    // Skip hidden files and directories
    if (entry.name.startsWith('.')) continue;
    
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      // Skip ignored files
      if (shouldIgnoreFile(entry.name)) continue;
      
      const filePath = path.join(dir, entry.name);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Only include if it looks like a form template
      if (isFormTemplate(content)) {
        files.push({
          filename: entry.name,
          filepath: filePath,
          relativePath: isRoot ? entry.name : `templates/${entry.name}`
        });
      }
    }
  }
  
  return files;
}

/**
 * Load a single markdown file into the database
 */
function loadForm(fileInfo, db) {
  const { run, get } = db || require('../models/database');
  
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
    // Update existing form
    run(`UPDATE forms SET title = ?, description = ?, markdown_file = ? WHERE slug = ?`,
      [title, description, fileInfo.relativePath, slug]);
    console.log(`  ↻ Updated: ${title}`);
    return { id: existing.id, action: 'updated', title, slug };
  } else {
    // Insert new form
    const id = run(`INSERT INTO forms (slug, title, description, markdown_file, is_active) VALUES (?, ?, ?, ?, 1)`,
      [slug, title, description, fileInfo.relativePath]);
    console.log(`  ✓ Added: ${title}`);
    return { id, action: 'added', title, slug };
  }
}

/**
 * Copy markdown file from root to templates directory
 */
function copyToTemplates(filepath, filename) {
  const destPath = path.join(TEMPLATES_DIR, filename);
  
  // Create templates dir if needed
  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }
  
  // Copy file
  fs.copyFileSync(filepath, destPath);
  console.log(`  → Copied to templates/: ${filename}`);
  
  return destPath;
}

/**
 * Load all markdown files from both root and templates directories
 * Auto-discovers new forms added to the root folder
 */
function loadAllForms(options = {}) {
  const { copyToTemplatesDir = true, verbose = true } = options;
  
  // Lazy load database to avoid circular dependency
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
    if (verbose) console.log('Created templates/ directory\n');
  }
  
  // 1. Scan root directory for new MD files
  if (verbose) console.log('📂 Scanning root directory...');
  const rootFiles = scanDirectory(ROOT_DIR, true);
  
  if (rootFiles.length > 0) {
    if (verbose) console.log(`   Found ${rootFiles.length} form template(s) in root\n`);
    
    for (const file of rootFiles) {
      if (copyToTemplatesDir) {
        // Copy to templates directory
        const newPath = copyToTemplates(file.filepath, file.filename);
        file.filepath = newPath;
        file.relativePath = file.filename;
      }
      
      const result = loadForm(file, db);
      if (result) {
        if (result.action === 'added') results.added.push(result);
        else results.updated.push(result);
      }
    }
  } else {
    if (verbose) console.log('   No new templates found in root\n');
  }
  
  // 2. Scan templates directory
  if (verbose) console.log('📂 Scanning templates/ directory...');
  const templateFiles = scanDirectory(TEMPLATES_DIR, false);
  
  if (templateFiles.length > 0) {
    if (verbose) console.log(`   Found ${templateFiles.length} template(s)\n`);
    
    for (const file of templateFiles) {
      // Skip if we already processed this file from root
      const alreadyProcessed = rootFiles.some(rf => rf.filename === file.filename);
      if (alreadyProcessed) {
        if (verbose) console.log(`  ⊘ Skipped (already processed): ${file.filename}`);
        results.skipped.push({ filename: file.filename, reason: 'already processed' });
        continue;
      }
      
      const result = loadForm(file, db);
      if (result) {
        if (result.action === 'added') results.added.push(result);
        else results.updated.push(result);
      }
    }
  } else {
    if (verbose) console.log('   No templates found\n');
  }
  
  // Summary
  if (verbose) {
    console.log('\n──────────────────────────────────────────────────────────');
    console.log('SUMMARY:');
    console.log(`  ✓ Added:   ${results.added.length} form(s)`);
    console.log(`  ↻ Updated: ${results.updated.length} form(s)`);
    console.log(`  ⊘ Skipped: ${results.skipped.length} file(s)`);
    if (results.errors.length > 0) {
      console.log(`  ✗ Errors:  ${results.errors.length}`);
    }
    console.log('──────────────────────────────────────────────────────────\n');
  }
  
  // Save database
  db.saveDatabase();
  
  return results;
}

/**
 * Watch for new files (development mode)
 */
function watchForNewForms(callback) {
  console.log('👁️  Watching for new form templates...');
  console.log('   Add .md files to root or templates/ directory\n');
  
  // Simple polling-based watcher (no external deps)
  let lastFiles = new Set();
  
  const scan = () => {
    const rootFiles = scanDirectory(ROOT_DIR, true);
    const templateFiles = scanDirectory(TEMPLATES_DIR, false);
    const allFiles = [...rootFiles, ...templateFiles].map(f => f.filepath);
    const currentFiles = new Set(allFiles);
    
    // Check for new files
    for (const file of currentFiles) {
      if (!lastFiles.has(file)) {
        console.log(`\n📄 New/changed file detected: ${path.basename(file)}`);
        const results = loadAllForms({ verbose: true });
        if (callback) callback(results);
        break;
      }
    }
    
    lastFiles = currentFiles;
  };
  
  // Initial scan
  scan();
  
  // Poll every 2 seconds
  const interval = setInterval(scan, 2000);
  
  return {
    stop: () => clearInterval(interval)
  };
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

// CLI support - run directly with: node utils/formLoader.js
if (require.main === module) {
  const { initDatabase } = require('../models/database');
  
  initDatabase().then(() => {
    const args = process.argv.slice(2);
    
    if (args.includes('--watch') || args.includes('-w')) {
      // Watch mode
      loadAllForms();
      watchForNewForms();
    } else if (args.includes('--stats') || args.includes('-s')) {
      // Show stats
      const stats = getFormStats();
      console.log('\nForm Statistics:');
      console.log(`  Total: ${stats.total}`);
      console.log(`  Active: ${stats.active}\n`);
      console.log('Forms:');
      stats.forms.forEach(f => {
        console.log(`  ${f.is_active ? '✓' : '✗'} ${f.title} (${f.slug})`);
      });
    } else {
      // Default: load all forms
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
  watchForNewForms,
  scanDirectory,
  isFormTemplate,
  TEMPLATES_DIR,
  ROOT_DIR
};
