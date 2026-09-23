import React, { useState } from 'react';
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
  Database,
  LogOut,
  MoreVertical,
  X,
  Calendar
} from 'lucide-react';
import { ProjectMetadata } from '../types/timeline';
import { AuthUser } from '../types/auth';
import { LiveClock } from './LiveClock';
import { formatIndonesianDate, parseLocalDate } from '../utils/calculations';

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
  user?: AuthUser | null;
  onLogout?: () => void;
  isAutoCutoff?: boolean;
  onToggleAutoCutoff?: (val: boolean) => void;
  autoCalculatedWeek?: number;
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
  user,
  onLogout,
  isAutoCutoff = false,
  onToggleAutoCutoff,
  autoCalculatedWeek,
}) => {
  const currentMonth = Math.ceil(cutoffWeek / 4);
  const weekInMonth = ((cutoffWeek - 1) % 4) + 1;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Banner with Brand & Actions */}
      <div className="max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand & Project Info */}
          <div className="flex items-center space-x-2 sm:space-x-3.5 min-w-0 flex-1">
            <button 
              type="button"
              onClick={() => onOpenSettings()}
              className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-md shadow-sky-500/20 text-white font-bold shrink-0 cursor-pointer hover:opacity-90 active:scale-95 transition-all border-none"
              title="Klik untuk membuka Pengaturan Identitas Proyek"
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 
                  onClick={() => onOpenSettings()}
                  className="text-xs sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  title="Klik untuk mengubah judul proyek"
                >
                  {metadata.title}
                </h1>
                
                {/* Live Sync Animated Badge with Radar Pulse */}
                <span 
                  onClick={() => onOpenSettings()}
                  className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] shrink-0 select-none cursor-pointer hover:bg-emerald-500/20 transition-all whitespace-nowrap"
                  title="Live Realtime Sync Aktif • Klik untuk mengatur"
                >
                  <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 mr-1 sm:mr-1.5 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                  </span>
                  <span className="tracking-wide font-bold pointer-events-none">{metadata.badgeText || 'Live Sync'}</span>
                </span>
              </div>
              <p className="text-[9px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                <span>{metadata.institution}</span>
                <span className="hidden sm:inline"> &bull; Pelaksana: <span className="font-medium text-slate-600 dark:text-slate-300">{metadata.contractor}</span></span>
                {metadata.kickoffDate && (
                  <span className="hidden sm:inline text-sky-600 dark:text-sky-400 font-medium">
                    {' '}&bull; Kick-off: <span className="font-semibold">{formatIndonesianDate(parseLocalDate(metadata.kickoffDate), false)}</span>
                    <button
                      type="button"
                      onClick={() => onOpenSettings()}
                      className="ml-1.5 px-2 py-0.5 rounded bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/60 dark:hover:bg-sky-800 text-sky-700 dark:text-sky-300 font-semibold text-[10px] transition-colors cursor-pointer inline-flex items-center"
                      title="Ubah Tanggal Kick-off Meeting & Pengaturan Proyek"
                    >
                      <Calendar className="w-2.5 h-2.5 mr-0.5 pointer-events-none" />
                      <span className="pointer-events-none">Ubah</span>
                    </button>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* DESKTOP Action Toolbar (Visible on md and up: >= 768px) */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Settings Button - High Visibility & Prominent */}
            <button
              type="button"
              onClick={() => onOpenSettings()}
              className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white shadow-md shadow-sky-500/25 transition-all active:scale-95 shrink-0 cursor-pointer"
              title="Pengaturan Tanggal Kick-off, Judul & Identitas Proyek"
              aria-label="Buka Pengaturan"
            >
              <Settings className="w-4 h-4 mr-1.5 shrink-0 pointer-events-none" />
              <span className="pointer-events-none">Pengaturan</span>
            </button>

            {/* Cut-off Week selector */}
            <div className={`flex items-center rounded-xl p-1 px-2 sm:px-2.5 border text-xs transition-all ${
              isAutoCutoff
                ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-300 dark:border-sky-700 shadow-sm shadow-sky-500/10'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700/80'
            }`}>
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 mr-1.5 font-medium flex items-center">
                {isAutoCutoff && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" title="Otomatis sinkron dengan tanggal kick-off" />}
                Cut-off:
              </span>
              <select
                value={isAutoCutoff && autoCalculatedWeek ? 0 : cutoffWeek}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCutoffWeek(val);
                }}
                className={`bg-transparent font-bold focus:outline-none cursor-pointer text-[11px] sm:text-xs ${
                  isAutoCutoff ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-200'
                }`}
                title={isAutoCutoff ? `Cut-off Otomatis Aktif (W${autoCalculatedWeek} hari ini)` : 'Pilih Minggu Cut-off Laporan'}
              >
                {autoCalculatedWeek && (
                  <option value={0} className="bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 font-bold">
                    ⚡ Auto: W{autoCalculatedWeek} (Hari Ini)
                  </option>
                )}
                {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    W{w} (M{Math.ceil(w / 4)}){w === autoCalculatedWeek ? ' • Hari Ini' : w === 1 ? ' • Kick-off' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Neon DB & Prisma ORM Connection Status Button */}
            <button
              onClick={onOpenDatabase}
              className={`inline-flex items-center p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 shrink-0 ${
                isDatabaseActive
                  ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-emerald-500/10'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
              title={isDatabaseActive ? 'Neon PostgreSQL & Prisma ORM Terhubung' : 'Status Koneksi Database (Klik untuk Pengaturan)'}
              aria-label="Pengaturan Database Neon & Prisma"
            >
              <Database className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDatabaseActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
              <span className="hidden xl:inline ml-1.5 font-bold">
                {isDatabaseActive ? 'Neon DB' : 'Koneksi DB'}
              </span>
              <span className={`w-2 h-2 rounded-full ml-1 sm:ml-1.5 ${isDatabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            </button>

            {/* Upload Excel Button */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95 shrink-0"
              title="Unggah / Import File Excel (.xlsx / .xls)"
            >
              <Upload className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden 2xl:inline ml-1.5">Import Excel</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all shadow-sm active:scale-95 shrink-0"
              title="Unduh data progres saat ini ke file Excel terformat"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden 2xl:inline ml-1.5">Export Excel</span>
            </button>

            {/* Print Report Button */}
            <button
              onClick={onPrint}
              className="inline-flex items-center p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95 shrink-0"
              title="Cetak Laporan / Simpan PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            </button>

            {/* Reset Data Button */}
            <button
              onClick={onResetData}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all shrink-0"
              title="Reset ke Data Bawaan (Timeline Rev001.xlsx)"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-slate-800 transition-all shrink-0"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* User Profile & Logout */}
            {user && (
              <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
                <div 
                  className="flex items-center space-x-1.5 p-1 px-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80"
                  title={`Pengguna Aktif: ${user.name} (${user.role.toUpperCase()})`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    user.role === 'admin' 
                      ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-400/30' 
                      : user.role === 'manager'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block leading-tight truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block leading-tight capitalize">
                      {user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'PM' : 'Viewer'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 sm:px-2.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80 transition-all shadow-sm active:scale-95 flex items-center shrink-0"
                  title="Keluar / Logout dari aplikasi"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline ml-1 font-medium">Keluar</span>
                </button>
              </div>
            )}
          </div>

          {/* MOBILE Compact Action Bar (Visible only on mobile: < 768px) */}
          <div className="flex md:hidden items-center space-x-1 shrink-0">
            {/* Cut-off selector compact */}
            <div className={`flex items-center rounded-lg p-1 px-1.5 border text-[11px] transition-all ${
              isAutoCutoff
                ? 'bg-sky-50 dark:bg-sky-950/80 border-sky-300 dark:border-sky-700'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
            }`}>
              <span className={`mr-1 font-bold ${isAutoCutoff ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`}>
                {isAutoCutoff ? '⚡W:' : 'W:'}
              </span>
              <select
                value={isAutoCutoff && autoCalculatedWeek ? 0 : cutoffWeek}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCutoffWeek(val);
                }}
                className={`bg-transparent font-bold focus:outline-none cursor-pointer ${
                  isAutoCutoff ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-200'
                }`}
                title={isAutoCutoff ? `Cut-off Otomatis (W${autoCalculatedWeek} hari ini)` : 'Pilih Minggu Cut-off'}
              >
                {autoCalculatedWeek && (
                  <option value={0} className="bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-300 font-bold">
                    ⚡ Auto W{autoCalculatedWeek}
                  </option>
                )}
                {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                    W{w}
                  </option>
                ))}
              </select>
            </div>

            {/* Direct Settings Button on Mobile */}
            <button
              type="button"
              onClick={() => onOpenSettings()}
              className="p-1 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold text-[11px] flex items-center space-x-1 active:scale-95 transition-all shadow-md shadow-sky-500/25 cursor-pointer"
              title="Buka Pengaturan Proyek & Tanggal Kick-off"
            >
              <Settings className="w-3.5 h-3.5 shrink-0 pointer-events-none" />
              <span className="pointer-events-none">Setting</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Initial Circle */}
            {user && (
              <div 
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  user.role === 'admin' 
                    ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-400/30' 
                    : user.role === 'manager'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30'
                }`}
                title={`Login: ${user.name}`}
              >
                {user.name.charAt(0)}
              </div>
            )}

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-1.5 rounded-lg transition-all border ${
                isMobileMenuOpen
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Menu Aksi Seluler"
              aria-label="Menu Aksi"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MOBILE POPUP ACTION MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-3 px-1 animate-fadeIn bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            {/* Kick-off & Live Clock Info inside Mobile Menu */}
            <div className="mb-3 space-y-1.5 text-center">
              <div className="flex justify-center">
                <LiveClock />
              </div>
              {metadata.kickoffDate && (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  <span>📅 Kick-off: {formatIndonesianDate(parseLocalDate(metadata.kickoffDate), false)}</span>
                  {isAutoCutoff && <span className="ml-1.5 font-bold text-emerald-600 dark:text-emerald-400">⚡ Auto W{cutoffWeek}</span>}
                </div>
              )}
            </div>

            {/* Grid of Action Buttons on Mobile */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { onOpenUpload(); setIsMobileMenuOpen(false); }}
                className="flex items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4 text-sky-500 mr-2 shrink-0" />
                <span>Import Excel</span>
              </button>

              <button
                onClick={() => { onExportExcel(); setIsMobileMenuOpen(false); }}
                className="flex items-center p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={() => { onPrint(); setIsMobileMenuOpen(false); }}
                className="flex items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <span>Cetak Laporan</span>
              </button>

              <button
                type="button"
                onClick={() => { 
                  setIsMobileMenuOpen(false); 
                  onOpenSettings(); 
                }}
                className="flex items-center p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Settings className="w-4 h-4 text-white mr-2 shrink-0 pointer-events-none" />
                <span className="pointer-events-none">⚙️ Pengaturan</span>
              </button>

              <button
                onClick={() => { onOpenDatabase(); setIsMobileMenuOpen(false); }}
                className="flex items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold active:scale-95 transition-all"
              >
                <Database className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                <span>Status Neon DB</span>
                <span className={`w-2 h-2 rounded-full ml-auto ${isDatabaseActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              </button>

              <button
                onClick={() => { onResetData(); setIsMobileMenuOpen(false); }}
                className="flex items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                <span>Reset Default</span>
              </button>
            </div>

            {/* Logout Row in Mobile Menu */}
            {user && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={() => { onLogout && onLogout(); setIsMobileMenuOpen(false); }}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shrink-0 ml-2"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 dark:border-slate-800/80 -mb-px overflow-x-auto py-1 scrollbar-none flex-nowrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 inline-flex items-center px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className="sm:hidden">Ringkasan</span>
            <span className="hidden sm:inline">Ringkasan Eksekutif</span>
          </button>

          <button
            onClick={() => setActiveTab('gantt')}
            className={`shrink-0 inline-flex items-center px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'gantt'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className="sm:hidden">Gantt (24W)</span>
            <span className="hidden sm:inline">Gantt Timeline (24 Minggu)</span>
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`shrink-0 inline-flex items-center px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'table'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className="sm:hidden">Tabel Progres</span>
            <span className="hidden sm:inline">Tabel Manajemen Progres</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`shrink-0 inline-flex items-center px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className="sm:hidden">Kurva S</span>
            <span className="hidden sm:inline">Analisis Kurva S</span>
          </button>

          {/* Telemetri Status Tab Bar: Jam Real-time Hari Ini & Posisi Proyek */}
          <div className="hidden md:flex items-center ml-auto pl-4 space-x-2 text-xs shrink-0">
            <LiveClock />
            <div className="flex items-center px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 whitespace-nowrap">
              <span className="font-medium mr-1 text-slate-500 dark:text-slate-400">Posisi:</span>
              <span className="font-bold font-sans tabular-nums">
                Bulan {currentMonth}, M{weekInMonth} (W{cutoffWeek})
              </span>
              {isAutoCutoff ? (
                <button
                  type="button"
                  onClick={() => onToggleAutoCutoff && onToggleAutoCutoff(false)}
                  className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 text-[10px] font-bold transition-colors cursor-pointer"
                  title="Minggu otomatis dihitung dari tanggal Kick-off (Klik untuk beralih ke manual)"
                >
                  ⚡ Auto
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleAutoCutoff && onToggleAutoCutoff(true)}
                  className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-[10px] font-medium transition-colors cursor-pointer"
                  title="Klik untuk beralih ke cut-off otomatis real-time"
                >
                  Manual
                </button>
              )}
            </div>
          </div>

          {/* Mobile Live Clock pada ujung scroll tab */}
          <div className="md:hidden shrink-0 ml-auto py-0.5 pr-1">
            <LiveClock showIcon={false} />
          </div>
        </div>
      </div>
    </header>
  );
};
