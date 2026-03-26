# Leonardo D365 Sales - Validation Testing Guide

**Client:** Leonardo Canada Inc.  
**Project:** Dynamics 365 Sales Enterprise Implementation  
**Date:** March 26, 2026  
**Prepared By:** Cloudstrucc Inc.  

---

## Purpose

This document provides clear instructions for validating each remediated item. After Cloudstrucc implements the changes, please follow the testing steps for each item and mark as **Met** once verified.

---

## How to Use This Guide

1. For each item, read the **What Was Done** section to understand the change
2. Follow the **How to Test** steps exactly
3. Check off each verification point
4. If all checks pass, mark the item as **Met** in the validation portal
5. If any check fails, add a comment describing the issue

---

## Item 3: User Personalization Settings

**Original Response:** Want to have this option, so whoever is using the tool can make it the way they want it.

**What Was Done:**  
This feature is available out-of-the-box (OOB). We've created documentation and will cover in training.

**How to Test:**

1. Log into Dynamics 365 Sales Hub
2. Click the **gear icon** (⚙️) in the top-right corner
3. Select **Personalization Settings**
4. You should see options for:
   - Default Dashboard
   - Records Per Page
   - Time Zone
   - Default Currency
5. Try changing "Records Per Page" to 50
6. Click **OK** to save
7. Navigate to any list view (e.g., Opportunities) - confirm it shows 50 records per page

**Verification Checklist:**
- [ ] Can access Personalization Settings from gear icon
- [ ] Options are visible and editable
- [ ] Changes save and apply correctly

✅ **Mark as Met** when all checks pass

---

## Item 4: Pipeline Chart - Defence BD Lifecycle

**Original Response:** Pipeline chart should be stage-based and aligned to defence BD lifecycle (Awareness, Shaping, Pre-RFP, RFP, Evaluation).

**What Was Done:**  
- Created custom "Defence BD Pipeline" dashboard
- Pipeline chart uses new Defence BD Stage field
- Added Contact "About Section" field
- Removed Topic from Contact form
- Removed Address/Postal Code from Account form (kept City/Country)
- Created stalled opportunity reminder flow

**How to Test:**

### A. Pipeline Dashboard
1. Log into Sales Hub
2. Click **Dashboards** in the left navigation
3. Select **Leonardo BD Pipeline** from the dashboard dropdown
4. Verify the pipeline chart shows these stages in order:
   - Awareness
   - Shaping
   - Pre-RFP
   - RFP Released
   - Evaluation
   - Awarded/Lost
5. Click on a stage bar - it should filter to show those opportunities

### B. Contact Form Changes
1. Navigate to **Contacts**
2. Open any contact record (or create new)
3. Verify:
   - "Topic" field is NOT visible
   - "About Section" field IS visible (multiline text area)
4. Type some text in About Section and save

### C. Account Form Changes
1. Navigate to **Accounts**
2. Open any account record
3. Verify:
   - Address Line 1, 2, 3 are NOT visible
   - ZIP/Postal Code is NOT visible
   - City IS visible
   - Country/Region IS visible

### D. Stalled Opportunity Reminder
1. This runs automatically in the background
2. Ask Cloudstrucc to show you a test email from the reminder
3. Or wait 14 days with an untouched opportunity to receive reminder

**Verification Checklist:**
- [ ] Pipeline dashboard exists and shows correct stages
- [ ] Pipeline chart displays opportunities by stage
- [ ] Contact: Topic field removed
- [ ] Contact: About Section field added and working
- [ ] Account: Address fields hidden
- [ ] Account: City and Country still visible
- [ ] Stalled opportunity reminder confirmed (or deferred to post-go-live)

✅ **Mark as Met** when all checks pass

---

## Item 5: Sales Team Metrics Dashboard

**Original Response:** Opportunity stage progression, upcoming activities, active vs dormant opportunities, and strategic program coverage.

**What Was Done:**  
Dashboards configured with requested metrics. Location documented below.

**How to Test:**

1. Log into Sales Hub
2. Click **Dashboards** in left navigation
3. Find and open **Leonardo BD Pipeline** dashboard
4. Verify you can see:
   - Pipeline by stage (chart)
   - Active opportunities list
   - Upcoming activities
