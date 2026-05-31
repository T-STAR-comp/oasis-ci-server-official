import { env } from "../config/env.js";
export const sessions = new Map();
export function setSessionCookie(res, sessionId) {
    res.cookie("oasis_sid", sessionId, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        signed: true,
        maxAge: 1000 * 60 * 60 * 8,
    });
}
