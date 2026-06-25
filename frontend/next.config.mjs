import nextEnv from '@next/env';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { loadEnvConfig } = nextEnv;
const appDir = path.dirname(fileURLToPath(import.meta.url));
loadEnvConfig(path.resolve(appDir, '..'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
};

export default nextConfig;


