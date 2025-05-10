-- Add updated_at and indexes to fx_rates
ALTER TABLE fx_rates
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD INDEX idx_timestamp (timestamp),
ADD INDEX idx_source (source);

-- Add updated_at and indexes to users
ALTER TABLE users
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD INDEX idx_email (email),
ADD INDEX idx_created_at (created_at);

-- Enhance alert_rules with soft delete and status
ALTER TABLE alert_rules
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN deleted_at DATETIME NULL,
ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
ADD INDEX idx_user_status (user_id, status),
ADD INDEX idx_pair_status (pair, status),
ADD INDEX idx_created_at (created_at),
ADD INDEX idx_last_triggered (last_triggered);

-- Add comments for better documentation
ALTER TABLE fx_rates COMMENT 'Stores foreign exchange rates with timestamps and source information';
ALTER TABLE users COMMENT 'User accounts with authentication and subscription information';
ALTER TABLE alert_rules COMMENT 'Alert rules for FX rate monitoring with notification channels'; 