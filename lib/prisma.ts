import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient, pgPool: Pool };

if (!globalForPrisma.pgPool) {
  globalForPrisma.pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(globalForPrisma.pgPool),
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
