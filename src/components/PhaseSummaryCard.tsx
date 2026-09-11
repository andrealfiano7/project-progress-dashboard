import React from 'react';
import { PhaseSummary } from '../types/timeline';
import { FolderGit2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface PhaseSummaryCardProps {
  summaries: PhaseSummary[];
  onSelectPhase?: (phase: string) => void;
  selectedPhase?: string;
}

export const PhaseSummaryCard: React.FC<PhaseSummaryCardProps> = ({
  summaries,
  onSelectPhase,
  selectedPhase,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all animate-fade-in-up">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Target &amp; Capaian per Fase Proyek
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Perbandingan akumulasi Target vs Realisasi Capaian pada setiap tahapan (sesuai formulasi Excel)
            </p>
          </div>
        </div>

        {selectedPhase && (
          <button
            onClick={() => onSelectPhase && onSelectPhase('')}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold"
          >
            Reset Filter Fase
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaries.map((s, idx) => {
          const isCompleted = s.progressPercentage >= 100;
          const hasOverdue = s.overdueTasks > 0;
          const isSelected = selectedPhase === s.phase;

          return (
            <div
              key={s.phase}
              onClick={() => onSelectPhase && onSelectPhase(isSelected ? '' : s.phase)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group card-lift relative overflow-hidden ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/60'
              }`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Top Row: Phase Title & % */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {s.phase.split(' - ')[0] || 'FASE'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {s.phase.includes(' - ') ? s.phase.split(' - ')[1] : s.phase}
                  </h4>
                </div>

                <span
                  className={`text-xs font-bold font-sans tabular-nums px-2.5 py-0.5 rounded-md ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : hasOverdue
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : s.progressPercentage > 0
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s.progressPercentage}%
                </span>
              </div>

              {/* Progress Bar with Shimmer */}
              <div className="mt-3 w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : hasOverdue
                      ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 progress-shimmer'
                      : s.progressPercentage > 0
                      ? 'bg-amber-500 progress-shimmer'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${s.progressPercentage}%` }}
                />
              </div>

              {/* Exact Target vs Capaian Row matching Excel */}
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="font-sans text-xs text-slate-600 dark:text-slate-300">
                  <span>Target: <strong>{s.targetSum.toFixed(2)}</strong></span> &bull; <span>Capaian: <strong className={isCompleted ? 'text-emerald-600 dark:text-emerald-400' : hasOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-100'}>{s.capaianSum.toFixed(2)}</strong></span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-sans">
                  {s.completedTasks > 0 && (
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold" title={`${s.completedTasks} task selesai`}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                      {s.completedTasks}
                    </span>
                  )}
                  {s.inProgressTasks > 0 && (
                    <span className="flex items-center text-amber-600 dark:text-amber-400 font-bold" title={`${s.inProgressTasks} task sedang berjalan`}>
                      <Clock className="w-3.5 h-3.5 mr-0.5" />
                      {s.inProgressTasks}
                    </span>
                  )}
                  {s.overdueTasks > 0 && (
                    <span className="flex items-center text-rose-600 dark:text-rose-400 font-bold" title={`${s.overdueTasks} task overdue`}>
                      <AlertTriangle className="w-3.5 h-3.5 mr-0.5" />
                      {s.overdueTasks}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
