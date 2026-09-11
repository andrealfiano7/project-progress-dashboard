import React from 'react';
import { TimelineTask } from '../types/timeline';
import { getStatusBadge } from '../utils/calculations';
import { 
  X, 
  Calendar, 
  User, 
  FileCheck, 
  CheckSquare, 
  Edit3
} from 'lucide-react';

interface TaskDetailModalProps {
  task: TimelineTask | null;
  onClose: () => void;
  onEdit: (task: TimelineTask) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onEdit,
}) => {
  if (!task) return null;

  const badge = getStatusBadge(task.progress);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-850">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                Tugas #{task.id}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {task.phase}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {task.task}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Target & Capaian Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Status &amp; Capaian Pekerjaan</div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg}`}>
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${badge.dot}`} />
                  {task.progress}
                </span>
                <span className="text-sm font-extrabold tabular-nums text-slate-900 dark:text-white">
                  {(task.capaian * 100).toFixed(0)}%
                </span>
                <span className="text-xs text-slate-400">
                  (Target: {task.target})
                </span>
              </div>
            </div>

            <div className="w-full sm:w-48">
              <div className="flex justify-between text-[11px] tabular-nums mb-1 text-slate-500 dark:text-slate-400">
                <span>Realisasi</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{task.capaian} / {task.target}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    task.capaian >= 1
                      ? 'bg-emerald-500'
                      : task.capaian > 0
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${Math.min(100, task.capaian * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Deliverables / Output List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center mb-2">
              <FileCheck className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
              Output / Deliverables Dokumen
            </h3>
            <div className="space-y-2">
              {task.output ? (
                task.output.split('\n').map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <CheckSquare className="w-4 h-4 mr-2.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item.replace(/^-\s*/, '')}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Belum ada dokumen output terdaftar untuk pekerjaan ini.
                </div>
              )}
            </div>
          </div>

          {/* PIC Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center mb-2">
              <User className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
              Penanggung Jawab (PIC)
            </h3>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {task.pic.split('\n').map((p, idx) => (
                <div key={idx} className="flex items-center space-x-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  <span>{p.replace(/^-\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline / Scheduled Weeks */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center mb-2">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
              Jadwal Pelaksanaan ({task.weeks.length} Minggu Terjadwal)
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {task.weeks.map((w) => (
                <span
                  key={w}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                >
                  Minggu {w} (Bulan {Math.ceil(w / 4)})
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {task.notes && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center mb-1">
                Catatan &amp; Tindak Lanjut
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                {task.notes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2 bg-slate-50/50 dark:bg-slate-850">
          <button
            onClick={() => {
              onClose();
              onEdit(task);
            }}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit Tugas Ini
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
