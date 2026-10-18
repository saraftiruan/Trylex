import React from 'react';
import { 
  Scale, 
  Shield, 
  GitMerge, 
  FileCheck2, 
  Layers, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Database, 
  Sparkles,
  BookOpen,
  FileText,
  Workflow
} from 'lucide-react';

interface LandingViewProps {
  onEnterApp: () => void;
  onSelectSampleCase: (caseId: string) => void;
  onOpenAuth?: (mode?: 'login' | 'register' | 'google-signup') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ 
  onEnterApp, 
  onSelectSampleCase,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-800/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.15),rgba(2,6,23,0))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-medium mb-6 shadow-lg shadow-amber-950/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Structured Legal Intelligence Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Analisis Perkara Hukum dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400">Verifikasi Bertingkat</span> & Bukti Tertelusuri
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            TriyLex mengintegrasikan SOP Litigasi Perdata (LCA-001 s.d. LCA-015) dan SOP Pembelaan Pidana & UU Khusus (PCA-001 s.d. PCA-015) untuk analisis komprehensif, uji due process, dan penyusunan draf siap sidang.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              id="landing-enter-workspace-btn"
              onClick={onEnterApp}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 transform active:scale-95"
            >
              <span>Buka Workspace Perkara</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenAuth && (
              <>
                <button
                  id="landing-open-google-signup-btn"
                  onClick={() => onOpenAuth('google-signup')}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-white/5 border border-slate-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Daftar dengan Gmail</span>
                </button>

                <button
                  id="landing-open-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Masuk Akun</span>
                </button>
                <button
                  id="landing-open-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Daftar Baru</span>
                </button>
              </>
            )}

            <button
              id="landing-open-civil-sample-btn"
              onClick={() => onSelectSampleCase('case-001')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-all flex items-center gap-2 hover:border-amber-500/40"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Contoh Kasus Perdata (LCA)</span>
            </button>

            <button
              id="landing-open-sample-btn"
              onClick={() => onSelectSampleCase('case-pca-001')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-all flex items-center gap-2 hover:border-rose-500/40"
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>Contoh Kasus Pidana (PCA)</span>
            </button>
          </div>

          {/* 5 Civil Cases & 5 Criminal Cases Quick Showcase */}
          <div className="mt-10 space-y-4 max-w-4xl mx-auto">
            {/* 5 Civil Cases Showcase */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-mono text-amber-400/90 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>5 Contoh Perkara Perdata Komersial & Bisnis (SOP LCA Terintegrasi):</span>
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {[
                  { id: 'case-001', label: '1. Wanprestasi EPC Pembangkit Listrik (TRX/2026/CIV-089)', tag: 'Wanprestasi' },
                  { id: 'case-002', label: '2. PMH & Rahasia Dagang Fintek (TRX/2026/IP-042)', tag: 'HAKI & PMH' },
                  { id: 'case-003', label: '3. PHI & Pesangon Ketenagakerjaan (TRX/2026/LAB-019)', tag: 'Ketenagakerjaan' },
                  { id: 'case-004', label: '4. Agraria & Hak Atas Tanah HGB (TRX/2026/CIV-144)', tag: 'Agraria / Pertanahan' },
                  { id: 'case-005', label: '5. Arbitrase Komersial BANI M&A (TRX/2026/ARB-027)', tag: 'Arbitrase BANI' },
                ].map((c) => (
                  <button
                    key={c.id}
                    id={`quick-civil-case-${c.id}`}
                    onClick={() => onSelectSampleCase(c.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5 Criminal Cases Showcase */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <span className="text-[11px] font-mono text-rose-400/90 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>5 Contoh Perkara Pidana & UU Khusus (SOP PCA Terintegrasi):</span>
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {[
                  { id: 'case-pca-001', label: '1. Tipikor & TPPU BTS 4G (TRX/2026/CRM-042)', tag: 'Tipikor' },
                  { id: 'case-pca-002', label: '2. Perbankan & Fintek P2P (TRX/2026/CRM-088)', tag: 'Perbankan & ITE' },
                  { id: 'case-pca-003', label: '3. Karhutla Korporasi PPLH (TRX/2026/CRM-105)', tag: 'Lingkungan' },
                  { id: 'case-pca-004', label: '4. Faktur Pajak TBTS (TRX/2026/CRM-137)', tag: 'Perpajakan' },
                  { id: 'case-pca-005', label: '5. Kelalaian Medis Bedah (TRX/2026/CRM-219)', tag: 'Profesi Medis' },
                ].map((c) => (
                  <button
                    key={c.id}
                    id={`quick-case-${c.id}`}
                    onClick={() => onSelectSampleCase(c.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer Banner (Mandatory Step 0) */}
          <div className="mt-12 max-w-3xl mx-auto rounded-xl bg-slate-900/90 border border-amber-500/30 p-4 text-left flex items-start gap-3.5 shadow-md">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-300 block mb-1">Prinsip & Batasan Penggunaan (Legal Disclaimer):</span>
              TriyLex diposisikan sebagai <em>Structured Legal Intelligence System</em> untuk membantu memetakan, menguji, dan menelusuri analisis perkara. TriyLex <strong>bukan pengganti advokat</strong>, tidak memberikan jaminan kepastian kemenangan perkara, dan tidak secara otomatis mengubah dalil (allegation) menjadi fakta yang terbukti (established fact). Seluruh rujukan hukum harus diverifikasi oleh profesional hukum.
            </div>
          </div>
        </div>
      </section>

      {/* 5-Agent Pipeline (ULPE-AW Architecture) */}
      <section className="py-16 lg:py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Fondasi ULPE-AW</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
              Siklus Analisis 5-Agent & Verification Gate
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Setiap berkas dokumen diproses secara terpisah oleh agent berspesialisasi sebelum digabungkan melalui gerbang verifikasi manusia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Agent 1 */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Agent 1: Case Mapper</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Mengekstrak fakta konkret, identitas pihak, klaim, eksepsi, dan timeline. Memberi label status: <em>Established, Alleged, Disputed,</em> atau <em>Unknown</em> dengan tingkat keyakinan (confidence).
              </p>
              <div className="flex items-center gap-2 text-[11px] text-blue-400 font-medium bg-blue-950/40 px-2.5 py-1 rounded border border-blue-900/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fact & Chronology Isolation</span>
              </div>
            </div>

            {/* Agent 2 */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Agent 2: Legal Classifier</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Memetakan lapisan norma hukum (contoh: KUHPerdata, UU Perseroan Terbatas, Perma Arbitrase), mengidentifikasi fakta pemicu (triggering facts), dan menetapkan bobot prioritas telaah.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/40">
                <Layers className="w-3.5 h-3.5" />
                <span>Multi-Layer Classification</span>
              </div>
            </div>

            {/* Agent 3 */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Agent 3: Legal Research Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Memvalidasi sumber primer regulasi Indonesia, status pasal (aktif/diamandemen/dicabut), dan menandai rujukan yang memerlukan telaah kepustakaan lanjutan.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-purple-400 font-medium bg-purple-950/40 px-2.5 py-1 rounded border border-purple-900/40">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Anti-Hallucination Source Check</span>
              </div>
            </div>

            {/* Agent 4 */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Agent 4: Evidence Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Menganalisis kekuatan alat bukti (otentik vs bawah tangan vs elektronik), status koroborasi, serta mendeteksi <strong>Evidence Gaps</strong> (dokumen krusial yang belum ada).
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium bg-amber-950/40 px-2.5 py-1 rounded border border-amber-900/40">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Evidence Matrix & Gap Spotting</span>
              </div>
            </div>

            {/* Agent 5 */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 relative hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-sm mb-4">
                05
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Agent 5: Argument Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Menyusun analisis simetris: menguji dalil Klien dan mengantisipasi sanggahan pihak lawan melalui <em>stress test</em> titik lemah pembuktian di persidangan.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-rose-400 font-medium bg-rose-950/40 px-2.5 py-1 rounded border border-rose-900/40">
                <GitMerge className="w-3.5 h-3.5" />
                <span>Symmetric Stress Testing</span>
              </div>
            </div>

            {/* Synthesis Gate */}
            <div className="rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-6 relative">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-sm mb-4">
                GATE
              </div>
              <h3 className="font-semibold text-white text-base mb-2">Verification Gate & Traceability</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Menyambungkan setiap kesimpulan hukum ke rantai pembuktian: <strong>Conclusion → Issue → Element → Fact → Evidence → Document</strong>.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-300 font-medium bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
                <Shield className="w-3.5 h-3.5" />
                <span>Auditable Chain of Custody</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Traceability Demo Preview */}
      <section className="py-16 border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Standar Akuntabilitas</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
              Contoh Rantai Penelusuran (Traceability Chain)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Tidak ada kesimpulan hukum tanpa akar dokumen dan fakta yang dapat ditunjukkan ke hadapan Hakim atau Arbitrer.
            </p>
          </div>

          {/* Visual Interactive Chain */}
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-center">
              
              <div className="sm:col-span-1 p-3 rounded-lg bg-blue-950/60 border border-blue-800/60 text-center">
                <span className="text-[10px] text-blue-400 font-bold block">DOKUMEN D-01</span>
                <span className="text-xs text-white font-medium truncate block">Kontrak EPC</span>
              </div>

              <div className="hidden sm:flex justify-center text-slate-600">→</div>

              <div className="sm:col-span-1 p-3 rounded-lg bg-amber-950/60 border border-amber-800/60 text-center">
                <span className="text-[10px] text-amber-400 font-bold block">EVIDENCE E-01</span>
                <span className="text-xs text-white font-medium truncate block">Klausul 14.3</span>
              </div>

              <div className="hidden sm:flex justify-center text-slate-600">→</div>

              <div className="sm:col-span-1 p-3 rounded-lg bg-purple-950/60 border border-purple-800/60 text-center">
                <span className="text-[10px] text-purple-400 font-bold block">FAKTA F-01</span>
                <span className="text-xs text-white font-medium truncate block">Terlambat COD</span>
              </div>

              <div className="hidden sm:flex justify-center text-slate-600">→</div>

              <div className="sm:col-span-1 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-center">
                <span className="text-[10px] text-emerald-400 font-bold block">UNSUR E-02</span>
                <span className="text-xs text-white font-medium truncate block">Ps 1243 KUHPer</span>
              </div>

              <div className="hidden sm:flex justify-center text-slate-600">→</div>

              <div className="sm:col-span-1 p-3 rounded-lg bg-amber-500 text-slate-950 text-center font-bold shadow-lg">
                <span className="text-[10px] uppercase block">KESIMPULAN</span>
                <span className="text-xs block">Denda Sah Rp 32M</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Security & Data Privacy (Workflow Tahap 12) */}
      <section className="py-12 bg-slate-900/30 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-white">Privasi Data Dokumen Hukum</h4>
                <p className="text-xs text-slate-400 mt-1">Data perkara diisolasi per workspace dan tidak pernah digunakan untuk training model publik.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-white">Redaksi Otomatis Data Sensitif (PII)</h4>
                <p className="text-xs text-slate-400 mt-1">Penyaringan otomatis untuk NIK KTP, nomor rekening bank, data medis, dan nomor kontak.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <Database className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-white">Audit Log & Akses Berjenjang (RBAC)</h4>
                <p className="text-xs text-slate-400 mt-1">Kontrol akses ketat: Admin, Lead Counsel, Analyst, Reviewer, hingga Viewer dengan riwayat audit lengkap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 bg-slate-950 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scale className="w-6 h-6 text-amber-400" />
            <span className="font-serif font-bold text-lg text-white">TriyLex Legal Case Analyst</span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            © 2026 TriyLex Platform. Mengacu pada sistem hukum yurisdiksi Indonesia (Civil Law System).
          </p>
          <div className="mt-6">
            <button
              onClick={onEnterApp}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              Mulai Menggunakan Workspace
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
