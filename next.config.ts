import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

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
