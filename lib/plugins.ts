export const RISK_LEVELS = ["Low", "Medium", "High", "Unknown"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const VERIFICATION_STATUSES = [
  "Verified",
  "Community Review",
  "Needs Review",
  "Unknown",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const UNKNOWN = "Unknown";

export interface Plugin {
  id: string;
  slug: string;
  name: string;
  platform: string;
  category: string;
  logo: string | null;
  officialUrl: string | null;
  description: string;
  developer: string;
  pricing: string;
  riskLevel: RiskLevel;
  riskReason: string;
  verificationStatus: VerificationStatus;
  /** Multi-value fields. Empty array means "Unknown" — never guessed. */
  permissions: string[];
  dataAccessed: string[];
  externalServices: string[];
  externalApis: string[];
  analytics: string[];
  aiServices: string[];
  cloudStorage: string[];
  databaseConnection: string;
  authentication: string;
  telemetry: string;
  cookies: string;
  privacyPolicy: string | null;
  termsOfService: string | null;
  githubUrl: string | null;
  supportUrl: string | null;
  reviewSummary: string;
  testsPerformed: string[];
  evidence: string[];
  limitations: string[];
  mitigation: string;
  confidence: string;
  reviewer: string;
  reviewedAt: string;
  updatedAt: string;
}

/** "None" is a meaningful reviewed value, distinct from Unknown (not reviewed). */
export const NONE = "None";

function scalar(value: string | undefined): string {
  const v = (value ?? "").trim();
  return v === "" ? UNKNOWN : v;
}

function url(value: string | undefined): string | null {
  const v = (value ?? "").trim();
  return /^https?:\/\//.test(v) ? v : null;
}

/** Split a `;`-separated cell into values. "Unknown"/empty → []; "None" is kept. */
function list(value: string | undefined): string[] {
  const v = (value ?? "").trim();
  if (v === "" || v.toLowerCase() === "unknown") return [];
  return v
    .split(";")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

function riskLevel(value: string | undefined): RiskLevel {
  const v = scalar(value).toLowerCase();
  const match = RISK_LEVELS.find((level) => level.toLowerCase() === v);
  return match ?? UNKNOWN;
}

function verificationStatus(value: string | undefined): VerificationStatus {
  const v = scalar(value).toLowerCase();
  const match = VERIFICATION_STATUSES.find(
    (status) => status.toLowerCase() === v
  );
  return match ?? UNKNOWN;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Map a spreadsheet record (keyed by lowercased header name) to a Plugin. */
export function recordToPlugin(record: Record<string, string>): Plugin | null {
  const name = (record["name"] ?? "").trim();
  if (name === "") return null;

  // Keep the original project's moderation gate: only approved rows ship.
  if ((record["approved"] ?? "").trim().toLowerCase() !== "yes") return null;

  return {
    id: scalar(record["id"]),
    slug: (record["slug"] ?? "").trim() || slugify(name),
    name,
    platform: scalar(record["platform"]),
    category: scalar(record["category"]),
    logo: url(record["logo"]),
    officialUrl: url(record["official_url"]),
    description: scalar(record["description"]),
    developer: scalar(record["developer"]),
    pricing: scalar(record["pricing"]),
    riskLevel: riskLevel(record["risk_level"]),
    riskReason: scalar(record["risk_reason"]),
    verificationStatus: verificationStatus(record["verification_status"]),
    permissions: list(record["permissions"]),
    dataAccessed: list(record["data_accessed"]),
    externalServices: list(record["external_services"]),
    externalApis: list(record["external_apis"]),
    analytics: list(record["analytics"]),
    aiServices: list(record["ai_services"]),
    cloudStorage: list(record["cloud_storage"]),
    databaseConnection: scalar(record["database_connection"]),
    authentication: scalar(record["authentication"]),
    telemetry: scalar(record["telemetry"]),
    cookies: scalar(record["cookies"]),
    privacyPolicy: url(record["privacy_policy"]),
    termsOfService: url(record["terms_of_service"]),
    githubUrl: url(record["github_url"]),
    supportUrl: url(record["support_url"]),
    reviewSummary: scalar(record["review_summary"]),
    testsPerformed: list(record["tests_performed"]),
    evidence: list(record["evidence"]),
    limitations: list(record["limitations"]),
    mitigation: scalar(record["mitigation"]),
    confidence: scalar(record["confidence"]),
    reviewer: scalar(record["reviewer"]),
    reviewedAt: scalar(record["reviewed_at"]),
    updatedAt: scalar(record["updated_at"]),
  };
}
