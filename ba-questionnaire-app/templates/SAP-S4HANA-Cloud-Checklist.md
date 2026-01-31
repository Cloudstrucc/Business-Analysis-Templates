# SAP S/4HANA Cloud Implementation Requirements Checklist

**Client Name:** _______________________________________________
**Project Start Date:** _______________________________________________
**Target Go-Live Date:** _______________________________________________
**Prepared By:** _______________________________________________

---

## How to Use This Document

This checklist helps organizations gather requirements and make key decisions for implementing SAP S/4HANA Cloud. It covers organizational structure, finance, procurement, sales, manufacturing, integration, data migration, security, and go-live planning.

| Response | Meaning |
| -------- | ------- |
| **OOB** | Out of Box — Keep the SAP standard/best practice configuration |
| **N/A** | Not Applicable — Does not apply to your organization |
| **CUSTOMIZE** | You want changes made (provide details in Notes) |
| **ENABLE** | You want this feature turned on |
| **DISABLE** | You want this feature turned off |

---

## 1. S/4HANA Cloud Overview

### What Is It?

SAP S/4HANA Cloud is SAP's intelligent ERP suite built on the SAP HANA in-memory database. It provides real-time analytics, AI-powered automation, and streamlined business processes across finance, supply chain, manufacturing, and sales.

