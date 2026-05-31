import crypto from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(crypto.scrypt);
export function createRandomPassword() {
    return crypto.randomBytes(12).toString("base64url");
}
export async function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("base64url");
    const derived = (await scrypt(password, salt, 64));
    return `scrypt:${salt}:${derived.toString("base64url")}`;
}
export async function verifyPassword(password, storedHash) {
    if (!storedHash)
        return false;
    const [scheme, salt, hash] = storedHash.split(":");
    if (scheme !== "scrypt" || !salt || !hash)
        return false;
    const derived = (await scrypt(password, salt, 64));
    const expected = Buffer.from(hash, "base64url");
    return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
}
