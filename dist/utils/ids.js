import crypto from "node:crypto";
export function createId(prefix) {
    const id = crypto.randomUUID().slice(0, 8);
    return prefix === "OAS" ? `OAS-${id.replace(/-/g, "").toUpperCase()}` : `${prefix}-${id}`;
}
/** @deprecated Use createVerificationCode from services/verificationCodes.js */
export function createClaimToken() {
    return `OASIS-${crypto.randomInt(100000, 999999)}`;
}
