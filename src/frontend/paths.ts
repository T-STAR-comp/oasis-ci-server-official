import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

/** Package root (`oasis-ci-server`), whether running from `src/` or `dist/`. */
export function getServerPackageRoot() {
  return path.resolve(moduleDir, "../..");
}

export function getAppDistPaths() {
  const appRoot = path.resolve(getServerPackageRoot(), "../oasis-ci-app");
  return {
    appRoot,
    clientDir: path.join(appRoot, "dist/client"),
    serverEntry: path.join(appRoot, "dist/server/server.js"),
  };
}

export function appFrontendBuildExists() {
  const { clientDir, serverEntry } = getAppDistPaths();
  return fs.existsSync(clientDir) && fs.existsSync(serverEntry);
}
