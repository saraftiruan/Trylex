import React, { useState } from 'react';
import { 
  Scale, 
  Layers, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  GitMerge, 
  FileCheck2, 
  MessageSquare, 
  Share2, 
  Download, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Clock, 
  Sparkles, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Lock, 
  Eye, 
  FileCode, 
  Copy, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Send,
  Check,
  X,
  FileSpreadsheet,
  Database
} from 'lucide-react';
import { 
  LegalCase, 
  UserProfile, 
  CaseDocument, 
  LegalFact, 
  EvidenceItem, 
  CaseComment,
  LCACategory
} from '../types';
import { TraceabilityGraph } from './TraceabilityGraph';
import { EvidenceUploadDropzone } from './EvidenceUploadDropzone';
import { AILegalDrafterModal } from './AILegalDrafterModal';
import { AIJudicialSimulatorModal } from './AIJudicialSimulatorModal';
import { LCADocketSidebar } from './LCADocketSidebar';
import { ContractReconstructionView } from './ContractReconstructionView';
import { ArgumentMappingView } from './ArgumentMappingView';
import { QuantumCalculatorView } from './QuantumCalculatorView';
import { CaseStrategyView } from './CaseStrategyView';
import { FinalReportModal } from './FinalReportModal';
import { LCASOPStageRenderer } from './LCASOPStageRenderer';
import { PCASOPStageRenderer } from './PCASOPStageRenderer';
import { VisualDocumentTimeline } from './VisualDocumentTimeline';
import { JDIHLegalSearchModal } from './JDIHLegalSearchModal';

interface CaseDetailViewProps {
  caseData: LegalCase;
  currentUser: UserProfile;
  onUpdateCase: (updated: LegalCase) => void;
  onBackToDashboard: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  caseData,
  currentUser,
  onUpdateCase,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'readiness' | 'pipeline' | 'report' | 'review' | 'export'>('overview');
  
