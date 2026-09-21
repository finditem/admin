import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
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
