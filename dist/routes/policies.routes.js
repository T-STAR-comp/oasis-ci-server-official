import { Router } from "express";
import { z } from "zod";
import { CURRENT_POLICIES_VERSION, POLICIES_EFFECTIVE_DATE, POLICIES_TITLE, } from "../config/policies.js";
import { readState, writeState } from "../database/stateStore.js";
import { withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { createAuditEvent } from "../services/audit.js";
import { recordPolicyAcceptance } from "../services/policies.js";
import { sendFail, sendOk } from "../utils/responses.js";
export const policiesRouter = Router();
policiesRouter.get("/api/policies", (_req, res) => {
    sendOk(res, {
        version: CURRENT_POLICIES_VERSION,
        effectiveDate: POLICIES_EFFECTIVE_DATE,
        title: POLICIES_TITLE,
        operator: "Oasis Tech Capital LLC",
    });
});
policiesRouter.post("/api/policies/accept", withSession(true), validate(z.object({
    version: z.string().min(1),
    acknowledged: z.literal(true),
})), async (req, res) => {
    if (!req.user)
        return sendFail(res, "You must be signed in to accept policies.", 401);
    if (req.body.version !== CURRENT_POLICIES_VERSION) {
        return sendFail(res, "These policies have been updated. Refresh the page and review the current version before accepting.", 409);
    }
    const state = await readState();
    const user = state.users.find((item) => item.id === req.user.id);
    if (!user)
        return sendFail(res, "Your account could not be found.", 404);
    const updated = recordPolicyAcceptance(user);
    state.users = state.users.map((item) => (item.id === user.id ? updated : item));
    state.auditLog = [
        createAuditEvent(updated.name, "Policies accepted", CURRENT_POLICIES_VERSION, "User agreed to Oasis CI platform policies."),
        ...state.auditLog,
    ];
    await writeState(state);
    sendOk(res, { user: { ...updated, passwordHash: undefined }, csrfToken: req.sessionRecord?.csrfToken }, "Policy acceptance recorded.");
});