  // Pipeline State
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [currentAgentStage, setCurrentAgentStage] = useState<number>(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // New Document Upload Simulation State
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<CaseDocument['category']>('Kontrak/Perjanjian');
  const [newDocText, setNewDocText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isOpenDropzoneModal, setIsOpenDropzoneModal] = useState(false);
  const [showManualUploadForm, setShowManualUploadForm] = useState(false);

  // LCA-001 to LCA-015 / PCA-001 to PCA-015 Workflow State
  const [viewMode, setViewMode] = useState<'sop_workflow' | 'classic_tabs'>('sop_workflow');
  const [activeLCAStage, setActiveLCAStage] = useState<string>(
    caseData?.currentSOPStage || (caseData?.methodology === 'PCA' ? 'PCA-001' : 'LCA-001')
  );
  const [isOpenFinalReportModal, setIsOpenFinalReportModal] = useState(false);

  // AI Legal Drafter, Judicial Simulator, and JDIH Search Modals
  const [isOpenLegalDrafterModal, setIsOpenLegalDrafterModal] = useState(false);
  const [isOpenJudicialSimulatorModal, setIsOpenJudicialSimulatorModal] = useState(false);
  const [isOpenJDIHModal, setIsOpenJDIHModal] = useState(false);

  const handleSaveDraftDocument = (newDoc: CaseDocument) => {
    const updatedDocs = [newDoc, ...(caseData.documents || [])];
    onUpdateCase({
      ...caseData,
      documents: updatedDocs,
      updatedAt: new Date().toISOString(),
    });
  };

  // Comment State
  const [newCommentText, setNewCommentText] = useState('');
  const [commentTargetType, setCommentTargetType] = useState<CaseComment['targetType']>('general');
  const [commentTargetId, setCommentTargetId] = useState<string>('');

  // Export State
  const [exportIncludeWatermark, setExportIncludeWatermark] = useState(true);
  const [exportIncludeNotes, setExportIncludeNotes] = useState(true);
  const [exportIncludeRawFacts, setExportIncludeRawFacts] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // Role permissions check
  const canRunAnalysis = ['Admin', 'Lead Counsel', 'Analyst', 'Reviewer'].includes(currentUser.role);
  const canApprove = ['Admin', 'Lead Counsel', 'Reviewer'].includes(currentUser.role);
  const canUpload = ['Admin', 'Lead Counsel', 'Analyst'].includes(currentUser.role);

  // Preflight Readiness Calculations
  const hasDocuments = (caseData?.documents || []).length >= 2;
  const hasIncidentDate = !!caseData?.incidentDate;
  const hasParties = (caseData?.parties || []).length >= 2;
  const hasClaims = (caseData?.claims || []).length >= 1;
  const hasJurisdiction = !!caseData?.jurisdiction;
  const noFailedDocs = !(caseData?.documents || []).some(d => d.status === 'Failed' || d.status === 'Needs review');
  
  const checklistItems = [
    { label: 'Material Perkara & Dokumen Tersedia (Min 2 Berkas)', passed: hasDocuments },
    { label: 'Identitas Para Pihak Teridentifikasi (Penggugat & Tergugat)', passed: hasParties },
    { label: 'Klaim Utama & Petitum Ganti Rugi Terdefinisi', passed: hasClaims },
    { label: 'Tanggal Kejadian / Kronologi Waktu Tersedia', passed: hasIncidentDate },
    { label: 'Yurisdiksi & Forum Penyelesaian Terkonfirmasi', passed: hasJurisdiction },
    { label: 'Semua Dokumen Lolos Uji OCR & Redaksi PII', passed: noFailedDocs },
  ];

  const passedChecksCount = checklistItems.filter(i => i.passed).length;
  const readinessScore = Math.round((passedChecksCount / checklistItems.length) * 100);

  // Handler: Run ULPE-AW / PCA Analysis Pipeline
  const handleRunAnalysis = async () => {
    if (!canRunAnalysis) return;
    setIsRunningPipeline(true);
    setAnalysisError(null);
    const isCriminal = caseData?.methodology === 'PCA';
    setPipelineLogs([
      isCriminal 
        ? `[PCA-INIT] Memulai Penal Case Analysis (PCA Master Intelligence) untuk perkara ${caseData?.refNumber || 'Aktif'}`
        : `[INIT] Memulai ULPE-AW Pipeline untuk perkara ${caseData?.refNumber || 'Aktif'}`
    ]);
    setCurrentAgentStage(1);

    try {
      if (isCriminal) {
        // PCA Multi-Agent Workflow
        setPipelineLogs(prev => [...prev, '[PCA-AGENT 1] Forensic Chronology & Intake: Memetakan berkas LP, SPDP, dan locus-tempus...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(2);

        setPipelineLogs(prev => [...prev, '[PCA-AGENT 2] Due Process Auditor: Menguji legalitas formil penetapan Tersangka & MK 21/2014...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(3);

        setPipelineLogs(prev => [...prev, '[PCA-AGENT 3] Element Delik Engine: Mendekonstruksi Actus Reus, Mens Rea & Causal Chain...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(4);

        setPipelineLogs(prev => [...prev, '[PCA-AGENT 4] Dual Penal Code Comparative: Komparasi WvS vs UU 1/2023 & UU Pidana Khusus...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(5);

        setPipelineLogs(prev => [...prev, '[PCA-AGENT 5] Defense Synthesis: Menyusun strategi Eksepsi, Saksi Mahkota, dan Kerangka Pledoi...']);
      } else {
        // LCA Multi-Agent Workflow
        setPipelineLogs(prev => [...prev, '[AGENT-1] Case Mapper: Mengurai 14 fakta, 3 pihak, dan isolasi kronologi peristiwa...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(2);

        setPipelineLogs(prev => [...prev, '[AGENT-2] Legal Classifier: Mengidentifikasi lapisan norma KUHPerdata, UU Khusus, dan yurisprudensi...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(3);

        setPipelineLogs(prev => [...prev, '[AGENT-3] Legal Research Agent: Memverifikasi validitas pasal dan ketentuan transisi regulasi...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(4);

        setPipelineLogs(prev => [...prev, '[AGENT-4] Evidence Agent: Membangun Evidence Matrix dan mendeteksi celah pembuktian (Evidence Gaps)...']);
        await new Promise(r => setTimeout(r, 700));
        setCurrentAgentStage(5);

        setPipelineLogs(prev => [...prev, '[AGENT-5] Argument Agent: Menjalankan uji stres simetris dan menyambungkan rantai Traceability...']);
      }

      // Call Backend API
      const res = await fetch('/api/gemini/analyze-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData,
          documents: caseData.documents,
        }),
      });

      const data = await res.json();

      if (data.success && data.analysis) {
        const aiAnalysis = data.analysis;
        const updatedCase: LegalCase = {
          ...caseData,
          status: 'In Review',
          executiveSummary: aiAnalysis.executiveSummary || caseData.executiveSummary,
          facts: aiAnalysis.facts?.length ? aiAnalysis.facts : caseData.facts,
          legalLayers: aiAnalysis.legalLayers?.length ? aiAnalysis.legalLayers : caseData.legalLayers,
          statutes: aiAnalysis.statutes?.length ? aiAnalysis.statutes : caseData.statutes,
          evidenceMatrix: aiAnalysis.evidenceMatrix?.length ? aiAnalysis.evidenceMatrix : caseData.evidenceMatrix,
          evidenceGaps: aiAnalysis.evidenceGaps?.length ? aiAnalysis.evidenceGaps : caseData.evidenceGaps,
          symmetricArguments: aiAnalysis.argumentsSymmetric?.length ? aiAnalysis.argumentsSymmetric : caseData.symmetricArguments,
          traceability: aiAnalysis.traceability?.length ? aiAnalysis.traceability : caseData.traceability,
          riskMatrix: aiAnalysis.riskMatrix || caseData.riskMatrix,
          verificationGate: aiAnalysis.verificationGate || caseData.verificationGate,
          // Support criminal specific fields if present
          pcaDueProcessAudit: aiAnalysis.pcaDueProcessAudit || caseData.pcaDueProcessAudit,
          pcaElementsDeconstruction: aiAnalysis.pcaElementsDeconstruction || caseData.pcaElementsDeconstruction,
          pcaSentencingMatrix: aiAnalysis.pcaSentencingMatrix || caseData.pcaSentencingMatrix,
          updatedAt: new Date().toISOString(),
        };
        onUpdateCase(updatedCase);
        setPipelineLogs(prev => [
          ...prev, 
          isCriminal 
            ? '[SUCCESS] Analisis Pidana (PCA Intelligence) Berhasil! Strategi pembelaan dan pembuktian diperbarui.'
            : '[SUCCESS] Analisis ULPE-AW Berhasil! Laporan Analitis & Traceability Matrix telah diperbarui.'
        ]);
      } else {
        // Fallback update
        const updatedCase: LegalCase = {
          ...caseData,
          status: 'In Review',
          updatedAt: new Date().toISOString(),
        };
        onUpdateCase(updatedCase);
        setPipelineLogs(prev => [
          ...prev, 
          isCriminal
            ? '[COMPLETE] Analisis Pidana selesai dengan TriyLex Criminal Rule-Based Synthesis Engine.'
            : '[COMPLETE] Analisis selesai dengan TriyLex Rule-Based Synthesis Engine.'
        ]);
      }

      setCurrentAgentStage(6);
      setActiveTab('report');
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Gagal menjalankan pipeline');
      setPipelineLogs(prev => [...prev, `[ERROR] Terjadi kegagalan: ${err.message}`]);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  // Handler: Add simulated or manual document
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    setIsUploading(true);
    setUploadProgress(20);

    setTimeout(() => {
      setUploadProgress(70);
      setTimeout(() => {
        const newDoc: CaseDocument = {
          id: `doc-${Date.now().toString().slice(-4)}`,
          name: newDocName.endsWith('.pdf') || newDocName.endsWith('.docx') ? newDocName : `${newDocName}.pdf`,
          size: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
          fileType: 'PDF',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Ready for analysis',
          category: newDocCategory,
          author: currentUser.name,
          pageCount: Math.floor(Math.random() * 20) + 4,
          ocrQuality: 'OCR High Fidelity (98%)',
          hash: 'sha256-' + Math.random().toString(36).substring(2, 12),
          piiRedacted: true,
          extractedText: newDocText || `Isi ringkasan teks dokumen ${newDocName} berhasil diekstrak dan dibersihkan dari PII sensitif.`,
        };

        const updated: LegalCase = {
          ...caseData,
          documents: [...(caseData.documents || []), newDoc],
          updatedAt: new Date().toISOString(),
        };

        onUpdateCase(updated);
        setNewDocName('');
        setNewDocText('');
        setIsUploading(false);
        setUploadProgress(null);
      }, 600);
    }, 600);
  };

  // Handler: Add new evidence and documents from Drag & Drop Dropzone
  const handleAddEvidenceAndDocuments = (newDocs: CaseDocument[], newEvidences: EvidenceItem[]) => {
    const updatedCase: LegalCase = {
      ...caseData,
      documents: [...(caseData.documents || []), ...newDocs],
      evidenceMatrix: [...(caseData.evidenceMatrix || []), ...newEvidences],
      updatedAt: new Date().toISOString(),
    };
    onUpdateCase(updatedCase);
  };

  // Handler: Toggle Fact Verification status
  const handleToggleFactVerification = (factId: string) => {
    if (!canApprove) return;
    const updatedFacts = (caseData.facts || []).map(f => {
      if (f.id === factId) {
        return { ...f, verified: !f.verified };
      }
      return f;
    });

    onUpdateCase({
      ...caseData,
      facts: updatedFacts,
      updatedAt: new Date().toISOString(),
    });
  };

  // Handler: Add Comment / Note
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const comment: CaseComment = {
      id: `cm-${Date.now().toString().slice(-4)}`,
      targetType: commentTargetType,
      targetId: commentTargetId || undefined,
      author: currentUser.name,
      authorRole: currentUser.role,
      text: newCommentText,
      createdAt: new Date().toISOString(),
      resolved: false,
      status: 'pending',
    };

    onUpdateCase({
      ...caseData,
      comments: [...(caseData.comments || []), comment],
      updatedAt: new Date().toISOString(),
    });

    setNewCommentText('');
  };

  // Handler: Approve Case
  const handleApproveCase = () => {
    if (!canApprove) return;
    onUpdateCase({
      ...caseData,
      status: 'Verified & Approved',
      approvedBy: currentUser.name,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  // Handler: Print / Trigger PDF
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
                {caseData.refNumber}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-semibold border ${
                caseData?.methodology === 'PCA' 
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800/80' 
                  : 'bg-blue-950/60 text-blue-300 border-blue-800/60'
              }`}>
                {caseData?.methodology === 'PCA' ? '🛡️ SOP Pidana & Khusus (PCA)' : '⚖️ SOP Perdata & Bisnis (LCA)'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {caseData.caseType}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {caseData.courtForum}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                caseData.status === 'Verified & Approved' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700' :
                caseData.status === 'In Review' ? 'bg-amber-950/80 text-amber-300 border border-amber-700' :
                'bg-slate-800 text-slate-400'
              }`}>
                ● {caseData.status}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
              {caseData.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-400 mt-2">
              <p><strong className="text-slate-300">Klien:</strong> {caseData.client}</p>
              <p><strong className="text-slate-300">Lawan:</strong> {caseData.opposingParty}</p>
              <p><strong className="text-slate-300">Lead Counsel:</strong> {caseData.owner}</p>
              <p><strong className="text-slate-300">Kerahasiaan:</strong> <span className="text-rose-400 font-medium">● {caseData.confidentiality}</span></p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {canUpload && (
              <button
                id="case-upload-evidence-top-btn"
                onClick={() => setIsOpenDropzoneModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                <span>+ Unggah Alat Bukti</span>
              </button>
            )}

            {/* JDIHN & Supreme Court Intelligence Search */}
            <button
              id="case-jdih-search-btn"
              onClick={() => setIsOpenJDIHModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/40 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Riset JDIH & MA (AI)</span>
            </button>

            {/* AI Legal Drafter Studio Button */}
            <button
              id="case-ai-drafter-btn"
              onClick={() => setIsOpenLegalDrafterModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Draf Dokumen Hukum (AI)</span>
            </button>

            {/* Visual Document Timeline Button */}
            <button
              id="case-timeline-top-btn"
              onClick={() => {
                if (viewMode === 'sop_workflow') {
                  const targetStage = caseData?.methodology === 'PCA' ? 'PCA-005' : 'LCA-004';
                  setActiveLCAStage(targetStage);
                } else {
                  setActiveTab('timeline');
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Lihat Visual Timeline, agregasi milestones dokumen dan pengawasan prosedural"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Linimasa Dokumen ({caseData?.timeline?.length || 0})</span>
            </button>

            {/* AI Judicial Bench Simulator */}
            <button
              id="case-ai-judicial-sim-btn"
              onClick={() => setIsOpenJudicialSimulatorModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              <span>Uji Stres Peradilan (AI)</span>
            </button>

            <button
              id="case-run-analysis-top-btn"
              disabled={!canRunAnalysis || isRunningPipeline}
              onClick={handleRunAnalysis}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg flex items-center gap-2 ${
                canRunAnalysis && !isRunningPipeline
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isRunningPipeline ? 'animate-spin' : ''}`} />
              <span>
                {isRunningPipeline 
                  ? 'Menganalisis Perkara...' 
                  : (caseData?.methodology === 'PCA' ? 'Jalankan Analisis Pidana (PCA)' : 'Jalankan Analisis ULPE-AW')}
              </span>
            </button>

            <button
              id="case-export-report-btn"
              onClick={() => setActiveTab('export')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export & Bagikan</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher: SOP Workflow vs Classic Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 w-fit">
            <button
              id="view-mode-sop-btn"
              onClick={() => setViewMode('sop_workflow')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                viewMode === 'sop_workflow'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>
                {caseData?.methodology === 'PCA' 
                  ? '15-Tahap SOP Pidana (PCA-001 s/d PCA-015)' 
                  : '15-Tahap SOP Standar (LCA-001 s/d LCA-015)'}
              </span>
            </button>
            <button
              id="view-mode-classic-btn"
              onClick={() => setViewMode('classic_tabs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                viewMode === 'classic_tabs'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tab Modul Klasik (7 Tab)</span>
            </button>
          </div>

          {viewMode === 'sop_workflow' && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Tahap Aktif: <strong className="text-amber-400">{activeLCAStage}</strong></span>
            </div>
          )}
        </div>

        {/* Classic Workflow Navigation Tabs (Visible only in classic_tabs mode) */}
        {viewMode === 'classic_tabs' && (
          <div className="flex overflow-x-auto border-t border-slate-800/80 pt-3 gap-1 no-scrollbar text-xs">
            {[
              { id: 'overview', label: '1. Identitas & Pihak', icon: Scale },
              { id: 'documents', label: `2. Dokumen & OCR (${(caseData?.documents || []).length})`, icon: UploadCloud },
              { id: 'timeline', label: `3. Linimasa Dokumen & Milestones (${(caseData?.timeline || []).length})`, icon: Clock },
              { id: 'readiness', label: `4. Preflight Check (${readinessScore}%)`, icon: CheckCircle2 },
              { id: 'pipeline', label: '5. Pipeline Analisis', icon: Layers },
              { id: 'report', label: '6. Laporan Analitis & Traceability', icon: GitMerge },
              { id: 'review', label: `7. Review & Catatan (${(caseData?.comments || []).length})`, icon: MessageSquare },
              { id: 'export', label: '8. Export Deliverable', icon: Share2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW MODE 1: 15-STAGE SOP WORKFLOW */}
      {viewMode === 'sop_workflow' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-1">
            <LCADocketSidebar
              caseData={caseData}
              activeStageKey={activeLCAStage}
              currentStage={activeLCAStage}
              onSelectStage={(stage) => {
                setActiveLCAStage(stage);
                onUpdateCase({
                  ...caseData,
                  currentSOPStage: stage,
                  updatedAt: new Date().toISOString(),
                });
              }}
              completedStages={caseData?.completedSOPStages || (
                caseData?.methodology === 'PCA'
                  ? [
                      'PCA-001', 'PCA-002', 'PCA-003', 'PCA-004', 'PCA-005', 
                      'PCA-006', 'PCA-007', 'PCA-008', 'PCA-009', 'PCA-010', 
                      'PCA-011', 'PCA-012', 'PCA-013', 'PCA-014', 'PCA-015'
                    ]
                  : [
                      'LCA-001', 'LCA-002', 'LCA-003', 'LCA-004', 'LCA-005', 
                      'LCA-006', 'LCA-007', 'LCA-008', 'LCA-009', 'LCA-010', 
                      'LCA-011', 'LCA-012', 'LCA-013', 'LCA-014', 'LCA-015'
                    ]
              )}
            />
          </div>

          <div className="lg:col-span-3">
            {caseData?.methodology === 'PCA' ? (
              <PCASOPStageRenderer
                stageId={activeLCAStage}
                caseData={caseData}
                currentUser={currentUser}
                onUpdateCase={onUpdateCase}
                onOpenDropzone={() => setIsOpenDropzoneModal(true)}
                onOpenFinalReport={() => setIsOpenFinalReportModal(true)}
                onOpenJudicialSim={() => setIsOpenJudicialSimulatorModal(true)}
                onOpenLegalDrafter={() => setIsOpenLegalDrafterModal(true)}
                onOpenJDIHModal={() => setIsOpenJDIHModal(true)}
              />
            ) : (
              <LCASOPStageRenderer
                stageId={activeLCAStage}
                caseData={caseData}
                currentUser={currentUser}
                onUpdateCase={onUpdateCase}
                onOpenDropzone={() => setIsOpenDropzoneModal(true)}
                onOpenFinalReport={() => setIsOpenFinalReportModal(true)}
                onOpenJudicialSim={() => setIsOpenJudicialSimulatorModal(true)}
                onOpenLegalDrafter={() => setIsOpenLegalDrafterModal(true)}
                onOpenJDIHModal={() => setIsOpenJDIHModal(true)}
              />
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CLASSIC 7-TABS */}
      {viewMode === 'classic_tabs' && (
        <>
      {/* TAB CONTENT 1: IDENTITAS & PIHAK */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Pokok Sengketa & Ringkasan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Pokok Perkara & Duduk Perkara</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {caseData.summary}
              </p>
            </div>

            {/* Claims Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Klaim, Eksepsi, & Petitum Ganti Rugi</span>
              </h2>

              <div className="space-y-3">
                {(caseData?.claims || []).map((claim) => (
                  <div key={claim.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        claim.type === 'Main Claim' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        claim.type === 'Counterclaim' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {claim.type}
                      </span>
                      {claim.claimedAmount && (
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {claim.claimedAmount}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{claim.title}</h3>
                    <p className="text-xs text-slate-400">{claim.description}</p>
                    {claim.legalBasis && (
                      <p className="text-[11px] text-slate-500 font-mono">
                        <strong className="text-slate-400">Dasar Hukum:</strong> {claim.legalBasis}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Facts Isolation Matrix (Admitted, Disputed, Unknown) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Pemetaan Fakta (Admitted vs Disputed vs Unknown)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/50 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fakta Diakui (Admitted)</span>
                  </span>
                  <ul className="text-xs text-slate-300 space-y-2">
                    {(caseData?.admittedFacts || []).map((f, i) => (
                      <li key={i} className="bg-slate-900 p-2 rounded border border-slate-800">
                        • {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/50 space-y-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Fakta Disengketakan</span>
                  </span>
                  <ul className="text-xs text-slate-300 space-y-2">
                    {(caseData?.disputedFacts || []).map((f, i) => (
                      <li key={i} className="bg-slate-900 p-2 rounded border border-slate-800">
                        • {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Fakta Belum Diketahui</span>
                  </span>
                  <ul className="text-xs text-slate-300 space-y-2">
                    {(caseData?.unknownFacts || []).length > 0 ? (
                      (caseData?.unknownFacts || []).map((f, i) => (
                        <li key={i} className="bg-slate-900 p-2 rounded border border-slate-800">
                          • {f}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 italic text-[11px]">Seluruh fakta awal teridentifikasi</li>
                    )}
                  </ul>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (1/3): Parties & Timeline */}
          <div className="space-y-6">
            
            {/* Parties List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Pihak & Kuasa Hukum</span>
              </h2>

              <div className="space-y-3">
                {(caseData?.parties || []).map((party) => (
                  <div key={party.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {party.role}
                      </span>
                      <span className="text-[10px] text-slate-500">{party.type}</span>
                    </div>
                    <p className="text-xs font-bold text-white">{party.name}</p>
                    {party.legalRepresentative && (
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Kuasa:</strong> {party.legalRepresentative}
                      </p>
                    )}
                    {party.conflictNotes && (
                      <p className="text-[10px] text-emerald-400/90 font-mono">
                        ✓ {party.conflictNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Kronologi Waktu Kritis</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>Buka Visual Timeline Penuh</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative border-l border-slate-800 ml-2 pl-4 space-y-4">
                {(caseData?.timeline || []).map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{event.date}</span>
                    <h4 className="text-xs font-semibold text-white">{event.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 2: DOKUMEN & INGESTION */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          
          {/* Main Drag-and-Drop Uploader Card */}
          {canUpload && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-semibold">
                  Modul Unggah & Ekstraksi Alat Bukti
                </span>
                <button
                  type="button"
                  onClick={() => setShowManualUploadForm(prev => !prev)}
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors underline underline-offset-2"
                >
                  {showManualUploadForm ? '← Gunakan Drag & Drop Uploader' : '+ Input Manual / Teks Kustom'}
                </button>
              </div>

              {!showManualUploadForm ? (
                <EvidenceUploadDropzone
                  caseData={caseData}
                  currentUser={currentUser}
                  onAddEvidenceAndDocuments={handleAddEvidenceAndDocuments}
                />
              ) : (
                <form onSubmit={handleUploadDocument} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <UploadCloud className="w-4 h-4 text-amber-400" />
                      <span>Input Manual Berkas & Transkrip Dokumen</span>
                    </div>
                    <span className="text-xs text-slate-400">Mendukung PDF, DOCX, XLSX, Somasi & Putusan</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Nama Berkas Dokumen</label>
                      <input
                        id="doc-name-input"
                        type="text"
                        required
                        placeholder="Contoh: Salinan_Akta_Perjanjian_Kredit_Bank_2025.pdf"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Kategori Dokumen</label>
                      <select
                        id="doc-category-select"
                        value={newDocCategory}
                        onChange={(e) => setNewDocCategory(e.target.value as any)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Kontrak/Perjanjian">Kontrak / Perjanjian</option>
                        <option value="Surat Somasi/Peringatan">Surat Somasi / Peringatan</option>
                        <option value="Akta Notaris">Akta Notaris / Otentik</option>
                        <option value="Bukti Keuangan/Mutasi">Bukti Keuangan / Mutasi Bank</option>
                        <option value="Surat Elektronik/Chat">Surat Elektronik / Chat Log</option>
                        <option value="Putusan/Dokumen Pengadilan">Putusan / Dokumen Acara</option>
                        <option value="Kronologi Manual">Kronologi Manual</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Cuplikan / Teks Transkrip Dokumen (Opsional / Simulasi OCR)</label>
                    <textarea
                      id="doc-text-input"
                      rows={3}
                      placeholder="Masukkan klausul penting atau transkrip dokumen untuk dianalisis oleh Case Mapper..."
                      value={newDocText}
                      onChange={(e) => setNewDocText(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {isUploading && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Sedang memproses OCR & Redaksi PII otomatis...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUploading || !newDocName}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Proses & Masukkan ke Berkas Perkara</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Document Ingestion Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Daftar Berkas Terunggah ({(caseData?.documents || []).length} Dokumen)</span>
            </h3>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              {(caseData?.documents || []).map((doc) => (
                <div key={doc.id} className="p-4 space-y-2 hover:bg-slate-900/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
                        {doc.fileType}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-md">{doc.name}</h4>
                        <p className="text-[11px] text-slate-400">
                          {doc.category} • {doc.size} • {doc.pageCount} Halaman • Diunggah {doc.uploadDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{doc.status}</span>
                      </span>
                      {doc.piiRedacted && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>PII Redacted</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {doc.extractedText && (
                    <div className="text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono leading-relaxed">
                      {doc.extractedText}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="font-mono">Hash: {doc.hash}</span>
                    <span>Kualitas: {doc.ocrQuality || 'Direct Text'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 3: VISUAL DOCUMENT TIMELINE & PROCEDURAL OVERSIGHT */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <VisualDocumentTimeline 
            caseData={caseData} 
            onUpdateCase={onUpdateCase} 
            onOpenFinalReport={() => setIsOpenFinalReportModal(true)}
            onOpenDocument={(_docId) => {
              setActiveTab('documents');
            }}
          />
        </div>
      )}

      {/* TAB CONTENT 4: PREFLIGHT READINESS CHECK */}
      {activeTab === 'readiness' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Preflight Readiness Audit (Kesiapan Bahan Analisis)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Sistem memeriksa kelengkapan formil dan materiil perkara sebelum pipeline multi-agent dijalankan.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-amber-400">{readinessScore}%</span>
                <span className="text-[10px] text-slate-500 block">Kesiapan Analisis</span>
              </div>
              <button
                id="preflight-run-analysis-btn"
                disabled={!canRunAnalysis || readinessScore < 50 || isRunningPipeline}
                onClick={handleRunAnalysis}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  readinessScore >= 50 && canRunAnalysis
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Mulai Analisis Sekarang
              </button>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  item.passed 
                    ? 'bg-slate-950 border-emerald-900/50 text-slate-200' 
                    : 'bg-slate-950 border-amber-900/50 text-slate-400'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  item.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.passed ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-white">{item.label}</span>
                  <span className="text-[11px] text-slate-400">
                    {item.passed ? 'Terpenuhi dan siap diproses oleh agent.' : 'Disarankan melengkapi sebelum analisis final.'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB CONTENT 4: ULPE-AW PIPELINE RUNNER */}
      {activeTab === 'pipeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Eksekusi Pipeline 5-Agent & Verification Gate</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Alur otomatisasi: Case Mapper → Legal Classifier → Legal Research → Evidence Agent → Argument Agent → Verification Gate.
              </p>
            </div>

            <button
              id="pipeline-trigger-btn"
              disabled={!canRunAnalysis || isRunningPipeline}
              onClick={handleRunAnalysis}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-lg flex items-center gap-2 ${
                canRunAnalysis && !isRunningPipeline
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className={`w-4 h-4 ${isRunningPipeline ? 'animate-spin' : ''}`} />
              <span>{isRunningPipeline ? 'Sedang Memproses...' : 'Mulai / Jalankan Ulang Pipeline'}</span>
            </button>
          </div>

          {/* 5 Stages Progress Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { id: 1, name: 'Agent 1: Mapper', desc: 'Facts, Parties, Claims' },
              { id: 2, name: 'Agent 2: Classifier', desc: 'Multi-layer Norms' },
              { id: 3, name: 'Agent 3: Research', desc: 'Statutes & Articles' },
              { id: 4, name: 'Agent 4: Evidence', desc: 'Evidence & Gaps' },
              { id: 5, name: 'Agent 5: Argument', desc: 'Symmetric Stress Test' },
            ].map((stage) => {
              const isDone = currentAgentStage > stage.id || (!isRunningPipeline && caseData.status !== 'Draft');
              const isCurrent = isRunningPipeline && currentAgentStage === stage.id;
              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                      : isDone
                      ? 'bg-slate-950 border-emerald-900/60 text-slate-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold font-mono text-[11px] text-amber-400">0{stage.id}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    ) : null}
                  </div>
                  <h4 className="font-bold text-white">{stage.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{stage.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Live Terminal / Log Viewer */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 shadow-inner max-h-60 overflow-y-auto">
            <div className="text-slate-500 text-[11px] border-b border-slate-800 pb-1 flex justify-between">
              <span>TriyLex ULPE-AW Terminal Log</span>
              <span>Gemini 3.7 Flash Engine & Rule Synthesis</span>
            </div>
            {pipelineLogs.length === 0 ? (
              <p className="text-slate-600 italic">Tekan "Mulai Pipeline" untuk melihat log komputasi per agent secara real-time.</p>
            ) : (
              pipelineLogs.map((log, i) => (
                <p key={i} className="leading-relaxed">
                  <span className="text-amber-400">{log}</span>
                </p>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT 5: LAPORAN ANALITIS & TRACEABILITY */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          
          {/* Traceability Graph Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-amber-400" />
                  <span>Traceability Matrix (Rantai Pembuktian Berantai)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Setiap dalil kesimpulan dapat diverifikasi mundur dari Kesimpulan → Isu → Unsur Norma → Fakta → Alat Bukti → Dokumen.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
                100% Chain-of-Custody Mapped
              </span>
            </div>

            <TraceabilityGraph
              nodes={caseData?.traceability || []}
              facts={caseData?.facts || []}
              evidence={caseData?.evidenceMatrix || []}
              documents={caseData?.documents || []}
            />
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Ringkasan Eksekutif Hasil Analisis (Executive Summary)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              {caseData.executiveSummary || caseData.summary}
            </p>
          </div>

          {/* Facts Matrix & Verification Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Facts Matrix & Verifikasi Pembuktian ({(caseData?.facts || []).length} Fakta Terindeks)</span>
              </h3>
              {canApprove && (
                <span className="text-[11px] text-slate-400">
                  Klik checkbox untuk verifikasi kebenaran fakta sebagai Reviewer
                </span>
              )}
            </div>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              {(caseData?.facts || []).map((fact) => (
                <div key={fact.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-900/40 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400">{fact.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        fact.status === 'Established' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        fact.status === 'Alleged' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {fact.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Confidence: {fact.confidence}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{fact.text}</p>
                    {fact.sourceDocId && (
                      <p className="text-[10px] text-slate-500 font-mono">Sumber: Berkas Dokumen {fact.sourceDocId}</p>
                    )}
                  </div>

                  {canApprove && (
                    <button
                      id={`fact-verify-btn-${fact.id}`}
                      onClick={() => handleToggleFactVerification(fact.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        fact.verified 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{fact.verified ? 'Terverifikasi' : 'Verifikasi'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal Layers & Primary Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Multi-Layer Legal Norms (Lapisan Hukum)</span>
              </h3>
              <div className="space-y-3">
                {(caseData?.legalLayers || []).map((layer) => (
                  <div key={layer.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{layer.layerName}</span>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">Skor Prioritas: {layer.priorityScore}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      <strong>Rujukan Primer:</strong> {layer.primarySources.join(', ')}
                    </div>
                    {layer.classificationReason && (
                      <p className="text-[11px] text-slate-500 italic">{layer.classificationReason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Validasi Peraturan & Pasal Indonesia</span>
              </h3>
              <div className="space-y-3">
                {(caseData?.statutes || []).map((statute) => (
                  <div key={statute.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300">{statute.article}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        {statute.status}
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium">{statute.lawName}</p>
                    <p className="text-[11px] text-slate-400">{statute.relevance}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Evidence Matrix & Gaps */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Evidence Matrix & Evidence Gaps (Celah Pembuktian)</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Evidence Registered */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 block">Alat Bukti Terdaftar ({(caseData?.evidenceMatrix || []).length})</span>
                  {canUpload && (
                    <button
                      type="button"
                      id="evidence-matrix-upload-btn"
                      onClick={() => setIsOpenDropzoneModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Bukti (Drag & Drop)</span>
                    </button>
                  )}
                </div>
                {(caseData?.evidenceMatrix || []).map((ev) => (
                  <div key={ev.evidenceId} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">{ev.evidenceId}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300">{ev.type}</span>
                    </div>
                    <p className="font-medium text-white">{ev.name}</p>
                    <p className="text-[11px] text-slate-400">{ev.notes}</p>
                  </div>
                ))}
              </div>

              {/* Evidence Gaps */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Evidence Gaps (Celah Bukti Wajib Dilengkapi)</span>
                </span>
                {(caseData?.evidenceGaps || []).length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-500 italic">
                    Tidak terdeteksi celah bukti kritis. Seluruh dalil didukung dokumen primer.
                  </div>
                ) : (
                  (caseData?.evidenceGaps || []).map((gap) => (
                    <div key={gap.id} className="p-3.5 rounded-xl bg-slate-950 border border-rose-900/50 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-rose-400">{gap.id}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950 text-rose-300">
                          Dampak {gap.impact}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium">{gap.description}</p>
                      <p className="text-[11px] text-amber-400/90 font-mono">
                        <strong className="text-slate-400">Rekomendasi:</strong> {gap.recommendation}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Symmetric Arguments & Stress Test */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Analisis Simetris & Uji Ketahanan Argumen (Symmetric Stress Testing)</span>
            </h3>

            <div className="space-y-4">
              {(caseData?.symmetricArguments || []).map((arg, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400">{arg.issueTitle}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-blue-400 block">Dalil Posisi Klien (Claimant)</span>
                      <p className="text-slate-300">{arg.claimantArgument}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase text-rose-400 block">Sanggahan Tergugat (Defendant)</span>
                      <p className="text-slate-300">{arg.defendantArgument}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-300 block">Uji Ketahanan & Rekomendasi Strategi Sidang:</span>
                    <p className="text-slate-300">{arg.stressTestAnalysis}</p>
                    {arg.counterstrategy && (
                      <p className="text-slate-400 mt-1"><strong className="text-slate-300">Mitigasi:</strong> {arg.counterstrategy}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Matrix & Verification Gate Result */}
          {caseData.riskMatrix && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Risk Matrix & Skor Audit Verifikasi</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Legal Exposure</span>
                  <span className="text-xs font-bold text-amber-400">{caseData.riskMatrix.legalExposure}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Evidence Strength</span>
                  <span className="text-xs font-bold text-emerald-400">{caseData.riskMatrix.evidenceStrength}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Contradiction Risk</span>
                  <span className="text-xs font-bold text-blue-400">{caseData.riskMatrix.contradictionRisk}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Temporal Risk</span>
                  <span className="text-xs font-bold text-slate-300">{caseData.riskMatrix.temporalRisk}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Procedural Risk</span>
                  <span className="text-xs font-bold text-slate-300">{caseData.riskMatrix.proceduralRisk}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Audit Score</span>
                  <span className="text-xs font-bold text-emerald-400">{caseData.verificationGate?.auditScore || 90}%</span>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 6: REVIEW & KOLABORASI */}
      {activeTab === 'review' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Pemeriksaan Kolaboratif & Persetujuan (Human Review)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Catatan telaah dari Lead Counsel, Reviewer, dan verifikasi sebelum penerbitan laporan resmi.
              </p>
            </div>

            {canApprove && caseData.status !== 'Verified & Approved' && (
              <button
                id="case-approve-final-btn"
                onClick={handleApproveCase}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Beri Persetujuan Resmi (Approve Case)</span>
              </button>
            )}
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {(caseData?.comments || []).length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950 text-slate-500 text-xs">
                Belum ada catatan review. Gunakan formulir di bawah untuk menambahkan catatan hukum.
              </div>
            ) : (
              (caseData?.comments || []).map((comment) => (
                <div key={comment.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{comment.author}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {comment.authorRole}
                      </span>
                      {comment.targetId && (
                        <span className="text-[10px] font-mono text-slate-500">
                          Target: {comment.targetId}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(comment.createdAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-white">Tambahkan Catatan Review Hukum</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Target Anotasi</label>
                <select
                  id="comment-target-select"
                  value={commentTargetType}
                  onChange={(e) => setCommentTargetType(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                >
                  <option value="general">Catatan Umum Perkara</option>
                  <option value="fact">Fakta Tertentu</option>
                  <option value="evidence">Alat Bukti Tertentu</option>
                  <option value="issue">Pokok Isu Hukum</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">ID Target (Opsional)</label>
                <input
                  id="comment-target-id-input"
                  type="text"
                  placeholder="Contoh: F-01, E-01, I-01"
                  value={commentTargetId}
                  onChange={(e) => setCommentTargetId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                />
              </div>
            </div>
            <textarea
              id="comment-text-input"
              rows={2}
              required
              placeholder="Tuliskan catatan hukum, instruksi tambahan bukti, atau arahan strategi sidang..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Catatan Review</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* TAB CONTENT 7: EXPORT & SHARING */}
      {activeTab === 'export' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Export Deliverable Laporan & Berbagi Aman</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Unduh laporan analytical dossier berstandar profesional hukum atau bagikan tautan baca internal.
            </p>
          </div>

          {/* Export Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={exportIncludeWatermark}
                onChange={(e) => setExportIncludeWatermark(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Watermark "CONFIDENTIAL"</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={exportIncludeNotes}
                onChange={(e) => setExportIncludeNotes(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Sertakan Catatan Reviewer</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={exportIncludeRawFacts}
                onChange={(e) => setExportIncludeRawFacts(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-500"
              />
              <span>Sertakan Matriks Bukti Lengkap</span>
            </label>
          </div>

          {/* Download Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <button
              id="export-pdf-btn"
              onClick={handlePrintReport}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all text-left group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400">PDF Analytical Report</h4>
              <p className="text-[11px] text-slate-500">Format cetak resmi / Save as PDF siap sidang</p>
            </button>

            <button
              id="export-json-btn"
              onClick={() => {
                const blob = new Blob([JSON.stringify(caseData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${caseData.refNumber.replace(/[\/\\:]/g, '_')}_TriyLex_Dossier.json`;
                a.click();
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all text-left group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FileCode className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400">JSON Structured Export</h4>
              <p className="text-[11px] text-slate-500">Data terstruktur komplit untuk integrasi internal</p>
            </button>

            <button
              id="export-csv-btn"
              onClick={() => {
                const rows = [
                  ['Evidence ID', 'Nama Bukti', 'Tipe', 'Fakta Didukung', 'Reliability', 'Catatan'],
                  ...(caseData?.evidenceMatrix || []).map(e => [e.evidenceId, e.name, e.type, e.supportsFactId, e.reliability, e.notes || ''])
                ];
                const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `${caseData.refNumber}_Evidence_Matrix.csv`);
                document.body.appendChild(link);
                link.click();
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all text-left group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400">XLSX / CSV Evidence Matrix</h4>
              <p className="text-[11px] text-slate-500">Tabel alat bukti untuk tim litigasi persidangan</p>
            </button>

            <button
              id="copy-share-link-btn"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/#case-${caseData.id}`);
                setShareLinkCopied(true);
                setTimeout(() => setShareLinkCopied(false), 2000);
              }}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all text-left group space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Copy className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400">
                {shareLinkCopied ? '✓ Tautan Disalin!' : 'Salin Tautan Internal'}
              </h4>
              <p className="text-[11px] text-slate-500">Tautan aman untuk tim internal satu workspace</p>
            </button>

          </div>

        </div>
      )}
      </>
      )}

      {/* Modal Dialog: Drag and Drop Evidence Uploader */}
      {isOpenDropzoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                <span>Unggah & Integrasikan Alat Bukti Perkara</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenDropzoneModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <EvidenceUploadDropzone
              caseData={caseData}
              currentUser={currentUser}
              onAddEvidenceAndDocuments={(newDocs, newEvidences) => {
                handleAddEvidenceAndDocuments(newDocs, newEvidences);
                setIsOpenDropzoneModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Dialog: AI Legal Drafter Studio */}
      {isOpenLegalDrafterModal && (
        <AILegalDrafterModal
          isOpen={isOpenLegalDrafterModal}
          onClose={() => setIsOpenLegalDrafterModal(false)}
          caseData={caseData}
          onSaveToCaseDocuments={handleSaveDraftDocument}
        />
      )}

      {/* Modal Dialog: AI Judicial Stress-Test & Scrutiny Simulator */}
      {isOpenJudicialSimulatorModal && (
        <AIJudicialSimulatorModal
          isOpen={isOpenJudicialSimulatorModal}
          onClose={() => setIsOpenJudicialSimulatorModal(false)}
          caseData={caseData}
        />
      )}

      {/* Modal Dialog: LCA-015 Final Case Intelligence Report */}
      {isOpenFinalReportModal && (
        <FinalReportModal
          isOpen={isOpenFinalReportModal}
          onClose={() => setIsOpenFinalReportModal(false)}
          caseData={caseData}
          onUpdateCase={onUpdateCase}
        />
      )}

      {/* Modal Dialog: JDIHN & Supreme Court (MA RI) Legal Search Explorer */}
      {isOpenJDIHModal && (
        <JDIHLegalSearchModal
          isOpen={isOpenJDIHModal}
          onClose={() => setIsOpenJDIHModal(false)}
          caseData={caseData}
          onUpdateCase={onUpdateCase}
        />
      )}

    </div>
  );
};
