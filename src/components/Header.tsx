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
  Sparkles
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
        <div className="flex items-center justify-between h-20">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-md shadow-sky-500/20 text-white font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {metadata.title}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Institusi: <span className="font-semibold text-slate-700 dark:text-slate-200">{metadata.institution}</span> &bull; Pelaksana: <span className="font-medium text-slate-600 dark:text-slate-300">{metadata.contractor}</span>
              </p>
            </div>
          </div>

          {/* Right Actions: Cutoff Selector, Upload, Export, Print, Theme */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cut-off Week selector */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 px-2.5 border border-slate-200/80 dark:border-slate-700/80 text-xs">
              <span className="text-slate-500 dark:text-slate-400 mr-2 font-medium">Cut-off:</span>
              <select
                value={cutoffWeek}
                onChange={(e) => setCutoffWeek(Number(e.target.value))}
                className="bg-transparent font-semibold text-sky-600 dark:text-sky-400 focus:outline-none cursor-pointer"
              >
                {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    Minggu {w} (Bulan {Math.ceil(w / 4)})
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Excel Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
              title="Unggah / Import File Excel (.xlsx / .xls)"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-sky-600 dark:text-sky-400" />
              <span>Import Excel</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all shadow-sm active:scale-95"
              title="Unduh data progres saat ini ke file Excel terformat"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
              <span>Export Excel</span>
            </button>

            {/* Print Report Button */}
            <button
              onClick={onPrint}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
              title="Cetak Laporan / Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500 dark:text-slate-400" />
              <span>Cetak</span>
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all"
              title="Reset ke Data Bawaan (Timeline Rev001.xlsx)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-slate-800 transition-all"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 dark:border-slate-800/80 -mb-px overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Ringkasan Eksekutif
          </button>

          <button
            onClick={() => setActiveTab('gantt')}
            className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'gantt'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <CalendarRange className="w-4 h-4 mr-2" />
            Gantt Timeline (24 Minggu)
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'table'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <ListFilter className="w-4 h-4 mr-2" />
            Tabel Manajemen Progres
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
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
