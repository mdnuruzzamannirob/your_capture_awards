import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'capture-bucket.sfo3.digitaloceanspaces.com',
        pathname: '/captureaward/**',
      },
      {
        protocol: 'http',
        hostname: 'capture-bucket.sfo3.digitaloceanspaces.com',
        pathname: '/captureaward/**',
      },
    ],
  },
};

export default nextConfig;
