# remit-watch
A low‑cost, reliable FX Alert Bot for BDT‑USD (and other FX pairs) with threshold‑based push notifications via Telegram and webhooks, plus health checks and Prometheus‑style metrics.

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Core Features](#core-features)
3. [User Stories](#user-stories)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [Data Model (MySQL)](#data-model-mysql)
7. [API Endpoints](#api-endpoints)
8. [Health & Monitoring](#health--monitoring)
9. [Development Roadmap & Timeline](#development-roadmap--timeline)
10. [Success Metrics](#success-metrics)

---

## Executive Summary
Building a reliable, low‑cost FX Alert Bot for BDT‑USD (and eventually other pairs) that lets users define threshold rules and receive real‑time push alerts via Telegram and custom webhooks.

---

## Core Features

| Feature                   | Details                                                                                              |
|---------------------------|------------------------------------------------------------------------------------------------------|
| **Data Collection**       | – Fetch USD→BDT from open.er‑api.com twice daily via Cron.                                            |
| **Rules Engine**          | – Users define thresholds (e.g. “alert if BDT > 112”).<br>– Persist rules and evaluate on each fetch. |
| **Notifications**         | – **Telegram** via Bot API<br>– **Webhooks**: POST JSON payload to user‑provided URL                   |
| **User Management**       | – Sign‑up / login (JWT)<br>– Profile: plan (free/pro)                                                 |
| **Admin Health Checks**   | – `/admin/health` endpoint via NestJS Terminus                                                      |
| **Prometheus Metrics**    | – `/metrics` endpoint exposes Prometheus counters via prom‑client                                     |

---

## User Stories
1. **As a user**, I want to register and log in so my alerts are private.  
2. **As a user**, I want to create an alert rule (e.g. “BDTUSD > 112”) with a callback webhook URL so I get pushed data.  
3. **As a user**, I want to receive alerts in my Telegram chat.  
4. **As an admin**, I want to check system health and metrics to verify uptime and performance.  

---

## Functional Requirements

### 1. Authentication & Authorization
- **Endpoints**:  
  - `POST /auth/register` → create user.  
  - `POST /auth/login` → return JWT.  
- **Guards**: JWT on all protected routes.

### 2. FX Data Ingestion
- **Service**: `FxService` with `@Cron('0 6,18 * * *')`  
- **Source**: `https://open.er-api.com/v6/latest/USD` for BDT rate  
- **Persistence**: store in `fx_rates` table with `{ pair, rate, timestamp, source }`.

### 3. Rules & Alerts
- **Entity**: `AlertRule { id, userId, pair, thresholdType (gt|lt), thresholdValue, channels[], webhookUrl?, lastTriggered }`.  
- **Evaluation**: on each fetch, evaluate all rules for the pair and trigger notifications.

### 4. Notifications
- **TelegramNotifier**: send Markdown message via HTTP API.  
- **WebhookNotifier**: POST JSON payload `{ alertId, pair, thresholdType, thresholdValue, currentRate, timestamp }` to user’s URL.

---

## Non-Functional Requirements
- **Scalability**: lightweight NestJS services, can run in a small VM or Docker.  
- **Reliability**: retry fetch on failure; log failures.  
- **Security**: store secrets in env; JWT guards.  
- **Monitoring**: free, open‑source tools (NestJS Terminus + prom-client).

---

## Data Model (MySQL)
```sql
CREATE TABLE fx_rates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pair VARCHAR(7) NOT NULL,
  rate DECIMAL(10,4) NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(50) NOT NULL,
  INDEX idx_pair_time (pair, timestamp)
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alert_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pair VARCHAR(7) NOT NULL,
  thresholdType ENUM('gt','lt') NOT NULL,
  thresholdValue DECIMAL(10,4) NOT NULL,
  channels JSON NOT NULL,
  webhookUrl VARCHAR(2048) NULL,
  last_triggered DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## API Endpoints

| Method | Path                 | Auth | Description                                  |
|--------|----------------------|------|----------------------------------------------|
| POST   | `/auth/register`     | No   | Register new user                            |
| POST   | `/auth/login`        | No   | Login, receive JWT                           |
| GET    | `/users/me`          | Yes  | Get user profile                             |
| POST   | `/alerts`            | Yes  | Create alert rule                            |
| GET    | `/alerts`            | Yes  | List my alert rules                          |
| DELETE | `/alerts/:id`        | Yes  | Delete an alert rule                         |
| GET    | `/fx/rate`           | No   | Trigger fetch (manual)                       |
| GET    | `/admin/health`      | No   | Health check (NestJS Terminus)               |
| GET    | `/metrics`           | No   | Prometheus metrics endpoint                  |

---

## Health & Monitoring
1. **Health Check**: `GET /admin/health` returns database connectivity status.  
2. **Metrics**: `GET /metrics` exposes Prometheus‑formatted counters for FX scrapes, scrape errors, alerts evaluated/triggered, plus default process metrics.

---

## Development Roadmap & Timeline
| Week | Milestone                                    |
|------|-----------------------------------------------|
| 1    | NestJS scaffold, DB & auth                    |
| 2    | FX ingestion & persistence                    |
| 3    | Rules engine & Telegram Notifier              |
| 4    | Webhook support & health checks               |
| 5    | Prometheus metrics & global error counting    |
| 6    | Frontend UI                                   |
| 7    | Testing & Docker deployment                   |

---

## Success Metrics
- **Alert latency**: < 5 min from fetch.  
- **Uptime**: ≥ 99 %.  
- **Metric coverage**: system health & metrics available.  
- **User onboarding**: first 100 sign‑ups within month 1.

