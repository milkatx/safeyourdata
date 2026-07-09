export const SITE_NAME = "Is Your Data Safe?";
export const SITE_DESCRIPTION =
  "A community-driven directory helping designers understand how plugins and assets handle their data.";

export const GITHUB_URL = "https://github.com/milkatx/safeyourdata";
export const CONTACT_EMAIL = "milkadesign@gmail.com";

export const UPSTREAM_NAME = "Brazilians Who Design";
export const UPSTREAM_URL = "https://github.com/zehfernandes/brazilianswhodesign";

export function siteUrl(): string {
  return process.env.SITE_URL ?? "https://safeyourdata.vercel.app";
}
