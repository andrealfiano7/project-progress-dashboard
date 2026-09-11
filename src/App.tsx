import React, { useState, useEffect } from 'react';
import { TimelineTask, ProjectMetadata, TaskStatus } from './types/timeline';
import { DEFAULT_TASKS, DEFAULT_METADATA } from './data/defaultData';
import { 
  calculateProjectStats, 
  calculatePhaseSummaries, 
  calculateSCurveData 
} from './utils/calculations';
import { exportTasksToExcel, ParsedExcelResult } from './utils/excelParser';

import { Header } from './components/Header';
import { KPICards } from './components/KPICards';
import { SCurveChart } from './components/SCurveChart';
import { StatusDonutChart } from './components/StatusDonutChart';
import { PhaseSummaryCard } from './components/PhaseSummaryCard';
import { GanttTimeline } from './components/GanttTimeline';
import { TaskTable } from './components/TaskTable';
import { TaskDetailModal } from './components/TaskDetailModal';
import { EditTaskModal } from './components/EditTaskModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { SettingsModal } from './components/SettingsModal';
import { DatabaseModal } from './components/DatabaseModal';
import { PrintReportView } from './components/PrintReportView';
import { NextAnimatedBackground } from './components/NextAnimatedBackground';
import {
  fetchTasksFromApi,
  fetchMetadataFromApi,
  upsertTaskToApi,
  deleteTaskFromApi,
  syncAllTasksToApi,
  updateMetadataToApi,
  checkDatabaseHealth,
} from './services/apiService';

const DEFAULT_CUTOFF_WEEK = DEFAULT_METADATA.cutoffWeek || 1;

