import { unsign } from "cookie-signature";
import type { Request } from "express";
import { env } from "../config/env.js";

const SESSION_COOKIE = "oasis_sid";

/** Every signed oasis_sid value in the Cookie header (handles duplicate cookies). */
export function parseAllSignedSessionIds(req: Request): string[] {
  const header = req.headers.cookie;
  if (!header) return [];

  const ids: string[] = [];
  for (const segment of header.split(";")) {
    const trimmed = segment.trim();
    if (!trimmed.startsWith(`${SESSION_COOKIE}=`)) continue;
    const raw = decodeURIComponent(trimmed.slice(SESSION_COOKIE.length + 1));
    const unsigned = unsign(raw, env.sessionSecret);
    if (unsigned && !ids.includes(unsigned)) {
      ids.push(unsigned);
    }
  }
  return ids;
}

export function requestHadSessionCookie(req: Request) {
  return parseAllSignedSessionIds(req).length > 0;
}
