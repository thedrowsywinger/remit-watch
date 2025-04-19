# remit-watch
An FX Alert Bot

# Product Requirements Document (PRD)

## 1. Executive Summary  
Building a reliable, low‑cost FX Alert Bot for BDT–USD (and eventually other pairs) that lets users define threshold rules and receive real‑time push alerts via Telegram, WhatsApp, email, or custom webhooks.

## 2. Core Features

| Feature           | Details                                                                                   |
|-------------------|-------------------------------------------------------------------------------------------|
| **Data Collection** | – Scrape Bangladesh Bank twice daily (cron).<br>– Poll partner‑bank JSON/CSV feeds hourly where available. |
| **Rules Engine**    | – Users define thresholds (e.g. “alert if BDT > 112/USD” or “±1 % in 24 h”).<br>– Store rules in DB; evaluate on each new data point.|
| **Notification Channels** | – Telegram Bot API<br>– WhatsApp via Twilio API<br>– Email (SendGrid)<br>– Custom webhook POST|
| **User Management** | – Sign‑up / login (JWT + refresh tokens)<br>– Profile: contact methods, timezone|
| **Historical Data & Charts** | – Persist rate history in DB.<br>– Expose chart endpoints (e.g. `/charts/30d?pair=BDTUSD`).|
| **Admin Dashboard** | – View system health, recent scrapes, notification logs, user counts.|
| **Monetization**    | – Stripe integration for subscription.<br>– Feature gates in API.|

## 3. User Stories

1. **As a user**, I want to sign up and verify my email so I can manage alerts securely.  
2. **As a user**, I want to create an alert rule “BDT > 112” so I get notified when the rate crosses my desired level.  
3. **As a user**, I want to receive that alert in Telegram so I don’t have to check a website constantly.  
4. **As an admin**, I want to see last‑24h scrape failures so I can act if a source breaks.

## 4. Functional Requirements

### 4.1 Authentication & Authorization  
- **Endpoints**:  
  - `POST /auth/register` → create user, send verification email.  
  - `POST /auth/login` → return JWT + refresh token.  
  - `POST /auth/refresh` → rotate tokens.  
- **Guards**: JWT guard on all `/api/*`.

### 4.2 FX Data Ingestion  
- **Service**: `FxIngestService` (NestJS provider).  
  - `scheduleScrape()` (using `@nestjs/schedule` Cron):  
    - Scrape BB official page (HTML parsing with Cheerio).  
    - Fetch partner JSON/CSV (Axios + CSV parser).  
    - Normalize into `{ pair: 'BDTUSD', rate: number, timestamp: Date }`.  
    - Persist in `fx_rates` table.  

### 4.3 Rules Evaluation  
- **Entity**: `AlertRule { id, userId, pair, thresholdType (gt/lt/changePct), thresholdValue, channels[] }`.  
- **Service**: `AlertService` invoked after each new rate insert:  
  - Fetch all rules for `pair`.  
  - If condition met (e.g. `rate > thresholdValue` or `pctChange24h > value`), enqueue notifications and mark rule as triggered (for non‑recurring or reset per 24 h).

### 4.4 Notifications  
- **Providers** (strategy pattern):  
  - `TelegramNotifier` (node‑telegram‑bot‑api),  
  - `WhatsAppNotifier` (Twilio),  
  - `EmailNotifier` (SendGrid),  
  - `WebhookNotifier`.  
- **Queue**: RabbitMQ (you’ve used before) to decouple ingress from notification spikes.

### 4.5 Billing & Subscriptions  
- **Stripe** integration for recurring billing.  
- Feature guards in code: free tier limits number of rules and pairs.

## 5. Non‑Functional Requirements  
- **Scalability**: Deploy on AWS ECS Fargate (or Lambda + RDS for serverless).  
- **Reliability**:  
  - Retry scraping on failure (exponential backoff).  
  - Track failures in `scrape_logs` with alerts to admin email if > X fails.  
- **Security**:  
  - Store secrets in AWS Secrets Manager.  
  - Rate‑limit public endpoints.  
- **Monitoring**:  
  - Use AWS CloudWatch / Prometheus + Grafana dashboards.  

## 6. Data Model (MySQL)

```sql
-- FX Rates History
CREATE TABLE fx_rates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  pair VARCHAR(7) NOT NULL,        -- e.g. 'BDTUSD'
  rate DECIMAL(10,4) NOT NULL,
  timestamp DATETIME NOT NULL,
  source VARCHAR(50) NOT NULL,
  INDEX idx_pair_time (pair, timestamp)
);

-- User Alert Rules
CREATE TABLE alert_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  pair VARCHAR(7) NOT NULL,
  type ENUM('gt','lt','changePct') NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  channels JSON NOT NULL,
  last_triggered DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Users (simplified)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 7. API Endpoints

| Method | Path                     | Auth  | Description                                  |
|--------|--------------------------|-------|----------------------------------------------|
| POST   | `/auth/register`         | no    | Create account & send verification email     |
| POST   | `/auth/login`            | no    | Login, receive JWT                           |
| GET    | `/users/me`              | yes   | Get profile & plan info                      |
| POST   | `/alerts`                | yes   | Create new alert rule                        |
| GET    | `/alerts`                | yes   | List my alert rules                          |
| DELETE | `/alerts/:id`            | yes   | Delete an alert rule                         |
| GET    | `/rates/:pair/history`   | yes   | Return last N days’ rates for charting       |
| GET    | `/admin/health`          | yes*  | (Admin only) view scrape & queue status      |

\* flagged in JWT with `role=admin`

## 8. Architecture Diagram (High‑Level)  
```
┌────────────┐     ┌─────────────┐      ┌────────────────┐
│ Cron/Scheduler ─▶│ FxIngestSvc ──▶│    RDS (MySQL)   │
│ (NestJS @Cron)   │    (Nest)    │      │ fx_rates, etc. │
└────────────┘     └─────┬───────┘      └────────┬───────┘
                            │                            │
                            ▼                            │
                     ┌─────────────┐                    │
                     │ AlertSvc    │◀───────────────────┘
                     └────┬────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
       TelegramBot  Twilio/WhatsApp  SendGrid  Webhook
```

## 9. Development Roadmap & Timeline

| Week | Milestone                                    |
|------|-----------------------------------------------|
| 1    | Set up NestJS project, DB schemas, auth       |
| 2    | Implement scraping service + persistence      |
| 3    | Build rules engine + basic Telegram alerts    |
| 4    | Add email & webhook channels, admin health    |
| 5    | Stripe billing + pro/free feature gating      |
| 6    | Historical charts endpoint + simple UI (optional) |
| 7    | Testing, monitoring, deploy to AWS            |

## 10. Success Metrics

- **Alert delivery latency**: < 5 min from rate publication.  
- **Error rate**: < 0.1 % scrape or notification failures.  
- **Conversion**: ≥ 10 % free→paid within 90 days.  
- **Retention**: ≥ 50 % of active users still receiving alerts after 60 days.

---