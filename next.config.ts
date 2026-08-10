import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows any HTTPS domain
      },
      {
        protocol: 'http',
        hostname: '**', // allows any HTTP domain
      },
    ],
  },
};

export default nextConfig;
