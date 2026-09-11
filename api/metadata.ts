import { PrismaClient } from '@prisma/client';

const NEON_DB_URL =
  'postgresql://neondb_owner:npg_8jry2JKwGstd@ep-wandering-water-b3n7fufp-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma =
  (globalThis as any).prismaClientGlobal ||
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || NEON_DB_URL,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prismaClientGlobal = prisma;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. GET: Fetch Project Metadata
    if (req.method === 'GET') {
      let meta = await prisma.projectMetadata.findUnique({
        where: { id: 'default' },
      });

      if (!meta) {
        meta = await prisma.projectMetadata.create({
          data: {
            id: 'default',
            title: 'Timeline Implementasi BCM',
            institution: 'PT Angkasa Pura Indonesia (API)',
            contractor: 'Centrois Consulting',
            totalWeeks: 24,
            cutoffWeek: 1,
            badgeText: 'Live Sync',
            lastUpdated: 'September 2026',
          },
        });
      }

      return res.status(200).json({ success: true, data: meta });
    }

    // 2. POST / PUT: Update Project Metadata
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, institution, contractor, totalWeeks, cutoffWeek, badgeText, lastUpdated } = body;

      const updated = await prisma.projectMetadata.upsert({
        where: { id: 'default' },
        update: {
          ...(title !== undefined && { title }),
          ...(institution !== undefined && { institution }),
          ...(contractor !== undefined && { contractor }),
          ...(totalWeeks !== undefined && { totalWeeks: Number(totalWeeks) }),
          ...(cutoffWeek !== undefined && { cutoffWeek: Number(cutoffWeek) }),
          ...(badgeText !== undefined && { badgeText }),
          ...(lastUpdated !== undefined && { lastUpdated }),
        },
        create: {
          id: 'default',
          title: title || 'Timeline Implementasi BCM',
          institution: institution || 'PT Angkasa Pura Indonesia (API)',
          contractor: contractor || 'Centrois Consulting',
          totalWeeks: Number(totalWeeks || 24),
          cutoffWeek: Number(cutoffWeek || 1),
          badgeText: badgeText || 'Live Sync',
          lastUpdated: lastUpdated || 'September 2026',
        },
      });

      return res.status(200).json({ success: true, data: updated });
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error('API /api/metadata error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal Server Error' });
  }
}
