import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { getStoreMode, initDatabase } from "./database/stateStore.js";
import { describeFrontendBuild } from "./frontend/serveFrontend.js";

await initDatabase();

const app = createApp();

app.listen(env.port, () => {
  console.log(`Oasis CI listening on http://localhost:${env.port}`);
  console.log(`Public base URL: ${env.publicBaseUrl}`);
  const frontendStatus = describeFrontendBuild();
  console.log(frontendStatus);
  if (frontendStatus.includes("not found")) {
    console.warn("WARNING: GET / will not serve the app until app-dist/ is deployed.");
  }
  console.log(`State store: ${getStoreMode()}`);
});

