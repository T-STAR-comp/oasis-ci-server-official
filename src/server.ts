import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { getStoreMode, initDatabase } from "./database/stateStore.js";

await initDatabase();

const app = createApp();

app.listen(env.port, () => {
  console.log(`Oasis CI API listening on http://localhost:${env.port}`);
  console.log(`State store: ${getStoreMode()}`);
});

