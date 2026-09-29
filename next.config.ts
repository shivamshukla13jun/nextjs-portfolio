import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The SPA handles all client-side routing (/, /projects/..., /admin/...)
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
