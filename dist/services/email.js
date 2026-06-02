import nodemailer from "nodemailer";
function normalizeEncryption(value) {
    const normalized = String(value ?? "").trim().toLowerCase();
    if (!normalized || ["none", "false", "0"].includes(normalized))
        return "none";
    if (["ssl", "smtps", "true", "1"].includes(normalized))
        return "ssl";
    if (["tls", "starttls"].includes(normalized))
        return "starttls";
    return normalized;
}
function redactMailConfig(config) {
    return {
        host: config.host,
        port: config.port,
        secure: config.secure,
        requireTLS: config.requireTLS,
        encryption: config.encryption,
        hasUser: Boolean(config.user),
        hasPass: Boolean(config.pass),
        fromAddress: config.fromAddress,
        fromName: config.fromName,
    };
}
function readMailConfig() {
    const rawHost = (process.env.MAIL_HOST ?? process.env.SMTP_HOST ?? "").trim();
    const fromAddress = (process.env.MAIL_FROM_ADDRESS ?? process.env.SMTP_FROM ?? "").trim();
    if (!rawHost || !fromAddress)
        return null;
    const host = rawHost.replace(/^\w+:\/\//, "");
    const fromName = (process.env.MAIL_FROM_NAME ?? "Oasis CI").trim() || "Oasis CI";
    const port = Number(process.env.MAIL_PORT ?? process.env.SMTP_PORT ?? 587);
    const encryption = process.env.MAIL_ENCRYPTION !== undefined
        ? normalizeEncryption(process.env.MAIL_ENCRYPTION)
        : String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true"
            ? "ssl"
            : "none";
    const secure = encryption === "ssl";
    const requireTLS = encryption === "starttls";
    const user = (process.env.MAIL_USERNAME ?? process.env.SMTP_USER ?? "").trim() || undefined;
    const pass = (process.env.MAIL_PASSWORD ?? process.env.SMTP_PASS ?? "").trim() || undefined;
    return { host, port, secure, requireTLS, user, pass, fromAddress, fromName, encryption };
}
function isEmailConfigured() {
    return Boolean(readMailConfig());
}
function createTransport(config) {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        requireTLS: config.requireTLS,
        auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined,
    });
}
function formatFrom(config) {
    return `${config.fromName} <${config.fromAddress}>`;
}
async function sendEmailWithLogging(mailType, to, subject, text) {
    const config = readMailConfig();
    if (!config) {
        console.warn(`[mail:${mailType}] Mail not configured (need MAIL_HOST and MAIL_FROM_ADDRESS). Skipping.`);
        return;
    }
    const transporter = createTransport(config);
    const from = formatFrom(config);
    console.log(`[mail:${mailType}] Attempting send`, {
        to,
        subject,
        ...redactMailConfig(config),
    });
    try {
        const info = await transporter.sendMail({ from, to, subject, text });
        console.log(`[mail:${mailType}] Sent`, {
            messageId: info.messageId,
            response: info.response,
            accepted: info.accepted,
            rejected: info.rejected,
        });
    }
    catch (error) {
        console.error(`[mail:${mailType}] Send failed`, {
            to,
            subject,
            ...redactMailConfig(config),
            error,
        });
        throw error;
    }
}
export async function sendExposureNotificationEmail(input) {
    const subject = `Oasis CI Exposure Detected: ${input.domain} (${input.severity.toUpperCase()})`;
    const text = [
        `Hello ${input.companyName} security team,`,
        "",
        `Oasis CI detected a potential exposure associated with ${input.domain}.`,
        "",
        `Exposure ID: ${input.exposureId}`,
        `Severity: ${input.severity}`,
        `Category: ${input.category}`,
        `URL: ${input.fullUrl}`,
        "",
        "Description:",
        input.description,
        "",
        "If you are the domain owner, please sign in to review details, mark remediation progress, and request verification once fixed.",
        "",
        "— Oasis CI",
    ].join("\n");
    await sendEmailWithLogging("exposure-notification", input.to, subject, text);
}
export async function sendClaimVerificationEmail(input) {
    const subject = `Oasis CI verification code for ${input.domain}`;
    const text = [
        `Your Oasis CI ownership verification code for ${input.domain} is:`,
        "",
        input.token,
        "",
        "This code can be used once to open the owner dashboard for this domain.",
        "",
        "- Oasis CI",
    ].join("\n");
    await sendEmailWithLogging("claim-verification", input.to, subject, text);
}
export async function sendOwnerFixDeniedEmail(input) {
    const noteBlock = input.moderatorNote?.trim()
        ? `\nModerator note:\n${input.moderatorNote.trim()}\n`
        : "";
    const subject = `Oasis CI: fix review declined for ${input.domain}`;
    const text = [
        `Hello ${input.ownerName},`,
        "",
        `A moderator reviewed your reported fix for exposure ${input.exposureId} on ${input.domain} and determined the issue is not yet resolved.`,
        "",
        "The exposure has been returned to in progress. Sign in to your owner dashboard to continue remediation.",
        noteBlock,
        "— Oasis CI",
    ].join("\n");
    await sendEmailWithLogging("owner-fix-denied", input.to, subject, text);
}
export async function sendOwnerFixVerifiedEmail(input) {
    const subject = `Oasis CI: fix verified for ${input.domain}`;
    const text = [
        `Hello ${input.ownerName},`,
        "",
        `Your fix for exposure ${input.exposureId} on ${input.domain} has been verified by Oasis CI.`,
        "",
        "This issue is now archived. You can no longer change its remediation state unless a moderator reverses the decision.",
        "",
        "— Oasis CI",
    ].join("\n");
    await sendEmailWithLogging("owner-fix-verified", input.to, subject, text);
}
