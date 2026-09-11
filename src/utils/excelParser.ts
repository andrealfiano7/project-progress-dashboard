import * as XLSX from 'xlsx';
import { TimelineTask, ProjectMetadata, TaskStatus } from '../types/timeline';

export interface ParsedExcelResult {
  metadata: ProjectMetadata;
  tasks: TimelineTask[];
  sheetNames: string[];
  activeSheet: string;
}

export function parseExcelFile(data: ArrayBuffer, targetSheetName?: string): ParsedExcelResult {
  const workbook = XLSX.read(data, { type: 'array', cellStyles: true });
  const sheetNames = workbook.SheetNames;
  const activeSheet = targetSheetName && sheetNames.includes(targetSheetName)
    ? targetSheetName
    : sheetNames.includes('Sheet1 (2)')
    ? 'Sheet1 (2)'
    : sheetNames[0];

  const worksheet = workbook.Sheets[activeSheet];
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:AF35');

  // Extract Metadata from top rows
  let title = 'Timeline Implementasi BCM';
  let institution = 'PT Angkasa Pura Indonesia (API)';

  for (let r = 0; r < Math.min(5, range.e.r); r++) {
    for (let c = 0; c < 5; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        const val = String(cell.v).trim();
        if (val.toLowerCase().includes('timeline')) {
          title = val;
        } else if (val.toLowerCase().includes('institusi')) {
          institution = val.replace(/^Institusi:\s*/i, '').trim();
        }
      }
    }
  }

  // Detect header row (contains '#', 'Item Pekerjaan')
  let headerRow = -1;
  const colIndexMap: { [key: string]: number } = {};
  const weekColMap: { [colIdx: number]: number } = {};

  for (let r = 0; r <= Math.min(10, range.e.r); r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
      if (cell && cell.v) {
        const str = String(cell.v).trim().toLowerCase();
        if (str === '#' || str === 'no' || str === 'no.') {
          headerRow = r;
          colIndexMap['id'] = c;
        } else if (str.includes('item') || str.includes('pekerjaan') || str.includes('aktivitas')) {
          colIndexMap['task'] = c;
        } else if (str.includes('output') || str.includes('deliverable')) {
          colIndexMap['output'] = c;
        } else if (str.includes('pic') || str.includes('penanggung')) {
          colIndexMap['pic'] = c;
        } else if (str === 'target') {
          colIndexMap['target'] = c;
        } else if (str === 'capaian' || str === 'realisasi' || str === 'aktual') {
          colIndexMap['capaian'] = c;
        } else if (str === 'progress' || str === 'status') {
          colIndexMap['progress'] = c;
        }
      }
    }
    if (headerRow !== -1 && colIndexMap['task'] !== undefined) {
      break;
    }
  }

  // Fallback defaults if header detection needs assistance
  if (headerRow === -1) headerRow = 4; // row 5 in 1-indexed
  if (colIndexMap['id'] === undefined) colIndexMap['id'] = 1; // Col B
  if (colIndexMap['task'] === undefined) colIndexMap['task'] = 2; // Col C
  if (colIndexMap['output'] === undefined) colIndexMap['output'] = 3; // Col D
  if (colIndexMap['pic'] === undefined) colIndexMap['pic'] = 4; // Col E

  // Look for week columns (e.g. 1 to 24 in header row or row above)
  let weekCounter = 1;
  for (let c = (colIndexMap['progress'] ?? 7) + 1; c <= range.e.c; c++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: headerRow, c })];
    if (cell && !isNaN(Number(cell.v)) && Number(cell.v) >= 1 && Number(cell.v) <= 24) {
      weekColMap[c] = Number(cell.v);
    } else if (weekCounter <= 24) {
      // sequentially assign if in timeline zone
      weekColMap[c] = weekCounter++;
    }
  }

  const tasks: TimelineTask[] = [];
  let currentPhase = 'FASE 0 - INISIASI PROYEK';

  for (let r = headerRow + 1; r <= range.e.r; r++) {
    const idCell = worksheet[XLSX.utils.encode_cell({ r, c: colIndexMap['id'] })];
    const taskCell = worksheet[XLSX.utils.encode_cell({ r, c: colIndexMap['task'] })];
    const outputCell = worksheet[XLSX.utils.encode_cell({ r, c: colIndexMap['output'] })];
    const picCell = worksheet[XLSX.utils.encode_cell({ r, c: colIndexMap['pic'] })];
    const targetCell = colIndexMap['target'] !== undefined ? worksheet[XLSX.utils.encode_cell({ r, c: colIndexMap['target'] })] : undefined;
    const capaianCell = colIndexMap['capaian'] !== undefined ? worksheet[XLSX.utils.encode_cell({ r, c: colIndexMap['capaian'] })] : undefined;
    const progressCell = colIndexMap['progress'] !== undefined ? worksheet[XLSX.utils.encode_cell({ r, c: colIndexMap['progress'] })] : undefined;

    const idVal = idCell ? String(idCell.v).trim() : '';
    const taskVal = taskCell ? String(taskCell.v).trim() : '';

    // Check if this row is a phase header (e.g., FASE 0, FASE 1, PENUTUPAN)
    if (idVal.toUpperCase().startsWith('FASE') || idVal.toUpperCase().startsWith('PENUTUPAN') || idVal.toUpperCase().startsWith('PHASE')) {
      currentPhase = idVal;
      continue;
    }
    if (taskVal.toUpperCase().startsWith('FASE') || taskVal.toUpperCase().startsWith('PENUTUPAN')) {
      currentPhase = taskVal;
      continue;
    }

    // Check if it is a task row
    const taskId = parseInt(idVal, 10);
    if (!isNaN(taskId) && (taskVal || idVal)) {
      const outputVal = outputCell ? String(outputCell.v).trim() : '';
      const picVal = picCell ? String(picCell.v).trim() : '';
      const targetNum = targetCell && !isNaN(Number(targetCell.v)) ? Number(targetCell.v) : 1;
      const capaianNum = capaianCell && !isNaN(Number(capaianCell.v)) ? Number(capaianCell.v) : 0;

      let progressVal: TaskStatus = 'Plan';
      if (progressCell && progressCell.v) {
        const rawStatus = String(progressCell.v).trim().toLowerCase();
        if (rawStatus.includes('complete') || rawStatus.includes('selesai')) progressVal = 'Completed';
        else if (rawStatus.includes('in progress') || rawStatus.includes('proses')) progressVal = 'In Progress';
        else if (rawStatus.includes('overdue') || rawStatus.includes('terlambat')) progressVal = 'Overdue';
        else progressVal = 'Plan';
      } else {
        if (capaianNum >= 1) progressVal = 'Completed';
        else if (capaianNum > 0) progressVal = 'In Progress';
        else progressVal = 'Plan';
      }

      // Check scheduled weeks from timeline columns
      const scheduledWeeks: number[] = [];
      Object.entries(weekColMap).forEach(([colStr, weekNum]) => {
        const c = parseInt(colStr, 10);
        const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
        if (cell && (cell.v !== undefined && cell.v !== '' && cell.v !== null)) {
          scheduledWeeks.push(weekNum);
        }
      });

      tasks.push({
        id: taskId,
        phase: currentPhase,
        task: taskVal || `Pekerjaan #${taskId}`,
        output: outputVal,
        pic: picVal,
        target: targetNum,
        capaian: capaianNum,
        progress: progressVal,
        weeks: scheduledWeeks.length > 0 ? scheduledWeeks : [1],
      });
    }
  }

  const metadata: ProjectMetadata = {
    title,
    institution,
    contractor: 'Centrois Consulting',
    totalWeeks: 24,
    cutoffWeek: 13,
    lastUpdated: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
  };

  return {
    metadata,
    tasks,
    sheetNames,
    activeSheet,
  };
}

