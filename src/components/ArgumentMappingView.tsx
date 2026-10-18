import React, { useState } from 'react';
import { 
  Swords, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Zap, 
  ChevronRight,
  Plus,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { LegalCase, SymmetricArgument } from '../types';

interface ArgumentMappingViewProps {
  caseData: LegalCase;
  onUpdateCase: (updatedCase: LegalCase) => void;
}

export const ArgumentMappingView: React.FC<ArgumentMappingViewProps> = ({
  caseData,
  onUpdateCase,
}) => {
  const [isMapping, setIsMapping] = useState(false);
  const [activeIssueIdx, setActiveIssueIdx] = useState(0);

  const defaultArguments: SymmetricArgument[] = (caseData?.symmetricArguments?.length || 0) > 0 
    ? caseData.symmetricArguments! 
    : [
      {
        issueId: 'iss-1',
        issueTitle: 'Keabsahan Somasi & Terpenuhinya Syarat Wanprestasi (Pasal 1243 KUHPerdata)',
        claimantArgument: `Klien (${caseData.client}) telah mengirimkan 2 (dua) kali surat somasi tertulis secara patut yang memberi tenggat waktu 7 hari kerja. Tergugat tetap tidak melunasi kewajiban pembayaran, sehingga demi hukum Tergugat telah berada dalam keadaan lalai (in mora).`,
        defendantArgument: `Tergugat diperkirakan akan berdalih bahwa somasi prematur karena adanya kesepakatan lisan perpanjangan waktu (penundaan pembayaran) dan bahwa keterlambatan disebabkan keadaan memaksa (overmacht / force majeure finansial).`,
        stressTestAnalysis: `Bantahan overmacht Tergugat sangat lemah karena klausul force majeure dalam kontrak tertulis mensyaratkan pemberitahuan tertulis 3x24 jam dan bencana alam, bukan sekadar kesulitan likuiditas keuangan.`,
        weaknessAnalysis: `Perlu dipastikan tanda terima fisik/ekspedisi surat somasi ke-1 dan ke-2 telah tertandatangani oleh pejabat berwenang Tergugat agar tidak disangkal dalam eksepsi formal.`,
        counterstrategy: `Siapkan bukti tanda terima kurir resmi, log email somasi, dan tegaskan asas Pacta Sunt Servanda (Pasal 1338 ayat 1 KUHPerdata) bahwa perjanjian tidak dapat dibatalkan secara sepihak.`,
      },
      {
        issueId: 'iss-2',
        issueTitle: 'Kewajiban Pembayaran Bunga Moratoir 6% per Tahun (Pasal 1250 KUHPerdata)',
        claimantArgument: `Akibat kelalaian pembayaran uang sejumlah pokok, Klien berhak atas bunga moratoir sebesar 6% setahun terhitung sejak somasi pertama diajukan hingga pelunasan seketika dan sekaligus.`,
        defendantArgument: `Tergugat akan mendalilkan bahwa bunga tidak diperjanjikan secara tegas dalam klausul kontrak dan karenanya tuntutan bunga harus ditolak (ultra petita).`,
        stressTestAnalysis: `Bunga moratoir merupakan bunga undang-undang (wettelijke rente) yang otomatis timbul berdasarkan Pasal 1250 KUHPerdata dan Yurisprudensi MA No. 272 K/Pdt/1983 tanpa mensyaratkan pencantuman klausul bunga secara eksplisit.`,
        weaknessAnalysis: `Perhitungan tanggal mulai berlakunya bunga harus dihitung persis dari tanggal diterimanya somasi, bukan dari tanggal penerbitan invoice awal.`,
        counterstrategy: `Tautkan Yurisprudensi Tetap Mahkamah Agung RI mengenai bunga keterlambatan pembayaran sejumlah uang dalam berkas replik.`,
      }
    ];

  const handleAIMapArguments = async () => {
    setIsMapping(true);
    try {
      const res = await fetch('/api/gemini/map-arguments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });

      const data = await res.json();
      if (data.arguments && data.arguments.length > 0) {
        onUpdateCase({
          ...caseData,
          symmetricArguments: data.arguments,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Argument mapping failed', err);
    } finally {
      setIsMapping(false);
    }
  };

  const selectedArg = defaultArguments[activeIssueIdx] || defaultArguments[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                SOP LCA-009
              </span>
              <h3 className="text-sm font-bold text-white">Argument Mapping Tool (Claims vs Counter-Claims)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pemetaan simetris dalil hukum: Posita Klien vs Tangkisan Tergugat, Uji Stres Kelemahan, & Strategi Replik.
            </p>
          </div>
        </div>

        <button
          onClick={handleAIMapArguments}
          disabled={isMapping}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isMapping ? 'animate-spin' : ''}`} />
          <span>{isMapping ? 'Memetakan Argumen...' : 'AI Auto-Map Argumen'}</span>
        </button>
      </div>

      {/* Issues Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {defaultArguments.map((arg, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIssueIdx(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
              activeIssueIdx === idx
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[10px]">
              {idx + 1}
            </span>
            <span className="truncate max-w-[280px]">{arg.issueTitle}</span>
          </button>
        ))}
      </div>

      {/* Selected Issue Detail Card */}
      {selectedArg && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-mono uppercase text-purple-400 mb-1">Pokok Sengketa / Issue Under Scrutiny</h4>
            <p className="text-sm font-bold text-white">{selectedArg.issueTitle}</p>
          </div>

          {/* Side-by-Side Comparison: Claimant vs Defendant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Claimant (Our Client) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-900/40 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-bold text-emerald-400">Dalil Penggugat (Posita Klien)</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{caseData.client}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans pt-1">
                  {selectedArg.claimantArgument}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Posisi diperkuat alat bukti surat & somasi resmi.</span>
              </div>
            </div>

            {/* Defendant (Opposing Party) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-rose-900/40 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                    <span className="text-xs font-bold text-rose-400">Proyeksi Eksepsi & Tangkisan Tergugat</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{caseData.opposingParty}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                  {selectedArg.defendantArgument}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Antisipasi eksepsi kompetensi relatif atau klausul force majeure.</span>
              </div>
            </div>

          </div>

          {/* Stress-Test & Counter-Strategy Deep Dive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Stress Test */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Uji Kekuatan Dalil (Stress-Test & Weakness Analysis)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedArg.stressTestAnalysis}
              </p>
              {selectedArg.weaknessAnalysis && (
                <p className="text-xs text-amber-200/90 pt-1 border-t border-slate-800/80">
                  <strong className="text-amber-400">Titik Perhatian:</strong> {selectedArg.weaknessAnalysis}
                </p>
              )}
            </div>

            {/* Counter-Strategy Rebuttal */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Rekomendasi Taktik Replik & Bukti Pematahan</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedArg.counterstrategy}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
