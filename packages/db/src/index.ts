import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
declare global {
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = global as typeof globalThis & { prisma?: PrismaClient };
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
export { db };
