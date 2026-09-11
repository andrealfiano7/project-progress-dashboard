import React, { useState, useEffect } from 'react';
import { ProjectMetadata } from '../types/timeline';
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
  Database
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: ProjectMetadata;
  onSave: (newMetadata: ProjectMetadata) => void;
  onResetToDefault: () => void;
  onOpenDatabase?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onSave,
  onResetToDefault,
  onOpenDatabase,
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

  if (!isOpen) return null;

  const handleChange = (field: keyof ProjectMetadata, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleApplyPreset = (preset: {
    title: string;
    institution: string;
    contractor: string;
    badgeText: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...preset,
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 id="settings-modal-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Pengaturan Judul &amp; Identitas Proyek
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kustomisasi judul dashboard, nama institusi, pelaksana, dan status live sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Tutup"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[75vh] overflow-y-auto">
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
              value={formData.title}
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
                value={formData.institution}
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
                value={formData.contractor}
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
                  isSaved
                    ? 'bg-emerald-600 shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 shadow-sky-500/25'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Tersimpan!
                  </>
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
