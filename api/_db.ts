import { PrismaClient } from '@prisma/client';

const NEON_DB_URL =
  'postgresql://neondb_owner:npg_8jry2JKwGstd@ep-wandering-water-b3n7fufp-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

declare global {
  // eslint-disable-next-line no-var
  var prismaClientGlobal: PrismaClient | undefined;
}

export const prisma =
  globalThis.prismaClientGlobal ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || NEON_DB_URL,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaClientGlobal = prisma;
}

export default prisma;
