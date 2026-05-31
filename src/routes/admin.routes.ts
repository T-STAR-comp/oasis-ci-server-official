import { Router } from "express";
import { readState, writeState } from "../database/stateStore.js";
import { requireRole, withSession } from "../middleware/session.js";
import { sendOk } from "../utils/responses.js";

export const adminRouter = Router();

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
