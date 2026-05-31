import { Router } from "express";
import { z } from "zod";
import { readState, writeState } from "../database/stateStore.js";
import { withSession } from "../middleware/session.js";
import { validate } from "../middleware/validate.js";
import { sendOk } from "../utils/responses.js";
export const notificationsRouter = Router();
notificationsRouter.post("/api/notifications/mark-read", withSession(true), validate(z.object({
    notificationIds: z.array(z.string().min(1)).optional(),
    markAll: z.boolean().optional(),
})), async (req, res) => {
    const state = await readState();
    const userId = req.user.id;
    const ids = req.body.notificationIds ?? [];
    state.notifications = (state.notifications ?? []).map((item) => {
        if (item.userId !== userId)
            return item;
        if (req.body.markAll)
            return { ...item, read: true };
        if (ids.includes(item.id))
            return { ...item, read: true };
        return item;
    });
    await writeState(state);
    sendOk(res, { updated: true }, "Notifications updated.");
});
