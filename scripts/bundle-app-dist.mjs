import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(serverRoot, "../oasis-ci-app/dist");
const target = path.join(serverRoot, "app-dist");
const deployDirs = ["client", "server"];
const staleDirs = ["tanstack_start_app"];

if (!fs.existsSync(source)) {
  console.error("Missing oasis-ci-app/dist — run `npm run build:app` first.");
  process.exit(1);
}

function assertNodeDeployBundle(root) {
  const assetsDir = path.join(root, "server", "assets");
  if (!fs.existsSync(assetsDir)) {
    console.error("Missing server/assets in frontend dist — rebuild with `npm run build:app`.");
    process.exit(1);
  }

  const offenders = [];
  for (const file of fs.readdirSync(assetsDir)) {
    if (!file.endsWith(".js")) continue;
    const content = fs.readFileSync(path.join(assetsDir, file), "utf8");
    if (/from\s+["']h3-v2["']/.test(content) || /import\s+["']h3-v2["']/.test(content)) {
      offenders.push(file);
    }
  }

  if (offenders.length > 0) {
    console.error(
      "SSR bundle still imports external package h3-v2 (not safe for cPanel Node hosting):",
      offenders.join(", "),
    );
    console.error("Rebuild with OASIS_NODE_DEPLOY=1 via `npm run build:app` from oasis-ci-server.");
    process.exit(1);
  }
}

function removePathWithRetry(targetPath) {
  if (!fs.existsSync(targetPath)) return;
  try {
    fs.rmSync(targetPath, {
      recursive: true,
      force: true,
      maxRetries: 10,
      retryDelay: 300,
    });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : null;
    if (code === "EBUSY" || code === "EPERM") {
      console.warn(`Could not remove ${targetPath} (${code}). Continuing with overwrite copy.`);
      return;
    }
    throw error;
  }
}

assertNodeDeployBundle(source);

fs.mkdirSync(target, { recursive: true });

for (const stale of staleDirs) {
  removePathWithRetry(path.join(target, stale));
}

for (const dir of deployDirs) {
  const src = path.join(source, dir);
  const dest = path.join(target, dir);
  if (!fs.existsSync(src)) {
    console.error(`Missing ${dir}/ in oasis-ci-app/dist — rebuild the frontend first.`);
    process.exit(1);
  }
  removePathWithRetry(dest);
  fs.cpSync(src, dest, { recursive: true, force: true });
}

console.log(`Copied frontend build (${deployDirs.join(", ")}) to ${target}`);
