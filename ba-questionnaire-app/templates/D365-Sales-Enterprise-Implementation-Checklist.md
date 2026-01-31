# Dynamics 365 Sales Enterprise Implementation Checklist

**Client Name:** _______________________________________________  
**Implementation Partner:** Cloudstrucc Inc.  
**Project Start Date:** _______________________________________________  
**Target Go-Live Date:** _______________________________________________  
**Prepared By:** _______________________________________________  
**Version:** 1.1 (Revised)  
**Last Updated:** _______________________________________________

---

## Document Revision Notes

> **⚠️ IMPORTANT UPDATES IN THIS VERSION:**
> 
> 1. **Sales Playbooks (Section 18)**: This feature has been **DEPRECATED** by Microsoft. The section has been updated with a deprecation notice and alternative guidance.
> 2. **Data Retention (Section 22)**: Documentation link corrected to point to the current Dataverse long-term retention documentation.
> 3. **Partner Relationship Management (Section 20)**: Updated with correct documentation link (accounts management) as there is no dedicated PRM module.
> 4. All other Microsoft Learn documentation links have been verified as working first-party Microsoft documentation.

---

## How to Use This Document

This checklist is designed to help you get the most out of your Dynamics 365 Sales Enterprise investment. For each feature or consideration, please indicate your preference:

| Response | Meaning |
|----------|---------|
| **OOB** | Out of Box — Keep the default Microsoft configuration as-is |
| **N/A** | Not Applicable — This feature does not apply to your business |
| **CUSTOMIZE** | You want changes made to this feature (provide details in Notes) |
| **ENABLE** | You want this feature turned on |
| **DISABLE** | You want this feature turned off |

> **🏢 ENTERPRISE FEATURE** — Items marked with this badge are exclusive to Dynamics 365 Sales Enterprise and not available in Sales Professional.

**Tip:** Each section includes links to official Microsoft documentation for more detailed information.

---

## Table of Contents