5. To see dormant opportunities:
   - Go to **Opportunities** list
   - Apply filter: "Modified On" older than 30 days
   - Or check the "Stalled Opportunities" section on dashboard

**Verification Checklist:**
- [ ] Can find the dashboard
- [ ] Pipeline chart visible
- [ ] Activity list visible
- [ ] Can filter for dormant/stalled opportunities

✅ **Mark as Met** when all checks pass

---

## Item 6: Manager Coaching Metrics

**Original Response:** Pipeline health by stage, opportunity aging, activity cadence, and coverage of strategic accounts.

**What Was Done:**  
Manager dashboard configured with team views.

**How to Test:**

1. Log into Sales Hub
2. Go to **Dashboards**
3. Select **Sales Manager Dashboard** or **Leonardo BD Pipeline**
4. Verify you can see:
   - Pipeline by stage for your team
   - Opportunity aging (time in stage)
   - Recent activities by team member
5. Click on any chart segment to drill down

**Verification Checklist:**
- [ ] Manager dashboard accessible
- [ ] Can view team pipeline
- [ ] Aging/duration visible
- [ ] Activity tracking visible

✅ **Mark as Met** when all checks pass

---

## Item 7: Contact Form - Stakeholder Tracking

**Original Response:** Light customization to support stakeholder tracking (role in procurement, influence level, relationship notes).

**What Was Done:**  
Added new fields to Contact form:
- Procurement Role
- Influence Level
- Relationship Notes
- Relationship Status

**How to Test:**

1. Navigate to **Contacts**
2. Open any existing contact OR click **+ New**
3. Look for the **Stakeholder Profile** tab (or section)
4. Verify these fields exist:
   - **Procurement Role** - dropdown with options: Decision Maker, Influencer, Technical Evaluator, End User, Gatekeeper, Champion
   - **Influence Level** - dropdown with options: High, Medium, Low
   - **Relationship Notes** - large text box
   - **Relationship Status** - dropdown with options: New, Developing, Established, Trusted Advisor
5. Fill in all fields with test data
6. Click **Save**
7. Close and reopen the record - verify data saved correctly

**Verification Checklist:**
- [ ] Stakeholder Profile section/tab visible
- [ ] Procurement Role field present with correct options
- [ ] Influence Level field present with correct options
- [ ] Relationship Notes field present (multiline)
- [ ] Relationship Status field present with correct options
- [ ] All fields save and retain data

✅ **Mark as Met** when all checks pass

---

## Item 8: Account Form Notes

**Original Response:** Customize to reflect long-lived strategic accounts, including account type and country focus.

**What Was Done:**  
Account Timeline feature provides perpetual notes. Additional fields added for account classification.

**How to Test:**

1. Navigate to **Accounts**
2. Open any account record
3. Look at the right side of the screen for the **Timeline**
4. Click the **+** button in Timeline
5. Select **Note**
6. Add a test note: "This is a test note for validation"
7. Click **Add Note**
8. Scroll down in Timeline - verify you can see older notes
9. Look for **Account Type** and **Country Focus** fields on the form

**Verification Checklist:**
- [ ] Timeline visible on Account form
- [ ] Can add new notes via + button
- [ ] Notes save and display in Timeline
- [ ] Can scroll to view historical notes
- [ ] Account Type field visible (if added)
- [ ] Country Focus field visible (if added)

✅ **Mark as Met** when all checks pass

---

## Item 9: Opportunity Form Notes

**Original Response:** Primary working form for BD. Customize to reflect program-based, long-cycle opportunities.

**What Was Done:**  
Opportunity Timeline provides perpetual notes. Form customized with BD-specific fields.

**How to Test:**

1. Navigate to **Opportunities**
2. Open any opportunity record
3. Look for the **Timeline** on the right side
4. Click **+** → **Note**
5. Add a test note and save
6. Verify the note appears in Timeline
7. Check that you can scroll through historical notes/activities

**Verification Checklist:**
- [ ] Timeline visible on Opportunity form
- [ ] Can add notes
- [ ] Notes display correctly
- [ ] Historical notes accessible by scrolling

✅ **Mark as Met** when all checks pass

---

## Item 10: Quote Form - Template

**Original Response:** Want to include template for quotation document to send out.

