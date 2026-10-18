import React from 'react';
import { 
  Scale, 
  Search, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ShieldCheck, 
  User, 
  ChevronDown, 
  Layers, 
  ExternalLink,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  onSwitchRole?: (role: UserRole) => void;
  onRoleChange?: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  notificationsCount?: number;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onOpenLanding?: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
  onOpenLogout?: () => void;
  isLandingActive?: boolean;
  currentView?: string;
  onOpenDashboard?: () => void;
  onGoDashboard?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register' | 'google-signup') => void;
  activeCaseTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  onRoleChange,
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  notificationsCount,
  onOpenSettings,
  onOpenHelp,
  onOpenLanding,
  onGoHome,
  onLogout,
  onOpenLogout,
  isLandingActive,
  currentView,
  onOpenDashboard,
  onGoDashboard,
  onOpenAuth,
  activeCaseTitle,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const effectiveSwitchRole = onSwitchRole || onRoleChange || (() => {});
  const effectiveLogout = onLogout || onOpenLogout || (() => {});
  const effectiveOpenLanding = onOpenLanding || onGoHome || (() => {});
  const effectiveOpenDashboard = onOpenDashboard || onGoDashboard || (() => {});
  const effectiveUnread = typeof unreadCount === 'number' ? unreadCount : (notificationsCount || 0);
  const effectiveIsLanding = typeof isLandingActive === 'boolean' ? isLandingActive : currentView === 'landing';

  const roles: UserRole[] = ['Admin', 'Lead Counsel', 'Analyst', 'Reviewer', 'Viewer'];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-6">
          <button 
            id="brand-home-btn"
            onClick={effectiveOpenDashboard}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-900/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-wide text-white">TriyLex</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  ULPE-AW
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Structured Legal Intelligence</p>
            </div>
          </button>

          {/* Breadcrumb if inside a case */}
          {activeCaseTitle && !effectiveIsLanding && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 border-l border-slate-800 pl-4">
              <button 
                id="breadcrumb-dashboard-btn"
                onClick={effectiveOpenDashboard}
                className="hover:text-slate-200 transition-colors"
              >
                Dashboard
              </button>
              <span>/</span>
              <span className="text-amber-400 font-medium truncate max-w-[220px]">
                {activeCaseTitle}
              </span>
            </div>
          )}
        </div>

        {/* Middle: Global Search Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            id="global-search-trigger-btn"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs transition-all shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Cari perkara, bukti, nomor pasal, atau pihak...</span>
            </div>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 border border-slate-700 rounded text-slate-400">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Landing / Methodology Overview */}
          <button
            id="landing-toggle-btn"
            onClick={effectiveIsLanding ? effectiveOpenDashboard : effectiveOpenLanding}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              effectiveIsLanding 
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold shadow'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Buka Ikhtisar Arsitektur ULPE-AW & Halaman Pengenalan"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{effectiveIsLanding ? 'Kembali ke App' : 'Ikhtisar ULPE-AW'}</span>
          </button>

          {/* Help & Methodology */}
          <button
            id="help-guide-btn"
            onClick={onOpenHelp}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Panduan Metodologi & Regulasi Indonesia"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            id="notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Notifikasi Perkara & Analisis"
          >
            <Bell className="w-4 h-4" />
            {effectiveUnread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-slate-900" />
            )}
          </button>

          {/* Settings */}
          <button
            id="workspace-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Pengaturan Organisasi & Keamanan"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all text-xs text-left"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <p className="font-medium text-slate-200 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-amber-400">{currentUser.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs text-slate-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-semibold text-white truncate">{currentUser.name}</p>
                    {currentUser.authProvider === 'google' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                        Gmail OAuth
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Briefcase className="w-3 h-3 text-amber-400" />
                    <span>{currentUser.organization}</span>
                  </div>
                </div>

                {/* Role Switcher Section */}
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex justify-between items-center">
                    <span>Peran Akses (RBAC)</span>
                    <span className="text-amber-400 font-normal">{currentUser.role}</span>
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r}
                      id={`switch-role-${r.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => {
                        effectiveSwitchRole(r);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === r 
                          ? 'bg-amber-500/10 text-amber-300 font-medium' 
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{r}</span>
                      {currentUser.role === r && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-800 mt-1 pt-1">
                  {onOpenAuth && (
                    <>
                      <button
                        id="menu-auth-google-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth('google-signup');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-white transition-colors font-medium"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Sign Up / Masuk dengan Gmail</span>
                      </button>
                      <button
                        id="menu-auth-login-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth('login');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-300 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>Masuk / Ganti Akun Advokat</span>
                      </button>
                      <button
                        id="menu-auth-register-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenAuth('register');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-amber-300 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Daftar Akun / Firma Baru</span>
                      </button>
                    </>
                  )}

                  <button
                    id="menu-settings-btn"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-300 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pengaturan & Audit Log</span>
                  </button>

                  <button
                    id="menu-logout-btn"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      effectiveLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Sign Out & Bersihkan Sesi</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
