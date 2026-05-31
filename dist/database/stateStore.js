import mysql from "mysql2/promise";
import { readFile } from "node:fs/promises";
import { env } from "../config/env.js";
import { createRandomPassword, hashPassword } from "../security/passwords.js";
let pool = null;
export function getStoreMode() {
    return pool ? "mysql" : "unavailable";
}
export function requirePool() {
    if (!pool)
        throw new Error("MySQL is not initialized. Check MYSQL_* env vars.");
    return pool;
}
export async function initDatabase() {
    const mysqlReady = env.mysql.host && env.mysql.user && env.mysql.database;
    if (!mysqlReady) {
        throw new Error("Missing MySQL configuration. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (and optionally MYSQL_PORT).");
    }
    const adminPool = mysql.createPool({
        host: env.mysql.host,
        port: env.mysql.port,
        user: env.mysql.user,
        password: env.mysql.password,
        waitForConnections: true,
        connectionLimit: 5,
    });
    await adminPool.query(`CREATE DATABASE IF NOT EXISTS \`${env.mysql.database}\``);
    await adminPool.end();
    pool = mysql.createPool({
        host: env.mysql.host,
        port: env.mysql.port,
        user: env.mysql.user,
        password: env.mysql.password,
        database: env.mysql.database,
        waitForConnections: true,
        connectionLimit: 10,
        namedPlaceholders: true,
        multipleStatements: true,
    });
    const schemaSql = await readSchemaSql();
    await pool.query(schemaSql);
    await ensureSchemaMigrations();
    const { ensurePlatformSettingsTable } = await import("../services/platformSettingsStore.js");
    await ensurePlatformSettingsTable();
    await ensureBootstrapAdmin();
}
async function readSchemaSql() {
    const localSchemaPath = new URL("./schema.sql", import.meta.url);
    const sourceSchemaPath = new URL("../../src/database/schema.sql", import.meta.url);
    return readFile(localSchemaPath, "utf8").catch(() => readFile(sourceSchemaPath, "utf8"));
}
async function ensureBootstrapAdmin() {
    const db = requirePool();
    const [rows] = await db.query("SELECT COUNT(*) as count FROM users");
    const count = Array.isArray(rows) ? Number(rows[0].count ?? 0) : 0;
    if (count > 0)
        return;
    const adminEmail = (process.env.BOOTSTRAP_ADMIN_EMAIL ?? "admin@oasis.local").trim().toLowerCase();
    const adminName = (process.env.BOOTSTRAP_ADMIN_NAME ?? "Oasis Admin").trim();
    const adminPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD ?? createRandomPassword();
    const adminId = "user-admin-bootstrap";
    await db.query(`INSERT INTO users (id, name, email, role, status, title, company, verified_domains, password_hint, password_hash)
     VALUES (:id, :name, :email, 'admin', 'active', :title, :company, :verified_domains, :password_hint, :password_hash)`, {
        id: adminId,
        name: adminName,
        email: adminEmail,
        title: "Platform Admin",
        company: "Oasis CI",
        verified_domains: JSON.stringify([]),
        password_hint: "Bootstrap admin credentials must be changed after first sign-in.",
        password_hash: await hashPassword(adminPassword),
    });
    console.log("Oasis CI first-time admin account created.");
    console.log(`Admin email: ${adminEmail}`);
    console.log(`Admin password: ${adminPassword}`);
    console.log("Sign in with these credentials, then update them from the dashboard.");
}
async function ensureSchemaMigrations() {
    const db = requirePool();
    const [columns] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'users' AND COLUMN_NAME = 'password_hash'`, { database: env.mysql.database });
    if (Array.isArray(columns) && columns.length === 0) {
        await db.query("ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER password_hint");
    }
    const userPolicyColumns = [
        { name: "policies_accepted_version", ddl: "VARCHAR(32) NULL" },
        { name: "policies_accepted_at", ddl: "DATETIME NULL" },
    ];
    for (const column of userPolicyColumns) {
        const [rows] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'users' AND COLUMN_NAME = :column`, { database: env.mysql.database, column: column.name });
        if (Array.isArray(rows) && rows.length === 0) {
            await db.query(`ALTER TABLE users ADD COLUMN ${column.name} ${column.ddl} AFTER password_hash`);
        }
    }
    const [recommendationColumn] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'exposures' AND COLUMN_NAME = 'remediation_recommendation'`, { database: env.mysql.database });
    if (Array.isArray(recommendationColumn) && recommendationColumn.length === 0) {
        await db.query("ALTER TABLE exposures ADD COLUMN remediation_recommendation TEXT NOT NULL DEFAULT '' AFTER internal_note");
    }
    const flagColumns = [
        "domain",
        "exposure_title",
        "category",
        "severity",
        "exposure_listing_status",
        "exposure_remediation_status",
        "reporter_name",
        "reporter_role",
        "flag_type",
        "title",
    ];
    for (const column of flagColumns) {
        const [rows] = await db.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'flags' AND COLUMN_NAME = :column`, { database: env.mysql.database, column });
        if (Array.isArray(rows) && rows.length === 0) {
            if (column === "domain") {
                await db.query("ALTER TABLE flags ADD COLUMN domain VARCHAR(255) NOT NULL DEFAULT '' AFTER exposure_id");
            }
            else if (column === "exposure_title") {
                await db.query("ALTER TABLE flags ADD COLUMN exposure_title VARCHAR(255) NOT NULL DEFAULT '' AFTER domain");
            }
            else if (column === "category") {
                await db.query("ALTER TABLE flags ADD COLUMN category ENUM('sensitive_data','open_directory','admin_panel','backup_config') NOT NULL DEFAULT 'open_directory' AFTER exposure_title");
            }
            else if (column === "severity") {
                await db.query("ALTER TABLE flags ADD COLUMN severity ENUM('critical','high','medium','low','info') NOT NULL DEFAULT 'medium' AFTER category");
            }
            else if (column === "exposure_listing_status") {
                await db.query("ALTER TABLE flags ADD COLUMN exposure_listing_status ENUM('approved','pending_review','rejected','fixed','archived') NOT NULL DEFAULT 'approved' AFTER severity");
            }
            else if (column === "exposure_remediation_status") {
                await db.query("ALTER TABLE flags ADD COLUMN exposure_remediation_status ENUM('not_started','in_progress','fixed') NOT NULL DEFAULT 'not_started' AFTER exposure_listing_status");
            }
            else if (column === "reporter_name") {
                await db.query("ALTER TABLE flags ADD COLUMN reporter_name VARCHAR(120) NOT NULL DEFAULT '' AFTER exposure_remediation_status");
            }
            else if (column === "reporter_role") {
                await db.query("ALTER TABLE flags ADD COLUMN reporter_role ENUM('owner','pen_tester','moderator','admin') NOT NULL DEFAULT 'owner' AFTER reporter_name");
            }
            else if (column === "flag_type") {
                await db.query("ALTER TABLE flags ADD COLUMN flag_type ENUM('false_positive','review_request','escalation') NOT NULL DEFAULT 'review_request' AFTER reporter_role");
            }
            else if (column === "title") {
                await db.query("ALTER TABLE flags ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '' AFTER flag_type");
            }
        }
    }
    await db.query(`
    CREATE TABLE IF NOT EXISTS platform_settings (
      id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
      remediation_email VARCHAR(255) NOT NULL,
      remediation_phone VARCHAR(64) NOT NULL DEFAULT '',
      updated_at DATETIME NOT NULL
    ) ENGINE=InnoDB
  `);
    await db.query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id VARCHAR(40) PRIMARY KEY,
      user_id VARCHAR(40) NOT NULL,
      type ENUM('fix_denied','fix_verified','fix_reversed','flag_update','general') NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      exposure_id VARCHAR(40) NULL,
      domain VARCHAR(255) NULL,
      read_flag TINYINT(1) NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL,
      KEY idx_notifications_user_id (user_id),
      KEY idx_notifications_read (read_flag),
      CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
  `);
}
export async function readState() {
    const db = requirePool();
    const [userRows] = await db.query("SELECT * FROM users ORDER BY created_at DESC");
    const users = userRows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status,
        title: row.title,
        company: row.company,
        verifiedDomains: typeof row.verified_domains === "string" ? JSON.parse(row.verified_domains) : row.verified_domains,
        passwordHint: row.password_hint,
        passwordHash: row.password_hash ?? undefined,
        policiesAcceptedVersion: row.policies_accepted_version ?? undefined,
        policiesAcceptedAt: row.policies_accepted_at
            ? new Date(row.policies_accepted_at).toISOString()
            : undefined,
    }));
    const [domainRows] = await db.query("SELECT * FROM domains ORDER BY updated_at DESC");
    const domains = domainRows.map((row) => ({
        id: row.id,
        domain: row.domain,
        companyName: row.company_name,
        sector: row.sector,
        verificationStatus: row.verification_status,
        ownerUserId: row.owner_user_id ?? undefined,
        coverageScore: row.coverage_score,
        riskScore: row.risk_score,
        lastScanAt: new Date(row.last_scan_at).toISOString(),
        contactEmail: row.contact_email,
        contactPhone: row.contact_phone,
        ownerAccessExpiresAt: row.owner_access_expires_at ? new Date(row.owner_access_expires_at).toISOString() : undefined,
        notificationChannel: row.notification_channel,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags,
    }));
    const [exposureRows] = await db.query("SELECT * FROM exposures ORDER BY discovered_at DESC");
    const [historyRows] = await db.query("SELECT * FROM exposure_history ORDER BY at DESC");
    const historyByExposure = new Map();
    for (const row of historyRows) {
        const item = {
            id: row.id,
            actor: row.actor_name,
            action: row.action,
            at: new Date(row.at).toISOString(),
            note: row.note ?? undefined,
        };
        const list = historyByExposure.get(row.exposure_id) ?? [];
        list.push(item);
        historyByExposure.set(row.exposure_id, list);
    }
    const exposures = exposureRows.map((row) => ({
        id: row.id,
        domain: row.domain,
        redactedDomain: row.domain, // Real mode: do not mask.
        companyName: row.company_name,
        sector: row.sector,
        category: row.category,
        severity: row.severity,
        description: row.description,
        publicPath: row.public_path,
        fullUrl: row.full_url,
        exactPath: row.exact_path,
        snippet: row.snippet,
        evidenceSample: row.evidence_sample,
        discoveredAt: new Date(row.discovered_at).toISOString(),
        lastSeen: new Date(row.last_seen).toISOString(),
        fileCount: row.file_count ?? undefined,
        loginTitle: row.login_title ?? undefined,
        companyContactEmail: row.company_contact_email,
        companyContactPhone: row.company_contact_phone,
        remediationPrice: row.remediation_price != null ? Number(row.remediation_price) : undefined,
        removalReviewStatus: row.removal_review_status,
        submittedBy: row.submitted_by ?? undefined,
        assignedTeam: row.assigned_team,
        status: row.status,
        remediationStatus: row.remediation_status,
        internalNote: row.internal_note,
        remediationRecommendation: row.remediation_recommendation ?? "",
        history: historyByExposure.get(row.id) ?? [],
    }));
    const [submissionRows] = await db.query("SELECT * FROM submissions ORDER BY created_at DESC");
    const submissions = submissionRows.map((row) => ({
        id: row.id,
        exposureId: row.exposure_id,
        domain: row.domain,
        fullUrl: row.full_url,
        category: row.category,
        severity: row.severity,
        description: row.description,
        proofOfConcept: row.proof_of_concept,
        submittedBy: row.submitted_by,
        createdAt: new Date(row.created_at).toISOString(),
        status: row.status,
        moderatorNote: row.moderator_note,
    }));
    const [flagRows] = await db.query("SELECT * FROM flags ORDER BY created_at DESC");
    const flags = flagRows.map((row) => ({
        id: row.id,
        exposureId: row.exposure_id,
        createdBy: row.created_by,
        reason: row.reason,
        status: row.status,
        createdAt: new Date(row.created_at).toISOString(),
        domain: row.domain ?? "",
        exposureTitle: row.exposure_title ?? "",
        category: row.category ?? "open_directory",
        severity: row.severity ?? "medium",
        exposureListingStatus: row.exposure_listing_status ?? "approved",
        exposureRemediationStatus: row.exposure_remediation_status ?? "not_started",
        reporterName: row.reporter_name ?? "",
        reporterRole: row.reporter_role ?? "owner",
        flagType: row.flag_type ?? "review_request",
        title: row.title ?? "",
    }));
    const [notificationRows] = await db.query("SELECT * FROM user_notifications ORDER BY created_at DESC LIMIT 500");
    const notifications = notificationRows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        type: row.type,
        title: row.title,
        message: row.message,
        exposureId: row.exposure_id ?? undefined,
        domain: row.domain ?? undefined,
        read: Boolean(row.read_flag),
        createdAt: new Date(row.created_at).toISOString(),
    }));
    const [claimRows] = await db.query("SELECT * FROM claims ORDER BY requested_at DESC");
    const claims = claimRows.map((row) => ({
        id: row.id,
        domain: row.domain,
        method: row.method,
        contact: row.contact,
        token: row.token,
        status: row.status,
        requestedAt: new Date(row.requested_at).toISOString(),
        recommendedEmail: row.recommended_email,
        recommendedPhone: row.recommended_phone,
    }));
    const [auditRows] = await db.query("SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 300");
    const auditLog = auditRows.map((row) => ({
        id: row.id,
        actor: row.actor,
        action: row.action,
        target: row.target,
        createdAt: new Date(row.created_at).toISOString(),
        detail: row.detail,
    }));
    return {
        currentUserId: null,
        publicSearch: "",
        users,
        domains,
        exposures,
        submissions,
        flags,
        claims,
        notifications,
        auditLog,
        analytics: buildAnalytics(exposures, submissions),
    };
}
export async function writeState(state) {
    const db = requirePool();
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // Child -> parent delete order to satisfy FKs.
        await connection.query("DELETE FROM sessions");
        await connection.query("DELETE FROM audit_events");
        await connection.query("DELETE FROM flags");
        await connection.query("DELETE FROM submissions");
        await connection.query("DELETE FROM exposure_history");
        await connection.query("DELETE FROM exposures");
        await connection.query("DELETE FROM user_notifications");
        await connection.query("DELETE FROM claims");
        await connection.query("DELETE FROM domains");
        await connection.query("DELETE FROM users");
        for (const user of state.users) {
            await connection.query(`INSERT INTO users (id, name, email, role, status, title, company, verified_domains, password_hint, password_hash, policies_accepted_version, policies_accepted_at)
         VALUES (:id, :name, :email, :role, :status, :title, :company, :verified_domains, :password_hint, :password_hash, :policies_accepted_version, :policies_accepted_at)`, {
                id: user.id,
                name: user.name,
                email: user.email.toLowerCase(),
                role: user.role,
                status: user.status,
                title: user.title,
                company: user.company,
                verified_domains: JSON.stringify(user.verifiedDomains ?? []),
                password_hint: user.passwordHint,
                password_hash: user.passwordHash ?? null,
                policies_accepted_version: user.policiesAcceptedVersion ?? null,
                policies_accepted_at: user.policiesAcceptedAt ? new Date(user.policiesAcceptedAt) : null,
            });
        }
        for (const domain of state.domains) {
            await connection.query(`INSERT INTO domains (
           id, domain, company_name, sector, verification_status, owner_user_id,
           coverage_score, risk_score, last_scan_at, contact_email, contact_phone,
           owner_access_expires_at, notification_channel, tags
         ) VALUES (
           :id, :domain, :company_name, :sector, :verification_status, :owner_user_id,
           :coverage_score, :risk_score, :last_scan_at, :contact_email, :contact_phone,
           :owner_access_expires_at, :notification_channel, :tags
         )`, {
                id: domain.id,
                domain: domain.domain,
                company_name: domain.companyName,
                sector: domain.sector,
                verification_status: domain.verificationStatus,
                owner_user_id: domain.ownerUserId ?? null,
                coverage_score: domain.coverageScore,
                risk_score: domain.riskScore,
                last_scan_at: new Date(domain.lastScanAt),
                contact_email: domain.contactEmail,
                contact_phone: domain.contactPhone,
                owner_access_expires_at: domain.ownerAccessExpiresAt ? new Date(domain.ownerAccessExpiresAt) : null,
                notification_channel: domain.notificationChannel,
                tags: JSON.stringify(domain.tags ?? []),
            });
        }
        for (const claim of state.claims) {
            await connection.query(`INSERT INTO claims (
           id, domain, method, contact, token, status, requested_at, recommended_email, recommended_phone
         ) VALUES (
           :id, :domain, :method, :contact, :token, :status, :requested_at, :recommended_email, :recommended_phone
         )`, {
                id: claim.id,
                domain: claim.domain,
                method: claim.method,
                contact: claim.contact,
                token: claim.token,
                status: claim.status,
                requested_at: new Date(claim.requestedAt),
                recommended_email: claim.recommendedEmail,
                recommended_phone: claim.recommendedPhone,
            });
        }
        for (const exposure of state.exposures) {
            await connection.query(`INSERT INTO exposures (
           id, domain, company_name, sector, category, severity, description,
           public_path, full_url, exact_path, snippet, evidence_sample,
           discovered_at, last_seen, file_count, login_title,
           company_contact_email, company_contact_phone, remediation_price,
           removal_review_status, submitted_by, assigned_team, status, remediation_status, internal_note,
           remediation_recommendation
         ) VALUES (
           :id, :domain, :company_name, :sector, :category, :severity, :description,
           :public_path, :full_url, :exact_path, :snippet, :evidence_sample,
           :discovered_at, :last_seen, :file_count, :login_title,
           :company_contact_email, :company_contact_phone, :remediation_price,
           :removal_review_status, :submitted_by, :assigned_team, :status, :remediation_status, :internal_note,
           :remediation_recommendation
         )`, {
                id: exposure.id,
                domain: exposure.domain,
                company_name: exposure.companyName,
                sector: exposure.sector,
                category: exposure.category,
                severity: exposure.severity,
                description: exposure.description,
                public_path: exposure.publicPath,
                full_url: exposure.fullUrl,
                exact_path: exposure.exactPath,
                snippet: exposure.snippet,
                evidence_sample: exposure.evidenceSample,
                discovered_at: new Date(exposure.discoveredAt),
                last_seen: new Date(exposure.lastSeen),
                file_count: exposure.fileCount ?? null,
                login_title: exposure.loginTitle ?? null,
                company_contact_email: exposure.companyContactEmail,
                company_contact_phone: exposure.companyContactPhone,
                remediation_price: exposure.remediationPrice ?? null,
                removal_review_status: exposure.removalReviewStatus,
                submitted_by: exposure.submittedBy ?? null,
                assigned_team: exposure.assignedTeam,
                status: exposure.status,
                remediation_status: exposure.remediationStatus,
                internal_note: exposure.internalNote,
                remediation_recommendation: exposure.remediationRecommendation ?? "",
            });
            for (const event of exposure.history ?? []) {
                await connection.query(`INSERT INTO exposure_history (
             id, exposure_id, actor_user_id, actor_name, action, at, note
           ) VALUES (
             :id, :exposure_id, :actor_user_id, :actor_name, :action, :at, :note
           )`, {
                    id: event.id,
                    exposure_id: exposure.id,
                    actor_user_id: null,
                    actor_name: event.actor,
                    action: event.action,
                    at: new Date(event.at),
                    note: event.note ?? null,
                });
            }
        }
        for (const submission of state.submissions) {
            await connection.query(`INSERT INTO submissions (
           id, exposure_id, domain, full_url, category, severity, description, proof_of_concept,
           submitted_by, created_at, status, moderator_note
         ) VALUES (
           :id, :exposure_id, :domain, :full_url, :category, :severity, :description, :proof_of_concept,
           :submitted_by, :created_at, :status, :moderator_note
         )`, {
                id: submission.id,
                exposure_id: submission.exposureId,
                domain: submission.domain,
                full_url: submission.fullUrl,
                category: submission.category,
                severity: submission.severity,
                description: submission.description,
                proof_of_concept: submission.proofOfConcept,
                submitted_by: submission.submittedBy,
                created_at: new Date(submission.createdAt),
                status: submission.status,
                moderator_note: submission.moderatorNote,
            });
        }
        for (const flag of state.flags) {
            await connection.query(`INSERT INTO flags (
           id, exposure_id, created_by, reason, status, created_at,
           domain, exposure_title, category, severity,
           exposure_listing_status, exposure_remediation_status,
           reporter_name, reporter_role, flag_type, title
         ) VALUES (
           :id, :exposure_id, :created_by, :reason, :status, :created_at,
           :domain, :exposure_title, :category, :severity,
           :exposure_listing_status, :exposure_remediation_status,
           :reporter_name, :reporter_role, :flag_type, :title
         )`, {
                id: flag.id,
                exposure_id: flag.exposureId,
                created_by: flag.createdBy,
                reason: flag.reason,
                status: flag.status,
                created_at: new Date(flag.createdAt),
                domain: flag.domain,
                exposure_title: flag.exposureTitle,
                category: flag.category,
                severity: flag.severity,
                exposure_listing_status: flag.exposureListingStatus,
                exposure_remediation_status: flag.exposureRemediationStatus,
                reporter_name: flag.reporterName,
                reporter_role: flag.reporterRole,
                flag_type: flag.flagType,
                title: flag.title,
            });
        }
        for (const notification of state.notifications ?? []) {
            await connection.query(`INSERT INTO user_notifications (
           id, user_id, type, title, message, exposure_id, domain, read_flag, created_at
         ) VALUES (
           :id, :user_id, :type, :title, :message, :exposure_id, :domain, :read_flag, :created_at
         )`, {
                id: notification.id,
                user_id: notification.userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                exposure_id: notification.exposureId ?? null,
                domain: notification.domain ?? null,
                read_flag: notification.read ? 1 : 0,
                created_at: new Date(notification.createdAt),
            });
        }
        for (const audit of state.auditLog) {
            await connection.query(`INSERT INTO audit_events (id, actor, action, target, detail, created_at)
         VALUES (:id, :actor, :action, :target, :detail, :created_at)`, {
                id: audit.id,
                actor: audit.actor,
                action: audit.action,
                target: audit.target,
                detail: audit.detail,
                created_at: new Date(audit.createdAt),
            });
        }
        await connection.commit();
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
function buildAnalytics(exposures, submissions) {
    const totalDiscovered = exposures.length;
    const totalRemediated = exposures.filter((e) => e.remediationStatus === "fixed").length;
    const totalSubmissions = submissions.length;
    return [
        {
            label: "All time",
            discovered: totalDiscovered,
            remediated: totalRemediated,
            submissions: totalSubmissions,
        },
    ];
}
