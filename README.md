````markdown
# ReachInbox Onebox — README

> **Project:** ReachInbox Onebox — Feature-Rich Email Aggregator

---

## 🧩 Table of Contents
- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Components Overview](#components-overview)
- [Data Flow Diagram](#data-flow-diagram)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [AI Integration (Categorization & RAG)](#ai-integration-categorization--rag)
- [Slack & Webhook Integration](#slack--webhook-integration)
- [Security & Best Practices](#security--best-practices)
- [Feature Checklist](#feature-checklist)
- [References](#references)

---

## 📘 Project Overview
**ReachInbox Onebox** is an **AI-driven cold outreach platform** that unifies email communication across multiple accounts. It helps businesses find, categorize, and manage high-intent leads effortlessly through real-time email sync, search, and automation.

### 🧠 Core Objectives
- Sync multiple IMAP email accounts **in real-time** (using IMAP IDLE).
- Store & index emails for **fast searching** with Elasticsearch.
- Use **AI to categorize** emails (Interested, Meeting Booked, Not Interested, etc.).
- Send **Slack notifications & webhook triggers** for specific actions.
- (Advanced) Use **RAG-based LLM** to suggest replies automatically.

---

## 🏗️ System Architecture
Below is the high-level architecture of the project:

```text
+--------------------------------------------------------------+
|                        Frontend (React/Next.js)              |
|--------------------------------------------------------------|
|  - Email Viewer                                              |
|  - Search & Filters                                          |
|  - AI Suggested Replies                                      |
+------------------------^-------------------------------------+
                         |
                         | REST API Calls (HTTPS)
                         v
+--------------------------------------------------------------+
|            Backend (Node.js + Express + TypeScript)          |
|--------------------------------------------------------------|
|  - Real-time IMAP Sync (IDLE mode)                           |
|  - AI Categorization                                         |
|  - Slack & Webhook Integration                               |
|  - Elasticsearch Indexing & Search                           |
+--------------------------------------------------------------+
  |             |                   |                    |
  v             v                   v                    v
IMAP         Elasticsearch        AI Engine          Slack/Webhook
(Gmail,      (Docker)             (Categorizer &     Notifications
Outlook)                          RAG Reply)
````

---

## 🧩 Components Overview

### 📨 IMAP Sync Service

* Uses **IMAP IDLE** for real-time email fetch (no cron jobs).
* Fetches last **30 days of emails** on initial load.
* Normalizes raw email data and passes it to backend.

### 🔍 Elasticsearch Service

* Stores indexed emails with metadata.
* Supports searching by folder, account, keyword, or category.
* Hosted locally via **Docker container**.

### 🤖 AI Categorizer

* Labels emails into categories: Interested, Meeting Booked, Not Interested, Spam, Out of Office.
* Optional: integrates with **LLM** for reply suggestions using **RAG (Retrieval-Augmented Generation)**.

### 🔔 Slack & Webhook Integrations

* Slack notification sent on every new “Interested” email.
* Webhook triggered to external system (e.g., webhook.site).

### 🖥️ Frontend

* Displays categorized emails, search bar, filters, and AI suggestions.

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js (v18+)
* Docker Desktop (for Elasticsearch)
* Postman (for API testing)

### Installation Steps

```bash
# Clone repository
git clone https://github.com/your-username/reachinbox-onebox.git
cd reachinbox-onebox/backend

# Install dependencies
npm install

# Run Elasticsearch via Docker
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.15.0

# Start development server
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` file:

```bash
PORT=3000
ES_HOST=http://localhost:9200
IMAP_ACCOUNTS_JSON=[{"id":"acct1","host":"imap.gmail.com","port":993,"secure":true,"user":"abc@gmail.com","pass":"password"},{"id":"acct2","host":"outlook.office365.com","port":993,"secure":true,"user":"xyz@outlook.com","pass":"password"}]
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
WEBHOOK_SITE_URL=https://webhook.site/xxxxxxx
AI_API_KEY=your_ai_key_here
VECTOR_DB_URL=optional_vector_db_url
```

---

## 🧠 AI Integration (Categorization & RAG)

### Categorization Flow

1. Email content is sent to the AI service.
2. AI assigns one of the following categories:

   * Interested
   * Meeting Booked
   * Not Interested
   * Spam
   * Out of Office

### RAG (Retrieval-Augmented Generation)

1. Email text embedded into vector DB.
2. Search context (product info, tone guidelines).
3. Use LLM to generate contextual reply suggestions.

Example:

> Email: *“Hi, your resume has been shortlisted. When can we have a call?”*
> Suggested Reply: *“Thanks for shortlisting me! You can book a slot here: [https://cal.com/example](https://cal.com/example)”*

---

## 🧾 API Endpoints

| Method | Endpoint                      | Description                            |
| ------ | ----------------------------- | -------------------------------------- |
| GET    | `/emails`                     | List synced emails                     |
| GET    | `/emails/:id`                 | Get single email details               |
| GET    | `/search?q=keyword`           | Search emails from Elasticsearch       |
| POST   | `/emails/:id/label`           | Assign label manually                  |
| POST   | `/emails/:id/mark-interested` | Marks email and triggers Slack/Webhook |

---

## 🧰 Slack & Webhook Integration

* **Slack**: Sends real-time notifications using an Incoming Webhook URL.
* **Webhook**: Triggers a POST request with email data for automation.

Example payload:

```json
{
  "event": "Interested",
  "email": "john@example.com",
  "subject": "Let's book a meeting",
  "timestamp": "2025-11-12T10:00:00Z"
}
```

---

## 🔒 Security & Best Practices

* Use **encrypted storage** for IMAP credentials.
* Never log raw email content.
* Implement **JWT-based API authentication**.
* Sanitize email HTML before rendering in frontend.
* Enforce rate-limiting on public endpoints.

---

## ✅ Feature Checklist

| Feature | Description                | Status |
| ------- | -------------------------- | ------ |
| 1       | Real-time IMAP sync        | ✅      |
| 2       | Elasticsearch integration  | ✅      |
| 3       | AI categorization          | ✅      |
| 4       | Slack & webhook automation | ✅      |
| 5       | Frontend integration       | 🔄     |
| 6       | RAG reply suggestions      | 🔄     |

---

## 🔗 References

* **IMAP Libraries:** [imapflow](https://github.com/andris9/imapflow)
* **Elasticsearch:** [Official Docs](https://www.elastic.co/guide/)
* **Slack Webhooks:** [API Reference](https://api.slack.com/messaging/webhooks)
* **RAG Architecture:** [LangChain Guide](https://python.langchain.com/)

---

<!-- # 🧱 Excalidraw Architecture JSON

```json
{
  "type": "excalidraw",
  "version": 2,
  "elements": [
    {"type": "rectangle", "x": 100, "y": 100, "width": 300, "height": 200, "backgroundColor": "#000000", "strokeColor": "#ffffff", "text": "Frontend (React/Next.js)\n- Email Viewer\n- Search\n- Suggested Replies"},
    {"type": "rectangle", "x": 500, "y": 100, "width": 300, "height": 250, "backgroundColor": "#000000", "strokeColor": "#ffffff", "text": "Backend (Node.js + Express)\n- IMAP Sync\n- AI Categorization\n- Elasticsearch Indexing\n- Slack/Webhook"},
    {"type": "rectangle", "x": 900, "y": 100, "width": 200, "height": 120, "backgroundColor": "#000000", "strokeColor": "#ffffff", "text": "AI Layer\n- Categorizer\n- RAG Replies"},
    {"type": "rectangle", "x": 900, "y": 300, "width": 200, "height": 100, "backgroundColor": "#000000", "strokeColor": "#ffffff", "text": "Slack / Webhook"},
    {"type": "rectangle", "x": 500, "y": 400, "width": 300, "height": 100, "backgroundColor": "#000000", "strokeColor": "#ffffff", "text": "Elasticsearch (Docker)"},
    {"type": "rectangle", "x": 100, "y": 400, "width": 300, "height": 120, "backgroundColor": "#000000", "strokeColor": "#ffffff", "text": "IMAP Servers\n(Gmail, Outlook)"},
    {"type": "arrow", "start": {"x": 400, "y": 450}, "end": {"x": 500, "y": 450}},
    {"type": "arrow", "start": {"x": 400, "y": 200}, "end": {"x": 500, "y": 200}},
    {"type": "arrow", "start": {"x": 800, "y": 200}, "end": {"x": 900, "y": 200}},
    {"type": "arrow", "start": {"x": 800, "y": 450}, "end": {"x": 900, "y": 350}},
    {"type": "arrow", "start": {"x": 400, "y": 200}, "end": {"x": 500, "y": 200}}
  ]
}
```

---

✅ **You can copy-paste this JSON into [https://excalidraw.com](https://excalidraw.com)** → Click *Menu → Load Scene → Paste JSON* to view the polished dark-themed system architecture diagram.

```
``` -->
