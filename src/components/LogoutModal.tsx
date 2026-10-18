import React from 'react';
import { 
  X, 
  LogOut, 
  ShieldCheck, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  currentUser: UserProfile;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
  currentUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
            <LogOut className="w-4 h-4" />
            <span>Konfirmasi Keluar Aplikasi (Secure Logout)</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <p>
            Anda masuk sebagai <strong className="text-white">{currentUser.name}</strong> ({currentUser.role}) pada <strong className="text-amber-400">{currentUser.organization}</strong>.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Prosedur Pembersihan Sesi Aman</span>
            </div>
            <ul className="space-y-1">
              <li>✓ Seluruh token sesi dan otorisasi lokal akan di-purge.</li>
              <li>✓ Seluruh berkas cache terenkripsi akan dikunci kembali.</li>
              <li>✓ Riwayat audit trail tersimpan permanen di workspace log.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Batal
          </button>
          <button
            id="confirm-logout-btn"
            onClick={onConfirmLogout}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20"
          >
            Ya, Keluar Aman
          </button>
        </div>

      </div>
    </div>
  );
};
