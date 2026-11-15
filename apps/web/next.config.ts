import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Gün 15: lab endpoint'i repodaki migration klasörünü okur → klasörü fonksiyonun paketine dahil et.
  outputFileTracingIncludes: {
    "/api/tutorial/migrations": ["./prisma/migrations/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
