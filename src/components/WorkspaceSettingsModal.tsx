import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Users, 
  ShieldCheck, 
  Lock, 
  Activity, 
  CheckCircle2, 
  Key, 
  RefreshCw, 
  Database,
  Building
} from 'lucide-react';
import { UserProfile, AuditLogItem } from '../types';

interface WorkspaceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  auditLogs: AuditLogItem[];
}

export const WorkspaceSettingsModal: React.FC<WorkspaceSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  auditLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'security' | 'audit'>('general');
  const [twoFactor, setTwoFactor] = useState(currentUser.twoFactorEnabled);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">Pengaturan Workspace & Tata Kelola Keamanan</h2>
              <p className="text-xs text-slate-400">{currentUser.organization} • RBAC & Audit Log</p>
            </div>
          </div>
          <button 
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 gap-2 text-xs font-medium shrink-0">
          {[
            { id: 'general', label: 'Profil Organisasi', icon: Building },
            { id: 'members', label: 'Anggota & Hak Akses', icon: Users },
            { id: 'security', label: 'Keamanan & AI Privacy', icon: Lock },
            { id: 'audit', label: 'Audit Log Perkara', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 border-b-2 font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nama Firma / Legal Department</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.organization}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Yurisdiksi Primer</label>
                  <input
                    type="text"
                    readOnly
                    value="Indonesia (Civil Law Jurisdiction / UU & Yurisprudensi MA)"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Engine Analisis Aktif</label>
                  <input
                    type="text"
                    readOnly
                    value="ULPE-AW / Gemini 3.7 Flash Engine"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS & ROLES */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              <span className="text-slate-300 font-semibold block">Daftar Anggota Tim Terdaftar</span>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                {[
                  { name: currentUser.name, email: currentUser.email, role: currentUser.role, isMe: true },
                  { name: 'Senior Partner Hendra Wijaya, S.H.', email: 'hendra.wijaya@triylex.law', role: 'Reviewer', isMe: false },
                  { name: 'Sarah Siregar, S.H.', email: 'sarah.siregar@triylex.law', role: 'Lead Counsel', isMe: false },
                  { name: 'Dimas Pratama, S.H.', email: 'dimas.pratama@triylex.law', role: 'Analyst', isMe: false },
                ].map((m, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{m.name} {m.isMe && '(Anda)'}</span>
                      <span className="text-[11px] text-slate-400">{m.email}</span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & AI PRIVACY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/50 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kebijakan Privasi & Perlindungan AI TriyLex</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  ✓ Seluruh dokumen hukum, akta kontrak, identitas pihak, dan data keuangan klien diproses dalam container terisolasi.
                  <br />
                  ✓ Data perkara <strong>TIDAK PERNAH</strong> digunakan untuk melatih atau menyempurnakan model AI publik eksternal.
                  <br />
                  ✓ Redaksi otomatis (PII Filtering) berjalan pada tingkat ingestasi untuk NIK, nomor rekening bank, dan nomor kontak.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Multi-Factor Authentication (2FA)</h4>
                  <p className="text-slate-400 text-[11px]">Perlindungan login tambahan menggunakan OTP / Authenticator App</p>
                </div>
                <button
                  id="toggle-2fa-btn"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    twoFactor 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {twoFactor ? 'Aktif' : 'Non-Aktif'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <span className="text-slate-300 font-semibold block">Audit Trail & Riwayat Aksi Yuridis</span>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-amber-400 font-bold">{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-slate-200">{log.details}</p>
                    <p className="text-[10px] text-slate-500">Oleh: {log.userName} ({log.userRole})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
