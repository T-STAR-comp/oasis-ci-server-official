import { env } from "../config/env.js";
import { deleteSession, readSession, touchSession, writeSession, } from "../services/sessionStore.js";
import { createId } from "../utils/ids.js";
export function sessionCookieMaxAgeMs() {
    return env.sessionTtlHours * 60 * 60 * 1000;
}
export function setSessionCookie(res, sessionId) {
    res.cookie("oasis_sid", sessionId, {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        signed: true,
        maxAge: sessionCookieMaxAgeMs(),
    });
}
export function clearSessionCookie(res) {
    res.clearCookie("oasis_sid", {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: env.nodeEnv === "production" ? "none" : "lax",
        signed: true,
    });
}
export async function loadSession(sessionId) {
    if (!sessionId)
        return null;
    const record = await readSession(sessionId);
    if (!record)
        return null;
    await touchSession(sessionId);
    return record;
}
export async function createUserSession(res, userId) {
    const sessionId = createId("sess");
    const csrfToken = createId("csrf");
    const record = { userId, csrfToken, createdAt: Date.now() };
    await writeSession(sessionId, record);
    setSessionCookie(res, sessionId);
    return { sessionId, csrfToken, record };
}
export async function destroyUserSession(res, sessionId) {
    if (sessionId) {
        await deleteSession(sessionId);
    }
    clearSessionCookie(res);
}
