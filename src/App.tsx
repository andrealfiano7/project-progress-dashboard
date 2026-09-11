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
import { SupabaseModal } from './components/SupabaseModal';
import { PrintReportView } from './components/PrintReportView';
import { isSupabaseConfigured } from './lib/supabase';
import {
  fetchTasksFromSupabase,
  fetchMetadataFromSupabase,
  upsertTaskToSupabase,
  deleteTaskFromSupabase,
  updateMetadataInSupabase,
  syncAllTasksToSupabase,
  resetSupabaseToDefaults,
  subscribeToSupabaseRealtime,
} from './services/supabaseService';

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

  const [cutoffWeek, setCutoffWeek] = useState<number>(() => {
    const saved = localStorage.getItem('project_dashboard_cutoff');
    return saved ? Number(saved) : 13;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'overview' | 'gantt' | 'table' | 'analytics'>('overview');
  const [selectedTask, setSelectedTask] = useState<TimelineTask | null>(null);
  const [editingTask, setEditingTask] = useState<TimelineTask | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => isSupabaseConfigured());
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

  // Supabase Initial Fetch and Realtime Subscription
  useEffect(() => {
    if (!isSupabaseConnected) return;

    // Load initial tasks from Supabase
    fetchTasksFromSupabase().then((dbTasks) => {
      if (dbTasks && dbTasks.length > 0) {
        setTasks(dbTasks);
      }
    });

    // Load initial metadata from Supabase
    fetchMetadataFromSupabase().then((dbMeta) => {
      if (dbMeta) {
        setMetadata(dbMeta);
        setCutoffWeek(dbMeta.cutoffWeek);
      }
    });

    // Listen to real-time changes across all connected devices
    const unsubscribe = subscribeToSupabaseRealtime(
      async () => {
        const latestTasks = await fetchTasksFromSupabase();
        if (latestTasks) {
          setTasks(latestTasks);
        }
      },
      async () => {
        const latestMeta = await fetchMetadataFromSupabase();
        if (latestMeta) {
          setMetadata(latestMeta);
          setCutoffWeek(latestMeta.cutoffWeek);
        }
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isSupabaseConnected]);

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

    if (updatedTask && isSupabaseConnected) {
      upsertTaskToSupabase(updatedTask);
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

    if (isSupabaseConnected) {
      upsertTaskToSupabase(taskToSave);
    }
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus item pekerjaan #${taskId}?`)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (isSupabaseConnected) {
        deleteTaskFromSupabase(taskId);
      }
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

  const handleResetData = () => {
    if (window.confirm('Reset data dashboard ke versi default dari Timeline Rev001.xlsx?')) {
      setTasks(DEFAULT_TASKS);
      setMetadata(DEFAULT_METADATA);
      setCutoffWeek(13);
      localStorage.removeItem('project_dashboard_tasks');
      localStorage.removeItem('project_dashboard_metadata');
      localStorage.removeItem('project_dashboard_cutoff');

      if (isSupabaseConnected) {
        resetSupabaseToDefaults();
      }
    }
  };

  const handleConfirmExcelData = (result: ParsedExcelResult) => {
    setMetadata(result.metadata);
    setTasks(result.tasks);

    if (isSupabaseConnected) {
      updateMetadataInSupabase(result.metadata);
      syncAllTasksToSupabase(result.tasks);
    }
  };

  const handleSaveMetadata = (newMetadata: ProjectMetadata) => {
    setMetadata(newMetadata);
    if (isSupabaseConnected) {
      updateMetadataInSupabase(newMetadata);
    }
  };

  const handleResetMetadata = () => {
    if (window.confirm('Kembalikan judul proyek dan identitas dashboard ke versi default?')) {
      setMetadata(DEFAULT_METADATA);
      if (isSupabaseConnected) {
        updateMetadataInSupabase(DEFAULT_METADATA);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
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
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        isSupabaseActive={isSupabaseConnected}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cutoffWeek={cutoffWeek}
        setCutoffWeek={setCutoffWeek}
      />

      {/* Main Dashboard Workspace */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
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
        onOpenSupabase={() => {
          setIsSettingsOpen(false);
          setIsSupabaseModalOpen(true);
        }}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConnectionChange={() => setIsSupabaseConnected(isSupabaseConfigured())}
      />
    </div>
  );
};
export default App;
