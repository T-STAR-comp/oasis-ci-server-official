import type { User } from "./models.js";

export type ApiResult<T> =
  | { ok: true; data: T; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export interface SessionRecord {
  userId: string;
  csrfToken: string;
  createdAt: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
      sessionRecord?: SessionRecord;
    }
  }
}
