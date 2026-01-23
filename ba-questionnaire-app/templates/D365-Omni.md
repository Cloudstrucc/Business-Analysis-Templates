# Dynamics 365 Omnichannel for Customer Service Implementation Checklist

**Client Name:** _______________________________________________  
**Implementation Partner:** Cloudstrucc Inc.  
**Project Start Date:** _______________________________________________  
**Target Go-Live Date:** _______________________________________________  
**Prepared By:** _______________________________________________  
**Version:** 1.0  
**Last Updated:** _______________________________________________

---

## How to Use This Document

This checklist helps plan and implement Dynamics 365 Omnichannel for Customer Service — Microsoft's contact center solution for multi-channel customer engagement.

| Response | Meaning |
|----------|---------|
| **OOB** | Out of Box — Keep default configuration |
| **N/A** | Not Applicable |
| **CUSTOMIZE** | Changes needed (provide details) |
| **ENABLE** | Turn this feature on |
| **DISABLE** | Turn this feature off |

---

## Table of Contents

1. [Omnichannel Overview](#1-omnichannel-overview)
2. [Contact Center Requirements](#2-contact-center-requirements)
3. [Communication Channels](#3-communication-channels)
4. [Voice Channel (Phone)](#4-voice-channel-phone)
5. [Chat Channel](#5-chat-channel)
6. [Messaging Channels](#6-messaging-channels)
7. [Email Channel](#7-email-channel)
8. [Unified Routing](#8-unified-routing)
9. [Queues & Capacity](#9-queues--capacity)
10. [Skills-Based Routing](#10-skills-based-routing)
11. [Agent Workspace](#11-agent-workspace)
12. [Productivity Tools](#12-productivity-tools)
13. [Copilot & AI Features](#13-copilot--ai-features)
14. [Supervisor Experience](#14-supervisor-experience)
15. [SLAs & Sentiment](#15-slas--sentiment)
16. [Recording & Transcription](#16-recording--transcription)
17. [Analytics & Reporting](#17-analytics--reporting)
18. [Security & Compliance](#18-security--compliance)
19. [Testing & Go-Live](#19-testing--go-live)
20. [Sign-Off & Approval](#20-sign-off--approval)

---

## 1. Omnichannel Overview

### What Is It?
Dynamics 365 Omnichannel enables organizations to serve customers across voice, chat, SMS, social, and email through a unified agent experience.

**📖 Learn More:** [Omnichannel Overview](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/introduction-omnichannel)

### Capabilities In Scope

| Capability | In Scope? | Notes |
|------------|-----------|-------|
| **Voice (Phone)** | ☐ Yes ☐ No | |
| **Live Chat** | ☐ Yes ☐ No | |
| **SMS/Text** | ☐ Yes ☐ No | |
| **Social Messaging** | ☐ Yes ☐ No | |
| **Email** | ☐ Yes ☐ No | |
| **Unified Routing** | ☐ Yes ☐ No | |
| **AI/Copilot** | ☐ Yes ☐ No | |

---

## 2. Contact Center Requirements

### Current State

| Question | Your Answer |
|----------|-------------|
| Current platform? | |
| Total agents? | |
| Daily interactions? | |
| Peak volume? | |
| Current AHT? | |

### Business Hours

| Question | Your Answer |
|----------|-------------|
| Business hours? | |
| Time zones? | |
| 24/7 operations? | ☐ Yes ☐ No |
| After-hours coverage? | ☐ Yes ☐ No |

---

## 3. Communication Channels

### Channel Priority

| Channel | Enable? | Phase | Notes |
|---------|---------|-------|-------|
| **Voice** | ☐ Yes ☐ No | ☐ 1 ☐ 2 | |
| **Chat** | ☐ Yes ☐ No | ☐ 1 ☐ 2 | |
| **SMS** | ☐ Yes ☐ No | ☐ 1 ☐ 2 | |
| **WhatsApp** | ☐ Yes ☐ No | ☐ 1 ☐ 2 | |
| **Facebook** | ☐ Yes ☐ No | ☐ 1 ☐ 2 | |
| **Email** | ☐ Yes ☐ No | ☐ 1 ☐ 2 | |

---

## 4. Voice Channel (Phone)

### What Is It?
Handle inbound/outbound calls directly in Dynamics 365 with recording, transcription, and screen pop.

**📖 Learn More:** [Voice Channel](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/voice-channel)

### Voice Configuration

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Native D365 Voice** | ☐ Yes ☐ No | |
| **Third-Party Telephony** | ☐ Yes ☐ No | Provider: |
| **Inbound Calls** | ☐ Yes ☐ No | |
| **Outbound Calls** | ☐ Yes ☐ No | |

### Phone Numbers

| Type | Quantity | Region | Notes |
|------|----------|--------|-------|
| **Toll-Free** | | | |
| **Local** | | | |
| **Port Existing** | | | |

### IVR/Auto-Attendant

| Feature | Enable? | Notes |
|---------|---------|-------|
| **IVR Menus** | ☐ Yes ☐ No | |
| **Voice Self-Service** | ☐ Yes ☐ No | Copilot |
| **Hours of Operation** | ☐ Yes ☐ No | |
| **Holiday Messages** | ☐ Yes ☐ No | |

### IVR Menu

| Option | Action | Route To |
|--------|--------|----------|
| **Greeting** | Play message | Menu |
| **1** | | |
| **2** | | |
| **3** | | |

### Call Features

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Screen Pop** | ☐ Yes ☐ No | |
| **Call Transfer** | ☐ Yes ☐ No | |
| **Conference** | ☐ Yes ☐ No | |
| **Warm Transfer** | ☐ Yes ☐ No | |
| **Callback Request** | ☐ Yes ☐ No | |
| **Voicemail** | ☐ Yes ☐ No | |
| **Recording** | ☐ Yes ☐ No | |
| **Transcription** | ☐ Yes ☐ No | |

---

## 5. Chat Channel

### What Is It?
Real-time text support through your website.

**📖 Learn More:** [Chat Widget](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/add-chat-widget)

### Chat Configuration

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Live Chat** | ☐ Yes ☐ No | |
| **Pre-Chat Survey** | ☐ Yes ☐ No | |
| **Post-Chat Survey** | ☐ Yes ☐ No | |
| **Proactive Chat** | ☐ Yes ☐ No | |
| **File Attachments** | ☐ Yes ☐ No | |
| **Co-Browse** | ☐ Yes ☐ No | |
| **Transcripts** | ☐ Yes ☐ No | |

### Widget Customization

| Element | Value |
|---------|-------|
| **Title** | |
| **Color** | |
| **Logo** | |
| **Position** | ☐ Right ☐ Left |

### Pre-Chat Questions

| Field | Required? |
|-------|-----------|
| **Name** | ☐ Yes ☐ No |
| **Email** | ☐ Yes ☐ No |
| **Issue Type** | ☐ Yes ☐ No |

---

## 6. Messaging Channels

### What Is It?
Asynchronous channels like SMS, WhatsApp, Facebook for customer convenience.

**📖 Learn More:** [Messaging Channels](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-sms-channel)

### SMS

| Feature | Enable? | Notes |
|---------|---------|-------|
| **SMS Channel** | ☐ Yes ☐ No | |
| **Provider** | ☐ Azure ☐ Twilio ☐ TeleSign | |
| **Two-Way SMS** | ☐ Yes ☐ No | |

### Social Channels

| Channel | Enable? | Account |
|---------|---------|---------|
| **WhatsApp** | ☐ Yes ☐ No | |
| **Facebook** | ☐ Yes ☐ No | |
| **Apple Messages** | ☐ Yes ☐ No | |
| **Instagram** | ☐ Yes ☐ No | |

---

## 7. Email Channel

### What Is It?
Route emails to queues for agent handling.

**📖 Learn More:** [Email Channel](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-email)

### Email Configuration

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Email Routing** | ☐ Yes ☐ No | |
| **Shared Mailbox** | | Address: |
| **Auto-Create Cases** | ☐ Yes ☐ No | |
| **Templates** | ☐ Yes ☐ No | |

---

## 8. Unified Routing

### What Is It?
Intelligent work distribution to the best available agent.

**📖 Learn More:** [Unified Routing](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/overview-unified-routing)

### Routing Configuration

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Push Mode** | ☐ Yes ☐ No | Auto-assign |
| **Pick Mode** | ☐ Yes ☐ No | Agent selects |
| **Skills Routing** | ☐ Yes ☐ No | |
| **Priority Routing** | ☐ Yes ☐ No | |
| **Sentiment Routing** | ☐ Yes ☐ No | |
| **Capacity-Based** | ☐ Yes ☐ No | |

### Routing Rules

| Rule | Condition | Route To | Priority |
|------|-----------|----------|----------|
| | | | |
| | | | |

### Overflow

| Scenario | Action |
|----------|--------|
| **No Agents** | ☐ Queue ☐ Callback ☐ Voicemail |
| **After Hours** | ☐ Message ☐ Voicemail |

---

## 9. Queues & Capacity

### What Is It?
Queues hold work items; capacity determines concurrent conversations per agent.

**📖 Learn More:** [Queues](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel)

### Queues

| Queue Name | Channels | Purpose | Team |
|------------|----------|---------|------|
| | | | |
| | | | |
| | | | |

### Agent Capacity

| Channel | Capacity | Concurrent |
|---------|----------|------------|
| **Voice** | | 1 |
| **Chat** | | 2-4 |
| **Messaging** | | |
| **Email** | | |

---

## 10. Skills-Based Routing

### What Is It?
Match conversations to agents with the right skills.

**📖 Learn More:** [Skills Routing](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/overview-skill-work-distribution)

### Skills

| Skill | Type | Values |
|-------|------|--------|
| **Language** | Proficiency | English, French... |
| **Product** | Proficiency | |
| | | |

---

## 11. Agent Workspace

### What Is It?
Unified desktop for handling all conversations.

**📖 Learn More:** [Workspace](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/csw-overview)

### Workspace Features

| Feature | Enable? |
|---------|---------|
| **Multi-Session** | ☐ Yes ☐ No |
| **Customer Summary** | ☐ Yes ☐ No |
| **Timeline** | ☐ Yes ☐ No |
| **Knowledge Search** | ☐ Yes ☐ No |
| **Productivity Pane** | ☐ Yes ☐ No |

---

## 12. Productivity Tools

### What Is It?
Quick responses, scripts, and macros for efficiency.

**📖 Learn More:** [Productivity Tools](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/productivity-pane)

### Quick Responses

| Name | Text | Channel |
|------|------|---------|
| **Greeting** | | All |
| **Hold** | | |
| **Closing** | | |

### Smart Assist

| Feature | Enable? |
|---------|---------|
| **Similar Cases** | ☐ Yes ☐ No |
| **KB Suggestions** | ☐ Yes ☐ No |

---

## 13. Copilot & AI Features

### What Is It?
AI assistance for agents and self-service.

**📖 Learn More:** [Copilot](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features)

### Copilot Features

| Feature | Enable? |
|---------|---------|
| **Copilot** | ☐ Yes ☐ No |
| **Conversation Summary** | ☐ Yes ☐ No |
| **Draft Response** | ☐ Yes ☐ No |
| **Ask Questions** | ☐ Yes ☐ No |
| **Voice Bot (IVR)** | ☐ Yes ☐ No |
| **Chat Bot** | ☐ Yes ☐ No |

---

## 14. Supervisor Experience

### What Is It?
Real-time monitoring and intervention tools.

**📖 Learn More:** [Supervisor Experience](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/omnichannel-supervisor-experience)

### Supervisor Features

| Feature | Enable? |
|---------|---------|
| **Live Dashboard** | ☐ Yes ☐ No |
| **Agent Monitoring** | ☐ Yes ☐ No |
| **Queue Monitoring** | ☐ Yes ☐ No |
| **Monitor Calls** | ☐ Yes ☐ No |
| **Whisper** | ☐ Yes ☐ No |
| **Barge-In** | ☐ Yes ☐ No |

---

## 15. SLAs & Sentiment

### SLA Configuration

| SLA | Channel | First Response | Resolution |
|-----|---------|----------------|------------|
| | Voice | min | |
| | Chat | min | |
| | Email | hours | hours |

### Sentiment Analysis

| Feature | Enable? |
|---------|---------|
| **Real-Time Sentiment** | ☐ Yes ☐ No |
| **Negative Alerts** | ☐ Yes ☐ No |
| **Route by Sentiment** | ☐ Yes ☐ No |

**📖 Learn More:** [Sentiment](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-sentiment-analysis)

---

## 16. Recording & Transcription

### What Is It?
Record calls and generate transcripts.

**📖 Learn More:** [Recording](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/voice-channel-call-recording)

### Recording Configuration

| Feature | Enable? | Notes |
|---------|---------|-------|
| **Call Recording** | ☐ Yes ☐ No | |
| **Recording Notice** | ☐ Yes ☐ No | |
| **Pause/Resume** | ☐ Yes ☐ No | For PCI |
| **Transcription** | ☐ Yes ☐ No | |
| **Retention** | | Days: |

### Compliance

| Requirement | Address? |
|-------------|----------|
| **Customer Consent** | ☐ Yes ☐ N/A |
| **PCI Compliance** | ☐ Yes ☐ N/A |
| **Data Residency** | ☐ Yes ☐ N/A |

---

## 17. Analytics & Reporting

### What Is It?
Measure contact center performance.

**📖 Learn More:** [Analytics](https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/oc-historical-analytics-reports)

### Reports

| Report | Enable? |
|--------|---------|
| **Conversation Analytics** | ☐ Yes ☐ No |
| **Queue Analytics** | ☐ Yes ☐ No |
| **Agent Performance** | ☐ Yes ☐ No |
| **CSAT Reports** | ☐ Yes ☐ No |

### Key Metrics

| Metric | Target |
|--------|--------|
| **AHT** | |
| **FCR** | |
| **CSAT** | |
| **Wait Time** | |
| **Abandonment** | |

---

## 18. Security & Compliance

### Security Roles

| Role | Users | Permissions |
|------|-------|-------------|
| **Agent** | | Handle conversations |
| **Supervisor** | | Monitor + agent |
| **Admin** | | Configure |

### Compliance

| Requirement | Applicable? |
|-------------|-------------|
| **PCI DSS** | ☐ Yes ☐ No |
| **HIPAA** | ☐ Yes ☐ No |
| **GDPR** | ☐ Yes ☐ No |
| **PIPEDA** | ☐ Yes ☐ No |

---

## 19. Testing & Go-Live

### Testing Checklist

| Test | Status |
|------|--------|
| **Inbound Voice** | ☐ |
| **Outbound Voice** | ☐ |
| **IVR** | ☐ |
| **Chat** | ☐ |
| **Routing** | ☐ |
| **Recording** | ☐ |
| **Supervisor Tools** | ☐ |
| **Load Test** | ☐ |

### Go-Live Checklist

| Task | Status |
|------|--------|
| **Numbers Ready** | ☐ |
| **Agents Trained** | ☐ |
| **Queues Configured** | ☐ |
| **Routing Active** | ☐ |
| **Monitoring Enabled** | ☐ |

---

## 20. Sign-Off & Approval

### Approval Signatures

**Business Owner:**

Name: _______________________________________________ Date: _______________

**IT Lead:**

Name: _______________________________________________ Date: _______________

**Contact Center Manager:**

Name: _______________________________________________ Date: _______________

**Implementation Partner (Cloudstrucc Inc.):**

Name: _______________________________________________ Date: _______________

---

## Appendix: Documentation Links

| Topic | URL |
|-------|-----|
| Omnichannel Overview | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/introduction-omnichannel |
| Voice Channel | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/voice-channel |
| Chat Widget | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/add-chat-widget |
| Unified Routing | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/overview-unified-routing |
| Skills Routing | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/overview-skill-work-distribution |
| Queues | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/queues-omnichannel |
| Workspace | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/csw-overview |
| Copilot | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-copilot-features |
| Supervisor | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/omnichannel-supervisor-experience |
| Sentiment | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/configure-sentiment-analysis |
| Recording | https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/voice-channel-call-recording |
| Analytics | https://learn.microsoft.com/en-us/dynamics365/customer-service/implement/oc-historical-analytics-reports |

---

## Glossary

| Term | Definition |
|------|------------|
| **AHT** | Average Handle Time |
| **Barge-In** | Supervisor joins call |
| **FCR** | First Contact Resolution |
| **IVR** | Interactive Voice Response |
| **Push Routing** | Auto-assign to agents |
| **Screen Pop** | Auto-show customer info |
| **Sentiment** | Customer emotional state |
| **Whisper** | Private message to agent |

---

*Document prepared by Cloudstrucc Inc.*