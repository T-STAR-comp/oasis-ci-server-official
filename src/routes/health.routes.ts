import { Router } from "express";
import { getStoreMode } from "../database/stateStore.js";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({
    ok: true,
    data: {
      service: "oasis-ci-server",
      database: getStoreMode(),
      timestamp: new Date().toISOString(),
    },
  });
});

