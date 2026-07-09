import { promises as fs } from "fs";
import path from "path";
import { parseCsvRecords } from "./csv";
import { recordToPlugin, type Plugin } from "./plugins";

/**
 * The directory is powered by a public Google Spreadsheet — the single
 * source of truth. We read its CSV export (no credentials needed), so
 * editing the sheet updates the site on the next revalidation.
 *
 * When SHEET_ID is unset (or the fetch fails at build time with no cached
 * data), the bundled sample data in data/sample.csv is used so the project
 * works out of the box.
 */
const REVALIDATE_SECONDS = 3600;

function sheetCsvUrl(sheetId: string): string {
  const gid = process.env.SHEET_GID ?? "0";
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

async function fetchCsv(): Promise<string> {
  const sheetId = process.env.SHEET_ID;

  if (sheetId) {
    try {
      const res = await fetch(sheetCsvUrl(sheetId), {
        next: { revalidate: REVALIDATE_SECONDS },
      });
      if (res.ok) return await res.text();
      console.error(`Sheet fetch failed with status ${res.status}; falling back to sample data.`);
    } catch (err) {
      console.error("Sheet fetch failed; falling back to sample data.", err);
    }
  }

  return fs.readFile(path.join(process.cwd(), "data", "sample.csv"), "utf8");
}

export async function getPlugins(): Promise<Plugin[]> {
  const csv = await fetchCsv();
  return parseCsvRecords(csv)
    .map(recordToPlugin)
    .filter((plugin): plugin is Plugin => plugin !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPluginBySlug(slug: string): Promise<Plugin | null> {
  const plugins = await getPlugins();
  return plugins.find((plugin) => plugin.slug === slug) ?? null;
}
