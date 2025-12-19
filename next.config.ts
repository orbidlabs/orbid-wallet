import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
        pathname: '/coins/images/**',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        pathname: '/static/img/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dexscreener.com',
        pathname: '/cms/images/**',
      },
    ],
  },
};

export default nextConfig;

