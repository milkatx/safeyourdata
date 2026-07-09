import type { RiskLevel, VerificationStatus } from "@/lib/plugins";

const riskClass: Record<RiskLevel, string> = {
  Low: "badge-low",
  Medium: "badge-medium",
  High: "badge-high",
  Unknown: "badge-unknown",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`badge ${riskClass[level]}`}>
      {level === "Unknown" ? "Unknown risk" : `${level} risk`}
    </span>
  );
}

const verificationClass: Record<VerificationStatus, string> = {
  Verified: "badge-verified",
  "Community Review": "badge-community-review",
  "Needs Review": "badge-needs-review",
  Unknown: "badge-unknown",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  return <span className={`badge ${verificationClass[status]}`}>{status}</span>;
}

export type EvidenceLevel = "Verified" | "Observed" | "Inferred" | "Unknown";

const evidenceClass: Record<EvidenceLevel, string> = {
  Verified: "badge-verified",
  Observed: "badge-community-review",
  Inferred: "badge-needs-review",
  Unknown: "badge-unknown",
};

export function EvidenceTag({ level }: { level: EvidenceLevel }) {
  return <span className={`badge ${evidenceClass[level]}`}>{level}</span>;
}
