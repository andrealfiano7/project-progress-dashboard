import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { WeeklySCurvePoint } from '../types/timeline';
import { TrendingUp, Calendar } from 'lucide-react';

interface SCurveChartProps {
  data: WeeklySCurvePoint[];
  cutoffWeek: number;
}

export const SCurveChart: React.FC<SCurveChartProps> = ({ data, cutoffWeek }) => {
  const [chartMode, setChartMode] = useState<'cumulative' | 'weekly'>('cumulative');

  // Find cutoff data point
  const currentPoint = data.find((d) => d.week === cutoffWeek);
  const plannedCutoff = currentPoint ? currentPoint.plannedCumulative : 0;
  const actualCutoff = currentPoint ? currentPoint.actualCumulative : 0;
  const variance = Math.round(actualCutoff - plannedCutoff);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pData: WeeklySCurvePoint = payload[0]?.payload;
      const isPastCutoff = pData.week > cutoffWeek;

      return (
        <div className="bg-white/95 dark:bg-slate-900/95 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs backdrop-blur-md min-w-[220px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-white flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
              Minggu ke-{pData.week}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Bulan {pData.month} (M{pData.weekInMonth})
            </span>
          </div>

          <div className="space-y-2">
            {chartMode === 'cumulative' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-500 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-2 inline-block" />
                    Rencana Kumulatif:
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 font-sans tabular-nums">
                    {pData.plannedCumulative}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center text-slate-500 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 inline-block" />
                    Realisasi Kumulatif:
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-sans tabular-nums">
                    {isPastCutoff ? '—' : `${pData.actualCumulative}%`}
                  </span>
                </div>

                {!isPastCutoff && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Deviasi / Varians:</span>
                    <span className={`font-bold font-sans tabular-nums ${
                      pData.actualCumulative >= pData.plannedCumulative ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {(pData.actualCumulative - pData.plannedCumulative) >= 0 ? '+' : ''}
                      {Math.round(pData.actualCumulative - pData.plannedCumulative)}%
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Rencana Mingguan:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-sans tabular-nums">
                    {pData.plannedWeekly}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Realisasi Mingguan:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-sans tabular-nums">
                    {isPastCutoff ? '—' : `${pData.actualWeekly}%`}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Format data so actual line stops at cutoff week cleanly
  const formattedData = data.map((d) => ({
    ...d,
    actualCumulativePlot: d.week <= cutoffWeek ? d.actualCumulative : null,
    actualWeeklyPlot: d.week <= cutoffWeek ? d.actualWeekly : null,
  }));

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 p-3.5 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
      {/* Header of Chart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Kurva S (S-Curve) Progres Proyek
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Perbandingan Rencana Kumulatif vs Realisasi Aktual sepanjang 24 Minggu
          </p>
        </div>

        {/* Controls & Metrics Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Cutoff stats */}
          <div className="flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] sm:text-xs border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-slate-500 dark:text-slate-400 mr-1.5 sm:mr-2">W{cutoffWeek}:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200 font-sans tabular-nums mr-1.5 sm:mr-2">
              P {plannedCutoff}% | A {actualCutoff}%
            </span>
            <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] font-sans tabular-nums ${
              variance >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {variance >= 0 ? `+${variance}%` : `${variance}%`}
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setChartMode('cumulative')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold text-[11px] sm:text-xs transition-all ${
                chartMode === 'cumulative'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Kumulatif
            </button>
            <button
              onClick={() => setChartMode('weekly')}
              className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold text-[11px] sm:text-xs transition-all ${
                chartMode === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Mingguan
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
          >
            <defs>
              <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} />

            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              minTickGap={10}
            />

            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              unit="%"
              domain={[0, chartMode === 'cumulative' ? 100 : 'auto']}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
            />

            {/* Cut-off Week Line */}
            <ReferenceLine
              x={`W${cutoffWeek}`}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: `Cut-off W${cutoffWeek}`,
                position: 'top',
                fill: '#f59e0b',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {chartMode === 'cumulative' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="plannedCumulative"
                  name="Rencana Kumulatif (Plan %)"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#plannedGradient)"
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  dataKey="actualCumulativePlot"
                  name="Realisasi Kumulatif (Actual %)"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#actualGradient)"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="plannedWeekly"
                  name="Rencana per Minggu (%)"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive={true}
                  animationDuration={800}
                />
                <Line
                  type="monotone"
                  dataKey="actualWeeklyPlot"
                  name="Realisasi per Minggu (%)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Month grouping indicator bar */}
      <div className="grid grid-cols-6 text-center text-[10px] font-semibold text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div>Bulan ke-1 (W1-4)</div>
        <div>Bulan ke-2 (W5-8)</div>
        <div>Bulan ke-3 (W9-12)</div>
        <div className="text-amber-600 dark:text-amber-400 font-bold">Bulan ke-4 (W13-16) ★</div>
        <div>Bulan ke-5 (W17-20)</div>
        <div>Bulan ke-6 (W21-24)</div>
      </div>
    </div>
  );
};
