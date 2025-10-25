import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
