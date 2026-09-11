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
  // Set CORS headers
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
    // 1. GET: Fetch all tasks
    if (req.method === 'GET') {
      const tasks = await prisma.task.findMany({
        orderBy: { id: 'asc' },
      });
      return res.status(200).json({ success: true, data: tasks });
    }

    // 2. POST: Upsert single task
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, phase, task, output, pic, target, capaian, progress, weeks, actualWeeks, notes } = body;

      if (!id || !task || !phase) {
        return res.status(400).json({ success: false, error: 'Missing required task fields (id, task, phase)' });
      }

      const upserted = await prisma.task.upsert({
        where: { id: Number(id) },
        update: {
          phase,
          task,
          output: output || '',
          pic: pic || '',
          target: Number(target ?? 1),
          capaian: Number(capaian ?? 0),
          progress: progress || 'Plan',
          weeks: Array.isArray(weeks) ? weeks : [],
          actualWeeks: Array.isArray(actualWeeks) ? actualWeeks : [],
          notes: notes || null,
        },
        create: {
          id: Number(id),
          phase,
          task,
          output: output || '',
          pic: pic || '',
          target: Number(target ?? 1),
          capaian: Number(capaian ?? 0),
          progress: progress || 'Plan',
          weeks: Array.isArray(weeks) ? weeks : [],
          actualWeeks: Array.isArray(actualWeeks) ? actualWeeks : [],
          notes: notes || null,
        },
      });

      return res.status(200).json({ success: true, data: upserted });
    }

    // 3. PUT: Bulk upsert / sync all tasks (e.g. from Excel upload)
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const tasksList = Array.isArray(body) ? body : body?.tasks;

      if (!Array.isArray(tasksList)) {
        return res.status(400).json({ success: false, error: 'Request body must be an array of tasks or { tasks: [] }' });
      }

      const results = [];
      for (const t of tasksList) {
        const item = await prisma.task.upsert({
          where: { id: Number(t.id) },
          update: {
            phase: t.phase,
            task: t.task,
            output: t.output || '',
            pic: t.pic || '',
            target: Number(t.target ?? 1),
            capaian: Number(t.capaian ?? 0),
            progress: t.progress || 'Plan',
            weeks: Array.isArray(t.weeks) ? t.weeks : [],
            actualWeeks: Array.isArray(t.actualWeeks) ? t.actualWeeks : [],
            notes: t.notes || null,
          },
          create: {
            id: Number(t.id),
            phase,
            task: t.task,
            output: t.output || '',
            pic: t.pic || '',
            target: Number(t.target ?? 1),
            capaian: Number(t.capaian ?? 0),
            progress: t.progress || 'Plan',
            weeks: Array.isArray(t.weeks) ? t.weeks : [],
            actualWeeks: Array.isArray(t.actualWeeks) ? t.actualWeeks : [],
            notes: t.notes || null,
          },
        });
        results.push(item);
      }

      return res.status(200).json({ success: true, count: results.length, data: results });
    }

    // 4. DELETE: Delete task by id
    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Task ID is required for deletion' });
      }

      await prisma.task.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({ success: true, message: `Task ${id} deleted` });
    }

    return res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  } catch (error: any) {
    console.error('API /api/tasks error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal Server Error' });
  }
}
