import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/cafes/:path",
        destination: "/cafes/md/:path",
        has: [
          {
            type: "header",
            key: "accept",
            value: "text/markdown",
          },
        ],
      },
      {
        source: "/cafes/:path.md",
        destination: "/cafes/md/:path",
      },
    ];
  },
};

export default nextConfig;
