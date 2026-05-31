import { readState } from "../database/stateStore.js";
import { userNeedsPolicyAcceptance } from "../services/policies.js";
import { sessions } from "../security/sessions.js";
import { sendFail } from "../utils/responses.js";
const mutatingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const policyExemptPaths = new Set(["/api/policies/accept", "/api/auth/sign-out"]);
export function withSession(requireCsrf) {
    return async (req, res, next) => {
        const sessionId = req.signedCookies.oasis_sid;
        const session = typeof sessionId === "string" ? sessions.get(sessionId) : undefined;
        req.sessionRecord = session;
        if (session) {
            const state = await readState();
            req.user = state.users.find((item) => item.id === session.userId) ?? null;
        }
        else {
            req.user = null;
        }
        if (requireCsrf && mutatingMethods.has(req.method)) {
            if (!session || req.header("x-csrf-token") !== session.csrfToken) {
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
