import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // Inakagua mabadiliko kila baada ya sekunde 1
        aggregateTimeout: 300,
      }
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  compress: true, // Inapunguza ukubwa wa data zinazotumwa kwa mwalimu
  images: {
    unoptimized: false, // Inasaidia picha za wanafunzi zipakie haraka (optimization)
  },
  allowedDevOrigins: [
    '3000-firebase-eduasas-1772022732523.cluster-cbeiita7rbe7iuwhvjs5zww2i4.cloudworkstations.dev'
  ],
  async rewrites() {
    return [
      {
        source: '/main/:path*',
        destination: process.env.NODE_ENV === "development" ? 'http://localhost:5000/main/:path' : 'https://api.eduasas.co.tz/main/:path*',
      },
    ];
  },
};

export default withPWA(nextConfig);