**What Was Done:**  
NDA and End Use templates created. Quote template deferred to Phase 2 (post-implementation). Client to provide template format.

**How to Test:**

*This item is deferred to Phase 2. For now:*

1. Confirm you can access NDA template:
   - Open any Account or Opportunity
   - Click **Word Templates** in command bar
   - Verify NDA template is available
2. Quote template will be configured after you provide the template format

**Verification Checklist:**
- [ ] NDA template accessible
- [ ] End Use template accessible
- [ ] Understand that Quote template is Phase 2

✅ **Mark as Met** (with understanding Quote template is Phase 2)

---

## Item 11: Form Tabs - Overview, Stakeholders, Procurement, Notes

**Original Response:** Separate overview, stakeholders, procurement context, and notes on Opportunity and Account forms.

**What Was Done:**  
Added organized tabs to Opportunity and Account forms.

**How to Test:**

### A. Opportunity Form
1. Navigate to **Opportunities**
2. Open any opportunity record
3. Look at the **tabs** across the top of the form
4. Verify these tabs exist:
   - **Overview** (or Summary) - key fields, dates, revenue
   - **Stakeholders** - related contacts
   - **Procurement Context** - procurement phase, strategic importance, competition
   - **Notes & History** (or Timeline tab)
5. Click each tab and verify fields are organized appropriately

### B. Account Form
1. Navigate to **Accounts**
2. Open any account record
3. Verify similar tab structure exists

**Verification Checklist:**
- [ ] Opportunity form has multiple organized tabs
- [ ] Overview tab shows key summary fields
- [ ] Stakeholders tab shows contacts
- [ ] Procurement Context tab shows BD-specific fields
- [ ] Notes/Timeline tab accessible
- [ ] Account form has similar organization

✅ **Mark as Met** when all checks pass

---

## Item 12: Priority Contact Fields

**Original Response:** Basic contact details, organization, country, and context of initial engagement.

**What Was Done:**  
Form layout reorganized to prioritize key fields at the top.

**How to Test:**

1. Navigate to **Contacts**
2. Open any contact record
3. Verify the **first section** you see contains:
   - Full Name
   - Organization/Company
   - Country
   - Email
   - Phone
4. These should be prominently displayed, not buried in the form

**Verification Checklist:**
- [ ] Key fields visible immediately when opening contact
- [ ] Name, Organization, Country at top of form
- [ ] Contact details easily accessible

✅ **Mark as Met** when all checks pass

---

## Item 13: BD-Specific Custom Fields

**Original Response:** Add BD-specific fields: procurement phase, strategic importance, partner involvement.

**What Was Done:**  
Created custom fields on Opportunity:
- Procurement Phase
- Strategic Importance
- Partner Involvement
- Partner Name
- Competition Level
- Competitive Position

**How to Test:**

1. Navigate to **Opportunities**
2. Open any opportunity (or create new)
3. Go to the **Procurement Context** tab (or look in main form)
4. Verify these fields exist:

| Field | Type | Options to Verify |
|-------|------|-------------------|
| Procurement Phase | Dropdown | Awareness, Shaping, Requirement Definition, Pre-RFP, RFP Released, Evaluation, Awarded, Lost |
| Strategic Importance | Dropdown | Critical, High, Medium, Low |
| Partner Involvement | Dropdown | None, Teaming Partner, Subcontractor, Prime Contractor, Joint Venture |
| Competition Level | Dropdown | Sole Source, Limited Competition, Full Competition, Unknown |

5. Select values for each field
6. Save the record
7. Close and reopen - verify values saved

**Verification Checklist:**
- [ ] Procurement Phase field visible with correct options
- [ ] Strategic Importance field visible with correct options
- [ ] Partner Involvement field visible with correct options
- [ ] Competition Level field visible with correct options
- [ ] All fields save correctly

✅ **Mark as Met** when all checks pass

---

## Item 14: Custom Fields Searchable

**Original Response:** Custom fields such as procurement phase and strategic importance should be searchable.

**What Was Done:**  
Enabled Dataverse Search for custom fields.

**How to Test:**

1. In Sales Hub, locate the **global search bar** at the top
2. Type a procurement phase value, e.g., "Pre-RFP"
3. Press Enter or click Search
4. Verify that opportunities with that procurement phase appear in results
5. Try searching for "Critical" (strategic importance)
6. Verify relevant opportunities appear

