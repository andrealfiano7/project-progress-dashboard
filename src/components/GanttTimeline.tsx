import React, { useState, useMemo } from 'react';
import { TimelineTask } from '../types/timeline';
import { getStatusBadge } from '../utils/calculations';
import { 
  Calendar, 
  Check, 
  AlertTriangle, 
  LayoutGrid, 
  List, 
  Search, 
  Sparkles, 
  ChevronRight, 
  User, 
  Maximize2
} from 'lucide-react';

interface GanttTimelineProps {
  tasks: TimelineTask[];
  cutoffWeek: number;
  onSelectTask?: (task: TimelineTask) => void;
}

type ViewMode = 'fit' | 'detail' | 'cards';

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  tasks,
  cutoffWeek,
  onSelectTask,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('fit');
  const [selectedMonth, setSelectedMonth] = useState<'all' | number>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const phases = ['All', ...Array.from(new Set(tasks.map((t) => t.phase)))];
  const statuses = ['All', 'Completed', 'In Progress', 'Overdue', 'Plan'];

  const months = [
    { id: 1, name: 'Bulan ke-1', shortName: 'B1', weeks: [1, 2, 3, 4] },
    { id: 2, name: 'Bulan ke-2', shortName: 'B2', weeks: [5, 6, 7, 8] },
    { id: 3, name: 'Bulan ke-3', shortName: 'B3', weeks: [9, 10, 11, 12] },
    { id: 4, name: 'Bulan ke-4', shortName: 'B4', weeks: [13, 14, 15, 16] },
    { id: 5, name: 'Bulan ke-5', shortName: 'B5', weeks: [17, 18, 19, 20] },
    { id: 6, name: 'Bulan ke-6', shortName: 'B6', weeks: [21, 22, 23, 24] },
  ];

  const currentCutoffMonth = Math.ceil(cutoffWeek / 4);

  // Active weeks to display based on month filter
  const activeWeeks = useMemo(() => {
    if (selectedMonth === 'all') {
      return Array.from({ length: 24 }, (_, i) => i + 1);
    }
    const targetMonth = months.find((m) => m.id === selectedMonth);
    return targetMonth ? targetMonth.weeks : Array.from({ length: 24 }, (_, i) => i + 1);
  }, [selectedMonth]);

  // Displayed month headers
  const displayedMonths = useMemo(() => {
    if (selectedMonth === 'all') return months;
    return months.filter((m) => m.id === selectedMonth);
  }, [selectedMonth]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (phaseFilter !== 'All' && t.phase !== phaseFilter) return false;
      if (statusFilter !== 'All' && t.progress !== statusFilter) return false;
      if (selectedMonth !== 'all') {
        const monthWeeks = months.find((m) => m.id === selectedMonth)?.weeks || [];
        const hasTaskInMonth = t.weeks.some((w) => monthWeeks.includes(w));
        if (!hasTaskInMonth) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.task.toLowerCase().includes(q);
        const matchPic = t.pic.toLowerCase().includes(q);
        const matchPhase = t.phase.toLowerCase().includes(q);
        const matchId = String(t.id).includes(q);
        if (!matchTitle && !matchPic && !matchPhase && !matchId) return false;
      }
      return true;
    });
  }, [tasks, phaseFilter, statusFilter, selectedMonth, searchQuery]);

  const counts = useMemo(() => {
    return {
      total: filteredTasks.length,
      completed: filteredTasks.filter((t) => t.progress === 'Completed').length,
      inProgress: filteredTasks.filter((t) => t.progress === 'In Progress').length,
      overdue: filteredTasks.filter((t) => t.progress === 'Overdue').length,
      plan: filteredTasks.filter((t) => t.progress === 'Plan').length,
    };
  }, [filteredTasks]);

  const isAllWeeks = selectedMonth === 'all';

  // Task bar style generator
  const getBarStyle = (progress: TimelineTask['progress']) => {
    switch (progress) {
      case 'Completed':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm shadow-emerald-500/25 ring-1 ring-emerald-400/30';
      case 'In Progress':
        return 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-sm shadow-amber-500/30 ring-1 ring-amber-400/40 animate-pulse';
      case 'Overdue':
        return 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-sm shadow-rose-500/30 ring-1 ring-rose-400/40';
      case 'Plan':
      default:
        return 'bg-indigo-500/25 hover:bg-indigo-500/35 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/80 border border-indigo-300/40 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300';
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all animate-fade-in-up">
      {/* 1. Header Toolbar: Title, View Switcher & Live Cutoff Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 sm:p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 shrink-0">
              <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  Gantt Chart Timeline (24 Minggu)
                </h2>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  {filteredTasks.length} Pekerjaan
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Visualisasi jadwal proyek 6 bulan &bull;{' '}
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  Garis Cut-off: W{cutoffWeek} (Bulan {currentCutoffMonth})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher: Fit 24W, Detail Scroll, Kartu Jadwal */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold">
            <button
              onClick={() => setViewMode('fit')}
              className={`inline-flex items-center px-2.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'fit'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Semua 24 minggu pas di satu layar (tanpa scroll horizontal)"
            >
              <Maximize2 className="w-3.5 h-3.5 mr-1" />
              <span>Fit 24W</span>
            </button>

            <button
              onClick={() => setViewMode('detail')}
              className={`inline-flex items-center px-2.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'detail'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan detail lebar dengan scroll horizontal"
            >
              <LayoutGrid className="w-3.5 h-3.5 mr-1" />
              <span>Detail</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center px-2.5 py-1.5 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan daftar kartu jadwal ramah layar smartphone"
            >
              <List className="w-3.5 h-3.5 mr-1" />
              <span>Kartu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Secondary Filter Bar: Month Selector, Phase Filter, Status Filter & Search */}
      <div className="py-2.5 sm:py-3 space-y-2.5">
        {/* Month Quick Tabs (Bulan 1 s/d 6) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Zoom Bulan:
          </span>

          <button
            onClick={() => setSelectedMonth('all')}
            className={`shrink-0 px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] sm:text-xs ${
              selectedMonth === 'all'
                ? 'bg-sky-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua (24W)
          </button>

          {months.map((m) => {
            const isSelected = selectedMonth === m.id;
            const hasCutoff = m.id === currentCutoffMonth;

            return (
              <button
                key={m.id}
                onClick={() => setSelectedMonth(m.id)}
                className={`shrink-0 px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] sm:text-xs flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-sky-600 text-white font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{m.name} (W{m.weeks[0]}-{m.weeks[3]})</span>
                {hasCutoff && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-amber-300' : 'bg-amber-500 animate-pulse'
                    }`}
                    title="Bulan Cut-off Berjalan"
                  />
                )}
              </button>
            );
          })}

          {/* Quick Jump to Cut-off Month */}
          {selectedMonth !== currentCutoffMonth && (
            <button
              onClick={() => setSelectedMonth(currentCutoffMonth)}
              className="shrink-0 px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-100 transition-colors ml-auto"
            >
              ➔ Ke Bulan Cut-off (Bulan {currentCutoffMonth})
            </button>
          )}
        </div>

        {/* Search, Phase Filter, Status Filter & Legend Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[130px] sm:max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari tugas / PIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 pl-8 pr-3 py-1.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-all"
              />
            </div>

            {/* Phase Filter */}
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              aria-label="Filter Fase"
              className="text-xs rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer transition-all"
            >
              {phases.map((p) => (
                <option key={p} value={p} className="bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200">
                  {p === 'All' ? 'Semua Fase' : p}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter Status"
              className="text-xs rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer transition-all"
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200">
                  {s === 'All' ? 'Semua Status' : s}
                </option>
              ))}
            </select>
          </div>

          {/* Status Counts Legend */}
          <div className="flex items-center flex-wrap gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-1 sm:pt-0">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded bg-emerald-500 mr-1 shadow-sm shadow-emerald-500/40" />
              Selesai ({counts.completed})
            </span>
            <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
              <span className="w-2 h-2 rounded bg-amber-500 mr-1 animate-pulse shadow-sm shadow-amber-500/40" />
              Aktif ({counts.inProgress})
            </span>
            <span className="flex items-center text-rose-600 dark:text-rose-400 font-medium">
              <span className="w-2 h-2 rounded bg-rose-500 mr-1 shadow-sm shadow-rose-500/40" />
              Overdue ({counts.overdue})
            </span>
            <span className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-2 h-2 rounded bg-slate-300 dark:bg-slate-700 mr-1" />
              Rencana ({counts.plan})
            </span>
          </div>
        </div>
      </div>

      {/* 3. MODE: KARTU JADWAL (Mobile First Schedule Cards) */}
      {viewMode === 'cards' && (
        <div className="mt-2 space-y-2.5 sm:space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              Tidak ada pekerjaan yang cocok dengan filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
              {filteredTasks.map((task) => {
                const badge = getStatusBadge(task.progress);
                const isCutoffActive = task.weeks.includes(cutoffWeek);

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask && onSelectTask(task)}
                    className="p-3 sm:p-4 rounded-xl bg-slate-50/70 dark:bg-slate-850/70 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    {/* Card Top: Phase, ID & Status Badge */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            #{task.id}
                          </span>
                          <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide truncate">
                            {task.phase}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-tight">
                          {task.task}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Progress Bar & Target/Capaian */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                        <span>Target: <strong className="text-slate-900 dark:text-white">{task.target}</strong> &bull; Cap: <strong className="text-emerald-600 dark:text-emerald-400">{task.capaian.toFixed(2)}</strong></span>
                        <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">
                          {(task.capaian * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            task.progress === 'Completed'
                              ? 'bg-emerald-500'
                              : task.progress === 'In Progress'
                              ? 'bg-amber-500'
                              : task.progress === 'Overdue'
                              ? 'bg-rose-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, task.capaian * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Scheduled Weeks Pills */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1 min-w-0">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mr-0.5">
                          Jadwal:
                        </span>
                        {task.weeks.map((w) => {
                          const isCurrent = w === cutoffWeek;
                          return (
                            <span
                              key={w}
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold tabular-nums ${
                                isCurrent
                                  ? 'bg-amber-400 text-slate-900 ring-1 ring-amber-500 shadow-sm shadow-amber-500/20'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              W{w}
                            </span>
                          );
                        })}
                      </div>

                      {isCutoffActive && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap shrink-0 animate-pulse">
                          ⚡ Aktif W{cutoffWeek}
                        </span>
                      )}
                    </div>

                    {/* PIC & Action Row */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-1 truncate">
                        <User className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{task.pic || 'Belum Ditugaskan'}</span>
                      </div>
                      <span className="text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center text-[10px]">
                        Detail <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. MODE: FIT 24W (Semua Terlihat) & DETAIL SCROLL (Tabel Lengkap) */}
      {viewMode !== 'cards' && (
        <div className="mt-2">
          {/* Mobile Hint for Detail Mode */}
          {viewMode === 'detail' && (
            <div className="sm:hidden mb-2 flex items-center justify-between text-[10px] text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-900/60">
              <span>Geser jadwal ke kanan ➔</span>
              <span>24 Minggu</span>
            </div>
          )}

          {/* Matrix Container */}
          <div
            className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-inner ${
              viewMode === 'detail' ? 'overflow-x-auto' : 'w-full min-w-0 overflow-x-hidden'
            }`}
          >
            <div className={viewMode === 'detail' ? 'min-w-[1060px]' : 'w-full min-w-0'}>
              {/* Header 1: Month Row */}
              <div
                className={`grid bg-slate-100/90 dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 ${
                  viewMode === 'fit'
                    ? isAllWeeks
                      ? 'grid-cols-[95px_repeat(24,minmax(0,1fr))] sm:grid-cols-[160px_repeat(24,minmax(0,1fr))] lg:grid-cols-[240px_repeat(24,minmax(0,1fr))]'
                      : 'grid-cols-[120px_repeat(4,minmax(0,1fr))] sm:grid-cols-[180px_repeat(4,minmax(0,1fr))] lg:grid-cols-[240px_repeat(4,minmax(0,1fr))]'
                    : 'grid-cols-[280px_repeat(24,minmax(32px,1fr))]'
                }`}
              >
                {/* Task Column Header */}
                <div className="p-2 sm:p-2.5 pl-2 sm:pl-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between sticky left-0 bg-slate-100 dark:bg-slate-850 z-20 shadow-[2px_0_6px_-1px_rgba(0,0,0,0.15)]">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-[10px] sm:text-[11px] uppercase tracking-wider truncate">
                    {viewMode === 'fit' ? 'Tugas' : 'Item Pekerjaan & Fase'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">
                    Tgt / Cap
                  </span>
                </div>

                {/* Month Cells */}
                {displayedMonths.map((m) => {
                  const isCutoffMonth = m.id === currentCutoffMonth;
                  const colSpan = m.weeks.length;

                  return (
                    <div
                      key={m.id}
                      style={{ gridColumn: `span ${colSpan} / span ${colSpan}` }}
                      className={`p-1.5 sm:p-2 text-center border-r border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] font-semibold transition-colors truncate ${
                        isCutoffMonth
                          ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold border-b-2 border-amber-500'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="sm:hidden">{m.shortName}</span>
                      <span className="hidden sm:inline">{m.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Header 2: Week Row */}
              <div
                className={`grid bg-slate-50 dark:bg-slate-900 text-[10px] sm:text-[11px] font-sans font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 ${
                  viewMode === 'fit'
                    ? isAllWeeks
                      ? 'grid-cols-[95px_repeat(24,minmax(0,1fr))] sm:grid-cols-[160px_repeat(24,minmax(0,1fr))] lg:grid-cols-[240px_repeat(24,minmax(0,1fr))]'
                      : 'grid-cols-[120px_repeat(4,minmax(0,1fr))] sm:grid-cols-[180px_repeat(4,minmax(0,1fr))] lg:grid-cols-[240px_repeat(4,minmax(0,1fr))]'
                    : 'grid-cols-[280px_repeat(24,minmax(32px,1fr))]'
                }`}
              >
                {/* Count Header */}
                <div className="p-1.5 sm:p-2 pl-2 sm:pl-3 border-r border-slate-200 dark:border-slate-800 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 shadow-[2px_0_6px_-1px_rgba(0,0,0,0.15)] flex items-center justify-between truncate">
                  <span className="truncate">{filteredTasks.length} Tugas</span>
                  <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 lowercase hidden sm:inline mr-1">
                    {isAllWeeks ? 'w1-w24' : `w${activeWeeks[0]}-w${activeWeeks[activeWeeks.length - 1]}`}
                  </span>
                </div>

                {/* Week Cells */}
                {activeWeeks.map((w) => {
                  const isCutoff = w === cutoffWeek;
                  return (
                    <div
                      key={w}
                      className={`p-1 sm:p-1.5 text-center border-r border-slate-200/80 dark:border-slate-800/80 tabular-nums transition-colors relative flex flex-col items-center justify-center ${
                        isCutoff
                          ? 'bg-amber-400/25 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 font-black border-x-2 border-amber-500/80 shadow-[inset_0_0_6px_rgba(245,158,11,0.15)] z-10'
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="text-[9px] sm:text-xs">
                        {viewMode === 'fit' && isAllWeeks ? (
                          <>
                            <span className="sm:hidden">{w}</span>
                            <span className="hidden sm:inline">W{w}</span>
                          </>
                        ) : (
                          `W${w}`
                        )}
                      </span>
                      {isCutoff && (
                        <span className="text-[7px] sm:text-[8px] font-black text-amber-600 dark:text-amber-400 tracking-tighter leading-none scale-90 -mt-0.5 sm:mt-0">
                          KINI
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Task Rows */}
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredTasks.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    Tidak ada pekerjaan yang cocok dengan kriteria filter.
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const badge = getStatusBadge(task.progress);
                    const barStyle = getBarStyle(task.progress);

                    return (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask && onSelectTask(task)}
                        className={`grid hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors cursor-pointer group ${
                          viewMode === 'fit'
                            ? isAllWeeks
                              ? 'grid-cols-[95px_repeat(24,minmax(0,1fr))] sm:grid-cols-[160px_repeat(24,minmax(0,1fr))] lg:grid-cols-[240px_repeat(24,minmax(0,1fr))]'
                              : 'grid-cols-[120px_repeat(4,minmax(0,1fr))] sm:grid-cols-[180px_repeat(4,minmax(0,1fr))] lg:grid-cols-[240px_repeat(4,minmax(0,1fr))]'
                            : 'grid-cols-[280px_repeat(24,minmax(32px,1fr))]'
                        }`}
                      >
                        {/* Task Info Column (Sticky Left) */}
                        <div className="p-1.5 sm:p-2.5 pl-2 sm:pl-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1 sm:gap-2 overflow-hidden sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_6px_-1px_rgba(0,0,0,0.12)] group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-1">
                              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tabular-nums px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
                                #{task.id}
                              </span>
                              <h4 className="text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                {task.task}
                              </h4>
                            </div>

                            <div className="hidden sm:flex items-center space-x-1.5 text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              <span>Tgt: {task.target}</span>
                              <span>&bull;</span>
                              <span className={task.capaian > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                                Cap: {task.capaian.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded border whitespace-nowrap tabular-nums shrink-0 ${badge.bg}`}
                          >
                            {(task.capaian * 100).toFixed(0)}%
                          </span>
                        </div>

                        {/* Week Cells */}
                        {activeWeeks.map((w) => {
                          const isCutoff = w === cutoffWeek;
                          const isScheduled = task.weeks.includes(w);

                          return (
                            <div
                              key={w}
                              className={`border-r border-slate-100 dark:border-slate-850 p-0.5 sm:p-1 flex items-center justify-center relative transition-colors ${
                                isCutoff ? 'bg-amber-500/[0.06] dark:bg-amber-400/[0.08]' : ''
                              }`}
                            >
                              {/* Cutoff vertical line guide */}
                              {isCutoff && (
                                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-400/50 dark:bg-amber-400/60 pointer-events-none shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                              )}

                              {isScheduled && (
                                <div
                                  title={`#${task.id} ${task.task} (Minggu ${w})\nTarget: ${task.target} | Capaian: ${task.capaian} (${(task.capaian * 100).toFixed(0)}%)\nStatus: ${task.progress}\nPIC: ${task.pic}`}
                                  className={`w-full ${
                                    viewMode === 'fit' && isAllWeeks ? 'h-3.5 sm:h-5' : 'h-5 sm:h-6'
                                  } rounded-sm sm:rounded-md ${barStyle} flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-[2]`}
                                >
                                  {/* Icons only when there's enough cell width */}
                                  {(!isAllWeeks || viewMode === 'detail') && (
                                    <>
                                      {task.progress === 'Completed' && (
                                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                                      )}
                                      {task.progress === 'Overdue' && (
                                        <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                      )}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info & Mobile Helper */}
      <div className="mt-3 sm:mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-1.5">
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>
            {viewMode === 'fit'
              ? 'Mode Fit 24W aktif: Seluruh minggu ditampilkan proporsional pada satu layar.'
              : viewMode === 'detail'
              ? 'Mode Detail aktif: Geser tabel secara horizontal untuk melihat ukuran sel penuh.'
              : 'Mode Kartu aktif: Sentuh kartu tugas untuk melihat rincian lengkap.'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400">
          Klik baris/kartu untuk membuka Detail Task
        </span>
      </div>
    </div>
  );
};
