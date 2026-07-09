import { getPlugins } from "@/lib/sheets";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";

export const revalidate = 3600;

/**
 * /llms.txt — a concise, machine-readable index of the site for AI agents,
 * following the https://llmstxt.org convention. Generated from the same
 * spreadsheet data as the site, so it is always in sync.
 */
export async function GET(): Promise<Response> {
  const base = siteUrl();
  const plugins = await getPlugins();

  const lines = [
    `# ${SITE_NAME}`,
    ``,
    `> ${SITE_DESCRIPTION} Each review documents what data a design plugin can access, which permissions it requests, and which external services, APIs, AI providers, analytics platforms or cloud storage it communicates with. Findings are labeled Verified, Observed, Inferred or Unknown — Unknown values are explicitly marked, never guessed.`,
    ``,
    `Reviews are snapshots of a plugin at its review date; plugins can change behavior in any update. Risk levels are Low, Medium, High or Unknown. Verification statuses are Verified, Community Review, Needs Review or Unknown.`,
    ``,
    `## Plugin reviews`,
    ``,
    ...plugins.map(
      (p) =>
        `- [${p.name}](${base}/plugins/${p.slug}): ${p.platform} · ${p.developer} · ${p.riskLevel} risk · ${p.verificationStatus} · ${p.description}`
    ),
    ``,
    `## Documentation`,
    ``,
    `- [How We Review](${base}/how-we-review): review process, confidence scoring, and the exact meaning of Verified, Observed, Inferred and Unknown`,
    `- [About](${base}/about): mission, values, open source, and credits`,
    `- [Submit Plugin](${base}/submit): request a review for a plugin not yet in the directory`,
    ``,
    `## Optional`,
    ``,
    `- [Full review data](${base}/llms-full.txt): every review in full, as markdown`,
    ``,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
