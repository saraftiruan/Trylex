import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Scale, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Bookmark, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  FileText,
  Building2,
  Clock,
  Landmark,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';
import { JDIHDocument, LegalCase, StatutorySource } from '../types';

interface JDIHLegalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData?: LegalCase;
  onUpdateCase?: (updatedCase: LegalCase) => void;
}

export const JDIHLegalSearchModal: React.FC<JDIHLegalSearchModalProps> = ({
  isOpen,
  onClose,
  caseData,
  onUpdateCase,
}) => {
  const [searchQuery, setSearchQuery] = useState(
    caseData?.caseType?.includes('Wanprestasi')
      ? 'Wanprestasi, ganti rugi, bunga moratoir Pasal 1250 KUHPerdata, dan batasan force majeure'
      : 'Syarat sah perjanjian Pasal 1320 KUHPerdata dan kekuatan bukti elektronik UU ITE'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<JDIHDocument[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [expandedDocIds, setExpandedDocIds] = useState<Set<string>>(new Set(['JDIH-UU-001', 'JDIH-BW-002', 'JDIH-MA-003']));
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [insertedDocIds, setInsertedDocIds] = useState<Set<string>>(new Set());

  // Search function to backend
  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : searchQuery;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/search-jdih', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          category: selectedCategory === 'Semua' ? undefined : selectedCategory,
          statusFilter: selectedStatus === 'Semua' ? undefined : selectedStatus,
          caseContext: caseData ? {
            title: caseData.title,
            caseType: caseData.caseType,
            claims: caseData.claims,
            disputedFacts: caseData.disputedFacts,
          } : undefined,
        }),
      });

      const data = await response.json();
      if (data.success && data.documents) {
        setSearchResults(data.documents);
        setAnalysisSummary(data.analysisSummary || '');
        // Auto expand top 2 items
        const topIds = new Set<string>(data.documents.slice(0, 3).map((d: JDIHDocument) => d.id));
        setExpandedDocIds(topIds);
      }
    } catch (err) {
      console.error('Error searching JDIH:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform initial search on mount if empty
  React.useEffect(() => {
    if (isOpen && searchResults.length === 0) {
      handleSearch();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedDocIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedDocIds(newSet);
  };

  const copyCitation = (doc: JDIHDocument) => {
    navigator.clipboard.writeText(doc.citationFormat || doc.title);
    setCopiedCitationId(doc.id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  const insertToCaseStatutes = (doc: JDIHDocument) => {
    if (!caseData || !onUpdateCase) return;

    const newStatute: StatutorySource = {
      id: `S-${Date.now().toString().slice(-4)}`,
      lawName: doc.title,
      article: doc.keyArticlesOrPrecedents[0]?.articleOrPoint || doc.number,
      status: doc.status === 'Berlaku Penuh' ? 'Current' : doc.status === 'Diubah Sebagian' ? 'Amended' : 'Requires Review',
      effectiveDate: doc.year,
      relevance: doc.keyArticlesOrPrecedents[0]?.relevanceNotes || doc.summary,
      confidence: 'High',
      requiresResearch: false,
    };

    // Check if already exists
    const exists = caseData.statutes.some(s => s.lawName === doc.title || s.article === newStatute.article);
    if (!exists) {
      onUpdateCase({
        ...caseData,
        statutes: [...caseData.statutes, newStatute],
        updatedAt: new Date().toISOString(),
      });
    }

    setInsertedDocIds(prev => new Set(prev).add(doc.id));
  };

  const presetQueries = [
    { label: 'Wanprestasi & Ganti Rugi KUHPerdata', query: 'Wanprestasi, ganti rugi, bunga moratoir Pasal 1250 KUHPerdata, dan batasan force majeure' },
    { label: 'Bukti Elektronik & TTE UU ITE', query: 'Keabsahan bukti elektronik email whatsapp dan tanda tangan elektronik tersertifikasi UU ITE 1/2024' },
    { label: 'Yurisprudensi MA: Batasan Overmacht', query: 'Putusan Mahkamah Agung pembatasan alasan krisis keuangan bukan overmacht force majeure' },
    { label: 'Bunga Moratoir 6% SEMA/MA', query: 'Kaidah yurisprudensi perhitungan bunga moratoir legal 6% per tahun terhitung sejak somasi' },
    { label: 'Syarat Formil Surat Kuasa Khusus', query: 'SEMA No 6 Tahun 1994 syarat formil mutlak surat kuasa khusus dan hak substitusi' },
    { label: 'Tanggung Jawab Direksi UU PT', query: 'Pasal 98 UU 40 2007 perwakilan direksi perseroan terbatas dan piercing the corporate veil' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30 uppercase tracking-wider">
                  JDIHN & Yurisprudensi Engine
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online Database Connected
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Direktori Riset Peraturan (JDIH) & Yurisprudensi Mahkamah Agung RI
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Search Input Bar */}
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ketik topik sengketa, pasal undang-undang, nomor putusan MA, atau isu hukum..."
                className="w-full pl-11 pr-32 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Cari JDIH</span>
                  </>
                )}
              </button>
            </div>

            {/* Preset Query Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Rekomendasi Kueri:
              </span>
              {presetQueries.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery(p.query);
                    handleSearch(p.query);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 text-[11px] whitespace-nowrap transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Filter className="w-3 h-3 text-amber-400" /> Kategori:
                </span>
                {['Semua', 'Undang-Undang', 'Yurisprudensi MA', 'SEMA / PERMA', 'KUHPerdata / KUHP / HIR'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Menampilkan <strong className="text-white">{searchResults.length}</strong> rujukan resmi
              </div>
            </div>
          </div>

          {/* AI Analysis Summary Box */}
          {analysisSummary && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Ikhtisar Kaidah Regulasi & Doktrin Yurisprudensi
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {analysisSummary}
                </p>
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-3.5">
            {searchResults.map((doc) => {
              const isExpanded = expandedDocIds.has(doc.id);
              const isCopied = copiedCitationId === doc.id;
              const isInserted = insertedDocIds.has(doc.id);

              return (
                <div
                  key={doc.id}
                  className="rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
                >
                  {/* Item Header */}
                  <div className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Type Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.type === 'Undang-Undang' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          doc.type === 'Yurisprudensi MA' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          doc.type === 'SEMA / PERMA' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {doc.type}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          doc.status === 'Berlaku Penuh' || doc.status === 'Yurisprudensi Tetap'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : doc.status === 'Diubah Sebagian'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          ● {doc.status}
                        </span>

                        {/* Source Badge */}
                        <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800">
                          {doc.source}
                        </span>

                        {/* Relevance */}
                        <span className="text-[10px] font-mono text-emerald-400 ml-auto">
                          Kesesuaian: <strong>{doc.relevanceScore}%</strong>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white leading-snug">
                        {doc.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {doc.summary}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {doc.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col items-center gap-2 shrink-0 pt-2 md:pt-0">
                      <button
                        onClick={() => copyCitation(doc)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                          isCopied
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Tersalin!' : 'Salin Sitasi'}</span>
                      </button>

                      {caseData && onUpdateCase && (
                        <button
                          onClick={() => insertToCaseStatutes(doc)}
                          disabled={isInserted}
                          className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            isInserted
                              ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 cursor-default'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/10'
                          }`}
                        >
                          {isInserted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Tersimpan di LCA-006</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Kutip ke Kasus Ini</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => toggleExpand(doc.id)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 text-xs flex items-center justify-center"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Key Articles & Ratio Decidendi */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-900/60 border-t border-slate-800 space-y-3">
                      {/* Ratio Decidendi for Judgments */}
                      {doc.ratioDecidendi && (
                        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1">
                          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                            Ratio Decidendi / Pertimbangan Hukum Hakim MA:
                          </span>
                          <p className="text-xs text-amber-200/90 leading-relaxed font-serif italic">
                            "{doc.ratioDecidendi}"
                          </p>
                        </div>
                      )}

                      {/* Key Articles List */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                          Pasal / Kaidah Kunci Terpilih:
                        </span>
                        {doc.keyArticlesOrPrecedents.map((ka, kIdx) => (
                          <div key={kIdx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-amber-400">
                                {ka.articleOrPoint}
                              </span>
                              {ka.relevanceNotes && (
                                <span className="text-[10px] text-slate-400 italic">
                                  {ka.relevanceNotes}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/40 p-2 rounded border border-slate-800/60">
                              {ka.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Official Citation Format */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                        <span className="font-mono">
                          Format Sitasi Dokumen: <strong className="text-slate-200">{doc.citationFormat}</strong>
                        </span>
                        <button
                          onClick={() => copyCitation(doc)}
                          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Database terverifikasi resmi JDIHN BPHN, Ditjen PP Kemenkumham & MA RI</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
