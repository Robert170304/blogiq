import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    domains: ['via.placeholder.com', 'random-image-pepebigotes.vercel.app'],
  }
};

export default nextConfig;
