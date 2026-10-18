import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  FileText, 
  Layers, 
  Scale, 
  GitMerge, 
  BookOpen, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { LegalCase } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: LegalCase[];
  onSelectCase: (caseId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  cases,
  onSelectCase,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search Results
  const matchingCases = cases.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.refNumber.toLowerCase().includes(query.toLowerCase()) ||
    c.client.toLowerCase().includes(query.toLowerCase()) ||
    c.opposingParty.toLowerCase().includes(query.toLowerCase())
  );

  const allDocuments = cases.flatMap(c => c.documents.map(d => ({ ...d, caseId: c.id, caseTitle: c.title })));
  const matchingDocuments = query ? allDocuments.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.category.toLowerCase().includes(query.toLowerCase())
  ) : [];

  const allStatutes = cases.flatMap(c => c.statutes.map(s => ({ ...s, caseId: c.id, caseTitle: c.title })));
  const matchingStatutes = query ? allStatutes.filter(s =>
    s.article.toLowerCase().includes(query.toLowerCase()) ||
    s.lawName.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 divide-y divide-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            id="global-spotlight-input"
            type="text"
            autoFocus
            placeholder="Ketik kata kunci perkara, dokumen bukti, pasal KUHPerdata/UU, atau nama pihak..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button 
            id="close-search-btn"
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-4 text-xs">
          
          {/* Matching Cases */}
          {matchingCases.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Perkara Terkait ({matchingCases.length})
              </span>
              <div className="space-y-1">
                {matchingCases.map((c) => (
                  <button
                    key={c.id}
                    id={`search-result-case-${c.id}`}
                    onClick={() => {
                      onSelectCase(c.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {c.refNumber} • {c.client} vs {c.opposingParty}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Documents */}
          {matchingDocuments.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Dokumen Bukti ({matchingDocuments.length})
              </span>
              <div className="space-y-1">
                {matchingDocuments.slice(0, 5).map((doc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectCase(doc.caseId);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {doc.category} • Pada {doc.caseTitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Statutes */}
          {matchingStatutes.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Rujukan Peraturan & Pasal ({matchingStatutes.length})
              </span>
              <div className="space-y-1">
                {matchingStatutes.slice(0, 4).map((st, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectCase(st.caseId);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {st.article} — {st.lawName}
                        </p>
                        <p className="text-[11px] text-slate-400">{st.relevance}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingCases.length === 0 && matchingDocuments.length === 0 && matchingStatutes.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Tidak ditemukan hasil untuk "{query}"
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Gunakan panah atau klik untuk navigasi</span>
          <span>Pencarian Cepat Spotlight</span>
        </div>

      </div>
    </div>
  );
};
