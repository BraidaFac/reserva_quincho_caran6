import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function parseDbUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: Number(u.port) || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace("/", ""),
  };
}

function createClient(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaMariaDb(parseDbUrl(process.env.DATABASE_URL!)),
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
}

// Lazy proxy — defers client creation to first use (request time, not build time)
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client =
      globalForPrisma.prisma ??
      (() => {
        const c = createClient();
        globalForPrisma.prisma = c;
        return c;
      })();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
