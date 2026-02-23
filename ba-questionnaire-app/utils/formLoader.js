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

// In-memory form storage
let loadedForms = new Map();

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
                            content.toLowerCase().includes('your choice') ||
                            content.toLowerCase().includes('your response');
  // More flexible table detection - look for pipe characters with dashes
  const hasTables = /\|[-:]+\|/.test(content) || content.includes('|---|');
  
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
          // Store just the filename for templates dir, full relative path for root
          relativePath: isRoot ? entry.name : entry.name
        });
      }
    }
  }
  
  return files;
}

/**
 * Load a single markdown file into memory
 */
function loadForm(fileInfo) {
  if (!fs.existsSync(fileInfo.filepath)) {
    console.error(`  ✗ File not found: ${fileInfo.filepath}`);
    return null;
  }

  const content = fs.readFileSync(fileInfo.filepath, 'utf8');
  const title = extractTitle(content);
  const description = extractDescription(content);
  const slug = generateSlug(fileInfo.filename);

  const form = {
    id: slug, // Use slug as ID
    slug,
    title,
    description,
    filename: fileInfo.filename,
    filepath: fileInfo.filepath,
    relativePath: fileInfo.relativePath,
    content,
    isActive: true,
    loadedAt: new Date().toISOString()
  };

  // Check if form already exists in memory
  const existing = loadedForms.get(slug);
  
  if (existing) {
    loadedForms.set(slug, form);
    console.log(`  ↻ Updated: ${title}`);
    return { id: slug, action: 'updated', title, slug };
  } else {
    loadedForms.set(slug, form);
    console.log(`  ✓ Added: ${title}`);
    return { id: slug, action: 'added', title, slug };
  }
}

/**
 * Copy markdown file from root to templates directory
 */
function copyToTemplates(fileInfo) {
  const destPath = path.join(TEMPLATES_DIR, fileInfo.filename);
  
  // Create templates directory if it doesn't exist
  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }
  
  // Only copy if destination doesn't exist or source is newer
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(fileInfo.filepath, destPath);
    console.log(`  → Copied to templates: ${fileInfo.filename}`);
    return true;
  }
  
  const srcStat = fs.statSync(fileInfo.filepath);
  const destStat = fs.statSync(destPath);
  
  if (srcStat.mtime > destStat.mtime) {
    fs.copyFileSync(fileInfo.filepath, destPath);
    console.log(`  → Updated in templates: ${fileInfo.filename}`);
    return true;
  }
  
  return false;
}

/**
 * Load all forms from filesystem
 */
function loadAllForms() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           FORM TEMPLATE AUTO-DISCOVERY                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  const results = { added: 0, updated: 0, errors: 0 };
  
  // First, scan root directory for any MD files and copy to templates
  console.log('📂 Scanning root directory...');
  const rootFiles = scanDirectory(ROOT_DIR, true);
  
  if (rootFiles.length > 0) {
    for (const file of rootFiles) {
      copyToTemplates(file);
    }
    console.log(`   Processed ${rootFiles.length} file(s) from root`);
  } else {
    console.log('   No new templates found in root');
  }
  
  // Then, load all templates from templates directory
  console.log('📂 Scanning templates/ directory...');
  const templateFiles = scanDirectory(TEMPLATES_DIR);
  console.log(`   Found ${templateFiles.length} template(s)`);
  
  for (const file of templateFiles) {
    try {
      const result = loadForm(file);
      if (result) {
        if (result.action === 'added') results.added++;
        else if (result.action === 'updated') results.updated++;
      }
    } catch (error) {
      console.error(`  ✗ Error loading ${file.filename}: ${error.message}`);
      results.errors++;
    }
  }
  
  console.log('');
  console.log(`📊 Summary: ${results.added} added, ${results.updated} updated, ${results.errors} errors`);
  console.log(`   Total forms available: ${loadedForms.size}`);
  console.log('');
  
  return results;
}

/**
 * Get all loaded forms
 */
function getAllForms() {
  return Array.from(loadedForms.values()).filter(f => f.isActive);
}

/**
 * Get a single form by slug
 */
function getFormBySlug(slug) {
  return loadedForms.get(slug) || null;
}

/**
 * Get form content (markdown) by slug
 */
function getFormContent(slug) {
  const form = loadedForms.get(slug);
  if (!form) return null;
  
  // Re-read from disk to get latest content
  if (fs.existsSync(form.filepath)) {
    return fs.readFileSync(form.filepath, 'utf8');
  }
  
  return form.content;
}

/**
 * Reload all forms (useful for admin refresh)
 */
function reloadForms() {
  loadedForms.clear();
  return loadAllForms();
}

/**
 * Get form count
 */
function getFormCount() {
  return loadedForms.size;
}

/**
 * Check if a form exists
 */
function formExists(slug) {
  return loadedForms.has(slug);
}

module.exports = {
  loadAllForms,
  loadForm,
  getAllForms,
  getFormBySlug,
  getFormContent,
  reloadForms,
  getFormCount,
  formExists,
  extractTitle,
  extractDescription,
  generateSlug,
  isFormTemplate,
  // For backward compatibility
  loadForms: loadAllForms,
  getForms: getAllForms
};