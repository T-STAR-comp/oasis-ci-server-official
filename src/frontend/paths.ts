import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

/** Package root (`oasis-ci-server`), whether running from `src/` or `dist/`. */
export function getServerPackageRoot() {
  return path.resolve(moduleDir, "../..");
}

function resolveAppRoot() {
  const configured = process.env.OASIS_CI_APP_ROOT?.trim();
  if (configured) return path.resolve(configured);

  const serverRoot = getServerPackageRoot();
  const bundled = path.join(serverRoot, "app-dist");
  if (fs.existsSync(path.join(bundled, "client"))) return bundled;

  return path.resolve(serverRoot, "../oasis-ci-app");
}

export function getAppDistPaths() {
  const appRoot = resolveAppRoot();
  const distRoot = appRoot.endsWith(`${path.sep}dist`) ? appRoot : path.join(appRoot, "dist");
  return {
    appRoot,
    clientDir: path.join(distRoot, "client"),
    serverEntry: path.join(distRoot, "server/server.js"),
  };
}

export function appFrontendBuildExists() {
  const { clientDir, serverEntry } = getAppDistPaths();
  return fs.existsSync(clientDir) && fs.existsSync(serverEntry);
}
