import { readState } from "../database/stateStore.js";
import { userNeedsPolicyAcceptance } from "../services/policies.js";
import { readSessionByCsrfToken } from "../services/sessionStore.js";
import { clearSessionCookie, loadSession, setSessionCookie } from "../security/sessions.js";
import { sendFail } from "../utils/responses.js";
const mutatingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const policyExemptPaths = new Set(["/api/policies/accept", "/api/auth/sign-out"]);
async function resolveRequestSession(req, res) {
    const cookieSessionId = typeof req.signedCookies.oasis_sid === "string" ? req.signedCookies.oasis_sid : undefined;
    const hadSessionCookie = Boolean(cookieSessionId);
    let sessionId = cookieSessionId;
    let session = await loadSession(sessionId);
    if (!session) {
        const csrfHeader = req.header("x-csrf-token")?.trim();
        if (csrfHeader) {
            const found = await readSessionByCsrfToken(csrfHeader);
            if (found) {
                sessionId = found.sessionId;
                session = found.record;
                setSessionCookie(res, sessionId);
            }
        }
    }
    return { sessionId, session, hadSessionCookie };
}
export function withSession(requireCsrf) {
    return async (req, res, next) => {
        const { sessionId, session, hadSessionCookie } = await resolveRequestSession(req, res);
        // Only clear stale cookies on mutating requests so background /api/session
        // checks do not wipe auth while the user switches browser tabs.
        if (hadSessionCookie && !session && mutatingMethods.has(req.method)) {
            clearSessionCookie(res);
        }
        req.sessionRecord = session ?? undefined;
        if (session) {
            const state = await readState();
            req.user = state.users.find((item) => item.id === session.userId) ?? null;
        }
        else {
            req.user = null;
        }
        if (requireCsrf && mutatingMethods.has(req.method)) {
            if (!session) {
                const message = hadSessionCookie
                    ? "Your session expired. Sign in again to continue."
                    : "Your session cookie was not sent with this request. Sign in again to continue.";
                return sendFail(res, message, 403);
            }
            if (req.header("x-csrf-token") !== session.csrfToken) {
                return sendFail(res, "Invalid or missing CSRF token.", 403);
            }
        }
        if (requireCsrf &&
            mutatingMethods.has(req.method) &&
            req.user &&
            userNeedsPolicyAcceptance(req.user) &&
            !policyExemptPaths.has(req.path)) {
            return sendFail(res, "You must review and accept the current Oasis CI policies before using the platform.", 428);
        }
        return next();
    };
}
export function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return sendFail(res, "You do not have permission to perform this action.", 403);
        }
        return next();
    };
}
