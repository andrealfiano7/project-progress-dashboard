import { PrismaClient } from '@prisma/client';
import { DEFAULT_TASKS, DEFAULT_METADATA } from '../src/data/defaultData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon PostgreSQL database with Prisma...');

  // 1. Seed Project Metadata
  const metadata = await prisma.projectMetadata.upsert({
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
  console.log('Project metadata seeded:', metadata.title);

  // 2. Seed Tasks
  let seededCount = 0;
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
    seededCount++;
  }

  console.log(`Successfully seeded ${seededCount} tasks to Neon PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
