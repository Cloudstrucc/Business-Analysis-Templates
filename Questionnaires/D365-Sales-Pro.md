# Dynamics 365 Sales Professional Implementation Checklist

**Client Name:** _______________________________________________
**Implementation Partner:** Cloudstrucc Inc.
**Project Start Date:** _______________________________________________
**Target Go-Live Date:** _______________________________________________
**Prepared By:** _______________________________________________
**Version:** 1.0
**Last Updated:** _______________________________________________

---

## How to Use This Document

This checklist is designed to help you get the most out of your Dynamics 365 Sales Professional investment. For each feature or consideration, please indicate your preference:

| Response            | Meaning                                                          |
| ------------------- | ---------------------------------------------------------------- |
| **OOB**       | Out of Box — Keep the default Microsoft configuration as-is     |
| **N/A**       | Not Applicable — This feature does not apply to your business   |
| **CUSTOMIZE** | You want changes made to this feature (provide details in Notes) |
| **ENABLE**    | You want this feature turned on                                  |
| **DISABLE**   | You want this feature turned off                                 |

**Tip:** Each section includes links to official Microsoft documentation for more detailed information.

---

## Table of Contents

1. [Navigation &amp; User Interface](#1-navigation--user-interface)
2. [Dashboards &amp; Analytics](#2-dashboards--analytics)
3. [Forms &amp; Data Entry](#3-forms--data-entry)
4. [Views &amp; Data Display](#4-views--data-display)
5. [Search &amp; Find Records](#5-search--find-records)
6. [The Sales Process: Leads, Opportunities &amp; Accounts](#6-the-sales-process-leads-opportunities--accounts)
7. [Email Integration](#7-email-integration)
8. [Microsoft Teams Integration](#8-microsoft-teams-integration)
9. [SharePoint Integration](#9-sharepoint-integration)
10. [Word &amp; Excel Templates](#10-word--excel-templates)
11. [LinkedIn Sales Navigator Integration](#11-linkedin-sales-navigator-integration)
12. [Copilot AI Integration](#12-copilot-ai-integration)
13. [Queues &amp; Service Level Agreements (SLAs)](#13-queues--service-level-agreements-slas)
14. [Data Retention &amp; Disposition](#14-data-retention--disposition)
15. [Security Model &amp; Access Control](#15-security-model--access-control)
16. [Customization Capabilities](#16-customization-capabilities)
17. [Training &amp; Adoption](#17-training--adoption)
18. [Sign-Off &amp; Approval](#18-sign-off--approval)

---

## 1. Navigation & User Interface

### What Is It?

The navigation menu is how your team moves around the application. Think of it like the menu bar in any software — it provides quick access to different areas like Accounts, Contacts, Leads, Opportunities, and Reports.

**📖 Learn More:** [Navigate the Sales Hub App](https://learn.microsoft.com/en-us/dynamics365/sales/user-guide-learn-basics)

### Key Features

| Feature                              | Description                                                                                                   | Your Decision       | Notes |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------- | ----- |
| **Site Map (Left Navigation)** | The vertical menu on the left side of the screen. Controls what areas appear (Leads, Accounts, Reports, etc.) | ☐ OOB ☐ CUSTOMIZE |       |
| **Area Switcher**              | The bottom-left dropdown that switches between different parts of the app (Sales, Settings, etc.)             | ☐ OOB ☐ CUSTOMIZE |       |
| **Recent Items**               | Shows items you've recently viewed for quick access                                                           | ☐ OOB ☐ DISABLE   |       |
| **Pinned Items**               | Allows users to pin frequently used records for one-click access                                              | ☐ OOB ☐ DISABLE   |       |
| **Quick Create**               | The "+" button that lets users quickly create new records without navigating away                             | ☐ OOB ☐ CUSTOMIZE |       |

### Considerations

| Question                                                                               | Your Answer  | Notes |
| -------------------------------------------------------------------------------------- | ------------ | ----- |
| Which menu items should be visible to all sales users?                                 |              |       |
| Are there any menu items that should be hidden?                                        |              |       |
| Do you want different navigation for different teams (e.g., Sales vs. Sales Managers)? | ☐ Yes ☐ No |       |
| Should users be able to personalize their own navigation?                              | ☐ Yes ☐ No |       |

---

## 2. Dashboards & Analytics

### What Is It?

Dashboards are visual summaries of your sales data — think of them as your "command center" that shows key metrics, charts, and lists at a glance. Instead of running reports, you see real-time information as soon as you log in.

**📖 Learn More:** [Use Dashboards in Sales](https://learn.microsoft.com/en-us/dynamics365/sales/dashboards)

### Available Dashboard Types

| Type                                  | Description                                                        | Your Decision              | Notes |
| ------------------------------------- | ------------------------------------------------------------------ | -------------------------- | ----- |
| **Sales Activity Dashboard**    | Overview of activities, leads, and opportunities across the team   | ☐ OOB ☐ CUSTOMIZE ☐ N/A |       |
| **Sales Manager Dashboard**     | High-level view for managers showing team performance and pipeline | ☐ OOB ☐ CUSTOMIZE ☐ N/A |       |
| **Sales Performance Dashboard** | Tracks quota achievement, win rates, and revenue metrics           | ☐ OOB ☐ CUSTOMIZE ☐ N/A |       |
| **Personal Dashboards**         | Individual views users can create for their own tracking           | ☐ ENABLE ☐ DISABLE       |       |

### Key Components You Can Include

| Component                         | Description                             | Include?     | Notes |
| --------------------------------- | --------------------------------------- | ------------ | ----- |
| **Pipeline Chart**          | Visual representation of deals by stage | ☐ Yes ☐ No |       |
| **Lead by Source Chart**    | Shows where your leads are coming from  | ☐ Yes ☐ No |       |
| **Open Opportunities List** | Quick view of active deals              | ☐ Yes ☐ No |       |
| **Activities Due Today**    | Tasks and follow-ups due                | ☐ Yes ☐ No |       |
| **Top Deals List**          | Highest value opportunities             | ☐ Yes ☐ No |       |
| **Win/Loss Chart**          | Historical performance visualization    | ☐ Yes ☐ No |       |

### Considerations

| Question                                                    | Your Answer            | Notes |
| ----------------------------------------------------------- | ---------------------- | ----- |
| What metrics matter most to your sales team day-to-day?     |                        |       |
| What metrics do managers need to see for coaching?          |                        |       |
| Should different roles see different default dashboards?    | ☐ Yes ☐ No           |       |
| Do you want real-time data or is hourly refresh acceptable? | ☐ Real-time ☐ Hourly |       |

---

## 3. Forms & Data Entry

### What Is It?

Forms are the screens where users view and enter information about a record (like a Contact or Opportunity). A well-designed form shows the right information in a logical order, making it easy for your team to do their jobs without scrolling through unnecessary fields.

**📖 Learn More:** [Understand Forms in Model-Driven Apps](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-design-forms)

### Forms Available for Customization

| Entity/Record Type         | Description                                                         | Your Decision              | Notes |
| -------------------------- | ------------------------------------------------------------------- | -------------------------- | ----- |
| **Lead Form**        | Information captured about potential customers before qualification | ☐ OOB ☐ CUSTOMIZE        |       |
| **Contact Form**     | Individual people you do business with                              | ☐ OOB ☐ CUSTOMIZE        |       |
| **Account Form**     | Companies/organizations you do business with                        | ☐ OOB ☐ CUSTOMIZE        |       |
| **Opportunity Form** | Potential deals being worked                                        | ☐ OOB ☐ CUSTOMIZE        |       |
| **Activity Forms**   | Tasks, Phone Calls, Appointments, Emails                            | ☐ OOB ☐ CUSTOMIZE        |       |
| **Quote Form**       | Pricing proposals sent to customers                                 | ☐ OOB ☐ CUSTOMIZE ☐ N/A |       |
| **Order Form**       | Confirmed customer orders                                           | ☐ OOB ☐ CUSTOMIZE ☐ N/A |       |
| **Invoice Form**     | Billing records                                                     | ☐ OOB ☐ CUSTOMIZE ☐ N/A |       |

### Form Customization Options

| Option                         | Description                                                            | Your Decision | Notes                  |
| ------------------------------ | ---------------------------------------------------------------------- | ------------- | ---------------------- |
| **Add Fields**           | Include additional data points on the form                             | ☐ Yes ☐ No  | List fields needed:    |
| **Remove Fields**        | Hide fields you don't use to simplify the view                         | ☐ Yes ☐ No  | List fields to hide:   |
| **Rearrange Sections**   | Change the order and grouping of information                           | ☐ Yes ☐ No  |                        |
| **Make Fields Required** | Force users to fill in certain information                             | ☐ Yes ☐ No  | List required fields:  |
| **Add Tabs**             | Create separate tabs for different categories of information           | ☐ Yes ☐ No  |                        |
| **Business Rules**       | Automatic logic like "If Industry = Healthcare, show Compliance field" | ☐ Yes ☐ No  | Describe rules needed: |

### Considerations

| Question                                                                       | Your Answer  | Notes      |
| ------------------------------------------------------------------------------ | ------------ | ---------- |
| What information does your team absolutely need to capture on a Lead?          |              |            |
| What information is "nice to have" but not critical?                           |              |            |
| Are there fields currently in your CRM/spreadsheets that need to be added?     | ☐ Yes ☐ No | List them: |
| Should some fields only appear in certain situations (conditional visibility)? | ☐ Yes ☐ No |            |

---

## 4. Views & Data Display

### What Is It?

Views are pre-filtered lists of records — like saved searches. Instead of seeing every single contact, you might have a view for "My Active Contacts" or "Contacts in Ontario." Views help your team quickly find what they need.

**📖 Learn More:** [Create and Edit Views](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-edit-views)

### System Views (Shared Across Organization)

| View Type                      | Description                                         | Your Decision       | Notes |
| ------------------------------ | --------------------------------------------------- | ------------------- | ----- |
| **My Active [Records]**  | Records owned by the logged-in user that are active | ☐ OOB ☐ CUSTOMIZE |       |
| **All Active [Records]** | All active records the user has permission to see   | ☐ OOB ☐ CUSTOMIZE |       |
| **Inactive [Records]**   | Deactivated/archived records                        | ☐ OOB ☐ CUSTOMIZE |       |
| **Recently Viewed**      | Records the user has looked at recently             | ☐ OOB ☐ DISABLE   |       |

### Custom Views to Consider Creating

| Suggested View                             | Purpose                                   | Create?      | Notes           |
| ------------------------------------------ | ----------------------------------------- | ------------ | --------------- |
| **Leads by Source**                  | See leads grouped by where they came from | ☐ Yes ☐ No |                 |
| **Opportunities Closing This Month** | Focus on deals that need attention now    | ☐ Yes ☐ No |                 |
| **Stale Opportunities**              | Deals with no activity in X days          | ☐ Yes ☐ No | Days threshold: |
| **My Accounts by Revenue**           | Prioritize high-value customers           | ☐ Yes ☐ No |                 |
| **Contacts Missing Email**           | Data quality check                        | ☐ Yes ☐ No |                 |

### View Customization Options

| Option                        | Description                                   | Your Decision        | Notes |
| ----------------------------- | --------------------------------------------- | -------------------- | ----- |
| **Add/Remove Columns**  | Control what information displays in the list | ☐ CUSTOMIZE ☐ OOB  |       |
| **Change Column Order** | Put most important information first          | ☐ CUSTOMIZE ☐ OOB  |       |
| **Set Default Sorting** | How records are ordered by default            | ☐ CUSTOMIZE ☐ OOB  |       |
| **Personal Views**      | Allow users to create their own saved views   | ☐ ENABLE ☐ DISABLE |       |

### Considerations

| Question                                                  | Your Answer  | Notes |
| --------------------------------------------------------- | ------------ | ----- |
| What views do salespeople use most often?                 |              |       |
| What views do managers need that are different from reps? |              |       |
| Should some views be restricted to certain teams?         | ☐ Yes ☐ No |       |

---

## 5. Search & Find Records

### What Is It?

Dynamics 365 offers multiple ways to find records: global search (searches across all record types), quick find (searches within a specific area), and advanced find (complex queries). Good search configuration helps your team work faster.

**📖 Learn More:** [Search for Records](https://learn.microsoft.com/en-us/power-apps/user/search)

### Search Features

| Feature                      | Description                                                                          | Your Decision        | Notes |
| ---------------------------- | ------------------------------------------------------------------------------------ | -------------------- | ----- |
| **Relevance Search**   | Intelligent search that looks across multiple record types and finds partial matches | ☐ ENABLE ☐ DISABLE |       |
| **Quick Find**         | Simple search within the current list/view                                           | ☐ OOB ☐ CUSTOMIZE  |       |
| **Advanced Find**      | Build complex queries with multiple conditions                                       | ☐ ENABLE ☐ DISABLE |       |
| **Categorized Search** | Groups results by record type (Contacts, Accounts, etc.)                             | ☐ ENABLE ☐ DISABLE |       |

### Search Configuration

| Configuration                 | Description                                             | Your Decision       | Notes    |
| ----------------------------- | ------------------------------------------------------- | ------------------- | -------- |
| **Searchable Entities** | Which record types appear in global search results      | ☐ OOB ☐ CUSTOMIZE | Exclude: |
| **Searchable Fields**   | Which fields are searched (e.g., include custom fields) | ☐ OOB ☐ CUSTOMIZE |          |
| **Quick Find Columns**  | What fields are searched in quick find                  | ☐ OOB ☐ CUSTOMIZE |          |

### Considerations

| Question                                                                  | Your Answer  | Notes      |
| ------------------------------------------------------------------------- | ------------ | ---------- |
| What do users typically search for? (Name, phone, email, account number?) |              |            |
| Are there custom fields that should be searchable?                        | ☐ Yes ☐ No | List them: |
| Should search include inactive/closed records?                            | ☐ Yes ☐ No |            |

---

## 6. The Sales Process: Leads, Opportunities & Accounts

### What Is It?

This is the core of Dynamics 365 Sales — managing your sales pipeline from initial interest (Lead) through to closed deals (Opportunity). Understanding how these connect helps you track and optimize your sales process.

**📖 Learn More:** [Nurture Sales from Lead to Order](https://learn.microsoft.com/en-us/dynamics365/sales/nurture-sales-from-lead-order-sales)

### The Typical Sales Flow

```
LEAD → (Qualify) → OPPORTUNITY → (Win/Lose) → ACCOUNT/CONTACT + ORDER
```

### Lead Management

| Feature                               | Description                                                       | Your Decision              | Notes           |
| ------------------------------------- | ----------------------------------------------------------------- | -------------------------- | --------------- |
| **Lead Source Tracking**        | Track where leads come from (Website, Referral, Trade Show, etc.) | ☐ OOB ☐ CUSTOMIZE        | Sources to add: |
| **Lead Rating**                 | Hot/Warm/Cold scoring system                                      | ☐ OOB ☐ CUSTOMIZE ☐ N/A |                 |
| **Lead Qualification Criteria** | What makes a lead ready to become an Opportunity                  | ☐ OOB ☐ CUSTOMIZE        | Criteria:       |
| **Auto-Assignment**             | Automatically route leads to salespeople                          | ☐ ENABLE ☐ N/A           | Rules:          |
| **Duplicate Detection**         | Warn when creating leads that may already exist                   | ☐ ENABLE ☐ DISABLE       |                 |

### Lead Qualification Process

| Question                                                                         | Your Answer  | Notes |
| -------------------------------------------------------------------------------- | ------------ | ----- |
| What criteria must be met before a Lead becomes an Opportunity?                  |              |       |
| When a Lead is qualified, should it automatically create an Account and Contact? | ☐ Yes ☐ No |       |
| Who should be able to qualify leads? (All reps? Managers only?)                  |              |       |
| What happens to leads that don't qualify? (Disqualify reasons?)                  |              |       |

### Opportunity Management

| Feature                             | Description                                                                | Your Decision        | Notes             |
| ----------------------------------- | -------------------------------------------------------------------------- | -------------------- | ----------------- |
| **Sales Stages**              | Steps in your sales process (e.g., Qualify → Develop → Propose → Close) | ☐ OOB ☐ CUSTOMIZE  | List your stages: |
| **Probability by Stage**      | Auto-calculate win likelihood based on stage                               | ☐ ENABLE ☐ DISABLE |                   |
| **Required Fields per Stage** | Force data entry as deals progress                                         | ☐ Yes ☐ No         |                   |
| **Close Reasons**             | Track why deals are won or lost                                            | ☐ OOB ☐ CUSTOMIZE  | Reasons to add:   |
| **Product Line Items**        | Add specific products/services to opportunities                            | ☐ ENABLE ☐ N/A     |                   |
| **Competitors**               | Track who you're competing against                                         | ☐ ENABLE ☐ N/A     |                   |

### Business Process Flow (BPF)

| Question                                                                                              | Your Answer  | Notes     |
| ----------------------------------------------------------------------------------------------------- | ------------ | --------- |
| The BPF is the visual guide bar at the top of records showing sales stages. Do you want this enabled? | ☐ Yes ☐ No |           |
| Should different products/services have different sales processes?                                    | ☐ Yes ☐ No | Describe: |
| What information should be collected at each stage?                                                   |              |           |

**📖 Learn More:** [Business Process Flows Overview](https://learn.microsoft.com/en-us/power-automate/business-process-flows-overview)

---

## 7. Email Integration

### What Is It?

Connect Dynamics 365 to your email system so sales activities are automatically tracked. Emails sent to/from customers can appear on their records, giving everyone visibility into communications.

**⚠️ IMPORTANT:** For this implementation, we recommend connecting a **shared mailbox** (e.g., sales@yourcompany.com) rather than individual user mailboxes. This means:

- Emails sent FROM the shared mailbox are tracked in Dynamics 365
- Individual users' personal mailboxes are NOT synchronized
- Users can still manually track emails using the Dynamics 365 App for Outlook

**📖 Learn More:** [Set Up Server-Side Synchronization](https://learn.microsoft.com/en-us/power-platform/admin/set-up-server-side-synchronization-of-email-appointments-contacts-and-tasks)

### Email Integration Configuration

| Feature                                | Description                                           | Your Decision        | Notes            |
| -------------------------------------- | ----------------------------------------------------- | -------------------- | ---------------- |
| **Shared Mailbox Connection**    | Connect team/department shared mailbox for tracking   | ☐ ENABLE ☐ N/A     | Mailbox address: |
| **Dynamics 365 App for Outlook** | Outlook add-in that lets users manually track emails  | ☐ ENABLE ☐ N/A     |                  |
| **Auto-Track Incoming Emails**   | Automatically log incoming emails from known contacts | ☐ ENABLE ☐ DISABLE |                  |
| **Auto-Track Sent Emails**       | Automatically log outgoing emails to known contacts   | ☐ ENABLE ☐ DISABLE |                  |
| **Email Templates**              | Pre-written email templates for common scenarios      | ☐ ENABLE ☐ N/A     |                  |
| **Email Signatures**             | Standardized signatures for outgoing emails           | ☐ ENABLE ☐ N/A     |                  |

### Email Tracking Rules

| Rule                                     | Description                                       | Your Decision | Notes    |
| ---------------------------------------- | ------------------------------------------------- | ------------- | -------- |
| **Track if From/To Known Contact** | Only track if sender/recipient exists in Dynamics | ☐ Yes ☐ No  |          |
| **Track if From/To Known Account** | Track if domain matches a known account           | ☐ Yes ☐ No  |          |
| **Exclude Specific Domains**       | Don't track emails from certain domains           | ☐ Yes ☐ No  | Domains: |

### Considerations

| Question                                                                            | Your Answer  | Notes |
| ----------------------------------------------------------------------------------- | ------------ | ----- |
| What shared mailbox(es) should be connected?                                        |              |       |
| Should internal emails be tracked (between employees)?                              | ☐ Yes ☐ No |       |
| Do you want email templates for common scenarios (follow-ups, introductions, etc.)? | ☐ Yes ☐ No |       |
| Who manages/updates email templates?                                                |              |       |

---

## 8. Microsoft Teams Integration

### What Is It?

Connect Dynamics 365 records directly to Microsoft Teams channels and chats. This lets your team discuss deals, share documents, and collaborate without leaving either application.

**📖 Learn More:** [Microsoft Teams Integration](https://learn.microsoft.com/en-us/dynamics365/sales/teams-integration/teams-collaboration)

### Integration Features

| Feature                                       | Description                                             | Your Decision    | Notes     |
| --------------------------------------------- | ------------------------------------------------------- | ---------------- | --------- |
| **Connect Records to Channels**         | Link Accounts/Opportunities to dedicated Teams channels | ☐ ENABLE ☐ N/A |           |
| **Teams Chat in Dynamics**              | Start Teams chats directly from within Dynamics 365     | ☐ ENABLE ☐ N/A |           |
| **Dynamics Tab in Teams**               | View Dynamics 365 records as tabs within Teams          | ☐ ENABLE ☐ N/A |           |
| **Auto-Create Teams for Opportunities** | Automatically create a Team/Channel for large deals     | ☐ ENABLE ☐ N/A | Criteria: |
| **Meeting Integration**                 | Schedule Teams meetings from Dynamics 365               | ☐ ENABLE ☐ N/A |           |

### Considerations

| Question                                                          | Your Answer  | Notes     |
| ----------------------------------------------------------------- | ------------ | --------- |
| Does your team actively use Microsoft Teams today?                | ☐ Yes ☐ No |           |
| For which record types would Teams collaboration be valuable?     |              |           |
| Should Teams channels be created automatically for certain deals? | ☐ Yes ☐ No | Criteria: |
| Who should have permission to connect records to Teams?           |              |           |

---

## 9. SharePoint Integration

### What Is It?

Store documents related to your sales records (contracts, proposals, presentations) in SharePoint rather than inside Dynamics 365. This provides better document management, version control, and storage while keeping documents linked to the right records.

**📖 Learn More:** [SharePoint Document Management](https://learn.microsoft.com/en-us/power-platform/admin/manage-documents-using-sharepoint)

### Integration Configuration

| Feature                                 | Description                                                      | Your Decision        | Notes |
| --------------------------------------- | ---------------------------------------------------------------- | -------------------- | ----- |
| **Enable SharePoint Integration** | Turn on document storage in SharePoint                           | ☐ ENABLE ☐ N/A     |       |
| **Account Documents**             | Store Account-related files in SharePoint                        | ☐ Yes ☐ No         |       |
| **Opportunity Documents**         | Store Opportunity-related files in SharePoint                    | ☐ Yes ☐ No         |       |
| **Lead Documents**                | Store Lead-related files in SharePoint                           | ☐ Yes ☐ No         |       |
| **Quote Documents**               | Store Quote-related files in SharePoint                          | ☐ Yes ☐ No         |       |
| **Auto-Create Folders**           | Automatically create SharePoint folders when records are created | ☐ ENABLE ☐ DISABLE |       |

### Folder Structure

| Question                                                                          | Your Answer  | Notes            |
| --------------------------------------------------------------------------------- | ------------ | ---------------- |
| Should each Account have its own SharePoint folder?                               | ☐ Yes ☐ No |                  |
| Should each Opportunity have a subfolder under its Account?                       | ☐ Yes ☐ No |                  |
| Should there be standard subfolders (e.g., Contracts, Proposals, Correspondence)? | ☐ Yes ☐ No | List subfolders: |
| Which SharePoint site should be used?                                             |              | Site URL:        |

### Considerations

| Question                                                          | Your Answer  | Notes |
| ----------------------------------------------------------------- | ------------ | ----- |
| Do you have an existing SharePoint structure for sales documents? | ☐ Yes ☐ No |       |
| Who should have access to uploaded documents?                     |              |       |
| Do you need document approval workflows?                          | ☐ Yes ☐ No |       |
| Should documents be automatically named or tagged?                | ☐ Yes ☐ No |       |

---

## 10. Word & Excel Templates

### What Is It?

Create standardized documents (quotes, proposals, reports) and spreadsheets that automatically pull data from Dynamics 365. Instead of copying and pasting, your team generates professional documents with one click.

**📖 Learn More:** [Word Templates](https://learn.microsoft.com/en-us/power-platform/admin/using-word-templates-dynamics-365) | [Excel Templates](https://learn.microsoft.com/en-us/power-platform/admin/analyze-your-data-with-excel-templates)

### Word Templates

| Template Type               | Description                               | Create?      | Notes |
| --------------------------- | ----------------------------------------- | ------------ | ----- |
| **Quote Letter**      | Formal quote document with pricing        | ☐ Yes ☐ No |       |
| **Proposal Template** | Sales proposal with opportunity details   | ☐ Yes ☐ No |       |
| **Account Summary**   | One-pager about a customer                | ☐ Yes ☐ No |       |
| **Contract Template** | Agreement document with auto-filled terms | ☐ Yes ☐ No |       |
| **Meeting Summary**   | Post-meeting follow-up document           | ☐ Yes ☐ No |       |
| **Other:**            |                                           | ☐ Yes ☐ No |       |

### Excel Templates

| Template Type                 | Description                           | Create?      | Notes |
| ----------------------------- | ------------------------------------- | ------------ | ----- |
| **Pipeline Report**     | Export opportunities with key metrics | ☐ Yes ☐ No |       |
| **Account List Export** | Customer data for analysis            | ☐ Yes ☐ No |       |
| **Activity Report**     | Export of activities for review       | ☐ Yes ☐ No |       |
| **Forecast Worksheet**  | Revenue forecasting template          | ☐ Yes ☐ No |       |
| **Other:**              |                                       | ☐ Yes ☐ No |       |

### Considerations

| Question                                                        | Your Answer  | Notes |
| --------------------------------------------------------------- | ------------ | ----- |
| Do you have existing Word templates that need to be converted?  | ☐ Yes ☐ No |       |
| What branding elements must be included (logos, colors, fonts)? |              |       |
| Who should be able to create/modify templates?                  |              |       |
| Are there compliance requirements for document content?         | ☐ Yes ☐ No |       |

---

## 11. LinkedIn Sales Navigator Integration

### What Is It?

If your organization has LinkedIn Sales Navigator licenses, you can connect it to Dynamics 365 to see LinkedIn profile information, connections, and insights directly on Contact and Lead records.

**📖 Learn More:** [LinkedIn Sales Navigator Integration](https://learn.microsoft.com/en-us/dynamics365/linkedin/integrate-sales-navigator)

### Integration Features

| Feature                               | Description                                            | Your Decision    | Notes |
| ------------------------------------- | ------------------------------------------------------ | ---------------- | ----- |
| **Enable LinkedIn Integration** | Connect Sales Navigator to Dynamics 365                | ☐ ENABLE ☐ N/A |       |
| **Profile Photos**              | Show LinkedIn photos on contact records                | ☐ Yes ☐ No     |       |
| **Icebreakers**                 | Show shared connections and interests                  | ☐ Yes ☐ No     |       |
| **Related Leads**               | Suggest other people at the same company               | ☐ Yes ☐ No     |       |
| **InMail from Dynamics**        | Send LinkedIn messages from within Dynamics            | ☐ Yes ☐ No     |       |
| **Activity Sync**               | Log LinkedIn activities (InMails, connection requests) | ☐ Yes ☐ No     |       |

### Prerequisites

| Requirement                                          | Status                 | Notes |
| ---------------------------------------------------- | ---------------------- | ----- |
| LinkedIn Sales Navigator Team or Enterprise licenses | ☐ Have ☐ Need ☐ N/A |       |
| Users have LinkedIn accounts                         | ☐ Yes ☐ No           |       |
| Organization approves LinkedIn data usage            | ☐ Yes ☐ No           |       |

### Considerations

| Question                                                           | Your Answer  | Notes |
| ------------------------------------------------------------------ | ------------ | ----- |
| How many users have Sales Navigator licenses?                      |              |       |
| Is LinkedIn a significant source for prospecting in your industry? | ☐ Yes ☐ No |       |
| Are there data privacy concerns with showing LinkedIn data?        | ☐ Yes ☐ No |       |

---

## 12. Copilot AI Integration

### What Is It?

Microsoft Copilot in Dynamics 365 Sales uses AI to help your team work more efficiently. It can summarize records, draft emails, suggest next steps, and answer questions about your sales data using natural language.

**📖 Learn More:** [Copilot in Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/copilot-overview)

### Copilot Features

| Feature                            | Description                                              | Your Decision               | Notes |
| ---------------------------------- | -------------------------------------------------------- | --------------------------- | ----- |
| **Enable Copilot**           | Turn on AI assistance in Dynamics 365 Sales              | ☐ ENABLE ☐ DISABLE ☐ N/A |       |
| **Record Summarization**     | AI-generated summaries of accounts, opportunities, leads | ☐ ENABLE ☐ DISABLE        |       |
| **Email Drafting**           | AI helps write email responses                           | ☐ ENABLE ☐ DISABLE        |       |
| **Meeting Preparation**      | AI summarizes relevant info before meetings              | ☐ ENABLE ☐ DISABLE        |       |
| **Opportunity Insights**     | AI suggests next actions on deals                        | ☐ ENABLE ☐ DISABLE        |       |
| **Natural Language Queries** | Ask questions like "Show me deals closing this week"     | ☐ ENABLE ☐ DISABLE        |       |
| **Catch-Up Summary**         | AI summarizes what's happened since you last logged in   | ☐ ENABLE ☐ DISABLE        |       |

### Data & Privacy Considerations

| Question                                                         | Your Answer  | Notes        |
| ---------------------------------------------------------------- | ------------ | ------------ |
| Is your organization comfortable with AI processing sales data?  | ☐ Yes ☐ No |              |
| Are there data residency requirements that affect AI usage?      | ☐ Yes ☐ No |              |
| Do you want to pilot Copilot with a small group first?           | ☐ Yes ☐ No | Pilot group: |
| Should AI-generated content require human review before sending? | ☐ Yes ☐ No |              |

### Considerations

| Question                                                               | Your Answer | Notes |
| ---------------------------------------------------------------------- | ----------- | ----- |
| Which Copilot features would provide the most value to your team?      |             |       |
| Are there specific tasks where AI assistance would save the most time? |             |       |
| What training will users need to use Copilot effectively?              |             |       |

---

## 13. Queues & Service Level Agreements (SLAs)

### What Is It?

**Queues** are shared work buckets where incoming items (leads, cases, etc.) wait to be picked up by available team members. Think of it like a shared inbox that the team works from.

**SLAs** (Service Level Agreements) are timers that ensure work gets done within promised timeframes. They can trigger warnings or escalations when deadlines approach.

**📖 Learn More:** [Queues Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel) | [SLAs Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/define-service-level-agreements)

### Queue Configuration

| Feature                          | Description                                 | Your Decision    | Notes        |
| -------------------------------- | ------------------------------------------- | ---------------- | ------------ |
| **Enable Queues**          | Use queues for work distribution            | ☐ ENABLE ☐ N/A |              |
| **Lead Queue**             | Pool of unassigned leads for sales to claim | ☐ Yes ☐ No     |              |
| **Territory Queues**       | Separate queues by region/territory         | ☐ Yes ☐ No     | Territories: |
| **Product/Service Queues** | Separate queues by product line             | ☐ Yes ☐ No     | Products:    |
| **Round-Robin Assignment** | Automatically distribute items evenly       | ☐ ENABLE ☐ N/A |              |
| **Priority Queues**        | High-priority queue for urgent items        | ☐ Yes ☐ No     |              |

### SLA Configuration

| SLA Type                        | Description                             | Create?      | Target Time | Notes |
| ------------------------------- | --------------------------------------- | ------------ | ----------- | ----- |
| **Lead Response Time**    | How quickly new leads must be contacted | ☐ Yes ☐ No |             |       |
| **Opportunity Follow-Up** | Maximum time between customer touches   | ☐ Yes ☐ No |             |       |
| **Quote Response Time**   | Time to respond to quote requests       | ☐ Yes ☐ No |             |       |
| **Escalation Timer**      | When to escalate stalled deals          | ☐ Yes ☐ No |             |       |

### SLA Actions

| When Timer Triggers      | Action                      | Enable?      | Notes |
| ------------------------ | --------------------------- | ------------ | ----- |
| **Warning**        | Email notification to owner | ☐ Yes ☐ No |       |
| **Nearing Breach** | Email owner + manager       | ☐ Yes ☐ No |       |
| **Breach**         | Escalate to manager         | ☐ Yes ☐ No |       |
| **Breach**         | Reassign to queue           | ☐ Yes ☐ No |       |

### Considerations

| Question                                                     | Your Answer  | Notes |
| ------------------------------------------------------------ | ------------ | ----- |
| Do you have existing response time commitments to customers? | ☐ Yes ☐ No |       |
| How should leads be distributed among sales reps?            |              |       |
| Who should be notified when SLAs are at risk?                |              |       |
| Should SLA performance be tracked on dashboards?             | ☐ Yes ☐ No |       |

---

## 14. Data Retention & Disposition

### What Is It?

Data retention policies determine how long records are kept and what happens to old data. This is important for compliance (legal hold requirements), storage management, and keeping the system clean of outdated information.

**📖 Learn More:** [Data Retention Policies](https://learn.microsoft.com/en-us/power-platform/admin/data-retention-overview)

### Retention Considerations by Record Type

| Record Type                          | Keep Active Records                | Archive After | Delete After | Notes |
| ------------------------------------ | ---------------------------------- | ------------- | ------------ | ----- |
| **Leads (Disqualified)**       | N/A                                | ___ months    | ___ years    |       |
| **Leads (Qualified)**          | Indefinitely (becomes Opportunity) | N/A           | N/A          |       |
| **Opportunities (Won)**        | ___ years                          | ___ years     | ___ years    |       |
| **Opportunities (Lost)**       | ___ months                         | ___ years     | ___ years    |       |
| **Accounts (Active)**          | Indefinitely                       | N/A           | N/A          |       |
| **Accounts (Inactive)**        | ___ years                          | ___ years     | ___ years    |       |
| **Contacts**                   | Follow Account rules               |               |              |       |
| **Activities (Emails, Calls)** | ___ years                          | ___ years     | ___ years    |       |
| **Quotes**                     | ___ years                          | ___ years     | ___ years    |       |
| **Notes & Attachments**        | Follow parent record               |               |              |       |

### Retention Actions

| Action               | Description                                                                     | Use?         | Notes |
| -------------------- | ------------------------------------------------------------------------------- | ------------ | ----- |
| **Deactivate** | Record remains but is marked inactive (searchable but hidden from active views) | ☐ Yes ☐ No |       |
| **Archive**    | Move to long-term storage (limited access)                                      | ☐ Yes ☐ No |       |
| **Delete**     | Permanently remove from system                                                  | ☐ Yes ☐ No |       |
| **Anonymize**  | Remove personal data but keep statistical record                                | ☐ Yes ☐ No |       |

### Compliance & Legal Considerations

| Question                                                              | Your Answer  | Notes         |
| --------------------------------------------------------------------- | ------------ | ------------- |
| Are there legal requirements for how long sales records must be kept? | ☐ Yes ☐ No | Requirements: |
| Do you have industry-specific retention requirements?                 | ☐ Yes ☐ No |               |
| Is there a legal hold process that could override deletion?           | ☐ Yes ☐ No |               |
| Who approves data deletion?                                           |              |               |
| Do you need an audit trail of deleted records?                        | ☐ Yes ☐ No |               |

### Considerations

| Question                                                             | Your Answer  | Notes |
| -------------------------------------------------------------------- | ------------ | ----- |
| How do you currently handle old/outdated records?                    |              |       |
| Is there specific data that must never be deleted?                   | ☐ Yes ☐ No |       |
| Should users be able to manually delete records, or only deactivate? |              |       |
| What triggers should move a record to "inactive" status?             |              |       |

---

## 15. Security Model & Access Control

### What Is It?

The security model controls who can see, create, edit, and delete different types of records. Think of it as permissions — ensuring salespeople can only see their own accounts while managers can see everyone's, and preventing unauthorized changes to closed deals.

**📖 Learn More:** [Security Concepts](https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds)

### Understanding Security Layers (Plain Language)

| Layer                          | What It Controls                                     | Example                                                   |
| ------------------------------ | ---------------------------------------------------- | --------------------------------------------------------- |
| **Security Roles**       | What TYPE of records users can work with             | "Sales Reps can create Leads but cannot delete Accounts"  |
| **Business Units**       | Organizational boundaries for data visibility        | "North Region team only sees North Region records"        |
| **Teams**                | Groups of users who share access to specific records | "Deal Team for Project Alpha can all see the Opportunity" |
| **Field-Level Security** | Hiding sensitive fields from certain users           | "Only Managers can see the Discount Percentage field"     |
| **Record Sharing**       | One-off access grants to specific records            | "Share this Opportunity with the VP for review"           |

### Security Roles to Configure

| Role                                  | Typical Permissions                              | Your Decision       | Notes |
| ------------------------------------- | ------------------------------------------------ | ------------------- | ----- |
| **Sales Representative**        | Create/edit own records, read team records       | ☐ OOB ☐ CUSTOMIZE |       |
| **Sales Manager**               | Full access to team's records, approve discounts | ☐ OOB ☐ CUSTOMIZE |       |
| **Sales Administrator**         | Configure system, manage users, full data access | ☐ OOB ☐ CUSTOMIZE |       |
| **Sales Executive (Read-Only)** | View dashboards and reports, no editing          | ☐ CREATE ☐ N/A    |       |
| **Partner/External User**       | Limited access to shared records only            | ☐ CREATE ☐ N/A    |       |

### Access Levels Explained

| Level                      | Meaning                                             | Example                                 |
| -------------------------- | --------------------------------------------------- | --------------------------------------- |
| **User**             | Only records owned by this person                   | Rep sees only their own leads           |
| **Business Unit**    | Records owned by anyone in their department         | Rep sees all leads in their division    |
| **Parent: Child BU** | Records in their department AND all sub-departments | Regional manager sees all local offices |
| **Organization**     | All records of this type                            | Admin sees all leads company-wide       |

### Permission Decisions

| Question                                                     | Your Answer                          | Notes |
| ------------------------------------------------------------ | ------------------------------------ | ----- |
| Should sales reps see each other's accounts/opportunities?   | ☐ Yes ☐ No ☐ Same Team Only       |       |
| Should managers see all records in their team?               | ☐ Yes ☐ No                         |       |
| Who can delete records?                                      | ☐ Anyone ☐ Managers ☐ Admins Only |       |
| Who can export data to Excel?                                |                                      |       |
| Who can import data/bulk update?                             |                                      |       |
| Should there be restrictions on seeing revenue/pricing data? | ☐ Yes ☐ No                         |       |

### Field-Level Security

| Sensitive Field        | Who Should See It? | Notes |
| ---------------------- | ------------------ | ----- |
| Discount Percentage    |                    |       |
| Margin/Cost Data       |                    |       |
| Commission Amount      |                    |       |
| Competitor Information |                    |       |
| Internal Notes         |                    |       |
| Social Security/Tax ID |                    |       |

### Considerations

| Question                                                       | Your Answer  | Notes |
| -------------------------------------------------------------- | ------------ | ----- |
| Do you have regional or divisional boundaries for data access? | ☐ Yes ☐ No |       |
| Are there external partners who need limited access?           | ☐ Yes ☐ No |       |
| Should closed/won deals be locked from editing?                | ☐ Yes ☐ No |       |
| Do you need audit logging of who views sensitive records?      | ☐ Yes ☐ No |       |

---

## 16. Customization Capabilities

### What Is It?

Dynamics 365 Sales Professional allows significant customization without writing code. Understanding what can be changed helps you tailor the system to your business processes.

**📖 Learn More:** [Customize Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/customize-forms)

### What Can Be Customized

| Area                             | What You Can Do                                                 | Requires IT/Developer?             |
| -------------------------------- | --------------------------------------------------------------- | ---------------------------------- |
| **Fields**                 | Add new fields, rename existing fields, change field types      | No — Power Apps interface         |
| **Forms**                  | Rearrange sections, show/hide fields, add tabs                  | No — Power Apps interface         |
| **Views**                  | Create filtered lists, change columns, set default sorts        | No — Power Apps interface         |
| **Dashboards**             | Build new dashboards, add charts and lists                      | No — Power Apps interface         |
| **Business Rules**         | If/then logic (e.g., "If Status = Hot, require Follow-Up Date") | No — Power Apps interface         |
| **Business Process Flows** | Change sales stages, add required fields per stage              | No — Power Apps interface         |
| **Charts**                 | Create new visualizations                                       | No — Power Apps interface         |
| **Site Map (Navigation)**  | Add/remove menu items, reorganize areas                         | No — Power Apps interface         |
| **Security Roles**         | Create new roles, modify permissions                            | Admin required                     |
| **Workflows/Automations**  | Automated emails, record updates, approvals                     | Power Automate (may need training) |
| **Complex Integrations**   | Connect to external systems                                     | Developer typically required       |
| **Custom Entities**        | Create entirely new record types                                | Admin/Developer                    |

### Customization Governance

| Question                                                        | Your Answer  | Notes |
| --------------------------------------------------------------- | ------------ | ----- |
| Who should be able to make customizations?                      |              |       |
| Should changes be tested in a non-production environment first? | ☐ Yes ☐ No |       |
| Who approves customization requests?                            |              |       |
| Do you want documentation of all customizations?                | ☐ Yes ☐ No |       |
| Is there a change management process to follow?                 | ☐ Yes ☐ No |       |

---

## 17. Training & Adoption

### What Is It?

Even the best-configured system provides no value if people don't use it. This section covers training needs and adoption strategies to ensure your team gets full value from Dynamics 365 Sales.

**📖 Learn More:** [Dynamics 365 Sales Training](https://learn.microsoft.com/en-us/training/dynamics365/sales)

### Training Needs Assessment

| User Group                      | Training Topics                                      | Format Preference           | Notes |
| ------------------------------- | ---------------------------------------------------- | --------------------------- | ----- |
| **Sales Representatives** | Daily tasks, lead management, opportunity tracking   | ☐ Live ☐ Video ☐ Written |       |
| **Sales Managers**        | Dashboards, reporting, team oversight, approvals     | ☐ Live ☐ Video ☐ Written |       |
| **Administrators**        | System configuration, user management, customization | ☐ Live ☐ Video ☐ Written |       |
| **Executives**            | Dashboard review, mobile access                      | ☐ Live ☐ Video ☐ Written |       |

### Adoption Success Measures

| Metric                          | Target | How to Measure              | Notes |
| ------------------------------- | ------ | --------------------------- | ----- |
| Daily Active Users              |        | Dynamics 365 usage reports  |       |
| Leads Entered Weekly            |        | Lead creation reports       |       |
| Opportunities Updated Regularly |        | Last modified date tracking |       |
| Email Integration Usage         |        | Tracked email count         |       |
| Dashboard Views                 |        | Usage analytics             |       |

### Considerations

| Question                                                   | Your Answer  | Notes |
| ---------------------------------------------------------- | ------------ | ----- |
| When should training occur? (Before/after go-live?)        |              |       |
| Who will provide ongoing support after go-live?            |              |       |
| Should there be "power users" or "champions" in each team? | ☐ Yes ☐ No |       |
| What happens if users don't enter data in the system?      |              |       |
| How will you handle resistance to change?                  |              |       |

---

## 18. Sign-Off & Approval

### Implementation Checklist Completion

| Section                                 | Reviewed By | Date | Status      |
| --------------------------------------- | ----------- | ---- | ----------- |
| 1. Navigation & User Interface          |             |      | ☐ Complete |
| 2. Dashboards & Analytics               |             |      | ☐ Complete |
| 3. Forms & Data Entry                   |             |      | ☐ Complete |
| 4. Views & Data Display                 |             |      | ☐ Complete |
| 5. Search & Find Records                |             |      | ☐ Complete |
| 6. Sales Process (Leads, Opportunities) |             |      | ☐ Complete |
| 7. Email Integration                    |             |      | ☐ Complete |
| 8. Microsoft Teams Integration          |             |      | ☐ Complete |
| 9. SharePoint Integration               |             |      | ☐ Complete |
| 10. Word & Excel Templates              |             |      | ☐ Complete |
| 11. LinkedIn Sales Navigator            |             |      | ☐ Complete |
| 12. Copilot AI Integration              |             |      | ☐ Complete |
| 13. Queues & SLAs                       |             |      | ☐ Complete |
| 14. Data Retention & Disposition        |             |      | ☐ Complete |
| 15. Security Model                      |             |      | ☐ Complete |
| 16. Customization Capabilities          |             |      | ☐ Complete |
| 17. Training & Adoption                 |             |      | ☐ Complete |

### Approval Signatures

**Business Owner / Project Sponsor:**

Name: _______________________________________________

Signature: _______________________________________________

Date: _______________________________________________

---

**IT/Technical Lead:**

Name: _______________________________________________

Signature: _______________________________________________

Date: _______________________________________________

---

**Implementation Partner (Cloudstrucc Inc.):**

Name: _______________________________________________

Signature: _______________________________________________

Date: _______________________________________________

---

## Appendix A: Quick Reference - Microsoft Documentation Links

| Topic                                       | URL                                                                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Dynamics 365 Sales Documentation Home       | https://learn.microsoft.com/en-us/dynamics365/sales/                                                                               |
| Sales Professional vs Enterprise Comparison | https://learn.microsoft.com/en-us/dynamics365/sales/overview#dynamics-365-sales-offerings                                          |
| Customize Forms                             | https://learn.microsoft.com/en-us/dynamics365/sales/customize-forms                                                                |
| Create and Edit Views                       | https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-edit-views                                             |
| Dashboards                                  | https://learn.microsoft.com/en-us/dynamics365/sales/dashboards                                                                     |
| Email Integration                           | https://learn.microsoft.com/en-us/power-platform/admin/set-up-server-side-synchronization-of-email-appointments-contacts-and-tasks |
| SharePoint Integration                      | https://learn.microsoft.com/en-us/power-platform/admin/manage-documents-using-sharepoint                                           |
| Teams Integration                           | https://learn.microsoft.com/en-us/dynamics365/sales/teams-integration/teams-collaboration                                          |
| Security Roles                              | https://learn.microsoft.com/en-us/power-platform/admin/security-roles-privileges                                                   |
| Business Process Flows                      | https://learn.microsoft.com/en-us/power-automate/business-process-flows-overview                                                   |
| Copilot in Sales                            | https://learn.microsoft.com/en-us/dynamics365/sales/copilot-overview                                                               |
| LinkedIn Integration                        | https://learn.microsoft.com/en-us/dynamics365/linkedin/integrate-sales-navigator                                                   |
| Word Templates                              | https://learn.microsoft.com/en-us/power-platform/admin/using-word-templates-dynamics-365                                           |
| Excel Templates                             | https://learn.microsoft.com/en-us/power-platform/admin/analyze-your-data-with-excel-templates                                      |
| Queues                                      | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel                                       |
| SLAs                                        | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/define-service-level-agreements                          |

---

## Appendix B: Glossary of Terms

| Term                                    | Definition                                                    |
| --------------------------------------- | ------------------------------------------------------------- |
| **Account**                       | A company or organization you do business with                |
| **Activity**                      | An action item like a task, phone call, email, or appointment |
| **BPF (Business Process Flow)**   | The visual guide bar showing stages of a process              |
| **Contact**                       | An individual person associated with an Account               |
| **Copilot**                       | Microsoft's AI assistant built into Dynamics 365              |
| **Dashboard**                     | A visual summary screen showing charts, lists, and metrics    |
| **Entity/Table**                  | A type of record (e.g., Account, Contact, Opportunity)        |
| **Field**                         | A single piece of information (e.g., Phone Number, Email)     |
| **Form**                          | The screen layout for viewing/editing a record                |
| **Lead**                          | A potential customer who hasn't been qualified yet            |
| **OOB (Out of Box)**              | Default configuration provided by Microsoft                   |
| **Opportunity**                   | A qualified potential sale being actively worked              |
| **Queue**                         | A shared pool of work items waiting to be claimed             |
| **Security Role**                 | A collection of permissions assigned to users                 |
| **SLA (Service Level Agreement)** | A time-based commitment with automatic tracking               |
| **View**                          | A filtered, saved list of records                             |
| **Workflow/Flow**                 | An automated process that runs based on triggers              |

---

*Document prepared by Cloudstrucc Inc.*

*For questions or assistance, contact: contact@cloudstrucc.com*
