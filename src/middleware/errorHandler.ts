import type { NextFunction, Request, Response } from "express";
import { sendFail } from "../utils/responses.js";

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  sendFail(res, "The Oasis CI API hit an unexpected error.", 500);
}

