import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { getStoreMode, initDatabase } from "./database/stateStore.js";
import { describeFrontendBuild } from "./frontend/serveFrontend.js";

await initDatabase();

const app = createApp();

app.listen(env.port, () => {
  console.log(`Oasis CI listening on http://localhost:${env.port}`);
  console.log(`Public base URL: ${env.publicBaseUrl}`);
  console.log(describeFrontendBuild());
  console.log(`State store: ${getStoreMode()}`);
});

