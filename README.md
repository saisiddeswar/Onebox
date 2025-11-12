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
