import React, { useState } from 'react';
import { 
  FileSignature, 
  Sparkles, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Edit3, 
  Trash2,
  Calendar,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { LegalCase, ContractReconstruction, ContractClauseItem } from '../types';

interface ContractReconstructionViewProps {
  caseData: LegalCase;
  onUpdateCase: (updatedCase: LegalCase) => void;
}

export const ContractReconstructionView: React.FC<ContractReconstructionViewProps> = ({
  caseData,
  onUpdateCase,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize or get existing contract reconstruction data
  const contractData: ContractReconstruction = caseData.contractReconstruction || {
    contractTitle: `Perjanjian Kerjasama Pokok (${caseData.client} & ${caseData.opposingParty})`,
    contractType: 'Written Agreement',
    executionDate: caseData.contractDate || '2025-01-15',
    effectiveDate: caseData.contractDate || '2025-01-15',
    governingLaw: 'Hukum Positif Republik Indonesia (KUHPerdata)',
    disputeForum: caseData.courtForum || 'Pengadilan Negeri Jakarta Pusat',
    amendments: [
      {
        id: 'amd-1',
        date: '2025-03-01',
        title: 'Addendum I - Perubahan Jadwal Pembayaran & Termin',
        description: 'Penyesuaian termin pembayaran tahap II dan penegasan klausul denda keterlambatan 1‰ per hari.',
      }
    ],
    clauses: [
      {
        id: 'cl-1',
        clauseNumber: 'Pasal 3 ayat (2)',
        title: 'Kewajiban Pembayaran Termin II',
        verbatimText: 'Pihak Tergugat wajib melunasi pembayaran termin kedua selambat-lambatnya 14 hari kalender setelah invoice dan BAST diterbitkan.',
        obligorParty: caseData.opposingParty,
        beneficiaryParty: caseData.client,
        performanceStandard: 'Pembayaran tunai via transfer rekening terlampir',
        breachIndicator: 'Tergugat menunggak lebih dari 60 hari kalender sejak BAST diterima',
        status: 'Alleged Default',
        riskScore: 'Critical',
      },
      {
        id: 'cl-2',
        clauseNumber: 'Pasal 7 ayat (1)',
        title: 'Klausul Denda Keterlambatan (Penalty)',
        verbatimText: 'Keterlambatan pemenuhan prestasi dikenakan denda sebesar 1‰ (satu permil) per hari keterlambatan hingga maksimal 5% dari total nilai kontrak.',
        obligorParty: caseData.opposingParty,
        beneficiaryParty: caseData.client,
        performanceStandard: 'Perhitungan denda otomatis terakumulasi dalam invoice penagihan',
        breachIndicator: 'Denda belum dibayar bersamaan dengan pokok tunggakan',
        status: 'Alleged Default',
        riskScore: 'High',
      },
      {
        id: 'cl-3',
        clauseNumber: 'Pasal 11 ayat (3)',
        title: 'Klausul Penyelesaian Sengketa & Domisili Hukum',
        verbatimText: 'Segala perselisihan yang timbul dari perjanjian ini diselesaikan melalui musyawarah, dan apabila tidak tercapai kata mufakat, para pihak memilih domisili hukum di Kepaniteraan Pengadilan Negeri.',
        obligorParty: 'Kedua Belah Pihak',
        beneficiaryParty: 'Kedua Belah Pihak',
        performanceStandard: 'Somasi tertulis minimal 2 kali sebelum pendaftaran gugatan',
        breachIndicator: 'Somasi telah disampaikan dan tenggat waktu telah lampau',
        status: 'Fulfilled',
        riskScore: 'Low',
      }
    ],
    defaultAnalysis: `Berdasarkan rekonstruksi dokumen perjanjian dan addendum, Tergugat (${caseData.opposingParty}) terbukti telah cidera janji (wanprestasi) atas Pasal 3 ayat (2) jo. Pasal 1243 KUHPerdata, di mana prestasi pokok dan denda keterlambatan tidak dipenuhi meskipun telah diberikan surat teguran resmi.`,
  };

  const handleAIReconstruct = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/reconstruct-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });

      const data = await res.json();
      if (data.reconstruction) {
        onUpdateCase({
          ...caseData,
          contractReconstruction: data.reconstruction,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Contract AI reconstruction failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateClauseStatus = (clauseId: string, newStatus: ContractClauseItem['status']) => {
    const updatedClauses = contractData.clauses.map(c => 
      c.id === clauseId ? { ...c, status: newStatus } : c
    );
    onUpdateCase({
      ...caseData,
      contractReconstruction: {
        ...contractData,
        clauses: updatedClauses,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Module Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <FileSignature className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                SOP LCA-005
              </span>
              <h3 className="text-sm font-bold text-white">Rekonstruksi Kontrak & Klausul Wanprestasi</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pembedahan struktural hak, kewajiban, PO/WO, Berita Acara (BAST), Addendum, dan indikator cidera janji.
            </p>
          </div>
        </div>

        <button
          onClick={handleAIReconstruct}
          disabled={isAnalyzing}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Merekontruksi Kontrak...' : 'AI Reconstruct Kontrak'}</span>
        </button>
      </div>

      {/* Contract Metadata Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Tipe Perikatan</span>
          <p className="text-xs font-semibold text-white">{contractData.contractType}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Tanggal Penandatanganan</span>
          <p className="text-xs font-semibold text-slate-200">{contractData.executionDate}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Hukum yang Berlaku</span>
          <p className="text-xs font-semibold text-amber-300">{contractData.governingLaw}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Forum Penyelesaian</span>
          <p className="text-xs font-semibold text-slate-200 truncate">{contractData.disputeForum}</p>
        </div>
      </div>

      {/* Default Analysis Summary Box */}
      <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Analisis Pelanggaran / Indikasi Wanprestasi Teridentifikasi</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {contractData.defaultAnalysis}
        </p>
      </div>

      {/* Clauses Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Daftar Klausul Kunci & Standar Prestasi ({(contractData?.clauses || []).length} Klausul)
          </h4>
        </div>

        <div className="space-y-3">
          {(contractData?.clauses || []).map((clause) => {
            const isBreach = clause.status === 'Alleged Default';
            return (
              <div 
                key={clause.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBreach 
                    ? 'bg-rose-950/20 border-rose-800/50' 
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{clause.clauseNumber}</span>
                      <h5 className="text-xs font-bold text-white">{clause.title}</h5>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        clause.riskScore === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        clause.riskScore === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {clause.riskScore} Risk
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateClauseStatus(clause.id, 'Alleged Default')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        clause.status === 'Alleged Default'
                          ? 'bg-rose-500 text-slate-950 border-rose-500 font-bold'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      Wanprestasi
                    </button>
                    <button
                      onClick={() => handleUpdateClauseStatus(clause.id, 'Fulfilled')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        clause.status === 'Fulfilled'
                          ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-bold'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      Terpenuhi
                    </button>
                  </div>
                </div>

                <blockquote className="text-xs italic text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 mb-3 font-serif">
                  "{clause.verbatimText}"
                </blockquote>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Standar Pemenuhan Prestasi:</span>
                    <p className="text-slate-300">{clause.performanceStandard}</p>
                  </div>
                  <div className="space-y-1 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/30">
                    <span className="text-[10px] font-mono text-rose-400 uppercase block">Indikator Cidera Janji (Default):</span>
                    <p className="text-rose-300 font-medium">{clause.breachIndicator}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
