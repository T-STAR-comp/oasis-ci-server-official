import { ownsDomain } from "./domains.js";
export function canViewExposurePrivate(user, state, exposure) {
    if (!user)
        return false;
    if (user.role === "admin" || user.role === "moderator")
        return true;
    if (user.role === "owner" && ownsDomain(user, state, exposure.domain))
        return true;
    return false;
}
export function exposureForUser(exposure, user, state) {
    if (canViewExposurePrivate(user, state, exposure))
        return exposure;
    return {
        ...exposure,
        description: "",
        fullUrl: "",
        exactPath: exposure.publicPath,
        snippet: "",
        evidenceSample: "",
        internalNote: "",
        remediationRecommendation: "",
        companyContactEmail: "",
        companyContactPhone: "",
        remediationPrice: undefined,
        fileCount: undefined,
        history: [],
    };
}
export function sanitizeStateForUser(state, user) {
    const next = structuredClone(state);
    next.currentUserId = user?.id ?? null;
    next.users = next.users.map((item) => ({ ...item, passwordHash: undefined }));
    next.notifications = user
        ? (next.notifications ?? []).filter((item) => item.userId === user.id)
        : [];
    next.exposures = next.exposures.map((exposure) => exposureForUser(exposure, user, state));
    return next;
}
