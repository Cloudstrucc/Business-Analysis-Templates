# Leonardo D365 Sales Enterprise - Remediation Guide

**Client:** Leonardo Canada Inc.

**Project:** Dynamics 365 Sales Enterprise Implementation

**Date:** March 26, 2026

**Prepared By:** Cloudstrucc Inc.

---

## Executive Summary

This document provides step-by-step remediation guidance for the 28 validation items marked as "Not Met" by the client. Items are grouped by functional area for efficient implementation.

**Priority Legend:**

* 🔴 **High** - Core functionality, blocking adoption
* 🟡 **Medium** - Important for user experience
* 🟢 **Low** - Nice-to-have enhancements

---

## Table of Contents

1. [Navigation &amp; Menu Customization](#1-navigation--menu-customization)
2. [Dashboard &amp; Pipeline Visualization](#2-dashboard--pipeline-visualization)
3. [Form Customizations](#3-form-customizations)
4. [Search Configuration](#4-search-configuration)
5. [Lead &amp; Opportunity Management](#5-lead--opportunity-management)
6. [Sales Accelerator &amp; Sequences](#6-sales-accelerator--sequences)
7. [Knowledge Management](#7-knowledge-management)
8. [Training &amp; Documentation](#8-training--documentation)

---

## 1. Navigation & Menu Customization

### Item 3: User Personalization Settings

**Status:** Client unsure how to access

**Priority:** 🟢 Low

**Resolution:** Training/Documentation required

**Steps:**

1. Create a Quick Reference Guide showing users how to access personalization:
   * Navigate to **Settings** (gear icon) → **Personalization Settings**
   * Or click user profile → **Personalization**
2. Document available personalization options:
   * Default dashboard
   * Records per page
   * Time zone and language
   * Navigation bar customization
3. Include in Phase 1 training materials
4. Add to user onboarding checklist

**Verification:**

* [ ] Quick reference guide created
* [ ] Added to training deck
* [ ] Client confirms understanding

---

## 2. Dashboard & Pipeline Visualization

### Item 4: Pipeline Chart - Defence BD Lifecycle Stages

**Status:** Not Met

**Priority:** 🔴 High

**Client Requirements:**

* Stage-based pipeline aligned to defence BD lifecycle
* Stages: Awareness → Shaping → Pre-RFP → RFP → Evaluation
* Additional requests from client comment:
  * Remove 'topic' from contact information
  * Remove address/postal code from company (keep city/country)
  * Add 'About Section' paragraph field in contact
  * Follow-up reminder if opportunity stalls

**Steps:**

#### A. Create Custom Pipeline Chart

1. Navigate to **Power Apps** → **Solutions** → Leonardo Solution
2. Create a new **Chart** for Opportunity entity:
   ```
   Name: Defence BD PipelineEntity: OpportunityChart Type: Funnel or Stacked BarCategory: Custom Opportunity Stage fieldSeries: Estimated Revenue (Sum)
   ```
3. Configure stages in order:
   * Awareness
   * Shaping
   * Pre-RFP
   * RFP Released
   * Evaluation
   * Awarded/Lost

#### B. Create Dashboard with Pipeline

1. Navigate to **Sales Hub** → **Dashboards**
2. Create new  **System Dashboard** : "Leonardo BD Pipeline"
3. Add components:
   * Defence BD Pipeline chart (full width)
   * Active Opportunities by Stage (list)
   * Upcoming Activities (list)
   * Stalled Opportunities (list - no activity in 30 days)

#### C. Contact Form Updates (from client comment)

1. Open Contact main form in Power Apps
2. Remove fields:
   * Topic
3. Add new field:
   * **About Section** (Multiline text, 2000 chars)
4. Place prominently in Contact Information section

#### D. Account Form Updates (from client comment)

1. Open Account main form
2. Hide/remove from form:
   * Address Line 1, 2, 3
   * ZIP/Postal Code
3. Keep visible:
   * City
   * Country/Region

#### E. Stalled Opportunity Reminder (Workflow)

1. Create  **Power Automate Flow** :
   ```
   Trigger: Recurrence (Daily)Condition: Opportunity not modified in 14 days AND Status = OpenAction: Send email reminder to owner
   ```
2. Or configure **Sales Accelerator** sequence for follow-up

**Verification:**

* [ ] Pipeline chart shows correct stages
* [ ] Dashboard deployed to users
* [ ] Contact form updated
* [ ] Account form updated
* [ ] Stalled opportunity flow active

---

### Items 5 & 6: Dashboard Metrics Location

**Status:** Met (client needs training)

**Priority:** 🟢 Low

**Resolution:** Training required

**Steps:**

1. Document dashboard locations in user guide:
   * **Sales Activity Dashboard** : Sales Hub → Dashboards → Sales Activity
   * **Pipeline Health** : Custom Leonardo BD Pipeline dashboard
   * **Warm/Hot/Abandoned** : Filter opportunities by last activity date
2. Create quick reference card with screenshots
3. Include in manager training session

**Verification:**

* [ ] Dashboard navigation guide created
* [ ] Included in training materials

---

## 3. Form Customizations

### Item 7: Contact Form - Stakeholder Tracking

**Status:** Not Met

**Priority:** 🔴 High

**Client Requirements:**

* Role in procurement
* Influence level
* Relationship notes

**Steps:**

1. Navigate to **Power Apps** → **Tables** → **Contact**
2. Add new columns:| Column Name         | Type           | Options                                                                         |
   | ------------------- | -------------- | ------------------------------------------------------------------------------- |
   | Procurement Role    | Choice         | Decision Maker, Influencer, Technical Evaluator, End User, Gatekeeper, Champion |
   | Influence Level     | Choice         | High, Medium, Low                                                               |
   | Relationship Notes  | Multiline Text | 4000 chars                                                                      |
   | Relationship Status | Choice         | New, Developing, Established, Trusted Advisor                                   |
3. Open Contact **Main Form**
4. Create new  **Tab** : "Stakeholder Profile"
5. Add new fields to tab
6. Publish customizations
7. Update Security Roles if field-level security needed

**Verification:**

* [ ] Fields created and on form
* [ ] Client confirms visibility
* [ ] Sample data entered for testing

---

### Items 8 & 9: Account & Opportunity Form Notes

**Status:** Met (client needs training)

**Priority:** 🟢 Low

**Resolution:** Training on Timeline feature

**Steps:**

1. Create training documentation:
   * Timeline is located on right side of record
   * Click **+** to add Note, Task, Email, Appointment
   * Notes are perpetual and scrollable
   * Filter timeline by activity type
2. Show how to scroll to oldest notes
3. Demonstrate search within timeline

**Verification:**

* [ ] Timeline training documented
* [ ] Client confirms understanding

---

### Item 10: Quote Form - Template

**Status:** Met (deferred to Phase 2)

**Priority:** 🟡 Medium

**Current Status:** NDA and End Use templates created. Quote template deferred to post-Phase 1.

**Phase 2 Steps:**

1. Obtain quote template from client
2. Create Word template with merge fields
3. Configure in **Settings** → **Templates** → **Document Templates**
4. Test quote generation

**Verification:**

* [ ] Client provides template
* [ ] Template configured (Phase 2)

---

### Item 11: Form Tabs - Overview, Stakeholders, Procurement, Notes

**Status:** Not Met

**Priority:** 🔴 High

**Steps for Opportunity Form:**

1. Navigate to **Power Apps** → **Tables** → **Opportunity** → **Forms**
2. Edit **Main Form**
3. Add new Tabs:| Tab Name            | Sections            | Fields                                                                    |
   | ------------------- | ------------------- | ------------------------------------------------------------------------- |
   | Overview            | Summary, Key Dates  | Est. Revenue, Close Date, Stage, Probability                              |
   | Stakeholders        | Key Contacts        | Primary Contact, subgrid of related Contacts with roles                   |
   | Procurement Context | Procurement Details | Procurement Phase, Strategic Importance, Competition, Partner Involvement |
   | Notes & History     | Timeline            | Timeline control, full width                                              |
4. Reorder tabs logically
5. Publish form

**Steps for Account Form:**

1. Similar tab structure:
   * Overview (Account Type, Country Focus)
   * Stakeholders (Related Contacts subgrid)
   * Strategic Context
   * Notes & History

**Verification:**

* [ ] Opportunity form tabs created
* [ ] Account form tabs created
* [ ] Client confirms layout

---

### Item 12: Contact/Account Priority Fields

**Status:** Met (client wants prioritization)

**Priority:** 🟡 Medium

**Steps:**

1. Reorder form sections to prioritize:
   * Contact: Name, Organization, Country, Engagement Context at top
   * Account: Name, Type, Country at top
2. Consider using **Form Sections** with headers
3. Use **Business Rules** to show/hide less critical fields

**Verification:**

* [ ] Fields reordered on forms
* [ ] Client confirms priority fields are prominent

---

### Item 13: BD-Specific Custom Fields

**Status:** Not Met

**Priority:** 🔴 High

**Client Requirements:**

* Procurement Phase
* Strategic Importance
* Partner Involvement

**Steps:**

1. Navigate to **Power Apps** → **Tables** → **Opportunity**
2. Add new columns:| Column Name          | Type   | Options                                                                                      |
   | -------------------- | ------ | -------------------------------------------------------------------------------------------- |
   | Procurement Phase    | Choice | Awareness, Shaping, Requirement Definition, Pre-RFP, RFP Released, Evaluation, Awarded, Lost |
   | Strategic Importance | Choice | Critical, High, Medium, Low                                                                  |
   | Partner Involvement  | Choice | None, Teaming Partner, Subcontractor, Prime Contractor, Joint Venture                        |
   | Partner Name         | Lookup | Account                                                                                      |
   | Competition Level    | Choice | Sole Source, Limited Competition, Full Competition, Unknown                                  |
   | Competitive Position | Choice | Incumbent, Challenger, Unknown                                                               |
3. Add fields to Opportunity form (Procurement Context tab)
4. Make searchable (see Item 14)
5. Publish

**Verification:**

* [ ] All fields created
* [ ] Added to form
* [ ] Client confirms field list complete

---

## 4. Search Configuration

### Item 14: Custom Fields Searchable

**Status:** Not Met

**Priority:** 🟡 Medium

**Client Requirements:**

* Procurement Phase searchable
* Strategic Importance searchable

**Steps:**

1. Navigate to **Power Platform Admin Center**
2. Go to **Environments** → Leonardo Environment → **Settings**
3. Select **Product** → **Features**
4. Ensure **Dataverse Search** is enabled
5. Navigate to **Power Apps** → **Tables** → **Opportunity**
6. For each custom field:
   * Open column settings
   * Enable **Searchable** = Yes
7. Rebuild search index:
   * **Settings** → **Administration** → **System Settings** → **General**
   * Or wait for automatic rebuild (up to 24 hours)

**Alternative - Quick Find View:**

1. Open Opportunity **Quick Find View**
2. Add columns: Procurement Phase, Strategic Importance
3. Save and publish

**Verification:**

* [ ] Dataverse Search enabled
* [ ] Custom fields marked searchable
* [ ] Test search for custom field values

---

## 5. Lead & Opportunity Management

### Item 15: Lead Disqualification Reasons

**Status:** Not Met

**Priority:** 🔴 High

**Client Requirements:**

* Not Strategically Relevant
* No Identified Capability Need
* Duplicate
* Out of Scope
* No Response

**Steps:**

1. Navigate to **Power Apps** → **Tables** → **Lead**
2. Find column: **Status Reason** (or create custom  **Disqualification Reason** )
3. Edit the choice options for "Disqualified" status:| Value | Label                         |
   | ----- | ----------------------------- |
   | 1     | Not Strategically Relevant    |
   | 2     | No Identified Capability Need |
   | 3     | Duplicate                     |
   | 4     | Out of Scope                  |
   | 5     | No Response                   |
   | 6     | Lost to Competitor            |
   | 7     | Budget Constraints            |
   | 8     | Other                         |
4. Publish changes
5. Test lead disqualification flow

**Verification:**

* [ ] Disqualification reasons configured
* [ ] Test disqualify lead with new reasons
* [ ] Client confirms options

---

### Item 16: Opportunity Sales Stages

**Status:** Not Met

**Priority:** 🔴 High

**Client Requirements:**
Defence BD Lifecycle stages:

* Awareness
* Shaping
* Requirement Definition
* Pre-RFP
* RFP Released
* Evaluation
* Awarded/Lost

**Steps:**

1. Navigate to **Power Apps** → **Tables** → **Opportunity**
2. Create new column: **Defence BD Stage** (Choice)
3. Add options:| Value | Label                  | Description                              |
   | ----- | ---------------------- | ---------------------------------------- |
   | 100   | Awareness              | Initial identification of opportunity    |
   | 200   | Shaping                | Influencing requirements and positioning |
   | 300   | Requirement Definition | Confirmed need and scope                 |
   | 400   | Pre-RFP                | Preparing for formal solicitation        |
   | 500   | RFP Released           | Active bid preparation                   |
   | 600   | Evaluation             | Proposal submitted, awaiting decision    |
   | 700   | Awarded                | Won                                      |
   | 800   | Lost                   | Lost or No Bid                           |
4. Add to Opportunity form (Overview tab)
5. Update **Business Process Flow** (see Item 19)
6. Update pipeline charts to use new field
7. Consider hiding OOB "Sales Stage" or mapping values

**Verification:**

* [ ] Stages created
* [ ] Added to form and BPF
* [ ] Pipeline chart updated
* [ ] Client confirms stages

---

### Item 17: Opportunity Close Reasons

**Status:** Not Met

**Priority:** 🔴 High

**Client Requirements:**

* Lost to Competitor
* Program Cancelled
* Budget Shifted
* Political Decision
* No Bid

**Steps:**

1. Navigate to **Power Apps** → **Tables** → **Opportunity**
2. Edit **Status Reason** choices for "Lost" status:| Value | Label                      |
   | ----- | -------------------------- |
   | 1     | Lost to Competitor         |
   | 2     | Program Cancelled          |
   | 3     | Budget Shifted             |
   | 4     | Political Decision         |
   | 5     | No Bid Decision            |
   | 6     | Technical Disqualification |
   | 7     | Pricing                    |
   | 8     | Other                      |
3. Optionally add "Won" reasons:
   * Best Value
   * Lowest Price
   * Incumbent Advantage
   * Technical Excellence
   * Sole Source
4. Publish changes

**Verification:**

* [ ] Close reasons configured
* [ ] Test opportunity close with new reasons
* [ ] Client confirms options

---

### Item 18: Product Families/Categories

**Status:** Not Met

**Priority:** 🟡 Medium

**Client Requirements:**
Product categories:

* Newton
* SkyTender
* Vision
* EW Training

**Steps:**

1. Navigate to **Sales Hub** → **App Settings** → **Product Catalog**
2. Go to **Families & Products**
3. Create  **Product Families** :| Family Name | Description                 |
   | ----------- | --------------------------- |
   | Newton      | Newton product line         |
   | SkyTender   | SkyTender systems           |
   | Vision      | Vision solutions            |
   | EW Training | Electronic Warfare Training |
4. Create Products under each family as needed
5. Associate products with Price Lists
6. Add to Opportunity Products

**Include in Training:**

* How to add products to opportunities
* How to create quotes with products

**Verification:**

* [ ] Product families created
* [ ] Sample products added
* [ ] Included in training

---

### Item 19: Business Process Flow Stages

**Status:** Not Met

**Priority:** 🔴 High

**Client Requirements:**
Stage-specific data collection at each phase.

**Steps:**

1. Navigate to **Power Apps** → **Flows** → **Business Process Flows**
2. Create new BPF: "Leonardo Defence BD Process"
3. Entity: Opportunity
4. Configure stages:

**Stage 1: Awareness**

* Fields: Account, Country, Capability Area, Initial Context
* Required: Account, Country

**Stage 2: Shaping**

* Fields: Key Stakeholders (subgrid), Strategic Fit, Competitive Landscape
* Required: Primary Contact

**Stage 3: Requirement Definition**

* Fields: Confirmed Need, Program Scope, Estimated Timeline
* Required: Program Scope

**Stage 4: Pre-RFP**

* Fields: Procurement Status, Partner Strategy, Internal Positioning
* Required: Partner Involvement

**Stage 5: RFP Released**

* Fields: Bid Decision, Competitive Position, RFP Due Date
* Required: Bid Decision

**Stage 6: Evaluation**

* Fields: Proposal Status, Customer Engagement Level, Decision Date
* Required: Proposal Status

**Stage 7: Awarded/Lost**

* Fields: Close Reason, Lessons Learned, Final Revenue
* Branching: Different fields for Won vs Lost

5. Activate BPF
6. Set as default for Opportunities
7. Deactivate or hide OOB Opportunity Sales Process

**Verification:**

* [ ] BPF created with all stages
* [ ] Fields mapped to each stage
* [ ] Tested end-to-end
* [ ] Client confirms workflow

---

## 6. Sales Accelerator & Sequences

### Items 20-27: Sales Sequences

**Status:** Not Met (8 items)

**Priority:** 🔴 High

**Client Requirements:**
Create sequences for:

1. New Lead Outreach
2. Opportunity Follow-up
3. Re-engagement
4. Post-Meeting
5. Win-back
6. Email steps
7. Task steps
8. LinkedIn steps

**Pre-requisites:**

* Sales Accelerator license assigned
* Sales Accelerator enabled in environment

**Steps:**

### Enable Sales Accelerator

1. Navigate to **Sales Hub** → **App Settings** → **Sales Accelerator**
2. Enable Sales Accelerator
3. Configure work assignment rules

### Sequence 1: New Lead Outreach

1. Go to **Sequences** → **+ New Sequence**
2. Name: "Defence BD - New Lead Outreach"
3. Entity: Lead
4. Steps:| Day | Step Type | Description                       |
   | --- | --------- | --------------------------------- |
   | 0   | Task      | Research account and stakeholders |
   | 1   | Email     | Initial outreach - introduction   |
   | 3   | Task      | Follow up call attempt            |
   | 5   | Email     | Follow up if no response          |
   | 7   | LinkedIn  | Connect request (manual)          |
   | 10  | Task      | Qualification assessment          |
   | 14  | Email     | Final follow up                   |
5. Configure exit criteria: Lead qualified or disqualified

### Sequence 2: Opportunity Follow-up

1. Name: "Defence BD - Opportunity Follow-up"
2. Entity: Opportunity
3. Steps:| Day | Step Type | Description                  |
   | --- | --------- | ---------------------------- |
   | 0   | Task      | Review opportunity status    |
   | 7   | Email     | Stage update request         |
   | 14  | Task      | Internal status review       |
   | 21  | Email     | Customer touchpoint          |
   | 30  | Task      | Escalation review if stalled |

### Sequence 3: Re-engagement

1. Name: "Defence BD - Dormant Account Reactivation"
2. Entity: Account or Opportunity
3. Steps:| Day | Step Type | Description                 |
   | --- | --------- | --------------------------- |
   | 0   | Task      | Review account history      |
   | 1   | Email     | Re-introduction email       |
   | 7   | LinkedIn  | Profile engagement          |
   | 14  | Email     | Value proposition update    |
   | 21  | Task      | Call attempt                |
   | 30  | Email     | Final re-engagement attempt |

### Sequence 4: Post-Meeting

1. Name: "Defence BD - Post Meeting Follow-up"
2. Entity: Opportunity
3. Steps:| Day | Step Type | Description                    |
   | --- | --------- | ------------------------------ |
   | 0   | Email     | Meeting summary and next steps |
   | 1   | Task      | Update CRM with meeting notes  |
   | 3   | Task      | Complete any promised actions  |
   | 7   | Email     | Check-in and progress update   |

### Sequence 5: Win-back

1. Name: "Defence BD - Win-back Campaign"
2. Entity: Opportunity (Lost)
3. Steps:| Day | Step Type | Description                            |
   | --- | --------- | -------------------------------------- |
   | 0   | Task      | Review loss reason and lessons learned |
   | 30  | Email     | Soft re-engagement                     |
   | 60  | Task      | Monitor for new opportunities          |
   | 90  | Email     | New capability announcement            |
   | 120 | LinkedIn  | Maintain relationship                  |

### Step Type Configuration

**Email Steps:**

* Use email templates for consistency
* Personalization tokens: {firstname}, {company}, {product}
* Subject line best practices

**Task Steps:**

* Clear action descriptions
* Link to relevant records
* Priority settings

**LinkedIn Steps:**

* Manual activity type
* Guidance notes for seller
* Connection request templates

**Verification:**

* [ ] All 5 sequences created
* [ ] Email templates configured
* [ ] Task descriptions clear
* [ ] LinkedIn steps documented
* [ ] Sequences activated
* [ ] Client trained on usage

---

## 7. Knowledge Management

### Item 28: Knowledge Article Categories

**Status:** Not Met

**Priority:** 🟡 Medium

**Client Requirements:**
Product information articles for:

* Newton
* SkyTender
* Vision
* EW Training

**Steps:**

1. Navigate to **Customer Service Hub** or **Sales Hub** (if Knowledge enabled)
2. Go to **Service Management** → **Knowledge Article Settings**
3. Configure  **Categories** :| Category                 | Subcategory        |
   | ------------------------ | ------------------ |
   | Product Information      | Newton             |
   | Product Information      | SkyTender          |
   | Product Information      | Vision             |
   | Product Information      | EW Training        |
   | Sales Collateral         | Slide Decks        |
   | Sales Collateral         | Briefing Materials |
   | Sales Collateral         | Case Studies       |
   | Competitive Intelligence | -                  |
   | Pricing & Proposals      | -                  |
4. Create Knowledge Articles:
   * Import existing slide decks/PDFs as attachments
   * Create summary articles with key talking points
   * Tag with appropriate categories
5. Configure Knowledge Search in Sales Hub:
   * Add Knowledge Base Search control to forms
   * Enable on Opportunity and Account forms

**Verification:**

* [ ] Categories created
* [ ] Sample articles uploaded
* [ ] Knowledge search enabled in Sales Hub
* [ ] Include in training

---

## 8. Training & Documentation

### Items Requiring Training Clarification

Several items were marked "Not Met" because the client couldn't locate or verify features that are actually implemented. Create training materials for:

| Item | Topic              | Training Content                                  |
| ---- | ------------------ | ------------------------------------------------- |
| 3    | Personalization    | How to access and configure personal settings     |
| 5    | Metrics Location   | Dashboard navigation and filtering                |
| 6    | Manager Dashboards | Where to find team performance views              |
| 8-9  | Timeline Notes     | How to use Timeline for account/opportunity notes |
| 12   | Priority Fields    | Form layout and field locations                   |
| 18   | Product Families   | How to add products to opportunities              |
| 28   | Knowledge Articles | How to search and use KB articles                 |

**Training Deliverables:**

1. [ ] User Quick Start Guide (PDF)
2. [ ] Feature-specific tip sheets
3. [ ] Video walkthroughs (optional)
4. [ ] Hands-on training session
5. [ ] Post-training assessment

---

## Implementation Checklist

### Phase 1A - Critical (Week 1-2)

* [ ] Opportunity stages (Item 16)
* [ ] Close reasons (Item 17)
* [ ] Lead disqualification reasons (Item 15)
* [ ] BD-specific fields (Item 13)
* [ ] Business Process Flow (Item 19)
* [ ] Form tabs (Item 11)
* [ ] Contact stakeholder fields (Item 7)

### Phase 1B - Important (Week 2-3)

* [ ] Pipeline dashboard (Item 4)
* [ ] Sales sequences - all 5 (Items 20-27)
* [ ] Search configuration (Item 14)
* [ ] Product families (Item 18)

### Phase 1C - Training & Polish (Week 3-4)

* [ ] Knowledge articles (Item 28)
* [ ] Training documentation
* [ ] User training sessions
* [ ] Form field prioritization (Item 12)

### Phase 2 (Post Go-Live)

* [ ] Quote template (Item 10)
* [ ] Advanced reporting
* [ ] Process refinements

---

## Appendix A: PowerShell Scripts

### Export Current Configuration

```powershell
# Connect to Dataverse
Connect-CrmOnline -ServerUrl "https://leonardo.crm3.dynamics.com"

# Export solution with customizations
Export-CrmSolution -SolutionName "LeonardoSales" -Managed $false -Path "C:\Exports"
```

### Bulk Create Choice Values

```powershell
# Example: Create opportunity stages
$stages = @(
    @{Value=100; Label="Awareness"},
    @{Value=200; Label="Shaping"},
    @{Value=300; Label="Requirement Definition"},
    @{Value=400; Label="Pre-RFP"},
    @{Value=500; Label="RFP Released"},
    @{Value=600; Label="Evaluation"},
    @{Value=700; Label="Awarded"},
    @{Value=800; Label="Lost"}
)
# Use Power Platform CLI or direct API calls
```

---

## Appendix B: Estimated Effort

| Category                 | Items        | Effort (Hours)     |
| ------------------------ | ------------ | ------------------ |
| Form Customizations      | 5            | 12                 |
| Field Creation           | 3            | 6                  |
| Choice/Option Sets       | 3            | 4                  |
| Business Process Flow    | 1            | 8                  |
| Sales Sequences          | 5            | 16                 |
| Dashboard & Charts       | 2            | 8                  |
| Knowledge Management     | 1            | 4                  |
| Search Configuration     | 1            | 2                  |
| Training & Documentation | -            | 12                 |
| **Total**          | **21** | **72 hours** |

---

## Document Control

| Version | Date           | Author           | Changes         |
| ------- | -------------- | ---------------- | --------------- |
| 1.0     | March 26, 2026 | Cloudstrucc Inc. | Initial version |

---

*This document is confidential and intended for Leonardo Canada Inc. and Cloudstrucc Inc. project team members only.*
