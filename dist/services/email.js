import nodemailer from "nodemailer";
function normalizeEncryption(value) {
    const normalized = String(value ?? "").trim().toLowerCase();
    if (["ssl", "tls", "starttls", "true", "1"].includes(normalized))
        return true;
    if (["none", "false", "0", ""].includes(normalized))
        return false;
    return false;
}
function readMailConfig() {
    const host = (process.env.MAIL_HOST ?? process.env.SMTP_HOST ?? "").trim();
    const fromAddress = (process.env.MAIL_FROM_ADDRESS ?? process.env.SMTP_FROM ?? "").trim();
    if (!host || !fromAddress)
        return null;
    const fromName = (process.env.MAIL_FROM_NAME ?? "Oasis CI").trim() || "Oasis CI";
    const port = Number(process.env.MAIL_PORT ?? process.env.SMTP_PORT ?? 587);
    const secure = process.env.MAIL_ENCRYPTION !== undefined
        ? normalizeEncryption(process.env.MAIL_ENCRYPTION)
        : String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
    const user = (process.env.MAIL_USERNAME ?? process.env.SMTP_USER ?? "").trim() || undefined;
    const pass = (process.env.MAIL_PASSWORD ?? process.env.SMTP_PASS ?? "").trim() || undefined;
    return { host, port, secure, user, pass, fromAddress, fromName };
}
function isEmailConfigured() {
    return Boolean(readMailConfig());
}
function createTransport(config) {
    return nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.user && config.pass ? { user: config.user, pass: config.pass } : undefined,
    });
}
function formatFrom(config) {
    return `${config.fromName} <${config.fromAddress}>`;
}
export async function sendExposureNotificationEmail(input) {
    const config = readMailConfig();
    if (!config) {
        console.warn("Mail is not configured (set MAIL_HOST and MAIL_FROM_ADDRESS). Skipping exposure email notification.");
        return;
    }
    const transporter = createTransport(config);
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
    await transporter.sendMail({
        from: formatFrom(config),
        to: input.to,
        subject,
        text,
    });
}
export async function sendClaimVerificationEmail(input) {
    const config = readMailConfig();
    if (!config) {
        console.warn(`Mail is not configured (set MAIL_HOST and MAIL_FROM_ADDRESS). Claim code for ${input.domain}: ${input.token}`);
        return;
    }
    const transporter = createTransport(config);
    await transporter.sendMail({
        from: formatFrom(config),
        to: input.to,
        subject: `Oasis CI verification code for ${input.domain}`,
        text: [
            `Your Oasis CI ownership verification code for ${input.domain} is:`,
            "",
            input.token,
            "",
            "This code can be used once to open the owner dashboard for this domain.",
            "",
            "- Oasis CI",
        ].join("\n"),
    });
}
export async function sendOwnerFixDeniedEmail(input) {
    const config = readMailConfig();
    if (!config) {
        console.warn(`Mail not configured. Fix denied for ${input.exposureId}; owner ${input.to} should be notified in-app.`);
        return;
    }
    const transporter = createTransport(config);
    const noteBlock = input.moderatorNote?.trim()
        ? `\nModerator note:\n${input.moderatorNote.trim()}\n`
        : "";
    await transporter.sendMail({
        from: formatFrom(config),
        to: input.to,
        subject: `Oasis CI: fix review declined for ${input.domain}`,
        text: [
            `Hello ${input.ownerName},`,
            "",
            `A moderator reviewed your reported fix for exposure ${input.exposureId} on ${input.domain} and determined the issue is not yet resolved.`,
            "",
            "The exposure has been returned to in progress. Sign in to your owner dashboard to continue remediation.",
            noteBlock,
            "— Oasis CI",
        ].join("\n"),
    });
}
export async function sendOwnerFixVerifiedEmail(input) {
    const config = readMailConfig();
    if (!config) {
        console.warn(`Mail not configured. Fix verified for ${input.exposureId}; owner ${input.to}.`);
        return;
    }
    const transporter = createTransport(config);
    await transporter.sendMail({
        from: formatFrom(config),
        to: input.to,
        subject: `Oasis CI: fix verified for ${input.domain}`,
        text: [
            `Hello ${input.ownerName},`,
            "",
            `Your fix for exposure ${input.exposureId} on ${input.domain} has been verified by Oasis CI.`,
            "",
            "This issue is now archived. You can no longer change its remediation state unless a moderator reverses the decision.",
            "",
            "— Oasis CI",
        ].join("\n"),
    });
}
