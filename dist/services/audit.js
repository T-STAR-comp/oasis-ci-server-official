import { createId } from "../utils/ids.js";
export function createAuditEvent(actor, action, target, detail) {
    return {
        id: createId("audit"),
        actor,
        action,
        target,
        createdAt: new Date().toISOString(),
        detail,
    };
}