export function exportTasksToExcel(tasks: TimelineTask[], metadata: ProjectMetadata) {
  // Create workbook
  const wb = XLSX.utils.book_new();

  // Prepare header rows
  const rows: (string | number)[][] = [
    [metadata.title],
    [`Institusi: ${metadata.institution}`],
    [],
    [
      '', '', '', '', '', '', '',
      'Bulan ke-1', '', '', '',
      'Bulan ke-2', '', '', '',
      'Bulan ke-3', '', '', '',
      'Bulan ke-4', '', '', '',
      'Bulan ke-5', '', '', '',
      'Bulan ke-6', '', '', '',
    ],
    [
      '#',
      'Item Pekerjaan',
      'Output',
      'PIC',
      'Target',
      'Capaian',
      'Progress',
      // Weeks 1 to 24
      ...Array.from({ length: 24 }, (_, i) => i + 1),
    ],
  ];

  // Group by phase
  let currentPhase = '';
  tasks.forEach((t) => {
    if (t.phase !== currentPhase) {
      currentPhase = t.phase;
      rows.push([currentPhase]);
    }

    const weekCells = Array.from({ length: 24 }, (_, i) => {
      const w = i + 1;
      return t.weeks.includes(w) ? 'V' : '';
    });

    rows.push([
      t.id,
      t.task,
      t.output,
      t.pic,
      t.target,
      t.capaian,
      t.progress,
      ...weekCells,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [
    { wch: 5 },  // #
    { wch: 40 }, // Task
    { wch: 35 }, // Output
    { wch: 30 }, // PIC
    { wch: 8 },  // Target
    { wch: 10 }, // Capaian
    { wch: 14 }, // Progress
    ...Array.from({ length: 24 }, () => ({ wch: 4 })), // Weeks
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Timeline & Progress');

  // Summary Sheet
  const summaryRows = [
    ['RINGKASAN PROGRES PROYEK', ''],
    ['Proyek', metadata.title],
    ['Institusi', metadata.institution],
    ['Tanggal Export', new Date().toLocaleString('id-ID')],
    [],
    ['Total Item Pekerjaan', tasks.length],
    ['Completed', tasks.filter((t) => t.progress === 'Completed').length],
    ['In Progress', tasks.filter((t) => t.progress === 'In Progress').length],
    ['Overdue', tasks.filter((t) => t.progress === 'Overdue').length],
    ['Plan', tasks.filter((t) => t.progress === 'Plan').length],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Executive Summary');

  // Generate file and trigger download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Progress_Report_${dateStr}.xlsx`);
}
