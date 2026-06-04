import { env } from "../config/env.js";
import { requirePool } from "../database/stateStore.js";
function sessionTtlMs() {
    return env.sessionTtlHours * 60 * 60 * 1000;
}
function toMysqlDatetime(ms) {
    return new Date(ms).toISOString().slice(0, 19).replace("T", " ");
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
      CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB
  `);
}
export async function readSession(sessionId) {
    await ensureSessionsTable();
    const db = requirePool();
    const [rows] = await db.query(`SELECT user_id, csrf_token, created_at
     FROM sessions
     WHERE id = :id AND expires_at > UTC_TIMESTAMP()
     LIMIT 1`, { id: sessionId });
    const row = rows[0];
    if (!row)
        return null;
    return {
        userId: row.user_id,
        csrfToken: row.csrf_token,
        createdAt: new Date(row.created_at).getTime(),
    };
}
export async function writeSession(sessionId, record) {
    await ensureSessionsTable();
    const db = requirePool();
    const now = Date.now();
    const expiresAt = now + sessionTtlMs();
    await db.query(`INSERT INTO sessions (id, user_id, csrf_token, created_at, expires_at)
     VALUES (:id, :user_id, :csrf_token, :created_at, :expires_at)
     ON DUPLICATE KEY UPDATE
       user_id = VALUES(user_id),
       csrf_token = VALUES(csrf_token),
       expires_at = VALUES(expires_at)`, {
        id: sessionId,
        user_id: record.userId,
        csrf_token: record.csrfToken,
        created_at: toMysqlDatetime(record.createdAt),
        expires_at: toMysqlDatetime(expiresAt),
    });
}
export async function touchSession(sessionId) {
    await ensureSessionsTable();
    const db = requirePool();
    const expiresAt = toMysqlDatetime(Date.now() + sessionTtlMs());
    await db.query(`UPDATE sessions SET expires_at = :expires_at WHERE id = :id`, {
        id: sessionId,
        expires_at: expiresAt,
    });
}
export async function deleteSession(sessionId) {
    await ensureSessionsTable();
    const db = requirePool();
    await db.query(`DELETE FROM sessions WHERE id = :id`, { id: sessionId });
}
export async function pruneExpiredSessions() {
    await ensureSessionsTable();
    const db = requirePool();
    await db.query(`DELETE FROM sessions WHERE expires_at <= UTC_TIMESTAMP()`);
}
