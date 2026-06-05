/**
 * Verifies sign-in, bootstrap, exposure privacy, and authenticated mutations.
 *
 * Usage:
 *   node scripts/verify-auth-flow.mjs [baseUrl]
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/verify-auth-flow.mjs
 */
import dotenv from "dotenv";
import { sign } from "cookie-signature";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(packageRoot, ".env") });

const baseUrl = (process.argv[2] ?? "http://localhost:4000").replace(/\/$/, "");
const adminEmail = (process.env.ADMIN_EMAIL ?? process.env.BOOTSTRAP_ADMIN_EMAIL ?? "admin@oasis.local").trim();
const adminPassword = (process.env.ADMIN_PASSWORD ?? process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "admin").trim();
const sessionSecret = (process.env.SESSION_SECRET ?? "dev-only-change-this-secret-before-production-use").trim();

function parseSetCookie(headers) {
  const raw = headers.getSetCookie?.() ?? [];
  if (raw.length) return raw.map((entry) => entry.split(";")[0]).join("; ");
  const single = headers.get("set-cookie");
  return single ? single.split(",").map((entry) => entry.split(";")[0].trim()).join("; ") : "";
}

async function request(pathname, { method = "GET", body, cookie, csrf } = {}) {
  const headers = { accept: "application/json" };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (cookie) headers.cookie = cookie;
  if (csrf) headers["x-csrf-token"] = csrf;

  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return {
    status: response.status,
    json,
    cookie: parseSetCookie(response.headers) || cookie || "",
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function seedAdminSession() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST ?? "127.0.0.1",
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER ?? "root",
    password: process.env.MYSQL_PASSWORD ?? "",
    database: process.env.MYSQL_DATABASE ?? "oasis_ci",
  });

  const [users] = await connection.query(
    "SELECT id, role FROM users WHERE email = ? LIMIT 1",
    [adminEmail.toLowerCase()],
  );
  const user = users[0];
  assert(user, `No admin user found for ${adminEmail}`);

  const sessionId = `sess-verify${Date.now().toString(36)}`;
  const csrfToken = `csrf-verify${Date.now().toString(36)}`;
  const ttlHours = Math.max(1, Number(process.env.SESSION_TTL_HOURS ?? 24));

  await connection.query("DELETE FROM sessions WHERE user_id = ?", [user.id]);
  await connection.query(
    `INSERT INTO sessions (id, user_id, csrf_token, created_at, expires_at)
     VALUES (?, ?, ?, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL ? HOUR))`,
    [sessionId, user.id, csrfToken, ttlHours],
  );
  await connection.end();

  const signed = sign(sessionId, sessionSecret);
  return {
    cookie: `oasis_sid=${encodeURIComponent(`s:${signed}`)}`,
    csrf: csrfToken,
    userId: user.id,
    role: user.role,
  };
}

async function main() {
  console.log(`Verifying auth flow against ${baseUrl}`);

  let cookie = "";
  let csrf = "";
  let userId = "";

  const signIn = await request("/api/auth/sign-in", {
    method: "POST",
    body: { email: adminEmail, password: adminPassword },
  });

  if (signIn.status === 200 && signIn.json?.ok) {
    console.log("Signed in through /api/auth/sign-in");
    cookie = signIn.cookie;
    csrf = signIn.json.data.csrfToken;
    userId = signIn.json.data.user.id;
    assert(signIn.json.data.bootstrap?.currentUserId, "Sign-in missing authenticated bootstrap");
  } else {
    console.warn(
      `Sign-in with configured credentials failed (${signIn.status}: ${signIn.json?.message ?? "unknown"}). Seeding a temporary admin session in MySQL...`,
    );
    const seeded = await seedAdminSession();
    cookie = seeded.cookie;
    csrf = seeded.csrf;
    userId = seeded.userId;
  }

  assert(cookie.includes("oasis_sid"), "No oasis_sid cookie available for verification");
  assert(csrf, "No csrf token available for verification");

  const session = await request("/api/session", { cookie, csrf });
  assert(session.json?.ok, `Session failed: ${session.json?.message}`);
  assert(session.json.data?.user?.id === userId, "Session user mismatch");

  const bootstrap = await request("/api/bootstrap", { cookie, csrf });
  assert(bootstrap.json?.ok, `Bootstrap failed: ${bootstrap.json?.message}`);
  assert(
    bootstrap.json.data?.currentUserId === userId,
    `Bootstrap currentUserId mismatch (${bootstrap.json.data?.currentUserId})`,
  );

  const create = await request("/api/exposures", {
    method: "POST",
    cookie,
    csrf,
    body: {
      domain: "verify-auth.example.com",
      companyName: "Verify Auth Co",
      sector: "Testing",
      category: "admin_panel",
      severity: "low",
      status: "approved",
      remediationStatus: "not_started",
      description: "Auth verification exposure",
      fullUrl: "https://verify-auth.example.com/admin",
      snippet: "verification snippet",
      evidenceSample: "verification evidence",
      assignedTeam: "Admin Review",
      internalNote: "created by verify-auth-flow",
      companyContactEmail: "security@verify-auth.example.com",
      companyContactPhone: "+1 555 010 9999",
      loginTitle: "Verification Login Panel",
    },
  });
  assert(create.status === 200, `Create exposure failed (${create.status}): ${create.json?.message}`);
  assert(create.json?.ok, `Create exposure not ok: ${create.json?.message}`);
  assert(create.json.data?.fullUrl, "Created exposure missing fullUrl");

  const createdId = create.json.data.id;
  const detail = await request(`/api/exposures/${createdId}`, { cookie, csrf });
  assert(detail.json?.ok, `Exposure detail failed: ${detail.json?.message}`);
  assert(detail.json.data?.fullUrl, `Exposure ${createdId} missing fullUrl on GET`);
  assert(detail.json.data?.description, `Exposure ${createdId} missing description on GET`);
  console.log(`Exposure ${createdId} private fields returned on authenticated GET.`);

  const refreshedBootstrap = await request("/api/bootstrap", { cookie, csrf });
  assert(
    refreshedBootstrap.json.data?.currentUserId === userId,
    "Bootstrap lost authenticated currentUserId after mutation",
  );

  console.log("Auth flow verification passed.");
}

main().catch((error) => {
  console.error("Auth flow verification failed:", error.message);
  process.exit(1);
});
