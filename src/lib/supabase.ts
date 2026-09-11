import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'project_dashboard_supabase_url';
const STORAGE_ANON_KEY = 'project_dashboard_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let lastUrl: string | null = null;
let lastKey: string | null = null;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'storage' | 'none';
}

/**
 * Get current Supabase credentials from either environment variables or LocalStorage
 */
export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  const storedUrl = localStorage.getItem(STORAGE_URL_KEY)?.trim();
  const storedKey = localStorage.getItem(STORAGE_ANON_KEY)?.trim();

  if (storedUrl && storedKey) {
    return { url: storedUrl, anonKey: storedKey, source: 'storage' };
  }

  return { url: '', anonKey: '', source: 'none' };
}

/**
 * Save Supabase credentials directly from the in-app UI
 */
export function setSupabaseConfig(url: string, anonKey: string): void {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (cleanUrl && cleanKey) {
    localStorage.setItem(STORAGE_URL_KEY, cleanUrl);
    localStorage.setItem(STORAGE_ANON_KEY, cleanKey);
  } else {
    clearSupabaseConfig();
  }

  // Reset client cache so new client is initialized
  cachedClient = null;
  lastUrl = null;
  lastKey = null;
}

/**
 * Remove stored credentials
 */
export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_ANON_KEY);
  cachedClient = null;
  lastUrl = null;
  lastKey = null;
}

/**
 * Check whether Supabase credentials are configured
 */
export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

/**
 * Get the Supabase client instance, recreating it if credentials changed
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();

  if (!config.url || !config.anonKey) {
    return null;
  }

  if (cachedClient && lastUrl === config.url && lastKey === config.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

    lastUrl = config.url;
    lastKey = config.anonKey;

    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Test connectivity to the Supabase database
 */
export async function testSupabaseConnection(
  testUrl?: string,
  testKey?: string
): Promise<{ success: boolean; message: string; taskCount?: number }> {
  let client: SupabaseClient | null = null;

  if (testUrl && testKey) {
    try {
      client = createClient(testUrl.trim(), testKey.trim());
    } catch (e) {
      return { success: false, message: `URL atau Key tidak valid: ${(e as Error).message}` };
    }
  } else {
    client = getSupabaseClient();
  }

  if (!client) {
    return { success: false, message: 'Kredensial Supabase belum diisi.' };
  }

  try {
    const { count, error } = await client
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Tabel "tasks" belum dibuat di database. Jalankan script supabase/schema.sql di SQL Editor Supabase terlebih dahulu.',
        };
      }
      return { success: false, message: `Supabase Error: ${error.message}` };
    }

    return {
      success: true,
      message: `Terhubung ke Supabase! Ditemukan ${count ?? 0} data pekerjaan.`,
      taskCount: count ?? 0,
    };
  } catch (err) {
    return { success: false, message: `Gagal terhubung: ${(err as Error).message}` };
  }
}
