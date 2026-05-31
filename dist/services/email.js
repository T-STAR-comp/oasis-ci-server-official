import nodemailer from "nodemailer";
function isEmailConfigured() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}
export async function sendExposureNotificationEmail(input) {
    if (!isEmailConfigured()) {
        console.warn("SMTP is not configured (set SMTP_HOST and SMTP_FROM). Skipping exposure email notification.");
        return;
    }
    const host = String(process.env.SMTP_HOST);
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
    });
    const from = String(process.env.SMTP_FROM);
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
        from,
        to: input.to,
        subject,
        text,
    });
}
export async function sendClaimVerificationEmail(input) {
    if (!isEmailConfigured()) {
        console.warn(`SMTP is not configured (set SMTP_HOST and SMTP_FROM). Claim code for ${input.domain}: ${input.token}`);
        return;
    }
    const host = String(process.env.SMTP_HOST);
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
    });
    await transporter.sendMail({
        from: String(process.env.SMTP_FROM),
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
    if (!isEmailConfigured()) {
        console.warn(`SMTP not configured. Fix denied for ${input.exposureId}; owner ${input.to} should be notified in-app.`);
        return;
    }
    const host = String(process.env.SMTP_HOST);
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
    });
    const noteBlock = input.moderatorNote?.trim()
        ? `\nModerator note:\n${input.moderatorNote.trim()}\n`
        : "";
    await transporter.sendMail({
        from: String(process.env.SMTP_FROM),
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
    if (!isEmailConfigured()) {
        console.warn(`SMTP not configured. Fix verified for ${input.exposureId}; owner ${input.to}.`);
        return;
    }
    const host = String(process.env.SMTP_HOST);
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = String(process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: user && pass ? { user, pass } : undefined,
    });
    await transporter.sendMail({
        from: String(process.env.SMTP_FROM),
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
