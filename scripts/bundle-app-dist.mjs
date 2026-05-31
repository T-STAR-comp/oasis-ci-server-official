import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(serverRoot, "../oasis-ci-app/dist");
const target = path.join(serverRoot, "app-dist");

if (!fs.existsSync(source)) {
  console.error("Missing oasis-ci-app/dist — run `npm run build:app` first.");
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
console.log(`Copied frontend build to ${target}`);
