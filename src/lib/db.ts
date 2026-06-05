import { PrismaClient } from "@prisma/client/edge";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const clientsMap = new WeakMap<any, PrismaClient>();
let globalPrisma: PrismaClient | null = null;

function getDb() {
  let cfEnv: any = null;
  let cfCtx: any = null;

  try {
    const context = getCloudflareContext();
    cfEnv = context.env;
    cfCtx = context.ctx;
  } catch (e) {
    // Ignore error - we might be in a non-Cloudflare environment (e.g. CLI, local dev)
  }

  // Use the context object as a key for caching to avoid "Cannot perform I/O" error on Cloudflare
  if (cfCtx) {
    if (clientsMap.has(cfCtx)) {
      return clientsMap.get(cfCtx)!;
    }
  } else if (globalPrisma) {
    return globalPrisma;
  }

  let url = cfEnv?.DATABASE_URL || process.env.DATABASE_URL || "file:./dev.db";
  let authToken = cfEnv?.DATABASE_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN;

  console.log("[getDb DEBUG] cfEnv:", cfEnv);
  console.log("[getDb DEBUG] process.env.DATABASE_URL:", process.env.DATABASE_URL);
  console.log("[getDb DEBUG] Resolved url:", url);

  let client;
  if (url.startsWith("file:")) {
    // In Node.js (build/next dev), require the native client to support local SQLite files
    const { createClient: createNodeClient } = require("@libsql/client");
    client = createNodeClient({ url });
  } else {
    // In Cloudflare Worker or remote, use the web-compatible client
    const { createClient: createWebClient } = require("@libsql/client/web");
    client = createWebClient({ url, authToken });
  }

  const { PrismaLibSQL } = require("@prisma/adapter-libsql");
  const adapter = new PrismaLibSQL(client);
  const prismaClient = new PrismaClient({ adapter });

  if (cfCtx) {
    clientsMap.set(cfCtx, prismaClient);
  } else {
    globalPrisma = prismaClient;
  }

  return prismaClient;
}

export const db = new Proxy({} as any, {
  get(target, prop) {
    const client = getDb();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  }
}) as PrismaClient;
