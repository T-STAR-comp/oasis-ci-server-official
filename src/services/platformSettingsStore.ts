import { env } from "../config/env.js";
import {
  CURRENT_POLICIES_VERSION,
  POLICIES_EFFECTIVE_DATE,
  POLICIES_TITLE,
} from "../config/policies.js";
import { requirePool } from "../database/stateStore.js";
import type { PlatformSettings } from "../types/models.js";

const DEFAULT_REMEDIATION_EMAIL = "remediation@oasisci.com";

function withPolicyMeta(settings: Pick<PlatformSettings, "remediationEmail" | "remediationPhone">): PlatformSettings {
  return {
    remediationEmail: settings.remediationEmail.trim() || DEFAULT_REMEDIATION_EMAIL,
    remediationPhone: settings.remediationPhone?.trim() ?? "",
    policiesVersion: CURRENT_POLICIES_VERSION,
    policiesEffectiveDate: POLICIES_EFFECTIVE_DATE,
    policiesTitle: POLICIES_TITLE,
  };
}

export async function ensurePlatformSettingsTable() {
  const db = requirePool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS platform_settings (
      id TINYINT UNSIGNED PRIMARY KEY DEFAULT 1,
      remediation_email VARCHAR(255) NOT NULL,
      remediation_phone VARCHAR(64) NOT NULL DEFAULT '',
      updated_at DATETIME NOT NULL
    ) ENGINE=InnoDB
  `);
  const [rows] = await db.query("SELECT id FROM platform_settings WHERE id = 1");
  if (Array.isArray(rows) && rows.length === 0) {
    await db.query(
      `INSERT INTO platform_settings (id, remediation_email, remediation_phone, updated_at)
       VALUES (1, :email, :phone, NOW())`,
      {
        email: env.remediationEmail || DEFAULT_REMEDIATION_EMAIL,
        phone: env.remediationPhone ?? "",
      },
    );
  }
}

export async function readPlatformSettings(): Promise<PlatformSettings> {
  await ensurePlatformSettingsTable();
  const db = requirePool();
  const [rows] = await db.query("SELECT remediation_email, remediation_phone FROM platform_settings WHERE id = 1");
  const row = (rows as { remediation_email: string; remediation_phone: string }[])[0];
  if (!row) {
    return withPolicyMeta({
      remediationEmail: env.remediationEmail || DEFAULT_REMEDIATION_EMAIL,
      remediationPhone: env.remediationPhone ?? "",
    });
  }
  return withPolicyMeta({
    remediationEmail: row.remediation_email,
    remediationPhone: row.remediation_phone,
  });
}

export async function updatePlatformSettings(input: {
  remediationEmail: string;
  remediationPhone?: string;
}) {
  await ensurePlatformSettingsTable();
  const db = requirePool();
  const email = input.remediationEmail.trim().toLowerCase() || DEFAULT_REMEDIATION_EMAIL;
  const phone = input.remediationPhone?.trim() ?? "";
  await db.query(
    `UPDATE platform_settings SET remediation_email = :email, remediation_phone = :phone, updated_at = NOW() WHERE id = 1`,
    { email, phone },
  );
  return readPlatformSettings();
}
