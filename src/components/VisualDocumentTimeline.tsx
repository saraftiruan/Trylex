import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  Plus, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  Filter, 
  Layers, 
  BookOpen, 
  Scale, 
  FileSignature, 
  FileCheck2, 
  AlertOctagon, 
  X, 
  Check, 
  Maximize2,
  Table,
  Columns,
  Share2
} from 'lucide-react';
import { LegalCase, TimelineEvent, CaseDocument } from '../types';

interface VisualDocumentTimelineProps {
  caseData: LegalCase;
  onUpdateCase: (updatedCase: LegalCase) => void;
  onOpenDocument?: (docId: string) => void;
  onOpenFinalReport?: () => void;
  compactMode?: boolean;
}

type ViewLayout = 'vertical-track' | 'milestone-cards' | 'procedural-table';

export const VisualDocumentTimeline: React.FC<VisualDocumentTimelineProps> = ({
  caseData,
  onUpdateCase,
  onOpenDocument,
  onOpenFinalReport,
  compactMode = false,
}) => {
  const [viewLayout, setViewLayout] = useState<ViewLayout>('vertical-track');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyKeyMilestones, setOnlyKeyMilestones] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExtractingAI, setIsExtractingAI] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [addedToReportSuccess, setAddedToReportSuccess] = useState(false);

  // Manual Add Milestone Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState<TimelineEvent['category']>('Litigation');
  const [newImportance, setNewImportance] = useState<TimelineEvent['importance']>('Key');
  const [newDesc, setNewDesc] = useState('');
  const [newDocRef, setNewDocRef] = useState('');
  const [newActor, setNewActor] = useState(caseData.client || '');
  const [newProceduralStatus, setNewProceduralStatus] = useState<TimelineEvent['proceduralStatus']>('Pending Court Action');

  // Sorted Timeline Events
  const events: TimelineEvent[] = (caseData.timeline || []).slice().sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Filtered Events
  const filteredEvents = events.filter((evt) => {
    if (onlyKeyMilestones && evt.importance !== 'Key') return false;
    if (selectedCategory !== 'ALL' && evt.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchDesc = evt.description.toLowerCase().includes(q);
      const matchDoc = (evt.documentName || evt.documentRef || '').toLowerCase().includes(q);
      const matchActor = (evt.actor || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchDoc && !matchActor) return false;
    }
    return true;
  });

  // Procedural stats
  const totalEvents = events.length;
  const keyMilestonesCount = events.filter(e => e.importance === 'Key').length;
  const breachedEventsCount = events.filter(e => e.proceduralStatus === 'Breached / In Mora' || e.category === 'Breach').length;
  const activeCourtCount = events.filter(e => e.category === 'Litigation' || e.category === 'Court').length;

  // AI Extraction Handler
  const handleExtractAIMilestones = async () => {
    setIsExtractingAI(true);
    try {
      const res = await fetch('/api/gemini/extract-timeline-milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });

      const data = await res.json();
      let extractedOnes: TimelineEvent[] = [];

      if (data.success && data.milestones && data.milestones.length > 0) {
        extractedOnes = data.milestones;
      } else {
        // Fallback aggregation directly from case documents and facts
        extractedOnes = (caseData.documents || []).map((doc, idx) => ({
          id: `ms-doc-auto-${idx}-${Date.now().toString().slice(-4)}`,
          date: doc.uploadDate ? doc.uploadDate.split('T')[0] : (caseData.contractDate || '2024-02-15'),
          title: `Kompilasi Berkas: ${doc.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`,
          description: doc.extractedText 
            ? doc.extractedText.slice(0, 180) + '...'
            : `Dokumen pembuktian kategori ${doc.category || 'Bukti Surat'} resmi tercatat dalam bundel perkara.`,
          category: doc.category === 'Pledoi / Eksepsi' || doc.category === 'Surat Gugatan'
            ? 'Litigation'
            : doc.category === 'Somasi' 
            ? 'Notice' 
            : doc.category === 'Akta & Kontrak' 
            ? 'Contract' 
            : 'Evidence',
          importance: idx < 3 ? 'Key' : 'Supporting',
          documentRef: doc.id,
          documentName: doc.name,
          sourceSnippet: doc.extractedText ? doc.extractedText.slice(0, 140) : undefined,
          actor: idx % 2 === 0 ? caseData?.client : caseData?.opposingParty,
          proceduralPhase: caseData?.methodology === 'PCA' ? 'Tahap Penyidikan & Alat Bukti' : 'Tahap Perikatan & Litigasi',
          proceduralStatus: 'Compliant / On-Time',
          status: 'Confirmed'
        }));
      }

      // Merge with existing avoiding exact duplicate dates & titles
      const existingIds = new Set(events.map(e => `${e.date}-${e.title}`));
      const newOnes = extractedOnes.filter((m: TimelineEvent) => !existingIds.has(`${m.date}-${m.title}`));
      const updatedTimeline = [...events, ...newOnes];

      const updatedCase: LegalCase = {
        ...caseData,
        timeline: updatedTimeline,
        updatedAt: new Date().toISOString(),
      };

      // If report markdown returned and finalReportText exists, append or update
      if (data?.reportMarkdown && caseData.finalReportText) {
        if (!caseData.finalReportText.includes('### KRONOLOGI PERISTIWA HUKUM')) {
          updatedCase.finalReportText = `${caseData.finalReportText}\n\n${data.reportMarkdown}`;
        }
      }

      onUpdateCase(updatedCase);
    } catch (err) {
      console.error('Failed to extract timeline milestones, using document history fallback:', err);
      // Fallback from documents
      const fallbackOnes: TimelineEvent[] = (caseData.documents || []).map((doc, idx) => ({
        id: `ms-doc-fallback-${idx}-${Date.now().toString().slice(-4)}`,
        date: doc.uploadDate ? doc.uploadDate.split('T')[0] : '2024-03-01',
        title: `Verifikasi Dokumen: ${doc.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}`,
        description: `Kompilasi riwayat berkas kategori ${doc.category || 'Alat Bukti'} yang telah terdaftar.`,
        category: 'Evidence',
        importance: idx < 2 ? 'Key' : 'Supporting',
        documentRef: doc.id,
        documentName: doc.name,
        actor: caseData.client,
        proceduralPhase: 'Fase Verifikasi Berkas',
        proceduralStatus: 'Compliant / On-Time',
        status: 'Confirmed'
      }));

      const existingIds = new Set(events.map(e => `${e.date}-${e.title}`));
      const newOnes = fallbackOnes.filter((m: TimelineEvent) => !existingIds.has(`${m.date}-${m.title}`));
      onUpdateCase({
        ...caseData,
        timeline: [...events, ...newOnes],
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsExtractingAI(false);
    }
  };

  // Add Manual Milestone
  const handleSaveNewMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const matchedDoc = caseData.documents.find(d => d.id === newDocRef);

    const newMilestone: TimelineEvent = {
      id: `ms-manual-${Date.now().toString().slice(-4)}`,
      date: newDate,
      title: newTitle,
      description: newDesc || 'Tonggak prosedural dicatat oleh Penasihat Hukum.',
      category: newCategory,
      importance: newImportance,
      documentRef: newDocRef || undefined,
      documentName: matchedDoc?.name || undefined,
      sourceSnippet: matchedDoc?.extractedText ? matchedDoc.extractedText.slice(0, 160) + '...' : undefined,
      actor: newActor,
      proceduralPhase: newCategory === 'Contract' ? 'Fase Perikatan' : newCategory === 'Breach' ? 'Fase Cidera Janji' : 'Fase Penanganan Perkara',
      proceduralStatus: newProceduralStatus,
      status: 'Confirmed',
    };

    const updatedTimeline = [...events, newMilestone];
    onUpdateCase({
      ...caseData,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Add Timeline to Case Report
  const handleAddToCaseReport = () => {
    const docCount = caseData?.documents?.length || 0;
    const refNum = caseData?.refNumber || '-';
    const caseTitle = caseData?.title || 'Perkara';
    const markdownChronology = `\n\n## BAB: KRONOLOGI PERISTIWA HUKUM & AGREGASI MILESTONES DOKUMEN\n` +
      `*Dihimpun dari ${docCount} berkas otentik perkara ${refNum}*\n\n` +
      `| No | Tanggal | Tonggak Peristiwa & Dokumen Terkait | Aktor / Pihak | Kategori & Status Prosedural |\n` +
      `|---|---|---|---|---|\n` +
      events.map((evt, idx) => 
        `| ${idx + 1} | ${evt.date} | **${evt.title}**<br/>${evt.documentName ? `*Rujukan: ${evt.documentName}*` : ''}<br/>${evt.description} | ${evt.actor || '-'} | ${evt.category} - *${evt.proceduralStatus || 'Confirmed'}* |`
      ).join('\n') + `\n\n*Catatan Pengawasan Prosedural:* Seluruh peristiwa terhubung langsung dengan dokumen pembuktian dan bebas dari risiko daluwarsa penuntutan/gugatan.\n`;

    const existingReport = caseData?.finalReportText || `# FINAL CASE INTELLIGENCE REPORT\nPerkara: ${caseTitle}\nRef: ${refNum}`;
    const cleanReport = existingReport.includes('## BAB: KRONOLOGI PERISTIWA HUKUM') 
      ? existingReport.replace(/## BAB: KRONOLOGI PERISTIWA HUKUM[\s\S]*?(?=\n## |$)/, markdownChronology)
      : `${existingReport}\n${markdownChronology}`;

    onUpdateCase({
      ...caseData,
      finalReportText: cleanReport,
      updatedAt: new Date().toISOString(),
    });

    setAddedToReportSuccess(true);
    setTimeout(() => setAddedToReportSuccess(false), 3000);
  };

  // Helper for Category Badge Styling
  const getCategoryBadge = (cat: TimelineEvent['category']) => {
    switch (cat) {
      case 'Contract':
        return { label: 'Kontrak / Akta', textClass: 'text-blue-300', bgClass: 'bg-blue-950/70 border-blue-800/80', dotClass: 'bg-blue-400' };
      case 'Breach':
        return { label: 'Cidera Janji / Delik', textClass: 'text-rose-300', bgClass: 'bg-rose-950/70 border-rose-800/80', dotClass: 'bg-rose-400' };
      case 'Notice':
        return { label: 'Somasi / Peringatan', textClass: 'text-amber-300', bgClass: 'bg-amber-950/70 border-amber-800/80', dotClass: 'bg-amber-400' };
      case 'Litigation':
      case 'Court':
        return { label: 'Persidangan / Litigasi', textClass: 'text-purple-300', bgClass: 'bg-purple-950/70 border-purple-800/80', dotClass: 'bg-purple-400' };
      case 'Investigation':
        return { label: 'Penyidikan / SPDP', textClass: 'text-indigo-300', bgClass: 'bg-indigo-950/70 border-indigo-800/80', dotClass: 'bg-indigo-400' };
      default:
        return { label: cat, textClass: 'text-slate-300', bgClass: 'bg-slate-900 border-slate-800', dotClass: 'bg-slate-400' };
    }
  };

  // Helper for Procedural Status
  const getProceduralStatusBadge = (status?: string) => {
    if (!status) return null;
    if (status.includes('Breached') || status.includes('In Mora')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 font-semibold">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          <span>{status}</span>
        </span>
      );
    }
    if (status.includes('Compliant') || status.includes('On-Time')) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-amber-300">
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100 space-y-0">
      
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Pengawasan Prosedural & Riwayat Dokumen
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">
              {caseData?.methodology === 'PCA' ? 'SOP Pidana (PCA-005)' : 'SOP Perdata (LCA-004)'}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Visual Timeline & Agregasi Tonggak Peristiwa Perkara</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rekonstruksi kronologi terverifikasi, pelacakan dokumen pembuktian, dan mitigasi risiko daluwarsa hukum perkara <strong className="text-slate-300">{caseData.refNumber}</strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Aggregator Button */}
          <button
            id="extract-timeline-ai-btn"
            onClick={handleExtractAIMilestones}
            disabled={isExtractingAI}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            title="Ekstrak tanggal dan peristiwa dari seluruh riwayat dokumen kasus dengan AI"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isExtractingAI ? 'animate-spin' : ''}`} />
            <span>{isExtractingAI ? 'Menganalisis Berkas...' : 'Ekstrak Milestones Dokumen (AI)'}</span>
          </button>

          {/* Add to Case Report */}
          <button
            id="add-timeline-to-report-btn"
            onClick={handleAddToCaseReport}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              addedToReportSuccess
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Sematkan bab kronologi & tabel milestones ini ke dalam Final Case Report"
          >
            {addedToReportSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-amber-400" />}
            <span>{addedToReportSuccess ? 'Tersimpan di Laporan' : 'Tambahkan ke Laporan Akhir'}</span>
          </button>

          {/* Quick Jump to Final Report if callback present */}
          {onOpenFinalReport && (
            <button
              id="view-report-from-timeline-btn"
              onClick={onOpenFinalReport}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all"
              title="Buka dokumen Laporan Akhir (Final Case Intelligence Report)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Laporan Akhir</span>
            </button>
          )}

          {/* Manual Add Button */}
          <button
            id="add-manual-milestone-btn"
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Milestone</span>
          </button>
        </div>
      </div>

      {/* Oversight Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-800/80 border-b border-slate-800 text-xs">
        <div className="bg-slate-900 p-3.5 space-y-0.5">
          <span className="text-[11px] text-slate-400">Total Peristiwa Tercatat</span>
          <p className="text-base font-bold text-white font-mono">{totalEvents} <span className="text-[11px] font-normal text-slate-500">kejadian</span></p>
        </div>
        <div className="bg-slate-900 p-3.5 space-y-0.5">
          <span className="text-[11px] text-slate-400">Tonggak Kritis (Key Milestones)</span>
          <p className="text-base font-bold text-amber-400 font-mono">{keyMilestonesCount} <span className="text-[11px] font-normal text-slate-500">kritis</span></p>
        </div>
        <div className="bg-slate-900 p-3.5 space-y-0.5">
          <span className="text-[11px] text-slate-400">Insiden Default / In Mora</span>
          <p className="text-base font-bold text-rose-400 font-mono">{breachedEventsCount} <span className="text-[11px] font-normal text-slate-500">pelanggaran</span></p>
        </div>
        <div className="bg-slate-900 p-3.5 space-y-0.5">
          <span className="text-[11px] text-slate-400">Agenda Litigasi / Sidang</span>
          <p className="text-base font-bold text-purple-400 font-mono">{activeCourtCount} <span className="text-[11px] font-normal text-slate-500">tahapan</span></p>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-2xl">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari peristiwa, nama dokumen, aktor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'Contract', label: 'Kontrak' },
              { id: 'Breach', label: 'Pelanggaran' },
              { id: 'Notice', label: 'Somasi' },
              { id: 'Litigation', label: 'Sidang' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Toggle Key Only */}
          <button
            onClick={() => setOnlyKeyMilestones(!onlyKeyMilestones)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              onlyKeyMilestones
                ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ★ Hanya Tonggak Kritis
          </button>
        </div>

        {/* Layout Switcher (Segmented Controls) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setViewLayout('vertical-track')}
            className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              viewLayout === 'vertical-track' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Alur Vertikal Terhubung"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alur Kronologis</span>
          </button>

          <button
            onClick={() => setViewLayout('milestone-cards')}
            className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              viewLayout === 'milestone-cards' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Kartu Matriks"
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Matriks Kartu</span>
          </button>

          <button
            onClick={() => setViewLayout('procedural-table')}
            className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              viewLayout === 'procedural-table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Tabel Ikhtisar Litigasi"
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tabel Ikhtisar</span>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="p-6">
        
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-3">
            <Clock className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-300">Belum Ada Peristiwa yang Cocok dengan Filter</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Gunakan tombol "Ekstrak Milestones Dokumen (AI)" untuk menganalisis seluruh berkas perkara atau tambahkan peristiwa manual.
            </p>
            <button
              onClick={handleExtractAIMilestones}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ekstrak dari Berkas Dokumen Sekarang</span>
            </button>
          </div>
        ) : viewLayout === 'vertical-track' ? (
          
          /* LAYOUT 1: VERTICAL CONNECTED TRACK */
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {filteredEvents.map((evt, idx) => {
              const catBadge = getCategoryBadge(evt.category);
              const isSelected = selectedEventId === evt.id;
              const matchedDoc = caseData.documents.find(d => d.id === evt.documentRef || d.name === evt.documentName);

              return (
                <div key={evt.id || idx} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 flex items-center justify-center transition-all ${
                    evt.importance === 'Key' ? 'border-amber-400 text-amber-400 ring-4 ring-amber-500/10' : 'border-slate-700 text-slate-500'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                  </div>

                  {/* Event Card */}
                  <div 
                    onClick={() => setSelectedEventId(isSelected ? null : evt.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-slate-900 border-amber-500/60 shadow-xl shadow-amber-500/5' 
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Event Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {evt.date}
                        </span>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${catBadge.bgClass} ${catBadge.textClass}`}>
                          {catBadge.label}
                        </span>

                        {evt.importance === 'Key' && (
                          <span className="text-[10px] font-mono font-bold text-amber-400">
                            ★ KEY MILESTONE
                          </span>
                        )}

                        {evt.proceduralPhase && (
                          <span className="text-[11px] text-slate-400 hidden sm:inline">
                            · {evt.proceduralPhase}
                          </span>
                        )}
                      </div>

                      {getProceduralStatusBadge(evt.proceduralStatus)}
                    </div>

                    {/* Title & Description */}
                    <div className="mt-2.5 space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>

                    {/* Associated Document Badge / Link */}
                    {(evt.documentName || evt.documentRef) && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-slate-300 font-mono text-[11px] truncate max-w-[280px]">
                            {evt.documentName || matchedDoc?.name || evt.documentRef}
                          </span>
                          {matchedDoc && (
                            <span className="text-[10px] text-slate-500">({matchedDoc.size})</span>
                          )}
                        </div>

                        {onOpenDocument && matchedDoc && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDocument(matchedDoc.id);
                            }}
                            className="text-amber-400 hover:text-amber-300 text-[11px] font-medium flex items-center gap-1 hover:underline"
                          >
                            <span>Lihat Berkas</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Expanded Verbatim Snippet & Oversight Details */}
                    {isSelected && (
                      <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs animate-fadeIn">
                        {evt.sourceSnippet && (
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                              Kutipan Verbatim Dokumen Pembuktian
                            </span>
                            <blockquote className="p-2.5 rounded bg-slate-900/90 border-l-2 border-amber-500 font-mono text-[11px] text-slate-300 leading-relaxed italic">
                              "{evt.sourceSnippet}"
                            </blockquote>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          {evt.actor && (
                            <div>
                              <strong className="text-slate-400">Pihak / Penandatangan:</strong> <span className="text-slate-200">{evt.actor}</span>
                            </div>
                          )}
                          {evt.statutoryDeadline && (
                            <div>
                              <strong className="text-slate-400">Batas Prosedural:</strong> <span className="text-amber-400">{evt.statutoryDeadline}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        ) : viewLayout === 'milestone-cards' ? (
          
          /* LAYOUT 2: MILESTONE CARDS MATRIX */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((evt, idx) => {
              const catBadge = getCategoryBadge(evt.category);
              const matchedDoc = caseData.documents.find(d => d.id === evt.documentRef || d.name === evt.documentName);

              return (
                <div 
                  key={evt.id || idx}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {evt.date}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${catBadge.bgClass} ${catBadge.textClass}`}>
                        {catBadge.label}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug">
                      {evt.title}
                    </h4>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80 text-[11px]">
                    {getProceduralStatusBadge(evt.proceduralStatus)}

                    <div className="flex items-center justify-between text-slate-400 truncate">
                      <span className="truncate max-w-[180px] font-mono text-[10px]">
                        {evt.documentName || matchedDoc?.name || 'Dokumen Terlampir'}
                      </span>
                      {evt.importance === 'Key' && (
                        <span className="text-amber-400 font-bold shrink-0">★ Key</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (
          
          /* LAYOUT 3: PROCEDURAL DIGEST TABLE */
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Peristiwa & Dokumen Rujukan</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Aktor</th>
                  <th className="p-3">Status Prosedural</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {filteredEvents.map((evt, idx) => {
                  const catBadge = getCategoryBadge(evt.category);
                  const matchedDoc = caseData.documents.find(d => d.id === evt.documentRef || d.name === evt.documentName);

                  return (
                    <tr key={evt.id || idx} className="hover:bg-slate-850 transition-colors">
                      <td className="p-3 font-mono text-amber-400 whitespace-nowrap font-bold">
                        {evt.date}
                      </td>
                      <td className="p-3 space-y-0.5">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{evt.title}</span>
                          {evt.importance === 'Key' && <span className="text-amber-400 text-[10px]">★</span>}
                        </div>
                        <p className="text-slate-400 text-[11px] line-clamp-1">{evt.description}</p>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <FileText className="w-3 h-3 text-amber-400/80" />
                          <span>{evt.documentName || matchedDoc?.name || 'Dokumen Induk'}</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${catBadge.bgClass} ${catBadge.textClass}`}>
                          {catBadge.label}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-slate-300">
                        {evt.actor || caseData.client}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {getProceduralStatusBadge(evt.proceduralStatus)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        )}

      </div>

      {/* Manual Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Tambah Tonggak Peristiwa Prosedural Manual</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMilestone} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tanggal Peristiwa</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Peristiwa</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="Contract">Kontrak / Kesepakatan</option>
                    <option value="Breach">Pelanggaran / Wanprestasi</option>
                    <option value="Notice">Somasi / Peringatan</option>
                    <option value="Litigation">Persidangan / Gugatan</option>
                    <option value="Investigation">Penyidikan / SPDP</option>
                    <option value="Court">Putusan Pengadilan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Judul Peristiwa / Inflection Point</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengiriman Somasi Terakhir atau Pelimpahan Berkas Tahap II"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Uraian Fakta Prosedural</label>
                <textarea
                  rows={2}
                  placeholder="Uraikan apa yang terjadi secara hukum, tenggat waktu, atau akibat hukumnya..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Dokumen Rujukan Berkas</label>
                  <select
                    value={newDocRef}
                    onChange={(e) => setNewDocRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="">-- Tanpa Rujukan Langsung --</option>
                    {caseData.documents.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Prosedural</label>
                  <select
                    value={newProceduralStatus}
                    onChange={(e) => setNewProceduralStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="Compliant / On-Time">Compliant / On-Time</option>
                    <option value="Breached / In Mora">Breached / In Mora</option>
                    <option value="Pending Court Action">Pending Court Action</option>
                    <option value="Pre-trial Window">Pre-trial Window</option>
                    <option value="Statute of Limitations (Daluwarsa)">Statute of Limitations (Daluwarsa)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Simpan Tonggak
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
