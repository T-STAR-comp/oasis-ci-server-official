import type { PlatformState, UserNotification } from "../types/models.js";
import { createId } from "../utils/ids.js";

export function pushUserNotification(
  state: PlatformState,
  userId: string,
  input: {
    type: UserNotification["type"];
    title: string;
    message: string;
    exposureId?: string;
    domain?: string;
  },
) {
  const notification: UserNotification = {
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

export function notifyDomainOwner(
  state: PlatformState,
  domain: string,
  input: Omit<Parameters<typeof pushUserNotification>[2], "domain">,
) {
  const ownerId = state.domains.find((entry) => entry.domain === domain)?.ownerUserId;
  if (!ownerId) return;
  pushUserNotification(state, ownerId, { ...input, domain });
}

export function notifyModeratorsAndAdmins(
  state: PlatformState,
  input: Omit<Parameters<typeof pushUserNotification>[2], "domain"> & { domain?: string },
) {
  for (const user of state.users) {
    if (user.role === "moderator" || user.role === "admin") {
      pushUserNotification(state, user.id, input);
    }
  }
}
