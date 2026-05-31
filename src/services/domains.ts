import {
  type PlatformState,
  type User,
  type DomainRecord,
} from "../types/models.js";
import { createId } from "../utils/ids.js";

export function isDomainClaimedByAnother(
  domains: DomainRecord[],
  domain: string,
  userId?: string | null,
) {
  const record = domains.find((entry) => entry.domain === domain);
  if (!record || record.verificationStatus !== "verified" || !record.ownerUserId) return false;
  if (userId && record.ownerUserId === userId) return false;
  return true;
}

export function ownsDomain(user: User, state: PlatformState, domain: string) {
  return (
    user.verifiedDomains.includes(domain) ||
    state.domains.some((entry) => entry.domain === domain && entry.ownerUserId === user.id)
  );
}

export function buildClaimlessDomain(domain: string): DomainRecord {
  return {
    id: createId("dom"),
    domain,
    companyName: domain.replace(/\..+$/, "").replace(/-/g, " "),
    sector: "Newly submitted",
    verificationStatus: "unclaimed",
    coverageScore: 70,
    riskScore: 55,
    lastScanAt: new Date().toISOString(),
    contactEmail: `security@${domain}`,
    contactPhone: "+1 555 010 0000",
    notificationChannel: "digest",
    tags: ["researcher-submission"],
  };
}

export function upsertVerifiedDomain(
  domains: DomainRecord[],
  domain: string,
  ownerUserId: string,
  claim: { recommendedEmail: string; recommendedPhone: string },
) {
  const timestamp = new Date().toISOString();
  const ownerAccessExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  if (domains.some((entry) => entry.domain === domain)) {
    return domains.map((entry) =>
      entry.domain === domain
        ? {
            ...entry,
            verificationStatus: "verified" as const,
            ownerUserId,
            ownerAccessExpiresAt,
            lastScanAt: timestamp,
          }
        : entry,
    );
  }
  return [
    {
      ...buildClaimlessDomain(domain),
      verificationStatus: "verified" as const,
      ownerUserId,
      ownerAccessExpiresAt,
      contactEmail: claim.recommendedEmail,
      contactPhone: claim.recommendedPhone,
      lastScanAt: timestamp,
    },
    ...domains,
  ];
}
