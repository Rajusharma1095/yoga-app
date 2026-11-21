import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The engine and content packages ship TypeScript source, not a build.
  transpilePackages: ['@yoga/engine', '@yoga/content'],
  typedRoutes: true,

  // STATIC_EXPORT=1 emits a plain folder of HTML and assets, for hosts that
  // serve static files only. Everything in the app is client-side, so nothing
  // is lost. A normal build still runs as a Next server.
  ...(process.env.STATIC_EXPORT === '1'
    ? { output: 'export' as const, images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
