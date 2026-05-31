import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "../config/env.js";
export function registerSecurityMiddleware(app) {
    app.set("trust proxy", 1);
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false,
    }));
    const allowedOrigins = new Set([env.clientOrigin, env.publicBaseUrl]);
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
    app.use(cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.has(origin))
                return callback(null, true);
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
