import React from 'react';
import { 
  FolderPlus, 
  Users, 
  FileText, 
  Calendar, 
  FileSignature, 
  Layers, 
  HelpCircle, 
  BookOpen, 
  Swords, 
  Scale, 
  Calculator, 
  ShieldAlert, 
  AlertTriangle, 
  Compass, 
  Award,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Search,
  Crosshair,
  Lock,
  Flame,
  FileCheck,
  Eye,
  Gavel
} from 'lucide-react';
import { LegalCase } from '../types';

export interface WorkflowStage {
  code: string;
  key: string;
  name: string;
  category: string;
  description: string;
  icon: React.ElementType;
}

export const LCA_STAGES: WorkflowStage[] = [
  { code: 'LCA-001', key: 'intake', name: 'Case Intake & Scoping', category: 'Inisiasi & Pihak', description: 'Pendaftaran perkara & identifikasi tujuan analisis hukum', icon: FolderPlus },
  { code: 'LCA-002', key: 'parties', name: 'Party Mapping Engine', category: 'Inisiasi & Pihak', description: 'Pemetaan subjek hukum, relasi, dan potensi konflik kepentingan', icon: Users },
  { code: 'LCA-003', key: 'facts', name: 'Fact Extraction Tool', category: 'Fakta & Bukti', description: 'Ekstraksi fakta murni, klaim sepihak, dan fakta sengketa', icon: FileText },
  { code: 'LCA-004', key: 'chronology', name: 'Chronology Builder', category: 'Fakta & Bukti', description: 'Linimasa urutan waktu kronologis peristiwa hukum', icon: Calendar },
  { code: 'LCA-005', key: 'contracts', name: 'Contract Reconstruction', category: 'Fakta & Bukti', description: 'Rekonstruksi klausul perjanjian, PO/WO, BAST & wanprestasi', icon: FileSignature },
  { code: 'LCA-006', key: 'evidence', name: 'Evidence Matrix Table', category: 'Fakta & Bukti', description: 'Matriks pembuktian: relasi fakta dengan alat bukti surat/saksi', icon: Layers },
  { code: 'LCA-007', key: 'issues', name: 'Issue Spotting Engine', category: 'Isu & Riset', description: 'Perumusan isu hukum utama & identifikasi unknown issues', icon: HelpCircle },
  { code: 'LCA-008', key: 'research', name: 'Legal Research Repository', category: 'Isu & Riset', description: 'Dasar hukum KUHPerdata, UU terkait, dan yurisprudensi MA', icon: BookOpen },
  { code: 'LCA-009', key: 'arguments', name: 'Argument Mapping Tool', category: 'Argumen & Tanggung Jawab', description: 'Peta argumentasi: Posita Klien vs Eksepsi/Bantahan Tergugat', icon: Swords },
  { code: 'LCA-010', key: 'liability', name: 'Liability Assessment', category: 'Argumen & Tanggung Jawab', description: 'Uji terpenuhinya unsur PMH (1365) atau cidera janji (1243)', icon: Scale },
  { code: 'LCA-011', key: 'quantum', name: 'Quantum of Damages', category: 'Kerugian & Risiko', description: 'Kalkulator matematis: Pokok, Denda, Bunga Legal 6% & Imateril', icon: Calculator },
  { code: 'LCA-012', key: 'risks', name: 'Risk Assessment Matrix', category: 'Kerugian & Risiko', description: 'Evaluasi probabilitas kemenangan (win rate) & mitigasi risiko', icon: ShieldAlert },
  { code: 'LCA-013', key: 'gaps', name: 'Evidence Gap Detector', category: 'Kerugian & Risiko', description: 'Deteksi kekurangan alat bukti krusial & action plan pemenuhan', icon: AlertTriangle },
  { code: 'LCA-014', key: 'strategy', name: 'Case Strategy Planner', category: 'Strategi & Laporan', description: 'Rencana taktis: Jalur Somasi, Gugatan PN, PKPU Niaga, atau Arbitrase', icon: Compass },
  { code: 'LCA-015', key: 'report', name: 'Final Intelligence Report', category: 'Strategi & Laporan', description: 'Laporan intelijen hukum komprehensif 12 bab siap eksekusi', icon: Award },
];

