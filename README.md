# Business Analysis Templates & Questionnaire Portal

A collection of comprehensive, business-friendly questionnaire templates designed to streamline requirements gathering, implementation planning, and client sign-off for technology projects — plus a **Node.js web application** for sending interactive questionnaires to clients.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-green?logo=node.js" alt="Node.js">
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
- [Deployment Commands Reference](#deployment-commands-reference)
- [Adding New Questionnaires](#adding-new-questionnaires)
- [Environment Variables](#environment-variables)
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
│   └── deploy.sh                 # Azure deployment script (run from here)
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
│   ├── startup.sh                # Azure startup script
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

- Node.js 18+ installed
- npm or yarn

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

```bash
node app.js
```

### 4. Access the Application

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Public landing page |
| http://localhost:3000/admin/login | Admin dashboard |

**Default Admin Credentials:**
- **Email:** `admin@cloudstrucc.com`
- **Password:** `ChangeThisPassword123!`

---

## Deploy to Azure App Service

### Prerequisites

1. [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
2. Azure account with active subscription
3. Logged in: `az login`

### One-Command Deployment

```bash
cd Deployment
./deploy.sh
```

That's it! The script will:

1. ✅ Create Resource Group (`cloudstrucc-rg`)
2. ✅ Create App Service Plan (Linux, Basic B1)
3. ✅ Create Web App (Node.js 20)
4. ✅ Configure environment variables
5. ✅ Set startup command
6. ✅ Enable logging
7. ✅ Sync questionnaires from `Questionnaires/` → `templates/`
8. ✅ Package and deploy code
9. ✅ Restart and verify health

### After Deployment

| URL | Purpose |
|-----|---------|
| https://cloudstrucc-ba-forms.azurewebsites.net | Public portal |
| https://cloudstrucc-ba-forms.azurewebsites.net/admin/login | Admin login |

**Default Credentials:**
- **Email:** `admin@cloudstrucc.com`
- **Password:** `ChangeThisPassword123!`

### Configuration

Edit variables at the top of `Deployment/deploy.sh`:

```bash
# Azure Resources
RESOURCE_GROUP="cloudstrucc-rg"
APP_SERVICE_PLAN="cloudstrucc-plan"
APP_NAME="cloudstrucc-ba-forms"        # Must be globally unique!
LOCATION="canadacentral"
APP_SERVICE_SKU="B1"                   # B1=~$13/mo, S1=~$70/mo

# Admin Credentials
ADMIN_EMAIL="admin@cloudstrucc.com"
ADMIN_PASSWORD="ChangeThisPassword123!"

# SMTP (Optional - for email invites)
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
```

### Cost Estimate

| Resource | SKU | Monthly Cost (CAD) |
|----------|-----|-------------------|
| App Service Plan | B1 (Basic) | ~$13 |
| **Total** | | **~$13/month** |

---

## Deployment Commands Reference

Run all commands from the `Deployment/` folder:

```bash
cd Deployment
```

| Command | Description |
|---------|-------------|
| `./deploy.sh` | Full deployment (create resources + deploy code) |
| `./deploy.sh --deploy` | Deploy code only (resources must exist) |
| `./deploy.sh --setup` | Create Azure resources only |
| `./deploy.sh --sync` | Sync questionnaires to templates folder only |
| `./deploy.sh --logs` | Stream live application logs |
| `./deploy.sh --ssh` | SSH into the container |
| `./deploy.sh --restart` | Restart the web app |
| `./deploy.sh --status` | Check app health status |
| `./deploy.sh --delete` | Delete all Azure resources |
| `./deploy.sh --help` | Show help message |

### Common Workflows

**Deploy code changes:**
```bash
./deploy.sh --deploy
```

**Add a new questionnaire:**
```bash
# 1. Add .md file to Questionnaires/ folder
# 2. Deploy
./deploy.sh --deploy
```

**View logs when troubleshooting:**
```bash
./deploy.sh --logs
```

**Restart after config changes:**
```bash
./deploy.sh --restart
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
./deploy.sh --deploy
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
| `SESSION_SECRET` | Yes | - | Session encryption key (auto-generated on Azure) |
| `ADMIN_EMAIL` | No | `admin@cloudstrucc.com` | Admin login email |
| `ADMIN_PASSWORD` | No | `ChangeThisPassword123!` | Admin login password |
| `SMTP_HOST` | No | - | SMTP server for emails |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_USER` | No | - | SMTP username |
| `SMTP_PASS` | No | - | SMTP password |
| `BASE_URL` | No | `http://localhost:3000` | App URL (for email links) |
| `ANALYTICS_INTERVAL_HOURS` | No | `72` | Analytics digest frequency |

---

## Troubleshooting

### App won't start on Azure

```bash
# Check logs
./deploy.sh --logs

# SSH in and run manually
./deploy.sh --ssh
# Then: cd /home/site/wwwroot && node app.js
```

### Login doesn't work (redirects back to login)

This is usually a session/cookie issue. Make sure `app.js` has:
```javascript
app.set('trust proxy', 1);
```

### Templates not showing

```bash
# Check templates were synced
ls ba-questionnaire-app/templates/

# Re-sync and deploy
./deploy.sh --deploy
```

### Permission denied on Mac

```bash
chmod +x Deployment/deploy.sh
chmod +x ba-questionnaire-app/startup.sh
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