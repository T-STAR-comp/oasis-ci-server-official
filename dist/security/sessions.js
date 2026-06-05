import { env } from "../config/env.js";
import { deleteSession, readSession, touchSession, writeSession, } from "../services/sessionStore.js";
import { createId } from "../utils/ids.js";
export function sessionCookieMaxAgeMs() {
    return env.sessionTtlHours * 60 * 60 * 1000;
}
function sessionCookieOptions() {
    const sameSite = env.cookieSameSite;
    return {
        httpOnly: true,
        secure: env.nodeEnv === "production" || sameSite === "none",
        sameSite,
        signed: true,
        path: "/",
        ...(env.cookieDomain ? { domain: env.cookieDomain } : {}),
    };
}
export function setSessionCookie(res, sessionId) {
    res.cookie("oasis_sid", sessionId, {
        ...sessionCookieOptions(),
        maxAge: sessionCookieMaxAgeMs(),
    });
}
export function clearSessionCookie(res) {
    res.clearCookie("oasis_sid", sessionCookieOptions());
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
    try {
        await writeSession(sessionId, record);
    }
    catch (error) {
        console.error("[session] Failed to persist session", { userId, sessionId, error });
        throw error;
    }
    setSessionCookie(res, sessionId);
    return { sessionId, csrfToken, record };
}
export async function destroyUserSession(res, sessionId) {
    if (sessionId) {
        await deleteSession(sessionId);
    }
    clearSessionCookie(res);
}
