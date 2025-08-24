import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Needed for Docker multi-stage build that runs `server.js` from `.next/standalone`
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
