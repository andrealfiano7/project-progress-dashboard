import { prisma } from './_db';

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
    // Test database connection by counting tasks and metadata
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
    return res.status(500).json({
      success: false,
      database: 'Neon PostgreSQL',
      orm: 'Prisma',
      connected: false,
      latencyMs,
      error: error?.message || 'Failed to connect to Neon PostgreSQL',
      timestamp: new Date().toISOString(),
    });
  }
}
