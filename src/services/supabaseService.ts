import { getSupabaseClient } from '../lib/supabase';
import { TimelineTask, ProjectMetadata } from '../types/timeline';
import { DEFAULT_TASKS, DEFAULT_METADATA } from '../data/defaultData';

export interface DatabaseTask {
  id: number;
  phase: string;
  task: string;
  output: string | null;
  pic: string | null;
  target: number;
  capaian: number;
  progress: string;
  weeks: number[];
  actual_weeks?: number[];
  notes: string | null;
}

export interface DatabaseMetadata {
  id: string;
  title: string;
  institution: string;
  contractor: string;
  total_weeks: number;
  cutoff_week: number;
  badge_text: string;
  last_updated: string;
}

// Convert Database Task to Frontend TimelineTask
export function mapDbTaskToFrontend(db: DatabaseTask): TimelineTask {
  return {
    id: db.id,
    phase: db.phase,
    task: db.task,
    output: db.output || '',
    pic: db.pic || '',
    target: Number(db.target) || 1.0,
    capaian: Number(db.capaian) || 0.0,
    progress: db.progress as TimelineTask['progress'],
    weeks: Array.isArray(db.weeks) ? db.weeks : [],
    actualWeeks: Array.isArray(db.actual_weeks) ? db.actual_weeks : [],
    notes: db.notes || '',
  };
}

// Convert Frontend TimelineTask to Database Task
export function mapFrontendTaskToDb(task: TimelineTask): DatabaseTask {
  return {
    id: task.id,
    phase: task.phase,
    task: task.task,
    output: task.output || '',
    pic: task.pic || '',
    target: task.target,
    capaian: task.capaian,
    progress: task.progress,
    weeks: task.weeks,
    actual_weeks: task.actualWeeks || [],
    notes: task.notes || '',
  };
}

// Convert Database Metadata to Frontend ProjectMetadata
export function mapDbMetadataToFrontend(db: DatabaseMetadata): ProjectMetadata {
  return {
    title: db.title || DEFAULT_METADATA.title,
    institution: db.institution || DEFAULT_METADATA.institution,
    contractor: db.contractor || DEFAULT_METADATA.contractor,
    totalWeeks: db.total_weeks || 24,
    cutoffWeek: db.cutoff_week || 13,
    badgeText: db.badge_text || 'Live Sync',
    lastUpdated: db.last_updated || 'September 2026',
  };
}

/**
 * Fetch all tasks from Supabase ordered by id
 */
export async function fetchTasksFromSupabase(): Promise<TimelineTask[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('tasks')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetch tasks error:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return (data as DatabaseTask[]).map(mapDbTaskToFrontend);
  } catch (err) {
    console.error('Failed to fetch tasks from Supabase:', err);
    return null;
  }
}

/**
 * Fetch project metadata from Supabase
 */
export async function fetchMetadataFromSupabase(): Promise<ProjectMetadata | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('project_metadata')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch metadata error:', error.message);
      return null;
    }

    if (!data) return null;

    return mapDbMetadataToFrontend(data as DatabaseMetadata);
  } catch (err) {
    console.error('Failed to fetch metadata from Supabase:', err);
    return null;
  }
}

/**
 * Insert or update a single task in Supabase
 */
export async function upsertTaskToSupabase(task: TimelineTask): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const dbPayload = mapFrontendTaskToDb(task);
    const { error } = await client.from('tasks').upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert task error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to upsert task to Supabase:', err);
    return false;
  }
}

/**
 * Delete a task from Supabase
 */
export async function deleteTaskFromSupabase(taskId: number): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('tasks').delete().eq('id', taskId);
    if (error) {
      console.error('Supabase delete task error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete task from Supabase:', err);
    return false;
  }
}

/**
 * Update project metadata in Supabase
 */
export async function updateMetadataInSupabase(metadata: ProjectMetadata): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload: DatabaseMetadata = {
      id: 'default',
      title: metadata.title,
      institution: metadata.institution,
      contractor: metadata.contractor,
      total_weeks: metadata.totalWeeks,
      cutoff_week: metadata.cutoffWeek,
      badge_text: metadata.badgeText || 'Live Sync',
      last_updated: metadata.lastUpdated,
    };

    const { error } = await client
      .from('project_metadata')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase update metadata error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update metadata in Supabase:', err);
    return false;
  }
}

/**
 * Batch sync all tasks to Supabase (used during Excel upload)
 */
export async function syncAllTasksToSupabase(tasks: TimelineTask[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // Delete existing tasks first, then bulk insert
    await client.from('tasks').delete().neq('id', 0);

    const dbPayloads = tasks.map(mapFrontendTaskToDb);
    const { error } = await client.from('tasks').insert(dbPayloads);

    if (error) {
      console.error('Supabase batch sync error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to batch sync tasks to Supabase:', err);
    return false;
  }
}

/**
 * Reset Supabase tables to default demo seed data
 */
export async function resetSupabaseToDefaults(): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    await updateMetadataInSupabase(DEFAULT_METADATA);
    await syncAllTasksToSupabase(DEFAULT_TASKS);
    return true;
  } catch (err) {
    console.error('Failed to reset Supabase to defaults:', err);
    return false;
  }
}

/**
 * Subscribe to real-time changes on tasks and metadata
 */
export function subscribeToSupabaseRealtime(
  onTasksChanged: () => void,
  onMetadataChanged: () => void
): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          onTasksChanged();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_metadata' },
        () => {
          onMetadataChanged();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('📡 Connected to Supabase Realtime Channel');
        }
      });

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.error('Failed to subscribe to Supabase realtime:', err);
    return null;
  }
}
