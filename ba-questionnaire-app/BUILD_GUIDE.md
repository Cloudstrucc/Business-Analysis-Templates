# Cloudstrucc Business Analysis Questionnaire Portal

## Build & Deployment Guide

**Version:** 1.0  
**Author:** Cloudstrucc Inc.  
**Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Prerequisites](#3-prerequisites)
4. [Project Structure](#4-project-structure)
5. [Installation](#5-installation)
6. [Configuration](#6-configuration)
7. [Database Schema](#7-database-schema)
8. [Features](#8-features)
9. [Routes & API](#9-routes--api)
10. [Email Configuration](#10-email-configuration)
11. [Adding New Forms](#11-adding-new-forms)
12. [Deployment](#12-deployment)
13. [Security Considerations](#13-security-considerations)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Overview

### Purpose

This application provides a secure, branded portal for Cloudstrucc Inc. to send business analysis questionnaires to clients. Clients receive an invite via email with a unique access code, complete forms at their own pace (with auto-save), and submit responses which are stored and emailed to the admin team.

### Key Features

- **Admin Dashboard**: Create/manage invites, view submissions, analytics
- **Client Portal**: Access forms via unique code, auto-save progress, submit when ready
- **Email Integration**: Automated invites via Exchange Online (EXO)
- **Responsive Design**: Bootstrap 5, matches CloudStrucc branding
- **PDF Export**: Export submissions for documentation
- **Analytics**: Automated digest emails every 2-3 days

### Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js + Express.js |
| **Templating** | Handlebars (express-handlebars) |
| **Database** | SQLite (via sql.js) |
| **Authentication** | Passport.js (Local Strategy) |
| **Styling** | Bootstrap 5.3 + Custom CSS |
| **Email** | Nodemailer (SMTP/Office 365) |
| **PDF Generation** | Puppeteer |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Landing Page   │  │  Form Dashboard │  │  Questionnaire  │ │
│  │  (Enter Code)   │  │  (Select Form)  │  │  (Fill & Save)  │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘ │
└───────────┼─────────────────────┼─────────────────────┼─────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPRESS.JS SERVER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Public Routes│  │ Admin Routes │  │  API Routes  │          │
│  │  /form/:code │  │ /admin/*     │  │ /form/save   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         ▼                 ▼                 ▼                   │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              MIDDLEWARE LAYER                        │       │
│  │  • Session Management  • Authentication (Passport)  │       │
│  │  • Flash Messages      • Request Parsing            │       │
│  └──────────────────────────┬──────────────────────────┘       │
│                             │                                   │
│         ┌───────────────────┼───────────────────┐              │
│         ▼                   ▼                   ▼              │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐         │
│  │  Database  │     │   Email    │     │  Markdown  │         │
│  │  (SQLite)  │     │  Service   │     │   Parser   │         │
│  └────────────┘     └────────────┘     └────────────┘         │
└─────────────────────────────────────────────────────────────────┘
            │                   │
            ▼                   ▼
     ┌────────────┐     ┌────────────────┐
     │ data/*.db  │     │ SMTP Server    │
     │            │     │ (Office 365)   │
     └────────────┘     └────────────────┘
```

---

## 3. Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | Runtime environment |
| npm | 9.x or higher | Package management |
| Git | Latest | Version control |

### Optional (for PDF export)

| Software | Version | Purpose |
|----------|---------|---------|
| Chromium | Latest | Puppeteer PDF rendering |

### Accounts & Credentials

- **Office 365 / Exchange Online** account for sending emails
- **SMTP credentials** for the no-reply mailbox
- **Domain** for production deployment (optional)

---

## 4. Project Structure

```
ba-questionnaire-app/
├── config/
│   └── passport.js          # Passport authentication config
├── data/
│   └── questionnaire.db     # SQLite database (auto-created)
├── middleware/
│   └── (custom middleware)
├── models/
│   └── database.js          # Database initialization & helpers
├── public/
│   ├── css/
│   │   └── custom.css       # Additional custom styles
│   ├── js/
│   │   └── app.js           # Client-side JavaScript
│   └── images/
│       └── logo.png         # Cloudstrucc logo
├── routes/
│   ├── admin.js             # Admin panel routes
│   └── public.js            # Public/client routes
├── templates/
│   ├── D365-Customer-Services.md
│   ├── D365-Omni.md
│   ├── D365-Sales-Pro.md
│   ├── Power-Platform-Governance-Checklist.md
│   ├── PowerApps-MDA-Plain.md
│   └── PowerPages-Implementation-Requirements-Checklist.md
├── utils/
│   ├── emailService.js      # Email sending utilities
│   ├── formLoader.js        # Load markdown into database
│   └── markdownParser.js    # Parse MD to form structure
├── views/
│   ├── admin/
│   │   ├── dashboard.hbs
│   │   ├── forms.hbs
│   │   ├── invite-new.hbs
│   │   ├── invites.hbs
│   │   ├── login.hbs
│   │   ├── submission-detail.hbs
│   │   └── submissions.hbs
│   ├── forms/
│   │   ├── dashboard.hbs
│   │   ├── questionnaire.hbs
│   │   └── success.hbs
│   ├── layouts/
│   │   └── main.hbs         # Main layout template
│   ├── partials/
│   │   └── (reusable components)
│   ├── error.hbs
│   └── index.hbs            # Landing page
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Example environment config
├── .gitignore
├── app.js                   # Main application entry point
├── package.json
└── BUILD_GUIDE.md           # This file
```

---

## 5. Installation

### Step 1: Clone or Create Project

```bash
# Create project directory
mkdir ba-questionnaire-app
cd ba-questionnaire-app

# Initialize npm
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express express-handlebars express-session \
  passport passport-local bcryptjs sql.js nodemailer \
  uuid marked validator express-validator helmet morgan \
  dotenv cookie-parser connect-flash
```

**Optional for PDF export:**
```bash
npm install puppeteer
```

### Step 3: Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#6-configuration)).

### Step 4: Create Required Directories

```bash
mkdir -p data templates public/{css,js,images} views/{admin,forms,layouts,partials}
```

### Step 5: Copy Template Files

Copy your markdown questionnaire files to the `templates/` directory:

```bash
# Example
cp /path/to/D365-Customer-Services.md templates/
cp /path/to/D365-Omni.md templates/
# ... etc
```

### Step 6: Start the Application

```bash
# Development
node app.js

# Or with nodemon for auto-reload
npm install -g nodemon
nodemon app.js
```

### Step 7: Access the Application

- **Public Portal**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

Default admin credentials (change in `.env`):
- Email: `admin@cloudstrucc.com`
- Password: `ChangeThisPassword123!`

---

## 6. Configuration

### Environment Variables (.env)

```env
# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=3000
NODE_ENV=development
SESSION_SECRET=generate-a-strong-random-string-here

# ===========================================
# ADMIN CREDENTIALS
# Change these immediately in production!
# ===========================================
ADMIN_EMAIL=admin@cloudstrucc.com
ADMIN_PASSWORD=ChangeThisPassword123!

# ===========================================
# EMAIL CONFIGURATION (Office 365 / EXO)
# ===========================================
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=no-reply@cloudstrucc.com
SMTP_PASS=your-app-password-here
SMTP_FROM="Cloudstrucc BA Forms" <no-reply@cloudstrucc.com>

# Where submission notifications are sent
RESPONSE_EMAIL=responses@cloudstrucc.com

# ===========================================
# APPLICATION SETTINGS
# ===========================================
# Base URL for invite links (no trailing slash)
BASE_URL=http://localhost:3000

# Analytics email interval in hours (default: 72 = 3 days)
ANALYTICS_INTERVAL_HOURS=72
```

### Configuration Notes

| Variable | Description | Example |
|----------|-------------|---------|
| `SESSION_SECRET` | Random string for session encryption | `openssl rand -base64 32` |
| `SMTP_USER` | Office 365 email account | `no-reply@cloudstrucc.com` |
| `SMTP_PASS` | App password (if MFA enabled) | Generate in O365 admin |
| `BASE_URL` | Full URL where app is hosted | `https://forms.cloudstrucc.com` |

---

## 7. Database Schema

The application uses SQLite with the following schema:

### Tables

#### `admins`
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,           -- bcrypt hashed
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);
```

#### `forms`
```sql
CREATE TABLE forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,        -- URL-friendly identifier
  title TEXT NOT NULL,
  description TEXT,
  markdown_file TEXT NOT NULL,      -- filename in templates/
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `invites`
```sql
CREATE TABLE invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,        -- 8-char unique code
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_company TEXT,
  created_by INTEGER,               -- admin who created
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  submission_deadline DATETIME,
  is_revoked INTEGER DEFAULT 0,
  first_accessed_at DATETIME,
  last_accessed_at DATETIME,
  FOREIGN KEY (created_by) REFERENCES admins(id)
);
```

#### `invite_forms`
```sql
CREATE TABLE invite_forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invite_id INTEGER NOT NULL,
  form_id INTEGER NOT NULL,
  FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE CASCADE,
  FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  UNIQUE(invite_id, form_id)
);
```

#### `submissions`
```sql
CREATE TABLE submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invite_id INTEGER NOT NULL,
  form_id INTEGER NOT NULL,
  data TEXT NOT NULL,               -- JSON stringified form data
  progress INTEGER DEFAULT 0,       -- 0-100 percentage
  status TEXT DEFAULT 'in_progress', -- in_progress | submitted
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  submitted_at DATETIME,
  FOREIGN KEY (invite_id) REFERENCES invites(id),
  FOREIGN KEY (form_id) REFERENCES forms(id)
);
```

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   admins    │       │     invites     │       │    forms    │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)         │    ┌──│ id (PK)     │
│ email       │  │    │ code            │    │  │ slug        │
│ password    │  │    │ client_email    │    │  │ title       │
│ name        │  └───▶│ created_by (FK) │    │  │ description │
│ created_at  │       │ expires_at      │    │  │ markdown_file│
│ last_login  │       │ is_revoked      │    │  │ is_active   │
└─────────────┘       └────────┬────────┘    │  └─────────────┘
                               │             │
                               ▼             │
                      ┌─────────────────┐    │
                      │  invite_forms   │    │
                      ├─────────────────┤    │
                      │ invite_id (FK)  │────┘
                      │ form_id (FK)    │─────┘
                      └────────┬────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │  submissions    │
                      ├─────────────────┤
                      │ id (PK)         │
                      │ invite_id (FK)  │
                      │ form_id (FK)    │
                      │ data (JSON)     │
                      │ progress        │
                      │ status          │
                      │ submitted_at    │
                      └─────────────────┘
```

---

## 8. Features

### 8.1 Admin Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview stats, recent activity, expiring invites |
| **Create Invite** | Select client, forms, expiry date, send email |
| **Manage Invites** | View, resend, revoke, track progress |
| **View Submissions** | See all responses, filter by status/form |
| **Export PDF** | Download submission as formatted PDF |
| **Form Management** | Activate/deactivate forms, reload from markdown |
| **Analytics Email** | Auto-sent every 2-3 days with progress summary |

### 8.2 Client Features

| Feature | Description |
|---------|-------------|
| **Access via Code** | Enter 8-character code from email |
| **Form Dashboard** | See assigned forms and progress |
| **Auto-Save** | Progress saved automatically on every change |
| **Resume Anytime** | Return with same code to continue |
| **Progress Bar** | Visual indicator of completion |
| **Submit Form** | Final submission with confirmation |
| **Email Confirmation** | Receives confirmation after submission |

### 8.3 Form Features

| Feature | Description |
|---------|-------------|
| **Markdown Parsing** | Convert MD tables to HTML forms |
| **Checkbox Groups** | OOB / N/A / Customize options |
| **Text Areas** | Notes and answer fields |
| **Validation** | Required field enforcement |
| **Section Navigation** | Organized by numbered sections |
| **Responsive** | Works on desktop, tablet, mobile |

---

## 9. Routes & API

### Public Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Landing page with code entry |
| `POST` | `/form/access` | Redirect to form dashboard |
| `GET` | `/form/:code` | Client form dashboard |
| `GET` | `/form/:code/:slug` | View/fill specific form |
| `POST` | `/form/:code/:slug/save` | Auto-save form data (AJAX) |
| `POST` | `/form/:code/:slug/submit` | Submit completed form |

### Admin Routes (require authentication)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/admin/login` | Login page |
| `POST` | `/admin/login` | Process login |
| `GET` | `/admin/logout` | Logout |
| `GET` | `/admin/dashboard` | Admin dashboard |
| `GET` | `/admin/invites` | List all invites |
| `GET` | `/admin/invites/new` | New invite form |
| `POST` | `/admin/invites/create` | Create invite |
| `GET` | `/admin/invites/:id` | View invite details |
| `POST` | `/admin/invites/:id/resend` | Resend invite email |
| `POST` | `/admin/invites/:id/revoke` | Revoke invite |
| `GET` | `/admin/submissions` | List submissions |
| `GET` | `/admin/submissions/:id` | View submission details |
| `GET` | `/admin/submissions/:id/export` | Export as PDF |
| `GET` | `/admin/forms` | Manage forms |
| `POST` | `/admin/forms/reload` | Reload from markdown |
| `POST` | `/admin/forms/:id/toggle` | Activate/deactivate form |
| `GET` | `/admin/forms/:id/preview` | Preview form |

---

## 10. Email Configuration

### Office 365 / Exchange Online Setup

1. **Create Shared Mailbox** (recommended):
   - Go to Microsoft 365 Admin Center
   - Create `no-reply@yourdomain.com` shared mailbox
   - Enable SMTP AUTH for the mailbox

2. **If using MFA**, create an App Password:
   - Go to https://mysignins.microsoft.com/security-info
   - Add method → App password
   - Use this password in `SMTP_PASS`

3. **Enable SMTP AUTH** (if disabled at tenant level):
   ```powershell
   # PowerShell
   Set-TransportConfig -SmtpClientAuthenticationDisabled $false
   
   # For specific mailbox
   Set-CASMailbox -Identity "no-reply@yourdomain.com" -SmtpClientAuthenticationDisabled $false
   ```

### Email Templates

The application sends these emails:

| Email | Recipient | Trigger |
|-------|-----------|---------|
| **Invite Email** | Client | When invite is created/resent |
| **Confirmation** | Client | After form submission |
| **Admin Notification** | Admin (responses@) | After form submission |
| **Analytics Digest** | Admin | Every 72 hours (configurable) |

### Testing Email

To test without sending real emails, check console output when `SMTP_USER` is not configured.

---

## 11. Adding New Forms

### Step 1: Create Markdown File

Create a new `.md` file in the `templates/` directory following this structure:

```markdown
# Form Title Here

**Client Name:** _______________________________________________  
**Implementation Partner:** Cloudstrucc Inc.  
**Project Start Date:** _______________________________________________  

---

## 1. Section Name

### What Is It?
Description of this section.

### Key Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Feature Name** | What it does | ☐ OOB ☐ CUSTOMIZE | |
| **Another Feature** | Description | ☐ ENABLE ☐ DISABLE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Your question here? | | |
| Another question? | ☐ Yes ☐ No | |

---

## 2. Another Section

... continue pattern ...

---

## Sign-Off & Approval

### Approval Signatures

**Business Owner:**

Name: _______________________________________________ Date: _______________

---

*Document prepared by Cloudstrucc Inc.*
```

### Step 2: Markdown Conventions

| Element | How to Write | Becomes |
|---------|--------------|---------|
| Section | `## 1. Section Name` | Form section with header |
| Subsection | `### Subsection Title` | Subsection within section |
| Checkbox options | `☐ OOB ☐ CUSTOMIZE` | Checkbox group |
| Yes/No | `☐ Yes ☐ No` | Two checkboxes |
| Notes column | Column named "Notes" | Textarea field |
| Your Answer | Column named "Your Answer" | Textarea or checkboxes |

### Step 3: Load into Application

1. **Via Admin Panel**:
   - Go to Admin → Forms
   - Click "Reload Forms"

2. **Programmatically** (in `formLoader.js`):
   ```javascript
   const formLoader = require('./utils/formLoader');
   formLoader.loadAllForms();
   ```

### Step 4: Test the Form

1. Go to Admin → Forms
2. Click "Preview" on your new form
3. Verify all sections render correctly

---

## 12. Deployment

### Option A: Traditional VPS/Server

```bash
# 1. Clone to server
git clone your-repo-url /var/www/ba-forms
cd /var/www/ba-forms

# 2. Install dependencies
npm install --production

# 3. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 4. Use PM2 for process management
npm install -g pm2
pm2 start app.js --name "ba-forms"
pm2 save
pm2 startup

# 5. Configure nginx reverse proxy
sudo nano /etc/nginx/sites-available/ba-forms
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name forms.cloudstrucc.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option B: Azure App Service

1. Create App Service (Node.js 18 LTS)
2. Configure Application Settings with env variables
3. Deploy via GitHub Actions or Azure DevOps

**GitHub Actions workflow:**
```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/webapps-deploy@v2
        with:
          app-name: 'cloudstrucc-ba-forms'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
```

### Option C: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

---

## 13. Security Considerations

### Authentication & Sessions

- [x] Passwords hashed with bcrypt (10 rounds)
- [x] Sessions stored server-side
- [x] Session secret from environment variable
- [ ] Consider adding rate limiting for login attempts
- [ ] Consider adding CSRF protection

### Data Protection

- [x] SQLite database stored in `data/` directory
- [x] Invite codes are random UUIDs (hard to guess)
- [x] Invites expire after set date
- [ ] Add database encryption at rest
- [ ] Implement backup strategy

### Recommendations

1. **Use HTTPS in production** - Get SSL certificate via Let's Encrypt
2. **Change default admin credentials** immediately
3. **Restrict database file permissions**: `chmod 600 data/questionnaire.db`
4. **Regular backups** of `data/` directory
5. **Monitor access logs** for suspicious activity
6. **Keep dependencies updated**: `npm audit fix`

### Headers (already configured)

```javascript
// In app.js with helmet
app.use(helmet({
  contentSecurityPolicy: false, // Adjust as needed
}));
```

---

## 14. Troubleshooting

### Common Issues

#### Email not sending

```
Error: Invalid login: 535 5.7.139 Authentication unsuccessful
```

**Solutions:**
1. Check SMTP_USER and SMTP_PASS are correct
2. Enable SMTP AUTH for the mailbox
3. If using MFA, use an App Password
4. Check if account is blocked/locked

#### Database errors

```
Error: SQLITE_BUSY: database is locked
```

**Solutions:**
1. Only run one instance of the application
2. Check for orphaned processes: `ps aux | grep node`
3. Delete lock file if exists: `rm data/questionnaire.db-journal`

#### Form not rendering

```
Error: Form template file not found
```

**Solutions:**
1. Check file exists in `templates/` directory
2. Verify filename matches `markdown_file` in database
3. Run "Reload Forms" from admin panel

#### Sessions not persisting

**Solutions:**
1. Check SESSION_SECRET is set in `.env`
2. Verify cookies are enabled in browser
3. Check if running behind proxy (trust proxy setting)

### Debug Mode

Enable verbose logging:

```bash
DEBUG=* node app.js
```

### Logs Location

- Application logs: Console output (use PM2 logs in production)
- Access logs: Via Morgan middleware
- Email logs: Console when email fails

### Health Check

Add this endpoint for monitoring:

```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

---

## Quick Reference

### NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "load-forms": "node -e \"require('./utils/formLoader').loadAllForms()\"",
    "test": "echo \"No tests yet\""
  }
}
```

### Useful Commands

```bash
# Start development server
npm run dev

# Load/reload all forms
npm run load-forms

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

### Support

For issues or questions:
- Email: contact-us@cloudstrucc.com
- Website: https://www.cloudstrucc.com

---

*Document prepared by Cloudstrucc Inc.*
