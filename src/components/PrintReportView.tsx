import React from 'react';
import { TimelineTask, ProjectMetadata } from '../types/timeline';
import { ProjectStats } from '../utils/calculations';

interface PrintReportViewProps {
  metadata: ProjectMetadata;
  tasks: TimelineTask[];
  stats: ProjectStats;
  cutoffWeek: number;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  metadata,
  tasks,
  stats,
  cutoffWeek,
}) => {
  const currentMonth = Math.ceil(cutoffWeek / 4);

  return (
    <div className="print-only hidden p-8 max-w-5xl mx-auto bg-white text-black font-sans">
      {/* Letterhead */}
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black tracking-tight uppercase">
            Executive Progress Report
          </h1>
          <h2 className="text-sm font-bold text-slate-800 mt-1">
            {metadata.title}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Institusi: <span className="font-semibold">{metadata.institution}</span> &bull; Pelaksana: {metadata.contractor}
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold">Periode Cut-off: Minggu ke-{cutoffWeek} (Bulan {currentMonth})</p>
          <p className="text-slate-500">Tanggal Dokumen: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* KPI Highlights Box */}
      <div className="grid grid-cols-4 gap-3 p-4 bg-slate-100 rounded-lg border border-slate-300 mb-6 text-xs">
        <div>
          <span className="text-slate-500 block">Target Proyek:</span>
          <span className="text-xl font-bold tabular-nums">{stats.targetPercent}% ({stats.totalTarget} tugas)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Capaian Target:</span>
          <span className="text-xl font-bold tabular-nums">{stats.currentPeriodProgressPercent}% ({Math.round(stats.totalCapaian)} capaian)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Tugas Selesai (Completed):</span>
          <span className="text-xl font-bold tabular-nums">{stats.completedTasks} / {stats.totalTasks} ({stats.completedPercent}%)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Status Deviasi Jadwal:</span>
          <span className="text-xl font-bold tabular-nums">
            {stats.variancePercent >= 0 ? `+${stats.variancePercent}% (On Track)` : `${stats.variancePercent}% (Delay)`}
          </span>
        </div>
      </div>

      {/* Task Progress Matrix */}
      <h3 className="text-xs font-bold uppercase tracking-wider mb-2">
        Rincian Capaian per Item Pekerjaan
      </h3>
      <table className="w-full text-left text-[10px] border-collapse border border-slate-300 mb-8">
        <thead>
          <tr className="bg-slate-200">
            <th className="border border-slate-300 p-1.5 w-8">#</th>
            <th className="border border-slate-300 p-1.5">Item Pekerjaan &amp; Output</th>
            <th className="border border-slate-300 p-1.5 w-32">PIC</th>
            <th className="border border-slate-300 p-1.5 text-center w-12">Target</th>
            <th className="border border-slate-300 p-1.5 text-center w-14">Capaian</th>
            <th className="border border-slate-300 p-1.5 w-20">Status</th>
            <th className="border border-slate-300 p-1.5 text-center w-16">Minggu</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-b border-slate-200">
              <td className="border border-slate-300 p-1.5 tabular-nums text-slate-700">{t.id}</td>
              <td className="border border-slate-300 p-1.5">
                <div className="font-bold">{t.task}</div>
                <div className="text-[9px] text-slate-500 line-clamp-1">{t.output}</div>
              </td>
              <td className="border border-slate-300 p-1.5 text-[9px]">{t.pic}</td>
              <td className="border border-slate-300 p-1.5 text-center tabular-nums">{t.target}</td>
              <td className="border border-slate-300 p-1.5 text-center font-bold tabular-nums">
                {(t.capaian * 100).toFixed(0)}%
              </td>
              <td className="border border-slate-300 p-1.5 font-semibold">{t.progress}</td>
              <td className="border border-slate-300 p-1.5 text-center text-[9px] tabular-nums">
                W{t.weeks.join(',')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Signature Section */}
      <div className="grid grid-cols-2 gap-12 text-center text-xs mt-12 pt-6 border-t border-slate-300">
        <div>
          <p className="font-bold">Disetujui oleh:</p>
          <p className="text-slate-500 mb-16">PT Angkasa Pura Indonesia (API)</p>
          <p className="font-bold border-t border-slate-400 inline-block px-12 pt-1">
            Project Management Officer (PMO)
          </p>
        </div>
        <div>
          <p className="font-bold">Disiapkan oleh:</p>
          <p className="text-slate-500 mb-16">Centrois Consulting Team</p>
          <p className="font-bold border-t border-slate-400 inline-block px-12 pt-1">
            Lead Consultant / Project Manager
          </p>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="text-center text-[10px] text-slate-400 mt-10 pt-4 border-t border-slate-200">
        &copy; {new Date().getFullYear()} Evagenesis Consulting &bull; Dokumen Pelaporan Progres {metadata.title} ({metadata.institution})
      </div>
    </div>
  );
};
