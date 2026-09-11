-- ==============================================================================
-- PROJECT PROGRESS DASHBOARD - SUPABASE DATABASE SCHEMA & SEED DATA
-- Project: Timeline Implementasi BCM (PT Angkasa Pura Indonesia / Centrois Consulting)
-- Description: Run this script directly in your Supabase SQL Editor to create tables,
--              Row Level Security (RLS) policies, Realtime replication, and seed data.
-- ==============================================================================

-- 1. Create 'project_metadata' table
CREATE TABLE IF NOT EXISTS public.project_metadata (
    id TEXT PRIMARY KEY DEFAULT 'default',
    title TEXT NOT NULL DEFAULT 'Timeline Implementasi BCM',
    institution TEXT NOT NULL DEFAULT 'PT Angkasa Pura Indonesia (API)',
    contractor TEXT NOT NULL DEFAULT 'Centrois Consulting',
    total_weeks INTEGER NOT NULL DEFAULT 24,
    cutoff_week INTEGER NOT NULL DEFAULT 13,
    badge_text TEXT NOT NULL DEFAULT 'Live Sync',
    last_updated TEXT NOT NULL DEFAULT 'September 2026',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'tasks' table
CREATE TABLE IF NOT EXISTS public.tasks (
    id INTEGER PRIMARY KEY,
    phase TEXT NOT NULL,
    task TEXT NOT NULL,
    output TEXT,
    pic TEXT,
    target NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    capaian NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    progress TEXT NOT NULL DEFAULT 'Plan', -- 'Completed', 'In Progress', 'Overdue', 'Plan'
    weeks INTEGER[] NOT NULL DEFAULT '{}',
    actual_weeks INTEGER[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.project_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Public Access (anon and authenticated)
-- Allows the web dashboard to query, insert, update, and delete tasks in real-time
DROP POLICY IF EXISTS "Allow public read on project_metadata" ON public.project_metadata;
CREATE POLICY "Allow public read on project_metadata"
    ON public.project_metadata FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public insert on project_metadata" ON public.project_metadata;
CREATE POLICY "Allow public insert on project_metadata"
    ON public.project_metadata FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on project_metadata" ON public.project_metadata;
CREATE POLICY "Allow public update on project_metadata"
    ON public.project_metadata FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on tasks" ON public.tasks;
CREATE POLICY "Allow public read on tasks"
    ON public.tasks FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public insert on tasks" ON public.tasks;
CREATE POLICY "Allow public insert on tasks"
    ON public.tasks FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on tasks" ON public.tasks;
CREATE POLICY "Allow public update on tasks"
    ON public.tasks FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on tasks" ON public.tasks;
CREATE POLICY "Allow public delete on tasks"
    ON public.tasks FOR DELETE
    TO anon, authenticated
    USING (true);

-- 5. Enable Realtime Replication
-- This enables live sync across multiple connected browsers/mobile phones!
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.tasks, public.project_metadata;
COMMIT;

-- 6. Insert Default Project Metadata
INSERT INTO public.project_metadata (id, title, institution, contractor, total_weeks, cutoff_week, badge_text, last_updated)
VALUES (
    'default',
    'Timeline Implementasi BCM',
    'PT Angkasa Pura Indonesia (API)',
    'Centrois Consulting',
    24,
    13,
    'Live Sync',
    'September 2026'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    institution = EXCLUDED.institution,
    contractor = EXCLUDED.contractor,
    total_weeks = EXCLUDED.total_weeks,
    cutoff_week = EXCLUDED.cutoff_week,
    badge_text = EXCLUDED.badge_text,
    last_updated = EXCLUDED.last_updated,
    updated_at = NOW();

-- 7. Insert Initial Seed Tasks (21 Tasks from Timeline Rev001.xlsx)
INSERT INTO public.tasks (id, phase, task, output, pic, target, capaian, progress, weeks, notes)
VALUES
(
    1,
    'FASE 0 - INISIASI PROYEK',
    'Kick-off Meeting',
    '- Materi Kick-off meeting\n- Daftar Hadir\n- Notulen\n- Foto-foto',
    'Seluruh Team Centrois & Manajemen API',
    1.00,
    1.00,
    'Completed',
    ARRAY[1],
    'Kick-off meeting terselenggara dengan seluruh pemangku kepentingan kunci API.'
),
(
    2,
    'FASE 0 - INISIASI PROYEK',
    'Sosialisasi "Pengenalan BCM"',
    '- Materi Sosialisasi\n- Daftar Hadir\n- Foto-foto\n- E-Certificate',
    'Konsultan Centrois & Seluruh personil API',
    1.00,
    1.00,
    'Completed',
    ARRAY[2],
    'Sosialisasi pengenalan dasar Business Continuity Management telah selesai.'
),
(
    3,
    'FASE 0 - INISIASI PROYEK',
    'Pemenuhan Dokumen',
    '- Daftar Permintaan Dokumen\n- Storage penyimpanan dokumen',
    'PMO & Tim Imbangan API',
    1.00,
    1.00,
    'Completed',
    ARRAY[2],
    'Dokumentasi acuan dan repository penyimpanan dokumen telah disiapkan.'
),
(
    4,
    'FASE 0 - INISIASI PROYEK',
    'BIA Strategis',
    '- Kertas Kerja BIA Strategis',
    'Konsultan Centrois & Tim Imbangan',
    1.00,
    1.00,
    'Completed',
    ARRAY[2, 3],
    'Kertas kerja penilaian Business Impact Analysis strategis rampung.'
),
(
    5,
    'FASE 0 - INISIASI PROYEK',
    'Tinjauan Dokumen & Wawancara',
    '- Kertas Kerja Penilaian Awal\n- Laporan Gap Analysis',
    'Konsultan Centrois & PIC API',
    1.00,
    1.00,
    'Completed',
    ARRAY[2, 3, 4],
    'Wawancara mendalam dengan seluruh unit kerja telah dilaksanakan.'
),
(
    6,
    'FASE 0 - INISIASI PROYEK',
    'Penyusunan Laporan Hasil Tinjauan',
    'Draft Laporan Hasil Tinjauan',
    'Konsultan Centrois',
    1.00,
    1.00,
    'Completed',
    ARRAY[5],
    'Penyusunan draft laporan tinjauan awal dan temuan gap analysis selesai.'
),
(
    7,
    'FASE 0 - INISIASI PROYEK',
    'Pemaparan Laporan Hasil Tinjauan',
    'Materi paparan Laporan Hasil Tinjuan',
    'Konsultan Centrois',
    1.00,
    1.00,
    'Completed',
    ARRAY[5],
    'Presentasi hasil tinjauan kepada jajaran pimpinan API.'
),
(
    8,
    'FASE 1 - PEMAHAMAN ORGANISASI',
    'Pemutakhiran Kebijakan & Pedoman BCM',
    '- Draft Kebijakan & Pedoman BCMS\n- Kertas Kerja Parameter BCMS',
    'Tim Konsultan Centrois',
    1.00,
    1.00,
    'Completed',
    ARRAY[6, 7, 8],
    'Draft kebijakan BCMS dan kertas kerja parameter telah disetujui.'
),
(
    9,
    'FASE 1 - PEMAHAMAN ORGANISASI',
    'Aktivitas Kunjungan Domestik',
    'Laporan Kunjungan Lapangan',
    'Konsultan Centrois',
    1.00,
    1.00,
    'Completed',
    ARRAY[8],
    'Kunjungan observasi fasilitas operasional bandara telah dilakukan.'
),
(
    10,
    'FASE 1 - PEMAHAMAN ORGANISASI',
    'Pelatihan & lokakarya "Pembangunan BCM"',
    '- Materi Pelatihan\n- Daftar Hadir\n- Foto-Foto\n- E-Certificate',
    'Konsultan Centrois & PIC API',
    1.00,
    1.00,
    'Completed',
    ARRAY[9],
    'Workshop pembangunan BCM diikuti oleh PIC unit kerja terkait.'
),
(
    11,
    'FASE 1 - PEMAHAMAN ORGANISASI',
    'Penyusunan BIA',
    'Kertas Kerja BIA (2 set)',
    'Konsultan Centrois & Narsum API',
    1.00,
    0.75,
    'Overdue',
    ARRAY[9, 10, 11, 12, 14, 15, 16, 17],
    'Progres mencapai 75%. Perlu penyelesaian finalisasi data bersama narasumber unit operasional.'
),
(
    12,
    'FASE 1 - PEMAHAMAN ORGANISASI',
    'Peyusunan RA',
    'Kertas Kerja RA (2 set)',
    'Konsultan Centrois & Narsum API',
    1.00,
    1.00,
    'Completed',
    ARRAY[16],
    'Risk Assessment (RA) selesai 100% mendahului jadwal.'
),
(
    13,
    'FASE 2 - STRATEGI BCM',
    'Penyusunan BCS',
    'Kertas Kerja BCS',
    'Konsultan Centrois & Tim Imbangan API',
    1.00,
    0.25,
    'In Progress',
    ARRAY[17, 18],
    'Sedang dalam perumusan alternatif strategi kelangsungan bisnis (BCS).'
),
(
    14,
    'FASE 2 - STRATEGI BCM',
    'Pemaparan BCS',
    'Materi paparan BCS',
    'Konsultan Centrois',
    0.00,
    0.00,
    'Plan',
    ARRAY[19],
    'Menunggu penyelesaian dokumen strategi BCS.'
),
(
    15,
    'FASE 3 & 4 - IMPLEMENTASI',
    'Penyusunan BCP',
    'Draft final 2 dokumen BCP',
    'Konsultan Centrois',
    0.00,
    0.00,
    'Plan',
    ARRAY[20, 21],
    'Terjadwal pada Bulan ke-5.'
),
(
    16,
    'FASE 3 & 4 - IMPLEMENTASI',
    'Penyusunan CMP',
    'Draft final dokumen CMP',
    'Konsultan Centrois',
    0.00,
    0.00,
    'Plan',
    ARRAY[20, 21],
    'Crisis Management Plan dijadwalkan bersamaan dengan BCP.'
),
(
    17,
    'FASE 3 & 4 - IMPLEMENTASI',
    'Sosialisasi "Prosedur BCM"',
    '- Materi Sosialisasi\n- Daftar Hadir\n- Foto-foto\n- E-Certificate',
    'Konsultan Centrois & Seluruh personil API',
    0.00,
    0.00,
    'Plan',
    ARRAY[21],
    'Sosialisasi prosedur darurat dan pemulihan bisnis.'
),
(
    18,
    'FASE 5 - VALIDASI PROSEDUR BCM',
    'Diskusi rencana pengujian BCP',
    '- Materi rencana pengujian\n- Notulen diskusi',
    'Konsultan Centrois & Tim Imbangan API',
    0.00,
    0.00,
    'Plan',
    ARRAY[21, 22],
    'Simulasi dan table-top exercise planning.'
),
(
    19,
    'FASE 5 - VALIDASI PROSEDUR BCM',
    'Pelaksanaan Pengujian BCP',
    '- Materi sosialisasi BCP\n- Materi pengujian\n- Daftar hadir\n- Dokumentasi Pelaksanaan',
    'Konsultan Centrois, Tim BCP, Tim Imbangan, & Observer',
    0.00,
    0.00,
    'Plan',
    ARRAY[22],
    'Dry run dan simulasi uji coba BCP lapangan.'
),
(
    20,
    'FASE 5 - VALIDASI PROSEDUR BCM',
    'Pelaporan Pengujian BCP',
    'Laporan Hasil Pengujian',
    'Konsultan Centrois',
    0.00,
    0.00,
    'Plan',
    ARRAY[23],
    'Evaluasi post-mortem pengujian BCP.'
),
(
    21,
    'PENUTUPAN',
    'BAST',
    'BAST (Berita Acara Serah Terima)',
    'PMO',
    0.00,
    0.00,
    'Plan',
    ARRAY[24],
    'Serah terima akhir seluruh dokumen dan penutupan proyek resmi.'
)
ON CONFLICT (id) DO UPDATE SET
    phase = EXCLUDED.phase,
    task = EXCLUDED.task,
    output = EXCLUDED.output,
    pic = EXCLUDED.pic,
    target = EXCLUDED.target,
    capaian = EXCLUDED.capaian,
    progress = EXCLUDED.progress,
    weeks = EXCLUDED.weeks,
    notes = EXCLUDED.notes,
    updated_at = NOW();

-- 8. Verify the Setup
SELECT 'project_metadata count:' AS table_name, count(*) FROM public.project_metadata
UNION ALL
SELECT 'tasks count:' AS table_name, count(*) FROM public.tasks;
