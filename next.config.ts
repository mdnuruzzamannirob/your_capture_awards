import path from 'node:path';
import type { NextConfig } from 'next';

const remoteImageHosts = new Set([
  'api.yourcaptureawards.com',
  'capture-bucket.sfo3.digitaloceanspaces.com',
  'nyc3.digitaloceanspaces.com',
  'photos.gurushots.com',
  'picsum.photos',
  'i.pravatar.cc',
]);

// Unsplash serves images from several subdomains (images., plus., source.,
// api.) — a wildcard avoids adding a new host every time a different one
// shows up in seeded/placeholder data.
const remoteImageWildcards = ['*.unsplash.com'];

for (const value of [process.env.NEXT_PUBLIC_API_URL, process.env.NEXT_PUBLIC_API_URL_V1]) {
  try {
    if (value) remoteImageHosts.add(new URL(value).hostname);
  } catch {}
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [32, 48, 64, 96, 128, 160, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      ...Array.from(remoteImageHosts).flatMap((hostname) => [
        { protocol: 'https' as const, hostname },
        { protocol: 'http' as const, hostname },
      ]),
      ...remoteImageWildcards.map((hostname) => ({ protocol: 'https' as const, hostname })),
    ],
  },
};

export default nextConfig;
