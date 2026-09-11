import { TimelineTask, PhaseSummary, WeeklySCurvePoint, TaskStatus } from '../types/timeline';

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  planTasks: number;
  completedPercent: number;
  inProgressPercent: number;
  overduePercent: number;
  planPercent: number;
  totalCapaian: number;
  totalTarget: number;
  targetPercent: number; // Persentase target terhadap total proyek (dibulatkan)
  overallProgressPercent: number; // capaian / totalTasks (dibulatkan)
  currentPeriodProgressPercent: number; // capaian / target (dibulatkan)
  variancePercent: number; // actual vs planned at cutoff (dibulatkan)
}

export function calculateProjectStats(tasks: TimelineTask[], cutoffWeek = 13): ProjectStats {
  const totalTasks = tasks.length;
  if (totalTasks === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      overdueTasks: 0,
      planTasks: 0,
      completedPercent: 0,
      inProgressPercent: 0,
      overduePercent: 0,
      planPercent: 0,
      totalCapaian: 0,
      totalTarget: 0,
      targetPercent: 0,
      overallProgressPercent: 0,
      currentPeriodProgressPercent: 0,
      variancePercent: 0,
    };
  }

  let completedTasks = 0;
  let inProgressTasks = 0;
  let overdueTasks = 0;
  let planTasks = 0;
  let totalCapaian = 0;
  let totalTarget = 0;

  tasks.forEach((t) => {
    totalCapaian += Number(t.capaian) || 0;
    totalTarget += Number(t.target) || 0;

    switch (t.progress) {
      case 'Completed':
        completedTasks++;
        break;
      case 'In Progress':
        inProgressTasks++;
        break;
      case 'Overdue':
        overdueTasks++;
        break;
      case 'Plan':
      default:
        planTasks++;
        break;
    }
  });

  // Semua persentase dibulatkan (integer)
  const completedPercent = Math.round((completedTasks / totalTasks) * 100);
  const inProgressPercent = Math.round((inProgressTasks / totalTasks) * 100);
  const overduePercent = Math.round((overdueTasks / totalTasks) * 100);
  const planPercent = Math.round((planTasks / totalTasks) * 100);

  // Persentase target terhadap total pekerjaan (e.g. 13/21 = 62%)
  const targetPercent = Math.round((totalTarget / totalTasks) * 100);

  // Overall project progress across all 21 items (e.g. 12/21 = 57%)
  const overallProgressPercent = Math.round((totalCapaian / totalTasks) * 100);

  // Progress relative to current active targets (e.g. 12/13 = 92%)
  const currentPeriodProgressPercent = totalTarget > 0
    ? Math.round((totalCapaian / totalTarget) * 100)
    : overallProgressPercent;

  // S-Curve at cutoffWeek
  const sCurve = calculateSCurveData(tasks, 24, cutoffWeek);
  const cutoffPoint = sCurve.find((p) => p.week === cutoffWeek);
  const plannedAtCutoff = cutoffPoint ? cutoffPoint.plannedCumulative : 0;
  const actualAtCutoff = cutoffPoint ? cutoffPoint.actualCumulative : overallProgressPercent;
  const variancePercent = Math.round(actualAtCutoff - plannedAtCutoff);

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
    planTasks,
    completedPercent,
    inProgressPercent,
    overduePercent,
    planPercent,
    totalCapaian,
    totalTarget,
    targetPercent,
    overallProgressPercent,
    currentPeriodProgressPercent,
    variancePercent,
  };
}

