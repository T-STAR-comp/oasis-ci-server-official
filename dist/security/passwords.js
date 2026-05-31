import crypto from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(crypto.scrypt);
export function createRandomPassword() {
    return crypto.randomBytes(12).toString("base64url");
}
function encodeSalt(salt) {
    return salt.toString("hex");
}
function decodeSalt(encoded) {
    if (!encoded)
        return null;
    if (/^[0-9a-f]{32}$/i.test(encoded)) {
        return Buffer.from(encoded, "hex");
    }
    try {
        const legacySalt = Buffer.from(encoded, "base64url");
        return legacySalt.length > 0 ? legacySalt : null;
    }
    catch {
        return null;
    }
}
function encodeHash(hash) {
    return hash.toString("base64");
}
function decodeHash(encoded) {
    if (!encoded)
        return null;
    if (/[+/=]/.test(encoded)) {
        try {
            return Buffer.from(encoded, "base64");
        }
        catch {
            return null;
        }
    }
    try {
        return Buffer.from(encoded, "base64url");
    }
    catch {
        return null;
    }
}
export async function hashPassword(password) {
    if (!password) {
        throw new Error("Cannot hash an empty password.");
    }
    const salt = crypto.randomBytes(16);
    const derived = (await scrypt(password, salt, 64));
    return `scrypt:${encodeSalt(salt)}:${encodeHash(derived)}`;
}
export async function verifyPassword(password, storedHash) {
    if (!storedHash || !password)
        return false;
    const [scheme, saltPart, hashPart] = storedHash.split(":");
    if (scheme !== "scrypt" || !saltPart || !hashPart)
        return false;
    const salt = decodeSalt(saltPart);
    const expected = decodeHash(hashPart);
    if (!salt || !expected)
        return false;
    const derived = (await scrypt(password, salt, 64));
    return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
}
