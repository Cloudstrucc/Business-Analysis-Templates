# Business Analysis Templates & Questionnaire Portal

A collection of comprehensive, business-friendly templates designed to streamline requirements gathering, implementation planning, and client sign-off for technology projects — plus a **Node.js web application** for sending interactive questionnaires to clients.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap" alt="Bootstrap">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
  <img src="https://img.shields.io/badge/Maintained%20by-Cloudstrucc-00a8e8" alt="Cloudstrucc">
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Templates (Markdown)](#templates-markdown)
- [Questionnaire Portal (Web App)](#questionnaire-portal-web-app)
- [Quick Start](#quick-start)
- [Technology Areas Covered](#technology-areas-covered)
- [How to Use](#how-to-use)
- [Deployment](#deployment)
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

Both options share the same comprehensive questionnaire content, covering Dynamics 365, Power Platform, and more.

---

## Templates (Markdown)

### What's Included

Each markdown template provides:

- ✅ **Feature explanations in plain language** — No jargon, no assumptions about technical knowledge
- ✅ **Decision checkboxes** — Simple OOB (Out of Box) / N/A / Customize response options
- ✅ **Consideration questions** — Prompts to uncover requirements clients may not think to mention
- ✅ **Official documentation links** — Direct references to Microsoft Learn for deeper exploration
- ✅ **Sign-off sections** — Formal approval areas for project governance
- ✅ **Glossaries** — Definitions of key terms for reference

### Available Templates

| Template | File | Description |
|----------|------|-------------|
| **D365 Customer Service** | `D365-Customer-Services.md` | Cases, queues, SLAs, knowledge management |
| **D365 Omnichannel** | `D365-Omni.md` | Voice, chat, SMS, unified routing, contact center |
| **D365 Sales Professional** | `D365-Sales-Pro.md` | Leads, opportunities, pipeline, email integration |
| **Power Platform Governance** | `Power-Platform-Governance-Checklist.md` | Environments, DLP, CoE toolkit, ALM |
| **Power Apps Model-Driven** | `PowerApps-MDA-Plain.md` | Tables, forms, views, business rules, security |
| **Power Pages** | `PowerPages-Implementation-Requirements-Checklist.md` | Portals, authentication, web roles, accessibility |

### Using Markdown Templates

1. **Select the appropriate template** for your project type
2. **Customize the header** with client name, dates, and project details
3. **Work through each section** with stakeholders
4. **Convert to deliverable format:**
   ```bash
   # Convert to Word
   pandoc D365-Customer-Services.md -o D365-Requirements.docx
   
   # Convert to PDF
   pandoc D365-Customer-Services.md -o D365-Requirements.pdf
   ```
5. **Obtain formal sign-off** before proceeding with implementation

---

## Questionnaire Portal (Web App)

For client-facing engagements, use the **Cloudstrucc BA Questionnaire Portal** — a Node.js application that converts the markdown templates into interactive web forms.

### Features

| Feature | Description |
|---------|-------------|
| 🎨 **Branded Experience** | Bootstrap 5 UI matching Cloudstrucc website |
| 📧 **Email Invites** | Send invite links via Office 365 / Exchange Online |
| 🔑 **Access Codes** | Unique 8-character codes for each client |
| 💾 **Auto-Save** | Progress saved automatically on every change |
| ⏱️ **Expiration** | Invite links and submissions have configurable deadlines |
| 📊 **Admin Dashboard** | Track progress, view submissions, export to PDF |
| 📈 **Analytics** | Automated digest emails every 2-3 days |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

### Screenshots

```
┌─────────────────────────────────────────────────────────────┐
│  Client Portal                                              │
│  ┌─────────────────────────────────────────────────────────│
│  │  Welcome, John Smith!                                   │
│  │  Acme Corporation                                       │
│  │                                                         │
│  │  ┌──────────────────┐  ┌──────────────────┐           │
│  │  │ D365 Sales Pro   │  │ Power Platform   │           │
│  │  │ ██████████░ 75%  │  │ ░░░░░░░░░░ 0%   │           │
│  │  │ [Continue]       │  │ [Start]          │           │
│  │  └──────────────────┘  └──────────────────┘           │
│  └─────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────┘
```

### Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Client    │────▶│  Express.js     │────▶│   SQLite    │
│   Browser   │◀────│  + Handlebars   │◀────│   Database  │
└─────────────┘     └────────┬────────┘     └─────────────┘
                             │
                    ┌────────▼────────┐
                    │  Office 365     │
                    │  SMTP (Email)   │
                    └─────────────────┘
```

---

## Quick Start

### Option 1: Use Markdown Templates Only

```bash
# Clone the repository
git clone https://github.com/Cloudstrucc/Business-Analysis-Templates.git
cd Business-Analysis-Templates

# Open any template in your editor
code D365-Customer-Services.md
```

### Option 2: Run the Web Portal

```bash
# Clone the repository
git clone https://github.com/Cloudstrucc/Business-Analysis-Templates.git
cd Business-Analysis-Templates/webapp

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your SMTP credentials

# Start the server
npm start

# Access the portal
# Public:  http://localhost:3000
# Admin:   http://localhost:3000/admin/login
```

**Default Admin Credentials:**
- Email: `admin@cloudstrucc.com`
- Password: `ChangeThisPassword123!`

> ⚠️ **Important:** Change default credentials immediately in production!

---

## Technology Areas Covered

This repository includes templates for:

### Microsoft Dynamics 365
- Sales (Professional & Enterprise)
- Customer Service
- Omnichannel / Contact Center
- Field Service *(coming soon)*
- Marketing *(coming soon)*

### Microsoft Power Platform
- Power Apps (Model-Driven & Canvas)
- Power Automate
- Power BI
- Power Pages (Portals)
- Copilot Studio
- Governance & Center of Excellence

### Microsoft 365 *(coming soon)*
- SharePoint
- Teams
- Exchange
- Security & Compliance

### Azure Services *(coming soon)*
- Infrastructure
- Identity
- Integration

---

## How to Use

### For Business Analysts & Consultants

1. **Before client workshops**: Select relevant templates
2. **During discovery**: Walk through each section, capturing decisions
3. **After workshops**: Send questionnaire link for additional details
4. **At sign-off**: Generate PDF from submissions for formal approval

### For Project Managers

1. **Kickoff**: Send invite links to stakeholders
2. **Track progress**: Monitor completion via admin dashboard
3. **Follow up**: Use analytics to identify stalled questionnaires
4. **Baseline**: Export submitted requirements as project baseline

### For IT Teams

1. **Self-service**: Use templates internally for standardization
2. **Onboarding**: New team members follow established patterns
3. **Documentation**: Archive completed questionnaires with projects

---

## Deployment

### Web Portal Deployment Options

| Platform | Complexity | Notes |
|----------|------------|-------|
| **Local/Dev** | ⭐ | `npm start` |
| **Azure App Service** | ⭐⭐ | Node.js 18 LTS, configure env vars |
| **Docker** | ⭐⭐ | Dockerfile included |
| **VPS (PM2 + Nginx)** | ⭐⭐⭐ | Full control, SSL via Let's Encrypt |

### Environment Variables

```env
# Required
PORT=3000
SESSION_SECRET=your-random-secret-key
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=your-secure-password

# Email (Office 365)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=no-reply@yourcompany.com
SMTP_PASS=your-app-password
RESPONSE_EMAIL=responses@yourcompany.com

# Application
BASE_URL=https://forms.yourcompany.com
ANALYTICS_INTERVAL_HOURS=72
```

See `BUILD_GUIDE.md` in the webapp directory for complete deployment instructions.

---

## Contributing

Contributions are welcome! Whether it's new templates, bug fixes, or feature enhancements.

### Adding New Templates

1. Fork this repository
2. Create your template following the existing format:
   - Use clear, non-technical language
   - Include decision checkboxes (☐ OOB ☐ N/A ☐ Customize)
   - Add links to official documentation
   - Include a glossary and sign-off section
3. Submit a Pull Request

### Template Structure

```markdown
# [Technology] Implementation Checklist

**Client Name:** _______________________________________________
**Implementation Partner:** Cloudstrucc Inc.
**Project Start Date:** _______________________________________________

---

## How to Use This Document
[Instructions and response legend]

---

## 1. Section Name

### What Is It?
[Plain language explanation]

### Key Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Feature Name** | What it does | ☐ OOB ☐ CUSTOMIZE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Your question here? | | |

---

## Sign-Off & Approval
[Signature blocks]

---

## Glossary
[Term definitions]
```

---

## Who Is This For?

- **Business Analysts** conducting requirements workshops
- **Solution Architects** scoping implementation efforts
- **Project Managers** ensuring nothing falls through the cracks
- **Consultants** delivering professional, repeatable client engagements
- **Internal IT Teams** rolling out new platforms to business units

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute these templates and the web application for personal, commercial, and client projects without restriction.

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
  <em>If you find this helpful, consider giving the repository a ⭐ to help others discover it!</em>
</p>
