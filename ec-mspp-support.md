# Elections Canada – Power Platform & Nintex e-Signature Broker Service

## Azure Dependencies & IT Ops Implementation / Maintenance Guide

<table>
<thead>
<tr>
<th>Product</th>
<th>Accountable Team(s)</th>
<th>Description</th>
<th>General Implementation / Maintenance (IT Ops Tasks &amp; Azure Roles)</th>
</tr>
</thead>
<tbody>

<tr>
<td><strong>Microsoft Purview</strong></td>
<td>IT Ops, SecOps, Platform Engineering</td>
<td>Establish and monitor events, DLP, consumption, usage, licensing, etc.</td>
<td>
<ul>
<li>Configure DLP policies to protect sensitive election data (PII, voter records) across Dataverse, SharePoint, and Exchange</li>
<li>Monitor audit logs for unauthorized access or data exfiltration attempts</li>
<li>Review and tune sensitivity labels for Protected B classification on election documents</li>
<li>Schedule quarterly access reviews of Purview compliance portal permissions</li>
<li>Generate monthly compliance reports on DLP policy matches and incidents</li>
<li>Configure runbooks to automate compliance verfiication for the agency baseline configurations</li>
</ul>
<strong>Azure Roles:</strong> Compliance Administrator, Security Reader, Information Protection Administrator
</td>
</tr>

<tr>
<td><strong>CoE Kit (Power Apps)</strong></td>
<td>Platform Engineering</td>
<td>Establish and govern PP Dataverse(s), makers, consumption, etc.</td>
<td>
<ul>
<li>Deploy and maintain the CoE Starter Kit across EC Power Platform environments (Dev/Test/Prod)</li>
<li>Monitor maker activity, app usage telemetry, and orphaned resources</li>
<li>Enforce environment creation policies and DLP connector restrictions</li>
<li>Run weekly inventory sync to track all apps, flows, and custom connectors</li>
<li>Manage Dataverse capacity and storage allocation across environments</li>
</ul>
<strong>Azure Roles:</strong> Power Platform Administrator, Dynamics 365 Administrator, Application Administrator
</td>
</tr>

<tr>
<td><strong>Azure Monitor</strong></td>
<td>IT Ops</td>
<td>Add-on required to extend Entra external ID monitoring</td>
<td>
<ul>
<li>Configure diagnostic settings to stream Entra ID sign-in and audit logs to Log Analytics workspace</li>
<li>Set up alerts for failed authentication attempts on Nintex service accounts and Power Platform connectors</li>
<li>Build workbooks for monitoring B2B/external guest access patterns</li>
<li>Establish baseline metrics and anomaly detection rules for service health</li>
<li>Review and rotate alert action group recipients quarterly</li>
</ul>
<strong>Azure Roles:</strong> Monitoring Contributor, Log Analytics Contributor
</td>
</tr>

<tr>
<td><strong>Entra &amp; External ID</strong></td>
<td>IT Ops, ITSD</td>
<td>Power Platform requires Entra groups to help secure the platform, app registrations for service principals &amp; service accounts to run the COE-KIT &amp; our Entra External ID tenants to onboard web applications for external access</td>
<td>
<ul>
<li>Manage Entra security groups for Power Platform environment access (Makers, Admins, Users)</li>
<li>Maintain app registrations and service principals for CoE Kit, Nintex AssureSign broker, and ALM pipelines</li>
<li>Rotate client secrets/certificates on a scheduled cadence (90-day minimum)</li>
<li>Configure Conditional Access policies for Power Platform and Nintex service endpoints</li>
<li>Perform quarterly access reviews on privileged roles and group memberships</li>
</ul>
<strong>Azure Roles:</strong> Application Administrator, Groups Administrator, Conditional Access Administrator
</td>
</tr>

<tr>
<td><strong>Entra External ID (Power Pages SSO)</strong></td>
<td>IT Ops, ITSD, Platform Engineering</td>
<td>Entra External ID provides identity management for external-facing Power Pages portals, enabling citizens, returning officers, and third-party stakeholders to authenticate via SSO without requiring internal Entra accounts. Supports social and federated identity providers for public-facing election services.</td>
<td>
<ul>
<li>Provision and configure the Entra External ID tenant (CIAM) linked to Power Pages site authentication settings</li>
<li>Configure user flows for self-service sign-up, sign-in, and password reset with EC branding and bilingual (EN/FR) support</li>
<li>Integrate federated identity providers (GCKey, federal SAML/OIDC providers, or social IDPs) as required for citizen-facing portals</li>
<li>Register the Power Pages site as an application in the External ID tenant and configure redirect URIs, token claims, and session policies</li>
<li>Implement MFA policies and risk-based Conditional Access for external users accessing sensitive election workflows (e.g., Nintex e-signature ceremonies)</li>
<li>Monitor external user sign-in logs and configure alerts for anomalous authentication patterns (credential stuffing, geo-impossible travel)</li>
<li>Manage external user lifecycle — automate account deactivation for inactive accounts and enforce data retention policies aligned with GC standards</li>
</ul>
<strong>Azure Roles:</strong> External Identity Provider Administrator, Application Administrator, Conditional Access Administrator, Authentication Policy Administrator
</td>
</tr>

