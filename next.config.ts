import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // All <Image> usages in this app pass `unoptimized` (media is served straight
    // from R2), so the built-in optimizer/sharp is never actually needed —
    // disabling it removes that attack surface entirely rather than just patching it.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDIA_HOSTNAME || "**",
      },
    ],
  },
};

export default nextConfig;
