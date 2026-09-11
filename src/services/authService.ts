import { AuthUser } from '../types/auth';

const STORAGE_KEY = 'project_dashboard_auth_user';

export const PRESET_USERS: (AuthUser & { password: string; roleLabel: string; description: string })[] = [
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    name: 'Administrator',
    email: 'admin@centrois.id',
    role: 'admin',
    roleLabel: 'Project Director',
    description: 'Akses Penuh: Kelola tugas, upload Excel, edit metadata, & database',
    institution: 'Centrois Consulting & Angkasa Pura',
  },
  {
    id: 'user-pm',
    username: 'pm',
    password: 'pm123',
    name: 'Project Manager (PIC)',
    email: 'pm@angkasapura.co.id',
    role: 'manager',
    roleLabel: 'Project Manager',
    description: 'Akses Editor: Update progress mingguan, capaian, dan catatan kerja',
    institution: 'PT Angkasa Pura Indonesia',
  },
  {
    id: 'user-viewer',
    username: 'viewer',
    password: 'viewer123',
    name: 'Stakeholder / Direksi',
    email: 'direksi@angkasapura.co.id',
    role: 'viewer',
    roleLabel: 'Executive Viewer',
    description: 'Akses Pantau: Lihat timeline Gantt, grafik Kurva S, & cetak laporan',
    institution: 'Direksi PT Angkasa Pura Indonesia',
  },
];

export const authService = {
  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
    return null;
  },

  login(usernameOrEmail: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
    const cleanId = usernameOrEmail.trim().toLowerCase();
    const found = PRESET_USERS.find(
      (u) =>
        (u.username.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        u.password === password
    );

    if (found) {
      const { password: _, ...userProfile } = found;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
      } catch (e) {
        console.error('Failed to store user in localStorage:', e);
      }
      return { success: true, user: userProfile };
    }

    return {
      success: false,
      error: 'Username/email atau kata sandi tidak cocok. Silakan coba lagi atau gunakan akun preset.',
    };
  },

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove user from localStorage:', e);
    }
  },

  getPresetUsers() {
    return PRESET_USERS;
  },
};
