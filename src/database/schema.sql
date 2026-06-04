-- Oasis CI - MySQL schema (production)
-- MySQL 5.7+/MariaDB compatible where JSON support is available.

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(40) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role ENUM('owner','pen_tester','moderator','admin') NOT NULL,
  status ENUM('active','pending_review','temporary','suspended') NOT NULL,
  title VARCHAR(160) NOT NULL,
  company VARCHAR(160) NOT NULL,
  verified_domains JSON NOT NULL,
  password_hint VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS domains (
  id VARCHAR(40) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  company_name VARCHAR(160) NOT NULL,
  sector VARCHAR(120) NOT NULL,
  verification_status ENUM('verified','unclaimed') NOT NULL,
  owner_user_id VARCHAR(40) NULL,
  coverage_score INT NOT NULL,
  risk_score INT NOT NULL,
  last_scan_at DATETIME NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(40) NOT NULL,
  owner_access_expires_at DATETIME NULL,
  notification_channel ENUM('digest','slack_bridge','security_mailbox') NOT NULL,
  tags JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_domains_domain (domain),
  KEY idx_domains_owner_user_id (owner_user_id),
  CONSTRAINT fk_domains_owner_user_id FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS claims (
  id VARCHAR(40) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  method ENUM('email','sms') NOT NULL,
  contact VARCHAR(255) NOT NULL,
  token VARCHAR(40) NOT NULL,
  status ENUM('draft','token_sent','verified') NOT NULL,
  requested_at DATETIME NOT NULL,
  recommended_email VARCHAR(255) NOT NULL,
  recommended_phone VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_claims_domain (domain),
  CONSTRAINT fk_claims_domain FOREIGN KEY (domain) REFERENCES domains(domain)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exposures (
  id VARCHAR(40) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  company_name VARCHAR(160) NOT NULL,
  sector VARCHAR(120) NOT NULL,
  category ENUM('sensitive_data','open_directory','admin_panel','backup_config') NOT NULL,
  severity ENUM('critical','high','medium','low','info') NOT NULL,
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
  company_contact_phone VARCHAR(40) NOT NULL,
  remediation_price DECIMAL(10,2) NULL,
  removal_review_status ENUM('not_requested','requested','verified_removed') NOT NULL,
  submitted_by VARCHAR(40) NULL,
  assigned_team VARCHAR(160) NOT NULL,
  status ENUM('approved','pending_review','rejected','fixed','archived') NOT NULL,
  remediation_status ENUM('not_started','in_progress','fixed') NOT NULL,
  internal_note TEXT NOT NULL,
  remediation_recommendation TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_exposures_domain (domain),
  KEY idx_exposures_status (status),
  KEY idx_exposures_removal_review_status (removal_review_status),
  KEY idx_exposures_submitted_by (submitted_by),
  CONSTRAINT fk_exposures_domain FOREIGN KEY (domain) REFERENCES domains(domain)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_exposures_submitted_by FOREIGN KEY (submitted_by) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exposure_history (
  id VARCHAR(40) PRIMARY KEY,
  exposure_id VARCHAR(40) NOT NULL,
  actor_user_id VARCHAR(40) NULL,
  actor_name VARCHAR(120) NOT NULL,
  action VARCHAR(160) NOT NULL,
  at DATETIME NOT NULL,
  note TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_exposure_history_exposure_id (exposure_id),
  KEY idx_exposure_history_actor_user_id (actor_user_id),
  CONSTRAINT fk_exposure_history_exposure_id FOREIGN KEY (exposure_id) REFERENCES exposures(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_exposure_history_actor_user_id FOREIGN KEY (actor_user_id) REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS submissions (
  id VARCHAR(40) PRIMARY KEY,
  exposure_id VARCHAR(40) NOT NULL,
  domain VARCHAR(255) NOT NULL,
  full_url VARCHAR(2048) NOT NULL,
  category ENUM('sensitive_data','open_directory','admin_panel','backup_config') NOT NULL,
  severity ENUM('critical','high','medium','low','info') NOT NULL,
  description TEXT NOT NULL,
  proof_of_concept TEXT NOT NULL,
  submitted_by VARCHAR(40) NOT NULL,
  created_at DATETIME NOT NULL,
  status ENUM('pending_review','approved','rejected') NOT NULL,
  moderator_note TEXT NOT NULL,
  KEY idx_submissions_exposure_id (exposure_id),
  KEY idx_submissions_domain (domain),
  KEY idx_submissions_submitted_by (submitted_by),
  CONSTRAINT fk_submissions_exposure_id FOREIGN KEY (exposure_id) REFERENCES exposures(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_submissions_domain FOREIGN KEY (domain) REFERENCES domains(domain)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_submissions_submitted_by FOREIGN KEY (submitted_by) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS flags (
  id VARCHAR(40) PRIMARY KEY,
  exposure_id VARCHAR(40) NOT NULL,
  created_by VARCHAR(40) NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('open','resolved','dismissed') NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_flags_exposure_id (exposure_id),
  KEY idx_flags_status (status),
  CONSTRAINT fk_flags_exposure_id FOREIGN KEY (exposure_id) REFERENCES exposures(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_flags_created_by FOREIGN KEY (created_by) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_events (
  id VARCHAR(40) PRIMARY KEY,
  actor VARCHAR(120) NOT NULL,
  action VARCHAR(160) NOT NULL,
  target VARCHAR(255) NOT NULL,
  detail TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_audit_events_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(40) PRIMARY KEY,
  user_id VARCHAR(40) NOT NULL,
      csrf_token VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  KEY idx_sessions_user_id (user_id),
  KEY idx_sessions_expires_at (expires_at),
  CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
