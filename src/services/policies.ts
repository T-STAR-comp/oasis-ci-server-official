import { CURRENT_POLICIES_VERSION } from "../config/policies.js";
import type { User } from "../types/models.js";

export function userNeedsPolicyAcceptance(user: User | null | undefined) {
  if (!user) return false;
  return user.policiesAcceptedVersion !== CURRENT_POLICIES_VERSION;
}

export function recordPolicyAcceptance<T extends User>(user: T): T {
  return {
    ...user,
    policiesAcceptedVersion: CURRENT_POLICIES_VERSION,
    policiesAcceptedAt: new Date().toISOString(),
  };
}
