# Oasis CI Database Schema

## Current Active MySQL Schema

The current server uses normalized MySQL tables. The executable schema lives in `src/database/schema.sql` and is applied automatically when the API starts.

The main records are split into:

- `users`
- `domains`
- `claims`
- `exposures`
- `exposure_history`
- `submissions`
- `flags`
- `audit_events`
- `sessions`

## Table Shape

```sql
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('owner', 'pen_tester', 'moderator', 'admin') NOT NULL,
  status ENUM('active', 'pending_review', 'temporary', 'suspended') NOT NULL,
  title VARCHAR(160) NOT NULL,
  company VARCHAR(180) NOT NULL,
  password_hash VARCHAR(255) NULL,
  password_hint VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE domains (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL UNIQUE,
  company_name VARCHAR(180) NOT NULL,
  sector VARCHAR(120) NOT NULL,
  verification_status ENUM('verified', 'unclaimed') NOT NULL,
  owner_user_id VARCHAR(64) NULL,
  coverage_score INT NOT NULL,
  risk_score INT NOT NULL,
  last_scan_at DATETIME NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(64) NOT NULL,
  owner_access_expires_at DATETIME NULL,
  notification_channel ENUM('digest', 'slack_bridge', 'security_mailbox') NOT NULL,
  tags JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_domains_owner FOREIGN KEY (owner_user_id) REFERENCES users(id)
);

CREATE TABLE user_verified_domains (
  user_id VARCHAR(64) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id, domain),
  CONSTRAINT fk_verified_domain_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE exposures (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  redacted_domain VARCHAR(255) NOT NULL,
  company_name VARCHAR(180) NOT NULL,
  sector VARCHAR(120) NOT NULL,
  category ENUM('sensitive_data', 'open_directory', 'admin_panel', 'backup_config') NOT NULL,
  severity ENUM('critical', 'high', 'medium', 'low', 'info') NOT NULL,
  description TEXT NOT NULL,
  public_path VARCHAR(1024) NOT NULL,
  full_url VARCHAR(2048) NOT NULL,
  exact_path VARCHAR(1024) NOT NULL,
  snippet TEXT NOT NULL,
  evidence_sample TEXT NOT NULL,
  discovered_at DATETIME NOT NULL,
  last_seen DATETIME NOT NULL,
  file_count INT NULL,
  login_title VARCHAR(255) NULL,
  company_contact_email VARCHAR(255) NOT NULL,
  company_contact_phone VARCHAR(64) NOT NULL,
  remediation_price DECIMAL(10,2) NULL,
  removal_review_status ENUM('not_requested', 'requested', 'verified_removed') NOT NULL,
  submitted_by VARCHAR(64) NULL,
  assigned_team VARCHAR(160) NOT NULL,
  status ENUM('approved', 'pending_review', 'rejected', 'fixed', 'archived') NOT NULL,
  remediation_status ENUM('not_started', 'in_progress', 'fixed') NOT NULL,
  internal_note TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_exposures_domain (domain),
  INDEX idx_exposures_status_severity (status, severity),
  CONSTRAINT fk_exposures_submitter FOREIGN KEY (submitted_by) REFERENCES users(id)
);

CREATE TABLE exposure_history (
  id VARCHAR(64) PRIMARY KEY,
  exposure_id VARCHAR(64) NOT NULL,
  actor VARCHAR(160) NOT NULL,
  action VARCHAR(160) NOT NULL,
  occurred_at DATETIME NOT NULL,
  note TEXT NULL,
  CONSTRAINT fk_history_exposure FOREIGN KEY (exposure_id) REFERENCES exposures(id)
);

CREATE TABLE submissions (
  id VARCHAR(64) PRIMARY KEY,
  exposure_id VARCHAR(64) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  full_url VARCHAR(2048) NOT NULL,
  category ENUM('sensitive_data', 'open_directory', 'admin_panel', 'backup_config') NOT NULL,
  severity ENUM('critical', 'high', 'medium', 'low', 'info') NOT NULL,
  description TEXT NOT NULL,
  proof_of_concept TEXT NOT NULL,
  submitted_by VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL,
  status ENUM('pending_review', 'approved', 'rejected') NOT NULL,
  moderator_note TEXT NOT NULL,
  CONSTRAINT fk_submission_exposure FOREIGN KEY (exposure_id) REFERENCES exposures(id),
  CONSTRAINT fk_submission_user FOREIGN KEY (submitted_by) REFERENCES users(id)
);

CREATE TABLE review_flags (
  id VARCHAR(64) PRIMARY KEY,
  exposure_id VARCHAR(64) NOT NULL,
  created_by VARCHAR(64) NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('open', 'resolved', 'dismissed') NOT NULL,
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_flag_exposure FOREIGN KEY (exposure_id) REFERENCES exposures(id),
  CONSTRAINT fk_flag_user FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE claim_requests (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  method ENUM('email', 'sms') NOT NULL,
  contact VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  status ENUM('draft', 'token_sent', 'verified') NOT NULL,
  requested_at DATETIME NOT NULL,
  recommended_email VARCHAR(255) NOT NULL,
  recommended_phone VARCHAR(64) NOT NULL,
  INDEX idx_claims_domain_status (domain, status)
);

CREATE TABLE audit_events (
  id VARCHAR(64) PRIMARY KEY,
  actor VARCHAR(160) NOT NULL,
  action VARCHAR(160) NOT NULL,
  target VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL,
  detail TEXT NOT NULL,
  INDEX idx_audit_created_at (created_at)
);

CREATE TABLE analytics_points (
  label VARCHAR(32) PRIMARY KEY,
  discovered INT NOT NULL,
  remediated INT NOT NULL,
  submissions INT NOT NULL
);
```

## Security Notes

- Store claim tokens as `token_hash`, not plaintext.
- Store real account passwords only as password hashes.
- Keep `full_url`, `exact_path`, `evidence_sample`, and `internal_note` server-only unless role checks pass.
- Index `exposures.status`, `exposures.severity`, and `exposures.domain` for the public directory and dashboard filters.
