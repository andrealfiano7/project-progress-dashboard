import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface LiveClockProps {
  className?: string;
  showIcon?: boolean;
}

export const LiveClock: React.FC<LiveClockProps> = ({ className = '', showIcon = true }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Hari dalam Bahasa Indonesia
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayName = days[time.getDay()];
  const dateNum = time.getDate();
  const monthName = months[time.getMonth()];
  const year = time.getFullYear();

  // Jam, Menit, Detik dengan padding 2 digit
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-medium bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-sm transition-all select-none ${className}`}
      title="Waktu Real-time Hari Ini (Tersinkronisasi Setiap Detik)"
    >
      {showIcon && (
        <div className="flex items-center mr-2">
          <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mr-1.5 animate-pulse" />
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
        </div>
      )}

      {/* Tanggal Hari Ini */}
      <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
        {dayName}, {dateNum} {monthName} {year}
      </span>

      <span className="text-slate-300 dark:text-slate-600 mx-1 hidden sm:inline">&bull;</span>

      {/* Jam Digital Real-time dengan Tabular Nums */}
      <span className="font-bold text-sky-600 dark:text-sky-400 font-sans tabular-nums tracking-wide">
        {hours}:{minutes}:{seconds}
        <span className="text-[9px] sm:text-[10px] font-normal text-slate-500 dark:text-slate-400 ml-1">WIB</span>
      </span>
    </div>
  );
};
