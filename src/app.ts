import express from "express";
import { adminRouter } from "./routes/admin.routes.js";
import { notificationsRouter } from "./routes/notifications.routes.js";
import { policiesRouter } from "./routes/policies.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { bootstrapRouter } from "./routes/bootstrap.routes.js";
import { claimsRouter } from "./routes/claims.routes.js";
import { domainsRouter } from "./routes/domains.routes.js";
import { exposuresRouter } from "./routes/exposures.routes.js";
import { flagsRouter } from "./routes/flags.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { submissionsRouter } from "./routes/submissions.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { registerSecurityMiddleware } from "./middleware/security.js";
import { registerFrontend } from "./frontend/serveFrontend.js";

export function createApp() {
  const app = express();

  registerSecurityMiddleware(app);

  app.use(healthRouter);
  app.use(bootstrapRouter);
  app.use(authRouter);
  app.use(claimsRouter);
  app.use(exposuresRouter);
  app.use(submissionsRouter);
  app.use(flagsRouter);
  app.use(usersRouter);
  app.use(domainsRouter);
  app.use(adminRouter);
  app.use(notificationsRouter);
  app.use(policiesRouter);

  registerFrontend(app);

  app.use(errorHandler);

  return app;
}

