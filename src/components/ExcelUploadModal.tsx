import React, { useState, useRef } from 'react';
import { parseExcelFile, ParsedExcelResult } from '../utils/excelParser';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmData: (result: ParsedExcelResult) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onConfirmData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedExcelResult | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    setErrorMsg('');
    setFile(selectedFile);

    try {
      const buffer = await selectedFile.arrayBuffer();
      setFileBuffer(buffer);
      const result = parseExcelFile(buffer);
      setParsedResult(result);
      setSelectedSheet(result.activeSheet);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal membaca file Excel. Pastikan format file adalah .xlsx atau .xls valid.');
    }
  };

  const handleSheetChange = (sheetName: string) => {
    if (!fileBuffer) return;
    try {
      const result = parseExcelFile(fileBuffer, sheetName);
      setParsedResult(result);
      setSelectedSheet(sheetName);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    if (parsedResult) {
      onConfirmData(parsedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Import Data dari Excel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unggah spreadsheet (.xlsx / .xls) untuk memperbarui progress dashboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-sky-500 dark:hover:border-sky-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 dark:bg-slate-800/30 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            />

            <div className="flex flex-col items-center">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform mb-3">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {file ? file.name : 'Tarik & lepas file Excel ke sini, atau klik untuk memilih file'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Mendukung file format .xlsx, .xls (Mendukung multi-sheet otomatis)
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedResult && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              {/* Sheet Selector */}
              {parsedResult.sheetNames.length > 1 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Pilih Lembar Kerja (Sheet):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {parsedResult.sheetNames.map((sheet) => (
                      <button
                        key={sheet}
                        type="button"
                        onClick={() => handleSheetChange(sheet)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedSheet === sheet
                            ? 'bg-sky-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {sheet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Judul Proyek:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {parsedResult.metadata.title}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Institusi:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {parsedResult.metadata.institution}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Tugas:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {parsedResult.tasks.length} item ditemukan
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick template download */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
            <span>Perlu contoh format Excel?</span>
            <a
              href="/Timeline Rev001.xlsx"
              download="Timeline_Rev001.xlsx"
              className="inline-flex items-center text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Unduh Template (Timeline Rev001.xlsx)
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2 bg-slate-50/50 dark:bg-slate-850">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            disabled={!parsedResult}
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Terapkan ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
