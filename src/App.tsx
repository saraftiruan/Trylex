import React, { useState, useEffect } from 'react';
import { 
  INITIAL_SAMPLE_CASES, 
  INITIAL_USER, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from './data/sampleCases';
import { LegalCase, UserProfile, UserRole, CaseNotification, AuditLogItem } from './types';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { CaseDetailView } from './components/CaseDetailView';
import { CreateCaseModal } from './components/CreateCaseModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { WorkspaceSettingsModal } from './components/WorkspaceSettingsModal';
import { HelpGuidanceModal } from './components/HelpGuidanceModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AIChatCopilot } from './components/AIChatCopilot';
import { AuthModal } from './components/AuthModal';
import { LogoutModal } from './components/LogoutModal';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'case-detail'>('landing');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // App Data State
  const [cases, setCases] = useState<LegalCase[]>(() => {
    const saved = localStorage.getItem('triylex_cases');
    if (!saved) return INITIAL_SAMPLE_CASES;
    try {
      const parsed: LegalCase[] = JSON.parse(saved);
      // Ensure methodology and all 5 civil & 5 criminal cases are present even if localStorage had an older state
      const updated = parsed.map(c => {
        const match = INITIAL_SAMPLE_CASES.find(init => init.id === c.id);
        return {
          ...c,
          methodology: c.methodology || match?.methodology || (c.caseType?.toLowerCase().includes('pidana') ? 'PCA' : 'LCA'),
          documents: c.documents || match?.documents || [],
          timeline: c.timeline || match?.timeline || [],
          parties: c.parties || match?.parties || [],
          claims: c.claims || match?.claims || [],
          admittedFacts: c.admittedFacts || match?.admittedFacts || [],
          disputedFacts: c.disputedFacts || match?.disputedFacts || [],
          unknownFacts: c.unknownFacts || match?.unknownFacts || [],
          facts: c.facts || match?.facts || [],
          legalLayers: c.legalLayers || match?.legalLayers || [],
          statutes: c.statutes || match?.statutes || [],
          evidenceMatrix: c.evidenceMatrix || match?.evidenceMatrix || [],
          evidenceGaps: c.evidenceGaps || match?.evidenceGaps || [],
          symmetricArguments: c.symmetricArguments || match?.symmetricArguments || [],
          comments: c.comments || match?.comments || [],
        };
      });
      const existingIds = new Set(updated.map(c => c.id));
      const missingCases = INITIAL_SAMPLE_CASES.filter(c => !existingIds.has(c.id));
      if (missingCases.length > 0) {
        return [...missingCases, ...updated];
      }
      return updated;
    } catch {
      return INITIAL_SAMPLE_CASES;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('triylex_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [notifications, setNotifications] = useState<CaseNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Modals & Drawers State
  const [isOpenCreateCase, setIsOpenCreateCase] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isOpenSettings, setIsOpenSettings] = useState(false);
  const [isOpenHelp, setIsOpenHelp] = useState(false);
  const [isOpenNotifications, setIsOpenNotifications] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'google-signup'>('login');
  const [isOpenLogout, setIsOpenLogout] = useState(false);

  // Persist cases on update
  useEffect(() => {
    localStorage.setItem('triylex_cases', JSON.stringify(cases));
  }, [cases]);

  // Persist user
  useEffect(() => {
    localStorage.setItem('triylex_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Keyboard shortcut for Spotlight Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpenSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleOpenAuth = (mode: 'login' | 'register' | 'google-signup' = 'login') => {
    setAuthInitialMode(mode);
    setIsOpenAuth(true);
  };

  const handleLoginSuccess = (user: UserProfile, isNewRegistration?: boolean) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    
    // Add audit log
    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: isNewRegistration ? 'Pendaftaran Akun Baru' : 'Login Sesi Aman',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      details: isNewRegistration 
        ? `Akun baru didaftarkan untuk ${user.name} (${user.role}) pada ${user.organization}. Workspace hukum diinisialisasi.`
        : `Autentikasi berhasil untuk ${user.name} (${user.role}). Sesi kerja aktif dibuka.`,
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setCurrentView('case-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCase = (updated: LegalCase) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    
    // Add audit log
    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      caseId: updated.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: `Update Perkara (${updated.status})`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      details: `Perkara ${updated.refNumber} diperbarui status atau matriks pembuktian.`,
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleCreateCase = (newCase: LegalCase) => {
    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setCurrentView('case-detail');

    // Add audit log
    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      caseId: newCase.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Buat Perkara Baru',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      details: `Inisiasi perkara baru ${newCase.refNumber} (${newCase.title}).`,
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
  };

  const handleLogout = () => {
    localStorage.removeItem('triylex_auth_token');
    localStorage.removeItem('triylex_user');
    
    // Audit log
    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'Logout & Pembersihan Sesi Aman',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      details: `Sesi ${currentUser.name} (${currentUser.role}) ditutup dan token sesi di-purge.`,
    };
    setAuditLogs(prev => [log, ...prev]);

    setCurrentUser(INITIAL_USER);
    setIsOpenLogout(false);
    setCurrentView('landing');
    setSelectedCaseId(null);
  };

  // Find active case
  const activeCase = cases.find(c => c.id === selectedCaseId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Universal App Header */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenSearch={() => setIsOpenSearch(true)}
        onOpenCreateCase={() => setIsOpenCreateCase(true)}
        onOpenSettings={() => setIsOpenSettings(true)}
        onOpenHelp={() => setIsOpenHelp(true)}
        onOpenNotifications={() => setIsOpenNotifications(true)}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
        onOpenLogout={() => setIsOpenLogout(true)}
        onGoHome={() => setCurrentView('landing')}
        onGoDashboard={() => {
          setCurrentView('dashboard');
          setSelectedCaseId(null);
        }}
        currentView={currentView}
        notificationsCount={notifications.filter(n => !n.read).length}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentView === 'landing' && (
          <LandingView
            onEnterApp={() => setCurrentView('dashboard')}
            onSelectSampleCase={(caseId) => handleSelectCase(caseId)}
            onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            cases={cases}
            currentUser={currentUser}
            onSelectCase={handleSelectCase}
            onCreateCase={() => setIsOpenCreateCase(true)}
          />
        )}

        {currentView === 'case-detail' && (
          activeCase ? (
            <CaseDetailView
              caseData={activeCase}
              currentUser={currentUser}
              onUpdateCase={handleUpdateCase}
              onBackToDashboard={() => {
                setCurrentView('dashboard');
                setSelectedCaseId(null);
              }}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-lg">
                !
              </div>
              <h2 className="text-base font-bold text-white">Perkara Tidak Ditemukan</h2>
              <p className="text-xs text-slate-400">Berkas perkara yang Anda pilih tidak tersedia atau sedang diperbarui.</p>
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setSelectedCaseId(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg"
              >
                Kembali ke Dashboard
              </button>
            </div>
          )
        )}
      </main>

      {/* Floating AI Copilot Widget */}
      <AIChatCopilot
        currentCase={activeCase}
        currentUser={currentUser}
      />

      {/* Modals & Drawers */}
      <CreateCaseModal
        isOpen={isOpenCreateCase}
        onClose={() => setIsOpenCreateCase(false)}
        currentUser={currentUser}
        onCreateCase={handleCreateCase}
      />

      <GlobalSearchModal
        isOpen={isOpenSearch}
        onClose={() => setIsOpenSearch(false)}
        cases={cases}
        onSelectCase={handleSelectCase}
      />

      <WorkspaceSettingsModal
        isOpen={isOpenSettings}
        onClose={() => setIsOpenSettings(false)}
        currentUser={currentUser}
        auditLogs={auditLogs}
      />

      <HelpGuidanceModal
        isOpen={isOpenHelp}
        onClose={() => setIsOpenHelp(false)}
      />

      <NotificationsDrawer
        isOpen={isOpenNotifications}
        onClose={() => setIsOpenNotifications(false)}
        notifications={notifications}
        onSelectCase={handleSelectCase}
      />

      <AuthModal
        isOpen={isOpenAuth}
        initialMode={authInitialMode}
        onClose={() => setIsOpenAuth(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <LogoutModal
        isOpen={isOpenLogout}
        onClose={() => setIsOpenLogout(false)}
        onConfirmLogout={handleLogout}
        currentUser={currentUser}
      />

    </div>
  );
}
