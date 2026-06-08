import { Router } from "express";
import { z } from "zod";
import {
  type Exposure,
  exposureCategoryValues,
  type ExposureCategory,
  type Severity,
  type Submission,
} from "../types/models.js";
import { readState, writeState } from "../database/stateStore.js";
import { requireRole, withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { createAuditEvent } from "../services/audit.js";
import { buildClaimlessDomain } from "../services/domains.js";
import { sendExposureNotificationEmail } from "../services/email.js";
import { parseDomain, redactDomain } from "../utils/domains.js";
import { createId } from "../utils/ids.js";
import { sendFail, sendOk } from "../utils/responses.js";

export const submissionsRouter = Router();

submissionsRouter.post(
  "/api/submissions",
  withSession(true),
  requireRole(["pen_tester", "moderator", "admin"]),
  validate(
    z.object({
      fullUrl: z
        .string()
        .min(1)
        .transform((value) => {
          const trimmed = value.trim();
          if (/^https?:\/\//i.test(trimmed)) return trimmed;
          return `https://${trimmed}`;
        })
        .pipe(z.string().url()),
      category: z.enum(exposureCategoryValues),
      severity: z.enum(["critical", "high", "medium", "low", "info"]),
      description: z.string().min(8).max(4000),
      proofOfConcept: z.string().min(8).max(4000),
    }),
  ),
  async (req, res) => {
    const state = await readState();
    const url = new URL(req.body.fullUrl);
    const domain = parseDomain(req.body.fullUrl);
    const domainRecord =
      state.domains.find((entry) => entry.domain === domain) ?? buildClaimlessDomain(domain);
    const timestamp = new Date().toISOString();
    const exposureId = createId("OAS");
    const path = `${url.pathname || "/"}${url.search}`;
    const exposure: Exposure = {
      id: exposureId,
      domain,
      redactedDomain: redactDomain(domain),
      companyName: domainRecord.companyName,
      sector: domainRecord.sector,
      category: req.body.category as ExposureCategory,
      severity: req.body.severity as Severity,
      description: req.body.description.trim(),
      publicPath: path,
      fullUrl: req.body.fullUrl.trim(),
      exactPath: path,
      snippet: req.body.proofOfConcept.trim(),
      evidenceSample: req.body.proofOfConcept.trim(),
      discoveredAt: timestamp,
      lastSeen: timestamp,
      loginTitle: req.body.proofOfConcept.split("\n")[0]?.trim() || undefined,
      companyContactEmail: domainRecord.contactEmail,
      companyContactPhone: domainRecord.contactPhone,
      remediationPrice: undefined,
      removalReviewStatus: "not_requested",
      submittedBy: req.user!.id,
      assignedTeam: "Moderator Queue",
      status: "pending_review",
      remediationStatus: "not_started",
      internalNote: "Submitted from the researcher workspace and awaiting review.",
      remediationRecommendation: "",
      history: [
        {
          id: createId("hist"),
          actor: req.user!.name,
          action: "Submitted for review",
          at: timestamp,
          note: "The moderator queue now contains this finding.",
        },
      ],
    };
    const submission: Submission = {
      id: createId("sub"),
      exposureId,
      domain,
      fullUrl: req.body.fullUrl,
      category: req.body.category,
      severity: req.body.severity,
      description: req.body.description.trim(),
      proofOfConcept: req.body.proofOfConcept.trim(),
      submittedBy: req.user!.id,
      createdAt: timestamp,
      status: "pending_review",
      moderatorNote: "",
    };

    if (!state.domains.some((entry) => entry.domain === domain)) state.domains = [domainRecord, ...state.domains];
    state.exposures = [exposure, ...state.exposures];
    state.submissions = [submission, ...state.submissions];
    state.auditLog = [
      createAuditEvent(req.user!.name, "Submission created", submission.id, `Queued finding for ${domain}.`),
      ...state.auditLog,
    ];
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
    sendOk(res, submission, `Finding submitted for review under ${exposureId}.`);
  },
);

submissionsRouter.post(
  "/api/submissions/review",
  withSession(true),
  requireRole(["moderator", "admin"]),
  validate(
    z.object({
      submissionId: z.string().min(1),
      decision: z.enum(["approve", "reject"]),
      moderatorNote: z.string().max(4000),
    }),
  ),
  async (req, res) => {
    const state = await readState();
    const submission = state.submissions.find((item) => item.id === req.body.submissionId);
    if (!submission) return sendFail(res, "The submission could not be found.", 404);
    const nextStatus = req.body.decision === "approve" ? "approved" : "rejected";

    state.submissions = state.submissions.map((item) =>
      item.id === submission.id ? { ...item, status: nextStatus, moderatorNote: req.body.moderatorNote } : item,
    );
    state.exposures = state.exposures.map((item) =>
      item.id === submission.exposureId
        ? {
            ...item,
            status: nextStatus === "approved" ? "approved" : "rejected",
            history: [
              {
                id: createId("hist"),
                actor: req.user!.name,
                action: nextStatus === "approved" ? "Approved for listing" : "Rejected during review",
                at: new Date().toISOString(),
                note: req.body.moderatorNote || "Moderator decision recorded.",
              },
              ...item.history,
            ],
          }
        : item,
    );
    await writeState(state);
    sendOk(res, state.submissions.find((item) => item.id === submission.id)!, "Submission review saved.");
  },
);
