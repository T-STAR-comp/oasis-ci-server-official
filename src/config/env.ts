import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: path.join(packageRoot, ".env") });

const port = Number(process.env.PORT ?? 4000);
const nodeEnv = process.env.NODE_ENV ?? "development";

const defaultPublicBase =
  nodeEnv === "production" ? "https://oasisafrica.xyz" : `http://localhost:${port}`;

const publicBaseUrl = (process.env.PUBLIC_BASE_URL ?? defaultPublicBase).replace(/\/$/, "");

function tryOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

/** Browser Origins allowed by CORS (includes www / non-www variants). */
export function getAllowedCorsOrigins() {
  const origins = new Set<string>();

  const add = (value?: string) => {
    const origin = value ? tryOrigin(value) : null;
    if (!origin) return;
    origins.add(origin);
    try {
      const url = new URL(origin);
      if (url.hostname.startsWith("www.")) {
        origins.add(`${url.protocol}//${url.hostname.slice(4)}${url.port ? `:${url.port}` : ""}`);
      } else if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
        origins.add(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ""}`);
      }
    } catch {
      // ignore
    }
  };

  add(publicBaseUrl);
  add(
    process.env.CLIENT_ORIGIN ??
      (nodeEnv === "production" ? publicBaseUrl : "http://localhost:5173"),
  );

  for (const entry of (process.env.ALLOWED_ORIGINS ?? "").split(",")) {
    add(entry.trim());
  }

  return origins;
}

export const env = {
  port,
  nodeEnv,
  publicBaseUrl,
  allowedCorsOrigins: getAllowedCorsOrigins(),
  clientOrigin:
    process.env.CLIENT_ORIGIN ??
    (nodeEnv === "production" ? publicBaseUrl : "http://localhost:5173"),
  sessionSecret:
    process.env.SESSION_SECRET ?? "dev-only-change-this-secret-before-production-use",
  mysql: {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  remediationEmail: (process.env.REMEDIATION_EMAIL ?? "remediation@oasisci.com").trim(),
  remediationPhone: (process.env.REMEDIATION_PHONE ?? "").trim(),
  /** Sliding session lifetime in hours (default 24). */
  sessionTtlHours: Math.max(1, Number(process.env.SESSION_TTL_HOURS ?? 24)),
  /** Optional cookie Domain (e.g. `.oasisafrica.xyz`). Defaults to registrable domain in production. */
  cookieDomain: resolveCookieDomain(),
  /** Cookie SameSite attribute. Defaults to `lax` (same-origin friendly). */
  cookieSameSite: resolveCookieSameSite(),
};

function resolveCookieDomain(): string | undefined {
  const configured = process.env.COOKIE_DOMAIN?.trim();
  if (configured) return configured;
  if (nodeEnv !== "production") return undefined;
  try {
    const host = new URL(publicBaseUrl).hostname;
    if (host === "localhost" || host === "127.0.0.1") return undefined;
    const bare = host.startsWith("www.") ? host.slice(4) : host;
    return `.${bare}`;
  } catch {
    return undefined;
  }
}

function resolveCookieSameSite(): "lax" | "none" | "strict" {
  const configured = process.env.COOKIE_SAME_SITE?.trim().toLowerCase();
  if (configured === "lax" || configured === "none" || configured === "strict") {
    return configured;
  }
  return "lax";
}

