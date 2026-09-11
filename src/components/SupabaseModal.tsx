import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Terminal,
  Unlink
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  setSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection, 
  isSupabaseConfigured 
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionChange: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConnectionChange,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; taskCount?: number } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [configSource, setConfigSource] = useState<'env' | 'storage' | 'none'>('none');

  useEffect(() => {
    if (isOpen) {
      const currentConfig = getSupabaseConfig();
      setUrl(currentConfig.url);
      setAnonKey(currentConfig.anonKey);
      setConfigSource(currentConfig.source);
      setIsConnected(isSupabaseConfigured());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: 'Harap isi Project URL dan Anon Public Key.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testSupabaseConnection(url.trim(), anonKey.trim());
    setIsTesting(false);
    setTestResult(result);

    if (result.success) {
      setSupabaseConfig(url.trim(), anonKey.trim());
      setIsConnected(true);
      setConfigSource('storage');
      onConnectionChange();
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('Putuskan koneksi Supabase? Aplikasi akan beralih ke penyimpanan lokal (LocalStorage).')) {
      clearSupabaseConfig();
      setUrl('');
      setAnonKey('');
      setIsConnected(false);
      setConfigSource('none');
      setTestResult(null);
      onConnectionChange();
    }
  };

  const handleCopySqlSchema = async () => {
    try {
      // Fetch or inline SQL schema
      const response = await fetch('/supabase_setup.sql');
      let sqlText = '';
      if (response.ok) {
        sqlText = await response.text();
      } else {
        // Fallback SQL text summary
        sqlText = `-- Supabase Schema for Project Progress Dashboard
CREATE TABLE IF NOT EXISTS public.project_metadata (
    id TEXT PRIMARY KEY DEFAULT 'default',
    title TEXT NOT NULL DEFAULT 'Timeline Implementasi BCM',
    institution TEXT NOT NULL DEFAULT 'PT Angkasa Pura Indonesia (API)',
    contractor TEXT NOT NULL DEFAULT 'Centrois Consulting',
    total_weeks INTEGER NOT NULL DEFAULT 24,
    cutoff_week INTEGER NOT NULL DEFAULT 13,
    badge_text TEXT NOT NULL DEFAULT 'Live Sync',
    last_updated TEXT NOT NULL DEFAULT 'September 2026',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id INTEGER PRIMARY KEY,
    phase TEXT NOT NULL,
    task TEXT NOT NULL,
    output TEXT,
    pic TEXT,
    target NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    capaian NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    progress TEXT NOT NULL DEFAULT 'Plan',
    weeks INTEGER[] NOT NULL DEFAULT '{}',
    actual_weeks INTEGER[] DEFAULT '{}',
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public on project_metadata" ON public.project_metadata FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow public on tasks" ON public.tasks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks, public.project_metadata;
`;
      }
      await navigator.clipboard.writeText(sqlText);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    } catch (e) {
      console.error('Failed to copy SQL:', e);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Koneksi Database Supabase
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Cloud &amp; Realtime
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Sinkronisasi data progres antar tim dan perangkat secara langsung via PostgreSQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border transition-all ${
            isConnected 
              ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60' 
              : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 p-1.5 rounded-lg ${
                  isConnected 
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' 
                    : 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                }`}>
                  {isConnected ? <Radio className="w-4 h-4 animate-pulse" /> : <AlertCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-xs sm:text-sm font-bold ${
                      isConnected ? 'text-emerald-900 dark:text-emerald-200' : 'text-amber-900 dark:text-amber-200'
                    }`}>
                      {isConnected ? 'Status: Terhubung ke Supabase Cloud (Live Sync Aktif)' : 'Status: Mode Penyimpanan Lokal (Offline / LocalStorage)'}
                    </h4>
                    {configSource === 'env' && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300">
                        ENV File
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {isConnected 
                      ? 'Seluruh penambahan, pengeditan, atau pengunggahan file Excel akan otomatis tersinkronisasi ke database cloud dan tersaji real-time di semua layar yang terbuka.'
                      : 'Data saat ini tersimpan di browser ini saja. Hubungkan Supabase agar data progres dapat diakses bersama tim dan dari smartphone mana saja.'}
                  </p>
                </div>
              </div>

              {isConnected && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="shrink-0 ml-2 px-2.5 py-1 text-xs rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 transition-colors border border-rose-200 dark:border-rose-900/50 flex items-center space-x-1"
                  title="Putuskan koneksi ke database Supabase"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Putuskan</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Setup Guide Card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-850/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Panduan 4 Langkah Menyiapkan Database Supabase:</span>
              </span>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center"
              >
                <span>Buka Supabase.com</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Buat proyek baru gratis di <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-sky-600 dark:text-sky-400 font-medium underline">supabase.com</a>.</li>
              <li>Buka menu <strong>SQL Editor</strong> di dashboard Supabase proyek Anda, lalu klik <strong>New Query</strong>.</li>
              <li>
                Salin seluruh script SQL (tabel, kebijakan RLS, realtime &amp; seed 21 tugas) dengan klik tombol berikut:
                <div className="mt-1.5">
                  <button
                    type="button"
                    onClick={handleCopySqlSchema}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-white stroke-[3]" />
                        Berhasil Disalin ke Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Salin Script SQL Schema (supabase/schema.sql)
                      </>
                    )}
                  </button>
                </div>
              </li>
              <li>Tempel (Paste) script di SQL Editor Supabase, klik <strong>Run</strong>, lalu salin <strong>Project URL</strong> &amp; <strong>anon key</strong> ke form di bawah ini.</li>
            </ol>
          </div>

          {/* Form Credentials */}
          <form onSubmit={handleTestAndSave} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supabase Project URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-mono transition-all"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Ditemukan di Supabase: <strong>Project Settings &gt; API &gt; Project URL</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supabase Anon Public API Key <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 font-mono transition-all"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Ditemukan di Supabase: <strong>Project Settings &gt; API &gt; Project API Keys &gt; anon public</strong>
              </p>
            </div>

            {/* Test Result Message Alert */}
            {testResult && (
              <div className={`p-3 rounded-xl border text-xs flex items-start space-x-2 animate-fade-in ${
                testResult.success 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800' 
                  : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Form Actions */}
            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={isTesting}
                className="inline-flex items-center px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Menguji Koneksi...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Uji &amp; Simpan Koneksi
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
