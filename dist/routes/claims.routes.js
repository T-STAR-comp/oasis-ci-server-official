import { Router } from "express";
import { z } from "zod";
import { readState, writeState } from "../database/stateStore.js";
import { withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { sessions, setSessionCookie } from "../security/sessions.js";
import { createAuditEvent } from "../services/audit.js";
import { buildClaimlessDomain, isDomainClaimedByAnother, upsertVerifiedDomain, } from "../services/domains.js";
import { hashPassword } from "../security/passwords.js";
import { sendClaimVerificationEmail } from "../services/email.js";
import { createVerificationCode } from "../services/verificationCodes.js";
import { parseDomain } from "../utils/domains.js";
import { CURRENT_POLICIES_VERSION } from "../config/policies.js";
import { recordPolicyAcceptance } from "../services/policies.js";
import { createId } from "../utils/ids.js";
import { sendFail, sendOk } from "../utils/responses.js";
export const claimsRouter = Router();
claimsRouter.post("/api/claims", withSession(false), validate(z.object({
    domain: z.string().min(1).max(255),
    method: z.enum(["email"]),
    contact: z.string().min(3).max(255),
    id: z.string().min(1).optional(),
    token: z.string().min(1).optional(),
})), async (req, res) => {
    const state = await readState();
    const domain = parseDomain(req.body.domain);
    if (isDomainClaimedByAnother(state.domains, domain, req.user?.id ?? null)) {
        return sendFail(res, "This domain has already been claimed by a verified owner.", 409);
    }
    if (!state.domains.some((entry) => entry.domain === domain)) {
        state.domains = [buildClaimlessDomain(domain), ...state.domains];
    }
    const domainRecord = state.domains.find((entry) => entry.domain === domain);
    const exposureForDomain = state.exposures.find((entry) => entry.domain === domain);
    const requiredEmail = (exposureForDomain?.companyContactEmail ||
        domainRecord?.contactEmail ||
        `security@${domain}`)
        .trim()
        .toLowerCase();
    const submittedContact = req.body.contact.trim().toLowerCase();
    if (submittedContact !== requiredEmail) {
        return sendFail(res, `Verification codes are only sent to the registered contact: ${requiredEmail}`, 400);
    }
    const claim = {
        id: req.body.id ?? createId("claim"),
        domain,
        method: "email",
        contact: requiredEmail,
        token: req.body.token ?? createVerificationCode(),
        status: "token_sent",
        requestedAt: new Date().toISOString(),
        recommendedEmail: domainRecord?.contactEmail ?? `security@${domain}`,
        recommendedPhone: domainRecord?.contactPhone ?? "+1 555 010 0000",
    };
    state.claims = [claim, ...state.claims];
    state.auditLog = [
        createAuditEvent(req.user?.name ?? "Visitor", "Ownership claim started", domain, `Verification token prepared via ${claim.method}.`),
        ...state.auditLog,
    ];
    await writeState(state);
    try {
        await sendClaimVerificationEmail({ to: claim.contact, domain, token: claim.token });
        sendOk(res, claim, "Claim verification code issued.");
    }
    catch (error) {
        console.error("Claim email delivery failed; continuing with issued token.", error);
        console.warn(`Claim code for ${domain} (${claim.contact}): ${claim.token}`);
        sendOk(res, claim, "Claim started, but email delivery failed. Use the server log verification code and fix SMTP settings.");
    }
});
claimsRouter.post("/api/claims/verify", withSession(false), validate(z.object({
    claimId: z.string().min(1),
    token: z.string().min(1),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
    name: z.string().min(1).max(120).optional(),
    policiesVersion: z.string().min(1),
    policiesAcknowledged: z.literal(true),
})), async (req, res) => {
    if (req.body.policiesVersion !== CURRENT_POLICIES_VERSION) {
        return sendFail(res, "Accept the current Oasis CI policies before completing your claim.", 400);
    }
    const state = await readState();
    const claim = state.claims.find((item) => item.id === req.body.claimId);
    if (!claim)
        return sendFail(res, "That claim request was not found.", 404);
    if (claim.status === "verified") {
        return sendFail(res, "This claim has already been completed.", 400);
    }
    if (claim.token.trim() !== req.body.token.trim()) {
        return sendFail(res, "The verification token does not match.", 400);
    }
    if (req.body.password !== req.body.confirmPassword) {
        return sendFail(res, "Password and confirmation must match.", 400);
    }
    if (isDomainClaimedByAnother(state.domains, claim.domain, req.user?.id ?? null)) {
        return sendFail(res, "This domain has already been claimed by a verified owner.", 409);
    }
    const ownerTarget = req.user && ["owner", "moderator", "admin"].includes(req.user.role)
        ? req.user.id
        : createId("owner");
    const ownerUserExists = state.users.some((user) => user.id === ownerTarget);
    const passwordHash = await hashPassword(req.body.password);
    const ownerEmail = claim.contact.trim().toLowerCase();
    const ownerName = req.body.name?.trim() || `${claim.domain} Owner`;
    state.domains = upsertVerifiedDomain(state.domains, claim.domain, ownerTarget, claim);
    if (!ownerUserExists) {
        const ownerAccount = recordPolicyAcceptance({
            id: ownerTarget,
            name: ownerName,
            email: ownerEmail,
            role: "owner",
            status: "active",
            title: "Verified Domain Owner",
            company: claim.domain.replace(/\..+$/, "").replace(/-/g, " "),
            verifiedDomains: [claim.domain],
            passwordHint: "Password set during domain ownership verification.",
            passwordHash,
        });
        state.users = [ownerAccount, ...state.users];
    }
    else {
        state.users = state.users.map((user) => user.id === ownerTarget
            ? recordPolicyAcceptance({
                ...user,
                name: ownerName || user.name,
                email: ownerEmail || user.email,
                status: "active",
                passwordHash,
                passwordHint: "Password set during domain ownership verification.",
                verifiedDomains: [...new Set([...user.verifiedDomains, claim.domain])],
            })
            : user);
    }
    state.claims = state.claims.map((item) => item.id === claim.id ? { ...item, status: "verified" } : item);
    state.currentUserId = ownerTarget;
    const sessionId = createId("sess");
    const csrfToken = createId("csrf");
    sessions.set(sessionId, { userId: ownerTarget, csrfToken, createdAt: Date.now() });
    setSessionCookie(res, sessionId);
    await writeState(state);
    sendOk(res, { user: state.users.find((user) => user.id === ownerTarget) ?? null, csrfToken }, `Ownership verified for ${claim.domain}.`);
});
