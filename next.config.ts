import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDIA_HOSTNAME || "**",
      },
    ],
  },
};

export default nextConfig;
