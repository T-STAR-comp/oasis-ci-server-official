import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sendFail } from "../utils/responses.js";

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path.join(".") || "request"] = issue.message;
      }
      return sendFail(res, "Check the submitted fields.", 400, fieldErrors);
    }
    req.body = result.data;
    return next();
  };
}

