import { TimelineTask, ProjectMetadata } from '../types/timeline';

export interface DatabaseStatus {
  success: boolean;
  database: string;
  orm: string;
  connected: boolean;
  latencyMs?: number;
  taskCount?: number;
  metadataCount?: number;
  error?: string;
  timestamp?: string;
}

// 1. Check Database Health & Connectivity
export async function checkDatabaseHealth(): Promise<DatabaseStatus> {
  try {
    const res = await fetch('/api/status', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      database: 'Neon PostgreSQL',
      orm: 'Prisma',
      connected: false,
      error: err?.message || 'Gagal terhubung ke API server',
    };
  }
}

// 2. Fetch all tasks from Neon DB via Prisma API
export async function fetchTasksFromApi(): Promise<TimelineTask[] | null> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      return json.data.map((row: any) => ({
        id: Number(row.id),
        phase: String(row.phase || ''),
        task: String(row.task || ''),
        output: String(row.output || ''),
        pic: String(row.pic || ''),
        target: Number(row.target ?? 1),
        capaian: Number(row.capaian ?? 0),
        progress: row.progress || 'Plan',
        weeks: Array.isArray(row.weeks) ? row.weeks : [],
        actualWeeks: Array.isArray(row.actualWeeks) ? row.actualWeeks : [],
        notes: row.notes || undefined,
      }));
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch tasks from Neon/Prisma API (offline or error):', err);
    return null;
  }
}

// 3. Fetch project metadata
export async function fetchMetadataFromApi(): Promise<ProjectMetadata | null> {
  try {
    const res = await fetch('/api/metadata', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json = await res.json();
    if (json.success && json.data) {
      const d = json.data;
      return {
        title: d.title,
        institution: d.institution,
        contractor: d.contractor,
        totalWeeks: Number(d.totalWeeks || 24),
        cutoffWeek: Number(d.cutoffWeek || 13),
        badgeText: d.badgeText || 'Live Sync',
        lastUpdated: d.lastUpdated || 'September 2026',
      };
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch metadata from Neon/Prisma API:', err);
    return null;
  }
}

// 4. Upsert single task
export async function upsertTaskToApi(task: TimelineTask): Promise<boolean> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Error upserting task to Neon/Prisma API:', err);
    return false;
  }
}

// 5. Bulk sync tasks (e.g. from Excel upload)
export async function syncAllTasksToApi(tasks: TimelineTask[]): Promise<boolean> {
  try {
    const res = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tasks),
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Error bulk syncing tasks to Neon/Prisma API:', err);
    return false;
  }
}

// 6. Delete task by ID
export async function deleteTaskFromApi(taskId: number): Promise<boolean> {
  try {
    const res = await fetch(`/api/tasks?id=${taskId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Error deleting task via Neon/Prisma API:', err);
    return false;
  }
}

// 7. Update project metadata
export async function updateMetadataToApi(metadata: ProjectMetadata): Promise<boolean> {
  try {
    const res = await fetch('/api/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Error updating metadata via Neon/Prisma API:', err);
    return false;
  }
}

// 8. Trigger seed default data
export async function seedDatabaseApi(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    return { success: !!json.success, message: json.message || json.error };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Gagal menjalankan seed' };
  }
}