1. [Navigation & User Interface](#1-navigation--user-interface)
2. [Dashboards & Analytics](#2-dashboards--analytics)
3. [Forms & Data Entry](#3-forms--data-entry)
4. [Views & Data Display](#4-views--data-display)
5. [Search & Find Records](#5-search--find-records)
6. [The Sales Process: Leads, Opportunities & Accounts](#6-the-sales-process-leads-opportunities--accounts)
7. [Sales Goals & Quotas](#7-sales-goals--quotas) 🏢
8. [Territory Management](#8-territory-management) 🏢
9. [Forecasting](#9-forecasting) 🏢
10. [Sales Accelerator & Sequences](#10-sales-accelerator--sequences) 🏢
11. [Sales Insights & AI Intelligence](#11-sales-insights--ai-intelligence) 🏢
12. [Email Integration](#12-email-integration)
13. [Microsoft Teams Integration](#13-microsoft-teams-integration)
14. [SharePoint Integration](#14-sharepoint-integration)
15. [Word & Excel Templates](#15-word--excel-templates)
16. [LinkedIn Sales Navigator Integration](#16-linkedin-sales-navigator-integration)
17. [Copilot AI Integration](#17-copilot-ai-integration)
18. [Sales Playbooks](#18-sales-playbooks) 🏢 ⚠️ DEPRECATED
19. [Knowledge Management](#19-knowledge-management) 🏢
20. [Partner Relationship Management](#20-partner-relationship-management) 🏢
21. [Queues & Service Level Agreements (SLAs)](#21-queues--service-level-agreements-slas)
22. [Data Retention & Disposition](#22-data-retention--disposition)
23. [Security Model & Access Control](#23-security-model--access-control)
24. [Customization Capabilities](#24-customization-capabilities)
25. [Training & Adoption](#25-training--adoption)
26. [Sign-Off & Approval](#26-sign-off--approval)

---

## 1. Navigation & User Interface

### What Is It?
The navigation menu is how your team moves around the application. Think of it like the menu bar in any software — it provides quick access to different areas like Accounts, Contacts, Leads, Opportunities, and Reports.

**📖 Learn More:** [Navigate the Sales Hub App](https://learn.microsoft.com/en-us/dynamics365/sales/user-guide-learn-basics)

### Key Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Site Map (Left Navigation)** | The vertical menu on the left side of the screen. Controls what areas appear (Leads, Accounts, Reports, etc.) | ☐ OOB ☐ CUSTOMIZE | |
| **Area Switcher** | The bottom-left dropdown that switches between different parts of the app (Sales, Settings, etc.) | ☐ OOB ☐ CUSTOMIZE | |
| **Recent Items** | Shows items you've recently viewed for quick access | ☐ OOB ☐ DISABLE | |
| **Pinned Items** | Allows users to pin frequently used records for one-click access | ☐ OOB ☐ DISABLE | |
| **Quick Create** | The "+" button that lets users quickly create new records without navigating away | ☐ OOB ☐ CUSTOMIZE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Which menu items should be visible to all sales users? | | |
| Are there any menu items that should be hidden? | | |
| Do you want different navigation for different teams (e.g., Sales vs. Sales Managers)? | ☐ Yes ☐ No | |
| Should users be able to personalize their own navigation? | ☐ Yes ☐ No | |

---

## 2. Dashboards & Analytics

### What Is It?
Dashboards are visual summaries of your sales data — think of them as your "command center" that shows key metrics, charts, and lists at a glance. Instead of running reports, you see real-time information as soon as you log in.

**📖 Learn More:** [Use Dashboards in Sales](https://learn.microsoft.com/en-us/dynamics365/sales/dashboards)

### Available Dashboard Types

| Type | Description | Your Decision | Notes |
|------|-------------|---------------|-------|
| **Sales Activity Dashboard** | Overview of activities, leads, and opportunities across the team | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Sales Manager Dashboard** | High-level view for managers showing team performance and pipeline | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Sales Performance Dashboard** | Tracks quota achievement, win rates, and revenue metrics | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Personal Dashboards** | Individual views users can create for their own tracking | ☐ ENABLE ☐ DISABLE | |
| 🏢 **Goal Tracking Dashboard** | Visualize progress against sales goals and quotas | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| 🏢 **Territory Performance Dashboard** | Compare performance across territories | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| 🏢 **Forecast Accuracy Dashboard** | Track forecast vs. actual performance over time | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |

### Key Components You Can Include

| Component | Description | Include? | Notes |
|-----------|-------------|----------|-------|
| **Pipeline Chart** | Visual representation of deals by stage | ☐ Yes ☐ No | |
| **Lead by Source Chart** | Shows where your leads are coming from | ☐ Yes ☐ No | |
| **Open Opportunities List** | Quick view of active deals | ☐ Yes ☐ No | |
| **Activities Due Today** | Tasks and follow-ups due | ☐ Yes ☐ No | |
| **Top Deals List** | Highest value opportunities | ☐ Yes ☐ No | |
| **Win/Loss Chart** | Historical performance visualization | ☐ Yes ☐ No | |
| 🏢 **Goal Progress Chart** | Visual progress toward sales goals | ☐ Yes ☐ No | |
| 🏢 **Territory Comparison Chart** | Side-by-side territory performance | ☐ Yes ☐ No | |
| 🏢 **Forecast vs. Actual Chart** | Compare predicted to actual revenue | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What metrics matter most to your sales team day-to-day? | | |
| What metrics do managers need to see for coaching? | | |
| Should different roles see different default dashboards? | ☐ Yes ☐ No | |
| Do you want real-time data or is hourly refresh acceptable? | ☐ Real-time ☐ Hourly | |

---

## 3. Forms & Data Entry

### What Is It?
Forms are the screens where users view and enter information about a record (like a Contact or Opportunity). A well-designed form shows the right information in a logical order, making it easy for your team to do their jobs without scrolling through unnecessary fields.

**📖 Learn More:** [Understand Forms in Model-Driven Apps](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-design-forms)

### Forms Available for Customization

| Entity/Record Type | Description | Your Decision | Notes |
|--------------------|-------------|---------------|-------|
| **Lead Form** | Information captured about potential customers before qualification | ☐ OOB ☐ CUSTOMIZE | |
| **Contact Form** | Individual people you do business with | ☐ OOB ☐ CUSTOMIZE | |
| **Account Form** | Companies/organizations you do business with | ☐ OOB ☐ CUSTOMIZE | |
| **Opportunity Form** | Potential deals being worked | ☐ OOB ☐ CUSTOMIZE | |
| **Activity Forms** | Tasks, Phone Calls, Appointments, Emails | ☐ OOB ☐ CUSTOMIZE | |
| **Quote Form** | Pricing proposals sent to customers | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Order Form** | Confirmed customer orders | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Invoice Form** | Billing records | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| 🏢 **Goal Form** | Sales goal configuration and tracking | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| 🏢 **Territory Form** | Territory configuration and assignment | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| 🏢 **Competitor Form** | Competitor information and tracking | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |

### Form Customization Options

| Option | Description | Your Decision | Notes |
|--------|-------------|---------------|-------|
| **Add Fields** | Include additional data points on the form | ☐ Yes ☐ No | List fields needed: |
| **Remove Fields** | Hide fields you don't use to simplify the view | ☐ Yes ☐ No | List fields to hide: |
| **Rearrange Sections** | Change the order and grouping of information | ☐ Yes ☐ No | |
| **Make Fields Required** | Force users to fill in certain information | ☐ Yes ☐ No | List required fields: |
| **Add Tabs** | Create separate tabs for different categories of information | ☐ Yes ☐ No | |
| **Business Rules** | Automatic logic like "If Industry = Healthcare, show Compliance field" | ☐ Yes ☐ No | Describe rules needed: |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What information does your team absolutely need to capture on a Lead? | | |
| What information is "nice to have" but not critical? | | |
| Are there fields currently in your CRM/spreadsheets that need to be added? | ☐ Yes ☐ No | List them: |
| Should some fields only appear in certain situations (conditional visibility)? | ☐ Yes ☐ No | |

---

## 4. Views & Data Display

### What Is It?
Views are pre-filtered lists of records — like saved searches. Instead of seeing every single contact, you might have a view for "My Active Contacts" or "Contacts in Ontario." Views help your team quickly find what they need.

**📖 Learn More:** [Create and Edit Views](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-edit-views)

### System Views (Shared Across Organization)

| View Type | Description | Your Decision | Notes |
|-----------|-------------|---------------|-------|
| **My Active [Records]** | Records owned by the logged-in user that are active | ☐ OOB ☐ CUSTOMIZE | |
| **All Active [Records]** | All active records the user has permission to see | ☐ OOB ☐ CUSTOMIZE | |
| **Inactive [Records]** | Deactivated/archived records | ☐ OOB ☐ CUSTOMIZE | |
| **Recently Viewed** | Records the user has looked at recently | ☐ OOB ☐ DISABLE | |

### Custom Views to Consider Creating

| Suggested View | Purpose | Create? | Notes |
|----------------|---------|---------|-------|
| **Leads by Source** | See leads grouped by where they came from | ☐ Yes ☐ No | |
| **Opportunities Closing This Month** | Focus on deals that need attention now | ☐ Yes ☐ No | |
| **Stale Opportunities** | Deals with no activity in X days | ☐ Yes ☐ No | Days threshold: |
| **My Accounts by Revenue** | Prioritize high-value customers | ☐ Yes ☐ No | |
| **Contacts Missing Email** | Data quality check | ☐ Yes ☐ No | |
| 🏢 **Opportunities by Territory** | See deals organized by territory | ☐ Yes ☐ No | |
| 🏢 **Opportunities with Competitors** | Deals where competitor is tracked | ☐ Yes ☐ No | |
| 🏢 **Goals Approaching Deadline** | Goals nearing their end date | ☐ Yes ☐ No | |

### View Customization Options

| Option | Description | Your Decision | Notes |
|--------|-------------|---------------|-------|
| **Add/Remove Columns** | Control what information displays in the list | ☐ CUSTOMIZE ☐ OOB | |
| **Change Column Order** | Put most important information first | ☐ CUSTOMIZE ☐ OOB | |
| **Set Default Sorting** | How records are ordered by default | ☐ CUSTOMIZE ☐ OOB | |
| **Personal Views** | Allow users to create their own saved views | ☐ ENABLE ☐ DISABLE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What views do salespeople use most often? | | |
| What views do managers need that are different from reps? | | |
| Should some views be restricted to certain teams? | ☐ Yes ☐ No | |

---

## 5. Search & Find Records

### What Is It?
Dynamics 365 offers multiple ways to find records: global search (searches across all record types), quick find (searches within a specific area), and advanced find (complex queries). Good search configuration helps your team work faster.

**📖 Learn More:** [Search for Records](https://learn.microsoft.com/en-us/power-apps/user/search)

### Search Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Relevance Search** | Intelligent search that looks across multiple record types and finds partial matches | ☐ ENABLE ☐ DISABLE | |
| **Quick Find** | Simple search within the current list/view | ☐ OOB ☐ CUSTOMIZE | |
| **Advanced Find** | Build complex queries with multiple conditions | ☐ ENABLE ☐ DISABLE | |
| **Categorized Search** | Groups results by record type (Contacts, Accounts, etc.) | ☐ ENABLE ☐ DISABLE | |

### Search Configuration

| Configuration | Description | Your Decision | Notes |
|---------------|-------------|---------------|-------|
| **Searchable Entities** | Which record types appear in global search results | ☐ OOB ☐ CUSTOMIZE | Exclude: |
| **Searchable Fields** | Which fields are searched (e.g., include custom fields) | ☐ OOB ☐ CUSTOMIZE | |
| **Quick Find Columns** | What fields are searched in quick find | ☐ OOB ☐ CUSTOMIZE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What do users typically search for? (Name, phone, email, account number?) | | |
| Are there custom fields that should be searchable? | ☐ Yes ☐ No | List them: |
| Should search include inactive/closed records? | ☐ Yes ☐ No | |

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

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Lead Source Tracking** | Track where leads come from (Website, Referral, Trade Show, etc.) | ☐ OOB ☐ CUSTOMIZE | Sources to add: |
| **Lead Rating** | Hot/Warm/Cold scoring system | ☐ OOB ☐ CUSTOMIZE ☐ N/A | |
| **Lead Qualification Criteria** | What makes a lead ready to become an Opportunity | ☐ OOB ☐ CUSTOMIZE | Criteria: |
| **Auto-Assignment** | Automatically route leads to salespeople | ☐ ENABLE ☐ N/A | Rules: |
| **Duplicate Detection** | Warn when creating leads that may already exist | ☐ ENABLE ☐ DISABLE | |
| 🏢 **Predictive Lead Scoring** | AI-powered scoring to prioritize leads (limited capacity included) | ☐ ENABLE ☐ DISABLE | |

### Lead Qualification Process

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What criteria must be met before a Lead becomes an Opportunity? | | |
| When a Lead is qualified, should it automatically create an Account and Contact? | ☐ Yes ☐ No | |
| Who should be able to qualify leads? (All reps? Managers only?) | | |
| What happens to leads that don't qualify? (Disqualify reasons?) | | |

### Opportunity Management

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Sales Stages** | Steps in your sales process (e.g., Qualify → Develop → Propose → Close) | ☐ OOB ☐ CUSTOMIZE | List your stages: |
| **Probability by Stage** | Auto-calculate win likelihood based on stage | ☐ ENABLE ☐ DISABLE | |
| **Required Fields per Stage** | Force data entry as deals progress | ☐ Yes ☐ No | |
| **Close Reasons** | Track why deals are won or lost | ☐ OOB ☐ CUSTOMIZE | Reasons to add: |
| **Product Line Items** | Add specific products/services to opportunities | ☐ ENABLE ☐ N/A | |
| 🏢 **Competitor Tracking** | Track competitors on each opportunity | ☐ ENABLE ☐ N/A | |
| 🏢 **Predictive Opportunity Scoring** | AI-powered scoring to prioritize opportunities (limited capacity) | ☐ ENABLE ☐ DISABLE | |

### 🏢 Product Catalog (Enterprise Enhanced)

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Product Families** | Group related products into families | ☐ ENABLE ☐ N/A | |
| **Product Hierarchies** | Create parent-child product relationships | ☐ ENABLE ☐ N/A | |
| **Product Relationships** | Define cross-sell, up-sell, substitute, accessory relationships | ☐ ENABLE ☐ N/A | |
| **Product Bundles** | Pre-configured groups of products sold together | ☐ ENABLE ☐ N/A | |

**📖 Learn More:** [Set Up Product Catalog](https://learn.microsoft.com/en-us/dynamics365/sales/set-up-product-catalog-walkthrough)

### Business Process Flow (BPF)

| Question | Your Answer | Notes |
|----------|-------------|-------|
| The BPF is the visual guide bar at the top of records showing sales stages. Do you want this enabled? | ☐ Yes ☐ No | |
| Should different products/services have different sales processes? | ☐ Yes ☐ No | Describe: |
| What information should be collected at each stage? | | |

**📖 Learn More:** [Business Process Flows Overview](https://learn.microsoft.com/en-us/power-automate/business-process-flows-overview)

---

## 7. Sales Goals & Quotas 🏢 ENTERPRISE FEATURE

### What Is It?
Sales Goals allow you to define, track, and measure sales targets at individual, team, and organizational levels. Goals can be based on revenue, quantity, or custom metrics, with automatic roll-up calculations.

**📖 Learn More:** [Define Sales Goals](https://learn.microsoft.com/en-us/dynamics365/sales/goals-overview)

### Goal Types to Configure

| Goal Type | Description | Your Decision | Notes |
|-----------|-------------|---------------|-------|
| **Revenue Goals** | Track target revenue (closed deals) | ☐ ENABLE ☐ N/A | |
| **Unit/Quantity Goals** | Track number of items sold or deals closed | ☐ ENABLE ☐ N/A | |
| **Activity Goals** | Track number of calls, meetings, or emails | ☐ ENABLE ☐ N/A | |
| **Custom Metric Goals** | Goals based on custom calculated fields | ☐ ENABLE ☐ N/A | Describe: |

### Goal Hierarchy & Structure

| Configuration | Description | Your Decision | Notes |
|---------------|-------------|---------------|-------|
| **Individual Goals** | Each rep has personal quota/target | ☐ Yes ☐ No | |
| **Team Goals** | Goals roll up from individuals to team level | ☐ Yes ☐ No | |
| **Manager Goals** | Managers have goals that aggregate their team | ☐ Yes ☐ No | |
| **Organizational Goals** | Company-wide targets | ☐ Yes ☐ No | |
| **Territory-Based Goals** | Goals aligned to territories | ☐ Yes ☐ No | |

### Goal Periods

| Period | Use This Period? | Notes |
|--------|------------------|-------|
| **Monthly** | ☐ Yes ☐ No | |
| **Quarterly** | ☐ Yes ☐ No | |
| **Annual** | ☐ Yes ☐ No | |
| **Custom Fiscal Periods** | ☐ Yes ☐ No | Define periods: |

### Goal Roll-Up Configuration

| Setting | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Roll-Up Frequency** | How often goal progress recalculates | ☐ Real-time ☐ Hourly ☐ Daily | |
| **In-Progress Count** | Include opportunities not yet closed in goal progress | ☐ Yes ☐ No | |
| **Stretch Goals** | Allow setting stretch/stretch targets beyond primary goal | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| How do you currently assign quotas to salespeople? | | |
| Are quotas the same for everyone or individualized? | | |
| What timeframes are used for quota measurement? | | |
| Who should be able to create/modify goals? | | |
| Should goal attainment affect any other processes (e.g., commissions)? | ☐ Yes ☐ No | |

---

## 8. Territory Management 🏢 ENTERPRISE FEATURE

### What Is It?
Territory Management allows you to organize your sales organization by geographic regions, product lines, industries, or any other segmentation. Territories can be hierarchical and can drive automatic assignment rules.

**📖 Learn More:** [Set Up Sales Territories](https://learn.microsoft.com/en-us/dynamics365/sales/set-up-sales-territories)

### Territory Structure

| Structure Type | Description | Your Decision | Notes |
|----------------|-------------|---------------|-------|
| **Geographic Territories** | Based on regions, states/provinces, countries | ☐ Yes ☐ No | |
| **Named Account Territories** | Key accounts assigned regardless of geography | ☐ Yes ☐ No | |
| **Product-Based Territories** | Organized by product line or service offering | ☐ Yes ☐ No | |
| **Industry/Vertical Territories** | Organized by customer industry | ☐ Yes ☐ No | |
| **Hybrid Territories** | Combination of above approaches | ☐ Yes ☐ No | Describe: |

### Territory Hierarchy

| Level | Name/Description | Example |
|-------|------------------|---------|
| **Level 1 (Top)** | | (e.g., "North America") |
| **Level 2** | | (e.g., "Canada", "United States") |
| **Level 3** | | (e.g., "Ontario", "Quebec") |
| **Level 4** | | (e.g., "Greater Toronto Area") |

### Territory Assignment Rules

| Rule Type | Description | Your Decision | Notes |
|-----------|-------------|---------------|-------|
| **Auto-Assign Leads by Territory** | New leads automatically assigned based on territory match | ☐ Yes ☐ No | |
| **Auto-Assign Accounts by Territory** | Accounts assigned to territory owner | ☐ Yes ☐ No | |
| **Manual Territory Assignment** | Sales managers manually assign records | ☐ Yes ☐ No | |
| **Territory Transfer Rules** | Define process when reps change territories | ☐ Yes ☐ No | |

### Territory Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| How are territories currently defined in your organization? | | |
| How many territories do you need? | | |
| Can one account belong to multiple territories? | ☐ Yes ☐ No | |
| How often do territories change? | | |
| Who manages territory assignments? | | |
| Do you need territory-specific reporting? | ☐ Yes ☐ No | |

---

## 9. Forecasting 🏢 ENTERPRISE FEATURE

### What Is It?
Sales Forecasting allows sales teams and managers to predict future revenue based on pipeline opportunities. Enterprise includes manual forecasting with roll-up capabilities, plus limited access to AI-powered predictive forecasting.

**📖 Learn More:** [Configure Forecasts](https://learn.microsoft.com/en-us/dynamics365/sales/configure-forecast)

### Forecast Configuration

| Setting | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Forecasting** | Turn on the forecasting feature | ☐ ENABLE ☐ N/A | |
| **Forecast Period** | Monthly, Quarterly, or Annually | ☐ Monthly ☐ Quarterly ☐ Annual | |
| **Fiscal Year Settings** | Align forecasts to your fiscal calendar | ☐ Calendar Year ☐ Fiscal Year | Start month: |

### Forecast Hierarchy

| Level | Description | Include? | Notes |
|-------|-------------|----------|-------|
| **Individual Seller** | Each rep forecasts their own pipeline | ☐ Yes ☐ No | |
| **Team/Manager** | Managers see rolled-up team forecasts | ☐ Yes ☐ No | |
| **Territory-Based** | Forecasts organized by territory | ☐ Yes ☐ No | |
| **Product-Based** | Forecasts organized by product family | ☐ Yes ☐ No | |
| **Organization-Wide** | Executive view of total company forecast | ☐ Yes ☐ No | |

### Forecast Categories

| Category | Description | Include? | Default Percentage |
|----------|-------------|----------|-------------------|
| **Pipeline** | Early-stage opportunities | ☐ Yes ☐ No | |
| **Best Case** | Likely to close but not committed | ☐ Yes ☐ No | |
| **Committed** | High confidence deals | ☐ Yes ☐ No | |
| **Closed** | Won deals in the period | ☐ Yes ☐ No | |
| **Omitted** | Excluded from forecast | ☐ Yes ☐ No | |

### 🏢 Predictive Forecasting (Limited Capacity)

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Predictive Forecasting** | AI predicts likely revenue outcomes | ☐ ENABLE ☐ DISABLE | |
| **Prediction Confidence Display** | Show confidence intervals on predictions | ☐ Yes ☐ No | |
| **Trend Analysis** | Display forecast trends over time | ☐ Yes ☐ No | |

### Forecast Adjustments

| Adjustment Type | Description | Allow? | Notes |
|-----------------|-------------|--------|-------|
| **Manager Adjustments** | Managers can override team member forecasts | ☐ Yes ☐ No | |
| **Direct Adjustments** | Add revenue not tied to specific opportunities | ☐ Yes ☐ No | |
| **Adjustment History** | Track all changes to forecasts | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| How do you currently forecast sales? | | |
| What time periods are most important (monthly, quarterly)? | | |
| Who needs to see forecasts? (Reps? Managers? Executives?) | | |
| Should forecasts be editable after submission? | ☐ Yes ☐ No | |
| Do you need forecast vs. actual comparison reports? | ☐ Yes ☐ No | |

---

## 10. Sales Accelerator & Sequences 🏢 ENTERPRISE FEATURE

### What Is It?
Sales Accelerator provides a prioritized worklist for sellers, combining data from multiple sources to recommend the next best actions. Sequences are automated engagement workflows that guide sellers through multi-step outreach cadences.

**Note:** Enterprise includes limited monthly capacity for Sales Accelerator. Full capacity requires Sales Premium.

**📖 Learn More:** [Sales Accelerator Overview](https://learn.microsoft.com/en-us/dynamics365/sales/sales-accelerator-intro)

### Sales Accelerator Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Sales Accelerator** | Turn on the prioritized worklist | ☐ ENABLE ☐ N/A | |
| **Work List** | Aggregated view of all pending activities | ☐ ENABLE ☐ DISABLE | |
| **Up Next Widget** | Shows next recommended action on records | ☐ ENABLE ☐ DISABLE | |
| **Activity Prioritization** | AI-based ranking of activities | ☐ ENABLE ☐ DISABLE | |

### Sequence Configuration

| Setting | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Sequences** | Allow creation of automated engagement workflows | ☐ ENABLE ☐ N/A | |
| **Sequence Templates** | Use pre-built sequence templates | ☐ Yes ☐ No | |
| **Custom Sequences** | Create organization-specific sequences | ☐ Yes ☐ No | |
| **A/B Testing** | Test different sequence variations | ☐ ENABLE ☐ N/A | |

### Sequence Types to Create

| Sequence Type | Purpose | Create? | Notes |
|---------------|---------|---------|-------|
| **New Lead Outreach** | Initial contact cadence for new leads | ☐ Yes ☐ No | |
| **Opportunity Follow-Up** | Nurture sequence for active opportunities | ☐ Yes ☐ No | |
| **Re-Engagement** | Reconnect with stale/cold leads | ☐ Yes ☐ No | |
| **Post-Meeting** | Follow-up after meetings/demos | ☐ Yes ☐ No | |
| **Win-Back** | Reach out to lost customers | ☐ Yes ☐ No | |
| **Onboarding** | New customer welcome sequence | ☐ Yes ☐ No | |

### Sequence Step Types

| Step Type | Description | Use? | Notes |
|-----------|-------------|------|-------|
| **Email** | Send automated or manual emails | ☐ Yes ☐ No | |
| **Phone Call** | Schedule call activity | ☐ Yes ☐ No | |
| **Task** | Create follow-up tasks | ☐ Yes ☐ No | |
| **LinkedIn** | LinkedIn actions (if integrated) | ☐ Yes ☐ No | |
| **Wait Steps** | Delay between activities | ☐ Yes ☐ No | |
| **Conditions** | Branch based on engagement | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you have defined outreach cadences today? | ☐ Yes ☐ No | Describe: |
| How many touches typically before a lead responds? | | |
| What communication channels do reps use most? | | |
| Should sequences vary by lead source or segment? | ☐ Yes ☐ No | |
| Who should be able to create/modify sequences? | | |

---

## 11. Sales Insights & AI Intelligence 🏢 ENTERPRISE FEATURE

### What Is It?
Sales Enterprise includes limited access to AI-powered features that help sellers work smarter. These include predictive scoring, relationship analytics, email intelligence, and the Sales Assistant. Full capacity for these features requires Sales Premium.

**📖 Learn More:** [Sales Insights Overview](https://learn.microsoft.com/en-us/dynamics365/sales/intro-admin-guide-sales-insights)

### Assistant (Relationship Assistant)

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Assistant** | AI-powered action cards with recommendations | ☐ ENABLE ☐ DISABLE | |
| **Standard Cards** | Basic insight cards (meeting reminders, follow-ups) | ☐ ENABLE ☐ DISABLE | |
| **Premium Cards** | Advanced insight cards (relationship health, deal risks) | ☐ ENABLE ☐ DISABLE | |
| **Custom Cards** | Create organization-specific insight cards | ☐ Yes ☐ No | |

### Email Intelligence

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Email Engagement** | Track when emails are opened and links clicked | ☐ ENABLE ☐ DISABLE | |
| **Email Follow-Up Reminders** | Alert when no response received | ☐ ENABLE ☐ DISABLE | |
| **Suggested Reply Times** | AI recommends best times to send | ☐ ENABLE ☐ DISABLE | |

### Auto Capture

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Auto Capture** | Automatically track emails and meetings from Outlook | ☐ ENABLE ☐ DISABLE | |
| **Activity Suggestions** | Suggest activities from captured emails | ☐ ENABLE ☐ DISABLE | |
| **Contact Suggestions** | Suggest new contacts from email signatures | ☐ ENABLE ☐ DISABLE | |

### 🏢 Relationship Analytics (Limited Capacity)

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Relationship Health Score** | AI-calculated health of customer relationships | ☐ ENABLE ☐ DISABLE | |
| **Engagement Metrics** | Track interaction frequency and recency | ☐ ENABLE ☐ DISABLE | |
| **Relationship Trends** | Show how relationships change over time | ☐ ENABLE ☐ DISABLE | |

### 🏢 Connection Insights (Who Knows Whom)

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Who Knows Whom** | Show which colleagues have relationships with contacts | ☐ ENABLE ☐ DISABLE | |
| **Introduction Requests** | Allow reps to request introductions | ☐ ENABLE ☐ DISABLE | |

### 🏢 Notes Analysis

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Notes Analysis** | AI extracts action items from meeting notes | ☐ ENABLE ☐ DISABLE | |
| **Suggested Actions** | Auto-create tasks from note content | ☐ ENABLE ☐ DISABLE | |

### 🏢 Pipeline Intelligence (Limited Capacity)

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Deal Warnings** | Alert when deals show risk signals | ☐ ENABLE ☐ DISABLE | |
| **Pipeline Trends** | Visualize pipeline changes over time | ☐ ENABLE ☐ DISABLE | |
| **Stuck Deals Identification** | Highlight deals not progressing | ☐ ENABLE ☐ DISABLE | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Which AI features would provide the most value to your team? | | |
| Are there privacy concerns with email/activity tracking? | ☐ Yes ☐ No | |
| Do you want to pilot AI features with a small group first? | ☐ Yes ☐ No | Pilot group: |
| How will you measure ROI on AI features? | | |

---

## 12. Email Integration

### What Is It?
Connect Dynamics 365 to your email system so sales activities are automatically tracked. Emails sent to/from customers can appear on their records, giving everyone visibility into communications.

**⚠️ IMPORTANT:** For this implementation, we recommend connecting a **shared mailbox** (e.g., sales@yourcompany.com) rather than individual user mailboxes. This means:
- Emails sent FROM the shared mailbox are tracked in Dynamics 365
- Individual users' personal mailboxes are NOT synchronized
- Users can still manually track emails using the Dynamics 365 App for Outlook

**📖 Learn More:** [Set Up Server-Side Synchronization](https://learn.microsoft.com/en-us/power-platform/admin/set-up-server-side-synchronization-of-email-appointments-contacts-and-tasks)

### Email Integration Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Shared Mailbox Connection** | Connect team/department shared mailbox for tracking | ☐ ENABLE ☐ N/A | Mailbox address: |
| **Dynamics 365 App for Outlook** | Outlook add-in that lets users manually track emails | ☐ ENABLE ☐ N/A | |
| **Auto-Track Incoming Emails** | Automatically log incoming emails from known contacts | ☐ ENABLE ☐ DISABLE | |
| **Auto-Track Sent Emails** | Automatically log outgoing emails to known contacts | ☐ ENABLE ☐ DISABLE | |
| **Email Templates** | Pre-written email templates for common scenarios | ☐ ENABLE ☐ N/A | |
| **Email Signatures** | Standardized signatures for outgoing emails | ☐ ENABLE ☐ N/A | |
| 🏢 **Email Engagement Tracking** | Track opens, clicks, and attachment views | ☐ ENABLE ☐ DISABLE | |
| 🏢 **Auto Capture** | Automatically capture email activity without manual tracking | ☐ ENABLE ☐ DISABLE | |

### Email Tracking Rules

| Rule | Description | Your Decision | Notes |
|------|-------------|---------------|-------|
| **Track if From/To Known Contact** | Only track if sender/recipient exists in Dynamics | ☐ Yes ☐ No | |
| **Track if From/To Known Account** | Track if domain matches a known account | ☐ Yes ☐ No | |
| **Exclude Specific Domains** | Don't track emails from certain domains | ☐ Yes ☐ No | Domains: |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| What shared mailbox(es) should be connected? | | |
| Should internal emails be tracked (between employees)? | ☐ Yes ☐ No | |
| Do you want email templates for common scenarios (follow-ups, introductions, etc.)? | ☐ Yes ☐ No | |
| Who manages/updates email templates? | | |

---

## 13. Microsoft Teams Integration

### What Is It?
Connect Dynamics 365 records directly to Microsoft Teams channels and chats. This lets your team discuss deals, share documents, and collaborate without leaving either application.

**📖 Learn More:** [Microsoft Teams Integration](https://learn.microsoft.com/en-us/dynamics365/sales/teams-integration/teams-collaboration)

### Integration Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Connect Records to Channels** | Link Accounts/Opportunities to dedicated Teams channels | ☐ ENABLE ☐ N/A | |
| **Teams Chat in Dynamics** | Start Teams chats directly from within Dynamics 365 | ☐ ENABLE ☐ N/A | |
| **Dynamics Tab in Teams** | View Dynamics 365 records as tabs within Teams | ☐ ENABLE ☐ N/A | |
| **Auto-Create Teams for Opportunities** | Automatically create a Team/Channel for large deals | ☐ ENABLE ☐ N/A | Criteria: |
| **Meeting Integration** | Schedule Teams meetings from Dynamics 365 | ☐ ENABLE ☐ N/A | |
| 🏢 **Deal Room Collaboration** | Structured collaboration space for complex deals | ☐ ENABLE ☐ N/A | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Does your team actively use Microsoft Teams today? | ☐ Yes ☐ No | |
| For which record types would Teams collaboration be valuable? | | |
| Should Teams channels be created automatically for certain deals? | ☐ Yes ☐ No | Criteria: |
| Who should have permission to connect records to Teams? | | |

---

## 14. SharePoint Integration

### What Is It?
Store documents related to your sales records (contracts, proposals, presentations) in SharePoint rather than inside Dynamics 365. This provides better document management, version control, and storage while keeping documents linked to the right records.

**📖 Learn More:** [SharePoint Document Management](https://learn.microsoft.com/en-us/power-platform/admin/manage-documents-using-sharepoint)

### Integration Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable SharePoint Integration** | Turn on document storage in SharePoint | ☐ ENABLE ☐ N/A | |
| **Account Documents** | Store Account-related files in SharePoint | ☐ Yes ☐ No | |
| **Opportunity Documents** | Store Opportunity-related files in SharePoint | ☐ Yes ☐ No | |
| **Lead Documents** | Store Lead-related files in SharePoint | ☐ Yes ☐ No | |
| **Quote Documents** | Store Quote-related files in SharePoint | ☐ Yes ☐ No | |
| **Auto-Create Folders** | Automatically create SharePoint folders when records are created | ☐ ENABLE ☐ DISABLE | |

### Folder Structure

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Should each Account have its own SharePoint folder? | ☐ Yes ☐ No | |
| Should each Opportunity have a subfolder under its Account? | ☐ Yes ☐ No | |
| Should there be standard subfolders (e.g., Contracts, Proposals, Correspondence)? | ☐ Yes ☐ No | List subfolders: |
| Which SharePoint site should be used? | | Site URL: |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you have an existing SharePoint structure for sales documents? | ☐ Yes ☐ No | |
| Who should have access to uploaded documents? | | |
| Do you need document approval workflows? | ☐ Yes ☐ No | |
| Should documents be automatically named or tagged? | ☐ Yes ☐ No | |

---

## 15. Word & Excel Templates

### What Is It?
Create standardized documents (quotes, proposals, reports) and spreadsheets that automatically pull data from Dynamics 365. Instead of copying and pasting, your team generates professional documents with one click.

**📖 Learn More:** [Word Templates](https://learn.microsoft.com/en-us/power-platform/admin/using-word-templates-dynamics-365) | [Excel Templates](https://learn.microsoft.com/en-us/power-platform/admin/analyze-your-data-with-excel-templates)

### Word Templates

| Template Type | Description | Create? | Notes |
|---------------|-------------|---------|-------|
| **Quote Letter** | Formal quote document with pricing | ☐ Yes ☐ No | |
| **Proposal Template** | Sales proposal with opportunity details | ☐ Yes ☐ No | |
| **Account Summary** | One-pager about a customer | ☐ Yes ☐ No | |
| **Contract Template** | Agreement document with auto-filled terms | ☐ Yes ☐ No | |
| **Meeting Summary** | Post-meeting follow-up document | ☐ Yes ☐ No | |
| 🏢 **Competitor Analysis** | Competitive positioning document | ☐ Yes ☐ No | |
| 🏢 **Territory Report** | Territory performance summary | ☐ Yes ☐ No | |
| **Other:** | | ☐ Yes ☐ No | |

### Excel Templates

| Template Type | Description | Create? | Notes |
|---------------|-------------|---------|-------|
| **Pipeline Report** | Export opportunities with key metrics | ☐ Yes ☐ No | |
| **Account List Export** | Customer data for analysis | ☐ Yes ☐ No | |
| **Activity Report** | Export of activities for review | ☐ Yes ☐ No | |
| **Forecast Worksheet** | Revenue forecasting template | ☐ Yes ☐ No | |
| 🏢 **Goal Progress Report** | Export goal attainment data | ☐ Yes ☐ No | |
| 🏢 **Territory Analysis** | Territory performance data export | ☐ Yes ☐ No | |
| **Other:** | | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you have existing Word templates that need to be converted? | ☐ Yes ☐ No | |
| What branding elements must be included (logos, colors, fonts)? | | |
| Who should be able to create/modify templates? | | |
| Are there compliance requirements for document content? | ☐ Yes ☐ No | |

---

## 16. LinkedIn Sales Navigator Integration

### What Is It?
If your organization has LinkedIn Sales Navigator licenses, you can connect it to Dynamics 365 to see LinkedIn profile information, connections, and insights directly on Contact and Lead records.

**📖 Learn More:** [LinkedIn Sales Navigator Integration](https://learn.microsoft.com/en-us/dynamics365/linkedin/integrate-sales-navigator)

### Integration Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable LinkedIn Integration** | Connect Sales Navigator to Dynamics 365 | ☐ ENABLE ☐ N/A | |
| **Profile Photos** | Show LinkedIn photos on contact records | ☐ Yes ☐ No | |
| **Icebreakers** | Show shared connections and interests | ☐ Yes ☐ No | |
| **Related Leads** | Suggest other people at the same company | ☐ Yes ☐ No | |
| **InMail from Dynamics** | Send LinkedIn messages from within Dynamics | ☐ Yes ☐ No | |
| **Activity Sync** | Log LinkedIn activities (InMails, connection requests) | ☐ Yes ☐ No | |

### Prerequisites

| Requirement | Status | Notes |
|-------------|--------|-------|
| LinkedIn Sales Navigator Team or Enterprise licenses | ☐ Have ☐ Need ☐ N/A | |
| Users have LinkedIn accounts | ☐ Yes ☐ No | |
| Organization approves LinkedIn data usage | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| How many users have Sales Navigator licenses? | | |
| Is LinkedIn a significant source for prospecting in your industry? | ☐ Yes ☐ No | |
| Are there data privacy concerns with showing LinkedIn data? | ☐ Yes ☐ No | |

---

## 17. Copilot AI Integration

### What Is It?
Microsoft Copilot in Dynamics 365 Sales uses AI to help your team work more efficiently. It can summarize records, draft emails, suggest next steps, and answer questions about your sales data using natural language.

**📖 Learn More:** [Copilot in Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/copilot-overview)

### Copilot Features

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Copilot** | Turn on AI assistance in Dynamics 365 Sales | ☐ ENABLE ☐ DISABLE ☐ N/A | |
| **Record Summarization** | AI-generated summaries of accounts, opportunities, leads | ☐ ENABLE ☐ DISABLE | |
| **Email Drafting** | AI helps write email responses | ☐ ENABLE ☐ DISABLE | |
| **Meeting Preparation** | AI summarizes relevant info before meetings | ☐ ENABLE ☐ DISABLE | |
| **Opportunity Insights** | AI suggests next actions on deals | ☐ ENABLE ☐ DISABLE | |
| **Natural Language Queries** | Ask questions like "Show me deals closing this week" | ☐ ENABLE ☐ DISABLE | |
| **Catch-Up Summary** | AI summarizes what's happened since you last logged in | ☐ ENABLE ☐ DISABLE | |

### Data & Privacy Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Is your organization comfortable with AI processing sales data? | ☐ Yes ☐ No | |
| Are there data residency requirements that affect AI usage? | ☐ Yes ☐ No | |
| Do you want to pilot Copilot with a small group first? | ☐ Yes ☐ No | Pilot group: |
| Should AI-generated content require human review before sending? | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Which Copilot features would provide the most value to your team? | | |
| Are there specific tasks where AI assistance would save the most time? | | |
| What training will users need to use Copilot effectively? | | |

---

## 18. Sales Playbooks 🏢 ENTERPRISE FEATURE

> **⚠️ DEPRECATION NOTICE:** Sales Playbooks have been **DEPRECATED** by Microsoft. This feature is no longer actively maintained and Microsoft recommends using alternative approaches for guided selling.
> 
> **📖 Deprecation Information:** [Removed or Deprecated Features in Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/deprecations-sales)
> 
> **Recommended Alternatives:**
> - **Sales Accelerator & Sequences** (Section 10) - For automated engagement workflows
> - **Business Process Flows** (Section 6) - For stage-based guidance
> - **Power Automate Flows** - For custom automation and notifications

### What Was It?
Sales Playbooks previously provided structured guidance to help salespeople follow best practices during the sales process. Playbooks could include activities, notes, and recommended actions triggered at specific points in the sales cycle.

### Migration Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Did you plan to use Sales Playbooks for any processes? | ☐ Yes ☐ No | |
| If yes, can these be implemented using Sales Accelerator Sequences instead? | ☐ Yes ☐ No | |
| Would Business Process Flows meet your guided selling needs? | ☐ Yes ☐ No | |
| Do you need custom automation using Power Automate? | ☐ Yes ☐ No | |

---

## 19. Knowledge Management 🏢 ENTERPRISE FEATURE

### What Is It?
Knowledge Management allows you to create, manage, and share internal knowledge articles with your sales team. This can include product information, competitive battlecards, FAQ answers, and best practices.

**📖 Learn More:** [Knowledge Management](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/set-up-knowledge-management-embedded-knowledge-search)

### Knowledge Base Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Knowledge Management** | Turn on the knowledge base | ☐ ENABLE ☐ N/A | |
| **Article Templates** | Pre-defined templates for different article types | ☐ Yes ☐ No | |
| **Article Approval Workflow** | Require approval before publishing | ☐ Yes ☐ No | |
| **Article Versioning** | Track versions and changes | ☐ ENABLE ☐ DISABLE | |
| **Contextual Knowledge** | Show relevant articles on records | ☐ ENABLE ☐ DISABLE | |

### Knowledge Article Categories

| Category | Description | Create? | Notes |
|----------|-------------|---------|-------|
| **Product Information** | Detailed product specs and features | ☐ Yes ☐ No | |
| **Competitive Intelligence** | Competitor battlecards and positioning | ☐ Yes ☐ No | |
| **Pricing Guidance** | Pricing policies and discount guidelines | ☐ Yes ☐ No | |
| **Sales Process** | How-to guides for sales processes | ☐ Yes ☐ No | |
| **FAQ/Common Questions** | Answers to frequently asked questions | ☐ Yes ☐ No | |
| **Case Studies** | Customer success stories | ☐ Yes ☐ No | |
| **Training Materials** | Onboarding and ongoing training content | ☐ Yes ☐ No | |

### Knowledge Access

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Who should be able to create/edit articles? | | |
| Should some articles be restricted to certain roles? | ☐ Yes ☐ No | |
| Should customers/partners have access to any articles? | ☐ Yes ☐ No | |
| How will articles be kept up-to-date? | | |

---

## 20. Partner Relationship Management 🏢 ENTERPRISE FEATURE

### What Is It?
Partner Relationship Management (PRM) allows you to manage relationships with channel partners, distributors, or resellers. In Dynamics 365 Sales, this is accomplished using Account entities with partner classifications to track partner organizations and their contacts.

**📖 Learn More:** [Manage Your Accounts and Contacts](https://learn.microsoft.com/en-us/dynamics365/sales/accounts-contacts)

**Note:** Dynamics 365 Sales does not include a dedicated PRM module. Partner management is typically implemented using:
- Account records with "Partner" classification
- Contact records associated with partner accounts
- Opportunity sharing and assignment features
- Power Pages for external partner portals (separate license required)

### PRM Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Partner Management** | Turn on partner relationship tracking using Account classification | ☐ ENABLE ☐ N/A | |
| **Partner Accounts** | Track partner organizations using Account entity | ☐ Yes ☐ No | |
| **Partner Contacts** | Track individuals at partner organizations | ☐ Yes ☐ No | |
| **Deal Registration** | Partners can register opportunities (requires customization) | ☐ ENABLE ☐ N/A | |
| **Partner Portal** | External portal for partner access (requires Power Pages) | ☐ ENABLE ☐ N/A | |

### Opportunity Sharing with Partners

| Setting | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Share Opportunities** | Allow opportunities to be assigned to partners | ☐ Yes ☐ No | |
| **Partner Visibility** | What partner users can see | ☐ Own Only ☐ All Partner | |
| **Partner Commission Tracking** | Track partner commissions/margins | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you sell through channel partners? | ☐ Yes ☐ No | |
| How many partners do you work with? | | |
| What information should partners have access to? | | |
| Do partners need to enter opportunities directly? | ☐ Yes ☐ No | |
| How will you track partner performance? | | |

---

## 21. Queues & Service Level Agreements (SLAs)

### What Is It?
**Queues** are shared work buckets where incoming items (leads, cases, etc.) wait to be picked up by available team members. Think of it like a shared inbox that the team works from.

**SLAs** (Service Level Agreements) are timers that ensure work gets done within promised timeframes. They can trigger warnings or escalations when deadlines approach.

**📖 Learn More:** [Queues Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel) | [SLAs Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/define-service-level-agreements)

### Queue Configuration

| Feature | Description | Your Decision | Notes |
|---------|-------------|---------------|-------|
| **Enable Queues** | Use queues for work distribution | ☐ ENABLE ☐ N/A | |
| **Lead Queue** | Pool of unassigned leads for sales to claim | ☐ Yes ☐ No | |
| 🏢 **Territory Queues** | Separate queues by territory | ☐ Yes ☐ No | Territories: |
| **Product/Service Queues** | Separate queues by product line | ☐ Yes ☐ No | Products: |
| **Round-Robin Assignment** | Automatically distribute items evenly | ☐ ENABLE ☐ N/A | |
| **Priority Queues** | High-priority queue for urgent items | ☐ Yes ☐ No | |

### SLA Configuration

| SLA Type | Description | Create? | Target Time | Notes |
|----------|-------------|---------|-------------|-------|
| **Lead Response Time** | How quickly new leads must be contacted | ☐ Yes ☐ No | | |
| **Opportunity Follow-Up** | Maximum time between customer touches | ☐ Yes ☐ No | | |
| **Quote Response Time** | Time to respond to quote requests | ☐ Yes ☐ No | | |
| **Escalation Timer** | When to escalate stalled deals | ☐ Yes ☐ No | | |

### SLA Actions

| When Timer Triggers | Action | Enable? | Notes |
|---------------------|--------|---------|-------|
| **Warning** | Email notification to owner | ☐ Yes ☐ No | |
| **Nearing Breach** | Email owner + manager | ☐ Yes ☐ No | |
| **Breach** | Escalate to manager | ☐ Yes ☐ No | |
| **Breach** | Reassign to queue | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you have existing response time commitments to customers? | ☐ Yes ☐ No | |
| How should leads be distributed among sales reps? | | |
| Who should be notified when SLAs are at risk? | | |
| Should SLA performance be tracked on dashboards? | ☐ Yes ☐ No | |

---

## 22. Data Retention & Disposition

### What Is It?
Data retention policies determine how long records are kept and what happens to old data. This is important for compliance (legal hold requirements), storage management, and keeping the system clean of outdated information.

**📖 Learn More:** [Dataverse Long Term Data Retention](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-retention-overview)

### Retention Considerations by Record Type

| Record Type | Keep Active Records | Archive After | Delete After | Notes |
|-------------|---------------------|---------------|--------------|-------|
| **Leads (Disqualified)** | N/A | ___ months | ___ years | |
| **Leads (Qualified)** | Indefinitely (becomes Opportunity) | N/A | N/A | |
| **Opportunities (Won)** | ___ years | ___ years | ___ years | |
| **Opportunities (Lost)** | ___ months | ___ years | ___ years | |
| **Accounts (Active)** | Indefinitely | N/A | N/A | |
| **Accounts (Inactive)** | ___ years | ___ years | ___ years | |
| **Contacts** | Follow Account rules | | | |
| **Activities (Emails, Calls)** | ___ years | ___ years | ___ years | |
| **Quotes** | ___ years | ___ years | ___ years | |
| **Notes & Attachments** | Follow parent record | | | |
| 🏢 **Goals (Historical)** | ___ years | ___ years | ___ years | |
| 🏢 **Forecasts (Historical)** | ___ years | ___ years | ___ years | |

### Retention Actions

| Action | Description | Use? | Notes |
|--------|-------------|------|-------|
| **Deactivate** | Record remains but is marked inactive (searchable but hidden from active views) | ☐ Yes ☐ No | |
| **Archive** | Move to long-term storage (limited access) | ☐ Yes ☐ No | |
| **Delete** | Permanently remove from system | ☐ Yes ☐ No | |
| **Anonymize** | Remove personal data but keep statistical record | ☐ Yes ☐ No | |

### Compliance & Legal Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Are there legal requirements for how long sales records must be kept? | ☐ Yes ☐ No | Requirements: |
| Do you have industry-specific retention requirements? | ☐ Yes ☐ No | |
| Is there a legal hold process that could override deletion? | ☐ Yes ☐ No | |
| Who approves data deletion? | | |
| Do you need an audit trail of deleted records? | ☐ Yes ☐ No | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| How do you currently handle old/outdated records? | | |
| Is there specific data that must never be deleted? | ☐ Yes ☐ No | |
| Should users be able to manually delete records, or only deactivate? | | |
| What triggers should move a record to "inactive" status? | | |

---

## 23. Security Model & Access Control

### What Is It?
The security model controls who can see, create, edit, and delete different types of records. Think of it as permissions — ensuring salespeople can only see their own accounts while managers can see everyone's, and preventing unauthorized changes to closed deals.

**📖 Learn More:** [Security Concepts](https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds)

### Understanding Security Layers (Plain Language)

| Layer | What It Controls | Example |
|-------|------------------|---------|
| **Security Roles** | What TYPE of records users can work with | "Sales Reps can create Leads but cannot delete Accounts" |
| 🏢 **Business Units** | Organizational boundaries for data visibility | "North Region team only sees North Region records" |
| 🏢 **Teams** | Groups of users who share access to specific records | "Deal Team for Project Alpha can all see the Opportunity" |
| **Field-Level Security** | Hiding sensitive fields from certain users | "Only Managers can see the Discount Percentage field" |
| **Record Sharing** | One-off access grants to specific records | "Share this Opportunity with the VP for review" |

### 🏢 Business Unit Structure (Enterprise)

| Business Unit | Description | Parent Unit | Notes |
|---------------|-------------|-------------|-------|
| **Root Business Unit** | Top-level (default) | N/A | |
| | | | |
| | | | |
| | | | |

### Security Roles to Configure

| Role | Typical Permissions | Your Decision | Notes |
|------|---------------------|---------------|-------|
| **Sales Representative** | Create/edit own records, read team records | ☐ OOB ☐ CUSTOMIZE | |
| **Sales Manager** | Full access to team's records, approve discounts | ☐ OOB ☐ CUSTOMIZE | |
| **Sales Administrator** | Configure system, manage users, full data access | ☐ OOB ☐ CUSTOMIZE | |
| **Sales Executive (Read-Only)** | View dashboards and reports, no editing | ☐ CREATE ☐ N/A | |
| **Partner/External User** | Limited access to shared records only | ☐ CREATE ☐ N/A | |
| 🏢 **Territory Manager** | Manage records within assigned territories | ☐ CREATE ☐ N/A | |
| 🏢 **Forecast Manager** | Edit forecasts and goals | ☐ CREATE ☐ N/A | |

### Access Levels Explained

| Level | Meaning | Example |
|-------|---------|---------|
| **User** | Only records owned by this person | Rep sees only their own leads |
| 🏢 **Business Unit** | Records owned by anyone in their department | Rep sees all leads in their division |
| 🏢 **Parent: Child BU** | Records in their department AND all sub-departments | Regional manager sees all local offices |
| **Organization** | All records of this type | Admin sees all leads company-wide |

### Permission Decisions

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Should sales reps see each other's accounts/opportunities? | ☐ Yes ☐ No ☐ Same Team Only | |
| Should managers see all records in their team? | ☐ Yes ☐ No | |
| Who can delete records? | ☐ Anyone ☐ Managers ☐ Admins Only | |
| Who can export data to Excel? | | |
| Who can import data/bulk update? | | |
| Should there be restrictions on seeing revenue/pricing data? | ☐ Yes ☐ No | |

### Field-Level Security

| Sensitive Field | Who Should See It? | Notes |
|-----------------|-------------------|-------|
| Discount Percentage | | |
| Margin/Cost Data | | |
| Commission Amount | | |
| 🏢 Competitor Information | | |
| Internal Notes | | |
| Social Security/Tax ID | | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Do you have regional or divisional boundaries for data access? | ☐ Yes ☐ No | |
| Are there external partners who need limited access? | ☐ Yes ☐ No | |
| Should closed/won deals be locked from editing? | ☐ Yes ☐ No | |
| Do you need audit logging of who views sensitive records? | ☐ Yes ☐ No | |

---

## 24. Customization Capabilities

### What Is It?
Dynamics 365 Sales Enterprise allows extensive customization without writing code. Understanding what can be changed helps you tailor the system to your business processes.

**📖 Learn More:** [Customize Dynamics 365 Sales](https://learn.microsoft.com/en-us/dynamics365/sales/customize-forms)

### 🏢 Enterprise Customization Limits vs. Professional

| Capability | Professional Limit | Enterprise Limit |
|------------|-------------------|------------------|
| **Custom Tables (Entities)** | 15 | **Unlimited** |
| **Business Process Flows** | 5 | **Unlimited** |
| **Third-Party App Integrations** | 10 | **Unlimited** |
| **Custom Dashboards** | 5 | **Unlimited** |
| **Custom Reports** | 5 | **Unlimited** |
| **Custom Charts** | 5 | **Unlimited** |
| **Portal/API Access** | Not Available | **Available** |

### What Can Be Customized

| Area | What You Can Do | Requires IT/Developer? |
|------|-----------------|------------------------|
| **Fields** | Add new fields, rename existing fields, change field types | No — Power Apps interface |
| **Forms** | Rearrange sections, show/hide fields, add tabs | No — Power Apps interface |
| **Views** | Create filtered lists, change columns, set default sorts | No — Power Apps interface |
| **Dashboards** | Build new dashboards, add charts and lists | No — Power Apps interface |
| **Business Rules** | If/then logic (e.g., "If Status = Hot, require Follow-Up Date") | No — Power Apps interface |
| **Business Process Flows** | Change sales stages, add required fields per stage | No — Power Apps interface |
| **Charts** | Create new visualizations | No — Power Apps interface |
| **Site Map (Navigation)** | Add/remove menu items, reorganize areas | No — Power Apps interface |
| **Security Roles** | Create new roles, modify permissions | Admin required |
| **Workflows/Automations** | Automated emails, record updates, approvals | Power Automate (may need training) |
| **Complex Integrations** | Connect to external systems | Developer typically required |
| 🏢 **Custom Entities/Tables** | Create entirely new record types (unlimited) | Admin/Developer |
| 🏢 **Plugins/Custom Code** | Advanced business logic | Developer required |
| 🏢 **Custom APIs** | External system integrations | Developer required |

### Customization Governance

| Question | Your Answer | Notes |
|----------|-------------|-------|
| Who should be able to make customizations? | | |
| Should changes be tested in a non-production environment first? | ☐ Yes ☐ No | |
| Who approves customization requests? | | |
| Do you want documentation of all customizations? | ☐ Yes ☐ No | |
| Is there a change management process to follow? | ☐ Yes ☐ No | |

---

## 25. Training & Adoption

### What Is It?
Even the best-configured system provides no value if people don't use it. This section covers training needs and adoption strategies to ensure your team gets full value from Dynamics 365 Sales Enterprise.

**📖 Learn More:** [Dynamics 365 Sales Training](https://learn.microsoft.com/en-us/training/dynamics365/sales)

### Training Needs Assessment

| User Group | Training Topics | Format Preference | Notes |
|------------|-----------------|-------------------|-------|
| **Sales Representatives** | Daily tasks, lead management, opportunity tracking, sequences, worklist | ☐ Live ☐ Video ☐ Written | |
| **Sales Managers** | Dashboards, reporting, team oversight, forecasting, goals, territory management | ☐ Live ☐ Video ☐ Written | |
| **Administrators** | System configuration, user management, customization, security | ☐ Live ☐ Video ☐ Written | |
| **Executives** | Dashboard review, forecasting, mobile access | ☐ Live ☐ Video ☐ Written | |

### 🏢 Enterprise-Specific Training Topics

| Topic | Who Needs Training? | Priority | Notes |
|-------|---------------------|----------|-------|
| **Sales Accelerator & Sequences** | Sales Reps | ☐ High ☐ Medium ☐ Low | |
| **Forecasting & Pipeline Management** | Sales Managers | ☐ High ☐ Medium ☐ Low | |
| **Goal Setting & Tracking** | Sales Managers | ☐ High ☐ Medium ☐ Low | |
| **Territory Management** | Admins, Managers | ☐ High ☐ Medium ☐ Low | |
| **AI/Sales Insights Features** | All Users | ☐ High ☐ Medium ☐ Low | |
| **Knowledge Base** | Sales Reps, Admins | ☐ High ☐ Medium ☐ Low | |

### Adoption Success Measures

| Metric | Target | How to Measure | Notes |
|--------|--------|----------------|-------|
| Daily Active Users | | Dynamics 365 usage reports | |
| Leads Entered Weekly | | Lead creation reports | |
| Opportunities Updated Regularly | | Last modified date tracking | |
| Email Integration Usage | | Tracked email count | |
| Dashboard Views | | Usage analytics | |
| 🏢 Forecast Submission Rate | | Forecast completion tracking | |
| 🏢 Sequence Completion Rate | | Sales Accelerator reports | |
| 🏢 Goal Attainment | | Goal tracking reports | |

### Considerations

| Question | Your Answer | Notes |
|----------|-------------|-------|
| When should training occur? (Before/after go-live?) | | |
| Who will provide ongoing support after go-live? | | |
| Should there be "power users" or "champions" in each team? | ☐ Yes ☐ No | |
| What happens if users don't enter data in the system? | | |
| How will you handle resistance to change? | | |

---

## 26. Sign-Off & Approval

### Implementation Checklist Completion

| Section | Reviewed By | Date | Status |
|---------|-------------|------|--------|
| 1. Navigation & User Interface | | | ☐ Complete |
| 2. Dashboards & Analytics | | | ☐ Complete |
| 3. Forms & Data Entry | | | ☐ Complete |
| 4. Views & Data Display | | | ☐ Complete |
| 5. Search & Find Records | | | ☐ Complete |
| 6. Sales Process (Leads, Opportunities) | | | ☐ Complete |
| 7. Sales Goals & Quotas 🏢 | | | ☐ Complete |
| 8. Territory Management 🏢 | | | ☐ Complete |
| 9. Forecasting 🏢 | | | ☐ Complete |
| 10. Sales Accelerator & Sequences 🏢 | | | ☐ Complete |
| 11. Sales Insights & AI Intelligence 🏢 | | | ☐ Complete |
| 12. Email Integration | | | ☐ Complete |
| 13. Microsoft Teams Integration | | | ☐ Complete |
| 14. SharePoint Integration | | | ☐ Complete |
| 15. Word & Excel Templates | | | ☐ Complete |
| 16. LinkedIn Sales Navigator | | | ☐ Complete |
| 17. Copilot AI Integration | | | ☐ Complete |
| 18. Sales Playbooks 🏢 ⚠️ DEPRECATED | | | ☐ Complete |
| 19. Knowledge Management 🏢 | | | ☐ Complete |
| 20. Partner Relationship Management 🏢 | | | ☐ Complete |
| 21. Queues & SLAs | | | ☐ Complete |
| 22. Data Retention & Disposition | | | ☐ Complete |
| 23. Security Model | | | ☐ Complete |
| 24. Customization Capabilities | | | ☐ Complete |
| 25. Training & Adoption | | | ☐ Complete |

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

| Topic | URL | Status |
|-------|-----|--------|
| Dynamics 365 Sales Documentation Home | https://learn.microsoft.com/en-us/dynamics365/sales/ | ✅ Verified |
| Sales Professional vs Enterprise Comparison | https://learn.microsoft.com/en-us/dynamics365/sales/overview#dynamics-365-sales-offerings | ✅ Verified |
| Navigate the Sales Hub App | https://learn.microsoft.com/en-us/dynamics365/sales/user-guide-learn-basics | ✅ Verified |
| Customize Forms | https://learn.microsoft.com/en-us/dynamics365/sales/customize-forms | ✅ Verified |
| Create and Edit Views | https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/create-edit-views | ✅ Verified |
| Dashboards | https://learn.microsoft.com/en-us/dynamics365/sales/dashboards | ✅ Verified |
| Search for Records | https://learn.microsoft.com/en-us/power-apps/user/search | ✅ Verified |
| Nurture Sales from Lead to Order | https://learn.microsoft.com/en-us/dynamics365/sales/nurture-sales-from-lead-order-sales | ✅ Verified |
| Business Process Flows | https://learn.microsoft.com/en-us/power-automate/business-process-flows-overview | ✅ Verified |
| Email Integration | https://learn.microsoft.com/en-us/power-platform/admin/set-up-server-side-synchronization-of-email-appointments-contacts-and-tasks | ✅ Verified |
| SharePoint Integration | https://learn.microsoft.com/en-us/power-platform/admin/manage-documents-using-sharepoint | ✅ Verified |
| Teams Integration | https://learn.microsoft.com/en-us/dynamics365/sales/teams-integration/teams-collaboration | ✅ Verified |
| Security Roles | https://learn.microsoft.com/en-us/power-platform/admin/security-roles-privileges | ✅ Verified |
| Security Concepts | https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds | ✅ Verified |
| Copilot in Sales | https://learn.microsoft.com/en-us/dynamics365/sales/copilot-overview | ✅ Verified |
| LinkedIn Integration | https://learn.microsoft.com/en-us/dynamics365/linkedin/integrate-sales-navigator | ✅ Verified |
| Word Templates | https://learn.microsoft.com/en-us/power-platform/admin/using-word-templates-dynamics-365 | ✅ Verified |
| Excel Templates | https://learn.microsoft.com/en-us/power-platform/admin/analyze-your-data-with-excel-templates | ✅ Verified |
| Queues | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel | ✅ Verified |
| SLAs | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/define-service-level-agreements | ✅ Verified |
| **Sales Goals** 🏢 | https://learn.microsoft.com/en-us/dynamics365/sales/goals-overview | ✅ Verified |
| **Territory Management** 🏢 | https://learn.microsoft.com/en-us/dynamics365/sales/set-up-sales-territories | ✅ Verified |
| **Forecasting** 🏢 | https://learn.microsoft.com/en-us/dynamics365/sales/configure-forecast | ✅ Verified |
| **Sales Accelerator** 🏢 | https://learn.microsoft.com/en-us/dynamics365/sales/sales-accelerator-intro | ✅ Verified |
| **Sales Insights** 🏢 | https://learn.microsoft.com/en-us/dynamics365/sales/intro-admin-guide-sales-insights | ✅ Verified |
| **Sales Playbooks** 🏢 ⚠️ | https://learn.microsoft.com/en-us/dynamics365/sales/deprecations-sales | ⚠️ DEPRECATED |
| **Knowledge Management** 🏢 | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/set-up-knowledge-management-embedded-knowledge-search | ✅ Verified |
| **Product Catalog** 🏢 | https://learn.microsoft.com/en-us/dynamics365/sales/set-up-product-catalog-walkthrough | ✅ Verified |
| **Data Retention** | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-retention-overview | ✅ Corrected |
| **Accounts & Contacts** (PRM) | https://learn.microsoft.com/en-us/dynamics365/sales/accounts-contacts | ✅ Corrected |

---

## Appendix B: Glossary of Terms

| Term | Definition |
|------|------------|
| **Account** | A company or organization you do business with |
| **Activity** | An action item like a task, phone call, email, or appointment |
| **BPF (Business Process Flow)** | The visual guide bar showing stages of a process |
| 🏢 **Business Unit** | Organizational division for security/data access boundaries |
| **Contact** | An individual person associated with an Account |
| 🏢 **Competitor** | A rival company being tracked on opportunities |
| **Copilot** | Microsoft's AI assistant built into Dynamics 365 |
| **Dashboard** | A visual summary screen showing charts, lists, and metrics |
| **Entity/Table** | A type of record (e.g., Account, Contact, Opportunity) |
| **Field** | A single piece of information (e.g., Phone Number, Email) |
| 🏢 **Forecast** | Predicted revenue for a future time period |
| **Form** | The screen layout for viewing/editing a record |
| 🏢 **Goal** | A defined sales target (revenue, quantity, activities) |
| **Lead** | A potential customer who hasn't been qualified yet |
| **OOB (Out of Box)** | Default configuration provided by Microsoft |
| **Opportunity** | A qualified potential sale being actively worked |
| 🏢 **Predictive Scoring** | AI-calculated likelihood of lead conversion or deal win |
| 🏢 **Product Family** | A grouping of related products |
| **Queue** | A shared pool of work items waiting to be claimed |
| 🏢 **Relationship Analytics** | AI-calculated health scores for customer relationships |
| 🏢 **Sales Accelerator** | Prioritized worklist and guided selling tool |
| 🏢 **Sequence** | Automated multi-step engagement workflow |
| **Security Role** | A collection of permissions assigned to users |
| **SLA (Service Level Agreement)** | A time-based commitment with automatic tracking |
| 🏢 **Territory** | A defined sales region or segment |
| **View** | A filtered, saved list of records |
| **Workflow/Flow** | An automated process that runs based on triggers |

---

## Appendix C: Enterprise vs. Professional Feature Summary

### Features ONLY in Enterprise (Not in Professional)

| Category | Enterprise-Only Features |
|----------|-------------------------|
| **Sales Management** | Sales Goals, Territory Management, Forecasting, Competitor Tracking |
| **Product Catalog** | Product Families, Hierarchies, Relationships, Bundles |
| **AI & Intelligence** | Sales Accelerator, Predictive Scoring, Relationship Analytics, Pipeline Intelligence, Notes Analysis, Who Knows Whom (limited capacity) |
| **Guidance** | Knowledge Management |
| **Organization** | Business Units, Team Configuration |
| **Relationships** | Partner Account Classification |
| **Email** | Email Engagement Tracking, Auto Capture |
| **Customization** | Unlimited Custom Tables, Unlimited BPFs, Unlimited Integrations, Portal/API Access |
| **Storage** | Additional 250MB database + 2GB file capacity per user |

---

## Appendix D: Link Verification Summary

**Document Revision Date:** January 2026

| Status | Count | Description |
|--------|-------|-------------|
| ✅ **Verified** | 28 | Links confirmed working, first-party Microsoft Learn documentation |
| ⚠️ **Deprecated** | 1 | Sales Playbooks - feature deprecated, link redirects to deprecation notice |
| 🔧 **Corrected** | 2 | Data Retention and Partner Management - URLs updated to correct destinations |

---

*Document prepared by Cloudstrucc Inc.*

*For questions or assistance, contact: contact@cloudstrucc.com*