export const PCA_STAGES: WorkflowStage[] = [
  { code: 'PCA-001', key: 'pca-001', name: 'Criminal Intake & Scoping', category: 'Due Process & Prosedur', description: 'Audit LP, Sprindik, SPDP, Surat Dakwaan & Delik Pokok', icon: FolderPlus },
  { code: 'PCA-002', key: 'pca-002', name: 'Criminal Party & Suspect Mapping', category: 'Due Process & Prosedur', description: 'Pemetaan Terdakwa, JPU, Penyidik, Saksi Mahkota & A De Charge', icon: Users },
  { code: 'PCA-003', key: 'pca-003', name: 'Due Process & Praperadilan Audit', category: 'Due Process & Prosedur', description: 'Uji Keabsahan Penetapan TSK (MK 21/2014), Sita & Geledah', icon: ShieldCheck },
  { code: 'PCA-004', key: 'pca-004', name: 'Modus Operandi & Fact Extraction', category: 'Fakta & Bukti Pidana', description: 'Ekstraksi locus & tempus delicti, fakta material & sanggahan', icon: FileText },
  { code: 'PCA-005', key: 'pca-005', name: 'Chronology & Alibi Reconstruction', category: 'Fakta & Bukti Pidana', description: 'Linimasa per menit, pengujian alibi & jejak digital seluler', icon: Calendar },
  { code: 'PCA-006', key: 'pca-006', name: 'Evidence Matrix (Pasal 184 KUHAP)', category: 'Fakta & Bukti Pidana', description: 'Matriks Saksi, Ahli, Surat, Petunjuk, & Bukti Elektronik UU ITE', icon: Layers },
  { code: 'PCA-007', key: 'pca-007', name: 'Dual Penal Code & Special Crime', category: 'Konstruksi Hukum & Delik', description: 'Komparasi KUHP Baru UU 1/2023 vs WvS & Tipikor/TPPU (Lex Favor Reo)', icon: BookOpen },
  { code: 'PCA-008', key: 'pca-008', name: 'Elements of Crime Deconstruction', category: 'Konstruksi Hukum & Delik', description: 'Bedah Actus Reus, Mens Rea (Dolus vs Culpa) & Kausalitas', icon: Crosshair },
  { code: 'PCA-009', key: 'pca-009', name: 'Participation & Corporate Liability', category: 'Konstruksi Hukum & Delik', description: 'Ajaran Penyertaan (55-56 KUHP) & Doktrin Korporasi Perma 13/2016', icon: Scale },
  { code: 'PCA-010', key: 'pca-010', name: 'Criminal Defense & Grounds for Exclusion', category: 'Pembelaan & Eksepsi', description: 'Alasan Pembenar & Pemaaf: Noodweer, Overmacht (Ps 48-51 KUHP)', icon: Lock },
  { code: 'PCA-011', key: 'pca-011', name: 'Indictment Stress-Test & Eksepsi 156', category: 'Pembelaan & Eksepsi', description: 'Uji Syarat Pasal 143 KUHAP, Obscuur Libel & Draf Eksepsi', icon: FileCheck },
  { code: 'PCA-012', key: 'pca-012', name: 'Cross-Examination Simulator', category: 'Persidangan & Pembuktian', description: 'Simulator uji silang saksi BAP JPU & Panduan Saksi A De Charge', icon: Eye },
  { code: 'PCA-013', key: 'pca-013', name: 'Sentencing & Restorative Justice', category: 'Persidangan & Pembuktian', description: 'Matriks ancaman sanksi pokok/pengganti & kelayakan Restorative Justice', icon: Calculator },
  { code: 'PCA-014', key: 'pca-014', name: 'Tactical Defense Roadmap', category: 'Strategi & Pledoi', description: 'Roadmap pembelaan: Praperadilan -> Eksepsi -> Sidang -> Pledoi', icon: Compass },
  { code: 'PCA-015', key: 'pca-015', name: 'Master Pledoi & Intelligence Dossier', category: 'Strategi & Pledoi', description: 'Draf Nota Pembelaan (Pledoi) Bebas (Vrijspraak)/Lepas (Onslag)', icon: Gavel },
];

interface LCADocketSidebarProps {
  activeStageKey?: string;
  currentStage?: string;
  onSelectStage: (stageKey: string) => void;
  caseData?: LegalCase;
  completedStages?: string[];
}

