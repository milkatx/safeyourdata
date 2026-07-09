import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Title from "@/components/Title";
import { ArrowLeft } from "@/components/Arrows";
import { RiskBadge, VerificationBadge } from "@/components/Badges";
import { DataList, DetailSection, ListValue, Value } from "@/components/Detail";
import { UNKNOWN, type Plugin } from "@/lib/plugins";
import { getPluginBySlug, getPlugins } from "@/lib/sheets";
import { SITE_NAME, siteUrl } from "@/lib/site";

export const revalidate = 3600;

interface Params {
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const plugins = await getPlugins();
  return plugins.map((plugin) => ({ slug: plugin.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plugin = await getPluginBySlug(slug);
  if (!plugin) return {};
  return {
    title: `${plugin.name} — privacy & security review`,
    description: plugin.description,
    openGraph: {
      title: `${plugin.name} | ${SITE_NAME}`,
      description: plugin.description,
      url: `${siteUrl()}/plugins/${plugin.slug}`,
      type: "article",
    },
  };
}

export default async function PluginPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const plugin = await getPluginBySlug(slug);
  if (!plugin) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: plugin.name,
    applicationCategory: plugin.category,
    operatingSystem: plugin.platform,
    ...(plugin.officialUrl ? { url: plugin.officialUrl } : {}),
    ...(plugin.developer !== UNKNOWN
      ? { author: { "@type": "Organization", name: plugin.developer } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/" className="auxNav arrowback" aria-label="Back to directory">
        <ArrowLeft className="text-[2rem]" />
      </Link>

      <Title className="title m0 p0" text={plugin.name} noAnimation />

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <RiskBadge level={plugin.riskLevel} />
        <VerificationBadge status={plugin.verificationStatus} />
      </div>

      <div className="max-w-4xl">
        <p className="mt-10 max-w-2xl text-[1.4rem] leading-snug">
          {plugin.description}
        </p>

        <DataList
          rows={[
            { label: "Platform", value: <Value value={plugin.platform} /> },
            { label: "Category", value: <Value value={plugin.category} /> },
            { label: "Developer", value: <Value value={plugin.developer} /> },
            { label: "Pricing", value: <Value value={plugin.pricing} /> },
            {
              label: "Official website",
              value: plugin.officialUrl ? (
                <a
                  href={plugin.officialUrl}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {new URL(plugin.officialUrl).hostname}
                </a>
              ) : (
                <Value value={UNKNOWN} />
              ),
            },
          ]}
        />

        <DetailSection id="summary" title="Review summary">
          <p className="mt-6 leading-relaxed text-[#d4d4d4]">
            <Value value={plugin.reviewSummary} />
          </p>
        </DetailSection>

        <DetailSection id="privacy" title="Privacy overview">
          <p className="mt-4 mb-6 text-sm text-[#757575]">
            What this plugin can access and where data may go. “Unknown” means
            we have not verified it — not that it is safe or unsafe.
          </p>
          <DataList
            rows={[
              {
                label: "Data accessed",
                value: <ListValue items={plugin.dataAccessed} />,
              },
              {
                label: "Permissions requested",
                value: <ListValue items={plugin.permissions} />,
              },
              {
                label: "External services",
                value: <ListValue items={plugin.externalServices} />,
              },
              {
                label: "External APIs",
                value: <ListValue items={plugin.externalApis} />,
              },
              {
                label: "Database connections",
                value: <Value value={plugin.databaseConnection} />,
              },
              {
                label: "Authentication",
                value: <Value value={plugin.authentication} />,
              },
              {
                label: "Cloud storage",
                value: <ListValue items={plugin.cloudStorage} />,
              },
              {
                label: "Analytics",
                value: <ListValue items={plugin.analytics} />,
              },
              {
                label: "AI providers",
                value: <ListValue items={plugin.aiServices} />,
              },
              { label: "Telemetry", value: <Value value={plugin.telemetry} /> },
              { label: "Cookies", value: <Value value={plugin.cookies} /> },
            ]}
          />
        </DetailSection>

        <DetailSection id="risk" title="Risk assessment">
          <DataList
            rows={[
              {
                label: "Risk level",
                value: <RiskBadge level={plugin.riskLevel} />,
              },
              {
                label: "Why this risk exists",
                value: <Value value={plugin.riskReason} />,
              },
              {
                label: "Mitigation",
                value: <Value value={plugin.mitigation} />,
              },
              {
                label: "Confidence",
                value: <Value value={plugin.confidence} />,
              },
            ]}
          />
        </DetailSection>

        <DetailSection id="methodology" title="Review methodology">
          <DataList
            rows={[
              {
                label: "Tests performed",
                value: <ListValue items={plugin.testsPerformed} />,
              },
              {
                label: "Evidence",
                value: <ListValue items={plugin.evidence} />,
              },
              {
                label: "Known limitations",
                value: <ListValue items={plugin.limitations} />,
              },
              { label: "Reviewer", value: <Value value={plugin.reviewer} /> },
            ]}
          />
          <p className="mt-6 text-sm text-[#757575]">
            Read more about{" "}
            <Link href="/how-we-review" className="link">
              how we review
            </Link>{" "}
            and what Verified, Observed, Inferred and Unknown mean.
          </p>
        </DetailSection>

        <DetailSection id="timeline" title="Review timeline">
          <Timeline plugin={plugin} />
        </DetailSection>

        <DetailSection id="resources" title="Resources">
          <ResourceLinks plugin={plugin} />
        </DetailSection>
      </div>
    </>
  );
}

function Timeline({ plugin }: { plugin: Plugin }) {
  const entries = [
    { date: plugin.reviewedAt, label: "Initial review published" },
    ...(plugin.updatedAt !== UNKNOWN && plugin.updatedAt !== plugin.reviewedAt
      ? [{ date: plugin.updatedAt, label: "Review updated" }]
      : []),
  ].filter((entry) => entry.date !== UNKNOWN);

  if (entries.length === 0) {
    return (
      <p className="mt-6 text-[#757575] italic">
        Unknown — no review dates recorded yet.
      </p>
    );
  }

  return (
    <ol className="m-0 mt-6 list-none p-0">
      {entries.map((entry) => (
        <li
          key={`${entry.date}-${entry.label}`}
          className="flex gap-6 border-b border-[#363636] py-4 last:border-b-0"
        >
          <time dateTime={entry.date} className="w-[8rem] shrink-0 text-[#757575]">
            {entry.date}
          </time>
          <span>{entry.label}</span>
        </li>
      ))}
    </ol>
  );
}

function ResourceLinks({ plugin }: { plugin: Plugin }) {
  const resources = [
    { href: plugin.officialUrl, label: "Official website" },
    { href: plugin.privacyPolicy, label: "Privacy policy" },
    { href: plugin.termsOfService, label: "Terms of service" },
    { href: plugin.githubUrl, label: "GitHub" },
    { href: plugin.supportUrl, label: "Support" },
  ].filter((resource): resource is { href: string; label: string } =>
    Boolean(resource.href)
  );

  if (resources.length === 0) {
    return (
      <p className="mt-6 text-[#757575] italic">
        Unknown — no official resources recorded yet.
      </p>
    );
  }

  return (
    <ul className="m-0 mt-6 list-none p-0">
      {resources.map(({ href, label }) => (
        <li key={href} className="border-b border-[#363636] py-4 last:border-b-0">
          <a href={href} className="link" target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
