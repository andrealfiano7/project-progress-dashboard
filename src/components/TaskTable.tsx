import React, { useState } from 'react';
import { TimelineTask, TaskStatus } from '../types/timeline';
import { getStatusBadge } from '../utils/calculations';
import { 
  Search, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  User, 
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';

interface TaskTableProps {
  tasks: TimelineTask[];
  onSelectTask: (task: TimelineTask) => void;
  onEditTask: (task: TimelineTask) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: () => void;
  onUpdateStatus: (taskId: number, newStatus: TaskStatus, newCapaian?: number) => void;
  initialStatusFilter?: string;
  initialPhaseFilter?: string;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onUpdateStatus,
  initialStatusFilter = 'All',
  initialPhaseFilter = '',
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [phaseFilter, setPhaseFilter] = useState<string>(initialPhaseFilter);
  const [sortField, setSortField] = useState<'id' | 'task' | 'target' | 'capaian' | 'progress'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  const phases = ['All', ...Array.from(new Set(tasks.map((t) => t.phase)))];

  const filteredTasks = tasks
    .filter((t) => {
      if (statusFilter !== 'All' && t.progress !== statusFilter) return false;
      if (phaseFilter && phaseFilter !== 'All' && t.phase !== phaseFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          t.task.toLowerCase().includes(q) ||
          t.pic.toLowerCase().includes(q) ||
          t.output.toLowerCase().includes(q) ||
          t.phase.toLowerCase().includes(q) ||
          String(t.id).includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') comparison = a.id - b.id;
      else if (sortField === 'task') comparison = a.task.localeCompare(b.task);
      else if (sortField === 'target') comparison = a.target - b.target;
      else if (sortField === 'capaian') comparison = a.capaian - b.capaian;
      else if (sortField === 'progress') comparison = a.progress.localeCompare(b.progress);
      return sortAsc ? comparison : -comparison;
    });

  const handleSort = (field: 'id' | 'task' | 'target' | 'capaian' | 'progress') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleQuickCapaianChange = (taskId: number, newCapaian: number) => {
    let newStatus: TaskStatus = 'Plan';
    if (newCapaian >= 1) newStatus = 'Completed';
    else if (newCapaian > 0) newStatus = 'In Progress';
    onUpdateStatus(taskId, newStatus, newCapaian);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 transition-all overflow-hidden animate-fade-in-up">
      {/* Search, Filters & Action Bar */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas, PIC, dokumen output, atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>

        {/* Right: Filters & Add Task */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Phase Filter */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
          >
            {phases.map((p) => (
              <option key={p} value={p}>
                {p === 'All' ? 'Semua Fase' : p}
              </option>
            ))}
          </select>

          {/* Status Filter Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 text-xs">
            {['All', 'Completed', 'In Progress', 'Overdue', 'Plan'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {st === 'All' ? 'Semua' : st}
              </button>
            ))}
          </div>

          {/* Add New Task Button */}
          <button
            onClick={onAddTask}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[2.5]" />
            Tambah Pekerjaan
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-4 w-14 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>#</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('task')}
                className="py-3 px-4 min-w-[240px] cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Item Pekerjaan &amp; Fase</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 min-w-[200px]">Output Dokumen</th>
              <th className="py-3 px-4 min-w-[180px]">Penanggung Jawab (PIC)</th>
              <th 
                onClick={() => handleSort('target')}
                className="py-3 px-3 text-center w-24 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Target</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('capaian')}
                className="py-3 px-3 text-center w-36 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Capaian Realisasi</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('progress')}
                className="py-3 px-4 w-36 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Status Progres</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4 text-right w-24">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  Tidak ada data pekerjaan yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredTasks.map((t) => {
                const badge = getStatusBadge(t.progress);
                const hasGap = t.target > 0 && t.capaian < t.target;
                const gapVal = (t.capaian - t.target).toFixed(2);

                return (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                      #{t.id}
                    </td>

                    {/* Task & Phase */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          {t.phase}
                        </span>
                        <div
                          onClick={() => onSelectTask(t)}
                          className="font-bold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer transition-colors text-xs mt-0.5"
                        >
                          {t.task}
                        </div>
                      </div>
                    </td>

                    {/* Output Deliverables */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {t.output ? (
                        <div className="space-y-1">
                          {t.output.split('\n').map((item, idx) => (
                            <div key={idx} className="flex items-start space-x-1.5 text-[11px]">
                              <span className="text-sky-500 font-bold mt-0.5">&bull;</span>
                              <span className="line-clamp-1">{item.replace(/^-\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Tidak ada rincian output</span>
                      )}
                    </td>

                    {/* PIC */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
                      <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.pic}</span>
                      </div>
                    </td>

                    {/* Target (Directly matching Excel column F: 1 or 0) */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md font-sans font-bold text-xs tabular-nums ${
                        t.target > 0
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                          : 'bg-transparent text-slate-400'
                      }`}>
                        {t.target.toFixed(0)}
                      </span>
                    </td>

                    {/* Capaian (Directly matching Excel column G: 1, 0.75, 0.25, 0) */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div className="flex items-center space-x-1.5">
                          {/* Quick Capaian Selector matching Excel values */}
                          <select
                            value={t.capaian}
                            onChange={(e) => handleQuickCapaianChange(t.id, Number(e.target.value))}
                            className="bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700 font-sans font-bold text-slate-900 dark:text-white tabular-nums text-xs cursor-pointer focus:outline-none hover:border-sky-400 transition-colors"
                            title="Klik untuk mengubah capaian (1.0, 0.75, 0.5, 0.25, 0.0)"
                          >
                            <option value={1.0}>1.00 (100%)</option>
                            <option value={0.75}>0.75 (75%)</option>
                            <option value={0.5}>0.50 (50%)</option>
                            <option value={0.25}>0.25 (25%)</option>
                            <option value={0.0}>0.00 (0%)</option>
                          </select>
                        </div>

                        {/* Visual Progress Meter with Shimmer */}
                        <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              t.capaian >= 1
                                ? 'bg-emerald-500'
                                : t.capaian > 0
                                ? 'bg-amber-500 progress-shimmer'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, t.capaian * 100)}%` }}
                          />
                        </div>

                        {/* Gap Warning if Capaian < Target */}
                        {hasGap && (
                          <span className="text-[10px] font-sans text-rose-500 font-semibold mt-1">
                            Gap: {gapVal}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Quick Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={t.progress}
                          onChange={(e) => {
                            const newStatus = e.target.value as TaskStatus;
                            let autoCapaian = t.capaian;
                            if (newStatus === 'Completed') autoCapaian = 1.0;
                            else if (newStatus === 'Plan') autoCapaian = 0.0;
                            onUpdateStatus(t.id, newStatus, autoCapaian);
                          }}
                          className={`appearance-none text-[11px] font-bold py-1 pl-2.5 pr-6 rounded-lg border cursor-pointer focus:outline-none transition-all ${badge.bg}`}
                        >
                          <option value="Completed">Completed (100%)</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Plan">Plan (0%)</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-current opacity-70 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onSelectTask(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Lihat Detail Output"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditTask(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Target & Capaian"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div>
          Menampilkan <span className="font-bold text-slate-800 dark:text-slate-200">{filteredTasks.length}</span> dari{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">{tasks.length}</span> total item pekerjaan
        </div>
        <div className="text-xs flex items-center space-x-3">
          <span>Target Aktif: <strong className="text-slate-700 dark:text-slate-200 font-sans font-bold">13 Tugas (62%)</strong></span>
          <span>&bull;</span>
          <span>Capaian Total: <strong className="text-emerald-600 dark:text-emerald-400 font-sans font-bold">12.00 (92%)</strong></span>
        </div>
      </div>
    </div>
  );
};
