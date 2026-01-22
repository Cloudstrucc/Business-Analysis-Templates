# Power Pages Site Implementation Checklist

**Client Name:** _______________________________________________  
**Implementation Partner:** Cloudstrucc Inc.  
**Project Start Date:** _______________________________________________  
**Target Go-Live Date:** _______________________________________________  
**Prepared By:** _______________________________________________  
**Version:** 1.0  
**Last Updated:** _______________________________________________

---

## How to Use This Document

This checklist helps plan and implement a Power Pages site (external-facing website built on Microsoft Power Platform). It covers site design, authentication, accessibility, security, and integration considerations.

| Response | Meaning |
|----------|---------|
| **OOB** | Out of Box — Keep the default configuration |
| **N/A** | Not Applicable — Does not apply to your site |
| **CUSTOMIZE** | You want changes made (provide details in Notes) |
| **ENABLE** | You want this feature turned on |
| **DISABLE** | You want this feature turned off |

---

## Table of Contents

1. [Power Pages Overview](#1-power-pages-overview)
2. [Site Purpose & Requirements](#2-site-purpose--requirements)
3. [Site Design & Branding](#3-site-design--branding)
4. [Authentication & Identity (SSO)](#4-authentication--identity-sso)
5. [User Registration & Profiles](#5-user-registration--profiles)
6. [Web Roles & Permissions](#6-web-roles--permissions)
7. [Page Structure & Navigation](#7-page-structure--navigation)
8. [Forms & Data Capture](#8-forms--data-capture)
9. [Lists & Data Display](#9-lists--data-display)
10. [Document Management](#10-document-management)
11. [Copilot Studio Agents (Chatbots)](#11-copilot-studio-agents-chatbots)
12. [Accessibility (WCAG Compliance)](#12-accessibility-wcag-compliance)
13. [Multi-Language Support](#13-multi-language-support)
14. [Search Configuration](#14-search-configuration)
15. [Security Configuration](#15-security-configuration)
16. [Custom Domain & SSL](#16-custom-domain--ssl)
17. [Performance & Caching](#17-performance--caching)
18. [Integration & APIs](#18-integration--apis)
19. [Analytics & Monitoring](#19-analytics--monitoring)
20. [Compliance & Privacy](#20-compliance--privacy)
21. [Testing & Go-Live](#21-testing--go-live)
22. [Sign-Off & Approval](#22-sign-off--approval)

---

## 1. Power Pages Overview

### What Is It?
Power Pages is Microsoft's platform for building secure, external-facing websites that connect to your business data in Dataverse. Unlike internal apps, Power Pages sites are designed for customers, partners, or citizens to interact with your organization.

**📖 Learn More:** [Power Pages Overview](https://learn.microsoft.com/en-us/power-pages/introduction)

### Common Use Cases

| Use Case | Description | Applies? | Notes |
|----------|-------------|----------|-------|
| **Customer Portal** | Customers view orders, submit requests | ☐ Yes ☐ No | |
| **Partner Portal** | Partner deal registration, resources | ☐ Yes ☐ No | |
| **Citizen Services** | Government forms, applications | ☐ Yes ☐ No | |
| **Community Forum** | Discussion boards, knowledge sharing | ☐ Yes ☐ No | |
| **Event Registration** | Sign-ups, scheduling | ☐ Yes ☐ No | |
| **Self-Service Support** | Knowledge base, case submission | ☐ Yes ☐ No | |
| **Application Portal** | Job applications, grants, permits | ☐ Yes ☐ No | |

---

## 2. Site Purpose & Requirements

### Site Definition

| Question | Your Answer |
|----------|-------------|
| What is the primary purpose of this site? | |
| What business problem does it solve? | |
| What is the site name/title? | |
| Desired custom URL? | |

### Target Audience

| Audience | Description | Approximate Users | Notes |
|----------|-------------|-------------------|-------|
| **Primary Users** | | | |
| **Secondary Users** | | | |
| **Administrators** | | | |

### Success Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| **Monthly Active Users** | | |
| **Form Submissions/Month** | | |
| **Self-Service Rate** | | |

---

## 3. Site Design & Branding

### What Is It?
Visual design and branding ensure the site looks professional and aligns with your organization's identity.

**📖 Learn More:** [Style Your Site](https://learn.microsoft.com/en-us/power-pages/getting-started/style-site)

### Template Selection

| Template | Description | Your Choice |
|----------|-------------|-------------|
| **Blank** | Start from scratch | ☐ |
| **Starter Layouts** | Pre-designed layouts | ☐ |
| **Program Registration** | Event sign-ups | ☐ |
| **Application Processing** | Forms and submissions | ☐ |

### Branding Elements

| Element | Specification | Notes |
|---------|---------------|-------|
| **Logo** | | File: |
| **Favicon** | | |
| **Primary Color** | | Hex: |
| **Secondary Color** | | Hex: |
| **Font Family** | | |

### Government Templates

| Template | Use? | Notes |
|----------|------|-------|
| **GCWeb (Canada)** | ☐ Yes ☐ No ☐ N/A | Government of Canada standard |
| **USWDS (US)** | ☐ Yes ☐ No ☐ N/A | US Web Design System |

### Design Requirements

| Requirement | Implement? | Notes |
|-------------|------------|-------|
| **Responsive Design** | ☐ Yes ☐ No | Works on all devices |
| **Custom CSS** | ☐ Yes ☐ No | |
| **Custom JavaScript** | ☐ Yes ☐ No | |
| **Brand Guidelines** | ☐ Yes ☐ No | Provide guidelines |

---

## 4. Authentication & Identity (SSO)

### What Is It?
Authentication controls how users prove their identity. Power Pages supports multiple identity providers including Single Sign-On (SSO) with Azure AD, SAML, and social logins.

**📖 Learn More:** [Authentication Overview](https://learn.microsoft.com/en-us/power-pages/security/authentication/configure-site)

### Authentication Strategy

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Allow anonymous (unauthenticated) access? | ☐ Yes ☐ No | |
| What pages require authentication? | | |
| Is Single Sign-On (SSO) required? | ☐ Yes ☐ No | |
| Allow self-registration? | ☐ Yes ☐ No | |

### Identity Providers

| Provider | Description | Enable? | Notes |
|----------|-------------|---------|-------|
| **Local Authentication** | Username/password in Dataverse | ☐ Yes ☐ No | |
| **Azure AD (Entra ID)** | Microsoft organizational SSO | ☐ Yes ☐ No | Tenant: |
| **Azure AD B2C** | Customer identity platform | ☐ Yes ☐ No | |
| **Microsoft Account** | Personal Microsoft accounts | ☐ Yes ☐ No | |
| **Google** | Google account login | ☐ Yes ☐ No | |
| **Facebook** | Facebook login | ☐ Yes ☐ No | |
| **LinkedIn** | LinkedIn login | ☐ Yes ☐ No | |
| **SAML 2.0** | Enterprise SSO federation | ☐ Yes ☐ No | IdP: |
| **OpenID Connect** | Custom OIDC provider | ☐ Yes ☐ No | Provider: |
| **WS-Federation** | Legacy federation (ADFS) | ☐ Yes ☐ No | |

### Single Sign-On (SSO) Configuration

| Question | Your Answer | Notes |
|----------|-------------|-------|
| SSO Identity Provider? | | |
| Same IdP as internal employees? | ☐ Yes ☐ No | |
| Federation metadata URL? | | |
| Required claims/attributes? | | |
| Test SSO in sandbox first? | ☐ Yes ☐ No | |

### Authentication Settings

| Setting | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Multi-Factor Authentication** | Require MFA | ☐ ENABLE ☐ N/A | |
| **Session Timeout** | Auto-logout time | | Minutes: |
| **Remember Me** | Keep users logged in | ☐ ENABLE ☐ DISABLE | |
| **CAPTCHA on Login** | Prevent bots | ☐ ENABLE ☐ DISABLE | |

---

## 5. User Registration & Profiles

### What Is It?
Registration controls how new users sign up. Profile pages let users manage their information.

**📖 Learn More:** [Configure Registration](https://learn.microsoft.com/en-us/power-pages/security/authentication/set-authentication-identity)

### Registration Configuration

| Feature | Your Decision | Notes |
|---------|---------------|-------|
| **Open Registration** | ☐ ENABLE ☐ DISABLE | Anyone can sign up |
| **Invitation Only** | ☐ ENABLE ☐ DISABLE | Require invite |
| **Email Verification** | ☐ ENABLE ☐ DISABLE | Confirm email |
| **CAPTCHA** | ☐ ENABLE ☐ DISABLE | Block bots |
| **Terms & Conditions** | ☐ ENABLE ☐ DISABLE | Accept before register |

### Registration Fields

| Field | Include? | Required? | Notes |
|-------|----------|-----------|-------|
| **Email** | ☐ Yes | ☐ Yes ☐ No | |
| **First Name** | ☐ Yes ☐ No | ☐ Yes ☐ No | |
| **Last Name** | ☐ Yes ☐ No | ☐ Yes ☐ No | |
| **Phone** | ☐ Yes ☐ No | ☐ Yes ☐ No | |
| **Company** | ☐ Yes ☐ No | ☐ Yes ☐ No | |
| **Custom:** | ☐ Yes ☐ No | ☐ Yes ☐ No | |

### Profile Management

| Feature | Enable? | Notes |
|---------|---------|-------|
| **View Profile** | ☐ Yes ☐ No | |
| **Edit Profile** | ☐ Yes ☐ No | |
| **Change Password** | ☐ Yes ☐ No | |
| **Delete Account** | ☐ Yes ☐ No | GDPR requirement |

---

## 6. Web Roles & Permissions

### What Is It?
Web Roles determine what content and data users can access — like permission groups.

**📖 Learn More:** [Configure Web Roles](https://learn.microsoft.com/en-us/power-pages/security/create-web-roles)

### Web Roles to Create

| Role Name | Description | Auto-Assign? | Notes |
|-----------|-------------|--------------|-------|
| **Anonymous Users** | Not logged in | Yes (default) | |
| **Authenticated Users** | Logged in | Yes (default) | |
| | | ☐ Yes ☐ No | |
| | | ☐ Yes ☐ No | |

### Table Permissions

| Table | Role | Create | Read | Update | Delete | Scope |
|-------|------|--------|------|--------|--------|-------|
| | | ☐ | ☐ | ☐ | ☐ | ☐ Global ☐ Contact ☐ Account |
| | | ☐ | ☐ | ☐ | ☐ | ☐ Global ☐ Contact ☐ Account |
| | | ☐ | ☐ | ☐ | ☐ | ☐ Global ☐ Contact ☐ Account |

### Scope Explained

| Scope | User Can Access |
|-------|-----------------|
| **Global** | All records |
| **Contact** | Records linked to their contact |
| **Account** | Records linked to their company |
| **Self** | Only their own record |

---

## 7. Page Structure & Navigation

### What Is It?
Site structure defines pages and navigation. Good information architecture helps users find content quickly.

**📖 Learn More:** [Create Pages](https://learn.microsoft.com/en-us/power-pages/getting-started/create-manage-pages)

### Site Map

| Page Name | Parent | URL Path | Access | Notes |
|-----------|--------|----------|--------|-------|
| **Home** | (Root) | / | ☐ Public ☐ Auth | |
| | | | ☐ Public ☐ Auth | |
| | | | ☐ Public ☐ Auth | |
| | | | ☐ Public ☐ Auth | |
| | | | ☐ Public ☐ Auth | |

### Navigation Menus

| Menu | Location | Items |
|------|----------|-------|
| **Primary** | Header | |
| **Footer** | Footer | |
| **User Menu** | Header (logged in) | |

### Special Pages

| Page | Include? | Customize? |
|------|----------|------------|
| **Login** | ☐ Yes | ☐ Yes ☐ No |
| **Register** | ☐ Yes | ☐ Yes ☐ No |
| **Profile** | ☐ Yes | ☐ Yes ☐ No |
| **404 Error** | ☐ Yes | ☐ Yes ☐ No |
| **Access Denied** | ☐ Yes | ☐ Yes ☐ No |

---

## 8. Forms & Data Capture

### What Is It?
Forms allow users to submit information stored in Dataverse — service requests, applications, feedback.

**📖 Learn More:** [Add Forms](https://learn.microsoft.com/en-us/power-pages/getting-started/add-form)

### Forms to Create

| Form Name | Dataverse Table | Purpose | Notes |
|-----------|-----------------|---------|-------|
| | | | |
| | | | |
| | | | |

### Form Features

| Feature | Use? | Notes |
|---------|------|-------|
| **Basic Form** | ☐ Yes | Single-step |
| **Multistep Form** | ☐ Yes | Wizard-style |
| **Attachments** | ☐ Yes | File uploads |
| **CAPTCHA** | ☐ Yes | Spam prevention |
| **Custom Validation** | ☐ Yes | JavaScript |
| **Email on Submit** | ☐ Yes | Notifications |

---

## 9. Lists & Data Display

### What Is It?
Lists display Dataverse records in table/grid format for viewing, searching, and filtering.

**📖 Learn More:** [Add Lists](https://learn.microsoft.com/en-us/power-pages/getting-started/add-list)

### Lists to Create

| List Name | Table | Purpose | Notes |
|-----------|-------|---------|-------|
| | | | |
| | | | |

### List Features

| Feature | Use? | Notes |
|---------|------|-------|
| **Pagination** | ☐ Yes ☐ No | Records per page: |
| **Search** | ☐ Yes ☐ No | |
| **Filtering** | ☐ Yes ☐ No | |
| **Sorting** | ☐ Yes ☐ No | |
| **Export to Excel** | ☐ Yes ☐ No | |
| **Create New** | ☐ Yes ☐ No | |
| **Edit Records** | ☐ Yes ☐ No | |

---

## 10. Document Management

### What Is It?
Allow users to upload, download, and manage documents through the portal.

**📖 Learn More:** [Document Management](https://learn.microsoft.com/en-us/power-pages/configure/manage-sharepoint-documents)

### Document Storage

| Option | Your Choice | Notes |
|--------|-------------|-------|
| **Dataverse Notes** | ☐ | Simple attachments |
| **SharePoint** | ☐ | Full document management |

### Document Features

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Upload** | ☐ Yes ☐ No | |
| **Download** | ☐ Yes ☐ No | |
| **Preview** | ☐ Yes ☐ No | |
| **Delete** | ☐ Yes ☐ No | |
| **File Type Limits** | ☐ Yes ☐ No | Types: |
| **Size Limits** | ☐ Yes ☐ No | Max MB: |

---

## 11. Copilot Studio Agents (Chatbots)

### What Is It?
Add AI-powered chatbots (Copilot Studio agents) to your site for self-service support, guided navigation, and automated assistance.

**📖 Learn More:** [Add Copilot to Power Pages](https://learn.microsoft.com/en-us/power-pages/getting-started/add-chatbot)

### Chatbot Decision

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Add a chatbot? | ☐ Yes ☐ No | |
| What should it help with? | | |
| Available to anonymous users? | ☐ Yes ☐ No | |

### Chatbot Capabilities

| Capability | Include? | Notes |
|------------|----------|-------|
| **FAQ Responses** | ☐ Yes ☐ No | Answer common questions |
| **Navigate to Pages** | ☐ Yes ☐ No | Guide users |
| **Form Assistance** | ☐ Yes ☐ No | Help complete forms |
| **Record Lookup** | ☐ Yes ☐ No | Find user's data |
| **Create Cases** | ☐ Yes ☐ No | Submit requests |
| **Book Appointments** | ☐ Yes ☐ No | Scheduling |
| **Hand-off to Human** | ☐ Yes ☐ No | Transfer to live agent |
| **Generative AI** | ☐ Yes ☐ No | AI-generated answers |

### Chatbot Topics

| Topic | Trigger Phrases | Action | Notes |
|-------|-----------------|--------|-------|
| **Greeting** | Hi, Hello | Welcome | |
| | | | |
| | | | |

### Chatbot Placement

| Location | Include? |
|----------|----------|
| **All Pages** | ☐ Yes ☐ No |
| **Home Only** | ☐ Yes ☐ No |
| **Support Pages** | ☐ Yes ☐ No |

---

## 12. Accessibility (WCAG Compliance)

### What Is It?
Accessibility ensures your site can be used by people with disabilities. WCAG is the international standard. Many organizations (especially government) are legally required to meet accessibility standards.

**📖 Learn More:** [Accessibility in Power Pages](https://learn.microsoft.com/en-us/power-pages/admin/accessibility)

### Accessibility Requirements

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Required standard? | ☐ WCAG 2.0 AA ☐ WCAG 2.1 AA ☐ Section 508 | |
| Certification required? | ☐ Yes ☐ No | |
| VPAT documentation needed? | ☐ Yes ☐ No | |
| Who performs testing? | | |

### Accessibility Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| **All images have alt text** | ☐ | |
| **Videos have captions** | ☐ | |
| **Color contrast 4.5:1** | ☐ | |
| **Keyboard navigation works** | ☐ | |
| **Focus indicators visible** | ☐ | |
| **Form inputs have labels** | ☐ | |
| **Error messages clear** | ☐ | |
| **Proper heading hierarchy** | ☐ | H1-H6 |
| **Descriptive link text** | ☐ | |
| **Page language declared** | ☐ | |
| **Skip to content link** | ☐ | |
| **Text resizes to 200%** | ☐ | |
| **No flashing content** | ☐ | Seizure triggers |

### Accessibility Testing

| Method | Use? | Notes |
|--------|------|-------|
| **Automated Tools** (WAVE, axe) | ☐ Yes ☐ No | |
| **Screen Reader Testing** | ☐ Yes ☐ No | |
| **Keyboard-Only Testing** | ☐ Yes ☐ No | |
| **Expert Review** | ☐ Yes ☐ No | |
| **User Testing** | ☐ Yes ☐ No | |

---

## 13. Multi-Language Support

### What Is It?
Present content in multiple languages based on user preference.

**📖 Learn More:** [Enable Multiple Languages](https://learn.microsoft.com/en-us/power-pages/configure/enable-multiple-language-support)

### Language Requirements

| Question | Your Answer |
|----------|-------------|
| Multi-language needed? | ☐ Yes ☐ No |
| Default language? | |
| Additional languages? | |
| Language selection method? | ☐ Browser ☐ User choice ☐ URL |

### Languages

| Language | Code | Content | UI | Notes |
|----------|------|---------|-----|-------|
| **English** | en | ☐ | ☐ | Default |
| **French** | fr | ☐ | ☐ | |
| | | ☐ | ☐ | |

---

## 14. Search Configuration

### What Is It?
Allow users to search across site content and data.

**📖 Learn More:** [Configure Search](https://learn.microsoft.com/en-us/power-pages/configure/search)

### Search Features

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Global Search** | ☐ Yes ☐ No | |
| **Search Pages** | ☐ Yes ☐ No | |
| **Search Records** | ☐ Yes ☐ No | Tables: |
| **Autocomplete** | ☐ Yes ☐ No | |
| **Faceted Search** | ☐ Yes ☐ No | Filter categories |

---

## 15. Security Configuration

### What Is It?
Protect the site from attacks and unauthorized access.

**📖 Learn More:** [Security in Power Pages](https://learn.microsoft.com/en-us/power-pages/security/power-pages-security)

### Security Features

| Feature | Enable? | Notes |
|---------|---------|-------|
| **HTTPS Only** | ☐ Yes (Required) | |
| **HSTS Header** | ☐ Yes ☐ No | |
| **Content Security Policy** | ☐ Yes ☐ No | |
| **X-Frame-Options** | ☐ Yes ☐ No | Clickjacking |
| **Web Application Firewall** | ☐ Yes ☐ No | |
| **IP Restrictions** | ☐ Yes ☐ No | |
| **Bot Protection** | ☐ Yes ☐ No | |

### Security Testing

| Test | Frequency | Notes |
|------|-----------|-------|
| **Vulnerability Scan** | | |
| **Penetration Test** | | |
| **Site Checker** | | Built-in tool |

---

## 16. Custom Domain & SSL

### What Is It?
Use your own domain (portal.company.com) instead of the default Microsoft URL.

**📖 Learn More:** [Add Custom Domain](https://learn.microsoft.com/en-us/power-pages/admin/add-custom-domain)

### Domain Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| **Default URL** | | *.powerappsportals.com |
| **Custom Domain** | | |
| **SSL Certificate** | ☐ Microsoft ☐ Custom | |

### DNS Records

| Type | Host | Value |
|------|------|-------|
| **CNAME** | | |
| **TXT** | | Verification |

---

## 17. Performance & Caching

### What Is It?
Optimize load times and user experience through caching and performance tuning.

**📖 Learn More:** [Performance Best Practices](https://learn.microsoft.com/en-us/power-pages/admin/portal-checker)

### Performance Targets

| Metric | Target |
|--------|--------|
| **Page Load Time** | sec |
| **Mobile Performance** | |

### Caching

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Page Caching** | ☐ Yes ☐ No | Duration: |
| **Header/Footer Cache** | ☐ Yes ☐ No | |
| **CDN** | ☐ Yes ☐ No | |

---

## 18. Integration & APIs

### What Is It?
Connect Power Pages to external systems through APIs and automations.

**📖 Learn More:** [Web API](https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview)

### Integrations

| System | Type | Purpose | Notes |
|--------|------|---------|-------|
| | | | |
| | | | |

### API Configuration

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Web API** | ☐ Yes ☐ No | REST access |
| **Power Automate** | ☐ Yes ☐ No | Workflows |

---

## 19. Analytics & Monitoring

### What Is It?
Track how users interact with the site.

**📖 Learn More:** [Portal Analytics](https://learn.microsoft.com/en-us/power-pages/admin/portal-analytics-dashboard)

### Analytics Tools

| Tool | Enable? | Notes |
|------|---------|-------|
| **Power Pages Analytics** | ☐ Yes ☐ No | Built-in |
| **Google Analytics** | ☐ Yes ☐ No | ID: |
| **Application Insights** | ☐ Yes ☐ No | |

### Metrics to Track

| Metric | Track? |
|--------|--------|
| **Page Views** | ☐ Yes ☐ No |
| **Unique Visitors** | ☐ Yes ☐ No |
| **Form Submissions** | ☐ Yes ☐ No |
| **Search Terms** | ☐ Yes ☐ No |
| **Chatbot Usage** | ☐ Yes ☐ No |

---

## 20. Compliance & Privacy

### What Is It?
Meet regulatory requirements for data protection and privacy.

### Privacy Requirements

| Requirement | Implement? |
|-------------|------------|
| **Privacy Policy Page** | ☐ Yes ☐ No |
| **Cookie Consent** | ☐ Yes ☐ No |
| **Terms of Service** | ☐ Yes ☐ No |
| **Data Subject Requests** | ☐ Yes ☐ No |

### Compliance Standards

| Standard | Applicable? | Notes |
|----------|-------------|-------|
| **GDPR** | ☐ Yes ☐ No | |
| **PIPEDA** | ☐ Yes ☐ No | Canada |
| **CCPA** | ☐ Yes ☐ No | California |
| **HIPAA** | ☐ Yes ☐ No | Healthcare |

---

## 21. Testing & Go-Live

### Testing Checklist

| Test | Status | Tested By |
|------|--------|-----------|
| **Functionality** | ☐ | |
| **Cross-Browser** | ☐ | |
| **Mobile** | ☐ | |
| **Accessibility** | ☐ | |
| **Performance** | ☐ | |
| **Security** | ☐ | |
| **User Acceptance** | ☐ | |

### Go-Live Checklist

| Task | Status |
|------|--------|
| **Custom Domain** | ☐ |
| **SSL Active** | ☐ |
| **Analytics Configured** | ☐ |
| **Monitoring Enabled** | ☐ |
| **Support Process Ready** | ☐ |

---

## 22. Sign-Off & Approval

### Approval Signatures

**Business Owner:**

Name: _______________________________________________ Date: _______________

**Technical Lead:**

Name: _______________________________________________ Date: _______________

**Implementation Partner (Cloudstrucc Inc.):**

Name: _______________________________________________ Date: _______________

---

## Appendix: Microsoft Documentation Links

| Topic | URL |
|-------|-----|
| Power Pages Overview | https://learn.microsoft.com/en-us/power-pages/introduction |
| Authentication | https://learn.microsoft.com/en-us/power-pages/security/authentication/configure-site |
| Web Roles | https://learn.microsoft.com/en-us/power-pages/security/create-web-roles |
| Table Permissions | https://learn.microsoft.com/en-us/power-pages/security/table-permissions |
| Forms | https://learn.microsoft.com/en-us/power-pages/getting-started/add-form |
| Lists | https://learn.microsoft.com/en-us/power-pages/getting-started/add-list |
| Copilot/Chatbot | https://learn.microsoft.com/en-us/power-pages/getting-started/add-chatbot |
| Accessibility | https://learn.microsoft.com/en-us/power-pages/admin/accessibility |
| Multi-Language | https://learn.microsoft.com/en-us/power-pages/configure/enable-multiple-language-support |
| Custom Domain | https://learn.microsoft.com/en-us/power-pages/admin/add-custom-domain |
| Security | https://learn.microsoft.com/en-us/power-pages/security/power-pages-security |
| Web API | https://learn.microsoft.com/en-us/power-pages/configure/web-api-overview |

---

## Glossary

| Term | Definition |
|------|------------|
| **Web Role** | Permission group for site users |
| **Table Permission** | Data access control |
| **SSO** | Single Sign-On |
| **WCAG** | Web Content Accessibility Guidelines |
| **Copilot Studio** | Microsoft's chatbot platform |
| **Dataverse** | Database behind Power Pages |
| **Liquid** | Templating language |

---

*Document prepared by Cloudstrucc Inc.*