import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Radio, 
  Server,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { checkDatabaseHealth, DatabaseStatus, syncAllTasksToApi, updateMetadataToApi, seedDatabaseApi } from '../services/apiService';
import { TimelineTask, ProjectMetadata } from '../types/timeline';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TimelineTask[];
  metadata: ProjectMetadata;
  onDataRefreshed?: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  tasks,
  metadata,
  onDataRefreshed,
}) => {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadStatus = async () => {
    setIsLoading(true);
    setActionMessage(null);
    try {
      const status = await checkDatabaseHealth();
      setDbStatus(status);
    } catch (err: any) {
      setDbStatus({
        success: false,
        database: 'Neon PostgreSQL',
        orm: 'Prisma',
        connected: false,
        error: err?.message || 'Gagal memeriksa koneksi',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncCurrentData = async () => {
    setIsSyncing(true);
    setActionMessage(null);
    try {
      const taskSuccess = await syncAllTasksToApi(tasks);
      const metaSuccess = await updateMetadataToApi(metadata);
      if (taskSuccess && metaSuccess) {
        setActionMessage({
          type: 'success',
          text: `Berhasil menyinkronkan ${tasks.length} tugas dan metadata ke Neon PostgreSQL!`,
        });
        await loadStatus();
        if (onDataRefreshed) onDataRefreshed();
      } else {
        setActionMessage({
          type: 'error',
          text: 'Gagal menyinkronkan sebagian data ke database.',
        });
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err?.message || 'Terjadi kesalahan saat sinkronisasi.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Isi ulang database dengan 21 tugas default awal proyek?')) return;

    setIsSeeding(true);
    setActionMessage(null);
    try {
      const res = await seedDatabaseApi();
      if (res.success) {
        setActionMessage({
          type: 'success',
          text: res.message || 'Berhasil menginisialisasi 21 data default ke database!',
        });
        await loadStatus();
        if (onDataRefreshed) onDataRefreshed();
      } else {
        setActionMessage({
          type: 'error',
          text: res.message || 'Gagal menjalankan seed data.',
        });
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err?.message || 'Terjadi kesalahan saat menjalankan seed.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white dark:from-slate-800/80 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Neon PostgreSQL & Prisma ORM
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active DB
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Penyimpanan cloud terdistribusi dengan auto-pooling & Type-Safe Prisma Client
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Overview Card */}
          <div className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Radio className="w-4 h-4 text-emerald-500" />
                <span>Status Koneksi Database</span>
              </div>
              <button
                onClick={loadStatus}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Segarkan Status</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-3 py-3 text-sm text-slate-500 dark:text-slate-400">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                <span>Menghubungi Neon PostgreSQL via Prisma...</span>
              </div>
            ) : dbStatus?.connected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Terhubung ke Neon PostgreSQL (Serverless AWS ap-southeast-1)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Provider</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">Neon Tech</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">ORM Engine</p>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">Prisma Client</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Tugas di DB</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{dbStatus.taskCount ?? '-'} Tugas</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Latensi</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{dbStatus.latencyMs ? `${dbStatus.latencyMs} ms` : 'Aktif'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-sm text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Koneksi Database Terputus / Belum Siap</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {dbStatus?.error || 'Aplikasi beralih ke penyimpanan lokal (LocalStorage) secara otomatis.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Message Feedback */}
          {actionMessage && (
            <div className={`p-3.5 rounded-xl text-sm flex items-start gap-2.5 ${
              actionMessage.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              {actionMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              )}
              <span className="text-xs leading-relaxed">{actionMessage.text}</span>
            </div>
          )}

          {/* Features Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Keunggulan Integrasi Neon + Prisma
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-bold">Type-Safe Prisma</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Skema tabel terdefinisi ketat menjamin konsistensi data tugas & kalkulasi S-Curve.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                  <Server className="w-4 h-4" />
                  <span className="text-xs font-bold">Connection Pooling</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Menggunakan Neon Pooler untuk performa serverless kilat tanpa kendala batas koneksi.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold">Auto Backup & Fallback</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                  Data otomatis dicadangkan di memori browser (LocalStorage) saat offline.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Aksi Database
            </h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSyncCurrentData}
                disabled={isSyncing || isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data Saat Ini ke DB'}</span>
              </button>

              <button
                onClick={handleSeedDefaults}
                disabled={isSeeding || isLoading}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 text-amber-500 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>Reset ke 21 Data Default</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Koneksi Aman TLS/SSL Neon Tech</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
