import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // 페이지 응답의 script-src는 요청마다 nonce가 달라 미들웨어가 붙이고, 여기서는 미들웨어를 거치지 않는 응답도 막히도록 frame-ancestors만 둔다.
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none';",
  },
  {
    key: "Permissions-Policy",
    value: "microphone=(), payment=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow",
  },
];

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  // 응답에 x-powered-by: Next.js를 붙이지 않아 사용 중인 프레임워크를 드러내지 않는다.
  poweredByHeader: false,
  // GA Data API 클라이언트는 gRPC(google-gax)를 써서 webpack으로 묶으면 내부 package.json을 찾지 못한다.
  // 서버에서 node_modules 그대로 불러오도록 번들에서 뺀다.
  serverExternalPackages: ["@google-analytics/data"],
  experimental: {
    reactCompiler: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  async rewrites() {
    if (!apiBaseUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: require.resolve("@svgr/webpack"),
          options: {
            svgo: true,
            titleProp: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false },
                { name: "removeDimensions", active: true },
              ],
            },
            replaceAttrValues: {
              "#000": "currentColor",
              "#000000": "currentColor",
              "#D9D9D9": "currentColor",
            },
          },
        },
      ],
    });
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fmi-project-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
