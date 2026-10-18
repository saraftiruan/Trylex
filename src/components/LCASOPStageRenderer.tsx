import React, { useState } from 'react';
import { 
  Scale, 
  Users, 
  FileText, 
  Clock, 
  FileCode, 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Swords, 
  GitFork, 
  Calculator, 
  TrendingUp, 
  Network, 
  Compass, 
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Building2,
  Calendar,
  DollarSign,
  UploadCloud,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import { LegalCase, UserProfile, CaseDocument, EvidenceItem } from '../types';
import { ContractReconstructionView } from './ContractReconstructionView';
import { ArgumentMappingView } from './ArgumentMappingView';
import { QuantumCalculatorView } from './QuantumCalculatorView';
import { CaseStrategyView } from './CaseStrategyView';
import { TraceabilityGraph } from './TraceabilityGraph';
import { PCASOPStageRenderer } from './PCASOPStageRenderer';
import { VisualDocumentTimeline } from './VisualDocumentTimeline';

interface LCASOPStageRendererProps {
  stageId: string;
  caseData: LegalCase;
  currentUser: UserProfile;
  onUpdateCase: (updatedCase: LegalCase) => void;
  onOpenDropzone: () => void;
  onOpenFinalReport: () => void;
  onOpenJudicialSim: () => void;
  onOpenLegalDrafter: () => void;
  onOpenJDIHModal?: () => void;
}

export const LCASOPStageRenderer: React.FC<LCASOPStageRendererProps> = ({
  stageId,
  caseData,
  currentUser,
  onUpdateCase,
  onOpenDropzone,
  onOpenFinalReport,
  onOpenJudicialSim,
  onOpenLegalDrafter,
  onOpenJDIHModal,
}) => {
  const isCriminal = 
    caseData?.methodology === 'PCA' || 
    stageId.toLowerCase().startsWith('pca') ||
    [
      'Tindak Pidana Korupsi (Tipikor)',
      'Tindak Pidana Pencucian Uang (TPPU)',
      'Tindak Pidana Siber & ITE',
      'Tindak Pidana Bisnis & Korporasi',
      'Tindak Pidana Perpajakan & Kepabeanan',
      'Tindak Pidana Pasar Modal & Perbankan',
      'Tindak Pidana Lingkungan Hidup & Kehutanan',
      'Tindak Pidana Narkotika & Psikotropika',
      'Tindak Pidana Umum (KUHP: Penipuan, Penggelapan, Pemalsuan Surat)',
      'Pidana Bisnis / White Collar'
    ].some(t => (caseData?.caseType || '').includes(t) || (caseData?.caseType || '').toLowerCase().includes('pidana'));

  // If this is a criminal case or a PCA stage, render the specialized PCA stage renderer
  if (isCriminal || stageId.toLowerCase().startsWith('pca')) {
    // Translate LCA-001 or intake to pca-001 if needed
    const effectivePCAStage = 
      stageId === 'LCA-001' || stageId === 'intake' 
        ? 'pca-001' 
        : stageId;

    return (
      <PCASOPStageRenderer
        stageId={effectivePCAStage}
        caseData={caseData}
        currentUser={currentUser}
        onUpdateCase={onUpdateCase}
        onOpenDropzone={onOpenDropzone}
        onOpenFinalReport={onOpenFinalReport}
        onOpenJudicialSim={onOpenJudicialSim}
        onOpenLegalDrafter={onOpenLegalDrafter}
        onOpenJDIHModal={onOpenJDIHModal}
      />
    );
  }

  // LCA-001: Case Intake & Scoping
  if (stageId === 'LCA-001') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  SOP LCA-001
                </span>
                <h3 className="text-sm font-bold text-white">Case Intake & Scoping (Penerimaan & Lingkup Perkara)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pengumpulan data awal, verifikasi identitas klien vs lawan, penentuan yurisdiksi, dan klasifikasi sengketa.
              </p>
            </div>
          </div>
        </div>

        {/* Case Baseline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Klien (Pihak Kami)</span>
            <div className="text-sm font-bold text-white">{caseData.client}</div>
            <span className="text-[10px] text-emerald-400">Status: Penggugat / Pemohon</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Pihak Lawan</span>
            <div className="text-sm font-bold text-white">{caseData.opposingParty}</div>
            <span className="text-[10px] text-rose-400">Status: Tergugat / Termohon</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Yurisdiksi & Forum</span>
            <div className="text-sm font-bold text-amber-400">{caseData.courtForum}</div>
            <span className="text-[10px] text-slate-400">Hukum: {caseData.jurisdiction}</span>
          </div>
        </div>

        {/* Summary & Claims */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Ringkasan Duduk Perkara</h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-sans">
            {caseData.summary}
          </p>
        </div>

        {/* Claims & Relief */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Klaim & Petitum Tuntutan</h4>
            <span className="text-xs font-mono font-bold text-amber-400">Total: {caseData.claimAmount}</span>
          </div>
          <div className="space-y-3">
            {caseData.claims.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.title}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{c.claimedAmount}</span>
                </div>
                <p className="text-xs text-slate-400">{c.description}</p>
                {c.legalBasis && (
                  <span className="text-[10px] font-mono text-amber-400/90 block">
                    Dasar: {c.legalBasis}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // LCA-002: Party Mapping Engine
  if (stageId === 'LCA-002') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                  SOP LCA-002
                </span>
                <h3 className="text-sm font-bold text-white">Party Mapping Engine (Pemetaan Entitas & Kapasitas Hukum)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Identifikasi legal standing, kedudukan pengurus korporasi, domisili yuridis, dan hubungan hukum para pihak.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {caseData.parties.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{p.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.role === 'Claimant' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    p.role === 'Defendant' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {p.role}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {p.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400">Kapasitas Hukum:</strong> {p.representation || 'Direksi Utama / Subjek Hukum Mandiri'}
                </p>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-500">Kedudukan:</strong> {p.counsel || 'Diwakili Kuasa Hukum Advokat'}
                </p>
              </div>

              <div className="shrink-0 text-xs text-right space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Status Keterikatan</span>
                <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                  Pihak Terikat Kontrak
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LCA-003: Document Intake & OCR
  if (stageId === 'LCA-003') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  SOP LCA-003
                </span>
                <h3 className="text-sm font-bold text-white">Document Intake & OCR Processing (Manajemen Berkas & PII)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Penerimaan berkas bukti (PDF, DOCX, XLSX, IMG), ekstraksi teks OCR berakurasi tinggi, dan sensor PII otomatis.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenDropzone}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Unggah Berkas Bukti</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseData.documents.map((doc) => (
            <div key={doc.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white truncate max-w-[220px]">{doc.name}</h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {doc.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                {doc.extractedText || 'Teks belum diekstrak'}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span className="text-emerald-400 font-semibold">● OCR: {doc.ocrConfidence || '98% Verifikasi'}</span>
                <span>PII Redacted: {doc.piiRedacted ? 'Ya' : 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LCA-004: Fact Extraction & Chronology with Visual Document Timeline
  if (stageId === 'LCA-004') {
    return (
      <VisualDocumentTimeline 
        caseData={caseData} 
        onUpdateCase={onUpdateCase} 
        onOpenFinalReport={onOpenFinalReport}
      />
    );
  }

  // LCA-005: Contract Reconstruction Engine
  if (stageId === 'LCA-005') {
    return <ContractReconstructionView caseData={caseData} onUpdateCase={onUpdateCase} />;
  }

  // LCA-006: Statutory & Regulatory Mapping
  if (stageId === 'LCA-006') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                  SOP LCA-006
                </span>
                <h3 className="text-sm font-bold text-white">Statutory & Regulatory Mapping (Hierarki Peraturan & Yurisprudensi)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pemetaan pasal KUHPerdata, UU Sektoral Khusus, dan kaidah yurisprudensi tetap Mahkamah Agung RI.
              </p>
            </div>
          </div>

          {onOpenJDIHModal && (
            <button
              onClick={onOpenJDIHModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>JDIHN & Yurisprudensi Explorer</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {caseData.statutes.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 font-mono">{s.article}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    Tahun: {s.effectiveDate || 'Positif'}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  s.status === 'Current' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  s.status === 'Amended' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {s.status === 'Current' ? '● Berlaku Penuh' : s.status === 'Amended' ? '● Diubah Sebagian' : s.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white">{s.lawName}</h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-sans">
                {s.relevance}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }


  // LCA-007: Evidence Matrix
  if (stageId === 'LCA-007') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  SOP LCA-007
                </span>
                <h3 className="text-sm font-bold text-white">Evidence Matrix Formulation (Matriks Alat Bukti & Pembuktian)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Klasifikasi alat bukti sesuai Pasal 1866 KUHPerdata: Akta Otentik, Akta Bawah Tangan, Bukti Elektronik UU ITE.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Kode Bukti</th>
                <th className="p-3">Nama Alat Bukti</th>
                <th className="p-3">Klasifikasi Formil</th>
                <th className="p-3">Kekuatan Pembuktian</th>
                <th className="p-3">Status Koroborasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {caseData.evidenceMatrix.map((ev) => (
                <tr key={ev.evidenceId} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-amber-400">{ev.evidenceId}</td>
                  <td className="p-3 font-semibold text-white">{ev.name}</td>
                  <td className="p-3 text-slate-300">{ev.type}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                      {ev.reliability}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{ev.corroborationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // LCA-008: Evidence Gap Identification
  if (stageId === 'LCA-008') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP LCA-008
                </span>
                <h3 className="text-sm font-bold text-white">Evidence Gap Identification (Deteksi Celah & Bukti Hilang)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Identifikasi missing documents, bukti yang berisiko disangkal, dan action plan pelengkapan alat bukti.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {caseData.evidenceGaps.map((gap) => (
            <div key={gap.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400">{gap.id}</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                  Dampak: {gap.impact}
                </span>
              </div>
              <p className="text-xs font-bold text-white">{gap.description}</p>
              <p className="text-xs text-amber-300/90 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <strong>Rekomendasi Tindakan:</strong> {gap.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LCA-009: Argument Mapping
  if (stageId === 'LCA-009') {
    return <ArgumentMappingView caseData={caseData} onUpdateCase={onUpdateCase} />;
  }

  // LCA-010: Liability Assessment
  if (stageId === 'LCA-010') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <GitFork className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                  SOP LCA-010
                </span>
                <h3 className="text-sm font-bold text-white">Liability Assessment & Causation Test (Uji Tanggung Jawab Hukum)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Uji unsur wanprestasi / PMH, hubungan kausalitas (causa proxima), dan penilaian kesalahan debitur.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenJudicialSim}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulasi Uji Majelis Hakim</span>
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Kesimpulan Tanggung Jawab Hukum</h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans">
            Tergugat ({caseData.opposingParty}) terbukti memenuhi unsur wanprestasi berdasarkan Pasal 1243 KUHPerdata: (1) Adanya perikatan yang sah, (2) Telah terjadi kelalaian pembayaran termin kedua, (3) Telah dilayangkan surat teguran/somasi sah, dan (4) Ketiadaan keadaan memaksa (overmacht) yang sah.
          </p>
        </div>
      </div>
    );
  }

  // LCA-011: Quantum of Damages
  if (stageId === 'LCA-011') {
    return <QuantumCalculatorView caseData={caseData} onUpdateCase={onUpdateCase} />;
  }

  // LCA-012: Risk & Win-Rate Scoring
  if (stageId === 'LCA-012') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  SOP LCA-012
                </span>
                <h3 className="text-sm font-bold text-white">Risk & Win-Rate Scoring (Probabilitas Kemenangan & Eksposur)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluasi multi-dimensi atas risiko hukum, temporal, eksekusi, dan estimasi persentase kemenangan di pengadilan.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Legal Exposure</span>
            <div className="text-lg font-bold text-emerald-400">{caseData.riskMatrix?.legalExposure || 'Low / Terkendali'}</div>
            <span className="text-[10px] text-slate-500">Berdasarkan keabsahan kontrak</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Kekuatan Alat Bukti</span>
            <div className="text-lg font-bold text-indigo-400">{caseData.riskMatrix?.evidenceStrength || 'Strong (Kuat)'}</div>
            <span className="text-[10px] text-slate-500">Didukung bukti surat otentik</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Estimasi Win-Rate</span>
            <div className="text-lg font-bold text-amber-400">78% - 85%</div>
            <span className="text-[10px] text-slate-500">Tergantung kelengkapan bukti somasi</span>
          </div>
        </div>
      </div>
    );
  }

  // LCA-013: Traceability Graph
  if (stageId === 'LCA-013') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                  SOP LCA-013
                </span>
                <h3 className="text-sm font-bold text-white">Full Traceability Graph (Rantai Kausalitas Bukti & Fakta)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Visualisasi rantai pembuktian tanpa celah: Kesimpulan Yuridis &rarr; Unsur Hukum &rarr; Fakta Konkret &rarr; Alat Bukti Fisik.
              </p>
            </div>
          </div>
        </div>

        <TraceabilityGraph data={caseData} />
      </div>
    );
  }

  // LCA-014: Case Strategy & Roadmap
  if (stageId === 'LCA-014') {
    return <CaseStrategyView caseData={caseData} onUpdateCase={onUpdateCase} />;
  }

  // LCA-015: Final Intelligence Report
  if (stageId === 'LCA-015') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                  SOP LCA-015
                </span>
                <h3 className="text-sm font-bold text-white">Final Case Intelligence Report (Laporan Akhir Intelejen Perkara)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kompilasi master seluruh 15 tahapan SOP menjadi dokumen laporan hukum eksekutif lengkap siap cetak / PDF.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenFinalReport}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Buka Dossier Laporan Akhir (LCA-015)</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">Dossier Ringkasan Intelejen Perkara</h4>
              <p className="text-xs text-slate-400">Ref: {caseData?.refNumber || '-'} | {caseData?.title || 'Perkara'}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              15/15 SOP Completed
            </span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans space-y-3">
            <p>
              {caseData.finalReportText ? caseData.finalReportText.slice(0, 500) + '...' : 
               'Laporan akhir siap digenerate dengan 12 Bab formal: Ringkasan Eksekutif, Pihak, Kronologi, Matriks Fakta & Bukti, Rekonstruksi Kontrak, Statuta, Pemetaan Argumen, Liability Test, Quantum Kuantifikasi Kerugian, Risk Scoring, Celah Bukti, dan Roadmap Strategi Eksekusi.'}
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onOpenFinalReport}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold text-xs flex items-center gap-2 border border-slate-700"
            >
              <span>Lihat Dokumen Lengkap & Unduh .MD / Cetak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div>Tahap SOP tidak ditemukan.</div>;
};
