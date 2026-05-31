import { Router } from "express";
import { z } from "zod";
import { readState, writeState } from "../database/stateStore.js";
import { requireRole, withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { createAuditEvent } from "../services/audit.js";
import { updatePlatformSettings } from "../services/platformSettings.js";
import { sendOk } from "../utils/responses.js";

export const adminRouter = Router();

adminRouter.post(
  "/api/admin/platform-settings",
  withSession(true),
  requireRole(["admin"]),
  validate(
    z.object({
      remediationEmail: z.string().email(),
      remediationPhone: z.string().max(64).optional(),
    }),
  ),
  async (req, res) => {
    const platform = await updatePlatformSettings({
      remediationEmail: req.body.remediationEmail,
      remediationPhone: req.body.remediationPhone,
    });
    const state = await readState();
    state.auditLog = [
      createAuditEvent(
        req.user!.name,
        "Platform remediation contact updated",
        platform.remediationEmail,
        "Owners use this address to request Oasis CI remediation assistance.",
      ),
      ...state.auditLog,
    ];
    await writeState(state);
    sendOk(res, platform, "Remediation contact updated for the platform.");
  },
);

adminRouter.post("/api/admin/reset", withSession(true), requireRole(["admin"]), async (_req, res) => {
  const current = await readState();
  const cleared = {
    ...current,
    currentUserId: null,
    publicSearch: "",
    domains: [],
    exposures: [],
    submissions: [],
    flags: [],
    claims: [],
    auditLog: [],
    analytics: [],
  };
  await writeState(cleared);
  sendOk(res, cleared, "Platform data cleared.");
});
