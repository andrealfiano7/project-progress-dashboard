export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const startTime = Date.now();
  try {
    const { PrismaClient } = await import('@prisma/client');
    const NEON_DB_URL =
      'postgresql://neondb_owner:npg_8jry2JKwGstd@ep-wandering-water-b3n7fufp-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

    const prisma =
      (globalThis as any).prisma ||
      new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL || NEON_DB_URL,
      });

    if (process.env.NODE_ENV !== 'production') {
      (globalThis as any).prisma = prisma;
    }

    const taskCount = await prisma.task.count();
    const metadataCount = await prisma.projectMetadata.count();
    const latencyMs = Date.now() - startTime;

    return res.status(200).json({
      success: true,
      database: 'Neon PostgreSQL',
      orm: 'Prisma',
      connected: true,
      latencyMs,
      taskCount,
      metadataCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('API /api/status error:', error);
    const latencyMs = Date.now() - startTime;
    return res.status(200).json({
      success: false,
      database: 'Neon PostgreSQL',
      orm: 'Prisma',
      connected: false,
      latencyMs,
      error: error?.message || String(error),
      stack: error?.stack,
      timestamp: new Date().toISOString(),
    });
  }
}
