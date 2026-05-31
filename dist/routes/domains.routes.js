import { Router } from "express";
import { z } from "zod";
import { readState, writeState } from "../database/stateStore.js";
import { requireRole, withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { parseDomain } from "../utils/domains.js";
import { sendFail, sendOk } from "../utils/responses.js";
export const domainsRouter = Router();
domainsRouter.post("/api/domains/remove", withSession(true), requireRole(["moderator", "admin"]), validate(z.object({ domain: z.string().min(1).max(255) })), async (req, res) => {
    const state = await readState();
    const domain = parseDomain(req.body.domain);
    const domainExposures = state.exposures.filter((item) => item.domain === domain);
    if (domainExposures.length === 0)
        return sendFail(res, "No exposures were found for that domain.", 404);
    if (!domainExposures.every((item) => item.removalReviewStatus === "verified_removed")) {
        return sendFail(res, "Each flaw must be verified by a moderator before the domain can be removed from the directory.", 400);
    }
    const ownerId = state.domains.find((item) => item.domain === domain)?.ownerUserId;
    state.domains = state.domains.map((item) => item.domain === domain
        ? { ...item, verificationStatus: "unclaimed", ownerUserId: undefined, ownerAccessExpiresAt: undefined }
        : item);
    if (ownerId && state.users.find((user) => user.id === ownerId)?.status === "temporary") {
        state.users = state.users.filter((user) => user.id !== ownerId);
    }
    await writeState(state);
    sendOk(res, { domain }, `${domain} was removed from public exposures after moderator verification.`);
});
