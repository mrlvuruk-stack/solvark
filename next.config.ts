import type { NextConfig } from "next";

if (process.env.NODE_ENV === "development") {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    ".prisma/client",
    "@libsql/isomorphic-ws",
    "@libsql/client",
    "@prisma/adapter-libsql"
  ],
};

export default nextConfig;
