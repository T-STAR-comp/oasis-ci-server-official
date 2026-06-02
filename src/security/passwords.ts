import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);

export function createRandomPassword() {
  return crypto.randomBytes(12).toString("base64url");
}

function encodeSalt(salt: Buffer) {
  return salt.toString("hex");
}

function decodeSalt(encoded: string): string | Buffer | null {
  if (!encoded) return null;
  if (/^[0-9a-f]{32}$/i.test(encoded)) {
    return Buffer.from(encoded, "hex");
  }
  // Legacy format used the base64url string itself as salt text, not decoded bytes.
  return encoded;
}

function encodeHash(hash: Buffer) {
  return hash.toString("base64");
}

function decodeHash(encoded: string) {
  if (!encoded) return null;
  if (/[+/=]/.test(encoded)) {
    try {
      return Buffer.from(encoded, "base64");
    } catch {
      return null;
    }
  }
  try {
    return Buffer.from(encoded, "base64url");
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  if (!password) {
    throw new Error("Cannot hash an empty password.");
  }
  const salt = crypto.randomBytes(16);
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${encodeSalt(salt)}:${encodeHash(derived)}`;
}

export async function verifyPassword(password: string, storedHash?: string | null) {
  if (!storedHash || !password) return false;
  const [scheme, saltPart, hashPart] = storedHash.split(":");
  if (scheme !== "scrypt" || !saltPart || !hashPart) {
    // Very old fallback: plaintext or non-prefixed hashes in early local data.
    return storedHash === password;
  }

  const salt = decodeSalt(saltPart);
  const expected = decodeHash(hashPart);
  if (!salt || !expected) return false;

  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
}
