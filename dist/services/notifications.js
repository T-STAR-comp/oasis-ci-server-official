import { createId } from "../utils/ids.js";
export function pushUserNotification(state, userId, input) {
    const notification = {
        id: createId("ntf"),
        userId,
        type: input.type,
        title: input.title,
        message: input.message,
        exposureId: input.exposureId,
        domain: input.domain,
        read: false,
        createdAt: new Date().toISOString(),
    };
    state.notifications = [notification, ...(state.notifications ?? [])];
    return notification;
}
export function notifyDomainOwner(state, domain, input) {
    const ownerId = state.domains.find((entry) => entry.domain === domain)?.ownerUserId;
    if (!ownerId)
        return;
    pushUserNotification(state, ownerId, { ...input, domain });
}
export function notifyModeratorsAndAdmins(state, input) {
    for (const user of state.users) {
        if (user.role === "moderator" || user.role === "admin") {
            pushUserNotification(state, user.id, input);
        }
    }
}
