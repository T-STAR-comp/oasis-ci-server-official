export function sendOk(res, data, message) {
    const payload = { ok: true, data, message };
    return res.json(payload);
}
export function sendFail(res, message, status = 400, fieldErrors) {
    const payload = { ok: false, message, fieldErrors };
    return res.status(status).json(payload);
}
