import React, { useState, useMemo } from 'react';
import { TimelineTask } from '../types/timeline';
import { getStatusBadge } from '../utils/calculations';
import { Calendar, Check, AlertTriangle } from 'lucide-react';

interface GanttTimelineProps {
  tasks: TimelineTask[];
  cutoffWeek: number;
  onSelectTask?: (task: TimelineTask) => void;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  tasks,
  cutoffWeek,
  onSelectTask,
}) => {
  const [phaseFilter, setPhaseFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const phases = ['All', ...Array.from(new Set(tasks.map((t) => t.phase)))];
  const statuses = ['All', 'Completed', 'In Progress', 'Overdue', 'Plan'];

  const filteredTasks = tasks.filter((t) => {
    if (phaseFilter !== 'All' && t.phase !== phaseFilter) return false;
    if (statusFilter !== 'All' && t.progress !== statusFilter) return false;
    return true;
  });

  const counts = useMemo(() => {
    return {
      total: filteredTasks.length,
      completed: filteredTasks.filter((t) => t.progress === 'Completed').length,
      inProgress: filteredTasks.filter((t) => t.progress === 'In Progress').length,
      overdue: filteredTasks.filter((t) => t.progress === 'Overdue').length,
      plan: filteredTasks.filter((t) => t.progress === 'Plan').length,
    };
  }, [filteredTasks]);

  const totalWeeks = 24;
  const months = [
    { name: 'Bulan ke-1', weeks: [1, 2, 3, 4] },
    { name: 'Bulan ke-2', weeks: [5, 6, 7, 8] },
    { name: 'Bulan ke-3', weeks: [9, 10, 11, 12] },
    { name: 'Bulan ke-4', weeks: [13, 14, 15, 16] },
    { name: 'Bulan ke-5', weeks: [17, 18, 19, 20] },
    { name: 'Bulan ke-6', weeks: [21, 22, 23, 24] },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all animate-fade-in-up">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Gantt Chart Timeline (24 Minggu)
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Peta jadwal pelaksanaan per minggu &bull;{' '}
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Garis kuning: Cut-off W{cutoffWeek} (Kini)
            </span>
          </p>
        </div>

        {/* Filters & Legend */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Swipe Hint */}
          <div className="sm:hidden w-full flex items-center justify-between text-[10px] text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-900/60">
            <span>Geser jadwal ke kanan ➔</span>
            <span>24 Minggu</span>
          </div>

          {/* Phase Filter Dropdown */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            aria-label="Filter Fase Pekerjaan"
            className="text-xs rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer transition-all"
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
            aria-label="Filter Status Pekerjaan"
            className="text-xs rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 cursor-pointer transition-all"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200">
                {s === 'All' ? 'Semua Status' : s}
              </option>
            ))}
          </select>

          {/* Legend Badges */}
          <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-[11px]">
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

      {/* Gantt Matrix Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-inner">
        <div className="min-w-[1060px]">
          {/* Header Rows */}
          {/* 1. Month Header */}
          <div className="grid grid-cols-[310px_repeat(24,minmax(30px,1fr))] bg-slate-100/90 dark:bg-slate-850 text-xs font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2.5 pl-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between sticky left-0 bg-slate-100 dark:bg-slate-850 z-20 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.25)]">
              <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide">
                Item Pekerjaan &amp; Fase
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal mr-2">
                Tgt / Cap
              </span>
            </div>
            {months.map((m, idx) => {
              const isCutoffMonth = idx === Math.floor((cutoffWeek - 1) / 4);
              return (
                <div
                  key={m.name}
                  className={`col-span-4 p-2 text-center border-r border-slate-200 dark:border-slate-800 text-[11px] font-semibold transition-colors ${
                    isCutoffMonth
                      ? 'bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold border-b-2 border-amber-500 shadow-[inset_0_1px_0_rgba(245,158,11,0.2)]'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {m.name}
                </div>
              );
            })}
          </div>

          {/* 2. Week Number Header */}
          <div className="grid grid-cols-[310px_repeat(24,minmax(30px,1fr))] bg-slate-50 dark:bg-slate-900 text-[11px] font-sans font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2 pl-3 border-r border-slate-200 dark:border-slate-800 text-[10px] font-semibold uppercase tracking-wider font-sans text-slate-400 dark:text-slate-500 sticky left-0 bg-slate-50 dark:bg-slate-900 z-20 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.25)] flex items-center justify-between">
              <span>{filteredTasks.length} Pekerjaan Terdaftar</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 lowercase mr-1">w1–w24</span>
            </div>
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => {
              const isCutoff = w === cutoffWeek;
              return (
                <div
                  key={w}
                  className={`p-1.5 text-center border-r border-slate-200/80 dark:border-slate-800/80 tabular-nums transition-colors relative flex flex-col items-center justify-center ${
                    isCutoff
                      ? 'bg-amber-400/25 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300 font-black border-x-2 border-amber-500/80 shadow-[inset_0_0_8px_rgba(245,158,11,0.15)] z-10'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <span>W{w}</span>
                  {isCutoff && (
                    <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 tracking-tighter leading-none scale-90 -mt-0.5">
                      KINI
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Task Rows Grouped by Phase */}
          <div className="divide-y divide-slate-100 dark:divide-slate-850">
            {filteredTasks.map((task) => {
              const badge = getStatusBadge(task.progress);

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask && onSelectTask(task)}
                  className="grid grid-cols-[310px_repeat(24,minmax(30px,1fr))] hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors cursor-pointer group"
                >
                  {/* Task Info Column */}
                  <div className="p-2.5 pl-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-hidden sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[3px_0_8px_-2px_rgba(0,0,0,0.2)] group-hover:bg-slate-50 dark:group-hover:bg-slate-850 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-sans font-bold text-slate-400 dark:text-slate-500 tabular-nums px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          #{task.id}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors font-sans">
                          {task.task}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-sans">
                        <span>Tgt: {task.target}</span>
                        <span>&bull;</span>
                        <span
                          className={
                            task.capaian > 0
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : ''
                          }
                        >
                          Cap: {task.capaian.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap font-sans tabular-nums ${badge.bg}`}
                    >
                      {(task.capaian * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* 24 Week Cells */}
                  {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => {
                    const isCutoff = w === cutoffWeek;
                    const isScheduled = task.weeks.includes(w);

                    let barStyle =
                      'bg-slate-200/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400 border border-slate-300/80 dark:border-slate-700/80';
                    if (task.progress === 'Completed') {
                      barStyle =
                        'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm shadow-emerald-500/25 ring-1 ring-emerald-400/30';
                    } else if (task.progress === 'In Progress') {
                      barStyle =
                        'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-sm shadow-amber-500/30 ring-1 ring-amber-400/40 animate-pulse';
                    } else if (task.progress === 'Overdue') {
                      barStyle =
                        'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-sm shadow-rose-500/30 ring-1 ring-rose-400/40';
                    } else {
                      barStyle =
                        'bg-indigo-500/25 hover:bg-indigo-500/35 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/80 border border-indigo-300/40 dark:border-indigo-700/50 text-indigo-700 dark:text-indigo-300';
                    }

                    return (
                      <div
                        key={w}
                        className={`border-r border-slate-100 dark:border-slate-850 p-1 flex items-center justify-center relative transition-colors ${
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
                            className={`w-full h-5 rounded-md ${barStyle} flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-[2]`}
                          >
                            {task.progress === 'Completed' && (
                              <Check className="w-3 h-3 text-white stroke-[3]" />
                            )}
                            {task.progress === 'Overdue' && (
                              <AlertTriangle className="w-3 h-3 text-white" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
