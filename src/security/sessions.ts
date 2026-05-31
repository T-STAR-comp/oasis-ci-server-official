import type { Response } from "express";
import { env } from "../config/env.js";
import type { SessionRecord } from "../types/api.js";

export const sessions = new Map<string, SessionRecord>();

export function setSessionCookie(res: Response, sessionId: string) {
  res.cookie("oasis_sid", sessionId, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    signed: true,
    maxAge: 1000 * 60 * 60 * 8,
  });
}

