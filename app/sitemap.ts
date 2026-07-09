import type { MetadataRoute } from "next";
import { getPlugins } from "@/lib/sheets";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const plugins = await getPlugins();

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/how-we-review`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/submit`, changeFrequency: "monthly", priority: 0.5 },
    ...plugins.map((plugin) => ({
      url: `${base}/plugins/${plugin.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
