import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDist = path.join(serverRoot, "app-dist");
const ssrRoot = path.join(appDist, "server");

if (!fs.existsSync(path.join(ssrRoot, "server.js"))) {
  console.warn("Skipping SSR dependency install — app-dist/server/server.js not found.");
  process.exit(0);
}

const assetsDir = path.join(ssrRoot, "assets");
let needsH3 = false;
if (fs.existsSync(assetsDir)) {
  for (const file of fs.readdirSync(assetsDir)) {
    if (!file.endsWith(".js")) continue;
    const content = fs.readFileSync(path.join(assetsDir, file), "utf8");
    if (/from\s+["']h3-v2["']/.test(content) || /import\s+["']h3-v2["']/.test(content)) {
      needsH3 = true;
      break;
    }
  }
}

if (!needsH3) {
  console.log("SSR bundle inlines server deps — no extra h3-v2 install required.");
  process.exit(0);
}

console.log("SSR bundle references h3-v2 — installing runtime deps under app-dist/server/...");

const pkg = {
  name: "oasis-ci-ssr-runtime",
  private: true,
  type: "module",
  dependencies: {
    "h3-v2": "npm:h3@2.0.1-rc.20",
  },
};

fs.writeFileSync(path.join(ssrRoot, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
execSync("npm install --omit=dev --no-audit --no-fund", {
  cwd: ssrRoot,
  stdio: "inherit",
});
console.log("Installed SSR runtime dependencies in app-dist/server/node_modules");
