import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    domains: ['via.placeholder.com', 'random-image-pepebigotes.vercel.app', 'lh3.googleusercontent.com'],
  },
  "rules": {
    "@typescript-eslint/no-empty-object-type": "off",
    reactStrictMode: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
