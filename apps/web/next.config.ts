import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The engine and content packages ship TypeScript source, not a build.
  transpilePackages: ['@yoga/engine', '@yoga/content'],
  typedRoutes: true,
};

export default nextConfig;