**Alternative Test - Quick Find:**
1. Go to **Opportunities** list view
2. Use the search box above the grid
3. Type "Shaping" or another stage name
4. Verify matching records appear

**Verification Checklist:**
- [ ] Global search returns results for Procurement Phase values
- [ ] Global search returns results for Strategic Importance values
- [ ] Quick Find in Opportunities works with custom field values

✅ **Mark as Met** when all checks pass

---

## Item 15: Lead Disqualification Reasons

**Original Response:** Disqualify with structured reasons: Not Strategically Relevant, No Identified Capability Need, Duplicate, Out of Scope, No Response.

**What Was Done:**  
Configured custom disqualification reasons.

**How to Test:**

1. Navigate to **Leads**
2. Open any lead (or create a test lead)
3. In the command bar, click **Disqualify**
4. A dialog should appear asking for the reason
5. Verify these options are available:
   - Not Strategically Relevant
   - No Identified Capability Need
   - Duplicate
   - Out of Scope
   - No Response
   - Lost to Competitor
   - Budget Constraints
   - Other
6. Select one and confirm disqualification
7. Reopen the lead and verify the status reason shows correctly

**Verification Checklist:**
- [ ] Disqualify button available on Lead
- [ ] Custom reasons appear in dropdown
- [ ] "Not Strategically Relevant" option present
- [ ] "No Identified Capability Need" option present
- [ ] "Duplicate" option present
- [ ] "Out of Scope" option present
- [ ] "No Response" option present
- [ ] Selected reason saves correctly

✅ **Mark as Met** when all checks pass

---

## Item 16: Opportunity Sales Stages - Defence Lifecycle

**Original Response:** Stages should reflect defence lifecycle: Awareness → Shaping → Requirement Definition → Pre-RFP → RFP Released → Evaluation → Awarded/Lost.

**What Was Done:**  
Created Defence BD Stage field with lifecycle stages.

**How to Test:**

1. Navigate to **Opportunities**
2. Open any opportunity (or create new)
3. Look for **Defence BD Stage** field (may be in Overview tab or header)
4. Click the dropdown and verify these stages appear **in this order**:
   - Awareness
   - Shaping
   - Requirement Definition
   - Pre-RFP
   - RFP Released
   - Evaluation
   - Awarded
   - Lost
5. Select "Shaping" and save
6. Verify the pipeline dashboard reflects this stage

**Verification Checklist:**
- [ ] Defence BD Stage field visible on Opportunity
- [ ] All 8 stages present
- [ ] Stages appear in correct order
- [ ] Can select and save a stage
- [ ] Pipeline dashboard reflects stage selection

✅ **Mark as Met** when all checks pass

---

## Item 17: Opportunity Close Reasons

**Original Response:** Customize to reflect defence realities: Lost to Competitor, Program Cancelled, Budget Shifted, Political Decision, No Bid.

**What Was Done:**  
Configured custom close reasons for Won and Lost opportunities.

**How to Test:**

1. Navigate to **Opportunities**
2. Open a test opportunity (create one if needed)
3. Click **Close as Lost** in the command bar
4. In the dialog, look at the **Status Reason** dropdown
5. Verify these options exist:
   - Lost to Competitor
   - Program Cancelled
   - Budget Shifted
   - Political Decision
   - No Bid Decision
   - Technical Disqualification
   - Pricing
   - Other
6. Select one and close the opportunity
7. Reopen and verify the reason saved correctly

**Optional - Test Won Reasons:**
1. Create another test opportunity
2. Click **Close as Won**
3. Check if Won reasons are also customized

**Verification Checklist:**
- [ ] Close as Lost shows custom reasons
- [ ] "Lost to Competitor" option present
- [ ] "Program Cancelled" option present
- [ ] "Budget Shifted" option present
- [ ] "Political Decision" option present
- [ ] "No Bid Decision" option present
- [ ] Selected reason saves correctly

✅ **Mark as Met** when all checks pass

---

## Item 18: Product Families/Categories

**Original Response:** Want different categories for different products: Newton, SkyTender, Vision, EW Training.

**What Was Done:**  
Created Product Families in the Product Catalog.

**How to Test:**

