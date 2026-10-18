import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CaseNotification } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CaseNotification[];
  onSelectCase: (caseId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectCase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Notifikasi & Tugas Perkara</h2>
              <p className="text-[11px] text-slate-400">Pembaruan status, permohonan review & audit</p>
            </div>
          </div>
          <button 
            id="close-notifications-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-800/80 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Tidak ada notifikasi aktif.
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                onClick={() => {
                  if (n.caseId) {
                    onSelectCase(n.caseId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer space-y-1.5 ${
                  !n.read ? 'bg-slate-950 border border-slate-800 hover:border-amber-500/40' : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    {n.type === 'verification' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    {n.type === 'review_request' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {n.type === 'evidence_gap' && <FileText className="w-3.5 h-3.5 text-rose-400" />}
                    <span>{n.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-400">{n.message}</p>
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <span className="text-amber-400/90 font-medium">Buka Workspace Perkara →</span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
          Notifikasi tersinkronisasi otomatis dengan ULPE-AW Gateway
        </div>

      </div>
    </div>
  );
};
