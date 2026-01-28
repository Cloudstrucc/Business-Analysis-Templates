require('dotenv').config();

const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const { initDatabase } = require('./models/database');
const { passport, initializePassport } = require('./config/passport');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const formLoader = require('./utils/formLoader');
const emailService = require('./utils/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Track loaded files to detect new ones
let loadedTemplates = new Set();

// Scan for .md files and copy to templates
function scanAndCopyRootTemplates() {
  const templatesDir = path.join(__dirname, 'templates');
  const rootDir = __dirname;
  const questionnairesDir = path.join(__dirname, '..', 'Questionnaires'); // Parent folder's Questionnaires dir
  
  // Ensure templates directory exists
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }
  
  // Files to ignore
  const ignoredFiles = [
    'readme.md', 'readme', 'license.md', 'license',
    'changelog.md', 'contributing.md', 'build_guide.md',
    'build-guide.md', 'code_of_conduct.md', 'security.md'
  ];
  
  let newFilesFound = 0;
  
  // Function to scan a directory for MD files
  const scanDir = (dir, dirName) => {
    if (!fs.existsSync(dir)) {
      return 0;
    }
    
    console.log(`\n📂 Scanning ${dirName} for templates...`);
    let found = 0;
    
    fs.readdirSync(dir).forEach(filename => {
      // Only .md files
      if (!filename.toLowerCase().endsWith('.md')) return;
      
      // Skip ignored files
      if (ignoredFiles.includes(filename.toLowerCase())) return;
      
      // Skip if it's a directory
      const filePath = path.join(dir, filename);
      if (!fs.statSync(filePath).isFile()) return;
      
      // Check if already in templates
      const templatePath = path.join(templatesDir, filename);
      if (!fs.existsSync(templatePath)) {
        // Copy to templates directory
        console.log(`   → Found new template: ${filename}`);
        fs.copyFileSync(filePath, templatePath);
        found++;
      }
    });
    
    return found;
  };
  
  // Scan Questionnaires folder first (preferred location)
  newFilesFound += scanDir(questionnairesDir, 'Questionnaires folder');
  
  // Also scan root directory for backwards compatibility
  newFilesFound += scanDir(rootDir, 'root directory');
  
  if (newFilesFound > 0) {
    console.log(`\n   ✓ Copied ${newFilesFound} new template(s) to templates/\n`);
  } else {
    console.log('\n   No new templates found\n');
  }
  
  return newFilesFound;
}

// Get current template files for watching
function getCurrentTemplateFiles() {
  const templatesDir = path.join(__dirname, 'templates');
  const rootDir = __dirname;
  const questionnairesDir = path.join(__dirname, '..', 'Questionnaires');
  const files = new Set();
  
  const ignoredFiles = [
    'readme.md', 'readme', 'license.md', 'license',
    'changelog.md', 'contributing.md', 'build_guide.md',
    'build-guide.md', 'code_of_conduct.md', 'security.md'
  ];
  
  // Check templates directory
  if (fs.existsSync(templatesDir)) {
    fs.readdirSync(templatesDir).forEach(f => {
      if (f.toLowerCase().endsWith('.md') && !ignoredFiles.includes(f.toLowerCase())) {
        files.add(path.join(templatesDir, f));
      }
    });
  }
  
  // Check Questionnaires directory
  if (fs.existsSync(questionnairesDir)) {
    fs.readdirSync(questionnairesDir).forEach(f => {
      if (f.toLowerCase().endsWith('.md') && !ignoredFiles.includes(f.toLowerCase())) {
        const fullPath = path.join(questionnairesDir, f);
        if (fs.statSync(fullPath).isFile()) {
          files.add(fullPath);
        }
      }
    });
  }
  
  // Check root directory
  fs.readdirSync(rootDir).forEach(f => {
    if (f.toLowerCase().endsWith('.md') && !ignoredFiles.includes(f.toLowerCase())) {
      const fullPath = path.join(rootDir, f);
      if (fs.statSync(fullPath).isFile()) {
        files.add(fullPath);
      }
    }
  });
  
  return files;
}

// Watch for new template files (runs after initial load)
function watchForNewTemplates() {
  // Get initial state
  loadedTemplates = getCurrentTemplateFiles();
  
  // Poll for changes every 5 seconds
  setInterval(() => {
    const currentFiles = getCurrentTemplateFiles();
    
    // Check for new files
    for (const file of currentFiles) {
      if (!loadedTemplates.has(file)) {
        console.log(`\n📄 New template detected: ${path.basename(file)}`);
        
        // Copy to templates if in root
        const templatesDir = path.join(__dirname, 'templates');
        const filename = path.basename(file);
        const templatePath = path.join(templatesDir, filename);
        
        if (!file.includes('/templates/') && !fs.existsSync(templatePath)) {
          fs.copyFileSync(file, templatePath);
          console.log(`   → Copied to templates/`);
        }
        
        // Reload all forms
        console.log('   Reloading forms...\n');
        formLoader.loadAllForms({ verbose: true });
        loadedTemplates = getCurrentTemplateFiles();
        break;
      }
    }
  }, 5000);
  
  console.log('👁️  Watching for new form templates (polling every 5s)...\n');
}