1. Navigate to **App Settings** (gear icon) → **Product Catalog** → **Families & Products**
   - OR: Go to **Products** in the left navigation
2. Verify these Product Families exist:
   - Newton
   - SkyTender
   - Vision
   - EW Training
3. Click on a family to see products within it
4. To test adding to opportunity:
   - Open any Opportunity
   - Go to **Products** tab (or subgrid)
   - Click **+ Add Product**
   - Verify you can select from the product families

**Verification Checklist:**
- [ ] Newton product family exists
- [ ] SkyTender product family exists
- [ ] Vision product family exists
- [ ] EW Training product family exists
- [ ] Can add products to an Opportunity

✅ **Mark as Met** when all checks pass

---

## Item 19: Business Process Flow - Stage Data Collection

**Original Response:** Collect specific information at each stage (Awareness through Awarded/Lost).

**What Was Done:**  
Created "Leonardo Defence BD Process" Business Process Flow with stage-specific fields.

**How to Test:**

1. Navigate to **Opportunities**
2. Create a **new Opportunity**
3. At the top of the form, you should see a **process bar** showing stages
4. Verify these stages appear in order:
   - Awareness
   - Shaping
   - Requirement Definition
   - Pre-RFP
   - RFP Released
   - Evaluation
   - Awarded/Lost
5. Click on **Awareness** stage in the process bar
6. A flyout should show the fields required for this stage:
   - Account
   - Country
   - Capability Area
   - Initial Context
7. Fill in required fields and click **Next Stage**
8. Verify you move to **Shaping** stage
9. Continue through a few stages to verify each has appropriate fields

**Verification Checklist:**
- [ ] Business Process Flow bar visible on new Opportunities
- [ ] Shows 7 stages in correct order
- [ ] Awareness stage shows: Account, Country, Capability Area, Initial Context
- [ ] Shaping stage shows: Key Stakeholders, Strategic Fit, Competitive Landscape
- [ ] Can progress through stages by completing fields
- [ ] Pre-RFP stage shows: Partner Strategy, Internal Positioning
- [ ] Each stage has relevant fields

✅ **Mark as Met** when all checks pass

---

## Item 20: Sequence - New Lead Outreach

**Original Response:** Identify, qualify, KYC, initial outreach, follow up, introductory call.

**What Was Done:**  
Created "Defence BD - New Lead Outreach" sequence in Sales Accelerator.

**How to Test:**

1. Navigate to **Sales Accelerator** (in left navigation or App Settings)
2. Go to **Sequences**
3. Find **"Defence BD - New Lead Outreach"**
4. Open it and verify the steps include:
   - Research/KYC task
   - Initial outreach email
   - Follow-up call task
   - Follow-up email
   - LinkedIn connect (manual)
   - Qualification task
5. To test in action:
   - Assign a test Lead to this sequence
   - Check your **Work List** - the first step should appear

**Verification Checklist:**
- [ ] Sequence exists in Sales Accelerator
- [ ] Contains email steps
- [ ] Contains task steps
- [ ] Contains LinkedIn step
- [ ] Steps are in logical order
- [ ] Can assign a Lead to the sequence

✅ **Mark as Met** when all checks pass

---

## Item 21: Sequence - Opportunity Follow-up

**Original Response:** Stage-based follow-up sequence supporting proposal submission, evaluation, and decision tracking.

**What Was Done:**  
Created "Defence BD - Opportunity Follow-up" sequence.

**How to Test:**

1. Go to **Sales Accelerator** → **Sequences**
2. Find **"Defence BD - Opportunity Follow-up"**
3. Open and verify steps include:
   - Review opportunity status (task)
   - Stage update request (email)
   - Internal status review (task)
   - Customer touchpoint (email)
   - Escalation review if stalled (task)
4. Verify the sequence can be applied to Opportunities

**Verification Checklist:**
- [ ] Sequence exists
- [ ] Has mix of tasks and emails
- [ ] Designed for opportunity follow-up
- [ ] Can be assigned to Opportunities

✅ **Mark as Met** when all checks pass

---

## Item 22: Sequence - Re-engagement

**Original Response:** Long-cycle reactivation cadence for dormant government or prime contractor accounts.

**What Was Done:**  
Created "Defence BD - Dormant Account Reactivation" sequence.

