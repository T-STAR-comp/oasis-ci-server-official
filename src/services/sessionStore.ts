import { env } from "../config/env.js";
import { requirePool } from "../database/stateStore.js";
import type { SessionRecord } from "../types/api.js";

function sessionTtlHours() {
  return env.sessionTtlHours;
}

function mapSessionRow(row: { user_id: string; csrf_token: string; created_at: Date }): SessionRecord {
  return {
    userId: row.user_id,
    csrfToken: row.csrf_token,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function ensureSessionsTable() {
  const db = requirePool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(40) PRIMARY KEY,
      user_id VARCHAR(40) NOT NULL,
      csrf_token VARCHAR(64) NOT NULL,
      created_at DATETIME NOT NULL,
      expires_at DATETIME NOT NULL,
      KEY idx_sessions_user_id (user_id),
      KEY idx_sessions_expires_at (expires_at),
      KEY idx_sessions_csrf_token (csrf_token)
    ) ENGINE=InnoDB
  `);

  const [fkRows] = await db.query(
    `SELECT CONSTRAINT_NAME AS name
     FROM information_schema.KEY_COLUMN_USAGE
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'sessions'
       AND REFERENCED_TABLE_NAME = 'users'`,
  );
  const fkName = (fkRows as { name: string }[])[0]?.name;
  if (fkName) {
    await db.query(`ALTER TABLE sessions DROP FOREIGN KEY ${fkName}`);
  }

  const [csrfCol] = await db.query(
    `SELECT COLUMN_TYPE AS type_name
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sessions' AND COLUMN_NAME = 'csrf_token'
     LIMIT 1`,
  );
  const typeName = (csrfCol as { type_name: string }[])[0]?.type_name?.toLowerCase() ?? "";
  if (typeName && !typeName.includes("64")) {
    await db.query("ALTER TABLE sessions MODIFY csrf_token VARCHAR(64) NOT NULL");
  }

  const [csrfIndex] = await db.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sessions' AND INDEX_NAME = 'idx_sessions_csrf_token'`,
  );
  if (Number((csrfIndex as { count: number }[])[0]?.count ?? 0) === 0) {
    await db.query("CREATE INDEX idx_sessions_csrf_token ON sessions (csrf_token)");
  }
}

export async function readSession(sessionId: string): Promise<SessionRecord | null> {
  await ensureSessionsTable();
  const db = requirePool();
  const [rows] = await db.query(
    `SELECT user_id, csrf_token, created_at
     FROM sessions
     WHERE id = :id AND expires_at > UTC_TIMESTAMP()
     LIMIT 1`,
    { id: sessionId },
  );
  const row = (rows as { user_id: string; csrf_token: string; created_at: Date }[])[0];
  if (!row) return null;
  return mapSessionRow(row);
}

export async function readSessionByCsrfToken(
  csrfToken: string,
): Promise<{ sessionId: string; record: SessionRecord } | null> {
  await ensureSessionsTable();
  const db = requirePool();
  const [rows] = await db.query(
    `SELECT id, user_id, csrf_token, created_at
     FROM sessions
     WHERE csrf_token = :csrf_token AND expires_at > UTC_TIMESTAMP()
     LIMIT 1`,
    { csrf_token: csrfToken },
  );
  const row = (rows as { id: string; user_id: string; csrf_token: string; created_at: Date }[])[0];
  if (!row) return null;
  return { sessionId: row.id, record: mapSessionRow(row) };
}

export async function deleteSessionsForUser(userId: string) {
  await ensureSessionsTable();
  const db = requirePool();
  await db.query(`DELETE FROM sessions WHERE user_id = :user_id`, { user_id: userId });
}

export async function writeSession(sessionId: string, record: SessionRecord) {
  await ensureSessionsTable();
  const db = requirePool();
  const ttlHours = sessionTtlHours();
  await db.query(
    `INSERT INTO sessions (id, user_id, csrf_token, created_at, expires_at)
     VALUES (
       :id,
       :user_id,
       :csrf_token,
       UTC_TIMESTAMP(),
       DATE_ADD(UTC_TIMESTAMP(), INTERVAL :ttl_hours HOUR)
     )
     ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       csrf_token = VALUES(csrf_token),
       expires_at = DATE_ADD(UTC_TIMESTAMP(), INTERVAL :ttl_hours HOUR)`,
    {
      id: sessionId,
      user_id: record.userId,
      csrf_token: record.csrfToken,
      ttl_hours: ttlHours,
    },
  );
}

export async function touchSession(sessionId: string) {
  await ensureSessionsTable();
  const db = requirePool();
  await db.query(
    `UPDATE sessions
     SET expires_at = DATE_ADD(UTC_TIMESTAMP(), INTERVAL :ttl_hours HOUR)
     WHERE id = :id`,
    { id: sessionId, ttl_hours: sessionTtlHours() },
  );
}

export async function deleteSession(sessionId: string) {
  await ensureSessionsTable();
  const db = requirePool();
  await db.query(`DELETE FROM sessions WHERE id = :id`, { id: sessionId });
}

export async function pruneExpiredSessions() {
  await ensureSessionsTable();
  const db = requirePool();
  await db.query(`DELETE FROM sessions WHERE expires_at <= UTC_TIMESTAMP()`);
}
