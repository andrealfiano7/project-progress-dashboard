# 📊 Project Progress Report Dashboard

Modern, clean, and interactive Executive Web Dashboard for Project Progress Management with Excel Integration, S-Curve tracking, Gantt visualization, and automated target & achievement calculations.

Built for **PT Angkasa Pura Indonesia (API)** Project Management Office (PMO).

---

## ✨ Fitur Utama

- **🎯 Target & Capaian Proyek**:
  - Sinkronisasi otomatis dengan logika kalkulasi dari Timeline new.xlsx & Timeline Rev001.xlsx.
  - Presentasi persentase bulat (*integer rounding*) di seluruh metrik.
  - Kartu KPI 2-tier yang lega: Target Proyek (62%), Capaian Realisasi (92% target, 57% total milestone, +5% On Track).
- **📈 Kurva S (S-Curve Cumulative Tracking)**:
  - Visualisasi interaktif grafik rencana kumulatif vs realisasi kumulatif per minggu (W1 s/d W24).
  - Status deviasi jadwal dan cut-off periode berjalan.
- **📅 Gantt Timeline Matrix**:
  - Matriks jadwal 6 bulan (24 minggu) dengan penandaan minggu aktif dan status progres visual.
- **📋 Rincian Pekerjaan & Output Deliverables**:
  - Tabel rincian pekerjaan per fase (Fase 0 s/d Fase 5 & Penutupan BAST).
  - Modal detail pekerjaan dengan daftar deliverables dan penanggung jawab (PIC).
  - Pengeditan langsung data tugas, target, capaian, dan minggu aktif.
- **📂 Excel Import & Export**:
  - Unggah file Excel baru secara real-time via SheetJS (xlsx).
  - Ekspor seluruh progres ke format spreadsheet Excel.
  - Unduh template acuan standar (Timeline Rev001.xlsx).
- **🖨️ Cetak Laporan Eksekutif**:
  - Mode cetak ramah printer dengan format dokumen resmi siap ditandatangani oleh PMO.
- **🎨 UI/UX Bersih & Modern**:
  - Tipografi profesional menggunakan Google Font **Inter** (Data & Body) dan **Outfit** (Heading & Display).
  - Animasi count-up 60fps yang halus (*GPU-accelerated*) tanpa membebani performa browser.
  - Dukungan Dark Mode & Light Mode dengan transisi elegan.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Excel Engine**: SheetJS (xlsx)
- **Animation**: Native GPU CSS keyframes & equestAnimationFrame hooks

---

## 🚀 Panduan Memulai

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm

### Instalasi
`ash
# Clone repository
git clone <URL_REPO>
cd Apps

# Install dependensi
npm install

# Jalankan server lokal
npm run dev
`

Dashboard akan terbuka di http://localhost:5173/.

### Build untuk Produksi
`ash
npm run build
`

---

## 📄 Struktur Proyek

`
e:/Apps/
├── public/                 # File publik & aset template Excel
├── src/
│   ├── components/         # Komponen UI modular (Header, KPICards, TaskTable, SCurve, Gantt, dll.)
│   ├── data/               # Data inisial timeline terparse dari Excel
│   ├── types/              # TypeScript interfaces & types
│   ├── utils/              # Kalkulasi S-curve, Excel parser, custom hooks
│   ├── App.tsx             # Root Application Component
│   ├── main.tsx            # Entry point
│   └── index.css           # Styling & animasi Tailwind
├── package.json
├── tailwind.config.js
└── vite.config.ts
`
