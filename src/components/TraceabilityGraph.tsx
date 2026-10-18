import React, { useState } from 'react';
import { 
  GitMerge, 
  FileText, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { TraceabilityNode, LegalFact, EvidenceItem, CaseDocument } from '../types';

interface TraceabilityGraphProps {
  nodes?: TraceabilityNode[];
  facts?: LegalFact[];
  evidence?: EvidenceItem[];
  documents?: CaseDocument[];
}

export const TraceabilityGraph: React.FC<TraceabilityGraphProps> = ({
  nodes = [],
  facts = [],
  evidence = [],
  documents = [],
}) => {
  const safeNodes = nodes || [];
  const safeFacts = facts || [];
  const safeEvidence = evidence || [];
  const safeDocs = documents || [];

  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);

  if (!safeNodes || safeNodes.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40 text-slate-400 text-xs">
        Belum ada rantai penelusuran (Traceability Nodes). Jalankan pipeline ULPE-AW untuk memetakan rantai pembuktian.
      </div>
    );
  }

  const activeNode = safeNodes[selectedNodeIndex] || safeNodes[0];
  const relatedFact = safeFacts.find(f => f.id === activeNode?.factId);
  const relatedEvidence = safeEvidence.find(e => e.evidenceId === activeNode?.evidenceId);
  const relatedDoc = safeDocs.find(d => activeNode?.documentRef?.includes(d.name) || d.id === activeNode?.documentRef);

  return (
    <div className="space-y-6">
      
      {/* Node Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {nodes.map((n, idx) => (
          <button
            key={idx}
            id={`trace-node-pill-${idx}`}
            onClick={() => setSelectedNodeIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
              selectedNodeIndex === idx
                ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="font-bold">{n.conclusionId}</span>
            <span className="opacity-70 truncate max-w-[140px]">→ {n.element}</span>
          </button>
        ))}
      </div>

      {/* Visual Chain Nodes */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <GitMerge className="w-4 h-4" />
            <span>Rantai Pembuktian Berantai (Chain of Custody) untuk {activeNode?.conclusionId}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Status: Verified & Auditable</span>
        </div>

        {/* 6 Step Horizontal Flow */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-stretch">
          
          {/* Step 1: Conclusion */}
          <div className="p-3.5 rounded-xl bg-amber-500 text-slate-950 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block opacity-80">1. Kesimpulan Yuridis</span>
              <p className="text-xs font-bold mt-1 leading-snug">{activeNode?.conclusionId}</p>
            </div>
            <p className="text-[11px] font-medium mt-2 line-clamp-3">{activeNode?.conclusionText}</p>
          </div>

          {/* Step 2: Issue */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-purple-400 font-bold block">2. Pokok Masalah</span>
              <p className="text-xs font-semibold text-white mt-1 font-mono">{activeNode?.issueId}</p>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-3">Analisis wanprestasi & sanggahan</p>
          </div>

          {/* Step 3: Element */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold block">3. Unsur Norma</span>
              <p className="text-xs font-semibold text-white mt-1">Norma Hukum</p>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-3">{activeNode?.element}</p>
          </div>

          {/* Step 4: Fact */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-blue-400 font-bold block">4. Fakta Terbukti</span>
              <p className="text-xs font-semibold text-white mt-1 font-mono">{activeNode?.factId}</p>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-3">{relatedFact?.text || 'Fakta primer'}</p>
          </div>

          {/* Step 5: Evidence */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold block">5. Alat Bukti</span>
              <p className="text-xs font-semibold text-white mt-1 font-mono">{activeNode?.evidenceId}</p>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-3">{relatedEvidence?.name || 'Alat Bukti Surat'}</p>
          </div>

          {/* Step 6: Document */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-rose-400 font-bold block">6. Dokumen Fisik</span>
              <p className="text-xs font-semibold text-white mt-1">Berkas Perkara</p>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 truncate">{activeNode?.documentRef}</p>
          </div>

        </div>

        {/* Detailed Inspection Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Detail Rantai Yuridis Lengkap</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-400 pt-2 border-t border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Pernyataan Kesimpulan (Conclusion):</span>
              <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-medium">
                {activeNode?.conclusionText}
              </p>
            </div>
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Rujukan Dokumen & Bukti Pembuktian:</span>
              <p className="text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                {activeNode?.documentRef} — Alat Bukti ID: {activeNode?.evidenceId} (Kekuatan: {relatedEvidence?.reliability || 'High'})
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
