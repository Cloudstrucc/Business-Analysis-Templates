require('dotenv').config();

const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const { initDatabase } = require('./models/database');
const { passport, initializePassport } = require('./config/passport');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const formLoader = require('./utils/formLoader');
const emailService = require('./utils/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database and load forms
async function initialize() {
  try {
    await initDatabase();
    console.log('Database initialized');
    
    // Load forms from templates
    formLoader.loadAllForms();
    
    // Initialize email service
    emailService.initialize();
    
    console.log('Application initialized successfully');
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

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
  const intervalMs = intervalHours * 60 * 60 * 1000;

  setInterval(async () => {
    try {
      const { all, get } = require('./models/database');
      
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
        const { run } = require('./models/database');
        run(`INSERT INTO analytics_sent (sent_at) VALUES (CURRENT_TIMESTAMP)`);

        console.log('Analytics digest sent');
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
