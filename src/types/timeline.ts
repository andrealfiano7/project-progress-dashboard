export type TaskStatus = 'Completed' | 'In Progress' | 'Overdue' | 'Plan';

export interface TimelineTask {
  id: number;
  phase: string;
  task: string;
  output: string;
  pic: string;
  target: number;      // e.g. 1
  capaian: number;     // e.g. 1, 0.75, 0.25, 0
  progress: TaskStatus;
  weeks: number[];     // Scheduled weeks (1 to 24)
  notes?: string;
  actualWeeks?: number[]; // Actual weeks completed (if tracked)
}

export interface PhaseSummary {
  phase: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  planTasks: number;
  targetSum: number;
  capaianSum: number;
  progressPercentage: number;
}

export interface ProjectMetadata {
  title: string;
  institution: string;
  contractor: string;
  totalWeeks: number;
  cutoffWeek: number; // Current week line, e.g. 13
  lastUpdated: string;
}

export interface WeeklySCurvePoint {
  week: number;
  label: string; // e.g., 'W1 (Bln 1)'
  month: number;
  weekInMonth: number;
  plannedCumulative: number; // in %
  actualCumulative: number;  // in %
  plannedWeekly: number;     // in %
  actualWeekly: number;      // in %
}

export interface FilterState {
  searchQuery: string;
  status: TaskStatus | 'All';
  phase: string;
  pic: string;
}
