import crypto from "node:crypto";

/** Six-digit ownership verification code (email delivery only). */
export function createVerificationCode() {
  return `OASIS-${crypto.randomInt(100000, 999999)}`;
}
