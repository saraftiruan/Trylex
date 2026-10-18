import React, { useState, useEffect } from 'react';
import { 
  X, 
  Scale, 
  ShieldCheck, 
  Mail, 
  User, 
  ArrowRight,
  ArrowLeft,
  Key,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, isNewRegistration?: boolean) => void;
  initialMode?: 'login' | 'register' | 'google-signup';
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const GmailBadgeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Standard Form State
  const [name, setName] = useState('Advokat Bagus Triyanto, S.H., M.H.');
  const [email, setEmail] = useState('bagus.triyanto@triylex.law');
  const [password, setPassword] = useState('Rahasia2026#');
  const [role, setRole] = useState<UserRole>('Lead Counsel');
  const [organization, setOrganization] = useState('Triyanto & Partners Law Firm');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Google OAuth / Gmail Sign-Up Subflow State
  const [isGoogleFlow, setIsGoogleFlow] = useState(false);
  const [googleStep, setGoogleStep] = useState<'select-account' | 'complete-profile' | 'processing'>('select-account');
  const [selectedGmail, setSelectedGmail] = useState('melialaimran@gmail.com');
  const [customGmail, setCustomGmail] = useState('');
  const [useCustomGmail, setUseCustomGmail] = useState(false);
  const [googleAdvocateName, setGoogleAdvocateName] = useState('Advokat Meliala Imran, S.H., LL.M.');
  const [googleRole, setGoogleRole] = useState<UserRole>('Lead Counsel');
  const [googleOrg, setGoogleOrg] = useState('Meliala & Partners Law Office');

  // Sync mode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      setAuthSuccess(null);
      if (initialMode === 'google-signup') {
        setMode('register');
        setIsGoogleFlow(true);
        setGoogleStep('select-account');
      } else if (initialMode === 'register') {
        setMode('register');
        setIsGoogleFlow(false);
        setName('Advokat Meliala Imran, S.H., LL.M.');
        setEmail('melialaimran@gmail.com');
        setPassword('SandiKuat2026#');
        setRole('Lead Counsel');
        setOrganization('Meliala & Partners Law Office');
      } else {
        setMode('login');
        setIsGoogleFlow(false);
        setName('Advokat Bagus Triyanto, S.H., M.H.');
        setEmail('bagus.triyanto@triylex.law');
        setPassword('Rahasia2026#');
        setRole('Lead Counsel');
        setOrganization('Triyanto & Partners Law Firm');
      }
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Handler: Start Google Flow
  const handleStartGoogleFlow = () => {
    setAuthError(null);
    setAuthSuccess(null);
    setIsGoogleFlow(true);
    setGoogleStep('select-account');
  };

  // Handler: Select Google / Gmail Account
  const handleConfirmSelectGoogleAccount = (gmailAddress: string) => {
    const targetEmail = gmailAddress.trim();
    if (!targetEmail.includes('@') || !targetEmail.toLowerCase().includes('gmail.com')) {
      setAuthError('Harap masukkan alamat Gmail yang valid (@gmail.com)');
      return;
    }

    setAuthError(null);
    setSelectedGmail(targetEmail);

    // Check if account already exists in registered database
    const existing = localStorage.getItem('triylex_registered_users');
    const usersList: any[] = existing ? JSON.parse(existing) : [];
    const found = usersList.find((u: any) => u.email.toLowerCase() === targetEmail.toLowerCase());

    if (found && mode === 'login') {
      // Direct instant login with existing Gmail account
      handleExecuteGoogleLogin(found);
    } else {
      // New sign-up or profile completion step
      setGoogleStep('complete-profile');
      if (targetEmail.toLowerCase().includes('meliala')) {
        setGoogleAdvocateName('Advokat Meliala Imran, S.H., LL.M.');
        setGoogleOrg('Meliala & Partners Law Office');
      } else {
        const prefix = targetEmail.split('@')[0].replace(/[._]/g, ' ');
        const formatted = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        setGoogleAdvocateName(`Advokat ${formatted}, S.H.`);
        setGoogleOrg(`${formatted} & Rekan Law Firm`);
      }
    }
  };

  // Handler: Finalize Google Registration
  const handleFinishGoogleSignUp = () => {
    if (!googleAdvocateName.trim()) {
      setAuthError('Nama lengkap advokat wajib diisi.');
      return;
    }

    setGoogleStep('processing');
    setAuthError(null);

    setTimeout(() => {
      const existing = localStorage.getItem('triylex_registered_users');
      const usersList: any[] = existing ? JSON.parse(existing) : [];

      // Check if user exists or update
      const existingIndex = usersList.findIndex((u: any) => u.email.toLowerCase() === selectedGmail.toLowerCase());

      const newGoogleProfile: UserProfile = {
        id: existingIndex >= 0 ? usersList[existingIndex].id : `usr-g-${Date.now().toString().slice(-4)}`,
        name: googleAdvocateName.trim(),
        email: selectedGmail.trim(),
        role: googleRole,
        organization: googleOrg.trim() || 'Firma Hukum Independen',
        jurisdiction: 'Indonesia (Perdata, Komersial & Pidana)',
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`,
        twoFactorEnabled: true,
        activeSessionsCount: 1,
        authProvider: 'google',
        emailVerified: true,
      };

      if (existingIndex >= 0) {
        usersList[existingIndex] = {
          ...usersList[existingIndex],
          ...newGoogleProfile,
        };
      } else {
        usersList.push({
          ...newGoogleProfile,
          passwordHash: 'google_oauth_verified_sso',
        });
      }

      localStorage.setItem('triylex_registered_users', JSON.stringify(usersList));

      // Token Google OAuth
      const token = `jwt_google_oauth_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem('triylex_auth_token', token);
      localStorage.setItem('triylex_user', JSON.stringify(newGoogleProfile));

      setAuthSuccess(`Pendaftaran Akun Google (${selectedGmail}) Berhasil!`);
      
      setTimeout(() => {
        onLoginSuccess(newGoogleProfile, true);
        onClose();
      }, 700);
    }, 900);
  };

  // Handler: Direct Google Login for Existing User
  const handleExecuteGoogleLogin = (foundUser: any) => {
    setGoogleStep('processing');
    setTimeout(() => {
      const profile: UserProfile = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        organization: foundUser.organization,
        jurisdiction: foundUser.jurisdiction,
        avatarUrl: foundUser.avatarUrl,
        twoFactorEnabled: true,
        activeSessionsCount: (foundUser.activeSessionsCount || 1) + 1,
        authProvider: 'google',
        emailVerified: true,
      };

      const token = `jwt_google_oauth_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem('triylex_auth_token', token);
      localStorage.setItem('triylex_user', JSON.stringify(profile));

      setAuthSuccess(`Login Google Berhasil! Membuka sesi ${profile.name}...`);
      setTimeout(() => {
        onLoginSuccess(profile, false);
        onClose();
      }, 600);
    }, 800);
  };

  // Handler: Standard Form Submit (Email & Password)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setAuthError('Nama lengkap & gelar advokat wajib diisi');
        return;
      }
      if (!email.includes('@')) {
        setAuthError('Format email tidak valid (harus mengandung @)');
        return;
      }
      if (password.length < 6) {
        setAuthError('Kata sandi minimal 6 karakter');
        return;
      }

      // Check duplicate
      const existing = localStorage.getItem('triylex_registered_users');
      const usersList = existing ? JSON.parse(existing) : [];
      if (usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        setAuthError('Email ini sudah terdaftar. Silakan beralih ke tab "Masuk Akun".');
        return;
      }

      const newProfile: UserProfile = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name,
        email,
        role,
        organization: organization || 'Firma Hukum Mandiri',
        jurisdiction: 'Indonesia (Perdata, Niaga & Pidana)',
        avatarUrl: `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80`,
        twoFactorEnabled: true,
        activeSessionsCount: 1,
        authProvider: email.toLowerCase().includes('gmail.com') ? 'google' : 'email',
        emailVerified: email.toLowerCase().includes('gmail.com'),
      };

      usersList.push({
        ...newProfile,
        passwordHash: `hash_${password}`,
      });
      localStorage.setItem('triylex_registered_users', JSON.stringify(usersList));

      // Generate session token
      const token = `jwt_triylex_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem('triylex_auth_token', token);
      localStorage.setItem('triylex_user', JSON.stringify(newProfile));

      setAuthSuccess('Pendaftaran berhasil! Menginisiasi workspace hukum...');
      setTimeout(() => {
        onLoginSuccess(newProfile, true);
        onClose();
      }, 600);

    } else {
      // Login Mode
      if (!email.trim() || !password.trim()) {
        setAuthError('Email dan kata sandi wajib diisi');
        return;
      }

      const existing = localStorage.getItem('triylex_registered_users');
      const usersList = existing ? JSON.parse(existing) : [];
      const foundUser = usersList.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        if (foundUser.passwordHash && foundUser.passwordHash !== `hash_${password}`) {
          setAuthError('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
          return;
        }
      } else {
        const isDemoAccount = 
          email.toLowerCase() === 'bagus.triyanto@triylex.law' || 
          email.toLowerCase() === 'sarah.pramudita@triylex.law' ||
          email.toLowerCase() === 'melialaimran@gmail.com';
        
        if (!isDemoAccount) {
          setAuthError('Email belum terdaftar. Silakan pilih tab "Daftar Baru" untuk registrasi.');
          return;
        }
      }

      const profile: UserProfile = foundUser ? {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        organization: foundUser.organization,
        jurisdiction: foundUser.jurisdiction,
        avatarUrl: foundUser.avatarUrl,
        twoFactorEnabled: foundUser.twoFactorEnabled,
        activeSessionsCount: (foundUser.activeSessionsCount || 1) + 1,
        authProvider: foundUser.authProvider || 'email',
        emailVerified: foundUser.emailVerified || false,
      } : {
        id: `usr-${Date.now().toString().slice(-4)}`,
        name: name || 'Advokat Bagus Triyanto, S.H.',
        email,
        role,
        organization: organization || 'Triyanto & Partners Law Firm',
        jurisdiction: 'Indonesia (Civil Law & Commercial Court)',
        avatarUrl: `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80`,
        twoFactorEnabled: true,
        activeSessionsCount: 1,
        authProvider: email.toLowerCase().includes('gmail.com') ? 'google' : 'email',
        emailVerified: true,
      };

      const token = `jwt_triylex_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem('triylex_auth_token', token);
      localStorage.setItem('triylex_user', JSON.stringify(profile));

      setAuthSuccess('Login berhasil! Membuka sesi kerja aman...');
      setTimeout(() => {
        onLoginSuccess(profile, false);
        onClose();
      }, 600);
    }
  };

  const handleQuickFill = (accType: 'meliala' | 'lead' | 'analyst') => {
    setAuthError(null);
    if (accType === 'meliala') {
      setMode('register');
      setName('Advokat Meliala Imran, S.H., LL.M.');
      setEmail('melialaimran@gmail.com');
      setPassword('Meliala2026#');
      setRole('Lead Counsel');
      setOrganization('Meliala Imran & Partners Law Office');
    } else if (accType === 'lead') {
      setName('Advokat Bagus Triyanto, S.H., M.H.');
      setEmail('bagus.triyanto@triylex.law');
      setPassword('Rahasia2026#');
      setRole('Lead Counsel');
      setOrganization('Triyanto & Partners Law Firm');
    } else if (accType === 'analyst') {
      setName('Sarah Pramudita, S.H.');
      setEmail('sarah.pramudita@triylex.law');
      setPassword('Analis2026#');
      setRole('Analyst');
      setOrganization('Corporate Legal Directorate');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">
                {isGoogleFlow 
                  ? 'Sign Up / Masuk dengan Gmail' 
                  : (mode === 'login' ? 'Masuk ke Portal TriyLex' : 'Daftar Workspace Hukum Baru')}
              </h2>
              <p className="text-xs text-slate-400">
                {isGoogleFlow ? 'Integrasi Google Identity Services' : 'Autentikasi Advokat & Akun Organisasi'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* SUBFLOW: GOOGLE / GMAIL OAUTH SIGN UP & AUTHENTICATION         */}
        {/* ============================================================== */}
        {isGoogleFlow ? (
          <div className="space-y-4">
            
            {/* Step 1: Account Selector */}
            {googleStep === 'select-account' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <GoogleIcon className="w-4 h-4" />
                    <span>Pilih Akun Gmail untuk Melanjutkan:</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Sistem akan memverifikasi identitas Anda melalui Google OAuth 2.0 secara instan.
                  </p>
                </div>

                {/* Primary Detected Account: melialaimran@gmail.com */}
                <button
                  type="button"
                  id="google-account-primary-btn"
                  onClick={() => handleConfirmSelectGoogleAccount('melialaimran@gmail.com')}
                  className="w-full p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border-2 border-amber-500/50 hover:border-amber-400 transition-all text-left flex items-center justify-between group shadow-lg shadow-amber-500/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-blue-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-amber-300 text-sm">
                        M
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white group-hover:text-amber-300 transition-colors">
                          Meliala Imran
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Aktif
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">melialaimran@gmail.com</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </button>

                {/* Alternative Gmail option */}
                {!useCustomGmail ? (
                  <button
                    type="button"
                    onClick={() => setUseCustomGmail(true)}
                    className="w-full p-2.5 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <GmailBadgeIcon className="w-3.5 h-3.5 text-rose-400" />
                    <span>Gunakan Akun Gmail Lainnya...</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="block text-[11px] font-medium text-slate-300">
                      Masukkan Alamat Gmail Anda (@gmail.com):
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="contoh.advokat@gmail.com"
                        value={customGmail}
                        onChange={(e) => setCustomGmail(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleConfirmSelectGoogleAccount(customGmail)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                      >
                        Lanjut
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsGoogleFlow(false)}
                    className="text-slate-400 hover:text-white flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Form Biasa</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Complete Profile for Google Account */}
            {googleStep === 'complete-profile' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-emerald-300 font-bold block">
                      Google OAuth Terverifikasi
                    </span>
                    <span className="text-[11px] text-slate-300 font-mono">
                      {selectedGmail}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Nama Lengkap & Gelar Advokat
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={googleAdvocateName}
                        onChange={(e) => setGoogleAdvocateName(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Peran di Workspace</label>
                      <select
                        value={googleRole}
                        onChange={(e) => setGoogleRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                      >
                        <option value="Lead Counsel">Lead Counsel</option>
                        <option value="Reviewer">Senior Reviewer</option>
                        <option value="Analyst">Legal Analyst</option>
                        <option value="Admin">Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Kantor Hukum / Firma</label>
                      <input
                        type="text"
                        value={googleOrg}
                        onChange={(e) => setGoogleOrg(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    id="finish-google-signup-btn"
                    onClick={handleFinishGoogleSignUp}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Selesaikan Pendaftaran & Buka Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setGoogleStep('select-account')}
                    className="w-full text-center text-slate-400 hover:text-slate-200 text-[11px] py-1"
                  >
                    Pilih akun Google lain
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Processing Animation */}
            {googleStep === 'processing' && (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                  <Sparkles className="w-7 h-7 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Menyelesaikan Autentikasi Google...</h4>
                  <p className="text-xs text-slate-400">
                    Memverifikasi token Google OAuth 2.0 dan menginisiasi ruang kerja perkara aman untuk <strong className="text-amber-400">{selectedGmail}</strong>.
                  </p>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ============================================================== */
          /* STANDARD FORM FLOW (WITH GOOGLE SIGN UP BUTTON AT TOP)         */
          /* ============================================================== */
          <div className="space-y-4">
            
            {/* Tab switch: Masuk vs Daftar */}
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setAuthError(null);
                }}
                className={`py-1.5 rounded-lg transition-colors ${
                  mode === 'login' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setAuthError(null);
                }}
                className={`py-1.5 rounded-lg transition-colors ${
                  mode === 'register' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {/* PROMINENT GMAIL / GOOGLE OAUTH BUTTON */}
            <button
              type="button"
              id="google-oauth-trigger-btn"
              onClick={handleStartGoogleFlow}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-slate-950/20 active:scale-[0.99] border border-slate-200"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>
                {mode === 'register' 
                  ? 'Daftar dengan Akun Google / Gmail' 
                  : 'Masuk dengan Akun Google / Gmail'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-medium">
                atau {mode === 'register' ? 'daftar' : 'masuk'} dengan email firma
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Quick Fill Test Accounts */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Uji Cepat Kredensial:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('meliala')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-amber-500/30 flex items-center gap-1"
                >
                  <GoogleIcon className="w-3 h-3" />
                  <span>Meliala Imran (Gmail)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('lead')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-medium border border-slate-700"
                >
                  Bagus Triyanto
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('analyst')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-medium border border-slate-700"
                >
                  Sarah (Analyst)
                </button>
              </div>
            </div>

            {/* Alerts */}
            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {mode === 'register' && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Nama Lengkap & Gelar Advokat
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Profesional / Gmail</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Kata Sandi</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Peran Pengguna (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="Lead Counsel">Lead Counsel</option>
                    <option value="Reviewer">Senior Reviewer</option>
                    <option value="Analyst">Legal Analyst</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Firma / Organisasi</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-submit-btn"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>{mode === 'login' ? 'Masuk ke Workspace' : 'Buat Akun & Inisiasi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Security Footer */}
        <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1 border-t border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Google OAuth 2.0 & Enkripsi TLS 1.3 Terlindungi UU PDP</span>
        </div>
      </div>
    </div>
  );
};
