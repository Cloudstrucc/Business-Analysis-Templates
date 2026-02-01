# Business Analysis Templates & Questionnaire Portal

A collection of comprehensive, business-friendly questionnaire templates designed to streamline requirements gathering, implementation planning, and client sign-off for technology projects — plus a **Node.js web application** for sending interactive questionnaires to clients.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22+-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Azure-App%20Service-blue?logo=microsoft-azure" alt="Azure">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
  <img src="https://img.shields.io/badge/Maintained%20by-Cloudstrucc-00a8e8" alt="Cloudstrucc">
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Available Questionnaires](#available-questionnaires)
- [Quick Start - Local Development](#quick-start---local-development)
- [Deploy to Azure App Service](#deploy-to-azure-app-service)
- [Multi-Environment Deployment](#multi-environment-deployment)
- [Deployment Commands Reference](#deployment-commands-reference)
- [Adding New Questionnaires](#adding-new-questionnaires)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Technology implementations often fail not because of technical challenges, but because of unclear requirements, missed stakeholder expectations, and poor communication between technical teams and business users.

This repository provides **two ways** to capture business requirements:

| Option | Best For | Description |
|--------|----------|-------------|
| **📄 Markdown Templates** | Internal use, documentation | Download and edit locally, convert to Word/PDF |
| **🌐 Web Portal** | Client-facing engagements | Send branded questionnaires via email, track progress |

### Web Portal Features

| Feature | Description |
|---------|-------------|
| 🎨 **Branded Experience** | Bootstrap 5 UI with Cloudstrucc branding |
| 📧 **Email Invites** | Send invite links via Office 365 / SMTP |
| 🔑 **Access Codes** | Unique 8-character codes for each client |
| 💾 **Auto-Save** | Progress saved automatically on every change |
| ⏱️ **Expiration** | Invite links and submissions have configurable deadlines |
| 📊 **Admin Dashboard** | Track progress, view submissions, manage clients |
| 🔄 **Auto-Discovery** | Drop new `.md` files in Questionnaires folder - auto-detected |

---

## Repository Structure

```
Business-Analysis-Templates/
│
├── 📁 Deployment/
│   └── deploy.sh                 # Unified deployment script (all environments)
│
├── 📁 Questionnaires/            # ← ADD YOUR .MD TEMPLATES HERE
│   ├── D365-Customer-Services.md
│   ├── D365-Omni.md
│   ├── D365-Sales-Pro.md
│   ├── ECommerce-Canadian-Clothing-Checklist.md
│   ├── Power-Platform-Governance-Checklist.md
│   ├── PowerApps-MDA-Plain.md
│   └── PowerPages-Implementation-Requirements-Checklist.md
│
├── 📁 ba-questionnaire-app/      # Node.js Web Application
│   ├── app.js                    # Main application entry point
│   ├── package.json              # Dependencies
│   ├── startup.sh                # Azure startup script (unified)
│   ├── .env.example              # Environment template
│   │
│   ├── 📁 models/
│   │   └── database.js           # SQLite database layer
│   │
│   ├── 📁 routes/
│   │   ├── admin.js              # Admin dashboard routes
│   │   └── public.js             # Public form routes
│   │
│   ├── 📁 utils/
│   │   ├── formLoader.js         # Template auto-discovery
│   │   ├── markdownParser.js     # MD to HTML conversion
│   │   └── emailService.js       # Email notifications
│   │
│   ├── 📁 views/
│   │   ├── 📁 layouts/           # Handlebars layouts
│   │   ├── 📁 admin/             # Admin views
│   │   ├── 📁 forms/             # Form views
│   │   └── 📁 partials/          # Reusable components
│   │
│   ├── 📁 public/                # Static assets (CSS, JS, images)
│   ├── 📁 templates/             # Auto-synced from Questionnaires/
│   └── 📁 data/                  # SQLite database (auto-created)
│
└── README.md
```

---

## Available Questionnaires

| Template | Description |
|----------|-------------|
| **D365 Customer Service** | Cases, queues, SLAs, knowledge management, entitlements |
| **D365 Omnichannel** | Voice, chat, SMS, unified routing, contact center |
| **D365 Sales Professional** | Leads, opportunities, pipeline, email integration |
| **Power Platform Governance** | Environments, DLP policies, CoE toolkit, ALM |
| **Power Apps Model-Driven** | Tables, forms, views, business rules, security roles |
| **Power Pages** | Portals, authentication, web roles, accessibility |
| **E-Commerce (Canadian)** | Tech stack, inventory, payments, fulfillment, shipping |

### Using Templates as Standalone Files

```bash
# Convert to Word document
pandoc Questionnaires/D365-Customer-Services.md -o Requirements.docx

# Convert to PDF
pandoc Questionnaires/D365-Customer-Services.md -o Requirements.pdf
```

---

## Quick Start - Local Development

### Prerequisites

- Node.js 22+ installed (required for express-handlebars@8.0.4)
- npm or yarn
- PM2 (optional, for process management)

### 1. Clone and Install

```bash
git clone https://github.com/Cloudstrucc/Business-Analysis-Templates.git
cd Business-Analysis-Templates/ba-questionnaire-app

npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start the Server

**Option A: Direct (for development)**
```bash
node app.js
```

**Option B: With PM2 (recommended for local testing)**
```bash
# Install PM2 globally if not installed
npm install -g pm2

# Start the app
pm2 start app.js --name ba-forms

# View logs
pm2 logs ba-forms

# Check status
pm2 status
```

### 4. Access the Application

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Public landing page |
| http://localhost:3000/admin/login | Admin dashboard |

**Default Admin Credentials:**
- **Email:** `admin@cloudstrucc.com`
- **Password:** `dpg613`

---

## Deploy to Azure App Service

### Prerequisites

1. [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
2. Azure account with active subscription
3. Logged in: `az login`

### First-Time Setup

```bash
# Navigate to the repository root
cd ~/repos/Business-Analysis-Templates

# Fix permissions on templates folder
sudo chmod -R 755 ba-questionnaire-app/templates
sudo chown -R $(whoami) ba-questionnaire-app/templates

# Make scripts executable
chmod +x Deployment/deploy.sh
chmod +x ba-questionnaire-app/startup.sh
```

### Quick Deploy (Production)

```bash
cd Deployment
./deploy.sh
```

> ⚠️ **Note:** Production deployments require a passphrase. The default is configured in `deploy.sh`.

---

## Multi-Environment Deployment

The deployment script supports **three isolated environments**, each with its own Azure resource group, storage account, and database.

### Environment Overview

| Environment | Flag | Resource Group | App Name | Storage Account |
|-------------|------|----------------|----------|-----------------|
| **Development** | `--dev` | `cloudstrucc-rg-dev` | `cloudstrucc-ba-forms-dev` | `cloudstruccdatadev` |
| **QA/Staging** | `--qa` | `cloudstrucc-rg-qa` | `cloudstrucc-ba-forms-qa` | `cloudstruccdataqa` |
| **Production** | `--prod` | `cloudstrucc-rg` | `cloudstrucc-ba-forms` | `cloudstruccdata` |

### Environment URLs

| Environment | URL |
|-------------|-----|
| Development | https://cloudstrucc-ba-forms-dev.azurewebsites.net |
| QA/Staging | https://cloudstrucc-ba-forms-qa.azurewebsites.net |
| Production | https://cloudstrucc-ba-forms.azurewebsites.net |

### Deploy to Each Environment

```bash
cd Deployment

# Deploy to Development
./deploy.sh --dev

# Deploy to QA
./deploy.sh --qa

# Deploy to Production (requires passphrase)
./deploy.sh --prod
# or simply:
./deploy.sh
```

### TTL Auto-Shutdown (Cost Savings)

Set a Time-To-Live (TTL) to automatically stop environments after a specified number of hours. Great for dev/qa environments to save costs!

```bash
# Deploy to dev, auto-stop in 2 hours
./deploy.sh --dev --ttl 2

# Deploy to QA, auto-stop in 4 hours
./deploy.sh --qa --ttl 4

# Deploy to prod with TTL (requires extra confirmation)
./deploy.sh --prod --ttl 8
```

### Production Passphrase Protection

Production deployments require a passphrase to prevent accidental deployments:

```bash
# This will prompt for passphrase
./deploy.sh --deploy --prod

# Skip passphrase (for CI/CD pipelines only!)
./deploy.sh --deploy --prod --force
```

To change the passphrase, edit `PROD_PASSPHRASE` in `Deployment/deploy.sh`:

```bash
PROD_PASSPHRASE="your-secure-passphrase-here"
```

### List All Environments

```bash
./deploy.sh --list-envs
```

Output:
```
Environment  Resource Group           App Name                       State
-----------  -------------------------  ------------------------------  ------------
dev          cloudstrucc-rg-dev         cloudstrucc-ba-forms-dev       Running
qa           cloudstrucc-rg-qa          cloudstrucc-ba-forms-qa        Stopped
prod         cloudstrucc-rg             cloudstrucc-ba-forms           Running
```

---

## Deployment Commands Reference

Run all commands from the `Deployment/` folder:

```bash
cd Deployment
```

### General Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh --help` | Show help message with all options |
| `./deploy.sh --list-envs` | List status of all environments |

### Deployment Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh --dev` | Full deploy to development |
| `./deploy.sh --qa` | Full deploy to QA |
| `./deploy.sh --prod` | Full deploy to production (passphrase required) |
| `./deploy.sh --deploy --dev` | Code-only deploy to dev |
| `./deploy.sh --setup --dev` | Create Azure resources only (no code deploy) |
| `./deploy.sh --sync` | Sync questionnaires to templates folder only |

### TTL (Auto-Shutdown) Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh --dev --ttl 2` | Deploy to dev, auto-stop in 2 hours |
| `./deploy.sh --qa --ttl 4` | Deploy to QA, auto-stop in 4 hours |
| `./deploy.sh --prod --ttl 8` | Deploy to prod with TTL (extra confirmation) |

### Operations Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh --logs --dev` | Stream live logs from dev |
| `./deploy.sh --ssh --dev` | SSH into dev container |
| `./deploy.sh --restart --dev` | Restart dev app |
| `./deploy.sh --status --dev` | Check dev health status |
| `./deploy.sh --stop --dev` | Stop dev app (save costs) |
| `./deploy.sh --start --dev` | Start stopped dev app |
| `./deploy.sh --delete --dev` | Delete dev environment completely |

### Production Commands (Passphrase Required)

| Command | Description |
|---------|-------------|
| `./deploy.sh` | Full deploy to production |
| `./deploy.sh --deploy` | Code-only deploy to production |
| `./deploy.sh --restart` | Restart production |
| `./deploy.sh --stop` | Stop production (requires confirmation) |
| `./deploy.sh --delete` | Delete production (requires confirmation) |

### Common Workflows

**Deploy code changes to dev:**
```bash
./deploy.sh --deploy --dev
```

**Test in QA before production:**
```bash
./deploy.sh --deploy --qa
# Test at https://cloudstrucc-ba-forms-qa.azurewebsites.net
./deploy.sh --deploy --prod
```

**Spin up dev for a few hours:**
```bash
./deploy.sh --dev --ttl 2
# Work on dev...
# App auto-stops in 2 hours, or manually:
./deploy.sh --stop --dev
```

**View logs when troubleshooting:**
```bash
./deploy.sh --logs --dev
./deploy.sh --logs --qa
./deploy.sh --logs  # production
```

---

## Adding New Questionnaires

### Step 1: Create Markdown File

Add your `.md` file to the `Questionnaires/` folder. Use this structure:

```markdown
# [Technology] Implementation Checklist

**Client Name:** _______________________________________________
**Implementation Partner:** Cloudstrucc Inc.

---

## 1. Section Name

### What Is This Section About?
[Plain language explanation]

### Requirements

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Feature Name** | What it does | ☐ YES ☐ NO | |

---

## Sign-Off & Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Client** | | | |

---

## Glossary

| Term | Definition |
|------|------------|
| **Term** | What it means |
```

### Step 2: Deploy

```bash
cd Deployment

# Deploy to dev first to test
./deploy.sh --deploy --dev

# Then deploy to production
./deploy.sh --deploy --prod
```

The deployment script automatically:
- Copies all `.md` files from `Questionnaires/` to `ba-questionnaire-app/templates/`
- Deploys the updated code
- The app discovers and loads new templates on startup

### Template Requirements

For auto-detection to work, your `.md` file must have:
- At least one `# Title` heading
- At least one markdown table with `|---|`
- NOT be named `README.md`, `LICENSE.md`, etc.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` (local) / `8080` (Azure) | Server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `ENVIRONMENT` | No | `production` | Environment name (dev/qa/prod) |
| `SESSION_SECRET` | Yes | - | Session encryption key (auto-generated on Azure) |
| `ADMIN_EMAIL` | No | `admin@cloudstrucc.com` | Admin login email |
| `ADMIN_PASSWORD` | No | `dpg613` | Admin login password |
| `SMTP_HOST` | No | - | SMTP server for emails |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | - | SMTP username |
| `SMTP_PASS` | No | - | SMTP password |
| `BASE_URL` | No | `http://localhost:3000` | App URL (for email links) |
| `AZURE_STORAGE_CONNECTION_STRING` | No | - | Azure Storage connection (auto-configured) |
| `ANALYTICS_INTERVAL_HOURS` | No | `72` | Analytics digest frequency |

---

## Configuration

Edit variables at the top of `Deployment/deploy.sh`:

```bash
# Azure Resources (base names - environment suffix added automatically)
RESOURCE_GROUP_BASE="cloudstrucc-rg"
APP_SERVICE_PLAN_BASE="cloudstrucc-plan"
APP_NAME_BASE="cloudstrucc-ba-forms"
STORAGE_ACCOUNT_BASE="cloudstruccdata"
LOCATION="canadacentral"
APP_SERVICE_SKU="B1"

# Admin Credentials
ADMIN_EMAIL="admin@cloudstrucc.com"
ADMIN_PASSWORD="dpg613"

# Production Passphrase (change this!)
PROD_PASSPHRASE="cloudstrucc-prod-deploy-2026"

# SMTP (Optional - for email invites)
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
```

### Cost Estimate

| Resource | SKU | Monthly Cost (CAD) |
|----------|-----|-------------------|
| App Service Plan (per env) | B1 (Basic) | ~$13 |
| Storage Account (per env) | Standard LRS | ~$1 |
| **Per Environment** | | **~$14/month** |
| **All 3 Environments** | | **~$42/month** |

> 💡 **Tip:** Use `--ttl` for dev/qa to auto-stop and save costs when not in use!

---

## Troubleshooting

### Permission denied during deployment (Mac)

**Error:** `cp: .../templates/xxx.md: Permission denied`

**Fix:**
```bash
cd ~/repos/Business-Analysis-Templates
sudo chmod -R 755 ba-questionnaire-app/templates
sudo chown -R $(whoami) ba-questionnaire-app/templates
./Deployment/deploy.sh --deploy --dev
```

### Resource group is being deleted

**Error:** `The resource group 'cloudstrucc-rg-dev' is in deprovisioning state`

**Fix:** Wait 5-10 minutes for deletion to complete, then retry:
```bash
# Check status
az group show --name cloudstrucc-rg-dev

# Once deleted, deploy again
./deploy.sh --dev
```

### Node.js version warning (EBADENGINE)

**Error:** `npm warn EBADENGINE Unsupported engine { required: { node: '>=22.21.0' } }`

**Cause:** Azure is running an older Node.js version

**Fix:** The deploy script automatically configures Node.js 22 LTS. If you see this error, redeploy:
```bash
./deploy.sh --deploy --dev
```

### npm install permission errors on Azure

**Error:** `npm error code EACCES` during startup

**Cause:** Old startup.sh trying to run npm install at runtime

**Fix:** Ensure you're using the latest `startup.sh` that skips npm install when node_modules exists:
```bash
# Check your startup.sh has this check:
grep "node_modules/.package-lock.json" ba-questionnaire-app/startup.sh

# Redeploy
./deploy.sh --deploy --dev
```

### App won't start on Azure

```bash
# Check logs
./deploy.sh --logs --dev

# SSH in and run manually
./deploy.sh --ssh --dev
# Then: cd /home/site/wwwroot && node app.js
```

### Login doesn't work (redirects back to login)

This is usually a session/cookie issue. Make sure `app.js` has:
```javascript
app.set('trust proxy', 1);
```

### Templates not showing in admin panel

```bash
# Check templates were synced
ls ba-questionnaire-app/templates/

# Re-sync and deploy
./deploy.sh --deploy --dev
```

### "Cannot find module" errors

```bash
# Locally
cd ba-questionnaire-app
rm -rf node_modules package-lock.json
npm install
pm2 restart ba-forms

# On Azure - redeploy (includes fresh node_modules)
./deploy.sh --deploy --dev
```

### Database errors

**Fix (local):**
```bash
cd ba-questionnaire-app
cp data/questionnaire.db data/questionnaire.db.backup
rm data/questionnaire.db
node app.js  # or pm2 restart ba-forms
```

**Fix (Azure):**
```bash
./deploy.sh --ssh --dev
cd /home/site/wwwroot
rm -f data/questionnaire.db
exit
./deploy.sh --restart --dev
```

### PM2 Commands (Local Development)

```bash
# Start application
pm2 start app.js --name ba-forms

# Restart application
pm2 restart ba-forms

# Stop application
pm2 stop ba-forms

# View logs
pm2 logs ba-forms

# View status
pm2 status

# Monitor resources
pm2 monit

# Save process list (persist across reboots)
pm2 save

# Setup startup script
pm2 startup
```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────┐
│   Client        │────▶│  Azure App Service  │────▶│   SQLite     │
│   Browser       │◀────│  (Node.js/Express)  │◀────│   Database   │
└─────────────────┘     └──────────┬──────────┘     └──────────────┘
                                   │
                          ┌────────▼────────┐
                          │  SMTP Server    │
                          │  (Office 365)   │
                          └─────────────────┘
```

### Environment Isolation

```
┌─────────────────────────────────────────────────────────────────┐
│                        Azure Subscription                        │
├─────────────────────┬─────────────────────┬─────────────────────┤
│   cloudstrucc-rg-dev│   cloudstrucc-rg-qa │   cloudstrucc-rg    │
│   ┌───────────────┐ │   ┌───────────────┐ │   ┌───────────────┐ │
│   │ App Service   │ │   │ App Service   │ │   │ App Service   │ │
│   │ (forms-dev)   │ │   │ (forms-qa)    │ │   │ (forms)       │ │
│   └───────────────┘ │   └───────────────┘ │   └───────────────┘ │
│   ┌───────────────┐ │   ┌───────────────┐ │   ┌───────────────┐ │
│   │ Storage       │ │   │ Storage       │ │   │ Storage       │ │
│   │ (datadev)     │ │   │ (dataqa)      │ │   │ (data)        │ │
│   └───────────────┘ │   └───────────────┘ │   └───────────────┘ │
│   ┌───────────────┐ │   ┌───────────────┐ │   ┌───────────────┐ │
│   │ SQLite DB     │ │   │ SQLite DB     │ │   │ SQLite DB     │ │
│   └───────────────┘ │   └───────────────┘ │   └───────────────┘ │
└─────────────────────┴─────────────────────┴─────────────────────┘
        DEV                    QA                   PROD
```

### Key Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Public homepage with access code form |
| `/access` | GET | Handles access code submission, redirects to `/form/:code` |
| `/form/:code` | GET | Client questionnaire dashboard |
| `/form/:code/:slug` | GET | Specific questionnaire form |
| `/admin/login` | GET/POST | Admin authentication |
| `/admin/dashboard` | GET | Admin dashboard |
| `/admin/invites` | GET | Manage invites |
| `/admin/invites/new` | GET/POST | Create new invite |
| `/admin/submissions` | GET | View all submissions |
| `/admin/forms` | GET | Manage form templates |

---

## Contributing

Contributions welcome! Whether it's new templates, bug fixes, or feature enhancements.

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/new-template`)
3. Commit your changes (`git commit -m 'Add new template'`)
4. Push to the branch (`git push origin feature/new-template`)
5. Open a Pull Request

### Template Guidelines

- Use clear, non-technical language where possible
- Include decision checkboxes (☐ YES ☐ NO ☐ N/A)
- Add links to official documentation
- Include a glossary section for technical terms
- Add sign-off section at the end

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## About

<p align="center">
  <strong>Maintained by Cloudstrucc Inc.</strong><br>
  Cloud migration, Power Platform consulting, and cybersecurity services<br>
  for government and enterprise clients.
</p>

<p align="center">
  <a href="https://www.cloudstrucc.com">🌐 Website</a> •
  <a href="mailto:contact-us@cloudstrucc.com">📧 Contact</a>
</p>

---

<p align="center">
  <em>If you find this helpful, consider giving the repository a ⭐!</em>
</p>