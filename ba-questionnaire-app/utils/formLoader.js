const fs = require('fs');
const path = require('path');
const { run, get, all } = require('../models/database');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

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
  // Look for text after the header info but before first section
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
    if (foundHeader && line.startsWith('This checklist')) {
      description = line.trim();
      break;
    }
  }
  
  return description.substring(0, 200);
}

/**
 * Generate URL-friendly slug from filename
 */
function generateSlug(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Load a single markdown file into the database
 */
function loadForm(filename) {
  const filePath = path.join(TEMPLATES_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const title = extractTitle(content);
  const description = extractDescription(content);
  const slug = generateSlug(filename);

  // Check if form already exists
  const existing = get(`SELECT id FROM forms WHERE slug = ?`, [slug]);
  
  if (existing) {
    // Update existing form
    run(`UPDATE forms SET title = ?, description = ?, markdown_file = ? WHERE slug = ?`,
      [title, description, filename, slug]);
    console.log(`Updated form: ${title} (${slug})`);
    return existing.id;
  } else {
    // Insert new form
    const id = run(`INSERT INTO forms (slug, title, description, markdown_file) VALUES (?, ?, ?, ?)`,
      [slug, title, description, filename]);
    console.log(`Added form: ${title} (${slug})`);
    return id;
  }
}

/**
 * Load all markdown files from templates directory
 */
function loadAllForms() {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
    console.log('Created templates directory');
    return [];
  }

  const files = fs.readdirSync(TEMPLATES_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md');

  console.log(`Found ${files.length} template files`);

  const loaded = [];
  for (const file of files) {
    const id = loadForm(file);
    if (id) loaded.push({ file, id });
  }

  console.log(`Loaded ${loaded.length} forms into database`);
  return loaded;
}

/**
 * Get all forms from database
 */
function getAllForms() {
  return all(`SELECT * FROM forms WHERE is_active = 1 ORDER BY title`);
}

module.exports = {
  loadForm,
  loadAllForms,
  getAllForms,
  TEMPLATES_DIR
};
