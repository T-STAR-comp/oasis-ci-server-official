import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../oasis-ci-app");

console.log("Building oasis-ci-app for Node deploy (OASIS_NODE_DEPLOY=1, SSR deps inlined)...");
execSync("npm run build", {
  cwd: appRoot,
  env: { ...process.env, OASIS_NODE_DEPLOY: "1" },
  stdio: "inherit",
});
