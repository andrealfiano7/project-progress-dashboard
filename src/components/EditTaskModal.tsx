import React, { useState, useEffect } from 'react';
import { TimelineTask, TaskStatus } from '../types/timeline';
import { X, Save } from 'lucide-react';

interface EditTaskModalProps {
  task: TimelineTask | null; // If null, creating a new task
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TimelineTask) => void;
  existingPhases: string[];
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  existingPhases,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<TimelineTask>({
    id: Date.now(),
    phase: existingPhases[0] || 'FASE 0 - INISIASI PROYEK',
    task: '',
    output: '',
    pic: '',
    target: 1,
    capaian: 0,
    progress: 'Plan',
    weeks: [1],
    notes: '',
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        id: Math.floor(Math.random() * 1000) + 22,
        phase: existingPhases[0] || 'FASE 0 - INISIASI PROYEK',
        task: '',
        output: '',
        pic: 'Konsultan Centrois',
        target: 1,
        capaian: 0,
        progress: 'Plan',
        weeks: [1],
        notes: '',
      });
    }
  }, [task, isOpen]);

  const toggleWeek = (week: number) => {
    setFormData((prev) => {
      const exists = prev.weeks.includes(week);
      const newWeeks = exists
        ? prev.weeks.filter((w) => w !== week)
        : [...prev.weeks, week].sort((a, b) => a - b);
      return { ...prev, weeks: newWeeks.length > 0 ? newWeeks : [week] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {task ? `Edit Pekerjaan #${task.id}` : 'Tambah Pekerjaan Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Phase Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Fase Proyek
            </label>
            <select
              value={formData.phase}
              onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              {existingPhases.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Nama Item Pekerjaan
            </label>
            <input
              type="text"
              required
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              placeholder="Contoh: Penyusunan Dokumen BCP..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Deliverables / Output */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Output / Deliverables (Gunakan baris baru untuk tiap poin)
            </label>
            <textarea
              rows={3}
              value={formData.output}
              onChange={(e) => setFormData({ ...formData, output: e.target.value })}
              placeholder="- Dokumen Draft BCP&#10;- Berita Acara&#10;- Foto Dokumentasi"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* PIC */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Penanggung Jawab (PIC)
            </label>
            <input
              type="text"
              required
              value={formData.pic}
              onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
              placeholder="Konsultan Centrois & PIC API"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Target, Capaian & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Target (Bobot)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Capaian (0.0 - 1.0)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={formData.capaian}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  let newStatus = formData.progress;
                  if (val >= 1) newStatus = 'Completed';
                  else if (val > 0 && newStatus === 'Plan') newStatus = 'In Progress';
                  setFormData({ ...formData, capaian: val, progress: newStatus });
                }}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.progress}
                onChange={(e) => {
                  const newStatus = e.target.value as TaskStatus;
                  let autoCapaian = formData.capaian;
                  if (newStatus === 'Completed') autoCapaian = 1.0;
                  else if (newStatus === 'Plan' && autoCapaian === 1.0) autoCapaian = 0.0;
                  setFormData({ ...formData, progress: newStatus, capaian: autoCapaian });
                }}
                className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Overdue">Overdue</option>
                <option value="Plan">Plan</option>
              </select>
            </div>
          </div>

          {/* Weeks Picker (24 Weeks arranged by 6 months) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Jadwal Minggu Pelaksanaan (Pilih minggu aktif)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              {Array.from({ length: 6 }, (_, mIdx) => {
                const monthWeeks = [mIdx * 4 + 1, mIdx * 4 + 2, mIdx * 4 + 3, mIdx * 4 + 4];
                return (
                  <div key={mIdx} className="space-y-1.5 bg-white/60 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 block text-center">
                      Bulan {mIdx + 1}
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      {monthWeeks.map((w) => {
                        const isSelected = formData.weeks.includes(w);
                        return (
                          <button
                            type="button"
                            key={w}
                            onClick={() => toggleWeek(w)}
                            className={`p-1.5 sm:p-1 text-[11px] sm:text-[10px] font-semibold rounded text-center transition-all ${
                              isSelected
                                ? 'bg-sky-600 text-white shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-sky-400'
                            }`}
                          >
                            W{w}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Catatan Tindak Lanjut
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Catatan kendala, isu lapangan, atau kesepakatan notulen..."
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
