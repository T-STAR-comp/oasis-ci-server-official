import { sendFail } from "../utils/responses.js";
export function errorHandler(error, _req, res, _next) {
    console.error(error);
    sendFail(res, "The Oasis CI API hit an unexpected error.", 500);
}
