import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CalendarClock, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Target,
  Award,
  Calendar
} from 'lucide-react';
import { ProjectStats } from '../utils/calculations';
import { useAnimatedCounter } from '../utils/useAnimatedCounter';

interface KPICardsProps {
  stats: ProjectStats;
  onFilterStatus?: (status: string) => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ stats, onFilterStatus }) => {
  const isAhead = stats.variancePercent >= 0;

  // Animated numbers (seluruh presentasi dibulatkan ke integer utuh)
  const animTargetPercent = useAnimatedCounter(stats.targetPercent, 700, 0);
  const animPeriodProgress = useAnimatedCounter(stats.currentPeriodProgressPercent, 750, 0);
  const animOverallProgress = useAnimatedCounter(stats.overallProgressPercent, 800, 0);
  const animCompletedCount = useAnimatedCounter(stats.completedTasks, 600, 0);
  const animCompletedPercent = useAnimatedCounter(stats.completedPercent, 600, 0);
  const animInProgressCount = useAnimatedCounter(stats.inProgressTasks, 600, 0);
  const animInProgressPercent = useAnimatedCounter(stats.inProgressPercent, 600, 0);
  const animOverdueCount = useAnimatedCounter(stats.overdueTasks, 600, 0);
  const animOverduePercent = useAnimatedCounter(stats.overduePercent, 600, 0);
  const animPlanCount = useAnimatedCounter(stats.planTasks, 600, 0);
  const animPlanPercent = useAnimatedCounter(stats.planPercent, 600, 0);
  const animTotalTarget = useAnimatedCounter(stats.totalTarget, 600, 0);
  const animTotalCapaian = useAnimatedCounter(Math.round(stats.totalCapaian), 600, 0);

  return (
    <div className="space-y-4">
      {/* TIER 1: 2 Hero Cards Luas untuk Target % dan Capaian % */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* HERO CARD 1: Presentase Target (Target %) */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-6 shadow-soft relative overflow-hidden flex flex-col justify-between border border-sky-800/40 card-lift animate-fade-in-up stagger-1 group">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300 font-sans">
                    Target Proyek Periode Ini
                  </h3>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Cakupan pekerjaan minggu ke-1 s/d ke-13
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 font-sans">
                <Calendar className="w-3 h-3 mr-1" />
                W1 &ndash; W13
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-extrabold tracking-tight tabular-nums font-sans text-white">
                    {animTargetPercent}%
                  </span>
                  <span className="text-xs text-sky-200 font-semibold font-sans">
                    Target Aktif
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 font-sans">
                  <strong className="text-white font-bold">{animTotalTarget} dari {stats.totalTasks} pekerjaan</strong> masuk target periode berjalan
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-sans block">Bobot Target:</span>
                <span className="text-base font-bold text-sky-300 font-sans tabular-nums">
                  13.00 <span className="text-xs font-normal text-slate-400">/ 21 tugas</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-sans font-medium">
              <span>Rasio Target terhadap Total Proyek</span>
              <span className="tabular-nums font-bold text-white">{stats.targetPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-sky-700/40">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full transition-all duration-700"
                style={{ width: `${stats.targetPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* HERO CARD 2: Presentase Capaian (Capaian %) */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-6 shadow-soft relative overflow-hidden flex flex-col justify-between border border-emerald-700/40 card-lift animate-fade-in-up stagger-2 group">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-sans">
                    Realisasi Capaian Proyek
                  </h3>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Akumulasi progres terhadap target aktif
                  </span>
                </div>
              </div>

              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans ${
                isAhead 
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/30' 
                  : 'bg-rose-500/25 text-rose-300 border border-rose-400/30'
              }`}>
                {isAhead ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    +{stats.variancePercent}% On Track
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 mr-1" />
                    {stats.variancePercent}% Delay
                  </>
                )}
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl font-extrabold tracking-tight tabular-nums font-sans text-emerald-400">
                    {animPeriodProgress}%
                  </span>
                  <span className="text-xs text-emerald-200 font-semibold font-sans">
                    dari Target
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 font-sans">
                  Realisasi <strong className="text-white font-bold">{animTotalCapaian} capaian</strong> ({animOverallProgress}% dari total 21 tugas)
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-sans block">Capaian vs Target:</span>
                <span className="text-base font-bold text-emerald-300 font-sans tabular-nums">
                  12.00 <span className="text-xs font-normal text-slate-400">/ 13.00</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10">
            <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-sans font-medium">
              <span>Tingkat Ketercapaian Target Aktif</span>
              <span className="tabular-nums font-bold text-emerald-400">{stats.currentPeriodProgressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-emerald-700/40">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-700 progress-shimmer"
                style={{ width: `${stats.currentPeriodProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TIER 2: 4 Status Cards (Spacious 4 Columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 3: Completed */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('Completed')}
          className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all cursor-pointer group card-lift animate-fade-in-up stagger-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide font-sans">
                Completed
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums font-sans">
              {animCompletedCount}
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-sans tabular-nums">
              {animCompletedPercent}%
            </span>
          </div>

          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 font-sans">
            <span>Tuntas 100%</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">11 Pekerjaan</span>
          </div>
        </div>

        {/* CARD 4: In Progress */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('In Progress')}
          className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-700 transition-all cursor-pointer group card-lift animate-fade-in-up stagger-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide font-sans">
                In Progress
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums font-sans">
              {animInProgressCount}
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 font-sans tabular-nums">
              {animInProgressPercent}%
            </span>
          </div>

          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 truncate pt-2.5 border-t border-slate-100 dark:border-slate-800 font-sans">
            Penyusunan BCS (<span className="font-bold text-amber-600 dark:text-amber-400">25%</span>)
          </div>
        </div>

        {/* CARD 5: Overdue */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('Overdue')}
          className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-rose-200 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-700 transition-all cursor-pointer group card-lift animate-fade-in-up stagger-5 hover:shadow-glow-rose"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 relative group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
                {stats.overdueTasks > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide font-sans">
                Overdue
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums font-sans">
              {animOverdueCount}
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800 font-sans tabular-nums">
              {animOverduePercent}%
            </span>
          </div>

          <div className="mt-3 text-xs text-rose-600/90 dark:text-rose-400/90 truncate font-semibold pt-2.5 border-t border-slate-100 dark:border-slate-800 font-sans">
            Penyusunan BIA (<span className="font-bold">75%</span>)
          </div>
        </div>

        {/* CARD 6: Plan */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('Plan')}
          className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group card-lift animate-fade-in-up stagger-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:scale-110 transition-transform">
                <CalendarClock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide font-sans">
                Plan
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tabular-nums font-sans">
              {animPlanCount}
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 font-sans tabular-nums">
              {animPlanPercent}%
            </span>
          </div>

          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800 font-sans">
            Fase 3, 4, 5 &amp; BAST
          </div>
        </div>
      </div>

      {/* TIER 3: Summary Ribbon Bersih & Modern (Tanpa Font Mono Kaku) */}
      <div className="py-3 px-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in-up">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700 dark:text-slate-200 font-sans">
            Ringkasan Target &amp; Capaian Proyek:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-sans text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">Target Proyek:</span>
            <span className="font-bold text-sky-600 dark:text-sky-400 tabular-nums">
              {animTargetPercent}% ({stats.totalTarget} tugas)
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-emerald-700 dark:text-emerald-300">Capaian Target:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {animPeriodProgress}% ({Math.round(stats.totalCapaian)} capaian)
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <span className="text-indigo-700 dark:text-indigo-300">Milestone Total:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {animOverallProgress}%
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500">Deviasi Jadwal:</span>
            <span className={`font-bold tabular-nums ${
              isAhead ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {isAhead ? `+${stats.variancePercent}% On Track` : `${stats.variancePercent}% Delay`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
