import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets `npm run check` build without clobbering the dev server's .next dir.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: {
    // Plugin logos live wherever the spreadsheet points; allow any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
