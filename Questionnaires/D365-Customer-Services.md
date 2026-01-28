# Dynamics 365 Customer Service Implementation Checklist

**Client Name:** _______________________________________________  
**Implementation Partner:** Cloudstrucc Inc.  
**Project Start Date:** _______________________________________________  
**Target Go-Live Date:** _______________________________________________  
**Prepared By:** _______________________________________________  
**Version:** 1.0  
**Last Updated:** _______________________________________________

---

## How to Use This Document

This checklist is designed to help you get the most out of your Dynamics 365 Customer Service investment. For each feature or consideration, please indicate your preference:

| Response | Meaning |
|----------|---------|
| **OOB** | Out of Box — Keep the default Microsoft configuration as-is |
| **N/A** | Not Applicable — This feature does not apply to your business |
| **CUSTOMIZE** | You want changes made to this feature (provide details in Notes) |
| **ENABLE** | You want this feature turned on |
| **DISABLE** | You want this feature turned off |

---

## Table of Contents

1. [Navigation & User Interface](#1-navigation--user-interface)
2. [Dashboards & Analytics](#2-dashboards--analytics)
3. [Case Management](#3-case-management)
4. [Queues & Routing](#4-queues--routing)
5. [Service Level Agreements (SLAs)](#5-service-level-agreements-slas)
6. [Entitlements & Service Contracts](#6-entitlements--service-contracts)
7. [Knowledge Management](#7-knowledge-management)
8. [Email Integration](#8-email-integration)
9. [Microsoft Teams Integration](#9-microsoft-teams-integration)
10. [SharePoint Integration](#10-sharepoint-integration)
11. [Word & Excel Templates](#11-word--excel-templates)
12. [Customer Service Hub & Workspace](#12-customer-service-hub--workspace)
13. [Copilot AI Integration](#13-copilot-ai-integration)
14. [Customer Voice (Surveys)](#14-customer-voice-surveys)
15. [Forms & Data Entry](#15-forms--data-entry)
16. [Views & Data Display](#16-views--data-display)
17. [Data Retention & Disposition](#17-data-retention--disposition)
18. [Security Model & Access Control](#18-security-model--access-control)
19. [Reporting & Power BI](#19-reporting--power-bi)
20. [Training & Adoption](#20-training--adoption)
21. [Sign-Off & Approval](#21-sign-off--approval)

---

## 1. Navigation & User Interface

### What Is It?
The navigation menu is how your service team moves around the application. It provides quick access to Cases, Accounts, Contacts, Knowledge Articles, Queues, and Reports.

**📖 Learn More:** [Customer Service Hub Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/customer-service-hub-user-guide-basics)

### Key Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Site Map (Left Navigation)** | The vertical menu controlling what areas appear | ☐ OOB ☐ CUSTOMIZE | |
| **Area Switcher** | Dropdown to switch between Service, Settings, etc. | ☐ OOB ☐ CUSTOMIZE | |
| **Recent Items** | Shows recently viewed records | ☐ OOB ☐ DISABLE | |
| **Pinned Items** | Allows pinning frequently used records | ☐ OOB ☐ DISABLE | |
| **Quick Create** | The "+" button for rapid record creation | ☐ OOB ☐ CUSTOMIZE | |
| **Global Search** | Search across all record types | ☐ OOB ☐ CUSTOMIZE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Which menu items should be visible to service agents? | | |
| Should supervisors see different navigation than agents? | ☐ Yes ☐ No | |
| Are there menu items that should be hidden from view? | | |

---

## 2. Dashboards & Analytics

### What Is It?
Dashboards provide at-a-glance visibility into service operations — case volumes, agent performance, SLA compliance, and customer satisfaction metrics.

**📖 Learn More:** [Dashboards in Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/customer-service-hub-user-guide-dashboard)

### Available Dashboard Types

| Dashboard | Description | Your Decision | Notes |
|-----------|-------------|---------------|-------|
| **Tier 1 Dashboard** | Overview for frontline agents | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Tier 2 Dashboard** | Escalation team view | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Customer Service Manager Dashboard** | Team performance and SLA tracking | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Knowledge Manager Dashboard** | Article usage and gaps | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Omnichannel Insights Dashboard** | Real-time conversation metrics | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |

### Key Metrics to Display

| Metric | Include? | Notes |
|--------|----------|-------|
| **Open Cases by Priority** | ☐ Yes ☐ No | |
| **Cases by Status** | ☐ Yes ☐ No | |
| **SLA Compliance Rate** | ☐ Yes ☐ No | |
| **Average Resolution Time** | ☐ Yes ☐ No | |
| **Cases Created Today** | ☐ Yes ☐ No | |
| **My Active Cases** | ☐ Yes ☐ No | |
| **Escalated Cases** | ☐ Yes ☐ No | |
| **Customer Satisfaction Score** | ☐ Yes ☐ No | |
| **First Contact Resolution Rate** | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What metrics matter most for day-to-day agent work? | | |
| What KPIs do supervisors need to monitor? | | |
| Should real-time vs. daily refreshed data be used? | ☐ Real-time ☐ Daily | |

---

## 3. Case Management

### What Is It?
Cases are the core of customer service — they track customer issues from initial report through to resolution. Proper case configuration ensures issues are categorized, prioritized, and routed correctly.

**📖 Learn More:** [Case Management Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/customer-service-hub-user-guide-create-a-case)

### Case Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Case Origin** | Where cases come from (Phone, Email, Web, Chat, etc.) | ☐ OOB ☐ CUSTOMIZE | Origins to add: |
| **Case Type** | Categories of issues (Question, Problem, Request, etc.) | ☐ OOB ☐ CUSTOMIZE | Types to add: |
| **Case Priority** | Urgency levels (Low, Normal, High, Critical) | ☐ OOB ☐ CUSTOMIZE | |
| **Case Status** | Workflow states (Active, Resolved, Cancelled) | ☐ OOB ☐ CUSTOMIZE | |
| **Case Status Reason** | Sub-statuses (In Progress, On Hold, Waiting on Customer) | ☐ OOB ☐ CUSTOMIZE | Reasons to add: |
| **Subject Tree** | Hierarchical categorization of issues | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |

### Case Categories/Subjects

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What are your main product/service categories? | | |
| What are the most common issue types within each category? | | |
| How many levels deep should categorization go? | ☐ 1 ☐ 2 ☐ 3+ | |

### Case Workflow

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Auto-Create from Email** | Automatically create cases from incoming emails | ☐ ENABLE ☐ DISABLE | |
| **Parent/Child Cases** | Link related cases together | ☐ ENABLE ☐ N/A | |
| **Case Merging** | Combine duplicate cases | ☐ ENABLE ☐ DISABLE | |
| **Similar Cases** | Show agents similar resolved cases | ☐ ENABLE ☐ DISABLE | |
| **Required Fields** | Force agents to fill certain fields | ☐ Yes ☐ No | Fields: |
| **Business Process Flow** | Visual guide for case handling steps | ☐ OOB ☐ CUSTOMIZE ☐ DISABLE | |

### Case Resolution

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What information is required when closing a case? | | |
| Should there be different resolution types? (Solved, Duplicate, Won't Fix, etc.) | ☐ Yes ☐ No | List types: |
| Can agents reopen resolved cases? | ☐ Yes ☐ No | |
| Is manager approval required to close certain case types? | ☐ Yes ☐ No | |
| Should resolved cases auto-close after a period? | ☐ Yes ☐ No | Days: |

---

## 4. Queues & Routing

### What Is It?
Queues are shared work pools where cases wait to be picked up by available agents. Routing rules determine which queue a case goes to based on criteria like category, priority, or customer type.

**📖 Learn More:** [Queues Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel) | [Routing Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/overview-unified-routing)

### Queue Configuration

| Queue Name | Purpose | Members/Team | Notes |
|------------|---------|--------------|-------|
| **General Support** | Default queue for unrouted cases | | |
| **Tier 1 Support** | Frontline agent queue | | |
| **Tier 2 Support** | Escalation queue | | |
| **Billing** | Billing-specific issues | | |
| **Technical Support** | Technical/product issues | | |
| _________________ | | | |
| _________________ | | | |

### Routing Rules

| Rule Name | Condition | Route To | Notes |
|-----------|-----------|----------|-------|
| Example: VIP Customers | Customer = VIP Tier | Priority Queue | |
| | | | |
| | | | |
| | | | |

### Routing Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Basic Routing** | Simple rules-based assignment | ☐ ENABLE ☐ N/A | |
| **Unified Routing** | Advanced AI-powered routing | ☐ ENABLE ☐ N/A | |
| **Skills-Based Routing** | Match cases to agent skills | ☐ ENABLE ☐ N/A | |
| **Round-Robin Assignment** | Distribute cases evenly | ☐ ENABLE ☐ DISABLE | |
| **Capacity-Based Routing** | Consider agent workload | ☐ ENABLE ☐ N/A | |
| **Queue Item Timeout** | Auto-reassign if not picked up | ☐ ENABLE ☐ N/A | Timeout: ___ mins |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| How should cases be distributed among agents? | | |
| Do certain customer types get priority routing? | ☐ Yes ☐ No | |
| Should agents pick from queues or have cases pushed to them? | ☐ Pick ☐ Push ☐ Both | |
| Are there after-hours routing requirements? | ☐ Yes ☐ No | |

---

## 5. Service Level Agreements (SLAs)

### What Is It?
SLAs define response and resolution time commitments. The system tracks these automatically and can warn agents or escalate when deadlines approach.

**📖 Learn More:** [Define SLAs](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/define-service-level-agreements)

### SLA Configuration

| SLA Name | Applies To | First Response Target | Resolution Target | Notes |
|----------|-----------|----------------------|-------------------|-------|
| **Critical Priority** | Priority = Critical | ___ hours | ___ hours | |
| **High Priority** | Priority = High | ___ hours | ___ hours | |
| **Normal Priority** | Priority = Normal | ___ hours | ___ days | |
| **Low Priority** | Priority = Low | ___ days | ___ days | |
| **VIP Customers** | Customer Tier = VIP | ___ hours | ___ hours | |
| _________________ | | | | |

### SLA Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **SLA Timer on Form** | Visual countdown on case form | ☐ ENABLE ☐ DISABLE | |
| **Warning Actions** | Notify agent when SLA at risk | ☐ ENABLE ☐ DISABLE | Threshold: ___% |
| **Breach Actions** | Escalate when SLA missed | ☐ ENABLE ☐ DISABLE | |
| **Pause on Hold** | Stop timer when case on hold | ☐ ENABLE ☐ DISABLE | |
| **Business Hours Only** | Calculate SLA in work hours only | ☐ Yes ☐ No | |
| **Holiday Calendar** | Exclude holidays from SLA time | ☐ ENABLE ☐ N/A | |

### SLA Actions

| Trigger | Action | Enable? | Notes |
|---------|--------|---------|-------|
| **First Response Warning** | Email agent | ☐ Yes ☐ No | |
| **First Response Breach** | Email supervisor | ☐ Yes ☐ No | |
| **Resolution Warning** | Email agent + supervisor | ☐ Yes ☐ No | |
| **Resolution Breach** | Escalate to manager | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you have contractual SLA commitments to customers? | ☐ Yes ☐ No | |
| What are your business hours? | | |
| Which holidays should be excluded from SLA calculations? | | |
| Who should be notified of SLA breaches? | | |

---

## 6. Entitlements & Service Contracts

### What Is It?
Entitlements define what support a customer is entitled to — how many cases, what response times, which channels. This is useful for paid support plans or warranty-based service.

**📖 Learn More:** [Entitlements Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/create-entitlement-define-support-terms-customer)

### Entitlement Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Entitlements** | Track customer support entitlements | ☐ ENABLE ☐ N/A | |
| **Entitlement Templates** | Pre-defined support packages | ☐ ENABLE ☐ N/A | |
| **Decrement Cases** | Reduce remaining cases when used | ☐ ENABLE ☐ N/A | |
| **Entitlement Channels** | Limit entitlement to specific channels | ☐ ENABLE ☐ N/A | |
| **Auto-Apply Entitlement** | Automatically select entitlement for cases | ☐ ENABLE ☐ N/A | |

### Support Tiers/Packages

| Tier Name | Cases Included | Response Time | Channels | Notes |
|-----------|----------------|---------------|----------|-------|
| **Basic** | | | | |
| **Standard** | | | | |
| **Premium** | | | | |
| **Enterprise** | | | | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you offer tiered support packages? | ☐ Yes ☐ No | |
| Should support be unlimited or case-based? | ☐ Unlimited ☐ Case-based | |
| Do entitlements expire? | ☐ Yes ☐ No | Duration: |
| How do customers renew entitlements? | | |

---

## 7. Knowledge Management

### What Is It?
A knowledge base is a library of articles that help agents solve issues faster and enable customers to self-serve. Articles can include troubleshooting steps, FAQs, policies, and procedures.

**📖 Learn More:** [Knowledge Management Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/set-up-knowledge-management-embedded-knowledge-search)

### Knowledge Base Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Knowledge Management** | Turn on knowledge base functionality | ☐ ENABLE ☐ N/A | |
| **Knowledge Search in Case Form** | Agents can search KB from case | ☐ ENABLE ☐ DISABLE | |
| **Auto-Suggest Articles** | AI suggests relevant articles | ☐ ENABLE ☐ DISABLE | |
| **Link Articles to Cases** | Track which articles resolved cases | ☐ ENABLE ☐ DISABLE | |
| **Article Feedback** | Agents rate article helpfulness | ☐ ENABLE ☐ DISABLE | |
| **Article Versioning** | Track article revisions | ☐ ENABLE ☐ DISABLE | |
| **Article Expiration** | Auto-flag outdated articles for review | ☐ ENABLE ☐ N/A | Review period: |

### Article Categories

| Category | Description | Notes |
|----------|-------------|-------|
| **Troubleshooting** | Step-by-step problem resolution | |
| **How-To** | Instructions for common tasks | |
| **FAQ** | Frequently asked questions | |
| **Policy** | Company policies and procedures | |
| **Product Information** | Product specs and features | |
| _________________ | | |

### Article Workflow

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Draft → Review → Publish** | Approval workflow for articles | ☐ ENABLE ☐ N/A | |
| **Who Can Create Articles?** | Role-based authoring | | Roles: |
| **Who Can Approve Articles?** | Review authority | | Roles: |
| **Who Can Publish Articles?** | Final publishing authority | | Roles: |

### External Knowledge Base

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Should articles be available to customers (external)? | ☐ Yes ☐ No | |
| Should there be internal-only articles? | ☐ Yes ☐ No | |
| Do you have existing knowledge content to migrate? | ☐ Yes ☐ No | Source: |
| Will articles be used by a customer portal? | ☐ Yes ☐ No | |

---

## 8. Email Integration

### What Is It?
Connect Dynamics 365 to email so that customer communications are automatically tracked on case records and agents can send/receive emails without leaving the application.

**⚠️ IMPORTANT:** We recommend connecting a **shared mailbox** (e.g., support@yourcompany.com) rather than individual user mailboxes. This ensures:
- All customer emails are tracked centrally
- Cases can be auto-created from incoming emails
- Individual mailboxes remain private

**📖 Learn More:** [Set Up Server-Side Sync](https://learn.microsoft.com/en-us/power-platform/admin/set-up-server-side-synchronization-of-email-appointments-contacts-and-tasks)

### Email Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Shared Mailbox Connection** | Connect support mailbox(es) | ☐ ENABLE ☐ N/A | Mailbox: |
| **Auto-Create Cases from Email** | New emails create cases | ☐ ENABLE ☐ DISABLE | |
| **Auto-Track Replies** | Link replies to existing cases | ☐ ENABLE ☐ DISABLE | |
| **Email Templates** | Pre-written response templates | ☐ ENABLE ☐ N/A | |
| **Email Signatures** | Standardized agent signatures | ☐ ENABLE ☐ N/A | |
| **Dynamics 365 App for Outlook** | Outlook add-in for manual tracking | ☐ ENABLE ☐ N/A | |

### Email-to-Case Rules

| Rule | Condition | Action | Notes |
|------|-----------|--------|-------|
| **New Customer Email** | No existing case found | Create new case | |
| **Reply to Existing** | Subject contains case number | Link to case | |
| **Auto-Response** | New case created | Send acknowledgment | |
| **VIP Customer** | Sender is VIP contact | Set high priority | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What email address(es) do customers use for support? | | |
| Should auto-responses be sent when cases are created? | ☐ Yes ☐ No | |
| Should emails from internal addresses create cases? | ☐ Yes ☐ No | |
| Are there spam/filter rules needed? | ☐ Yes ☐ No | |

---

## 9. Microsoft Teams Integration

### What Is It?
Collaborate on cases directly within Microsoft Teams — discuss complex issues, loop in experts, and share case information without leaving your primary communication tool.

**📖 Learn More:** [Teams Integration](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-teams-collaboration)

### Integration Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Embedded Teams Chat** | Chat with colleagues from within case | ☐ ENABLE ☐ N/A | |
| **Link Cases to Channels** | Connect cases to Teams channels | ☐ ENABLE ☐ N/A | |
| **Teams Tab for Cases** | View case info in Teams | ☐ ENABLE ☐ N/A | |
| **Swarm for Complex Cases** | Create expert swarms for difficult issues | ☐ ENABLE ☐ N/A | |
| **Teams Notifications** | Get Teams alerts for case updates | ☐ ENABLE ☐ N/A | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Does your team actively use Teams today? | ☐ Yes ☐ No | |
| Are there subject matter experts to loop in via Teams? | ☐ Yes ☐ No | |
| Should certain case types auto-create Teams channels? | ☐ Yes ☐ No | |

---

## 10. SharePoint Integration

### What Is It?
Store case-related documents (screenshots, logs, contracts) in SharePoint rather than directly in Dynamics 365. This provides better storage management and document collaboration.

**📖 Learn More:** [SharePoint Integration](https://learn.microsoft.com/en-us/power-platform/admin/manage-documents-using-sharepoint)

### Integration Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable SharePoint Integration** | Store documents in SharePoint | ☐ ENABLE ☐ N/A | |
| **Case Documents** | SharePoint folder per case | ☐ Yes ☐ No | |
| **Account Documents** | SharePoint folder per account | ☐ Yes ☐ No | |
| **Knowledge Article Attachments** | Store KB attachments in SharePoint | ☐ Yes ☐ No | |
| **Auto-Create Folders** | Create folders when records created | ☐ ENABLE ☐ DISABLE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Which SharePoint site should be used? | | Site URL: |
| What folder structure do you want? | | |
| Are there document retention requirements? | ☐ Yes ☐ No | |

---

## 11. Word & Excel Templates

### What Is It?
Generate standardized documents and reports directly from Dynamics 365 — case summaries, service reports, customer correspondence — with data automatically populated.

**📖 Learn More:** [Word Templates](https://learn.microsoft.com/en-us/power-platform/admin/using-word-templates-dynamics-365) | [Excel Templates](https://learn.microsoft.com/en-us/power-platform/admin/analyze-your-data-with-excel-templates)

### Word Templates

| Template | Purpose | Create? | Notes |
|----------|---------|---------|-------|
| **Case Summary** | Summary document for customer | ☐ Yes ☐ No | |
| **Escalation Report** | Details for management escalation | ☐ Yes ☐ No | |
| **Service Report** | Post-resolution summary | ☐ Yes ☐ No | |
| **Customer Letter** | Formal correspondence | ☐ Yes ☐ No | |
| _________________ | | ☐ Yes ☐ No | |

### Excel Templates

| Template | Purpose | Create? | Notes |
|----------|---------|---------|-------|
| **Case Export** | Export case data for analysis | ☐ Yes ☐ No | |
| **SLA Report** | SLA compliance data | ☐ Yes ☐ No | |
| **Agent Performance** | Individual agent metrics | ☐ Yes ☐ No | |
| _________________ | | ☐ Yes ☐ No | |

---

## 12. Customer Service Hub & Workspace

### What Is It?
Microsoft offers two main interfaces: **Customer Service Hub** (standard interface) and **Customer Service Workspace** (multi-session, productivity-focused). Workspace is recommended for high-volume service teams.

**📖 Learn More:** [Customer Service Workspace](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/csw-overview)

### Interface Selection

| Feature | Hub | Workspace | Your Choice | Notes |
|---------|-----|-----------|-------------|-------|
| **Single-Session** | ✓ | | ☐ Hub | |
| **Multi-Session (Tabs)** | | ✓ | ☐ Workspace | |
| **Productivity Pane** | | ✓ | | |
| **Smart Assist** | | ✓ | | |
| **Agent Scripts** | | ✓ | | |
| **Inbox View** | | ✓ | | |

### Workspace Features (If Selected)

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Multi-Session Tabs** | Work multiple cases simultaneously | ☐ ENABLE ☐ N/A | |
| **Productivity Pane** | Side panel with tools and scripts | ☐ ENABLE ☐ N/A | |
| **Smart Assist** | AI-powered suggestions | ☐ ENABLE ☐ N/A | |
| **Agent Scripts** | Guided conversation scripts | ☐ ENABLE ☐ N/A | |
| **Macros** | One-click automation for common tasks | ☐ ENABLE ☐ N/A | |
| **Inbox** | Unified view of assigned work | ☐ ENABLE ☐ N/A | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| How many cases do agents typically work simultaneously? | | |
| Do agents need guided scripts for calls? | ☐ Yes ☐ No | |
| Would productivity tools (macros, templates) save time? | ☐ Yes ☐ No | |

---

## 13. Copilot AI Integration

### What Is It?
Microsoft Copilot uses AI to help agents work more efficiently — drafting responses, summarizing cases, suggesting knowledge articles, and answering questions about case history.

**📖 Learn More:** [Copilot in Customer Service](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features)

### Copilot Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Copilot** | Turn on AI assistance | ☐ ENABLE ☐ DISABLE ☐ N/A | |
| **Case Summarization** | AI-generated case summaries | ☐ ENABLE ☐ DISABLE | |
| **Draft Email Responses** | AI helps write replies | ☐ ENABLE ☐ DISABLE | |
| **Suggest Knowledge Articles** | AI recommends relevant articles | ☐ ENABLE ☐ DISABLE | |
| **Conversation Summary** | Summarize chat/call transcripts | ☐ ENABLE ☐ DISABLE | |
| **Ask a Question** | Natural language queries about cases | ☐ ENABLE ☐ DISABLE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Is your organization comfortable with AI processing case data? | ☐ Yes ☐ No | |
| Should AI responses require agent review before sending? | ☐ Yes ☐ No | |
| Do you want to pilot with a subset of agents first? | ☐ Yes ☐ No | |

---

## 14. Customer Voice (Surveys)

### What Is It?
Send satisfaction surveys after case resolution to measure customer experience and identify improvement opportunities.

**📖 Learn More:** [Customer Voice Overview](https://learn.microsoft.com/en-us/dynamics365/customer-voice/about)

### Survey Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Customer Voice** | Use built-in survey functionality | ☐ ENABLE ☐ N/A | |
| **Post-Resolution Survey** | Auto-send survey when case closed | ☐ ENABLE ☐ N/A | |
| **CSAT Question** | Customer satisfaction rating | ☐ Yes ☐ No | Scale: |
| **NPS Question** | Net Promoter Score | ☐ Yes ☐ No | |
| **Open-Ended Feedback** | Free-text comments | ☐ Yes ☐ No | |
| **Link Responses to Cases** | Track which case prompted survey | ☐ ENABLE ☐ DISABLE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you currently measure customer satisfaction? | ☐ Yes ☐ No | Current tool: |
| Should surveys go to all customers or sampling? | ☐ All ☐ Sample | |
| What questions are most important to ask? | | |
| Who should review survey responses? | | |

---

## 15. Forms & Data Entry

### What Is It?
Forms are the screens where agents view and enter case information. Well-designed forms show the right information in a logical order, improving agent efficiency.

**📖 Learn More:** [Customize Forms](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-design-forms)

### Forms to Configure

| Form | Description | Your Decision | Notes |
|------|-------------|---------------|-------|
| **Case Form** | Main case data entry form | ☐ OOB ☐ CUSTOMIZE | |
| **Account Form** | Customer organization information | ☐ OOB ☐ CUSTOMIZE | |
| **Contact Form** | Individual customer information | ☐ OOB ☐ CUSTOMIZE | |
| **Knowledge Article Form** | Article authoring form | ☐ OOB ☐ CUSTOMIZE | |
| **Activity Forms** | Phone Call, Email, Task forms | ☐ OOB ☐ CUSTOMIZE | |

### Case Form Customization

| Customization | Description | Your Decision | Notes |
|---------------|-------------|---------------|-------|
| **Add Custom Fields** | New data points to capture | ☐ Yes ☐ No | Fields: |
| **Remove Unused Fields** | Hide irrelevant fields | ☐ Yes ☐ No | Fields: |
| **Rearrange Sections** | Change information grouping | ☐ Yes ☐ No | |
| **Required Fields** | Mandatory data entry | ☐ Yes ☐ No | Fields: |
| **Business Rules** | Conditional logic | ☐ Yes ☐ No | Rules: |
| **Timeline Configuration** | What shows in activity history | ☐ OOB ☐ CUSTOMIZE | |

---

## 16. Views & Data Display

### What Is It?
Views are filtered lists of records — like saved searches. Instead of seeing all cases, agents can see "My Active Cases" or "High Priority Cases."

**📖 Learn More:** [Create and Edit Views](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-edit-views)

### Case Views

| View Name | Filter Criteria | Create/Modify? | Notes |
|-----------|-----------------|----------------|-------|
| **My Active Cases** | Owner = Me, Status = Active | ☐ OOB ☐ CUSTOMIZE | |
| **My Resolved Cases** | Owner = Me, Status = Resolved | ☐ OOB ☐ CUSTOMIZE | |
| **All Active Cases** | Status = Active | ☐ OOB ☐ CUSTOMIZE | |
| **Cases Nearing SLA Breach** | SLA Warning = Yes | ☐ CREATE ☐ N/A | |
| **Escalated Cases** | Escalation Flag = Yes | ☐ CREATE ☐ N/A | |
| **Unassigned Cases** | Owner = Queue | ☐ CREATE ☐ N/A | |
| _________________ | | ☐ CREATE ☐ N/A | |

### View Customization

| Option | Description | Your Decision | Notes |
|--------|-------------|---------------|-------|
| **Add/Remove Columns** | Control visible information | ☐ CUSTOMIZE ☐ OOB | |
| **Default Sorting** | How records are ordered | ☐ CUSTOMIZE ☐ OOB | |
| **Personal Views** | Allow agents to create own views | ☐ ENABLE ☐ DISABLE | |

---

## 17. Data Retention & Disposition

### What Is It?
Policies for how long case data is kept and what happens to old records. Important for compliance, storage management, and system performance.

**📖 Learn More:** [Data Retention](https://learn.microsoft.com/en-us/power-platform/admin/data-retention-overview)

### Retention by Record Type

| Record Type | Keep Active | Archive After | Delete After | Notes |
|-------------|-------------|---------------|--------------|-------|
| **Resolved Cases** | ___ months | ___ years | ___ years | |
| **Cancelled Cases** | ___ months | ___ years | ___ years | |
| **Activities (Emails)** | ___ years | ___ years | ___ years | |
| **Knowledge Articles** | Indefinitely | N/A | When retired | |
| **Survey Responses** | ___ years | ___ years | ___ years | |
| **Notes & Attachments** | Follow case | | | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Are there legal requirements for case retention? | ☐ Yes ☐ No | |
| Should resolved cases remain searchable? | ☐ Yes ☐ No | Duration: |
| Is there a legal hold process? | ☐ Yes ☐ No | |

---

## 18. Security Model & Access Control

### What Is It?
Security controls who can see, create, edit, and delete different types of records. Ensures agents see appropriate cases while protecting sensitive information.

**📖 Learn More:** [Security Roles](https://learn.microsoft.com/en-us/power-platform/admin/security-roles-privileges)

### Security Roles

| Role | Permissions | Your Decision | Notes |
|------|-------------|---------------|-------|
| **Customer Service Agent** | Work own cases, read team cases | ☐ OOB ☐ CUSTOMIZE | |
| **Customer Service Manager** | Full access to team cases, reports | ☐ OOB ☐ CUSTOMIZE | |
| **Knowledge Manager** | Create/publish knowledge articles | ☐ OOB ☐ CUSTOMIZE | |
| **Customer Service Admin** | System configuration, all data | ☐ OOB ☐ CUSTOMIZE | |

### Access Decisions

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Should agents see only their own cases? | ☐ Yes ☐ No ☐ Team | |
| Should agents see all customer information? | ☐ Yes ☐ No | |
| Who can delete cases? | ☐ Agents ☐ Managers ☐ Admins | |
| Who can create knowledge articles? | | |
| Are there sensitive fields to restrict? | ☐ Yes ☐ No | Fields: |

---

## 19. Reporting & Power BI

### What Is It?
Beyond dashboards, you may need detailed reports for management, compliance, or analysis. Power BI provides advanced analytics and visualization capabilities.

**📖 Learn More:** [Customer Service Analytics](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/customer-service-analytics-insights-csh)

### Reporting Needs

| Report | Purpose | Create? | Notes |
|--------|---------|---------|-------|
| **Case Volume Report** | Cases by time period, category, agent | ☐ Yes ☐ No | |
| **SLA Compliance Report** | SLA performance tracking | ☐ Yes ☐ No | |
| **Agent Performance Report** | Individual/team metrics | ☐ Yes ☐ No | |
| **Customer Satisfaction Report** | CSAT/NPS trends | ☐ Yes ☐ No | |
| **First Contact Resolution** | FCR rates by category | ☐ Yes ☐ No | |
| **Knowledge Article Usage** | Article effectiveness | ☐ Yes ☐ No | |
| _________________ | | ☐ Yes ☐ No | |

### Power BI Integration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Embed Power BI Dashboards** | Show Power BI in Dynamics | ☐ ENABLE ☐ N/A | |
| **Historical Analytics** | Long-term trend analysis | ☐ ENABLE ☐ N/A | |
| **Real-Time Dashboards** | Live operational metrics | ☐ ENABLE ☐ N/A | |

---

## 20. Training & Adoption

### What Is It?
Ensuring your team knows how to use the system effectively is critical to success.

**📖 Learn More:** [Customer Service Training](https://learn.microsoft.com/en-us/training/dynamics365/customer-service)

### Training Needs

| User Group | Topics | Format | Notes |
|------------|--------|--------|-------|
| **Agents** | Case handling, knowledge search, SLAs | ☐ Live ☐ Video ☐ Written | |
| **Supervisors** | Dashboards, reporting, queue management | ☐ Live ☐ Video ☐ Written | |
| **Knowledge Authors** | Article creation, workflow | ☐ Live ☐ Video ☐ Written | |
| **Administrators** | Configuration, user management | ☐ Live ☐ Video ☐ Written | |

### Adoption Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Daily Active Users | | |
| Cases Resolved per Day | | |
| Knowledge Article Usage | | |
| SLA Compliance Rate | | |

---

## 21. Sign-Off & Approval

### Section Completion

| Section | Reviewed By | Date | Status |
|---------|-------------|------|--------|
| 1. Navigation | | | ☐ Complete |
| 2. Dashboards | | | ☐ Complete |
| 3. Case Management | | | ☐ Complete |
| 4. Queues & Routing | | | ☐ Complete |
| 5. SLAs | | | ☐ Complete |
| 6. Entitlements | | | ☐ Complete |
| 7. Knowledge Management | | | ☐ Complete |
| 8. Email Integration | | | ☐ Complete |
| 9. Teams Integration | | | ☐ Complete |
| 10. SharePoint Integration | | | ☐ Complete |
| 11. Templates | | | ☐ Complete |
| 12. Hub vs Workspace | | | ☐ Complete |
| 13. Copilot | | | ☐ Complete |
| 14. Customer Voice | | | ☐ Complete |
| 15. Forms | | | ☐ Complete |
| 16. Views | | | ☐ Complete |
| 17. Data Retention | | | ☐ Complete |
| 18. Security | | | ☐ Complete |
| 19. Reporting | | | ☐ Complete |
| 20. Training | | | ☐ Complete |

### Approval Signatures

**Business Owner:**

Name: _______________________________________________ Date: _______________

**IT/Technical Lead:**

Name: _______________________________________________ Date: _______________

**Implementation Partner (Cloudstrucc Inc.):**

Name: _______________________________________________ Date: _______________

---

## Appendix: Microsoft Documentation Links

| Topic | URL |
|-------|-----|
| Customer Service Overview | https://learn.microsoft.com/en-us/dynamics365/customer-service/overview |
| Customer Service Hub | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/customer-service-hub-user-guide-basics |
| Customer Service Workspace | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/csw-overview |
| Case Management | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/customer-service-hub-user-guide-create-a-case |
| Queues | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel |
| Unified Routing | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/overview-unified-routing |
| SLAs | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/define-service-level-agreements |
| Entitlements | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/create-entitlement-define-support-terms-customer |
| Knowledge Management | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/set-up-knowledge-management-embedded-knowledge-search |
| Copilot | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features |
| Customer Voice | https://learn.microsoft.com/en-us/dynamics365/customer-voice/about |
| Security Roles | https://learn.microsoft.com/en-us/power-platform/admin/security-roles-privileges |
| Analytics | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/customer-service-analytics-insights-csh |

---

## Glossary

| Term | Definition |
|------|------------|
| **Case** | A customer issue or request being tracked |
| **Entitlement** | Support terms defining what a customer is entitled to |
| **First Contact Resolution (FCR)** | Resolving an issue on the first interaction |
| **Knowledge Article** | A document in the knowledge base |
| **Queue** | A shared pool of work items |
| **SLA** | Service Level Agreement — time commitments |
| **Routing** | Rules that assign cases to queues or agents |
| **CSAT** | Customer Satisfaction Score |
| **NPS** | Net Promoter Score |

---

*Document prepared by Cloudstrucc Inc.*