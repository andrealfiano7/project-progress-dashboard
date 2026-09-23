import React, { useState, useEffect, useMemo } from 'react';
import { ProjectMetadata } from '../types/timeline';
import { calculateKickoffWeekInfo } from '../utils/calculations';
import { 
  Settings, 
  X, 
  Save, 
  RotateCcw, 
  Check, 
  Building2, 
  Briefcase, 
  FileText, 
  Activity, 
  Calendar,
  Layers,
  Database,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: ProjectMetadata;
  onSave: (newMetadata: ProjectMetadata) => void;
  onResetToDefault: () => void;
  onOpenDatabase?: () => void;
  isViewer?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onSave,
  onResetToDefault,
  onOpenDatabase,
  isViewer = false,
}) => {
  const [formData, setFormData] = useState<ProjectMetadata>(metadata);
  const [isSaved, setIsSaved] = useState(false);

  // Sync form state when modal opens or metadata changes
  useEffect(() => {
    if (isOpen) {
      setFormData(metadata);
      setIsSaved(false);
    }
  }, [isOpen, metadata]);

  const weekInfo = useMemo(() => {
    return calculateKickoffWeekInfo(
      formData.kickoffDate || '2026-09-01',
      formData.totalWeeks || 24
    );
  }, [formData.kickoffDate, formData.totalWeeks]);

  if (!isOpen) return null;

  const handleChange = (field: keyof ProjectMetadata, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isViewer) {
      alert('Akun Viewer hanya memiliki hak akses pantau (read-only). Silakan masuk sebagai Administrator atau Project Manager untuk menyimpan perubahan.');
      return;
    }
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleApplyPreset = (preset: Partial<ProjectMetadata>) => {
    setFormData((prev) => ({
      ...prev,
      ...preset,
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      {/* Modal Dialog Card */}
      <div 
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Pengaturan Judul &amp; Identitas Proyek
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kustomisasi tanggal kick-off, judul dashboard, institusi, dan pelaksana
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Banner Peringatan jika Akun Viewer */}
          {isViewer && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 shrink-0 text-amber-500" />
              <span>
                <strong>Mode Pantau (Viewer):</strong> Anda dapat melihat seluruh konfigurasi dan tanggal kick-off. Untuk menyimpan perubahan, silakan keluar dan masuk sebagai <strong>Administrator</strong> atau <strong>Project Manager</strong>.
              </span>
            </div>
          )}
          {/* Quick Presets & Database Connection Quick Link */}
          <div>
            <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Template Cepat:
              </label>
              {onOpenDatabase && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDatabase();
                  }}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Kelola Database Neon DB ➔</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: 'Timeline Implementasi BCM',
                    institution: 'PT Angkasa Pura Indonesia (API)',
                    contractor: 'Centrois Consulting',
                    badgeText: 'Live Sync',
                    kickoffDate: '2026-09-01',
                    autoWeekCalculation: true,
                  })
                }
                className="px-2.5 py-1 text-xs rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors font-medium"
              >
                ✈️ BCM - PT Angkasa Pura
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: 'Progress Report Pengembangan Core System',
                    institution: 'Direktorat Sistem Informasi & Digitalisasi',
                    contractor: 'PT Solusi Teknologi Nusantara',
                    badgeText: 'Live Sync',
                    kickoffDate: '2026-09-01',
                    autoWeekCalculation: true,
                  })
                }
                className="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors font-medium"
              >
                💻 Proyek IT Core System
              </button>
              <button
                type="button"
                onClick={() =>
                  handleApplyPreset({
                    title: 'Laporan Progres Fisik Proyek Gedung & Fasilitas',
                    institution: 'Kementerian Pekerjaan Umum & Tata Ruang',
                    contractor: 'PT Konstruksi Mandiri Sejahtera',
                    badgeText: 'Live Sync',
                    kickoffDate: '2026-09-01',
                    autoWeekCalculation: true,
                  })
                }
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors font-medium"
              >
                🏗️ Proyek Konstruksi Fisik
              </button>
            </div>
          </div>

          {/* Input 1: Judul Proyek */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-sky-500" />
                <span>Judul Proyek / Dashboard</span>
                <span className="text-rose-500">*</span>
              </span>
            </label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Contoh: Timeline Implementasi BCM"
              className="w-full text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Input 2 & 3: Institusi & Pelaksana */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>Nama Institusi / Klien</span>
                  <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="text"
                required
                value={formData.institution || ''}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="Contoh: PT Angkasa Pura Indonesia (API)"
                className="w-full text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Nama Pelaksana / Konsultan</span>
                  <span className="text-rose-500">*</span>
                </span>
              </label>
              <input
                type="text"
                required
                value={formData.contractor || ''}
                onChange={(e) => handleChange('contractor', e.target.value)}
                placeholder="Contoh: Centrois Consulting"
                className="w-full text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Input 4 & 5: Badge Status & Periode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Teks Badge Real-time (Live Sync)</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.badgeText || ''}
                onChange={(e) => handleChange('badgeText', e.target.value)}
                placeholder="Live Sync"
                className="w-full text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Badge ini dilengkapi radar pulsing live animation di header
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>Periode / Keterangan Waktu</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.lastUpdated || ''}
                onChange={(e) => handleChange('lastUpdated', e.target.value)}
                placeholder="Contoh: September 2026"
                className="w-full text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          {/* Section: Kick-off Meeting & Otomatisasi Minggu (Auto Week Update) */}
          <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/80 space-y-3 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-400/30">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Tanggal Dimulainya Kick-off Meeting
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Titik awal dimulainya Minggu ke-1 (W1) untuk perhitungan minggu otomatis
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Otomatisasi Jadwal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanggal Kick-off:
                </label>
                <input
                  type="date"
                  value={formData.kickoffDate || '2026-09-01'}
                  onChange={(e) => handleChange('kickoffDate', e.target.value)}
                  className="w-full text-xs sm:text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40 font-medium"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Tanggal awal kickoff: <strong>{weekInfo.startDateFormatted}</strong>
                </p>
              </div>

              {/* Checkbox Toggle Sinkronkan Otomatis */}
              <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80">
                <input
                  type="checkbox"
                  id="autoWeekCheckbox"
                  checked={formData.autoWeekCalculation !== false}
                  onChange={(e) => handleChange('autoWeekCalculation', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="autoWeekCheckbox" className="text-xs text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <span className="font-bold block text-slate-900 dark:text-white">
                    Perbarui Minggu Otomatis Real-time
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">
                    Minggu berjalan (cut-off) otomatis bertambah setiap 7 hari berdasarkan tanggal hari ini
                  </span>
                </label>
              </div>
            </div>

            {/* Live Calculation Info Box */}
            <div className="pt-2.5 border-t border-sky-100 dark:border-sky-900/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/50 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-medium">Posisi Hari Ini:</span>
                <span className="font-extrabold text-sky-600 dark:text-sky-400 text-sm block mt-0.5">
                  Minggu ke-{weekInfo.calculatedWeek} (W{weekInfo.calculatedWeek})
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  Rentang: {weekInfo.currentWeekRangeFormatted}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/50 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-medium">Hari Berjalan:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block mt-0.5">
                  Hari ke-{weekInfo.daysElapsed}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {weekInfo.percentTimeElapsed}% dari 168 hari (24W)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-100 dark:border-sky-900/50 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-medium">Target Selesai Proyek:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block mt-0.5 truncate">
                  {weekInfo.projectEndDateFormatted}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                  {weekInfo.isCompleted ? '✓ Telah Selesai' : `${weekInfo.totalProjectDays - weekInfo.daysElapsed} hari lagi`}
                </span>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="pt-2">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Live Preview Header:
            </label>
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 shadow-inner flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-md shadow-sky-500/20 text-white font-bold shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {formData.title || 'Judul Proyek'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm shrink-0">
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{formData.badgeText || 'Live Sync'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  Institusi: <span className="font-semibold text-slate-700 dark:text-slate-200">{formData.institution || '-'}</span>
                  <span> &bull; Pelaksana: <span className="font-medium text-slate-600 dark:text-slate-300">{formData.contractor || '-'}</span></span>
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onResetToDefault}
              className="w-full sm:w-auto inline-flex items-center justify-center px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              title="Kembalikan semua judul ke default"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              Reset ke Default
            </button>

            <div className="w-full sm:w-auto flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className={`flex-1 sm:flex-none inline-flex items-center justify-center px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md transition-all active:scale-95 ${
                  isViewer
                    ? 'bg-slate-400 hover:bg-slate-500 cursor-pointer'
                    : isSaved
                    ? 'bg-emerald-600 shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-500/25'
                }`}
                title={isViewer ? 'Akun Viewer tidak dapat menyimpan perubahan' : 'Simpan Perubahan'}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Tersimpan!
                  </>
                ) : isViewer ? (
                  'Mode Baca Saja (Viewer)'
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
