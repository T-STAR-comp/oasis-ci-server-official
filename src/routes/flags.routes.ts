import { Router } from "express";
import { z } from "zod";
import type { FlagStatus, ReviewFlag } from "../types/models.js";
import { readState, writeState } from "../database/stateStore.js";
import { requireRole, withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { createAuditEvent } from "../services/audit.js";
import { notifyModeratorsAndAdmins, pushUserNotification } from "../services/notifications.js";
import { createId } from "../utils/ids.js";
import { sendFail, sendOk } from "../utils/responses.js";

export const flagsRouter = Router();

flagsRouter.post(
  "/api/flags",
  withSession(true),
  requireRole(["owner", "pen_tester", "moderator", "admin"]),
  validate(
    z.object({
      exposureId: z.string().min(1),
      reason: z.string().min(10).max(2000),
      flagType: z.enum(["false_positive", "review_request", "escalation"]).optional(),
      title: z.string().min(3).max(200).optional(),
    }),
  ),
  async (req, res) => {
    const state = await readState();
    const exposure = state.exposures.find((item) => item.id === req.body.exposureId);
    if (!exposure) return sendFail(res, "The selected exposure was not found.", 404);

    const flagType = req.body.flagType ?? "review_request";
    const title =
      req.body.title?.trim() ||
      (flagType === "false_positive"
        ? "False positive report"
        : flagType === "escalation"
          ? "Escalation to moderators"
          : "Moderator review requested");

    const flag: ReviewFlag = {
      id: createId("flag"),
      exposureId: exposure.id,
      createdBy: req.user!.id,
      reason: req.body.reason.trim(),
      status: "open",
      createdAt: new Date().toISOString(),
      domain: exposure.domain,
      exposureTitle: exposure.loginTitle || exposure.companyName,
      category: exposure.category,
      severity: exposure.severity,
      exposureListingStatus: exposure.status,
      exposureRemediationStatus: exposure.remediationStatus,
      reporterName: req.user!.name,
      reporterRole: req.user!.role,
      flagType,
      title,
    };

    state.flags = [flag, ...state.flags];
    state.auditLog = [
      createAuditEvent(
        req.user!.name,
        "Flag filed",
        exposure.id,
        `${title} on ${exposure.domain}`,
      ),
      ...state.auditLog,
    ];

    notifyModeratorsAndAdmins(state, {
      type: "flag_update",
      title: `New flag: ${exposure.domain}`,
      message: `${req.user!.name} (${req.user!.role}) filed “${title}”. ${req.body.reason.trim().slice(0, 180)}`,
      exposureId: exposure.id,
      domain: exposure.domain,
    });

    await writeState(state);
    sendOk(res, flag, "The flag has been added to the moderator queue.");
  },
);

flagsRouter.post(
  "/api/flags/resolve",
  withSession(true),
  requireRole(["moderator", "admin"]),
  validate(z.object({ flagId: z.string().min(1), status: z.enum(["open", "resolved", "dismissed"]) })),
  async (req, res) => {
    const state = await readState();
    const flag = state.flags.find((item) => item.id === req.body.flagId);
    if (!flag) return sendFail(res, "The selected flag was not found.", 404);
    state.flags = state.flags.map((item) =>
      item.id === flag.id ? { ...item, status: req.body.status as FlagStatus } : item,
    );

    const reporter = state.users.find((user) => user.id === flag.createdBy);
    if (reporter) {
      pushUserNotification(state, reporter.id, {
        type: "flag_update",
        title: `Flag ${req.body.status}`,
        message: `Your flag on ${flag.domain} (${flag.exposureId}) was marked ${req.body.status} by ${req.user!.name}.`,
        exposureId: flag.exposureId,
        domain: flag.domain,
      });
    }

    await writeState(state);
    sendOk(res, state.flags.find((item) => item.id === flag.id)!, `Flag ${flag.id} marked as ${req.body.status}.`);
  },
);
