import { unsign } from "cookie-signature";
import { env } from "../config/env.js";
const SESSION_COOKIE = "oasis_sid";
/** Every signed oasis_sid value in the Cookie header (handles duplicate cookies). */
export function parseAllSignedSessionIds(req) {
    const ids = [];
    const fromParser = req.signedCookies?.[SESSION_COOKIE];
    if (typeof fromParser === "string" && !ids.includes(fromParser)) {
        ids.push(fromParser);
    }
    const header = req.headers.cookie;
    if (!header)
        return ids;
    for (const segment of header.split(";")) {
        const trimmed = segment.trim();
        if (!trimmed.startsWith(`${SESSION_COOKIE}=`))
            continue;
        const raw = decodeURIComponent(trimmed.slice(SESSION_COOKIE.length + 1));
        const signedValue = raw.startsWith("s:") ? raw.slice(2) : raw;
        const unsigned = unsign(signedValue, env.sessionSecret);
        if (unsigned && !ids.includes(unsigned)) {
            ids.push(unsigned);
        }
    }
    return ids;
}
export function requestHadSessionCookie(req) {
    return Boolean(req.headers.cookie?.includes(`${SESSION_COOKIE}=`));
}
