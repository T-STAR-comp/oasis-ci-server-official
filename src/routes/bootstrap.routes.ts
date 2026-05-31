import { Router } from "express";
import { readState } from "../database/stateStore.js";
import { withSession } from "../middleware/session.js";
import { readPlatformSettings } from "../services/platformSettings.js";
import { sanitizeStateForUser } from "../services/privacy.js";
import { sendOk } from "../utils/responses.js";

export const bootstrapRouter = Router();

bootstrapRouter.get("/api/bootstrap", withSession(false), async (req, res) => {
  const state = await readState();
  sendOk(res, {
    ...sanitizeStateForUser(state, req.user),
    platform: await readPlatformSettings(),
  });
});

bootstrapRouter.get("/api/session", withSession(false), async (req, res) => {
  const session = {
    user: req.user ?? null,
    csrfToken: req.sessionRecord?.csrfToken,
  };
  sendOk(res, session);
});
