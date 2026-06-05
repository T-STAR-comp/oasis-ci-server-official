import type { NextFunction, Request, Response } from "express";
import { readState } from "../database/stateStore.js";
import { userNeedsPolicyAcceptance } from "../services/policies.js";
import { parseAllSignedSessionIds, requestHadSessionCookie } from "../security/cookieHeader.js";
import { readSessionByCsrfToken, touchSession } from "../services/sessionStore.js";
import { clearSessionCookie, loadSession, setSessionCookie } from "../security/sessions.js";
import type { UserRole } from "../types/models.js";
import { sendFail } from "../utils/responses.js";

const mutatingMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const policyExemptPaths = new Set(["/api/policies/accept", "/api/auth/sign-out"]);

async function resolveRequestSession(req: Request, res: Response) {
  const hadSessionCookie = requestHadSessionCookie(req);
  const cookieSessionIds = parseAllSignedSessionIds(req);
  let sessionId: string | undefined;
  let session = null as Awaited<ReturnType<typeof loadSession>>;

  for (const candidateId of cookieSessionIds) {
    const candidate = await loadSession(candidateId);
    if (candidate) {
      sessionId = candidateId;
      session = candidate;
      break;
    }
  }

  if (!session) {
    const csrfHeader = req.header("x-csrf-token")?.trim();
    if (csrfHeader) {
      const found = await readSessionByCsrfToken(csrfHeader);
      if (found) {
        sessionId = found.sessionId;
        session = found.record;
        await touchSession(sessionId);
        setSessionCookie(res, sessionId);
      }
    }
  }

  return { sessionId, session, hadSessionCookie, csrfHeader: req.header("x-csrf-token")?.trim() };
}

export function withSession(requireCsrf: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { sessionId, session, hadSessionCookie, csrfHeader } = await resolveRequestSession(req, res);

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
        const message = csrfHeader
          ? "Your sign-in session could not be verified. Sign in again to continue."
          : hadSessionCookie
            ? "Your session expired. Sign in again to continue."
            : "Your session cookie was not sent with this request. Sign in again to continue.";
        return sendFail(res, message, 403);
      }
      if (!csrfHeader || csrfHeader !== session.csrfToken) {
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
