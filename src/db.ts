import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    // Keep TCP connections alive so idle sockets aren't silently dropped by
    // Docker/network NAT timeouts, which otherwise leaves the pool holding
    // dead connections that throw on the next query until the process restarts.
    keepAlive: true,
  });

  // A pooled client emits 'error' when its connection is lost while idle.
  // Without a listener, that unhandled 'error' event can crash the process.
  pool.on("error", (err) => {
    console.error("Unexpected error on idle Postgres client", err);
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
