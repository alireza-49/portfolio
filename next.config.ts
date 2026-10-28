import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Rich posts carry tables, demo payloads and notebooks; the default 1 MB
  // Server Action limit would reject a legitimate save.
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  // `pg` opens raw TCP sockets; keep it outside the bundler.
  serverExternalPackages: ["pg"],
  // The console applies its idempotent schema on the first query, so the SQL
  // file has to travel with the server bundle on Vercel.
  outputFileTracingIncludes: {
    "/*": ["./src/lib/schema.sql"],
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
