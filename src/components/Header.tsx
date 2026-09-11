import React from 'react';
import { 
  BarChart3, 
  CalendarRange, 
  ListFilter, 
  TrendingUp, 
  Upload, 
  Download, 
  Printer, 
  Sun, 
  Moon, 
  RotateCcw,
  Layers,
  Settings,
  Database
} from 'lucide-react';
import { ProjectMetadata } from '../types/timeline';

interface HeaderProps {
  metadata: ProjectMetadata;
  activeTab: 'overview' | 'gantt' | 'table' | 'analytics';
  setActiveTab: (tab: 'overview' | 'gantt' | 'table' | 'analytics') => void;
  onOpenUpload: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  onResetData: () => void;
  onOpenSettings: () => void;
  onOpenDatabase: () => void;
  isDatabaseActive: boolean;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  cutoffWeek: number;
  setCutoffWeek: (week: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  activeTab,
  setActiveTab,
  onOpenUpload,
  onExportExcel,
  onPrint,
  onResetData,
  onOpenSettings,
  onOpenDatabase,
  isDatabaseActive,
  darkMode,
  setDarkMode,
  cutoffWeek,
  setCutoffWeek,
}) => {
  const currentMonth = Math.ceil(cutoffWeek / 4);
  const weekInMonth = ((cutoffWeek - 1) % 4) + 1;

  return (
    <header className="no-print sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Banner with Brand & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0 flex-1">
            <div 
              onClick={onOpenSettings}
              className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-md shadow-sky-500/20 text-white font-bold shrink-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all"
              title="Klik untuk membuka Pengaturan Identitas Proyek"
            >
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h1 
                  onClick={onOpenSettings}
                  className="text-sm sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  title="Klik untuk mengubah judul proyek"
                >
                  {metadata.title}
                </h1>
                
                {/* Live Sync Animated Badge with Radar Pulse */}
                <span 
                  onClick={onOpenSettings}
                  className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] shrink-0 select-none cursor-pointer hover:bg-emerald-500/20 transition-all"
                  title="Live Realtime Sync Aktif • Klik untuk mengatur"
                >
                  <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="tracking-wide font-bold">{metadata.badgeText || 'Live Sync'}</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Institusi: <span className="font-semibold text-slate-700 dark:text-slate-200">{metadata.institution}</span>
                <span className="hidden sm:inline"> &bull; Pelaksana: <span className="font-medium text-slate-600 dark:text-slate-300">{metadata.contractor}</span></span>
              </p>
            </div>
          </div>

          {/* Right Actions: Cutoff Selector, Supabase, Settings, Upload, Export, Print, Theme */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Cut-off Week selector (Visible on all screens) */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 px-2 sm:px-2.5 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 mr-1.5 font-medium">Cut-off:</span>
              <select
                value={cutoffWeek}
                onChange={(e) => setCutoffWeek(Number(e.target.value))}
                className="bg-transparent font-semibold text-sky-600 dark:text-sky-400 focus:outline-none cursor-pointer text-[11px] sm:text-xs"
                title="Pilih Minggu Cut-off Laporan"
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    W{w} (M{Math.ceil(w / 4)}){w === 13 ? ' • Default' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Neon DB & Prisma ORM Connection Status Button */}
            <button
              onClick={onOpenDatabase}
              className={`inline-flex items-center p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                isDatabaseActive
                  ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-emerald-500/10'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
              title={isDatabaseActive ? 'Neon PostgreSQL & Prisma ORM Terhubung' : 'Status Koneksi Database (Klik untuk Pengaturan)'}
              aria-label="Pengaturan Database Neon & Prisma"
            >
              <Database className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDatabaseActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
              <span className="hidden lg:inline ml-1.5 font-bold">
                {isDatabaseActive ? 'Neon DB' : 'Koneksi DB'}
              </span>
              <span className={`w-2 h-2 rounded-full ml-1.5 ${isDatabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/50 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 transition-all shadow-sm active:scale-95"
              title="Pengaturan Judul & Identitas Dashboard"
              aria-label="Buka Pengaturan"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 dark:text-sky-400" />
              <span className="hidden lg:inline ml-1.5">Pengaturan</span>
            </button>

            {/* Upload Excel Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
              title="Unggah / Import File Excel (.xlsx / .xls)"
            >
              <Upload className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden md:inline ml-1.5">Import Excel</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all shadow-sm active:scale-95"
              title="Unduh data progres saat ini ke file Excel terformat"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline ml-1.5">Export Excel</span>
            </button>

            {/* Print Report Button */}
            <button
              onClick={onPrint}
              className="inline-flex items-center p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
              title="Cetak Laporan / Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="hidden md:inline ml-1.5">Cetak</span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all"
              title="Reset ke Data Bawaan (Timeline Rev001.xlsx)"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-slate-800 transition-all"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 dark:border-slate-800/80 -mb-px overflow-x-auto py-1 scrollbar-none flex-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Ringkasan Eksekutif
          </button>

          <button
            onClick={() => setActiveTab('gantt')}
            className={`shrink-0 inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'gantt'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Gantt Timeline (24 Minggu)
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`shrink-0 inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'table'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Tabel Manajemen Progres
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`shrink-0 inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Analisis Kurva S
          </button>

          {/* Quick status pill on tab bar */}
          <div className="hidden lg:flex items-center ml-auto pl-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Posisi Proyek:</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-md font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
              Bulan {currentMonth}, Minggu {weekInMonth} (W{cutoffWeek})
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
