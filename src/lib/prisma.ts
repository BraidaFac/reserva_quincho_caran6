import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createClient(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
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
        if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = c;
        return c;
      })();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
