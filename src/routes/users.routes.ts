import { Router } from "express";
import { z } from "zod";
import type { User, UserRole, UserStatus } from "../types/models.js";
import { readState, writeState } from "../database/stateStore.js";
import { requireRole, withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { createAuditEvent } from "../services/audit.js";
import { createRandomPassword, hashPassword } from "../security/passwords.js";
import { CURRENT_POLICIES_VERSION } from "../config/policies.js";
import { recordPolicyAcceptance } from "../services/policies.js";
import { createId } from "../utils/ids.js";
import { sendFail, sendOk } from "../utils/responses.js";

export const usersRouter = Router();

usersRouter.post(
  "/api/users",
  withSession(true),
  requireRole(["moderator", "admin"]),
  validate(
    z.object({
      userId: z.string().min(1),
      role: z.enum(["owner", "pen_tester", "moderator", "admin"]).optional(),
      status: z.enum(["active", "pending_review", "temporary", "suspended"]).optional(),
      name: z.string().min(1).max(120).optional(),
      email: z.string().email().optional(),
      title: z.string().max(160).optional(),
      company: z.string().max(160).optional(),
      password: z.string().min(8).max(128).optional(),
    }),
  ),
  async (req, res) => {
    const state = await readState();
    const user = state.users.find((item) => item.id === req.body.userId);
    if (!user) return sendFail(res, "That user could not be found.", 404);
    const nextEmail = req.body.email?.trim().toLowerCase();
    if (nextEmail && state.users.some((item) => item.id !== user.id && item.email.toLowerCase() === nextEmail)) {
      return sendFail(res, "Another account already uses that email.", 409);
    }
    if (req.user!.role === "moderator") {
      const allowed =
        user.role === "pen_tester" &&
        req.body.role == null &&
        ["active", "suspended"].includes(req.body.status);
      if (!allowed) return sendFail(res, "Moderators can only verify or suspend pen tester accounts.", 403);
    }
    const passwordHash = req.body.password ? await hashPassword(req.body.password) : undefined;
    state.users = state.users.map((item) =>
      item.id === user.id
        ? {
            ...item,
            name: req.body.name?.trim() || item.name,
            email: nextEmail || item.email,
            role: (req.body.role as UserRole | undefined) ?? item.role,
            status: (req.body.status as UserStatus | undefined) ?? item.status,
            title: req.body.title?.trim() || item.title,
            company: req.body.company?.trim() || item.company,
            passwordHint: passwordHash ? "Password changed by admin." : item.passwordHint,
            passwordHash: passwordHash ?? item.passwordHash,
          }
        : item,
    );
    await writeState(state);
    sendOk(res, state.users.find((item) => item.id === user.id)!, `${user.name}'s access was updated.`);
  },
);

usersRouter.post(
  "/api/researcher-accounts",
  validate(
    z.object({
      name: z.string().min(1).max(120),
      email: z.string().email(),
      company: z.string().max(160).optional(),
      password: z.string().min(8).max(128),
      policiesVersion: z.string().min(1),
      policiesAcknowledged: z.literal(true),
    }),
  ),
  async (_req, res) => {
    sendFail(
      res,
      "Pen tester account requests are not available. Owners may contact Oasis CI for remediation assistance using the address configured by your administrator.",
      403,
    );
  },
);

usersRouter.post(
  "/api/users/delete",
  withSession(true),
  requireRole(["admin"]),
  validate(z.object({ userId: z.string().min(1) })),
  async (req, res) => {
    const state = await readState();
    const user = state.users.find((item) => item.id === req.body.userId);
    if (!user) return sendFail(res, "That user could not be found.", 404);
    if (user.id === req.user!.id) return sendFail(res, "Admins cannot delete their own signed-in account.", 400);

    state.domains = state.domains.map((domain) =>
      domain.ownerUserId === user.id
        ? { ...domain, ownerUserId: undefined, verificationStatus: "unclaimed", ownerAccessExpiresAt: undefined }
        : domain,
    );
    state.exposures = state.exposures.map((exposure) =>
      exposure.submittedBy === user.id ? { ...exposure, submittedBy: undefined } : exposure,
    );
    state.submissions = state.submissions.filter((submission) => submission.submittedBy !== user.id);
    state.flags = state.flags.filter((flag) => flag.createdBy !== user.id);
    state.users = state.users.filter((item) => item.id !== user.id);
    state.auditLog = [
      createAuditEvent(req.user!.name, "User deleted", user.email, "Admin removed account access."),
      ...state.auditLog,
    ];
    await writeState(state);
    sendOk(res, { id: user.id }, `${user.name} was deleted.`);
  },
);

usersRouter.post(
  "/api/moderators",
  withSession(true),
  requireRole(["admin"]),
  validate(
    z.object({
      name: z.string().min(1).max(120),
      email: z.string().email(),
      title: z.string().max(160).optional(),
      password: z.string().min(8).max(128).optional(),
    }),
  ),
  async (req, res) => {
    const state = await readState();
    const email = req.body.email.trim().toLowerCase();
    if (state.users.some((user) => user.email.toLowerCase() === email)) {
      return sendFail(res, "An account with that email already exists.", 409);
    }
    const password = req.body.password ?? createRandomPassword();
    const user: User = {
      id: createId("user"),
      name: req.body.name.trim(),
      email,
      role: "moderator",
      status: "active",
      title: req.body.title?.trim() || "Platform Moderator",
      company: "Oasis CI",
      verifiedDomains: [],
      passwordHint: req.body.password ? "Created by an admin." : `Temporary password: ${password}`,
      passwordHash: await hashPassword(password),
    };
    state.users = [user, ...state.users];
    state.auditLog = [
      createAuditEvent(req.user!.name, "Moderator created", user.email, "Admin created moderator access."),
      ...state.auditLog,
    ];
    await writeState(state);
    sendOk(res, { ...user, passwordHash: undefined }, `${user.name} can now sign in as a moderator.`);
  },
);
