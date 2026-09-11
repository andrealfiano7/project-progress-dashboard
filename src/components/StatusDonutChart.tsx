import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ProjectStats } from '../utils/calculations';
import { PieChart as PieIcon, CheckCircle2, Clock, AlertTriangle, Calendar } from 'lucide-react';

interface StatusDonutChartProps {
  stats: ProjectStats;
  onFilterStatus?: (status: string) => void;
}

const COLORS = {
  Completed: '#10b981', // emerald-500
  'In Progress': '#f59e0b', // amber-500
  Overdue: '#f43f5e', // rose-500
  Plan: '#94a3b8', // slate-400
};

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ stats, onFilterStatus }) => {
  const chartData = [
    { name: 'Completed', value: stats.completedTasks, color: COLORS.Completed, percent: stats.completedPercent },
    { name: 'In Progress', value: stats.inProgressTasks, color: COLORS['In Progress'], percent: stats.inProgressPercent },
    { name: 'Overdue', value: stats.overdueTasks, color: COLORS.Overdue, percent: stats.overduePercent },
    { name: 'Plan', value: stats.planTasks, color: COLORS.Plan, percent: stats.planPercent },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-slate-800 dark:text-white">{data.name}</span>
          </div>
          <div className="mt-1 text-slate-600 dark:text-slate-300 font-sans tabular-nums">
            {data.value} Pekerjaan ({data.percent}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all flex flex-col justify-between animate-fade-in-up card-lift">
      <div>
        <div className="flex items-center space-x-2 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
            <PieIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            Distribusi Status Pekerjaan
          </h3>
        </div>

        {/* Donut Container */}
        <div className="relative h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-sans tabular-nums">
              {stats.totalTasks}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
              Total Tugas
            </span>
          </div>
        </div>
      </div>

      {/* Legend & Breakdown List */}
      <div className="space-y-2 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div
          onClick={() => onFilterStatus && onFilterStatus('Completed')}
          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Completed</span>
          </div>
          <div className="flex items-center space-x-2 font-sans tabular-nums">
            <span className="font-bold text-slate-800 dark:text-slate-200">{stats.completedTasks}</span>
            <span className="text-slate-400 text-[11px]">({stats.completedPercent}%)</span>
          </div>
        </div>

        <div
          onClick={() => onFilterStatus && onFilterStatus('In Progress')}
          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">In Progress</span>
          </div>
          <div className="flex items-center space-x-2 font-sans tabular-nums">
            <span className="font-bold text-slate-800 dark:text-slate-200">{stats.inProgressTasks}</span>
            <span className="text-slate-400 text-[11px]">({stats.inProgressPercent}%)</span>
          </div>
        </div>

        <div
          onClick={() => onFilterStatus && onFilterStatus('Overdue')}
          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-rose-600 dark:text-rose-400 font-medium">Overdue</span>
          </div>
          <div className="flex items-center space-x-2 font-sans tabular-nums">
            <span className="font-bold text-rose-600 dark:text-rose-400">{stats.overdueTasks}</span>
            <span className="text-rose-400 text-[11px]">({stats.overduePercent}%)</span>
          </div>
        </div>

        <div
          onClick={() => onFilterStatus && onFilterStatus('Plan')}
          className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Plan</span>
          </div>
          <div className="flex items-center space-x-2 font-sans tabular-nums">
            <span className="font-bold text-slate-800 dark:text-slate-200">{stats.planTasks}</span>
            <span className="text-slate-400 text-[11px]">({stats.planPercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
