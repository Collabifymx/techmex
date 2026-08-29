import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async rewrites() {
    return [
      { source: "/proyecto/:slug.md", destination: "/md/proyecto/:slug" },
      { source: "/blog/:slug.md", destination: "/md/blog/:slug" },
    ];
  },
};

export default nextConfig;