export function calculatePhaseSummaries(tasks: TimelineTask[]): PhaseSummary[] {
  const phaseMap = new Map<string, TimelineTask[]>();

  // Preserve phase order
  tasks.forEach((task) => {
    const p = task.phase || 'Uncategorized';
    if (!phaseMap.has(p)) {
      phaseMap.set(p, []);
    }
    phaseMap.get(p)!.push(task);
  });

  const summaries: PhaseSummary[] = [];

  phaseMap.forEach((phaseTasks, phase) => {
    let completedTasks = 0;
    let inProgressTasks = 0;
    let overdueTasks = 0;
    let planTasks = 0;
    let targetSum = 0;
    let capaianSum = 0;

    phaseTasks.forEach((t) => {
      targetSum += Number(t.target) || 0;
      capaianSum += Number(t.capaian) || 0;

      if (t.progress === 'Completed') completedTasks++;
      else if (t.progress === 'In Progress') inProgressTasks++;
      else if (t.progress === 'Overdue') overdueTasks++;
      else planTasks++;
    });

    const totalTasks = phaseTasks.length;
    // Progress calculation dibulatkan (integer)
    const progressPercentage = targetSum > 0
      ? Math.min(100, Math.round((capaianSum / targetSum) * 100))
      : totalTasks > 0
      ? Math.min(100, Math.round((capaianSum / totalTasks) * 100))
      : 0;

    summaries.push({
      phase,
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      planTasks,
      targetSum,
      capaianSum,
      progressPercentage,
    });
  });

  return summaries;
}

export function calculateSCurveData(
  tasks: TimelineTask[],
  totalWeeks = 24,
  cutoffWeek = 13
): WeeklySCurvePoint[] {
  const totalTasks = tasks.length || 1;
  const taskWeight = 100 / totalTasks; // Weight of each task in %

  // Planned weekly distribution
  const plannedWeekly = new Array(totalWeeks + 1).fill(0);
  // Actual weekly distribution
  const actualWeekly = new Array(totalWeeks + 1).fill(0);

  tasks.forEach((task) => {
    const weeks = task.weeks.filter((w) => w >= 1 && w <= totalWeeks);
    if (weeks.length > 0) {
      const perWeekWeight = taskWeight / weeks.length;
      weeks.forEach((w) => {
        plannedWeekly[w] += perWeekWeight;
      });

      // Actual distribution up to cutoff
      // If completed, distribute full weight across weeks or before cutoff
      const effectiveCapaian = Number(task.capaian) || 0;
      const actualTaskWeight = effectiveCapaian * taskWeight;
      const actualPerWeekWeight = actualTaskWeight / weeks.length;

      weeks.forEach((w) => {
        if (w <= cutoffWeek) {
          actualWeekly[w] += actualPerWeekWeight;
        }
      });
    } else {
      // Fallback if no weeks specified
      plannedWeekly[1] += taskWeight;
      if (task.capaian > 0) actualWeekly[1] += task.capaian * taskWeight;
    }
  });

  const points: WeeklySCurvePoint[] = [];
  let cumPlanned = 0;
  let cumActual = 0;

  for (let w = 1; w <= totalWeeks; w++) {
    cumPlanned += plannedWeekly[w];
    if (w <= cutoffWeek) {
      cumActual += actualWeekly[w];
    }

    const month = Math.ceil(w / 4);
    const weekInMonth = ((w - 1) % 4) + 1;

    points.push({
      week: w,
      label: `W${w}`,
      month,
      weekInMonth,
      plannedWeekly: Math.round(plannedWeekly[w]),
      actualWeekly: w <= cutoffWeek ? Math.round(actualWeekly[w]) : 0,
      plannedCumulative: Math.min(100, Math.round(cumPlanned)),
      actualCumulative: w <= cutoffWeek ? Math.min(100, Math.round(cumActual)) : 0,
    });
  }

  return points;
}

export function getStatusBadge(status: TaskStatus) {
  switch (status) {
    case 'Completed':
      return {
        label: 'Completed',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        barBg: 'bg-emerald-500',
      };
    case 'In Progress':
      return {
        label: 'In Progress',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500 animate-pulse',
        barBg: 'bg-amber-500',
      };
    case 'Overdue':
      return {
        label: 'Overdue',
        bg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        dot: 'bg-rose-500 animate-ping',
        barBg: 'bg-rose-500',
      };
    case 'Plan':
    default:
      return {
        label: 'Plan',
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        dot: 'bg-slate-400',
        barBg: 'bg-slate-400',
      };
  }
}
