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
const validationRoutes = require('./routes/validation');
const approvalRoutes = require('./routes/approval');
const app = express();
const PORT = process.env.PORT || 3000;
   
// Initialize database and load forms
async function initialize() {
  try {
    await initDatabase();
    console.log('Database initialized');
    
    formLoader.loadAllForms();
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
    // =====================================================
    // COMPARISON HELPERS
    // =====================================================
    eq: function(a, b, options) {
      if (options && options.fn) {
        return a === b ? options.fn(this) : options.inverse(this);
      }
      return a === b;
    },
    neq: function(a, b, options) {
      if (options && options.fn) {
        return a !== b ? options.fn(this) : options.inverse(this);
      }
      return a !== b;
    },
    gt: function(a, b, options) {
      if (options && options.fn) {
        return a > b ? options.fn(this) : options.inverse(this);
      }
      return a > b;
    },
    gte: function(a, b, options) {
      if (options && options.fn) {
        return a >= b ? options.fn(this) : options.inverse(this);
      }
      return a >= b;
    },
    lt: function(a, b, options) {
      if (options && options.fn) {
        return a < b ? options.fn(this) : options.inverse(this);
      }
      return a < b;
    },
    lte: function(a, b, options) {
      if (options && options.fn) {
        return a <= b ? options.fn(this) : options.inverse(this);
      }
      return a <= b;
    },
    
    // =====================================================
    // LOGICAL HELPERS
    // =====================================================
    and: function(...args) {
      args.pop();
      return args.every(Boolean);
    },
    or: function(...args) {
      args.pop();
      return args.some(Boolean);
    },
    not: function(value) {
      return !value;
    },
    
    // =====================================================
    // MATH HELPERS
    // =====================================================
    math: function(a, operator, b) {
      a = parseFloat(a) || 0;
      b = parseFloat(b) || 0;
      switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b !== 0 ? a / b : 0;
        case '%': return a % b;
        default: return a;
      }
    },
    inc: function(value) {
      return parseInt(value) + 1;
    },
    dec: function(value) {
      return parseInt(value) - 1;
    },
    percentage: function(value, total) {
      value = parseFloat(value) || 0;
      total = parseFloat(total) || 0;
      if (total === 0) return 0;
      return Math.round((value / total) * 100);
    },
    
    // =====================================================
    // ARRAY/RANGE HELPERS
    // =====================================================
    range: function(start, end) {
      const result = [];
      start = parseInt(start) || 0;
      end = parseInt(end) || 0;
      if (Math.abs(end - start) > 100) end = start + 100;
      if (start <= end) {
        for (let i = start; i <= end; i++) result.push(i);
      } else {
        for (let i = start; i >= end; i--) result.push(i);
      }
      return result;
    },
    includes: function(array, value) {
      if (!Array.isArray(array)) return false;
      return array.includes(value);
    },
    length: function(array) {
      if (!array) return 0;
      return array.length || 0;
    },
    
    // =====================================================
    // STRING HELPERS
    // =====================================================
    slugify: function(str) {
      if (!str) return '';
      return String(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    },
    truncate: function(str, length) {
      if (!str) return '';
      str = String(str);
      length = parseInt(length) || 50;
      if (str.length <= length) return str;
      return str.substring(0, length) + '...';
    },
    lowercase: function(str) {
      if (!str) return '';
      return String(str).toLowerCase();
    },
    uppercase: function(str) {
      if (!str) return '';
      return String(str).toUpperCase();
    },
    capitalize: function(str) {
      if (!str) return '';
      str = String(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // =====================================================
    // JSON HELPERS
    // =====================================================
    json: function(obj) {
      return JSON.stringify(obj || {});
    },
    jsonPretty: function(obj) {
      return JSON.stringify(obj || {}, null, 2);
    },
    
    // =====================================================
    // NUMBER FORMATTING
    // =====================================================
    formatNumber: function(num) {
      if (num === null || num === undefined) return '0';
      return Number(num).toLocaleString();
    },
    
    // =====================================================
    // DEFAULT/FALLBACK
    // =====================================================
    default: function(value, defaultValue) {
      return value || defaultValue;
    },
    coalesce: function(...args) {
      args.pop();
      for (const arg of args) {
        if (arg) return arg;
      }
      return '';
    },
    
    // =====================================================
    // CONDITIONAL BLOCK HELPERS
    // =====================================================
    ifEq: function(a, b, options) {
      if (a === b) return options.fn(this);
      return options.inverse(this);
    },
    ifNeq: function(a, b, options) {
      if (a !== b) return options.fn(this);
      return options.inverse(this);
    },
    ifGt: function(a, b, options) {
      if (a > b) return options.fn(this);
      return options.inverse(this);
    },
    ifLt: function(a, b, options) {
      if (a < b) return options.fn(this);
      return options.inverse(this);
    },
    unlessEq: function(a, b, options) {
      if (a !== b) return options.fn(this);
      return options.inverse(this);
    },
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
        case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default: return options.inverse(this);
      }
    },
    
    // =====================================================
    // DATE HELPERS
    // =====================================================
    formatDate: function(date, format) {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
    currentYear: function() {
      return new Date().getFullYear();
    },
    timeAgo: function(date) {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      const seconds = Math.floor((new Date() - d) / 1000);
      const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
      ];
      for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
      return 'just now';
    },
    
    // =====================================================
    // STATUS/BADGE HELPERS
    // =====================================================
    statusClass: function(status) {
      const classes = {
        'met': 'bg-success', 'not-met': 'bg-danger', 'pending': 'bg-secondary',
        'yes': 'bg-success', 'no': 'bg-danger', 'completed': 'bg-success',
        'in_progress': 'bg-warning', 'draft': 'bg-secondary'
      };
      return classes[status] || 'bg-secondary';
    },
    statusIcon: function(status) {
      const icons = {
        'met': 'bi-check-circle-fill', 'not-met': 'bi-x-circle-fill',
        'pending': 'bi-circle', 'yes': 'bi-check-lg', 'no': 'bi-x-lg'
      };
      return icons[status] || 'bi-circle';
    },
    
    // =====================================================
    // CATEGORY ICON HELPER
    // =====================================================
    categoryIcon: function(category) {
      const icons = {
        'Security': 'bi-shield-lock',
        'Performance': 'bi-speedometer2',
        'Integration': 'bi-plug',
        'Compliance': 'bi-clipboard-check',
        'UI/UX': 'bi-palette',
        'Data Management': 'bi-database',
        'Reporting': 'bi-bar-chart',
        'User Management': 'bi-people',
        'Notifications': 'bi-bell',
        'Document Management': 'bi-file-earmark-text',
        'General': 'bi-list-check'
      };
      return icons[category] || 'bi-list-check';
    },
    
    // =====================================================
    // SELECTED/ACTIVE HELPERS
    // =====================================================
    selected: function(a, b) {
      return a === b ? 'selected' : '';
    },
    active: function(a, b) {
      return a === b ? 'active' : '';
    },
    checked: function(value) {
      return value ? 'checked' : '';
    },
    disabled: function(value) {
      return value ? 'disabled' : '';
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
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
app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
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
app.use('/validate', validationRoutes);
app.use('/approve', approvalRoutes);

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

// Analytics scheduler
function scheduleAnalytics() {
  const intervalHours = parseInt(process.env.ANALYTICS_INTERVAL_HOURS || '72');

  setInterval(async () => {
    try {
      const { all, get } = require('./models/database');
      
      const lastSent = get(`SELECT sent_at FROM analytics_sent ORDER BY sent_at DESC LIMIT 1`);
      const lastSentDate = lastSent ? new Date(lastSent.sent_at) : new Date(0);
      const hoursSinceLastSent = (Date.now() - lastSentDate.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastSent >= intervalHours) {
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

        await emailService.sendAnalyticsDigest({
          totalInvites, inProgress, completedThisPeriod, expiringSoon,
          activeInvites, recentSubmissions
        });

        const { run } = require('./models/database');
        run(`INSERT INTO analytics_sent (sent_at) VALUES (CURRENT_TIMESTAMP)`);

        console.log('Analytics digest sent');
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }, 60 * 60 * 1000);
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
    
    scheduleAnalytics();
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;