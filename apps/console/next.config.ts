import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
      },
      {
        protocol: 'https',
        hostname: 'realsestate-atmajo.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.liontoolsmart.com',
      },
    ],
  },
  transpilePackages: ['geist'],

  eslint: {
    ignoreDuringBuilds: true,
  },
};

const nextConfig = baseConfig;
export default nextConfig;