export const LCADocketSidebar: React.FC<LCADocketSidebarProps> = ({
  activeStageKey,
  currentStage,
  onSelectStage,
  caseData,
  completedStages,
}) => {
  const isCriminal = 
    caseData?.methodology === 'PCA' || 
    (caseData?.caseType || '').toLowerCase().includes('pidana') ||
    (completedStages || []).some(s => s.startsWith('PCA-')) ||
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
    ].some(t => (caseData?.caseType || '').includes(t));

  const currentStages = isCriminal ? PCA_STAGES : LCA_STAGES;
  const effectiveActiveStage = activeStageKey || currentStage || (isCriminal ? 'PCA-001' : 'LCA-001');

  // Calculate completion per stage
  const getStageCompletion = (stageKey: string, stageCode?: string): boolean => {
    // If completedStages list is explicitly provided, honor it
    if (completedStages && completedStages.length > 0) {
      if (
        completedStages.includes(stageKey) || 
        completedStages.includes(stageKey.toUpperCase()) ||
        (stageCode && completedStages.includes(stageCode))
      ) {
        return true;
      }
    }

    if (!caseData) return false;

    // PCA stages
    if (isCriminal) {
      switch (stageKey) {
        case 'pca-001': return !!caseData?.title && !!caseData?.client;
        case 'pca-002': return (caseData?.parties?.length || 0) >= 2;
        case 'pca-003': return !!caseData?.pcaDueProcessAudit;
        case 'pca-004': return (caseData?.facts?.length || 0) > 0;
        case 'pca-005': return (caseData?.timeline?.length || 0) > 0;
        case 'pca-006': return (caseData?.evidenceMatrix?.length || 0) > 0;
        case 'pca-007': return (caseData?.statutes?.length || 0) > 0;
        case 'pca-008': return !!caseData?.pcaElementsDeconstruction;
        case 'pca-009': return !!caseData?.pcaParticipationCorporate;
        case 'pca-010': return !!caseData?.pcaDefenseExclusion;
        case 'pca-011': return !!caseData?.pcaIndictmentStressTest;
        case 'pca-012': return !!caseData?.pcaCrossExaminationSimulator;
        case 'pca-013': return !!caseData?.pcaSentencingMatrix;
        case 'pca-014': return !!caseData?.riskMatrix || (caseData?.claims?.length || 0) > 0;
        case 'pca-015': return !!caseData?.pcaPledoiDossier || !!caseData?.finalReportText;
        default: return false;
      }
    }

    // LCA stages
    switch (stageKey) {
      case 'intake': return !!caseData?.title && !!caseData?.client;
      case 'parties': return (caseData?.parties?.length || 0) >= 2;
      case 'facts': return (caseData?.facts?.length || 0) > 0;
      case 'chronology': return (caseData?.timeline?.length || 0) > 0;
      case 'contracts': return !!caseData?.contractReconstruction || !!caseData?.contractDate;
      case 'evidence': return (caseData?.evidenceMatrix?.length || 0) > 0;
      case 'issues': return (caseData?.claims?.length || 0) > 0;
      case 'research': return (caseData?.statutes?.length || 0) > 0;
      case 'arguments': return (caseData?.symmetricArguments?.length || 0) > 0;
      case 'liability': return !!caseData?.riskMatrix;
      case 'quantum': return !!caseData?.claimAmount || !!caseData?.quantumCalculation;
      case 'risks': return !!caseData?.riskMatrix;
      case 'gaps': return (caseData?.evidenceGaps?.length || 0) > 0;
      case 'strategy': return !!caseData?.strategyPlan;
      case 'report': return !!caseData?.executiveSummary || !!caseData?.finalReportText;
      default: return false;
    }
  };

  const completedCount = currentStages.filter(s => getStageCompletion(s.key, s.code)).length;
  const progressPercent = Math.round((completedCount / currentStages.length) * 100);

  return (
    <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0 select-none">
      
      {/* Docket Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isCriminal ? 'bg-rose-400' : 'bg-amber-400'} animate-pulse`}></span>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {isCriminal ? 'SOP PCA-001 s.d. PCA-015' : 'SOP LCA-001 s.d. LCA-015'}
            </h4>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            isCriminal 
              ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
              : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
          }`}>
            {isCriminal ? 'MODE PIDANA (PCA)' : 'MODE PERDATA (LCA)'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
          <span>{isCriminal ? 'Penal Case Analyst' : 'Legal Case Analyst'}</span>
          <span className={isCriminal ? 'text-rose-400 font-bold' : 'text-amber-400 font-bold'}>
            {completedCount}/15 Tahap ({progressPercent}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${
              isCriminal 
                ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400' 
                : 'bg-gradient-to-r from-amber-500 to-amber-300'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stages List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {currentStages.map((stage) => {
          const Icon = stage.icon;
          // Match by key or code
          const isActive = 
            effectiveActiveStage === stage.key || 
            effectiveActiveStage === stage.code ||
            (stage.key === 'pca-001' && (effectiveActiveStage === 'PCA-001' || effectiveActiveStage === 'LCA-001')) ||
            (stage.key === 'intake' && (effectiveActiveStage === 'LCA-001' || effectiveActiveStage === 'intake'));

          const isDone = getStageCompletion(stage.key, stage.code);

          return (
            <button
              key={stage.key}
              onClick={() => onSelectStage(stage.key)}
              className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between group ${
                isActive
                  ? isCriminal
                    ? 'bg-rose-500/15 border border-rose-500/40 text-white shadow-sm'
                    : 'bg-amber-500/15 border border-amber-500/40 text-white shadow-sm'
                  : 'hover:bg-slate-900 border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive
                    ? isCriminal ? 'bg-rose-500 text-white font-bold' : 'bg-amber-500 text-slate-950 font-bold'
                    : isDone
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-semibold ${isCriminal ? 'text-rose-400' : 'text-amber-400'}`}>
                      {stage.code}
                    </span>
                    <span className={`text-xs font-semibold truncate ${
                      isActive 
                        ? isCriminal ? 'text-rose-200 font-bold' : 'text-amber-300 font-bold' 
                        : 'text-slate-200'
                    }`}>
                      {stage.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {stage.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 ml-1.5">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-600 transition-transform ${
                    isActive 
                      ? isCriminal ? 'translate-x-0.5 text-rose-400' : 'translate-x-0.5 text-amber-400' 
                      : 'group-hover:text-slate-400'
                  }`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
