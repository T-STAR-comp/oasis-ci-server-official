import { Router } from "express";
import { z } from "zod";
import { readState, writeState } from "../database/stateStore.js";
import { withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { createUserSession, destroyUserSession } from "../security/sessions.js";
import { hashPassword, verifyPassword } from "../security/passwords.js";
import { createAuditEvent } from "../services/audit.js";
import { sendFail, sendOk } from "../utils/responses.js";

export const authRouter = Router();

authRouter.post(
  "/api/auth/sign-in",
  validate(z.object({ email: z.string().email(), password: z.string().min(1) })),
  async (req, res) => {
    const state = await readState();
    const email = req.body.email.trim().toLowerCase();
    const user = state.users.find((item) => item.email.toLowerCase() === email);
    const bootstrapEmail = (process.env.BOOTSTRAP_ADMIN_EMAIL ?? "admin@oasis.local").trim().toLowerCase();
    const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();

    if (!user) return sendFail(res, "No account matches that email.", 404);
    let passwordIsValid = await verifyPassword(req.body.password, user.passwordHash);
    const usingLegacyPlaintext = Boolean(user.passwordHash) && !String(user.passwordHash).startsWith("scrypt:");

    if (!passwordIsValid && !user.passwordHash && user.role === "admin" && email === bootstrapEmail) {
      if (bootstrapPassword && req.body.password === bootstrapPassword) {
        user.passwordHash = await hashPassword(bootstrapPassword);
        user.passwordHint = "Password initialized from BOOTSTRAP_ADMIN_PASSWORD during sign-in.";
        state.users = state.users.map((item) => (item.id === user.id ? user : item));
        await writeState(state);
        passwordIsValid = true;
        console.warn("[auth:sign-in] Bootstrap admin password hash initialized on first sign-in.");
      }
    }

    if (!passwordIsValid) {
      if (!user.passwordHash) {
        return sendFail(
          res,
          "This account has no password set yet. Set BOOTSTRAP_ADMIN_PASSWORD and sign in with it once.",
          401,
        );
      }
      return sendFail(res, "The email or password is incorrect.", 401);
    }

    // Migrate very old plaintext password rows to scrypt on successful sign-in.
    if (usingLegacyPlaintext) {
      user.passwordHash = await hashPassword(req.body.password);
      user.passwordHint = "Password upgraded to scrypt during sign-in.";
      state.users = state.users.map((item) => (item.id === user.id ? user : item));
      await writeState(state);
      console.warn("[auth:sign-in] Migrated legacy plaintext password hash.", { userId: user.id });
    }
    if (user.status === "pending_review" || user.status === "suspended") {
      return sendFail(
        res,
        user.status === "pending_review"
          ? "That account is waiting for moderator verification."
          : "That account is suspended.",
        403,
      );
    }

    const { csrfToken } = await createUserSession(res, user.id);

    state.currentUserId = user.id;
    state.auditLog = [
      createAuditEvent(user.name, "Signed in", user.role, `Opened the ${user.role} workspace.`),
      ...state.auditLog,
    ];
    await writeState(state);

    sendOk(res, { user: { ...user, passwordHash: undefined }, csrfToken }, `Signed in as ${user.name}.`);
  },
);

authRouter.post(
  "/api/auth/profile",
  withSession(true),
  validate(
    z.object({
      name: z.string().min(1).max(120).optional(),
      email: z.string().email().optional(),
      title: z.string().max(160).optional(),
      company: z.string().max(160).optional(),
      currentPassword: z.string().optional(),
      newPassword: z.string().min(8).max(128).optional(),
    }),
  ),
  async (req, res) => {
    if (!req.user) return sendFail(res, "You must be signed in.", 401);
    const state = await readState();
    const user = state.users.find((item) => item.id === req.user!.id);
    if (!user) return sendFail(res, "Your account could not be found.", 404);

    const nextEmail = req.body.email?.trim().toLowerCase();
    if (nextEmail && state.users.some((item) => item.id !== user.id && item.email.toLowerCase() === nextEmail)) {
      return sendFail(res, "Another account already uses that email.", 409);
    }

    let passwordHash = user.passwordHash;
    let passwordHint = user.passwordHint;
    if (req.body.newPassword) {
      if (!(await verifyPassword(req.body.currentPassword ?? "", user.passwordHash))) {
        return sendFail(res, "Enter the current password before changing credentials.", 403);
      }
      passwordHash = await hashPassword(req.body.newPassword);
      passwordHint = "Password changed by account owner.";
    }

    const updated = {
      ...user,
      name: req.body.name?.trim() || user.name,
      email: nextEmail || user.email,
      title: req.body.title?.trim() || user.title,
      company: req.body.company?.trim() || user.company,
      passwordHint,
      passwordHash,
    };
    state.users = state.users.map((item) => (item.id === user.id ? updated : item));
    state.auditLog = [
      createAuditEvent(updated.name, "Account credentials updated", updated.email, "Profile settings changed."),
      ...state.auditLog,
    ];
    await writeState(state);
    sendOk(res, { user: { ...updated, passwordHash: undefined }, csrfToken: req.sessionRecord?.csrfToken }, "Account updated.");
  },
);

authRouter.post("/api/auth/sign-out", withSession(false), async (req, res) => {
  const sessionId =
    typeof req.signedCookies.oasis_sid === "string" ? req.signedCookies.oasis_sid : undefined;
  await destroyUserSession(res, sessionId);

  const state = await readState();
  state.currentUserId = null;
  await writeState(state);

  sendOk(res, { user: null });
});