// Initialize database and load forms
async function initialize() {
  try {
    await initDatabase();
    
    // STEP 1: Scan root directory and copy any new .md files to templates/
    scanAndCopyRootTemplates();
    
    // STEP 2: Load all forms from templates directory into database
    formLoader.loadAllForms({ verbose: true });
    
    // STEP 3: Initialize email service
    emailService.initialize();
    
    // STEP 4: Start watching for new templates
    watchForNewTemplates();
    
    console.log('✅ Application initialized successfully\n');
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
}

// Handlebars setup with helpers
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    // Equality helper
    eq: function(a, b) {
      return a === b;
    },
    // Not equal helper
    neq: function(a, b) {
      return a !== b;
    },
    // Greater than helper
    gt: function(a, b) {
      return a > b;
    },
    // Less than helper
    lt: function(a, b) {
      return a < b;
    },
    // JSON stringify helper
    json: function(obj) {
      return JSON.stringify(obj);
    },
    // Substring helper
    substring: function(str, start, end) {
      if (!str) return '';
      return str.toString().substring(start, end);
    },
    // Uppercase helper
    uppercase: function(str) {
      if (!str) return '';
      return str.toString().toUpperCase();
    },
    // Format date helper
    formatDate: function(date, format) {
      if (!date) return '';
      const d = new Date(date);
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return d.toLocaleDateString('en-US', options);
    },
    // Current year helper
    currentYear: function() {
      return new Date().getFullYear();
    },
    // Increment helper
    inc: function(value) {
      return parseInt(value) + 1;
    },
    // Conditional helper
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for Bootstrap CDN
  crossOriginEmbedderPolicy: false
}));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Trust proxy (required for Azure App Service behind load balancer)
app.set('trust proxy', 1);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Works with trust proxy
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax' // Helps with redirects
  }
}));

// Passport authentication
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global template variables
app.use((req, res, next) => {
  res.locals.currentYear = new Date().getFullYear();
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error'),
    warning: req.flash('warning'),
    info: req.flash('info')
  };
  res.locals.user = req.user;
  next();
});

// Routes
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    showAccessForm: true
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.',
    showAccessForm: false
  });
});

// Analytics scheduler (runs every ANALYTICS_INTERVAL_HOURS)
function scheduleAnalytics() {
  const intervalHours = parseInt(process.env.ANALYTICS_INTERVAL_HOURS || '72');

  setInterval(async () => {
    try {
      const { all, get, run } = require('./models/database');
      
      // Check if we should send analytics
      const lastSent = get(`SELECT sent_at FROM analytics_sent ORDER BY sent_at DESC LIMIT 1`);
      const lastSentDate = lastSent ? new Date(lastSent.sent_at) : new Date(0);
      const hoursSinceLastSent = (Date.now() - lastSentDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastSent >= intervalHours) {
        // Gather analytics data
        const totalInvites = get(`SELECT COUNT(*) as count FROM invites WHERE is_revoked = 0 AND expires_at > datetime('now')`)?.count || 0;
        const inProgress = get(`SELECT COUNT(DISTINCT invite_id) as count FROM submissions WHERE status = 'in_progress'`)?.count || 0;
        const completedThisPeriod = get(`SELECT COUNT(*) as count FROM submissions WHERE status = 'submitted' AND submitted_at > datetime('now', '-3 days')`)?.count || 0;
        const expiringSoon = get(`SELECT COUNT(*) as count FROM invites WHERE is_revoked = 0 AND expires_at > datetime('now') AND expires_at < datetime('now', '+7 days')`)?.count || 0;

        const activeInvites = all(`
          SELECT i.*, 
            (SELECT COUNT(*) FROM invite_forms WHERE invite_id = i.id) as form_count,
            COALESCE((SELECT MAX(progress) FROM submissions WHERE invite_id = i.id), 0) as progress
          FROM invites i
          WHERE i.is_revoked = 0 AND i.expires_at > datetime('now')
          ORDER BY i.last_accessed_at DESC
          LIMIT 20
        `);

        const recentSubmissions = all(`
          SELECT s.*, i.client_name, f.title as form_title
          FROM submissions s
          JOIN invites i ON s.invite_id = i.id
          JOIN forms f ON s.form_id = f.id
          WHERE s.status = 'submitted' AND s.submitted_at > datetime('now', '-3 days')
          ORDER BY s.submitted_at DESC
          LIMIT 10
        `);

        // Send analytics email
        await emailService.sendAnalyticsDigest({
          totalInvites,
          inProgress,
          completedThisPeriod,
          expiringSoon,
          activeInvites,
          recentSubmissions
        });

        // Record that we sent analytics
        run(`INSERT INTO analytics_sent (sent_at) VALUES (CURRENT_TIMESTAMP)`);

        console.log('📊 Analytics digest sent');
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }, 60 * 60 * 1000); // Check every hour
}

// Start server
initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   Cloudstrucc BA Questionnaire Portal                      ║
║                                                            ║
║   Server running on http://localhost:${PORT}                  ║
║                                                            ║
║   Public Portal:  http://localhost:${PORT}                    ║
║   Admin Login:    http://localhost:${PORT}/admin/login        ║
║                                                            ║
║   ► Drop .md files in root folder - auto-detected!         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
    
    // Start analytics scheduler
    scheduleAnalytics();
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;