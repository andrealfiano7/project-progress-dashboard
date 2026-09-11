import { PrismaClient } from '@prisma/client';
import { DEFAULT_TASKS, DEFAULT_METADATA } from '../src/data/defaultData';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. Seed Project Metadata
    await prisma.projectMetadata.upsert({
      where: { id: 'default' },
      update: {
        title: DEFAULT_METADATA.title,
        institution: DEFAULT_METADATA.institution,
        contractor: DEFAULT_METADATA.contractor,
        totalWeeks: DEFAULT_METADATA.totalWeeks,
        cutoffWeek: DEFAULT_METADATA.cutoffWeek,
        badgeText: DEFAULT_METADATA.badgeText || 'Live Sync',
        lastUpdated: DEFAULT_METADATA.lastUpdated,
      },
      create: {
        id: 'default',
        title: DEFAULT_METADATA.title,
        institution: DEFAULT_METADATA.institution,
        contractor: DEFAULT_METADATA.contractor,
        totalWeeks: DEFAULT_METADATA.totalWeeks,
        cutoffWeek: DEFAULT_METADATA.cutoffWeek,
        badgeText: DEFAULT_METADATA.badgeText || 'Live Sync',
        lastUpdated: DEFAULT_METADATA.lastUpdated,
      },
    });

    // 2. Seed Tasks
    let count = 0;
    for (const t of DEFAULT_TASKS) {
      await prisma.task.upsert({
        where: { id: t.id },
        update: {
          phase: t.phase,
          task: t.task,
          output: t.output || '',
          pic: t.pic || '',
          target: t.target,
          capaian: t.capaian,
          progress: t.progress,
          weeks: t.weeks,
          actualWeeks: t.actualWeeks || [],
          notes: t.notes || null,
        },
        create: {
          id: t.id,
          phase: t.phase,
          task: t.task,
          output: t.output || '',
          pic: t.pic || '',
          target: t.target,
          capaian: t.capaian,
          progress: t.progress,
          weeks: t.weeks,
          actualWeeks: t.actualWeeks || [],
          notes: t.notes || null,
        },
      });
      count++;
    }

    return res.status(200).json({
      success: true,
      message: `Database successfully seeded with ${count} tasks and project metadata!`,
      taskCount: count,
    });
  } catch (error: any) {
    console.error('API /api/seed error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to seed database' });
  }
}
