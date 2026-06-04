import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import express, { type Express, type Request as ExpressRequest, type Response as ExpressResponse } from "express";
import { env } from "../config/env.js";
import { appFrontendBuildExists, getAppDistPaths, getServerPackageRoot } from "./paths.js";

type SsrFetchHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let ssrHandlerPromise: Promise<SsrFetchHandler> | undefined;

function assertSsrBundleResolvable(serverEntry: string) {
  const assetsDir = path.join(path.dirname(serverEntry), "assets");
  if (!fs.existsSync(assetsDir)) return;

  const needsH3 = fs.readdirSync(assetsDir).some((file) => {
    if (!file.endsWith(".js")) return false;
    const content = fs.readFileSync(path.join(assetsDir, file), "utf8");
    return /from\s+["']h3-v2["']/.test(content) || /import\s+["']h3-v2["']/.test(content);
  });

  if (!needsH3) return;

  const ssrModules = path.join(path.dirname(serverEntry), "node_modules", "h3-v2");
  const rootModules = path.join(getServerPackageRoot(), "node_modules", "h3-v2");
  if (!fs.existsSync(ssrModules) && !fs.existsSync(rootModules)) {
    throw new Error(
      "SSR bundle requires h3-v2. Run `npm install` in oasis-ci-server, or redeploy with `npm run build:deploy` (installs app-dist/server/node_modules).",
    );
  }
}

async function loadSsrHandler(): Promise<SsrFetchHandler> {
  if (!ssrHandlerPromise) {
    const { serverEntry } = getAppDistPaths();
    assertSsrBundleResolvable(serverEntry);
    const entryUrl = pathToFileURL(serverEntry).href;
    const mod = (await import(entryUrl)) as { default?: SsrFetchHandler };
    const handler = mod.default ?? (mod as unknown as SsrFetchHandler);
    if (!handler?.fetch) {
      throw new Error(`TanStack Start server entry is missing fetch(): ${serverEntry}`);
    }
    ssrHandlerPromise = Promise.resolve(handler);
  }
  return ssrHandlerPromise;
}

function requestBaseUrl(req: ExpressRequest) {
  if (env.publicBaseUrl) {
    try {
      const configured = new URL(env.publicBaseUrl);
      return `${configured.protocol}//${configured.host}`;
    } catch {
      // Fall through to the incoming request host.
    }
  }
  return `${req.protocol}://${req.get("host")}`;
}

function toWebRequest(req: ExpressRequest): globalThis.Request {
  const url = `${requestBaseUrl(req)}${req.originalUrl}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const entry of value) headers.append(key, entry);
    } else {
      headers.set(key, value);
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body !== undefined) {
    if (Buffer.isBuffer(req.body)) {
      init.body = new Uint8Array(req.body);
    } else if (typeof req.body === "string") {
      init.body = req.body;
    } else {
      init.body = JSON.stringify(req.body);
      if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
      }
    }
  }

  return new Request(url, init);
}

async function writeWebResponse(res: ExpressResponse, webResponse: globalThis.Response): Promise<void> {
  res.status(webResponse.status);
  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    res.append(key, value);
  });
  const body = Buffer.from(await webResponse.arrayBuffer());
  if (body.length > 0) {
    res.send(body);
  } else {
    res.end();
  }
}

function registerFrontendMissingPage(app: Express) {
  app.get("/", (_req, res) => {
    res.status(503).type("html").send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><title>Oasis CI</title></head>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem">
<h1>Frontend build not deployed</h1>
<p>The API is running, but the app bundle is missing on this server.</p>
<p>On your machine run:</p>
<pre style="background:#f4f4f5;padding:1rem;border-radius:8px">cd oasis-ci-server
npm run build:deploy</pre>
<p>Then upload the <code>app-dist/</code> folder next to <code>server.cjs</code> and restart Node.</p>
<p>Or set <code>OASIS_CI_APP_ROOT</code> to the folder that contains <code>client/</code> and <code>server/</code>.</p>
</body></html>`);
  });
}

export function registerFrontend(app: Express) {
  if (!appFrontendBuildExists()) {
    registerFrontendMissingPage(app);
    return { enabled: false as const };
  }

  const { clientDir } = getAppDistPaths();
  app.use(
    express.static(clientDir, {
      index: false,
      maxAge: env.nodeEnv === "production" ? "1y" : 0,
      immutable: env.nodeEnv === "production",
    }),
  );

  app.use(async (req, res, next) => {
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }

    try {
      const handler = await loadSsrHandler();
      const webResponse = await handler.fetch(toWebRequest(req), {}, {});
      await writeWebResponse(res, webResponse);
    } catch (error) {
      console.error(error);
      res.status(500).type("html").send("<!doctype html><title>Oasis CI</title><p>Failed to render page.</p>");
    }
  });

  return { enabled: true as const, clientDir };
}

export function describeFrontendBuild() {
  if (!appFrontendBuildExists()) {
    return "Frontend build not found — run `npm run build` in oasis-ci-app, then restart the server.";
  }
  const { clientDir, serverEntry } = getAppDistPaths();
  return `Serving app from ${clientDir} (SSR ${path.basename(serverEntry)})`;
}