**How to Test:**

1. Go to **Sales Accelerator** → **Sequences**
2. Find **"Defence BD - Dormant Account Reactivation"**
3. Verify it includes:
   - Account history review (task)
   - Re-introduction email
   - LinkedIn engagement (manual)
   - Value proposition email
   - Call attempt (task)
   - Final re-engagement email
4. Steps should span 30+ days for long-cycle approach

**Verification Checklist:**
- [ ] Sequence exists
- [ ] Designed for dormant/inactive accounts
- [ ] Has extended timeline (30+ days)
- [ ] Mix of email, task, LinkedIn steps

✅ **Mark as Met** when all checks pass

---

## Item 23: Sequence - Post-Meeting

**Original Response:** Standardized follow-up structure after meetings to reinforce next steps and accountability.

**What Was Done:**  
Created "Defence BD - Post Meeting Follow-up" sequence.

**How to Test:**

1. Go to **Sales Accelerator** → **Sequences**
2. Find **"Defence BD - Post Meeting Follow-up"**
3. Verify it includes:
   - Meeting summary email (Day 0)
   - Update CRM task (Day 1)
   - Complete action items task (Day 3)
   - Check-in email (Day 7)

**Verification Checklist:**
- [ ] Sequence exists
- [ ] Starts with meeting summary email
- [ ] Includes CRM update task
- [ ] Includes follow-up check-in
- [ ] Short timeline (within 1 week)

✅ **Mark as Met** when all checks pass

---

## Item 24: Sequence - Win-back

**Original Response:** Re-approach sequence for previously lost or stalled opportunities when funding or priorities shift.

**What Was Done:**  
Created "Defence BD - Win-back Campaign" sequence.

**How to Test:**

1. Go to **Sales Accelerator** → **Sequences**
2. Find **"Defence BD - Win-back Campaign"**
3. Verify it includes:
   - Loss review task (Day 0)
   - Soft re-engagement email (Day 30)
   - Monitor opportunities task (Day 60)
   - New capability email (Day 90)
   - LinkedIn touchpoint (Day 120)
4. Designed for lost opportunities

**Verification Checklist:**
- [ ] Sequence exists
- [ ] Extended timeline (90-120 days)
- [ ] Starts with loss/lessons learned review
- [ ] Gradual re-engagement approach
- [ ] Can be applied to closed/lost opportunities

✅ **Mark as Met** when all checks pass

---

## Item 25: Sequence Step Types - Email

**Original Response:** Personalized outbound emails aligned to strategic account engagement.

**What Was Done:**  
Email steps configured in all sequences with templates.

**How to Test:**

1. Open any of the sequences created above
2. Find an **Email** step
3. Click to view the step details
4. Verify:
   - Email template is attached (or guidance provided)
   - Personalization tokens available ({firstname}, {company}, etc.)
5. Check that email steps exist in:
   - New Lead Outreach sequence ✓
   - Opportunity Follow-up sequence ✓
   - Re-engagement sequence ✓
   - Post-Meeting sequence ✓
   - Win-back sequence ✓

**Verification Checklist:**
- [ ] Email steps present in sequences
- [ ] Templates or guidance attached
- [ ] Personalization supported

✅ **Mark as Met** when all checks pass

---

## Item 26: Sequence Step Types - Task

**Original Response:** Internal follow-up tasks to ensure continuity and next-step tracking.

**What Was Done:**  
Task steps configured in all sequences.

**How to Test:**

1. Open any sequence
2. Find a **Task** step
3. Verify:
   - Task has clear description
   - Due date/timing configured
   - Priority set appropriately
4. When a sequence runs, tasks should appear in your **Work List**
5. Completing a task should advance the sequence

**Verification Checklist:**
- [ ] Task steps present in sequences
- [ ] Clear descriptions for each task
- [ ] Tasks appear in Work List when sequence runs
- [ ] Can complete tasks and progress sequence

✅ **Mark as Met** when all checks pass

---

## Item 27: Sequence Step Types - LinkedIn

**Original Response:** Manual professional engagement touchpoints where appropriate.

**What Was Done:**  
LinkedIn steps added as manual activity steps in sequences.

**How to Test:**