<tr>
<td><strong>Azure DevOps</strong></td>
<td>Platform Engineering</td>
<td>Required of the OOB integration between the platform and Azure DevOps to provide a more secure, seamless deployment process with the appropriate GIT branching and pipeline features integrated</td>
<td>
<ul>
<li>Maintain CI/CD pipelines for Power Platform solution deployment (Dev → Test → Prod)</li>
<li>Manage service connections between Azure DevOps and Power Platform environments</li>
<li>Enforce branch policies (PR reviews, build validation) on release branches</li>
<li>Monitor pipeline agent health and update agent pools as needed</li>
<li>Manage pipeline variable groups and link to Key Vault for secret retrieval</li>
<li>Configure environment approvals and gates for production release pipelines</li>
</ul>
<strong>Azure Roles:</strong> DevOps Administrator, Project Collection Administrator (Azure DevOps), Contributor (on linked Azure subscription)
</td>
</tr>

<tr>
<td><strong>Sentinel</strong></td>
<td>IT Ops, SecOps</td>
<td>Required to monitor the entire stack more granularly using D365 plugins and Dataverse Plugins to be installed in Sentinel</td>
<td>
<ul>
<li>Deploy and configure the Dynamics 365 and Dataverse data connectors in Sentinel</li>
<li>Create analytics rules for suspicious Dataverse CRUD operations and bulk data exports</li>
<li>Build incident response playbooks (Logic Apps) for automated triage of Power Platform alerts</li>
<li>Tune detection rules quarterly to reduce false positives</li>
<li>Maintain threat hunting queries for Nintex webhook and API activity anomalies</li>
</ul>
<strong>Azure Roles:</strong> Microsoft Sentinel Contributor, Logic App Contributor, Security Administrator
</td>
</tr>

<tr>
<td><strong>Azure Subscriptions</strong></td>
<td>Platform Engineering</td>
<td>Azure subscription ties all of the resources required by the platform from storage accounts, KeyVaults, VNET integration Azure Monitor and other.</td>
<td>
<ul>
<li>Manage resource groups and enforce tagging policies (CostCenter, Environment, Owner)</li>
<li>Configure Azure Policy assignments for EC governance (allowed regions, SKU restrictions)</li>
<li>Monitor subscription spend and set budget alerts for Power Platform-related resources</li>
<li>Perform monthly RBAC audits to ensure least-privilege access across resource groups</li>
<li>Manage subscription-level locks on production resources to prevent accidental deletion</li>
</ul>
<strong>Azure Roles:</strong> Owner or User Access Administrator (subscription scope), Cost Management Contributor
</td>
</tr>

<tr>
<td><strong>Azure Storage</strong></td>
<td>Platform Engineering</td>
<td>Required for verbose detailed logs for Power Pages sites and also used as integration for attachments for PEPP (and maybe in future other apps), this is also used as a store for a static site for markdown documentation.</td>
<td>
<ul>
<li>Configure blob lifecycle management policies for log retention (align with GC retention schedules)</li>
<li>Enable soft delete and versioning on containers holding Nintex e-signature documents and attachments</li>
<li>Set up private endpoint or service endpoint access restrictions for storage accounts</li>
<li>Monitor storage capacity, throttling, and failed access attempts via Azure Monitor</li>
<li>Manage CORS rules for Power Pages integration and static site hosting</li>
</ul>
<strong>Azure Roles:</strong> Storage Account Contributor, Storage Blob Data Contributor
</td>
</tr>

<tr>
<td><strong>KeyVault &amp; CMK (future)</strong></td>
<td>SecOps</td>
<td>Required to enhance the agencies security posture by allowing us to control our encryption keys rather than relying solely on MMS (Microsoft managed keys) for data at rest. This feature also includes integration of app registration secrets in DevOps for avoiding secret sprawling.</td>
<td>
<ul>
<li>Provision Key Vault with HSM-backed keys for Dataverse CMK encryption</li>
<li>Configure access policies or RBAC for Power Platform service principals and DevOps pipelines</li>
<li>Implement key rotation schedule (annual minimum) with automated rotation where supported</li>
<li>Migrate app registration secrets from DevOps variable groups into Key Vault secret references</li>
<li>Enable Key Vault diagnostic logging and alert on unauthorized access or key operations</li>
</ul>
<strong>Azure Roles:</strong> Key Vault Administrator, Key Vault Crypto Officer, Key Vault Secrets Officer
</td>
</tr>

<tr>
<td><strong>Power Platform VNET / Private Endpoint Integration (future)</strong></td>
<td>IT Ops / SecOps</td>
<td>Allows EC to control all networking to and from the Power Platform using their own VNET/Subnet and Private endpoint link (future) rather than solely relying on SAAS infrastructure from MS.</td>
<td>
<ul>
<li>Design and provision VNETs and subnets for Power Platform data gateway and outbound connectivity</li>
<li>Configure Private Endpoints for Dataverse, Azure Storage, and Key Vault to eliminate public internet exposure</li>
<li>Establish NSG rules and route tables to enforce traffic flow through EC network appliances</li>
<li>Coordinate with EC network operations for DNS private zone configuration and on-prem resolution</li>
<li>Monitor VNET flow logs and NSG diagnostics for anomalous traffic patterns</li>
</ul>
<strong>Azure Roles:</strong> Network Contributor, Private DNS Zone Contributor, Virtual Machine Contributor (for data gateway VMs)
</td>
</tr>

</tbody>
</table>