**📖 Learn More:** [SAP S/4HANA Cloud Overview](https://help.sap.com/docs/SAP_S4HANA_CLOUD)

### Implementation Approach

| Setting | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Greenfield Implementation** | New implementation, no legacy data/processes | ☐ Yes ☐ No | |
| **Brownfield Conversion** | System conversion from existing SAP ECC | ☐ Yes ☐ No | |
| **Selective Data Transition** | Hybrid approach, selective data migration | ☐ Yes ☐ No | |
| **SAP Activate Methodology** | SAP's implementation framework | ☐ Yes ☐ No | |

### Modules In Scope

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Finance (FI)** | General Ledger, AP, AR, Asset Mgmt | ☐ Yes ☐ No | |
| **Controlling (CO)** | Cost centers, profit centers, PA | ☐ Yes ☐ No | |
| **Procurement (MM)** | Purchasing, inventory management | ☐ Yes ☐ No | |
| **Sales & Distribution (SD)** | Sales orders, pricing, shipping | ☐ Yes ☐ No | |
| **Production Planning (PP)** | Manufacturing, MRP | ☐ Yes ☐ No | |
| **Warehouse Management (EWM)** | Advanced warehouse operations | ☐ Yes ☐ No | |
| **Quality Management (QM)** | Quality inspection, certificates | ☐ Yes ☐ No | |
| **Project Systems (PS)** | Project management, WBS | ☐ Yes ☐ No | |
| **Plant Maintenance (PM)** | Equipment, maintenance orders | ☐ Yes ☐ No | |
| **Service Management** | Customer service, service orders | ☐ Yes ☐ No | |

### Current State Assessment

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is your current ERP system? | | |
| What is the ERP version and support status? | | |
| How many active users do you have? | | |
| How many legal entities are in scope? | | |
| How many countries do you operate in? | | |
| What is your annual transaction volume? | | |
| What are the key pain points with current system? | | |
| Do you have previous SAP experience? | ☐ Yes ☐ No | |

---

## 2. Deployment Model

### What Is It?

SAP S/4HANA Cloud is available in multiple deployment models. The choice impacts customization capabilities, update cycles, and operational responsibilities.

**📖 Learn More:** [S/4HANA Cloud Editions](https://help.sap.com/docs/SAP_S4HANA_CLOUD/product-finder)

### Edition Selection

| Setting | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Public Cloud** | Multi-tenant SaaS, quarterly updates | ☐ Yes ☐ No | |
| **Private Cloud (RISE)** | Single-tenant, managed by SAP | ☐ Yes ☐ No | |
| **Private Cloud (Customer-Managed)** | On-premise or hyperscaler, customer-managed | ☐ Yes ☐ No | |

### Public Cloud Considerations

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| Can you adopt SAP Best Practices with minimal changes? | ☐ Yes ☐ No | |
| Are quarterly mandatory updates acceptable? | ☐ Yes ☐ No | |
| Can you work within key user extensibility limits? | ☐ Yes ☐ No | |
| Is a clean core strategy acceptable? | ☐ Yes ☐ No | |

### Private Cloud Considerations

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| Do you require custom ABAP development? | ☐ Yes ☐ No | |
| Do you need control over update timing? | ☐ Yes ☐ No | |
| Are there industry-specific requirements? | ☐ Yes ☐ No | |
| Is data residency in a specific region required? | ☐ Yes ☐ No | |

### Infrastructure & Hosting

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is your preferred hyperscaler? | ☐ AWS ☐ Azure ☐ GCP ☐ SAP DC | |
| What is your primary data center region? | | |
| What is your disaster recovery region? | | |
| Do you have high availability requirements? | ☐ Yes ☐ No | |
| What is your expected system availability SLA? | ☐ 99.5% ☐ 99.9% ☐ 99.95% | |

---

## 3. Organizational Structure

### What Is It?

The organizational structure in SAP defines legal, financial, and logistical entities. Proper design is critical as it impacts reporting, processes, and master data.

**📖 Learn More:** [Enterprise Structure](https://help.sap.com/docs/SAP_S4HANA_CLOUD/enterprise-structure)

### Legal & Financial Structure

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| How many Company Codes are needed? | | |
| Are Business Areas required for cross-company reporting? | ☐ Yes ☐ No | |
| Is Segment Reporting (IFRS 8) required? | ☐ Yes ☐ No | |
| Are Functional Areas needed for cost of sales? | ☐ Yes ☐ No | |

### Company Code Details

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| List all company codes (Code, Name, Country, Currency) | | |
| What Chart of Accounts will be used? | | |
| Is a Group Chart of Accounts needed? | ☐ Yes ☐ No | |
| Are Country-specific Charts of Accounts needed? | ☐ Yes ☐ No | |

### Controlling Structure

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| How many Controlling Areas are needed? | | |
| Approximate number of Cost Centers? | | |
| Approximate number of Profit Centers? | | |
| What Cost Center hierarchy structure is needed? | | |

### Logistics Structure

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| How many Plants are in scope? | | |
| How many Storage Locations per plant (average)? | | |
| How many Warehouses require EWM? | | |
| How many Shipping Points are needed? | | |

### Sales Structure

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| How many Sales Organizations are needed? | | |
| How many Distribution Channels? | | |
| How many Divisions? | | |
| Are Sales Offices/Groups needed? | ☐ Yes ☐ No | |

### Purchasing Structure

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| How many Purchasing Organizations are needed? | | |
| How many Purchasing Groups? | | |
| Is centralized or decentralized purchasing used? | ☐ Centralized ☐ Decentralized | |

---

## 4. Finance (FI)

### What Is It?

The Finance module handles all financial accounting including General Ledger, Accounts Payable, Accounts Receivable, Asset Accounting, and Bank Accounting. S/4HANA introduces the Universal Journal for simplified financial data storage.

**📖 Learn More:** [SAP S/4HANA Finance](https://help.sap.com/docs/SAP_S4HANA_CLOUD/finance)

### General Ledger

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Chart of Accounts** | Account structure | ☐ OOB ☐ CUSTOMIZE | |
| **Group Chart of Accounts** | Corporate consolidation mapping | ☐ ENABLE ☐ N/A | |
| **Country Chart of Accounts** | Statutory reporting requirements | ☐ ENABLE ☐ N/A | |
| **Parallel Accounting** | Multiple GAAP (IFRS, local GAAP) | ☐ ENABLE ☐ N/A | |
| **Document Splitting** | Balance sheet by profit center | ☐ ENABLE ☐ DISABLE | |
| **Extension Ledger** | Additional reporting dimensions | ☐ ENABLE ☐ N/A | |

### Fiscal Year & Periods

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is your fiscal year variant? | ☐ Calendar Year ☐ Non-Calendar | |
| How many posting periods? | ☐ 12 ☐ 13 ☐ Other | |
| Are special periods needed for year-end? | ☐ Yes ☐ No | |
| Who is the period open/close process owner? | | |

### Accounts Payable

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Vendor Master Governance** | Central or local maintenance | ☐ Central ☐ Local | |
| **Automatic Payment Program** | Batch payment runs | ☐ ENABLE ☐ N/A | |
| **Evaluated Receipt Settlement** | Invoice-less processing | ☐ ENABLE ☐ N/A | |
| **Vendor Invoice Management** | OpenText VIM or similar | ☐ ENABLE ☐ N/A | |
| **3-Way Matching** | PO-GR-Invoice matching | ☐ ENABLE ☐ DISABLE | |
| **Withholding Tax** | Tax withholding requirements | ☐ ENABLE ☐ N/A | |
| **1099 Reporting (US)** | US tax reporting | ☐ ENABLE ☐ N/A | |

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What payment methods are required? | | |
| What are your standard payment terms? | | |

### Accounts Receivable

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Customer Master Governance** | Central or local maintenance | ☐ Central ☐ Local | |
| **Credit Management** | Credit limit controls | ☐ ENABLE ☐ N/A | |
| **Collections Management** | Dunning and collections | ☐ ENABLE ☐ N/A | |
| **Dunning Program** | Automated dunning letters | ☐ ENABLE ☐ N/A | |
| **Electronic Invoicing** | E-invoicing requirements | ☐ ENABLE ☐ N/A | |
| **Cash Application** | Automated payment matching | ☐ ENABLE ☐ N/A | |
| **Dispute Management** | Track billing disputes | ☐ ENABLE ☐ N/A | |

### Asset Accounting

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Depreciation Areas** | Book, tax, group depreciation | ☐ OOB ☐ CUSTOMIZE | |
| **Depreciation Methods** | Straight-line, declining balance | ☐ OOB ☐ CUSTOMIZE | |
| **Asset Classes** | Categorization of assets | ☐ OOB ☐ CUSTOMIZE | |
| **Parallel Valuation** | Multiple valuation approaches | ☐ ENABLE ☐ N/A | |
| **IFRS 16 Lease Accounting** | Lease capitalization | ☐ ENABLE ☐ N/A | |
| **Asset Under Construction** | Capital projects | ☐ ENABLE ☐ N/A | |

### Bank Accounting

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Bank Statement Processing** | Electronic bank statements | ☐ ENABLE ☐ N/A | |
| **Bank Communication Mgmt** | Payment file formats | ☐ ENABLE ☐ N/A | |
| **Check Management** | Check printing and voiding | ☐ ENABLE ☐ N/A | |
| **Cash Pooling** | Intercompany cash management | ☐ ENABLE ☐ N/A | |
| **In-House Cash** | Internal bank | ☐ ENABLE ☐ N/A | |

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| How many house banks/bank accounts are in scope? | | |

### Tax Configuration

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Tax Procedure** | Tax calculation method | ☐ OOB ☐ CUSTOMIZE | |
| **Tax Codes** | VAT/GST/Sales tax codes | ☐ OOB ☐ CUSTOMIZE | |
| **Tax Jurisdiction (US)** | US sales tax by location | ☐ ENABLE ☐ N/A | |
| **External Tax Engine** | Vertex, Avalara integration | ☐ ENABLE ☐ N/A | |
| **Deferred Tax** | Tax timing differences | ☐ ENABLE ☐ N/A | |

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What external tax engine will be used (if any)? | | |

---

## 5. Controlling (CO)

### What Is It?

Controlling provides management accounting capabilities including cost center accounting, internal orders, product costing, and profitability analysis.

**📖 Learn More:** [Management Accounting](https://help.sap.com/docs/SAP_S4HANA_CLOUD/management-accounting)

### Cost Center Accounting

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Cost Center Hierarchy** | Standard hierarchy structure | ☐ OOB ☐ CUSTOMIZE | |
| **Cost Center Categories** | Types (production, admin, etc.) | ☐ OOB ☐ CUSTOMIZE | |
| **Activity Types** | Machine hours, labor hours | ☐ ENABLE ☐ N/A | |
| **Statistical Key Figures** | Allocation bases | ☐ ENABLE ☐ N/A | |
| **Assessment Cycles** | Cost allocation | ☐ ENABLE ☐ N/A | |
| **Distribution Cycles** | Primary cost distribution | ☐ ENABLE ☐ N/A | |

### Internal Orders

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Internal Order Types** | Overhead, investment, accrual | ☐ OOB ☐ CUSTOMIZE | |
| **Order Settlement** | Settlement to cost center/asset | ☐ ENABLE ☐ N/A | |
| **Budget Management** | Order budgeting | ☐ ENABLE ☐ N/A | |
| **Commitment Management** | Track commitments | ☐ ENABLE ☐ N/A | |

### Product Costing

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Standard Cost Estimates** | Product cost calculation | ☐ ENABLE ☐ N/A | |
| **Costing Variants** | Costing parameters | ☐ OOB ☐ CUSTOMIZE | |
| **Actual Cost Component Split** | Actual cost breakdown | ☐ ENABLE ☐ N/A | |
| **Cost Object Controlling** | Make-to-order costing | ☐ ENABLE ☐ N/A | |

### Profitability Analysis

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Margin Analysis** | Universal Journal PA | ☐ ENABLE ☐ N/A | |
| **Profitability Segments** | Characteristics for analysis | ☐ OOB ☐ CUSTOMIZE | |
| **Value Fields** | Revenue, cost, margin fields | ☐ OOB ☐ CUSTOMIZE | |
| **Top-Down Distribution** | Allocate overhead to segments | ☐ ENABLE ☐ N/A | |

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is the name of your Operating Concern? | | |

### Profit Center Accounting

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Profit Center Hierarchy** | Standard hierarchy | ☐ OOB ☐ CUSTOMIZE | |
| **Profit Center Determination** | Assignment rules | ☐ OOB ☐ CUSTOMIZE | |
| **Intercompany Elimination** | IC profit elimination | ☐ ENABLE ☐ N/A | |

---

## 6. Procurement (MM)

### What Is It?

The Procurement module covers the entire procure-to-pay process including purchase requisitions, purchase orders, goods receipt, and invoice verification.

**📖 Learn More:** [SAP S/4HANA Procurement](https://help.sap.com/docs/SAP_S4HANA_CLOUD/procurement)

### Master Data

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Material Master** | Product/item master data | ☐ OOB ☐ CUSTOMIZE | |
| **Material Types** | Categories (finished, raw, etc.) | ☐ OOB ☐ CUSTOMIZE | |
| **Material Groups** | Product categorization | ☐ OOB ☐ CUSTOMIZE | |
| **Business Partner (Vendor)** | Supplier master data | ☐ OOB ☐ CUSTOMIZE | |
| **Source Lists** | Approved supplier lists | ☐ ENABLE ☐ N/A | |
| **Info Records** | Purchasing info records | ☐ ENABLE ☐ N/A | |
| **Quota Arrangements** | Supplier allocation | ☐ ENABLE ☐ N/A | |

### Purchase Requisitions

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Direct Requisitions** | Manual PR creation | ☐ ENABLE ☐ N/A | |
| **Indirect Requisitions** | Generated from MRP | ☐ ENABLE ☐ N/A | |
| **Requisition Approval Workflow** | Approval process | ☐ ENABLE ☐ N/A | |
| **Self-Service Requisitioning** | Employee self-service | ☐ ENABLE ☐ N/A | |

### Purchase Orders

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Standard PO** | Regular purchase orders | ☐ ENABLE ☐ N/A | |
| **Framework Orders** | Blanket/contract orders | ☐ ENABLE ☐ N/A | |
| **Scheduling Agreements** | Delivery schedules | ☐ ENABLE ☐ N/A | |
| **Consignment** | Vendor-managed inventory | ☐ ENABLE ☐ N/A | |
| **Subcontracting** | External processing | ☐ ENABLE ☐ N/A | |
| **Stock Transport Orders** | Interplant transfers | ☐ ENABLE ☐ N/A | |
| **PO Approval Workflow** | Approval process | ☐ ENABLE ☐ N/A | |
| **PO Output (Email/EDI)** | PO transmission | ☐ ENABLE ☐ N/A | |

### Goods Receipt

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **GR Against PO** | Standard goods receipt | ☐ ENABLE ☐ N/A | |
| **GR Without Reference** | Unplanned receipts | ☐ ENABLE ☐ DISABLE | |
| **Automatic GR** | ASN-based posting | ☐ ENABLE ☐ N/A | |
| **Returns Processing** | Return to vendor | ☐ ENABLE ☐ N/A | |
| **Quality Inspection on GR** | QM integration | ☐ ENABLE ☐ N/A | |

### Invoice Verification

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Invoice Entry** | Manual invoice posting | ☐ ENABLE ☐ N/A | |
| **Invoice Verification Tolerance** | Matching tolerances | ☐ OOB ☐ CUSTOMIZE | |
| **Evaluated Receipt Settlement** | Auto-invoice on GR | ☐ ENABLE ☐ N/A | |
| **Duplicate Invoice Check** | Prevent duplicate payments | ☐ ENABLE ☐ DISABLE | |
| **Blocked Invoices Workflow** | Approval for blocked invoices | ☐ ENABLE ☐ N/A | |

### Inventory Management

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Valuation Method** | Standard, moving average, FIFO | ☐ Standard ☐ Moving Avg ☐ FIFO | |
| **Split Valuation** | Batch/origin valuation | ☐ ENABLE ☐ N/A | |
| **Batch Management** | Lot tracking | ☐ ENABLE ☐ N/A | |
| **Serial Number Management** | Serialized inventory | ☐ ENABLE ☐ N/A | |
| **Handling Units** | Packaging units | ☐ ENABLE ☐ N/A | |
| **Physical Inventory** | Cycle counting, annual count | ☐ ENABLE ☐ N/A | |
| **Consignment Stock** | Customer/vendor consignment | ☐ ENABLE ☐ N/A | |

---

## 7. Sales & Distribution (SD)

### What Is It?

Sales & Distribution covers the order-to-cash process including quotations, sales orders, delivery, shipping, and billing.

**📖 Learn More:** [SAP S/4HANA Sales](https://help.sap.com/docs/SAP_S4HANA_CLOUD/sales)

### Master Data

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Business Partner (Customer)** | Customer master data | ☐ OOB ☐ CUSTOMIZE | |
| **Customer Account Groups** | Customer categorization | ☐ OOB ☐ CUSTOMIZE | |
| **Customer Hierarchies** | Corporate structures | ☐ ENABLE ☐ N/A | |
| **Material Master (Sales)** | Sales views | ☐ OOB ☐ CUSTOMIZE | |
| **Customer-Material Info** | Customer-specific data | ☐ ENABLE ☐ N/A | |

### Pricing

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Pricing Procedure** | Pricing calculation steps | ☐ OOB ☐ CUSTOMIZE | |
| **Condition Types** | Prices, discounts, surcharges | ☐ OOB ☐ CUSTOMIZE | |
| **Price Lists** | Customer-specific pricing | ☐ ENABLE ☐ N/A | |
| **Rebate Processing** | Volume rebates | ☐ ENABLE ☐ N/A | |
| **Promotional Pricing** | Time-limited pricing | ☐ ENABLE ☐ N/A | |
| **Intercompany Pricing** | Transfer pricing | ☐ ENABLE ☐ N/A | |

### Sales Documents

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Inquiry** | Customer inquiry | ☐ ENABLE ☐ N/A | |
| **Quotation** | Sales quote | ☐ ENABLE ☐ N/A | |
| **Standard Order** | Regular sales order | ☐ ENABLE ☐ N/A | |
| **Rush Order** | Same-day delivery | ☐ ENABLE ☐ N/A | |
| **Cash Sales** | Immediate delivery and payment | ☐ ENABLE ☐ N/A | |
| **Returns** | Customer returns | ☐ ENABLE ☐ N/A | |
| **Credit/Debit Memo** | Adjustments | ☐ ENABLE ☐ N/A | |
| **Consignment Fill-Up** | Consignment deliveries | ☐ ENABLE ☐ N/A | |
| **Make-to-Order** | Configured/built-to-order | ☐ ENABLE ☐ N/A | |
| **Third-Party Orders** | Drop shipments | ☐ ENABLE ☐ N/A | |

### Availability Check

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **ATP Check** | Available-to-promise | ☐ ENABLE ☐ N/A | |
| **Checking Rule** | ATP configuration | ☐ OOB ☐ CUSTOMIZE | |
| **Backorder Processing** | Rescheduling backorders | ☐ ENABLE ☐ N/A | |
| **Allocation** | Product allocation | ☐ ENABLE ☐ N/A | |

### Shipping & Delivery

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Delivery Types** | Outbound delivery categories | ☐ OOB ☐ CUSTOMIZE | |
| **Picking** | Warehouse picking | ☐ ENABLE ☐ N/A | |
| **Packing** | Handling units | ☐ ENABLE ☐ N/A | |
| **Shipping Point Determination** | Automatic shipping point | ☐ OOB ☐ CUSTOMIZE | |
| **Route Determination** | Transportation routes | ☐ ENABLE ☐ N/A | |
| **Carrier Integration** | TMS integration | ☐ ENABLE ☐ N/A | |
| **Proof of Delivery** | POD capture | ☐ ENABLE ☐ N/A | |

### Billing

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Billing Types** | Invoice, credit, debit memo | ☐ OOB ☐ CUSTOMIZE | |
| **Billing Due List** | Batch billing | ☐ ENABLE ☐ N/A | |
| **Intercompany Billing** | Cross-company invoicing | ☐ ENABLE ☐ N/A | |
| **Invoice Output** | Print, email, EDI | ☐ OOB ☐ CUSTOMIZE | |
| **Revenue Recognition** | IFRS 15/ASC 606 | ☐ ENABLE ☐ N/A | |
| **E-Invoicing/E-Document** | Electronic invoicing | ☐ ENABLE ☐ N/A | |

---

## 8. Manufacturing & Production Planning

### What Is It?

Manufacturing modules support production planning, execution, and control including MRP, production orders, and shop floor control.

**📖 Learn More:** [SAP S/4HANA Manufacturing](https://help.sap.com/docs/SAP_S4HANA_CLOUD/manufacturing)

### Master Data

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Bill of Materials (BOM)** | Product structure | ☐ ENABLE ☐ N/A | |
| **BOM Usage** | Production, sales, engineering | ☐ OOB ☐ CUSTOMIZE | |
| **Routing** | Production steps and operations | ☐ ENABLE ☐ N/A | |
| **Work Centers** | Production resources | ☐ ENABLE ☐ N/A | |
| **Production Versions** | Alternative production methods | ☐ ENABLE ☐ N/A | |

### Planning

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Material Requirements Planning** | MRP run | ☐ ENABLE ☐ N/A | |
| **MRP Type** | Consumption-based, deterministic | ☐ OOB ☐ CUSTOMIZE | |
| **Planning Strategy** | MTS, MTO, ATO | ☐ OOB ☐ CUSTOMIZE | |
| **Demand Management** | Forecast consumption | ☐ ENABLE ☐ N/A | |
| **Long-Term Planning** | Simulation planning | ☐ ENABLE ☐ N/A | |
| **Capacity Planning** | Capacity evaluation | ☐ ENABLE ☐ N/A | |
| **Capacity Leveling** | Load balancing | ☐ ENABLE ☐ N/A | |

### Production Execution

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Discrete Manufacturing** | Production orders | ☐ ENABLE ☐ N/A | |
| **Process Manufacturing** | Process orders | ☐ ENABLE ☐ N/A | |
| **Repetitive Manufacturing** | Rate-based production | ☐ ENABLE ☐ N/A | |
| **Kanban** | Pull-based production | ☐ ENABLE ☐ N/A | |
| **Order Confirmation** | Time and quantity confirmations | ☐ ENABLE ☐ N/A | |
| **Backflushing** | Automatic consumption | ☐ ENABLE ☐ N/A | |
| **Co-Products/By-Products** | Multiple outputs | ☐ ENABLE ☐ N/A | |
| **Rework Processing** | Handle defects | ☐ ENABLE ☐ N/A | |

### Shop Floor Integration

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Shop Floor Execution (SFE)** | Digital manufacturing | ☐ ENABLE ☐ N/A | |
| **Production Operator Dashboard** | Operator interface | ☐ ENABLE ☐ N/A | |
| **MES Integration** | Manufacturing Execution System | ☐ ENABLE ☐ N/A | |
| **IoT/Machine Integration** | Equipment connectivity | ☐ ENABLE ☐ N/A | |

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What MES system will be integrated (if any)? | | |

---

## 9. Warehouse Management

### What Is It?

SAP offers basic Inventory Management (IM) within MM and advanced Extended Warehouse Management (EWM) for complex warehouse operations.

**📖 Learn More:** [Extended Warehouse Management](https://help.sap.com/docs/SAP_S4HANA_CLOUD/ewm)

### Warehouse Approach

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| Which warehouse management approach? | ☐ Basic IM ☐ Embedded EWM ☐ Decentralized EWM | |
| How many warehouses are in scope? | | |
| What is the warehouse complexity level? | ☐ Low ☐ Medium ☐ High | |
| What WMS is currently in use? | | |

### Basic Inventory Management

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Storage Locations** | Basic storage areas | ☐ ENABLE ☐ N/A | |
| **Bin Management** | Simple bin tracking | ☐ ENABLE ☐ N/A | |
| **Stock Types** | Unrestricted, blocked, QI | ☐ OOB ☐ CUSTOMIZE | |
| **Movement Types** | Inventory transactions | ☐ OOB ☐ CUSTOMIZE | |
| **Reservation Management** | Material reservations | ☐ ENABLE ☐ N/A | |

### Extended Warehouse Management (EWM)

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Warehouse Structure** | Bins, aisles, zones | ☐ ENABLE ☐ N/A | |
| **Storage Type Search** | Putaway strategies | ☐ ENABLE ☐ N/A | |
| **Wave Management** | Pick wave creation | ☐ ENABLE ☐ N/A | |
| **Task Management** | Warehouse tasks | ☐ ENABLE ☐ N/A | |
| **Resource Management** | Equipment and labor | ☐ ENABLE ☐ N/A | |
| **RF/Mobile Devices** | Handheld scanners | ☐ ENABLE ☐ N/A | |
| **Yard Management** | Trailer and dock management | ☐ ENABLE ☐ N/A | |
| **Cross-Docking** | Flow-through operations | ☐ ENABLE ☐ N/A | |
| **Slotting** | Bin optimization | ☐ ENABLE ☐ N/A | |
| **Labor Management** | Productivity tracking | ☐ ENABLE ☐ N/A | |
| **Catch Weight Management** | Variable weight items | ☐ ENABLE ☐ N/A | |

---

## 10. Quality Management

### What Is It?

Quality Management ensures products meet quality standards through inspection planning, inspection execution, and quality notifications.

**📖 Learn More:** [Quality Management](https://help.sap.com/docs/SAP_S4HANA_CLOUD/quality-management)

### Quality Planning

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Inspection Plans** | Quality test procedures | ☐ ENABLE ☐ N/A | |
| **Material Specifications** | Quality requirements | ☐ ENABLE ☐ N/A | |
| **Master Inspection Characteristics** | Test attributes | ☐ ENABLE ☐ N/A | |
| **Sampling Procedures** | Sample size determination | ☐ ENABLE ☐ N/A | |
| **Dynamic Modification** | Skip lot sampling | ☐ ENABLE ☐ N/A | |

### Inspection Execution

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Inspection Lot Creation** | Automatic/manual | ☐ OOB ☐ CUSTOMIZE | |
| **Inspection at GR** | Receiving inspection | ☐ ENABLE ☐ N/A | |
| **In-Process Inspection** | Production inspection | ☐ ENABLE ☐ N/A | |
| **Final Inspection** | Finished goods inspection | ☐ ENABLE ☐ N/A | |
| **Results Recording** | Test results entry | ☐ ENABLE ☐ N/A | |
| **Usage Decision** | Accept/reject/scrap | ☐ ENABLE ☐ N/A | |
| **Quality Stock Posting** | Move to/from QI stock | ☐ ENABLE ☐ N/A | |

### Quality Notifications

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Customer Complaints** | External quality issues | ☐ ENABLE ☐ N/A | |
| **Vendor Complaints** | Supplier quality issues | ☐ ENABLE ☐ N/A | |
| **Internal Notifications** | Internal quality issues | ☐ ENABLE ☐ N/A | |
| **8D Problem Solving** | Root cause analysis | ☐ ENABLE ☐ N/A | |
| **CAPA (Corrective Actions)** | Corrective/preventive actions | ☐ ENABLE ☐ N/A | |

### Quality Certificates

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Certificate of Analysis** | COA generation | ☐ ENABLE ☐ N/A | |
| **Certificate Receipt** | Vendor certificate capture | ☐ ENABLE ☐ N/A | |

---

## 11. Project Systems

### What Is It?

Project Systems supports project-centric businesses with work breakdown structures, project budgeting, and project-related procurement and manufacturing.

**📖 Learn More:** [Project Management](https://help.sap.com/docs/SAP_S4HANA_CLOUD/project-management)

### Project Scope

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What types of projects are managed? | | |
| Approximate number of active projects? | | |
| Average project duration? | | |
| What are typical project budget ranges? | | |
| Is integration with external PM tools needed? | ☐ Yes ☐ No | |

### Project Structure

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Project Definition** | Project header | ☐ ENABLE ☐ N/A | |
| **WBS Elements** | Work breakdown structure | ☐ ENABLE ☐ N/A | |
| **WBS Hierarchy** | Project structure levels | ☐ OOB ☐ CUSTOMIZE | |
| **Network/Activities** | Task scheduling | ☐ ENABLE ☐ N/A | |
| **Milestones** | Project milestones | ☐ ENABLE ☐ N/A | |
| **Project Templates** | Standard project structures | ☐ ENABLE ☐ N/A | |

### Project Financials

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Project Budgeting** | Budget management | ☐ ENABLE ☐ N/A | |
| **Budget Availability Control** | Prevent over-spending | ☐ ENABLE ☐ N/A | |
| **Project Billing** | Customer billing from project | ☐ ENABLE ☐ N/A | |
| **Billing Plans** | Milestone/periodic billing | ☐ ENABLE ☐ N/A | |
| **Revenue Recognition** | Project revenue | ☐ ENABLE ☐ N/A | |
| **Project Settlement** | Cost allocation | ☐ ENABLE ☐ N/A | |
| **Results Analysis** | WIP calculation | ☐ ENABLE ☐ N/A | |

### Project Execution

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Project Procurement** | PR/PO from project | ☐ ENABLE ☐ N/A | |
| **Project Stock** | Project-specific inventory | ☐ ENABLE ☐ N/A | |
| **Project Manufacturing** | Make-to-project | ☐ ENABLE ☐ N/A | |
| **Time Confirmation** | Activity time recording | ☐ ENABLE ☐ N/A | |
| **Progress Tracking** | Percent complete | ☐ ENABLE ☐ N/A | |

---

## 12. Human Capital Management Integration

### What Is It?

While S/4HANA Cloud focuses on ERP, integration with HR systems (SuccessFactors, on-premise HCM) is often required for employee data, time management, and payroll.

**📖 Learn More:** [SAP SuccessFactors Integration](https://help.sap.com/docs/SAP_SUCCESSFACTORS_INTEGRATION)

### HCM Strategy

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is your current HR system? | | |
| What is your target HR system? | ☐ SuccessFactors ☐ SAP HCM ☐ Third-party | |
| What is the integration scope? | | |

### Integration Requirements

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Employee Master Data** | Sync employee records | ☐ ENABLE ☐ N/A | |
| **Organizational Management** | Org structure sync | ☐ ENABLE ☐ N/A | |
| **Time Management** | Time recording for production/projects | ☐ ENABLE ☐ N/A | |
| **Payroll Results Posting** | Post payroll to GL | ☐ ENABLE ☐ N/A | |
| **Travel & Expense** | Expense integration | ☐ ENABLE ☐ N/A | |
| **Cost Center Assignment** | HR cost center sync | ☐ ENABLE ☐ N/A | |

---

## 13. Analytics & Reporting

### What Is It?

S/4HANA provides embedded analytics through SAP Fiori apps, CDS views, and integration with SAP Analytics Cloud for advanced analytics.

**📖 Learn More:** [SAP S/4HANA Embedded Analytics](https://help.sap.com/docs/SAP_S4HANA_CLOUD/embedded-analytics)

### Embedded Analytics

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Analytical Apps** | Standard Fiori analytical apps | ☐ OOB ☐ CUSTOMIZE | |
| **KPI Tiles** | Homepage KPI display | ☐ ENABLE ☐ N/A | |
| **Multidimensional Reporting** | Pivot-style reports | ☐ ENABLE ☐ N/A | |
| **Smart Business Cockpits** | Role-based dashboards | ☐ ENABLE ☐ N/A | |
| **Custom CDS Views** | Custom analytical queries | ☐ ENABLE ☐ N/A | |

### SAP Analytics Cloud (SAC)

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **SAC Integration** | Connect to SAC | ☐ ENABLE ☐ N/A | |
| **Live Data Connection** | Real-time data from S/4 | ☐ ENABLE ☐ N/A | |
| **Import Data Connection** | Scheduled data extracts | ☐ ENABLE ☐ N/A | |
| **Planning Integration** | Financial planning | ☐ ENABLE ☐ N/A | |
| **Predictive Analytics** | ML-based forecasting | ☐ ENABLE ☐ N/A | |

### Reporting Requirements

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What key Finance reports are needed? | | |
| What key Procurement reports are needed? | | |
| What key Sales reports are needed? | | |
| What key Manufacturing reports are needed? | | |
| What Executive Dashboard requirements exist? | | |
| What third-party BI tools need integration? | | |
| Is data warehouse/data lake integration needed? | ☐ Yes ☐ No | |
| Are real-time reporting requirements needed? | ☐ Yes ☐ No | |

---

## 14. Integration Strategy

### What Is It?

Integration connects S/4HANA with other applications. SAP provides Integration Suite for cloud integrations and standard APIs for connectivity.

**📖 Learn More:** [SAP Integration Suite](https://help.sap.com/docs/integration-suite)

### Integration Approach

| Setting | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **SAP Integration Suite (BTP)** | SAP's cloud integration platform | ☐ Yes ☐ No | |
| **Third-Party Middleware** | MuleSoft, Dell Boomi, etc. | ☐ Yes ☐ No | |
| **Point-to-Point** | Direct integrations | ☐ Yes ☐ No | |
| **Hybrid** | Combination of approaches | ☐ Yes ☐ No | |

### Integration Inventory

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What SAP systems require integration? | | |
| What non-SAP systems require integration? | | |
| What EDI/B2B requirements exist? | | |
| What bank system integrations are needed? | | |
| What e-commerce platform integrations are needed? | | |

### API Strategy

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **OData APIs** | REST-based APIs | ☐ ENABLE ☐ N/A | |
| **SOAP Web Services** | Legacy web services | ☐ ENABLE ☐ N/A | |
| **IDocs** | SAP proprietary EDI | ☐ ENABLE ☐ N/A | |
| **BAPIs/RFCs** | Remote function calls | ☐ ENABLE ☐ N/A | |
| **Events/Webhooks** | Event-driven integration | ☐ ENABLE ☐ N/A | |
| **File-Based Integration** | SFTP, file drops | ☐ ENABLE ☐ N/A | |

---

## 15. Data Migration

### What Is It?

Data migration moves master data, transactional history, and open items from legacy systems into S/4HANA. SAP provides migration tools and templates.

**📖 Learn More:** [SAP S/4HANA Migration Cockpit](https://help.sap.com/docs/SAP_S4HANA_CLOUD/migration-cockpit)

### Migration Strategy

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is the data migration approach? | ☐ Big Bang ☐ Phased | |
| What is the historical data cutoff date? | | |
| What migration tool will be used? | ☐ Migration Cockpit ☐ LSMW ☐ Third-party | |
| What is the data cleansing approach? | | |
| How many migration cycles are planned? | | |

### Data Objects

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Chart of Accounts** | GL account migration | ☐ Full ☐ Partial ☐ N/A | |
| **Cost Centers** | Cost center migration | ☐ Full ☐ Partial ☐ N/A | |
| **Profit Centers** | Profit center migration | ☐ Full ☐ Partial ☐ N/A | |
| **GL Account Balances** | Opening balances | ☐ Full ☐ Partial ☐ N/A | |
| **Open AP Items** | Vendor open items | ☐ Full ☐ Partial ☐ N/A | |
| **Open AR Items** | Customer open items | ☐ Full ☐ Partial ☐ N/A | |
| **Fixed Assets** | Asset master and values | ☐ Full ☐ Partial ☐ N/A | |
| **Business Partners (Vendors)** | Vendor master data | ☐ Full ☐ Partial ☐ N/A | |
| **Business Partners (Customers)** | Customer master data | ☐ Full ☐ Partial ☐ N/A | |
| **Material Master** | Product master data | ☐ Full ☐ Partial ☐ N/A | |
| **BOMs** | Bill of materials | ☐ Full ☐ Partial ☐ N/A | |
| **Routings** | Production routings | ☐ Full ☐ Partial ☐ N/A | |
| **Inventory Balances** | Stock quantities | ☐ Full ☐ Partial ☐ N/A | |
| **Open Purchase Orders** | Open PO migration | ☐ Full ☐ Partial ☐ N/A | |
| **Open Sales Orders** | Open SO migration | ☐ Full ☐ Partial ☐ N/A | |
| **Pricing Conditions** | Pricing master data | ☐ Full ☐ Partial ☐ N/A | |
| **Historical Transactions** | Transaction history | ☐ Full ☐ Partial ☐ N/A | |

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| How many years of historical transactions? | | |

---

## 16. Security & Authorization

### What Is It?

Security in S/4HANA Cloud includes user authentication, role-based access control, and data-level security through authorization objects.

**📖 Learn More:** [SAP S/4HANA Security](https://help.sap.com/docs/SAP_S4HANA_CLOUD/security)

### Identity Management

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **SAP Cloud Identity Services** | SAP IAS for authentication | ☐ ENABLE ☐ N/A | |
| **Corporate IdP Integration** | SSO with Azure AD, Okta, etc. | ☐ ENABLE ☐ N/A | |
| **Multi-Factor Authentication** | MFA requirement | ☐ ENABLE ☐ N/A | |
| **User Provisioning** | Automated user creation | ☐ Manual ☐ Automated | |

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What corporate Identity Provider will be used? | | |

### Role Design

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **SAP Standard Roles** | Pre-delivered business roles | ☐ Use ☐ Customize | |
| **Custom Roles** | Organization-specific roles | ☐ ENABLE ☐ N/A | |
| **Composite Roles** | Bundled roles | ☐ ENABLE ☐ N/A | |
| **Segregation of Duties** | SoD rule definition | ☐ ENABLE ☐ N/A | |

### Data-Level Security

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Company Code Authorization** | Restrict by company code | ☐ ENABLE ☐ N/A | |
| **Plant Authorization** | Restrict by plant | ☐ ENABLE ☐ N/A | |
| **Sales Org Authorization** | Restrict by sales org | ☐ ENABLE ☐ N/A | |
| **Purchasing Org Authorization** | Restrict by purchasing org | ☐ ENABLE ☐ N/A | |
| **Cost Center Authorization** | Restrict by cost center | ☐ ENABLE ☐ N/A | |
| **Profit Center Authorization** | Restrict by profit center | ☐ ENABLE ☐ N/A | |

---

## 17. Extensibility

### What Is It?

Extensibility allows customization of S/4HANA Cloud within supported guardrails. Options include key user extensibility, side-by-side extensions on BTP, and classic ABAP (Private Cloud only).

**📖 Learn More:** [SAP S/4HANA Extensibility](https://help.sap.com/docs/SAP_S4HANA_CLOUD/extensibility)

### Extensibility Approach

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Key User Extensibility** | In-app, no-code extensions | ☐ ENABLE ☐ N/A | |
| **Developer Extensibility (ABAP)** | ABAP in Public Cloud (RAP) | ☐ ENABLE ☐ N/A | |
| **Side-by-Side (BTP)** | Extensions on BTP | ☐ ENABLE ☐ N/A | |
| **Classic ABAP** | Traditional ABAP (Private only) | ☐ ENABLE ☐ N/A | |

### Key User Extensibility

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Custom Fields** | Add fields to standard objects | ☐ ENABLE ☐ N/A | |
| **Custom Logic** | BAdI implementations | ☐ ENABLE ☐ N/A | |
| **Custom Business Objects** | New Fiori apps | ☐ ENABLE ☐ N/A | |
| **Custom CDS Views** | Analytical extensions | ☐ ENABLE ☐ N/A | |
| **Form Template Extensions** | Output form modifications | ☐ ENABLE ☐ N/A | |
| **UI Adaptations** | Fiori UI changes | ☐ ENABLE ☐ N/A | |

### Identified Extensions

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| List any known custom extensions required | | |

---

## 18. Testing Strategy

### What Is It?

Testing validates that S/4HANA meets business requirements. It includes unit testing, integration testing, user acceptance testing, and performance testing.

**📖 Learn More:** [SAP Testing Guidance](https://help.sap.com/docs/SAP_ACTIVATE/testing)

### Testing Phases

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Unit Testing** | Configuration validation | ☐ ENABLE ☐ N/A | |
| **Integration Testing (SIT)** | End-to-end process testing | ☐ ENABLE ☐ N/A | |
| **User Acceptance (UAT)** | Business user validation | ☐ ENABLE ☐ N/A | |
| **Performance Testing** | Load and stress testing | ☐ ENABLE ☐ N/A | |
| **Security Testing** | Role and authorization testing | ☐ ENABLE ☐ N/A | |
| **Regression Testing** | Post-update validation | ☐ ENABLE ☐ N/A | |

### Testing Approach

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What test case management tool will be used? | | |
| Is automated testing planned? | ☐ Yes ☐ No | |
| What is the test data strategy? | ☐ Production Copy ☐ Synthetic | |
| What defect management tool will be used? | | |
| How many UAT testers are expected? | | |

### Key Test Scenarios

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| Critical Procure-to-Pay scenarios? | | |
| Critical Order-to-Cash scenarios? | | |
| Critical Record-to-Report scenarios? | | |
| Critical Plan-to-Produce scenarios? | | |

---

## 19. Cutover Planning

### What Is It?

Cutover is the controlled transition from legacy systems to S/4HANA. It includes final data loads, system configuration, and go-live validation.

**📖 Learn More:** [SAP Activate Cutover](https://help.sap.com/docs/SAP_ACTIVATE/cutover)

### Cutover Approach

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is the cutover approach? | ☐ Big Bang ☐ Phased | |
| What is the cutover window? | | |
| What is the planned go-live date? | | |
| Is a parallel run period needed? | ☐ Yes ☐ No | |
| What is the legacy system sunset plan? | | |

### Go/No-Go Criteria

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Data Migration Success Rate** | Minimum % required | | |
| **Critical Defects Resolved** | All P1/P2 resolved | ☐ Yes ☐ No | |
| **User Training Completion** | Minimum % required | | |
| **Integration Testing Passed** | All integrations working | ☐ Yes ☐ No | |
| **Performance Benchmarks Met** | Response times acceptable | ☐ Yes ☐ No | |

---

## 20. Training & Change Management

### What Is It?

Training prepares users for the new system. Change management addresses the people-side of the transformation to drive adoption.

**📖 Learn More:** [SAP Enable Now](https://help.sap.com/docs/SAP_ENABLE_NOW)

### Training Strategy

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| Training delivery method? | ☐ Instructor-Led ☐ Self-Paced ☐ Hybrid | |
| Training environment? | ☐ Sandbox ☐ Training Client | |
| Training documentation approach? | ☐ SAP Enable Now ☐ Custom ☐ Both | |
| Train-the-trainer approach? | ☐ Yes ☐ No | |

### Change Management

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **Stakeholder Analysis** | Identify and assess stakeholders | ☐ ENABLE ☐ N/A | |
| **Change Impact Assessment** | Assess change impacts by role | ☐ ENABLE ☐ N/A | |
| **Communication Plan** | Regular project communications | ☐ ENABLE ☐ N/A | |
| **Change Champion Network** | Departmental change advocates | ☐ ENABLE ☐ N/A | |
| **Resistance Management** | Address change resistance | ☐ ENABLE ☐ N/A | |
| **Adoption Metrics** | Track user adoption | ☐ ENABLE ☐ N/A | |

---

## 21. Go-Live & Hypercare

### What Is It?

Go-live is when the system becomes operational. Hypercare is the intensive support period immediately following go-live.

**📖 Learn More:** [SAP Activate Run Phase](https://help.sap.com/docs/SAP_ACTIVATE/run)

### Go-Live Readiness

| Feature | Description | Your Decision | Notes |
| ------- | ----------- | ------------- | ----- |
| **All Critical Issues Resolved** | P1/P2 defects closed | ☐ Yes ☐ No | |
| **Data Migration Complete** | All data loaded and validated | ☐ Yes ☐ No | |
| **Integrations Tested and Ready** | All interfaces working | ☐ Yes ☐ No | |
| **User Training Complete** | All users trained | ☐ Yes ☐ No | |
| **Security Roles Assigned** | All users provisioned | ☐ Yes ☐ No | |
| **Support Team Ready** | Help desk prepared | ☐ Yes ☐ No | |
| **Rollback Plan Documented** | Recovery plan ready | ☐ Yes ☐ No | |

### Hypercare Planning

| Question | Your Answer | Notes |
| -------- | ----------- | ----- |
| What is the hypercare duration? | | |
| Is on-site support required? | ☐ Yes ☐ No | |
| What are the support hours during hypercare? | | |
| Is the escalation path defined? | ☐ Yes ☐ No | |
| What issue tracking tool will be used? | | |

---

## 22. Sign-Off & Approval

### Section Completion

All sections of this questionnaire have been reviewed and completed.

### Approval Signatures

**Business Owner / Project Sponsor**

**IT / Technical Lead**

**Finance Lead**

**Implementation Partner (Cloudstrucc Inc.)**

---

## Appendix: SAP Documentation Links

| Topic | URL |
| ----- | --- |
| SAP S/4HANA Cloud Help | https://help.sap.com/docs/SAP_S4HANA_CLOUD |
| SAP Best Practices Explorer | https://rapid.sap.com/bp/ |
| SAP Fiori Apps Library | https://fioriappslibrary.hana.ondemand.com/ |
| SAP API Business Hub | https://api.sap.com/ |
| SAP Learning Hub | https://learning.sap.com/ |

---

## Glossary

| Term | Definition |
| ---- | ---------- |
| **ABAP** | SAP's proprietary programming language |
| **BTP** | Business Technology Platform |
| **BOM** | Bill of Materials |
| **Fiori** | SAP's modern UX design system |
| **HANA** | SAP's in-memory database |
| **MRP** | Material Requirements Planning |
| **RISE with SAP** | SAP's cloud transformation offering |
| **WBS** | Work Breakdown Structure |

---

*Document prepared by Cloudstrucc Inc.*