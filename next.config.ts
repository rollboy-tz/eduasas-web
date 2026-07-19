import type { NextConfig } from "next";

// 1. Matumizi ya Environment Variables kwa usahihi
const APP_STAGE = process.env.NEXT_PUBLIC_APP_STAGE || "development"; // default to dev
const IS_PROD = APP_STAGE === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Usalama: Kuficha teknolojia inayotumika
  
  // 2. Optimization ya Webpack
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  allowedDevOrigins: [
    "eduasas.local",
    "auth.eduasas.local",
    "me.eduasas.local",
    "admin.eduasas.local"
  ],

  // 3. Headers imara (Security Headers)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Cache Control inapaswa kuwa selective, sio 'no-store' kila mahali
          { key: 'Cache-Control', value: IS_PROD ? 'public, max-age=31536000, immutable' : 'no-store' },
        ],
      },
    ];
  },

  // 4. API Rewrites (Dynamic kulingana na stage)
  async rewrites() {
    const apiBase = IS_PROD 
      ? 'https://api.eduasas.co.tz' 
      : (APP_STAGE === 'staging' ? 'https://staging-api.eduasas.co.tz' : 'http://localhost:5000');
      
    return [
      {
        source: '/main/:path*',
        destination: `${apiBase}/main/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
        { protocol: 'https', hostname: 'api.eduasas.co.tz' },
        // Ongeza hostname nyingine hapa kama picha zinatoka kwenye s3/cloudinary
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;