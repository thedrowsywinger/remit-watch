# FX Alert Bot for BDT-USD

## Overview
This application is a NestJS-based FX Alert Bot that monitors BDT-USD exchange rates and sends alerts via Telegram and webhooks when certain thresholds are met. It uses TypeORM for database interactions and follows a modular architecture.

## Features
- **FX Rate Monitoring**: Fetches and stores BDT-USD exchange rates.
- **Alert Rules**: Users can create alert rules with conditions (e.g., rate exceeds or falls below a threshold).
- **Notifications**: Alerts are sent via Telegram and webhooks.
- **User Management**: Supports user registration and management.
- **Metrics**: Prometheus metrics for monitoring alert evaluations and triggers.

## Project Structure
```
src/
├── alerts/
│   ├── dto/
│   │   └── create-alert.dto.ts
│   ├── alerts.controller.ts
│   └── alerts.service.ts
├── entities/
│   ├── alert-rule.entity.ts
│   ├── fx-rate.entity.ts
│   └── user.entity.ts
├── notifications/
│   ├── telegram-notifier.service.ts
│   └── webhook-notifier.service.ts
├── metrics/
│   └── metrics.service.ts
└── main.ts
```

## Database Schema
### FX Rates
```sql
CREATE TABLE fx_rates (
  id SERIAL PRIMARY KEY,
  pair VARCHAR(7) NOT NULL,
  rate DECIMAL(10,4) NOT NULL,
  source VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Alert Rules
```sql
CREATE TABLE alert_rules (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  pair VARCHAR(7) NOT NULL,
  threshold_type VARCHAR(2) NOT NULL,
  threshold_value DECIMAL(10,4) NOT NULL,
  channels JSON NOT NULL,
  webhook_url VARCHAR(2048),
  last_triggered TIMESTAMP,
  status VARCHAR(10) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);
```

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_pro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## How to Use
### Prerequisites
- Node.js and Yarn installed.
- PostgreSQL database.
- Telegram Bot Token (for notifications).

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Configure environment variables:
   - `DATABASE_URL`: PostgreSQL connection string.
   - `TELEGRAM_BOT_TOKEN`: Your Telegram Bot Token.
4. Run migrations:
   ```bash
   yarn migration:run
   ```
5. Start the application:
   ```bash
   yarn start:dev
   ```

### API Endpoints
#### Create an Alert Rule
**Request:**
```bash
curl -X POST http://localhost:3000/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "pair": "BDTUSD",
    "thresholdType": "gt",
    "thresholdValue": 85.5,
    "channels": ["telegram", "webhook"],
    "webhookUrl": "https://example.com/webhook"
  }'
```
**Response:**
```json
{
  "id": 1,
  "pair": "BDTUSD",
  "thresholdType": "gt",
  "thresholdValue": 85.5,
  "channels": ["telegram", "webhook"],
  "webhookUrl": "https://example.com/webhook",
  "lastTriggered": null,
  "status": "active"
}
```

#### List Alert Rules
**Request:**
```bash
curl http://localhost:3000/alerts
```
**Response:**
```json
[
  {
    "id": 1,
    "pair": "BDTUSD",
    "thresholdType": "gt",
    "thresholdValue": 85.5,
    "channels": ["telegram", "webhook"],
    "webhookUrl": "https://example.com/webhook",
    "lastTriggered": null,
    "status": "active"
  }
]
```

#### Delete an Alert Rule
**Request:**
```bash
curl -X DELETE http://localhost:3000/alerts/1
```
**Response:**
```json
{
  "message": "Alert rule 1 deleted successfully"
}
```

## Future Enhancements
- Support for multiple currency pairs.
- Alert rule templates.
- Compound rules.
- Historical rate viewing.
- Alert rule testing functionality.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fx_alert_bot

# Telegram Bot Token
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Application Port
PORT=3000

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Log Level
LOG_LEVEL=info

