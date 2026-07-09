import { UNKNOWN, type Plugin } from "@/lib/plugins";
import { getPlugins } from "@/lib/sheets";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";

export const revalidate = 3600;

function field(label: string, value: string): string {
  return `- ${label}: ${value}`;
}

function listField(label: string, items: string[]): string {
  return field(label, items.length === 0 ? UNKNOWN : items.join("; "));
}

function pluginToMarkdown(plugin: Plugin, base: string): string {
  const resources = [
    plugin.officialUrl && `[Official website](${plugin.officialUrl})`,
    plugin.privacyPolicy && `[Privacy policy](${plugin.privacyPolicy})`,
    plugin.termsOfService && `[Terms of service](${plugin.termsOfService})`,
    plugin.githubUrl && `[GitHub](${plugin.githubUrl})`,
    plugin.supportUrl && `[Support](${plugin.supportUrl})`,
  ].filter((r): r is string => Boolean(r));

  return [
    `## ${plugin.name}`,
    ``,
    `${plugin.description}`,
    ``,
    `Review page: ${base}/plugins/${plugin.slug}`,
    ``,
    field("Platform", plugin.platform),
    field("Category", plugin.category),
    field("Developer", plugin.developer),
    field("Pricing", plugin.pricing),
    field("Risk level", plugin.riskLevel),
    field("Verification status", plugin.verificationStatus),
    ``,
    `### Privacy overview`,
    ``,
    listField("Data accessed", plugin.dataAccessed),
    listField("Permissions requested", plugin.permissions),
    listField("External services", plugin.externalServices),
    listField("External APIs", plugin.externalApis),
    field("Database connections", plugin.databaseConnection),
    field("Authentication", plugin.authentication),
    listField("Cloud storage", plugin.cloudStorage),
    listField("Analytics", plugin.analytics),
    listField("AI providers", plugin.aiServices),
    field("Telemetry", plugin.telemetry),
    field("Cookies", plugin.cookies),
    ``,
    `### Risk assessment`,
    ``,
    field("Why this risk exists", plugin.riskReason),
    field("Mitigation", plugin.mitigation),
    field("Confidence", plugin.confidence),
    ``,
    `### Review methodology`,
    ``,
    field("Summary", plugin.reviewSummary),
    listField("Tests performed", plugin.testsPerformed),
    listField("Evidence", plugin.evidence),
    listField("Known limitations", plugin.limitations),
    field("Reviewer", plugin.reviewer),
    field("Reviewed at", plugin.reviewedAt),
    field("Updated at", plugin.updatedAt),
    ...(resources.length > 0
      ? [``, `### Resources`, ``, ...resources.map((r) => `- ${r}`)]
      : []),
  ].join("\n");
}

/**
 * /llms-full.txt — every review in full, as markdown, for AI agents that
 * want the complete dataset in one request (llmstxt.org convention).
 */
export async function GET(): Promise<Response> {
  const base = siteUrl();
  const plugins = await getPlugins();

  const doc = [
    `# ${SITE_NAME} — full review data`,
    ``,
    `> ${SITE_DESCRIPTION}`,
    ``,
    `"Unknown" always means not yet reviewed — never guessed, and never a judgment. Reviews are snapshots of the plugin at the review date. See ${base}/how-we-review for the methodology and the meaning of Verified, Observed, Inferred and Unknown.`,
    ``,
    ...plugins.map((plugin) => pluginToMarkdown(plugin, base)),
    ``,
  ].join("\n\n");

  return new Response(doc, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
