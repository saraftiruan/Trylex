import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Scale, 
  ShieldAlert, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  Swords, 
  Gavel, 
  TrendingUp,
  RefreshCw,
  Award
} from 'lucide-react';
import { LegalCase } from '../types';

interface AIJudicialSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: LegalCase;
}

interface JudicialSimulationResult {
  successProbability: number;
  judicialPosture: string;
  criticalVulnerabilities: string[];
  opposingCounterAttack: string;
  judgeBenchQuestions: string[];
  mitigationChecklist: string[];
}

export const AIJudicialSimulatorModal: React.FC<AIJudicialSimulatorModalProps> = ({
  isOpen,
  onClose,
  caseData,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulation, setSimulation] = useState<JudicialSimulationResult | null>(null);

  if (!isOpen) return null;

  const handleRunSimulation = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/gemini/simulate-stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });

      const data = await res.json();
      if (data.simulation) {
        setSimulation(data.simulation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AI Judicial Scrutiny & Stress-Test Simulator</h3>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-mono border border-purple-500/20">
                  Bench Simulation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Uji ketahanan dalil & simulasi cecaran Majelis Hakim perkara <span className="font-mono text-slate-300">{caseData.refNumber}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          
          {!simulation && !isRunning && (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                <Scale className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h4 className="text-sm font-bold text-white">Jalankan Simulasi Pemeriksaan Peradilan</h4>
                <p className="text-xs text-slate-400">
                  Model AI akan berperan sebagai Majelis Hakim Pengadilan Niaga / Negeri untuk membedah titik lemah bukti Anda, memproyeksikan serangan lawan, dan menghitung estimasi probabilitas kemenangan.
                </p>
              </div>

              <button
                id="start-judicial-sim-btn"
                onClick={handleRunSimulation}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 mx-auto shadow-lg shadow-purple-500/20 transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mulai Uji Stres Peradilan</span>
              </button>
            </div>
          )}

          {isRunning && (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Memproses Simulasi Meja Hijau...</h4>
                <p className="text-xs text-slate-400">
                  Menganalisis {(caseData?.facts || []).length} butir fakta, {(caseData?.evidenceMatrix || []).length} alat bukti, dan mensimulasikan argumen tangkisan lawan.
                </p>
              </div>
            </div>
          )}

          {simulation && !isRunning && (
            <div className="space-y-6">
              
              {/* Score & Posture Metric Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider mb-2">
                    Estimasi Probabilitas Menang
                  </span>
                  <div className="text-4xl font-black text-purple-400 mb-1">
                    {simulation.successProbability}%
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                    <div 
                      className="bg-purple-500 h-full transition-all duration-500" 
                      style={{ width: `${simulation.successProbability}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Berdasarkan kelengkapan alat bukti & ketiadaan eksepsi mutlak
                  </span>
                </div>

                <div className="md:col-span-8 p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-center space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Gavel className="w-4 h-4 text-purple-400" />
                    <span>Kecenderungan Pandangan Majelis Hakim (Judicial Posture)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {simulation.judicialPosture}
                  </p>
                </div>
              </div>

              {/* Opposing Attack & Judge Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Opposing Counter Attack */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-rose-900/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 border-b border-slate-800 pb-2">
                    <Swords className="w-4 h-4 text-rose-400" />
                    <span>Proyeksi Serangan Kuasa Hukum Lawan</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {simulation.opposingCounterAttack}
                  </p>
                </div>

                {/* Judge Bench Scrutiny Questions */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-900/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 border-b border-slate-800 pb-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Pertanyaan Cecaran Majelis Hakim</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {simulation.judgeBenchQuestions?.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Critical Vulnerabilities & Mitigation Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Vulnerabilities */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 border-b border-slate-800 pb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Titik Lemah / Vulnerabilitas Pembuktian</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {simulation.criticalVulnerabilities?.map((vuln, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{vuln}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mitigation Checklist */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 border-b border-slate-800 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tindakan Mitigasi yang Direkomendasikan</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {simulation.mitigationChecklist?.map((mit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{mit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Re-run button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleRunSimulation}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ulangi Simulasi</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
