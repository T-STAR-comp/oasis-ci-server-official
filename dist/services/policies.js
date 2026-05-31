import { CURRENT_POLICIES_VERSION } from "../config/policies.js";
export function userNeedsPolicyAcceptance(user) {
    if (!user)
        return false;
    return user.policiesAcceptedVersion !== CURRENT_POLICIES_VERSION;
}
export function recordPolicyAcceptance(user) {
    return {
        ...user,
        policiesAcceptedVersion: CURRENT_POLICIES_VERSION,
        policiesAcceptedAt: new Date().toISOString(),
    };
}
