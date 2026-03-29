import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.INTERNAL_BACKEND_URL || "http://flyhigh_backend:5000"}/api/:path*`,
      },
    ];
  },
};

export default withNextVideo(nextConfig, { folder: 'public-vid' });