export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type ExposureCategory =
  | "sensitive_data"
  | "open_directory"
  | "admin_panel"
  | "backup_config";
export type ExposureStatus =
  | "approved"
  | "pending_review"
  | "rejected"
  | "fixed"
  | "archived";
export type RemediationStatus = "not_started" | "in_progress" | "fixed";
export type UserRole = "owner" | "pen_tester" | "moderator" | "admin";
export type UserStatus = "active" | "pending_review" | "temporary" | "suspended";
export type ClaimMethod = "email" | "sms";
export type ClaimStatus = "draft" | "token_sent" | "verified";
export type FlagStatus = "open" | "resolved" | "dismissed";
export type RemovalReviewStatus = "not_requested" | "requested" | "verified_removed";

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
  detail: string;
}

export interface ExposureHistoryEvent {
  id: string;
  actor: string;
  action: string;
  at: string;
  note?: string;
}

export interface Exposure {
  id: string;
  domain: string;
  redactedDomain: string;
  companyName: string;
  sector: string;
  category: ExposureCategory;
  severity: Severity;
  description: string;
  publicPath: string;
  fullUrl: string;
  exactPath: string;
  snippet: string;
  evidenceSample: string;
  discoveredAt: string;
  lastSeen: string;
  fileCount?: number;
  loginTitle?: string;
  companyContactEmail: string;
  companyContactPhone: string;
  remediationPrice?: number;
  removalReviewStatus: RemovalReviewStatus;
  submittedBy?: string;
  assignedTeam: string;
  status: ExposureStatus;
  remediationStatus: RemediationStatus;
  internalNote: string;
  remediationRecommendation: string;
  history: ExposureHistoryEvent[];
}

export interface PlatformSettings {
  remediationEmail: string;
  remediationPhone: string;
  policiesVersion: string;
  policiesEffectiveDate: string;
  policiesTitle: string;
}

export interface DomainRecord {
  id: string;
  domain: string;
  companyName: string;
  sector: string;
  verificationStatus: "verified" | "unclaimed";
  ownerUserId?: string;
  coverageScore: number;
  riskScore: number;
  lastScanAt: string;
  contactEmail: string;
  contactPhone: string;
  ownerAccessExpiresAt?: string;
  notificationChannel: "digest" | "slack_bridge" | "security_mailbox";
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  title: string;
  company: string;
  verifiedDomains: string[];
  passwordHint: string;
  passwordHash?: string;
  policiesAcceptedVersion?: string;
  policiesAcceptedAt?: string;
}

export interface Submission {
  id: string;
  exposureId: string;
  domain: string;
  fullUrl: string;
  category: ExposureCategory;
  severity: Severity;
  description: string;
  proofOfConcept: string;
  submittedBy: string;
  createdAt: string;
  status: "pending_review" | "approved" | "rejected";
  moderatorNote: string;
}

export type FlagType = "false_positive" | "review_request" | "escalation";

export interface ReviewFlag {
  id: string;
  exposureId: string;
  createdBy: string;
  reason: string;
  status: FlagStatus;
  createdAt: string;
  domain: string;
  exposureTitle: string;
  category: ExposureCategory;
  severity: Severity;
  exposureListingStatus: ExposureStatus;
  exposureRemediationStatus: RemediationStatus;
  reporterName: string;
  reporterRole: UserRole;
  flagType: FlagType;
  title: string;
}

export type NotificationType =
  | "fix_denied"
  | "fix_verified"
  | "fix_reversed"
  | "flag_update"
  | "general";

export interface UserNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  exposureId?: string;
  domain?: string;
  read: boolean;
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  domain: string;
  method: ClaimMethod;
  contact: string;
  token: string;
  status: ClaimStatus;
  requestedAt: string;
  recommendedEmail: string;
  recommendedPhone: string;
}

export interface AnalyticsPoint {
  label: string;
  discovered: number;
  remediated: number;
  submissions: number;
}

export interface PlatformState {
  currentUserId: string | null;
  publicSearch: string;
  platform?: PlatformSettings;
  users: User[];
  domains: DomainRecord[];
  exposures: Exposure[];
  submissions: Submission[];
  flags: ReviewFlag[];
  claims: ClaimRequest[];
  notifications: UserNotification[];
  auditLog: AuditEvent[];
  analytics: AnalyticsPoint[];
}
