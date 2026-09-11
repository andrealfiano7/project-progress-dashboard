import React, { useState } from 'react';
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
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Gantt Chart Timeline (24 Minggu)
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Peta jadwal pelaksanaan per minggu (Garis kuning: Cut-off W{cutoffWeek})
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
            className="text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            {phases.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'Semua Fase' : p}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'Semua Status' : s}
              </option>
            ))}
          </select>

          {/* Legend Badges */}
          <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-[11px]">
            <span className="flex items-center text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded bg-emerald-500 mr-1" />
              Selesai
            </span>
            <span className="flex items-center text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded bg-amber-500 mr-1 animate-pulse" />
              Aktif
            </span>
            <span className="flex items-center text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded bg-rose-500 mr-1 animate-ping" />
              Overdue
            </span>
            <span className="flex items-center text-slate-400">
              <span className="w-2 h-2 rounded bg-slate-300 dark:bg-slate-700 mr-1" />
              Rencana
            </span>
          </div>
        </div>
      </div>

      {/* Gantt Matrix Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="min-w-[1020px]">
          {/* Header Rows */}
          {/* 1. Month Header */}
          <div className="grid grid-cols-[300px_repeat(24,minmax(28px,1fr))] bg-slate-100 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
            <div className="p-2.5 pl-3 border-r border-slate-200 dark:border-slate-700 flex items-center justify-between sticky left-0 bg-slate-100 dark:bg-slate-800 z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
              <span>Item Pekerjaan &amp; Fase</span>
              <span className="text-[10px] text-slate-400 font-normal mr-2">Tgt / Cap</span>
            </div>
            {months.map((m, idx) => (
              <div
                key={m.name}
                className={`col-span-4 p-2 text-center border-r border-slate-200 dark:border-slate-700 text-[11px] ${
                  idx === Math.floor((cutoffWeek - 1) / 4)
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-extrabold'
                    : ''
                }`}
              >
                {m.name}
              </div>
            ))}
          </div>

          {/* 2. Week Number Header */}
          <div className="grid grid-cols-[300px_repeat(24,minmax(28px,1fr))] bg-slate-50 dark:bg-slate-850 text-[11px] font-sans font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
            <div className="p-2 pl-3 border-r border-slate-200 dark:border-slate-700 text-[10px] uppercase font-sans text-slate-400 sticky left-0 bg-slate-50 dark:bg-slate-850 z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
              {filteredTasks.length} Pekerjaan Terdaftar
            </div>
            {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => {
              const isCutoff = w === cutoffWeek;
              return (
                <div
                  key={w}
                  className={`p-1.5 text-center border-r border-slate-200 dark:border-slate-700 tabular-nums ${
                    isCutoff
                      ? 'bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold'
                      : ''
                  }`}
                >
                  W{w}
                </div>
              );
            })}
          </div>

          {/* Task Rows Grouped by Phase */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTasks.map((task) => {
              const badge = getStatusBadge(task.progress);

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask && onSelectTask(task)}
                  className="grid grid-cols-[300px_repeat(24,minmax(28px,1fr))] hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* Task Info Column */}
                  <div className="p-2.5 pl-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-hidden sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] group-hover:bg-slate-50 dark:group-hover:bg-slate-800/80 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-sans font-bold text-slate-400 tabular-nums">
                          #{task.id}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors font-sans">
                          {task.task}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-sans">
                        <span>Tgt: {task.target}</span>
                        <span>&bull;</span>
                        <span className={task.capaian > 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                          Cap: {task.capaian.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap font-sans tabular-nums ${badge.bg}`}>
                      {(task.capaian * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* 24 Week Cells */}
                  {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => {
                    const isCutoff = w === cutoffWeek;
                    const isScheduled = task.weeks.includes(w);

                    let barColor = 'bg-slate-200 dark:bg-slate-700';
                    if (task.progress === 'Completed') {
                      barColor = 'bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20';
                    } else if (task.progress === 'In Progress') {
                      barColor = 'bg-amber-500 hover:bg-amber-600 animate-pulse shadow-sm shadow-amber-500/20';
                    } else if (task.progress === 'Overdue') {
                      barColor = 'bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/20';
                    } else {
                      barColor = 'bg-indigo-400/70 hover:bg-indigo-500/80 dark:bg-indigo-900/60 dark:hover:bg-indigo-800';
                    }

                    return (
                      <div
                        key={w}
                        className={`border-r border-slate-100 dark:border-slate-800/80 p-1 flex items-center justify-center relative ${
                          isCutoff ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        {/* Cutoff vertical line guide */}
                        {isCutoff && (
                          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-amber-400/40 pointer-events-none" />
                        )}

                        {isScheduled && (
                          <div
                            title={`#${task.id} ${task.task} (Minggu ${w})\nTarget: ${task.target} | Capaian: ${task.capaian} (${(task.capaian * 100).toFixed(0)}%)\nStatus: ${task.progress}\nPIC: ${task.pic}`}
                            className={`w-full h-5 rounded-md ${barColor} flex items-center justify-center transition-all hover:scale-105 active:scale-95`}
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
