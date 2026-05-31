import { ownsDomain } from "./domains.js";
export function sanitizeStateForUser(state, user) {
    const canSeeAll = user?.role === "moderator" || user?.role === "admin";
    const next = structuredClone(state);
    next.currentUserId = user?.id ?? null;
    next.users = next.users.map((item) => ({ ...item, passwordHash: undefined }));
    next.notifications = user
        ? (next.notifications ?? []).filter((item) => item.userId === user.id)
        : [];
    next.exposures = next.exposures.map((exposure) => {
        const canSeePrivate = canSeeAll || (user?.role === "owner" && ownsDomain(user, state, exposure.domain));
        if (canSeePrivate)
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
    });
    return next;
}
