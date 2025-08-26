import { PrismaClient } from "@/generated/prisma";

// Prevent multiple instances of Prisma Client in dev (Next.js hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"], // optional logs
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
