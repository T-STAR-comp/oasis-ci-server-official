import type { Response } from "express";
import type { ApiResult } from "../types/api.js";

export function sendOk<T>(res: Response, data: T, message?: string) {
  const payload: ApiResult<T> = { ok: true, data, message };
  return res.json(payload);
}

export function sendFail(
  res: Response,
  message: string,
  status = 400,
  fieldErrors?: Record<string, string>,
) {
  const payload: ApiResult<never> = { ok: false, message, fieldErrors };
  return res.status(status).json(payload);
}

