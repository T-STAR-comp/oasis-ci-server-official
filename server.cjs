/**
 * LiteSpeed / cPanel Node (lsnode) entry point.
 * Hosting panels use require() (CommonJS) and cannot run src/*.ts or ESM directly.
 * Set "Application startup file" to: server.cjs
 */
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const entry = path.join(__dirname, "dist", "server.js");

import(pathToFileURL(entry).href).catch((error) => {
  console.error(
    "Failed to start Oasis CI. Run `npm run build` in this folder first.",
  );
  console.error(error);
  process.exit(1);
});
