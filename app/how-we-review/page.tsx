import type { Metadata } from "next";
import Link from "next/link";
import Title from "@/components/Title";
import { EvidenceTag } from "@/components/Badges";

export const metadata: Metadata = {
  title: "How We Review",
  description:
    "Our review process for design plugins: permission inspection, privacy policy analysis, traffic inspection, and how we label Verified, Observed, Inferred and Unknown.",
};

const processSteps = [
  {
    title: "Permission inspection",
    body: "We read the plugin manifest and platform listing to record exactly which permissions the plugin requests — file access, network access, selection access, export access.",
  },
  {
    title: "Privacy policy analysis",
    body: "We read the developer’s privacy policy and terms of service, noting what data collection they declare, retention periods, and third-party sharing.",
  },
  {
    title: "Documentation review",
    body: "Official docs, changelogs and support pages often describe external services, sync features and account requirements that listings omit.",
  },
  {
    title: "Traffic inspection (when applicable)",
    body: "Where possible we run the plugin and observe its network requests: which hosts it contacts, what payloads leave the file, and when.",
  },
  {
    title: "External API verification",
    body: "We identify the APIs a plugin calls and check whether they belong to the developer, a cloud provider, an analytics platform, or an AI service.",
  },
  {
    title: "Authentication verification",
    body: "If the plugin uses accounts, OAuth or license keys, we record what the authentication unlocks and what identity data it ties usage to.",
  },
  {
    title: "Cloud service inspection",
    body: "For plugins that sync or export, we document where assets are stored and what the vendor states about encryption and retention.",
  },
  {
    title: "Manual testing",
    body: "We use the plugin the way a designer would, watching for behavior that documentation doesn’t mention.",
  },
] as const;

const evidenceLevels = [
  {
    level: "Verified" as const,
    body: "We independently confirmed this — for example by inspecting network traffic or source code ourselves.",
  },
  {
    level: "Observed" as const,
    body: "We saw this behavior during manual testing, but have not exhaustively confirmed it holds in all cases.",
  },
  {
    level: "Inferred" as const,
    body: "Stated in documentation or a privacy policy, or reasonably concluded from how the feature must work — but not directly confirmed by us.",
  },
  {
    level: "Unknown" as const,
    body: "We don’t know. An Unknown is never a judgment — it marks exactly where our review stopped.",
  },
] as const;

export default function HowWeReviewPage() {
  return (
    <>
      <Link href="/" className="auxNav arrowback" aria-label="Back to directory">
        ←
      </Link>

      <Title className="title m0 p0" text="How we*review" noAnimation />

      <div className="moreabout">
        <p>
          Every review follows the same process, and every conclusion is
          labeled with how we reached it. We never overstate conclusions: if we
          didn’t verify something, the review says so.
        </p>

        <h3>The process</h3>
        <ol className="m-0 list-none p-0">
          {processSteps.map((step, i) => (
            <li key={step.title} className="border-b border-[#363636] py-5 last:border-b-0">
              <h4 className="m-0 text-[1.2rem] font-medium">
                <span className="mr-3 text-[#757575]">{String(i + 1).padStart(2, "0")}</span>
                {step.title}
              </h4>
              <p className="mt-2 mb-0">{step.body}</p>
            </li>
          ))}
        </ol>

        <h3>How we label what we know</h3>
        <p>
          The same words appear on every plugin page. They mean exactly this,
          every time:
        </p>
        <ul className="m-0 list-none p-0">
          {evidenceLevels.map(({ level, body }) => (
            <li key={level} className="border-b border-[#363636] py-5 last:border-b-0">
              <EvidenceTag level={level} />
              <p className="mt-3 mb-0">{body}</p>
            </li>
          ))}
        </ul>

        <h3>Confidence score</h3>
        <p>
          Each review carries an overall confidence level — Low, Medium or High
          — reflecting how much of the process above we were able to complete.
          A review based only on reading a privacy policy is Low confidence,
          even if nothing concerning was found. Confidence rises only with
          traffic inspection, source review, or repeated testing.
        </p>

        <h3>Limitations</h3>
        <p>
          Reviews are snapshots: a plugin can change behavior in any update.
          Closed-source plugins can’t be fully audited. Server-side behavior —
          what a vendor does with data after it leaves your machine — can never
          be directly observed, only inferred from policies. That is why every
          review lists its known limitations and its review date, and why
          “Unknown” appears so often. Transparency about what we don’t know is
          the point.
        </p>
      </div>
    </>
  );
}
