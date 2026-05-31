import { createId } from "../utils/ids.js";
export function updateExposureRecord(exposure, actor, input) {
    const timestamp = new Date().toISOString();
    const remediationStatus = input.remediationStatus ?? exposure.remediationStatus;
    const status = input.status ?? (remediationStatus === "fixed" ? "fixed" : exposure.status);
    return {
        ...exposure,
        remediationStatus,
        status,
        internalNote: input.internalNote ?? exposure.internalNote,
        history: [
            {
                id: createId("hist"),
                actor: actor.name,
                action: "Exposure updated",
                at: timestamp,
                note: `Remediation: ${remediationStatus}; Listing status: ${status}.`,
            },
            ...exposure.history,
        ],
    };
}
export function hasAdminExposureFields(input) {
    return [
        "companyName",
        "sector",
        "category",
        "severity",
        "description",
        "snippet",
        "evidenceSample",
        "assignedTeam",
        "companyContactEmail",
        "companyContactPhone",
        "remediationPrice",
        "fileCount",
        "loginTitle",
        "remediationRecommendation",
    ].some((key) => key in input);
}
