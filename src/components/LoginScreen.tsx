import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Sun, 
  Moon, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { authService, PRESET_USERS } from '../services/authService';
import { AuthUser } from '../types/auth';
import { ProjectMetadata } from '../types/timeline';
import { LiveClock } from './LiveClock';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
  metadata: ProjectMetadata;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  metadata,
  darkMode,
  setDarkMode,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authService.login(username, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Autentikasi gagal. Periksa kembali username dan password.');
      }
    }, 400);
  };

  const handleQuickPreset = (presetUsername: string, presetPass: string) => {
    setUsername(presetUsername);
    setPassword(presetPass);
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authService.login(presetUsername, presetPass);
      setIsLoading(false);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      }
    }, 300);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 z-10 select-none">
      {/* Top Bar: Brand, Live Clock & Theme Switcher */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {metadata.institution || 'PT Angkasa Pura Indonesia'}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              {metadata.contractor || 'Centrois Consulting'} &bull; Sistem Pemantauan Proyek
            </p>
          </div>
        </div>

        {/* Live Clock & Theme Switcher */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <LiveClock />
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all shadow-sm"
            title={darkMode ? 'Beralih ke Light Mode' : 'Beralih ke Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        {/* Mobile Live Clock */}
        <div className="md:hidden flex justify-center mb-4">
          <LiveClock />
        </div>

        <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-2xl shadow-sky-500/5 dark:shadow-indigo-500/5 transition-all">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 mb-3 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Masuk ke Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {metadata.title || 'Timeline Implementasi BCM'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3 sm:p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Gagal Masuk</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin atau pm"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
              <span className="text-sky-600 dark:text-sky-400 font-medium">Sesi Terenkripsi</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Login Demo Presets */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                Login Cepat 1-Klik
              </span>
              <span className="text-[10px] text-slate-400">Pilih peran akun</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {PRESET_USERS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleQuickPreset(preset.username, preset.password)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-sky-50/80 dark:hover:bg-sky-950/40 hover:border-sky-300 dark:hover:border-sky-800 transition-all text-left group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      preset.role === 'admin' 
                        ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-400/30'
                        : preset.role === 'manager'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                        : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30'
                    }`}>
                      {preset.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {preset.name}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300">
                          {preset.roleLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        Username: <strong>{preset.username}</strong> &bull; Sandi: <strong>{preset.password}</strong>
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-6xl mx-auto text-center text-slate-400 text-xs py-2">
        <p>
          &copy; {new Date().getFullYear()} {metadata.institution || 'PT Angkasa Pura Indonesia'}. Dikelola bersama {metadata.contractor || 'Centrois Consulting'}.
        </p>
      </div>
    </div>
  );
};
