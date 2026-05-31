import { createId } from "../utils/ids.js";

export function createAuditEvent(actor: string, action: string, target: string, detail: string) {
  return {
    id: createId("audit"),
    actor,
    action,
    target,
    createdAt: new Date().toISOString(),
    detail,
  };
}