export const App: React.FC = () => {
  // Persistence state
  const [tasks, setTasks] = useState<TimelineTask[]>(() => {
    const saved = localStorage.getItem('project_dashboard_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_TASKS;
  });

  const [metadata, setMetadata] = useState<ProjectMetadata>(() => {
    const saved = localStorage.getItem('project_dashboard_metadata');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_METADATA;
  });

  // Cut-off Week state: default W13, and remembers user's last selection on refresh
  const [cutoffWeek, setCutoffWeek] = useState<number>(() => {
    const saved = localStorage.getItem('project_dashboard_cutoff');
    if (saved) {
      const parsed = Number(saved);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 24) {
        return parsed;
      }
    }
    return DEFAULT_CUTOFF_WEEK;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'overview' | 'gantt' | 'table' | 'analytics'>('overview');
  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isDatabaseConnected, setIsDatabaseConnected] = useState<boolean>(false);
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('All');
  const [tablePhaseFilter, setTablePhaseFilter] = useState<string>('');

  // Dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_dark_mode');
    return saved ? saved === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('theme_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('project_dashboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('project_dashboard_metadata', JSON.stringify(metadata));
  }, [metadata]);

  useEffect(() => {
    localStorage.setItem('project_dashboard_cutoff', String(cutoffWeek));
  }, [cutoffWeek]);

  // Neon PostgreSQL & Prisma API Initial Fetch and Polling Sync
  useEffect(() => {
    // 1. Initial Health Check
    checkDatabaseHealth().then((status) => {
      setIsDatabaseConnected(!!status.connected);
    });

    // 2. Fetch Tasks from Neon DB
    fetchTasksFromApi().then((dbTasks) => {
      if (dbTasks && dbTasks.length > 0) {
        setTasks(dbTasks);
        setIsDatabaseConnected(true);
      }
    });

    // 3. Fetch Metadata from Neon DB (Preserving user's last chosen cutoffWeek)
    fetchMetadataFromApi().then((dbMeta) => {
      if (dbMeta) {
        const savedCutoff = localStorage.getItem('project_dashboard_cutoff');
        if (savedCutoff) {
          const parsed = Number(savedCutoff);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 24) {
            setCutoffWeek(parsed);
            setMetadata({ ...dbMeta, cutoffWeek: parsed });
            return;
          }
        }
        // Jika belum ada pilihan terakhir di localStorage, gunakan default W13
        const defaultCutoff = dbMeta.cutoffWeek || DEFAULT_CUTOFF_WEEK;
        setCutoffWeek(defaultCutoff);
        setMetadata({ ...dbMeta, cutoffWeek: defaultCutoff });
        localStorage.setItem('project_dashboard_cutoff', String(defaultCutoff));
      }
    });

    // 4. Background Sync Polling (every 15s) for multi-device sync
    const interval = setInterval(() => {
      fetchTasksFromApi().then((dbTasks) => {
        if (dbTasks && dbTasks.length > 0) {
          setTasks(dbTasks);
          setIsDatabaseConnected(true);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Reactive calculations
  const stats = calculateProjectStats(tasks, cutoffWeek);
  const phaseSummaries = calculatePhaseSummaries(tasks);
  const sCurveData = calculateSCurveData(tasks, 24, cutoffWeek);
  const existingPhases = Array.from(new Set(tasks.map((t) => t.phase)));

  // Handlers
  const handleUpdateStatus = (taskId: number, newStatus: TaskStatus, newCapaian?: number) => {
    let updatedTask: TimelineTask | null = null;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          updatedTask = {
            ...t,
            progress: newStatus,
            capaian: newCapaian !== undefined ? newCapaian : t.capaian,
          };
          return updatedTask;
        }
        return t;
      })
    );

    if (updatedTask) {
      upsertTaskToApi(updatedTask);
    }
  };

  const handleSaveTask = (taskToSave: TimelineTask) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === taskToSave.id);
      if (exists) {
        return prev.map((t) => (t.id === taskToSave.id ? taskToSave : t));
      } else {
        return [...prev, taskToSave].sort((a, b) => a.id - b.id);
      }
    });

    upsertTaskToApi(taskToSave);
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus item pekerjaan #${taskId}?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      deleteTaskFromApi(taskId);
    }
  };

  const handleOpenEdit = (task: TimelineTask) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsEditModalOpen(true);
  };

  const handleFilterByKPI = (status: string) => {
    setTableStatusFilter(status);
    setActiveTab('table');
  };

  const handleFilterByPhase = (phase: string) => {
    setTablePhaseFilter(phase);
    setActiveTab('table');
  };

  const handleCutoffWeekChange = (newWeek: number) => {
    setCutoffWeek(newWeek);
    localStorage.setItem('project_dashboard_cutoff', String(newWeek));
    setMetadata((prev) => {
      const updated = { ...prev, cutoffWeek: newWeek };
      localStorage.setItem('project_dashboard_metadata', JSON.stringify(updated));
      updateMetadataToApi(updated);
      return updated;
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset data dashboard ke versi default dari Timeline Rev001.xlsx?')) {
      setTasks(DEFAULT_TASKS);
      setMetadata(DEFAULT_METADATA);
      setCutoffWeek(DEFAULT_CUTOFF_WEEK);
      localStorage.setItem('project_dashboard_cutoff', String(DEFAULT_CUTOFF_WEEK));
      localStorage.removeItem('project_dashboard_tasks');
      localStorage.removeItem('project_dashboard_metadata');

      updateMetadataToApi({ ...DEFAULT_METADATA, cutoffWeek: DEFAULT_CUTOFF_WEEK });
      syncAllTasksToApi(DEFAULT_TASKS);
    }
  };

  const handleConfirmExcelData = (result: ParsedExcelResult) => {
    setMetadata(result.metadata);
    setTasks(result.tasks);

    updateMetadataToApi(result.metadata);
    syncAllTasksToApi(result.tasks);
  };

  const handleSaveMetadata = (newMetadata: ProjectMetadata) => {
    setMetadata(newMetadata);
    updateMetadataToApi(newMetadata);
  };

  const handleResetMetadata = () => {
    if (window.confirm('Kembalikan judul proyek dan identitas dashboard ke versi default?')) {
      setMetadata(DEFAULT_METADATA);
      setCutoffWeek(DEFAULT_CUTOFF_WEEK);
      localStorage.setItem('project_dashboard_cutoff', String(DEFAULT_CUTOFF_WEEK));
      updateMetadataToApi({ ...DEFAULT_METADATA, cutoffWeek: DEFAULT_CUTOFF_WEEK });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 isolate">
      {/* Anime.js Next.js Ambient Grid & Beam Background (strictly in deep background plane) */}
      <NextAnimatedBackground darkMode={darkMode} />

      {/* Header */}
      <Header
        metadata={metadata}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExportExcel={() => exportTasksToExcel(tasks, metadata)}
        onPrint={() => window.print()}
        onResetData={handleResetData}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDatabase={() => setIsDatabaseModalOpen(true)}
        isDatabaseActive={isDatabaseConnected}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cutoffWeek={cutoffWeek}
        setCutoffWeek={handleCutoffWeekChange}
      />

      {/* Main Dashboard Workspace (elevated above background) */}
      <main className="relative z-10 no-print flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* KPI Cards (Always visible as executive anchors) */}
        <KPICards stats={stats} onFilterStatus={handleFilterByKPI} />

        {/* Tab 1: Executive Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            {/* Visual Charts Grid: SCurve & Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2">
                <SCurveChart data={sCurveData} cutoffWeek={cutoffWeek} />
              </div>
              <div className="lg:col-span-1">
                <StatusDonutChart stats={stats} onFilterStatus={handleFilterByKPI} />
              </div>
            </div>

            {/* Project Phase Progress Breakdown */}
            <PhaseSummaryCard
              summaries={phaseSummaries}
              onSelectPhase={handleFilterByPhase}
              selectedPhase={tablePhaseFilter}
            />

            {/* Compact Task Table Preview */}
            <TaskTable
              tasks={tasks}
              onSelectTask={setSelectedTask}
              onEditTask={handleOpenEdit}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleOpenAdd}
              onUpdateStatus={handleUpdateStatus}
              initialStatusFilter={tableStatusFilter}
              initialPhaseFilter={tablePhaseFilter}
            />
          </div>
        )}

        {/* Tab 2: Gantt Timeline */}
        {activeTab === 'gantt' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <GanttTimeline
              tasks={tasks}
              cutoffWeek={cutoffWeek}
              onSelectTask={setSelectedTask}
            />
          </div>
        )}

        {/* Tab 3: Detailed Task Table */}
        {activeTab === 'table' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <TaskTable
              tasks={tasks}
              onSelectTask={setSelectedTask}
              onEditTask={handleOpenEdit}
              onDeleteTask={handleDeleteTask}
              onAddTask={handleOpenAdd}
              onUpdateStatus={handleUpdateStatus}
              initialStatusFilter={tableStatusFilter}
              initialPhaseFilter={tablePhaseFilter}
            />
          </div>
        )}

        {/* Tab 4: SCurve & Analytics Deep-dive */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            <SCurveChart data={sCurveData} cutoffWeek={cutoffWeek} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1">
                <StatusDonutChart stats={stats} onFilterStatus={handleFilterByKPI} />
              </div>
              <div className="lg:col-span-2">
                <PhaseSummaryCard
                  summaries={phaseSummaries}
                  onSelectPhase={handleFilterByPhase}
                  selectedPhase={tablePhaseFilter}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Printable Executive Report (Visible only during print) */}
      <PrintReportView
        metadata={metadata}
        tasks={tasks}
        stats={stats}
        cutoffWeek={cutoffWeek}
      />

      {/* Modals */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={handleOpenEdit}
      />

      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
        existingPhases={existingPhases}
      />

      <ExcelUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onConfirmData={handleConfirmExcelData}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        metadata={metadata}
        onSave={handleSaveMetadata}
        onResetToDefault={handleResetMetadata}
        onOpenDatabase={() => {
          setIsSettingsOpen(false);
          setIsDatabaseModalOpen(true);
        }}
      />

      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        tasks={tasks}
        metadata={metadata}
        onDataRefreshed={() => {
          fetchTasksFromApi().then((t) => t && setTasks(t));
          fetchMetadataFromApi().then((m) => m && setMetadata(m));
        }}
      />
    </div>
  );
};
export default App;