1. Open any sequence (e.g., New Lead Outreach)
2. Find a **LinkedIn** step (may be labeled as Manual Task or LinkedIn)
3. Verify:
   - Step indicates it's for LinkedIn engagement
   - Instructions provided (e.g., "Send connection request")
   - Marked as manual action (not automated)
4. When this step comes up in Work List:
   - You'll see guidance to perform LinkedIn action
   - You manually mark complete after doing it

**Verification Checklist:**
- [ ] LinkedIn steps present in relevant sequences
- [ ] Clearly marked as manual activity
- [ ] Instructions provided for what to do
- [ ] Can mark as complete after performing action

✅ **Mark as Met** when all checks pass

---

## Item 28: Knowledge Article Categories

**Original Response:** Newton, SkyTender, Vision and EW Training slide decks and briefing material.

**What Was Done:**  
Created Knowledge Article categories for product information.

**How to Test:**

1. Navigate to **Knowledge Articles** (may be in Service or Sales Hub)
   - Or search "Knowledge" in the app
2. Click **+ New** to create a test article
3. When selecting **Category**, verify these exist:
   - Product Information > Newton
   - Product Information > SkyTender
   - Product Information > Vision
   - Product Information > EW Training
4. Also check for:
   - Sales Collateral > Slide Decks
   - Sales Collateral > Briefing Materials

**To Access from Opportunity/Account:**
1. Open any Opportunity
2. Look for **Knowledge Base Search** section or control
3. Search for "Newton" - relevant articles should appear

**Verification Checklist:**
- [ ] Knowledge Article area accessible
- [ ] Newton category exists
- [ ] SkyTender category exists
- [ ] Vision category exists
- [ ] EW Training category exists
- [ ] Can search Knowledge from Opportunity form

✅ **Mark as Met** when all checks pass

---

## Summary Validation Checklist

Use this quick reference to track your validation progress:

| # | Item | Tested | Result |
|---|------|--------|--------|
| 3 | User Personalization Settings | ☐ | ☐ Met |
| 4 | Pipeline Chart - Defence BD Lifecycle | ☐ | ☐ Met |
| 5 | Sales Team Metrics Dashboard | ☐ | ☐ Met |
| 6 | Manager Coaching Metrics | ☐ | ☐ Met |
| 7 | Contact Form - Stakeholder Tracking | ☐ | ☐ Met |
| 8 | Account Form Notes | ☐ | ☐ Met |
| 9 | Opportunity Form Notes | ☐ | ☐ Met |
| 10 | Quote Form - Template | ☐ | ☐ Met (Phase 2) |
| 11 | Form Tabs - Organized Layout | ☐ | ☐ Met |
| 12 | Priority Contact Fields | ☐ | ☐ Met |
| 13 | BD-Specific Custom Fields | ☐ | ☐ Met |
| 14 | Custom Fields Searchable | ☐ | ☐ Met |
| 15 | Lead Disqualification Reasons | ☐ | ☐ Met |
| 16 | Opportunity Sales Stages | ☐ | ☐ Met |
| 17 | Opportunity Close Reasons | ☐ | ☐ Met |
| 18 | Product Families/Categories | ☐ | ☐ Met |
| 19 | Business Process Flow | ☐ | ☐ Met |
| 20 | Sequence - New Lead Outreach | ☐ | ☐ Met |
| 21 | Sequence - Opportunity Follow-up | ☐ | ☐ Met |
| 22 | Sequence - Re-engagement | ☐ | ☐ Met |
| 23 | Sequence - Post-Meeting | ☐ | ☐ Met |
| 24 | Sequence - Win-back | ☐ | ☐ Met |
| 25 | Sequence Step Types - Email | ☐ | ☐ Met |
| 26 | Sequence Step Types - Task | ☐ | ☐ Met |
| 27 | Sequence Step Types - LinkedIn | ☐ | ☐ Met |
| 28 | Knowledge Article Categories | ☐ | ☐ Met |

---

## Need Help?

If you encounter any issues during validation:

1. **Take a screenshot** of what you're seeing
2. **Note the exact steps** you followed
3. **Add a comment** in the validation portal describing the issue
4. **Contact Cloudstrucc** at support@cloudstrucc.com

We're here to help ensure everything works as expected!

---

*Document Version 1.0 | March 26, 2026 | Cloudstrucc Inc.*