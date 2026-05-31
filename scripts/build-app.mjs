import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../oasis-ci-app");

execSync("npm run build", {
  cwd: appRoot,
  env: { ...process.env, OASIS_NODE_DEPLOY: "1" },
  stdio: "inherit",
});
