import type { NextFunction, Request, Response } from "express";
import { readState } from "../database/stateStore.js";
import { userNeedsPolicyAcceptance } from "../services/policies.js";
import { clearSessionCookie, loadSession } from "../security/sessions.js";
import type { UserRole } from "../types/models.js";
import { sendFail } from "../utils/responses.js";

const mutatingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const policyExemptPaths = new Set(["/api/policies/accept", "/api/auth/sign-out"]);

export function withSession(requireCsrf: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionId =
      typeof req.signedCookies.oasis_sid === "string" ? req.signedCookies.oasis_sid : undefined;
    const hadSessionCookie = Boolean(sessionId);
    const session = await loadSession(sessionId);

    // Only clear stale cookies on mutating requests so background /api/session
    // checks do not wipe auth while the user switches browser tabs.
    if (hadSessionCookie && !session && mutatingMethods.has(req.method)) {
      clearSessionCookie(res);
    }

    req.sessionRecord = session ?? undefined;
    if (session) {
      const state = await readState();
      req.user = state.users.find((item) => item.id === session.userId) ?? null;
    } else {
      req.user = null;
    }

    if (requireCsrf && mutatingMethods.has(req.method)) {
      if (!session) {
        const message = hadSessionCookie
          ? "Your session expired. Sign in again to continue."
          : "Invalid or missing CSRF token.";
        return sendFail(res, message, 403);
      }
      if (req.header("x-csrf-token") !== session.csrfToken) {
        return sendFail(res, "Invalid or missing CSRF token.", 403);
      }
    }

    if (
      requireCsrf &&
      mutatingMethods.has(req.method) &&
      req.user &&
      userNeedsPolicyAcceptance(req.user) &&
      !policyExemptPaths.has(req.path)
    ) {
      return sendFail(
        res,
        "You must review and accept the current Oasis CI policies before using the platform.",
        428,
      );
    }

    return next();
  };
}

export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendFail(res, "You do not have permission to perform this action.", 403);
    }
    return next();
  };
}
