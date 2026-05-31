import { sendFail } from "../utils/responses.js";
export function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const fieldErrors = {};
            for (const issue of result.error.issues) {
                fieldErrors[issue.path.join(".") || "request"] = issue.message;
            }
            return sendFail(res, "Check the submitted fields.", 400, fieldErrors);
        }
        req.body = result.data;
        return next();
    };
}
