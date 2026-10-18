import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Calendar, 
  Layers, 
  BookOpen, 
  Crosshair, 
  Scale, 
  Lock, 
  FileCheck, 
  Eye, 
  Calculator, 
  Compass, 
  Gavel, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  UploadCloud, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { LegalCase, UserProfile, EvidenceItem } from '../types';
import { TraceabilityGraph } from './TraceabilityGraph';
import { VisualDocumentTimeline } from './VisualDocumentTimeline';

interface PCASOPStageRendererProps {
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

export const PCASOPStageRenderer: React.FC<PCASOPStageRendererProps> = ({
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
  // Normalize stageId
  const normalizedStage = stageId.toLowerCase().replace('_', '-');

  // Loading states for AI generators
  const [isLoadingDueProcess, setIsLoadingDueProcess] = useState(false);
  const [isLoadingElements, setIsLoadingElements] = useState(false);
  const [isLoadingCrossExam, setIsLoadingCrossExam] = useState(false);
  const [isLoadingPledoi, setIsLoadingPledoi] = useState(false);
  const [copiedPledoi, setCopiedPledoi] = useState(false);

  // Handler: Run Due Process & Praperadilan Audit
  const handleRunDueProcessAudit = async () => {
    setIsLoadingDueProcess(true);
    try {
      const res = await fetch('/api/gemini/pca-audit-due-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });
      const data = await res.json();
      if (data.success && data.audit) {
        onUpdateCase({
          ...caseData,
          pcaDueProcessAudit: data.audit,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Audit Praperadilan Error:', err);
    } finally {
      setIsLoadingDueProcess(false);
    }
  };

  // Handler: Deconstruct Elements of Crime (Actus Reus & Mens Rea)
  const handleRunElementsDeconstruction = async () => {
    setIsLoadingElements(true);
    try {
      const res = await fetch('/api/gemini/pca-deconstruct-elements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });
      const data = await res.json();
      if (data.success && data.deconstruction) {
        onUpdateCase({
          ...caseData,
          pcaElementsDeconstruction: data.deconstruction,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Elements Deconstruction Error:', err);
    } finally {
      setIsLoadingElements(false);
    }
  };

  // Handler: Generate Cross-Examination Questions
  const handleRunCrossExam = async () => {
    setIsLoadingCrossExam(true);
    try {
      const res = await fetch('/api/gemini/pca-cross-examination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });
      const data = await res.json();
      if (data.success && data.crossExam) {
        onUpdateCase({
          ...caseData,
          pcaCrossExaminationSimulator: data.crossExam,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Cross-Exam Error:', err);
    } finally {
      setIsLoadingCrossExam(false);
    }
  };

  // Handler: Generate Master Pledoi
  const handleGeneratePledoi = async (isEksepsi = false) => {
    setIsLoadingPledoi(true);
    try {
      const res = await fetch('/api/gemini/pca-draft-pledoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData, docType: isEksepsi ? 'eksepsi' : 'pledoi' }),
      });
      const data = await res.json();
      if (data.success && data.draftText) {
        onUpdateCase({
          ...caseData,
          pcaPledoiDossier: {
            pledoiTitle: isEksepsi 
              ? `NOTA KEBERATAN / EKSEPSI ATAS SURAT DAKWAAN (${caseData.refNumber})`
              : `NOTA PEMBELAAN (PLEDOI): PEMBEBASAN KLIEN ATAS TUNTUTAN PIDANA`,
            defenseTarget: 'Vrijspraak (Bebas Murni)',
            pledoiText: data.draftText,
          },
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Pledoi Generation Error:', err);
    } finally {
      setIsLoadingPledoi(false);
    }
  };

  // PCA-001: Criminal Intake & Scoping
  if (normalizedStage === 'pca-001' || normalizedStage === 'lca-001') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-001
                </span>
                <h3 className="text-sm font-bold text-white">Criminal Intake & Scoping (Penerimaan & Klasifikasi Delik Pidana)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit Laporan Polisi (LP), Sprindik, Surat Pemberitahuan Dimulainya Penyidikan (SPDP), dan Surat Dakwaan Penuntut Umum.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenDropzone}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Unggah Berkas BAP / Dakwaan</span>
            </button>
          </div>
        </div>

        {/* Case Baseline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Terdakwa / Klien Kami</span>
            <div className="text-sm font-bold text-white">{caseData.client}</div>
            <span className="text-[10px] text-rose-400 font-semibold">Status: Tersangka / Terdakwa</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Pihak Penuntut / Penyidik</span>
            <div className="text-sm font-bold text-white">{caseData.opposingParty}</div>
            <span className="text-[10px] text-amber-400">Instansi: Penuntut Umum / Bareskrim / KPK</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Forum & Tahap Acara</span>
            <div className="text-sm font-bold text-rose-300">{caseData.courtForum}</div>
            <span className="text-[10px] text-slate-400">Posisi: {caseData.proceduralPosition}</span>
          </div>
        </div>

        {/* Summary & Duduk Perkara */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Ringkasan Duduk Perkara & Modus Operandi</h4>
            <span className="text-[11px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20">
              {caseData.caseType}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-sans">
            {caseData.summary}
          </p>
        </div>

        {/* Surat Dakwaan / Ancaman Pidana */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Pasal Dakwaan & Tuntutan Sanksi</h4>
            <span className="text-xs font-mono font-bold text-rose-400">{caseData.claimAmount || 'Ancaman Sanksi Maksimal'}</span>
          </div>
          <div className="space-y-3">
            {(caseData.claims || []).map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{c.title}</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{c.claimedAmount}</span>
                </div>
                <p className="text-xs text-slate-400">{c.description}</p>
                {c.legalBasis && (
                  <span className="text-[10px] font-mono text-rose-400/90 block">
                    Dasar Norma: {c.legalBasis}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PCA-002: Criminal Party & Suspect Mapping
  if (normalizedStage === 'pca-002') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-002
                </span>
                <h3 className="text-sm font-bold text-white">Criminal Party & Suspect Mapping (Pemetaan Subjek Perkara Pidana)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Identifikasi Terdakwa, Penasihat Hukum, Penyidik, Jaksa Penuntut Umum, Saksi Mahkota, Saksi A Charge, dan Saksi Meringankan (A De Charge).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(caseData.parties || []).map((party) => (
            <div key={party.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{party.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  party.role.includes('Terdakwa') || party.role.includes('Tersangka')
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : party.role.includes('JPU') || party.role.includes('Penyidik')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : party.role.includes('A De Charge')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {party.role}
                </span>
              </div>
              <div className="text-xs text-slate-400">Tipe: {party.type}</div>
              {party.legalRepresentative && (
                <div className="text-xs text-slate-300 font-mono">
                  Perwakilan / Kuasa: {party.legalRepresentative}
                </div>
              )}
              {party.conflictNotes && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-amber-400">Catatan Konflik / Relasi:</span> {party.conflictNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PCA-003: Due Process of Law & Praperadilan Audit
  if (normalizedStage === 'pca-003') {
    const audit = caseData.pcaDueProcessAudit;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-003
                </span>
                <h3 className="text-sm font-bold text-white">Due Process of Law & Praperadilan Audit (Uji Keabsahan Formil Penyidikan)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Uji kepatuhan Putusan MK No. 21/PUU-XII/2014 (minimal 2 alat bukti sah & pemeriksaan calon tersangka), keabsahan sita/geledah, dan kelayakan Praperadilan.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunDueProcessAudit}
            disabled={isLoadingDueProcess}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoadingDueProcess ? 'Menganalisis Prosedur...' : 'Jalankan Audit Praperadilan (AI)'}</span>
          </button>
        </div>

        {/* Viability Badge */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300">Potensi Keberhasilan Praperadilan:</span>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              {audit?.praperadilanViability || 'Sangat Tinggi (Strong) - Cacat Formil Ditemukan'}
            </span>
          </div>
          <button
            onClick={onOpenLegalDrafter}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5"
          >
            <span>Draf Permohonan Praperadilan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Legality Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Penetapan Tersangka (MK 21/2014)</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                audit?.suspectDesignationLegality.mk21Compliance
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {audit?.suspectDesignationLegality.mk21Compliance ? 'Sah' : 'Cacat Formil'}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {audit?.suspectDesignationLegality.notes || 'Penetapan Tersangka tidak didasarkan pada 2 alat bukti sah yang terverifikasi dan tidak didahului pemeriksaan calon tersangka.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Penggeledahan & Penyitaan (KUHAP)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Berizin PN
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {audit?.searchAndSeizureLegality.notes || 'Penyitaan dokumen telah didukung penetapan izin Ketua Pengadilan Negeri setempat.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Hak Bantuan Hukum (Pasal 56)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Terpenuhi
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {audit?.legalCounselRight.notes || 'Terdakwa telah didampingi penasihat hukum resmi selama proses penyidikan.'}
            </p>
          </div>
        </div>

        {/* Praperadilan Arguments List */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Dalil Pokok Permohonan Praperadilan (Gugatan Pembatalan TSK)</h4>
          <div className="space-y-2">
            {(audit?.praperadilanArguments || [
              'Penetapan Tersangka prematur sebelum terbitnya LHP Perhitungan Kerugian Keuangan Negara resmi dari BPK RI.',
              'Pelanggaran asas Due Process of Law atas hak membela diri pada tahap pemeriksaan saksi calon tersangka.',
              'Penyitaan barang bukti non-korpora delicti tanpa izin Ketua Pengadilan Negeri.'
            ]).map((arg, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs text-slate-300 leading-relaxed">{arg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PCA-004: Criminal Fact & Modus Operandi
  if (normalizedStage === 'pca-004') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-004
                </span>
                <h3 className="text-sm font-bold text-white">Criminal Fact & Modus Operandi (Ekstraksi Fakta Materiil Pidana)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Penguraian locus delicti (tempat), tempus delicti (waktu), dan fakta yang diakui vs dibantah oleh Terdakwa.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Fakta Yang Diakui Bersama (Admitted Facts)</span>
            </div>
            <div className="space-y-2">
              {(caseData.admittedFacts || []).map((fact, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  {fact}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Fakta Disengketakan & Bantahan Pembelaan</span>
            </div>
            <div className="space-y-2">
              {(caseData.disputedFacts || []).map((fact, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-rose-900/30 text-xs text-slate-300 leading-relaxed">
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PCA-005: Chronology & Alibi Reconstruction (Visual Document Timeline)
  if (normalizedStage === 'pca-005') {
    return (
      <VisualDocumentTimeline 
        caseData={caseData} 
        onUpdateCase={onUpdateCase} 
        onOpenFinalReport={onOpenFinalReport}
      />
    );
  }

  // PCA-006: Evidence Matrix (Pasal 184 KUHAP)
  if (normalizedStage === 'pca-006') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-006
                </span>
                <h3 className="text-sm font-bold text-white">Criminal Evidence Matrix (Matriks Alat Bukti Sah Pasal 184 KUHAP)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Keterangan Saksi, Keterangan Ahli, Surat, Petunjuk, Keterangan Terdakwa, dan Bukti Elektronik (UU ITE/TPPU).
              </p>
            </div>
          </div>

          {onOpenJDIHModal && (
            <button
              onClick={onOpenJDIHModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Riset JDIHN & Yurisprudensi</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {(caseData.evidenceMatrix || []).map((item) => (
            <div key={item.evidenceId} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-rose-400 font-bold">{item.evidenceId}</span>
                  <span className="text-xs font-bold text-white">{item.name}</span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold border border-slate-700">
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.notes}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                <span>Reliabilitas: {item.reliability}</span>
                <span>•</span>
                <span>Status: {item.corroborationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PCA-007: Dual Penal Code & Special Crime Mapping
  if (normalizedStage === 'pca-007') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-007
                </span>
                <h3 className="text-sm font-bold text-white">Dual Penal Code & Special Crime Mapping (KUHP Baru vs WvS & UU Khusus)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Penerapan Asas Transisi Lex Favor Reo (Pasal 1 ayat 2 KUHP) dan komparasi delik tipikor, siber, korporasi, pencucian uang.
              </p>
            </div>
          </div>
        </div>

        {/* Dual System Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Sistem Lama (WvS / UU Khusus Berlaku Saat Ini)
            </span>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">UU No. 31/1999 jo. UU No. 20/2001 (Tipikor)</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pasal 2 ayat (1): Ancaman pidana penjara seumur hidup atau paling singkat 4 tahun dan paling lama 20 tahun, denda minimal Rp 200 juta.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              KUHP Nasional Baru (UU No. 1 Tahun 2023)
            </span>
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/30 space-y-2">
              <div className="text-xs font-bold text-white">Pasal 603 KUHP Baru (Lex Favor Reo)</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ancaman pidana minimal diturunkan menjadi paling singkat 2 tahun penjara, serta mengedepankan pidana denda dan alternatif sanksi pembinaan.
              </p>
            </div>
          </div>
        </div>

        {/* Statutory Source Table */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Rujukan Peraturan Perundang-undangan Aktif</h4>
          <div className="space-y-2">
            {(caseData.statutes || []).map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{s.lawName} - {s.article}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{s.relevance}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PCA-008: Elements of Crime Deconstruction
  if (normalizedStage === 'pca-008') {
    const elements = caseData.pcaElementsDeconstruction;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-008
                </span>
                <h3 className="text-sm font-bold text-white">Elements of Crime Deconstruction (Bedah Unsur Delik Pidana)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pemisahan dan pengujian matematis Unsur Obyektif (Actus Reus) vs Unsur Subyektif (Mens Rea: Dolus/Culpa) dan Kausalitas.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunElementsDeconstruction}
            disabled={isLoadingElements}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoadingElements ? 'Membedah Unsur...' : 'Bedah Unsur Delik dengan AI'}</span>
          </button>
        </div>

        {/* Objective Elements / Actus Reus */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
            1. Unsur Obyektif (Actus Reus / Perbuatan Lahiriah)
          </h4>
          <div className="space-y-3">
            {(elements?.objectiveElements || [
              {
                element: "Secara Melawan Hukum (Wederrechtelijk)",
                fulfillment: "Diragukan / Celah Pembelaan",
                analysis: "Tindakan didasarkan pada diskresi administratif penanganan keadaan kahar dan sesuai SOP perseroan, bukan tindak pidana.",
                supportingEvidence: ["SOP Proyek Darurat", "Surat Keputusan Bupati"]
              },
              {
                element: "Merugikan Keuangan Negara atau Perekonomian Negara",
                fulfillment: "Tidak Terpenuhi",
                analysis: "Fisik menara telah berdiri 100% dan melayani masyarakat; ketiadaan actual loss berdasarkan audit investigatif.",
                supportingEvidence: ["Laporan Uji Fisik ITB"]
              }
            ]).map((elem, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{elem.element}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    elem.fulfillment === 'Terpenuhi'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : elem.fulfillment === 'Tidak Terpenuhi'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {elem.fulfillment}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{elem.analysis}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Bukti Pembelaan: {elem.supportingEvidence.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjective Elements / Mens Rea */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            2. Unsur Subyektif (Mens Rea / Niat Batiniah)
          </h4>
          <div className="space-y-3">
            {(elements?.subjectiveElements || [
              {
                element: "Dengan Sengaja / Niat Memperkaya Diri Sendiri (Dolus)",
                fulfillment: "Tidak Terpenuhi",
                analysis: "Tidak ditemukan adanya aliran dana kickback atau suap ke rekening Terdakwa berdasar LHA PPATK.",
                supportingEvidence: ["LHA PPATK", "Rekening Koran Nihil"]
              }
            ]).map((elem, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{elem.element}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    {elem.fulfillment}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{elem.analysis}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Bukti Pembelaan: {elem.supportingEvidence.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PCA-009: Participation & Corporate Liability
  if (normalizedStage === 'pca-009') {
    const part = caseData.pcaParticipationCorporate;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-009
                </span>
                <h3 className="text-sm font-bold text-white">Participation & Corporate Liability (Ajaran Penyertaan & Pidana Korporasi)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kualifikasi Pasal 55 ayat (1) ke-1 KUHP (Medepleger vs Pleger) dan pemisahan pertanggungjawaban perseroan (PERMA No. 13 Tahun 2016).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              Bentuk Penyertaan (Deelneming)
            </span>
            <div className="text-sm font-bold text-white">{part?.participationForm || 'Medepleger (Turut Serta Melakukan Ps 55-1-1)'}</div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {part?.participationAnalysis || 'JPU gagal membuktikan adanya kesepakatan batin (bewuste samenwerking) dan pelaksanaan fisik bersama antara Terdakwa dengan vendor swasta untuk melakukan korupsi.'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Doktrin Pidana Korporasi (PERMA 13/2016)
            </span>
            <div className="text-sm font-bold text-white">Pemisahan Tanggung Jawab Organ & Perseroan</div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {part?.corporateAnalysis || 'Apabila ada deviasi teknis pengadaan, hal tersebut merupakan pertanggungjawaban kontraktual konsorsium korporasi, bukan tindak pidana perorangan direksi.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // PCA-010: Criminal Defense & Grounds for Exclusion
  if (normalizedStage === 'pca-010') {
    const def = caseData.pcaDefenseExclusion;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-010
                </span>
                <h3 className="text-sm font-bold text-white">Criminal Defense & Grounds for Exclusion (Alasan Penghapus Pidana)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Alasan Pembenar (Rechtvaardigingsgrond: Ps 49-51 KUHP) dan Alasan Pemaaf (Schulduitsluitingsgrond: Ps 48 KUHP Overmacht & Geen Straf Zonder Schuld).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Alasan Pembenar (Rechtvaardigingsgrond)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Pasal 50 KUHP
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">{def?.rechtvaardigingsgrond?.type || 'Menjalankan Peraturan UU (Ps 50)'}</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {def?.rechtvaardigingsgrond?.argument || 'Tindakan Terdakwa adalah pemenuhan kewajiban dinas percepatan transformasi digital daerah 3T berdasarkan Perpres Percepatan Akses Internet.'}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
                Alasan Pemaaf (Schulduitsluitingsgrond)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Pasal 48 KUHP
              </span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">{def?.schulduitsluitingsgrond?.type || 'Daya Paksa / Overmacht (Ps 48)'}</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {def?.schulduitsluitingsgrond?.argument || 'Terjadinya eskalasi konflik keamanan bersenjata di lokasi proyek merupakan keadaan daya paksa (overmacht) yang membenarkan penyesuaian addendum.'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Kesimpulan Yuridis Pembelaan (Vrijspraak vs Onslag)
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-sans">
            {def?.defenseConclusion || 'Terdapat alasan penghapus pidana pembenar (Pasal 50 KUHP) dan pemaaf daya paksa (Pasal 48 KUHP), sehingga Terdakwa wajib diputus LEPAS DARI SEGALA TUNTUTAN HUKUM (Onslag van alle rechtsvervolging).'}
          </p>
        </div>
      </div>
    );
  }

  // PCA-011: Indictment Stress-Test & Eksepsi 156 KUHAP
  if (normalizedStage === 'pca-011') {
    const eksepsi = caseData.pcaIndictmentStressTest;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-011
                </span>
                <h3 className="text-sm font-bold text-white">Indictment Stress-Test & Eksepsi 156 KUHAP (Uji Keberatan Surat Dakwaan)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Uji syarat materiil Pasal 143 ayat (2) KUHAP: Cermat, Jelas, Lengkap; deteksi cacat Obscuur Libel, Nebis in Idem, dan Daluwarsa.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleGeneratePledoi(true)}
            disabled={isLoadingPledoi}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoadingPledoi ? 'Menyusun Eksepsi...' : 'Draf Nota Keberatan (Eksepsi 156)'}</span>
          </button>
        </div>

        {/* Formal Defects Detected */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
            Cacat Formil & Materiil Surat Dakwaan (Pasal 143 ayat 3 KUHAP &rarr; Batal Demi Hukum)
          </h4>
          <div className="space-y-2">
            {(eksepsi?.formalDefects || [
              'Surat Dakwaan tidak menguraikan secara cermat dan jelas perbuatan materiil masing-masing terdakwa (Obscuur Libel).',
              'Pertentangan logika antara posita dakwaan primer (memperkaya diri) dengan uraian fakta BAP yang menyatakan tidak ada aliran dana.'
            ]).map((defect, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/30 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-relaxed">{defect}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Eksepsi Recommendations */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Rekomendasi Petitum Putusan Sela</h4>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans">
            {eksepsi?.obscuurLibelAnalysis || 'Surat Dakwaan Penuntut Umum Nomor Reg. Perkara PDS-04/JKT/2026 dinyatakan BATAL DEMI HUKUM (Null and Void) karena tidak memenuhi syarat materiil Pasal 143 ayat (2) huruf b KUHAP, dan memerintahkan Terdakwa segera dikeluarkan dari tahanan.'}
          </p>
        </div>
      </div>
    );
  }

  // PCA-012: Cross-Examination Simulator & Saksi A De Charge
  if (normalizedStage === 'pca-012') {
    const cross = caseData.pcaCrossExaminationSimulator;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-012
                </span>
                <h3 className="text-sm font-bold text-white">Cross-Examination Simulator & Saksi A De Charge (Uji Silang Saksi Sidang)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar pertanyaan jebakan (trapping questions) pembongkar kontradiksi BAP saksi JPU dan panduan pemeriksaan saksi meringankan.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunCrossExam}
            disabled={isLoadingCrossExam}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoadingCrossExam ? 'Menyusun Uji Silang...' : 'Simulasi Uji Silang BAP (AI)'}</span>
          </button>
        </div>

        {/* Witness Trapping Questions */}
        <div className="space-y-4">
          {(cross?.witnessQuestions || [
            {
              witnessName: "Kompol Dimas Arya, S.I.K. (Penyidik BAP)",
              witnessRole: "Saksi BAP Penyidik",
              targetedContradiction: "Kepastian ada/tidaknya audit kerugian negara BPK RI saat penetapan Tersangka diterbitkan.",
              trappingQuestions: [
                "Apakah pada tanggal 04 Maret 2026 saat penetapan Tersangka diterbitkan, audit investigatif BPK sudah selesai?",
                "Dari mana penyidik menyimpulkan angka Rp 18,4 miliar jika audit BPK belum diserahkan?",
                "Apakah penyidik pernah turun langsung memeriksa apakah tiang menara BTS telah memancarkan sinyal aktif?"
              ],
              expectedTrapGoal: "Membuat penyidik mengakui bahwa penetapan Tersangka dilakukan tanpa menunggu hasil audit kerugian riil dan tanpa verifikasi fisik operasional."
            }
          ]).map((wq, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">{wq.witnessName}</div>
                  <span className="text-[10px] font-mono text-rose-400">{wq.witnessRole}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                  Target: {wq.targetedContradiction}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">Pertanyaan Menjebak Berurutan:</span>
                {wq.trappingQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {qIdx + 1}
                    </span>
                    <span className="text-xs text-slate-200 leading-relaxed font-sans">{q}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs text-rose-300">
                <span className="font-bold">Tujuan Pengakuan:</span> {wq.expectedTrapGoal}
              </div>
            </div>
          ))}
        </div>

        {/* Saksi Meringankan (A De Charge) Strategy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
            Panduan Saksi Ahli & Saksi Meringankan (A De Charge)
          </h4>
          {(cross?.aDeChargeStrategy || [
            {
              witnessCategory: "Ahli Hukum Pidana Materiil",
              testimonyGoal: "Menerangkan bahwa keterlambatan kontraktual adalah ranah perdata (wanprestasi) yang tidak dapat dikriminalisasi tanpa bukti kickback/mens rea.",
              keyQuestions: [
                "Apakah addendum kontrak yang disepakati para pihak dapat dikualifikasikan sebagai perbuatan melawan hukum pidana?",
                "Bagaimana implikasi Putusan MK No. 25/PUU-XIV/2016 terhadap metode perhitungan kerugian negara total loss?"
              ]
            }
          ]).map((ad, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">{ad.witnessCategory}</div>
              <p className="text-xs text-slate-300">{ad.testimonyGoal}</p>
              <div className="space-y-1.5 pt-1">
                {ad.keyQuestions.map((kq, kIdx) => (
                  <div key={kIdx} className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{kq}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PCA-013: Sentencing Exposure & Restorative Justice
  if (normalizedStage === 'pca-013') {
    const sent = caseData.pcaSentencingMatrix;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-013
                </span>
                <h3 className="text-sm font-bold text-white">Sentencing Exposure & Restorative Justice (Matriks Ancaman Pidana & RJ)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kalkulasi ancaman sanksi pidana pokok, pidana tambahan (uang pengganti Pasal 18 UU Tipikor), risiko perampasan aset TPPU, dan asas oportunitas.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Ancaman Pidana Penjara</span>
            <div className="text-sm font-bold text-rose-400">Min 4 Thn - Max 20 Thn</div>
            <span className="text-[10px] text-slate-500">Bisa turun ke 2 thn via KUHP Baru</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Uang Pengganti (Pasal 18)</span>
            <div className="text-sm font-bold text-amber-400">{sent?.restitutionOrStateLoss || 'Rp 18.400.000.000'}</div>
            <span className="text-[10px] text-slate-500">Tertolak bila fisik 100% terwujud</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Restorative Justice (RJ)</span>
            <div className="text-sm font-bold text-slate-300">{sent?.restorativeJusticeViability || 'Tidak Memenuhi Syarat'}</div>
            <span className="text-[10px] text-slate-500">Khusus delik tipikor / kejahatan serius</span>
          </div>
        </div>

        {/* Mitigating vs Aggravating Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Hal-Hal Yang Meringankan (Mitigating Circumstances)
            </span>
            <div className="space-y-2">
              {(sent?.mitigatingCircumstances || [
                'Terdakwa belum pernah dihukum pidana.',
                'Terdakwa telah mengabdi lebih dari 25 tahun sebagai insinyur telekomunikasi nasional.',
                'Infrastruktur BTS yang dibangun kini dinikmati oleh ratusan ribu masyarakat terisolir.'
              ]).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  ✓ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
              Hal-Hal Yang Memberatkan (Aggravating Circumstances)
            </span>
            <div className="space-y-2">
              {(sent?.aggravatingCircumstances || [
                'Perhatian dan sorotan media publik atas proyek pengadaan infrastruktur digital nasional.'
              ]).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                  ! {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PCA-014: Tactical Defense Roadmap
  if (normalizedStage === 'pca-014') {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-014
                </span>
                <h3 className="text-sm font-bold text-white">Tactical Defense Roadmap (Roadmap Pembelaan Litigasi Pidana)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Perencanaan taktis berjenjang: Upaya Praperadilan &rarr; Eksepsi Dakwaan 156 &rarr; Pembuktian Saksi/Ahli &rarr; Requisitoir &rarr; Pledoi &rarr; Vonis.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenJudicialSim}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold text-xs flex items-center gap-2 border border-slate-700"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulasi Uji Majelis Hakim Tipikor</span>
          </button>
        </div>

        {/* 5-Phase Criminal Defense Pipeline */}
        <div className="space-y-3">
          {[
            {
              phase: "Fase 1: Uji Praperadilan (Keabsahan Penetapan TSK)",
              timing: "Sebelum Pembacaan Dakwaan Dimulai",
              action: "Daftarkan permohonan Praperadilan atas dasar ketiadaan audit PKN BPK RI (MK 21/2014) untuk membatalkan status Tersangka.",
              mitigation: "Koordinasi agar perkara pokok tidak tergesa-gesa dilimpahkan penuntut umum."
            },
            {
              phase: "Fase 2: Eksepsi / Keberatan (Pasal 156 ayat 1 KUHAP)",
              timing: "Sidang Ke-2 Pasca Dakwaan",
              action: "Ajukan Eksepsi Surat Dakwaan Batal Demi Hukum atas dasar Obscuur Libel dan pencampuradukan tanggung jawab korporasi ke perorangan.",
              mitigation: "Siapkan dalil replik/duplik putusan sela yang kokoh."
            },
            {
              phase: "Fase 3: Pembuktian Saksi Mahkota & Uji Silang Forensik",
              timing: "Tahap Pembuktian (Pemeriksaan Saksi)",
              action: "Lakukan cross-examination agresif terhadap penyidik verbalisan dan hadirkan saksi ahli pidana ITB & BPK pembanding.",
              mitigation: "Buktikan fisik menara BTS aktif 100% dan tiadanya kickback LHA PPATK."
            },
            {
              phase: "Fase 4: Nota Pembelaan (Pledoi)",
              timing: "Pasca Pembacaan Tuntutan (Requisitoir)",
              action: "Susun Master Pledoi 7 Bab dengan tuntutan Putusan Bebas Murni (Vrijspraak) atau Lepas dari Segala Tuntutan (Onslag).",
              mitigation: "Kemukakan alasan pembenar Pasal 50 KUHP dan daya paksa Pasal 48 KUHP."
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
              <span className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{item.phase}</span>
                  <span className="text-[10px] font-mono text-slate-400">({item.timing})</span>
                </div>
                <p className="text-xs text-slate-300">{item.action}</p>
                <div className="text-[10px] font-mono text-amber-400">Mitigasi: {item.mitigation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // PCA-015: Master Pledoi & Criminal Defense Dossier
  if (normalizedStage === 'pca-015') {
    const pledoi = caseData.pcaPledoiDossier;

    return (
      <div className="space-y-6">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <Gavel className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30">
                  SOP PCA-015
                </span>
                <h3 className="text-sm font-bold text-white">Master Pledoi Compiler & Final Criminal Dossier (Nota Pembelaan Akhir)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kompilasi master seluruh 15 tahapan SOP PCA menjadi dokumen Nota Pembelaan (Pledoi) resmi siap dibacakan di muka Majelis Hakim.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGeneratePledoi(false)}
              disabled={isLoadingPledoi}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoadingPledoi ? 'Menyusun Master Pledoi...' : 'Generate Master Pledoi (AI)'}</span>
            </button>
          </div>
        </div>

        {/* Pledoi Preview & Target */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white">
                {pledoi?.pledoiTitle || 'NOTA PEMBELAAN (PLEDOI): PEMBEBASAN MURNI ATAS TUNTUTAN PIDANA'}
              </h4>
              <p className="text-xs text-slate-400">Ref: {caseData.refNumber} | Terdakwa: {caseData.client}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              Target: {pledoi?.defenseTarget || 'Vrijspraak (Bebas Murni)'}
            </span>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans max-h-96 overflow-y-auto space-y-3 whitespace-pre-line">
            {pledoi?.pledoiText || `MAJELIS HAKIM YANG MULIA,
JAKSA PENUNTUT UMUM YANG KAMI HORMATI,

Lebih baik membebaskan 100 orang bersalah daripada menghukum 1 orang yang tidak bersalah (In Dubio Pro Reo). Berdasarkan seluruh fakta persidangan, terbukti secara sah dan meyakinkan bahwa Terdakwa ${caseData.client} tidak memiliki niat jahat, tidak menerima suap sepeserpun, dan seluruh pekerjaan pengadaan telah diselesaikan 100% serta memberikan manfaat nyata bagi rakyat.

Oleh karena itu, kami memohon Majelis Hakim yang Mulia memutus Terdakwa BEBAS MURNI (Vrijspraak) atau setidak-tidaknya DILEPASKAN DARI SEGALA TUNTUTAN HUKUM (Onslag van alle rechtsvervolging).`}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                navigator.clipboard.writeText(pledoi?.pledoiText || '');
                setCopiedPledoi(true);
                setTimeout(() => setCopiedPledoi(false), 2000);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700"
            >
              {copiedPledoi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPledoi ? 'Tersalin ke Clipboard!' : 'Salin Teks Pledoi'}</span>
            </button>

            <button
              onClick={onOpenLegalDrafter}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20"
            >
              <span>Ekspor Dokumen ke Format Word / PDF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-slate-400 text-sm p-4">Tahap SOP Pidana tidak ditemukan.</div>;
};
