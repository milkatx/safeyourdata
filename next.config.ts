import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Plugin logos live wherever the spreadsheet points; allow any https host.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
