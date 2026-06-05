import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "../config/env.js";
export function registerSecurityMiddleware(app) {
    app.set("trust proxy", 1);
    // User-specific JSON must never be revalidated from cache (304 + stripped anonymous payloads).
    app.set("etag", false);
    app.use("/api", (_req, res, next) => {
        res.set({
            "Cache-Control": "private, no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
            Vary: "Cookie, x-csrf-token",
        });
        next();
    });
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false,
    }));
    const allowedOrigins = env.allowedCorsOrigins;
    if (env.nodeEnv !== "production") {
        try {
            const client = new URL(env.clientOrigin);
            if (client.hostname === "localhost") {
                allowedOrigins.add(`${client.protocol}//127.0.0.1:${client.port || "5173"}`);
            }
            if (client.hostname === "127.0.0.1") {
                allowedOrigins.add(`${client.protocol}//localhost:${client.port || "5173"}`);
            }
        }
        catch {
            // Keep the configured client origin only.
        }
    }
    let publicHostname = "";
    try {
        publicHostname = new URL(env.publicBaseUrl).hostname;
    }
    catch {
        // ignore
    }
    app.use(cors({
        origin(origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.has(origin))
                return callback(null, true);
            if (publicHostname) {
                try {
                    const originHost = new URL(origin).hostname;
                    const bare = publicHostname.startsWith("www.") ? publicHostname.slice(4) : publicHostname;
                    const originBare = originHost.startsWith("www.") ? originHost.slice(4) : originHost;
                    if (originBare === bare)
                        return callback(null, true);
                }
                catch {
                    // ignore
                }
            }
            console.warn(`CORS rejected origin: ${origin} (allowed: ${[...allowedOrigins].join(", ")})`);
            return callback(new Error("Origin is not allowed by Oasis CI CORS policy."));
        },
        credentials: true,
    }));
    app.use(express.json({ limit: "128kb" }));
    app.use(cookieParser(env.sessionSecret));
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 600,
        standardHeaders: "draft-8",
        legacyHeaders: false,
    }));
    app.use("/api/auth", rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 50,
        standardHeaders: "draft-8",
        legacyHeaders: false,
    }));
}
