import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
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
