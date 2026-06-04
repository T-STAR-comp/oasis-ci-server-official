import { Router } from "express";
import { z } from "zod";
import { readState, writeState } from "../database/stateStore.js";
import { requireRole, withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { createAuditEvent } from "../services/audit.js";
import { buildClaimlessDomain, ownsDomain } from "../services/domains.js";
import { sendExposureNotificationEmail, sendOwnerFixDeniedEmail, sendOwnerFixVerifiedEmail, } from "../services/email.js";
import { notifyDomainOwner } from "../services/notifications.js";
import { hasAdminExposureFields, updateExposureRecord } from "../services/exposures.js";
import { exposureForUser } from "../services/privacy.js";
import { parseDomain, redactDomain } from "../utils/domains.js";
import { createId } from "../utils/ids.js";
import { sendFail, sendOk } from "../utils/responses.js";
export const exposuresRouter = Router();
exposuresRouter.get("/api/exposures/:id", withSession(false), async (req, res) => {
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === req.params.id);
    if (!exposure) {
        return sendFail(res, "The selected exposure could not be found.", 404);
    }
    sendOk(res, exposureForUser(exposure, req.user, state));
});
const exposureSchema = z.object({
    exposureId: z.string().min(1).optional(),
    remediationStatus: z.enum(["not_started", "in_progress", "fixed"]).optional(),
    status: z.enum(["approved", "pending_review", "rejected", "fixed", "archived"]).optional(),
    internalNote: z.string().max(4000).optional(),
    removalReviewStatus: z.enum(["not_requested", "requested", "verified_removed"]).optional(),
    domain: z.string().optional(),
    companyName: z.string().optional(),
    sector: z.string().optional(),
    category: z.enum(["sensitive_data", "open_directory", "admin_panel", "backup_config"]).optional(),
    severity: z.enum(["critical", "high", "medium", "low", "info"]).optional(),
    description: z.string().optional(),
    fullUrl: z
        .string()
        .min(1)
        .transform((value) => {
        const trimmed = value.trim();
        if (/^https?:\/\//i.test(trimmed))
            return trimmed;
        return `https://${trimmed}`;
    })
        .pipe(z.string().url())
        .optional(),
    snippet: z.string().optional(),
    evidenceSample: z.string().optional(),
    assignedTeam: z.string().optional(),
    companyContactEmail: z.string().optional(),
    companyContactPhone: z.string().optional(),
    remediationPrice: z.coerce.number().optional(),
    fileCount: z.coerce.number().optional(),
    loginTitle: z.string().optional(),
    remediationRecommendation: z.string().max(8000).optional(),
});
exposuresRouter.post("/api/exposures", withSession(true), requireRole(["owner", "moderator", "admin"]), validate(exposureSchema), async (req, res) => {
    const input = req.body;
    if (input.exposureId && req.user?.role === "admin" && hasAdminExposureFields(input)) {
        return editExposure(req, res);
    }
    if (input.fullUrl && req.user?.role === "admin") {
        return createExposure(req, res);
    }
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === input.exposureId);
    if (!exposure)
        return sendFail(res, "The selected exposure could not be found.", 404);
    if (req.user?.role === "owner" && !ownsDomain(req.user, state, exposure.domain)) {
        return sendFail(res, "Owners can only update their verified domains.", 403);
    }
    if (req.user?.role === "owner" && exposure.removalReviewStatus === "verified_removed") {
        return sendFail(res, "This exposure was verified by a moderator. Contact Oasis CI to request a reversal before editing.", 403);
    }
    const updatedBase = updateExposureRecord(exposure, req.user, {
        remediationStatus: input.remediationStatus,
        status: input.status,
        internalNote: input.internalNote,
    });
    const ownerRequestedRemoval = req.user?.role === "owner" &&
        input.remediationStatus === "fixed" &&
        exposure.removalReviewStatus !== "verified_removed";
    const moderatorOverrideRemoval = (req.user?.role === "moderator" || req.user?.role === "admin") && input.removalReviewStatus != null;
    const updated = {
        ...updatedBase,
        removalReviewStatus: ownerRequestedRemoval
            ? "requested"
            : moderatorOverrideRemoval
                ? input.removalReviewStatus
                : updatedBase.removalReviewStatus,
    };
    state.exposures = state.exposures.map((item) => (item.id === exposure.id ? updated : item));
    state.auditLog = [
        createAuditEvent(req.user.name, "Exposure updated", exposure.id, "Server-side update recorded."),
        ...state.auditLog,
    ];
    await writeState(state);
    sendOk(res, updated, `${exposure.id} was updated.`);
});
exposuresRouter.post("/api/exposures/:id/verify-removal", withSession(true), requireRole(["moderator", "admin"]), async (req, res) => {
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === req.params.id);
    if (!exposure)
        return sendFail(res, "The requested exposure was not found.", 404);
    if (exposure.remediationStatus !== "fixed") {
        return sendFail(res, "The owner must mark this issue fixed before verification.", 400);
    }
    const timestamp = new Date().toISOString();
    const updated = {
        ...exposure,
        status: "archived",
        removalReviewStatus: "verified_removed",
        history: [
            {
                id: createId("hist"),
                actor: req.user.name,
                action: "Fix verified",
                at: timestamp,
                note: "Moderator verified that this flaw is no longer observable.",
            },
            ...exposure.history,
        ],
    };
    state.exposures = state.exposures.map((item) => (item.id === exposure.id ? updated : item));
    const ownerBeforeUnclaim = state.domains.find((item) => item.domain === exposure.domain)?.ownerUserId;
    const ownerUserBeforeUnclaim = ownerBeforeUnclaim
        ? state.users.find((user) => user.id === ownerBeforeUnclaim)
        : undefined;
    // If every exposure for the domain is now verified removed, unclaim the domain.
    const remaining = state.exposures.filter((item) => item.domain === exposure.domain);
    const allVerified = remaining.every((item) => item.id === updated.id ? updated.removalReviewStatus === "verified_removed" : item.removalReviewStatus === "verified_removed");
    if (allVerified) {
        const ownerId = state.domains.find((item) => item.domain === exposure.domain)?.ownerUserId;
        state.domains = state.domains.map((item) => item.domain === exposure.domain
            ? { ...item, verificationStatus: "unclaimed", ownerUserId: undefined, ownerAccessExpiresAt: undefined }
            : item);
        if (ownerId) {
            const owner = state.users.find((user) => user.id === ownerId);
            const isTemporary = owner?.status === "temporary";
            const stillOwnsAny = state.domains.some((d) => d.ownerUserId === ownerId && d.verificationStatus === "verified");
            if (isTemporary && !stillOwnsAny) {
                state.users = state.users.filter((user) => user.id !== ownerId);
            }
        }
    }
    if (ownerUserBeforeUnclaim?.email) {
        await sendOwnerFixVerifiedEmail({
            to: ownerUserBeforeUnclaim.email,
            ownerName: ownerUserBeforeUnclaim.name,
            domain: exposure.domain,
            exposureId: exposure.id,
        });
    }
    notifyDomainOwner(state, exposure.domain, {
        type: "fix_verified",
        title: "Fix verified",
        message: `Your fix for ${exposure.id} on ${exposure.domain} was verified. This exposure is now locked until a moderator reverses the decision.`,
        exposureId: exposure.id,
    });
    await writeState(state);
    sendOk(res, updated, `Exposure ${updated.id} verified and archived.`);
});
exposuresRouter.post("/api/exposures/:id/deny-fix", withSession(true), requireRole(["moderator", "admin"]), validate(z.object({ moderatorNote: z.string().max(4000).optional() })), async (req, res) => {
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === req.params.id);
    if (!exposure)
        return sendFail(res, "The requested exposure was not found.", 404);
    if (exposure.remediationStatus !== "fixed" && exposure.removalReviewStatus !== "requested") {
        return sendFail(res, "Only owner-reported fixes awaiting review can be denied.", 400);
    }
    const timestamp = new Date().toISOString();
    const note = req.body.moderatorNote?.trim() || "Moderator declined the fix verification.";
    const updated = {
        ...exposure,
        status: "approved",
        remediationStatus: "in_progress",
        removalReviewStatus: "not_requested",
        history: [
            {
                id: createId("hist"),
                actor: req.user.name,
                action: "Fix denied by moderator",
                at: timestamp,
                note,
            },
            ...exposure.history,
        ],
    };
    state.exposures = state.exposures.map((item) => (item.id === exposure.id ? updated : item));
    state.auditLog = [
        createAuditEvent(req.user.name, "Fix denied", exposure.id, note),
        ...state.auditLog,
    ];
    const domainRecord = state.domains.find((item) => item.domain === exposure.domain);
    const ownerId = domainRecord?.ownerUserId;
    const owner = ownerId ? state.users.find((user) => user.id === ownerId) : undefined;
    if (owner?.email) {
        await sendOwnerFixDeniedEmail({
            to: owner.email,
            ownerName: owner.name,
            domain: exposure.domain,
            exposureId: exposure.id,
            moderatorNote: note,
        });
    }
    notifyDomainOwner(state, exposure.domain, {
        type: "fix_denied",
        title: "Fix review declined",
        message: `A moderator declined your fix verification for ${exposure.id}. Remediation is back in progress. ${note}`,
        exposureId: exposure.id,
    });
    await writeState(state);
    sendOk(res, updated, `Fix declined for ${exposure.id}. Owner notified and status set to in progress.`);
});
exposuresRouter.post("/api/exposures/:id/reverse-verification", withSession(true), requireRole(["moderator", "admin"]), validate(z.object({ moderatorNote: z.string().max(4000).optional() })), async (req, res) => {
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === req.params.id);
    if (!exposure)
        return sendFail(res, "The requested exposure was not found.", 404);
    if (exposure.removalReviewStatus !== "verified_removed") {
        return sendFail(res, "Only verified removals can be reversed.", 400);
    }
    const timestamp = new Date().toISOString();
    const note = req.body.moderatorNote?.trim() || "Moderator reversed verification so the owner can continue work.";
    const updated = {
        ...exposure,
        status: "approved",
        remediationStatus: "in_progress",
        removalReviewStatus: "not_requested",
        history: [
            {
                id: createId("hist"),
                actor: req.user.name,
                action: "Verification reversed",
                at: timestamp,
                note,
            },
            ...exposure.history,
        ],
    };
    state.exposures = state.exposures.map((item) => (item.id === exposure.id ? updated : item));
    state.auditLog = [
        createAuditEvent(req.user.name, "Verification reversed", exposure.id, note),
        ...state.auditLog,
    ];
    notifyDomainOwner(state, exposure.domain, {
        type: "fix_reversed",
        title: "Verification reversed",
        message: `A moderator reversed verification for ${exposure.id}. You may update remediation status again.`,
        exposureId: exposure.id,
    });
    await writeState(state);
    sendOk(res, updated, `Verification reversed for ${exposure.id}. Owner may edit again.`);
});
exposuresRouter.post("/api/exposures/:id/rescan", withSession(true), requireRole(["owner", "pen_tester", "moderator", "admin"]), async (req, res) => {
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === req.params.id);
    if (!exposure)
        return sendFail(res, "The requested exposure was not found.", 404);
    if (req.user?.role === "owner" && !ownsDomain(req.user, state, exposure.domain)) {
        return sendFail(res, "Owners can only rescan verified domains.", 403);
    }
    if (req.user?.role === "owner" && exposure.removalReviewStatus === "verified_removed") {
        return sendFail(res, "This exposure is locked after moderator verification.", 403);
    }
    const timestamp = new Date().toISOString();
    const updated = {
        ...exposure,
        lastSeen: timestamp,
        history: [
            {
                id: createId("hist"),
                actor: req.user.name,
                action: "Re-scan requested",
                at: timestamp,
                note: "A fresh verification cycle was queued from the API.",
            },
            ...exposure.history,
        ],
    };
    state.exposures = state.exposures.map((item) => (item.id === exposure.id ? updated : item));
    await writeState(state);
    sendOk(res, updated, `A new scan was queued for ${exposure.domain}.`);
});
exposuresRouter.post("/api/exposures/:id/delete", withSession(true), requireRole(["admin"]), async (req, res) => {
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === req.params.id);
    if (!exposure)
        return sendFail(res, "The requested exposure was not found.", 404);
    state.exposures = state.exposures.filter((item) => item.id !== exposure.id);
    state.submissions = state.submissions.filter((item) => item.exposureId !== exposure.id);
    state.flags = state.flags.filter((item) => item.exposureId !== exposure.id);
    state.auditLog = [
        createAuditEvent(req.user.name, "Exposure deleted", exposure.id, `Removed ${exposure.domain} exposure.`),
        ...state.auditLog,
    ];
    await writeState(state);
    sendOk(res, { id: exposure.id }, `${exposure.id} was deleted.`);
});
async function editExposure(req, res) {
    const state = await readState();
    const input = req.body;
    const exposure = state.exposures.find((item) => item.id === input.exposureId);
    if (!exposure)
        return sendFail(res, "That exposure could not be found.", 404);
    const parsedUrl = input.fullUrl ? new URL(input.fullUrl) : null;
    const path = parsedUrl ? `${parsedUrl.pathname || "/"}${parsedUrl.search}` : exposure.exactPath;
    const updated = {
        ...exposure,
        companyName: input.companyName?.trim() || exposure.companyName,
        sector: input.sector?.trim() || exposure.sector,
        category: input.category ?? exposure.category,
        severity: input.severity ?? exposure.severity,
        status: input.status ?? exposure.status,
        remediationStatus: input.remediationStatus ?? exposure.remediationStatus,
        description: input.description?.trim() || exposure.description,
        fullUrl: input.fullUrl?.trim() || exposure.fullUrl,
        publicPath: path,
        exactPath: path,
        snippet: input.snippet?.trim() || exposure.snippet,
        evidenceSample: input.evidenceSample?.trim() || exposure.evidenceSample,
        internalNote: input.internalNote?.trim() || exposure.internalNote,
        assignedTeam: input.assignedTeam?.trim() || exposure.assignedTeam,
        companyContactEmail: input.companyContactEmail?.trim() || exposure.companyContactEmail,
        companyContactPhone: input.companyContactPhone?.trim() || exposure.companyContactPhone,
        remediationPrice: input.remediationPrice ?? exposure.remediationPrice,
        fileCount: input.fileCount ?? exposure.fileCount,
        loginTitle: input.loginTitle?.trim() || exposure.loginTitle,
        remediationRecommendation: input.remediationRecommendation?.trim() ?? exposure.remediationRecommendation,
        history: [
            {
                id: createId("hist"),
                actor: req.user.name,
                action: "Exposure details edited",
                at: new Date().toISOString(),
                note: "Admin updated record details.",
            },
            ...exposure.history,
        ],
    };
    state.exposures = state.exposures.map((item) => (item.id === exposure.id ? updated : item));
    await writeState(state);
    sendOk(res, updated, `${exposure.id} was updated.`);
}
async function createExposure(req, res) {
    const state = await readState();
    const input = req.body;
    const parsedUrl = new URL(input.fullUrl);
    const domain = parseDomain(input.domain || parsedUrl.hostname);
    const existingDomain = state.domains.find((entry) => entry.domain === domain);
    const domainRecord = existingDomain ?? {
        ...buildClaimlessDomain(domain),
        companyName: input.companyName?.trim() || domain.replace(/\..+$/, "").replace(/-/g, " "),
        sector: input.sector?.trim() || "Admin entry",
        contactEmail: input.companyContactEmail?.trim() || `security@${domain}`,
        contactPhone: input.companyContactPhone?.trim() || "+1 555 010 0000",
        tags: ["admin-created"],
    };
    const timestamp = new Date().toISOString();
    const path = `${parsedUrl.pathname || "/"}${parsedUrl.search}`;
    const exposure = {
        id: createId("OAS"),
        domain,
        redactedDomain: redactDomain(domain),
        companyName: input.companyName?.trim() || domainRecord.companyName,
        sector: input.sector?.trim() || domainRecord.sector,
        category: input.category,
        severity: input.severity,
        description: input.description?.trim() || "Admin-created exposure.",
        publicPath: path,
        fullUrl: input.fullUrl.trim(),
        exactPath: path,
        snippet: input.snippet?.trim() || "",
        evidenceSample: input.evidenceSample?.trim() || "",
        discoveredAt: timestamp,
        lastSeen: timestamp,
        fileCount: input.fileCount,
        loginTitle: input.loginTitle?.trim() || undefined,
        companyContactEmail: input.companyContactEmail?.trim() || domainRecord.contactEmail,
        companyContactPhone: input.companyContactPhone?.trim() || domainRecord.contactPhone,
        remediationPrice: input.remediationPrice,
        removalReviewStatus: "not_requested",
        assignedTeam: input.assignedTeam?.trim() || "Admin Review",
        status: input.status,
        remediationStatus: input.remediationStatus,
        internalNote: input.internalNote?.trim() || "Created by an admin.",
        remediationRecommendation: input.remediationRecommendation?.trim() || "",
        history: [
            {
                id: createId("hist"),
                actor: req.user.name,
                action: "Exposure created",
                at: timestamp,
                note: "Created manually from the admin workspace.",
            },
        ],
    };
    if (!existingDomain)
        state.domains = [domainRecord, ...state.domains];
    state.exposures = [exposure, ...state.exposures];
    await writeState(state);
    await sendExposureNotificationEmail({
        to: exposure.companyContactEmail,
        companyName: exposure.companyName,
        domain: exposure.domain,
        exposureId: exposure.id,
        category: exposure.category,
        severity: exposure.severity,
        fullUrl: exposure.fullUrl,
        description: exposure.description,
    });
    sendOk(res, exposure, `${exposure.id} was added for ${domain}.`);
}
