const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { get, run } = require('../models/database');

function initializePassport() {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const admin = get('SELECT * FROM admins WHERE email = ?', [email.toLowerCase()]);
        
        if (!admin) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Update last login
        run('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [admin.id]);

        return done(null, admin);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((admin, done) => {
    done(null, admin.id);
  });

  passport.deserializeUser((id, done) => {
    try {
      const admin = get('SELECT id, email, name, created_at, last_login FROM admins WHERE id = ?', [id]);
      done(null, admin);
    } catch (error) {
      done(error, null);
    }
  });
}

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/admin/login');
}

// Middleware to redirect if already authenticated
function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/admin/dashboard');
  }
  next();
}

module.exports = {
  passport,
  initializePassport,
  ensureAuthenticated,
  ensureNotAuthenticated
};
