import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Plus, 
  DollarSign, 
  Percent, 
  Calendar, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  Trash2,
  Receipt
} from 'lucide-react';
import { LegalCase, QuantumCalculation, QuantumDamageItem } from '../types';

interface QuantumCalculatorViewProps {
  caseData: LegalCase;
  onUpdateCase: (updatedCase: LegalCase) => void;
}

export const QuantumCalculatorView: React.FC<QuantumCalculatorViewProps> = ({
  caseData,
  onUpdateCase,
}) => {
  // Parse base claim from string or existing calculation
  const parseAmountFromString = (str?: string): number => {
    if (!str) return 850000000;
    const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) || num === 0 ? 850000000 : num;
  };

  const initialCalc: QuantumCalculation = caseData.quantumCalculation || {
    principalClaim: parseAmountFromString(caseData.claimAmount),
    contractualPenalty: 85000000,
    statutoryInterestRate: 6, // 6% per annum (Pasal 1250 KUHPerdata / LN 1848 No. 22)
    interestPeriodMonths: 8,
    immaterialDamages: 200000000,
    otherCosts: 25000000,
    currency: 'IDR',
    calculationNotes: 'Perhitungan tuntutan ganti rugi materiil pokok, denda keterlambatan kontrak (1‰/hari), serta bunga moratoir undang-undang 6% per tahun sejak somasi dilayangkan.',
    items: [
      {
        id: 'q-1',
        category: 'Kerugian Pokok (Materil)',
        description: 'Tunggakan pembayaran termin II atas penyerahan pekerjaan sesuai BAST No. 042/BAST/2025',
        claimedAmount: parseAmountFromString(caseData.claimAmount),
        provenAmount: parseAmountFromString(caseData.claimAmount),
        legalBasis: 'Pasal 1243 KUHPerdata jo. Pasal 3 Perjanjian',
        evidenceRef: 'BAST & Invoice Penagihan Resmi (Bukti P-3)',
        status: 'Fully Documented',
      },
      {
        id: 'q-2',
        category: 'Denda Keterlambatan Kontraktual',
        description: 'Denda keterlambatan 1‰ per hari kalender (maksimal 5% dari total nilai perikatan)',
        claimedAmount: 85000000,
        provenAmount: 85000000,
        legalBasis: 'Pasal 7 ayat (1) Perjanjian Pokok',
        evidenceRef: 'Rekapitulasi Keterlambatan Hari Kerja (Bukti P-5)',
        status: 'Fully Documented',
      },
      {
        id: 'q-3',
        category: 'Bunga Moratoir (6% p.a.)',
        description: 'Bunga kelalaian pembayaran sejumlah uang tunai terhitung 8 bulan sejak Somasi I',
        claimedAmount: Math.round((parseAmountFromString(caseData.claimAmount) * 0.06 * 8) / 12),
        provenAmount: Math.round((parseAmountFromString(caseData.claimAmount) * 0.06 * 8) / 12),
        legalBasis: 'Pasal 1250 KUHPerdata jo. Yurisprudensi MA No. 272 K/Pdt/1983',
        evidenceRef: 'Tanda Terima Somasi I tanggal 10 Mei 2025 (Bukti P-7)',
        status: 'Fully Documented',
      },
      {
        id: 'q-4',
        category: 'Kerugian Imateril / Reputasi',
        description: 'Hilangnya kesempatan bisnis (opportunity loss) dan gangguan likuiditas operasional',
        claimedAmount: 200000000,
        provenAmount: 50000000,
        legalBasis: 'Pasal 1365 KUHPerdata / Ekuitas Hakim',
        evidenceRef: 'Laporan Finansial Internal & Surat Pembatalan Mitra Lain',
        status: 'Partially Documented',
      }
    ],
  };

  const [calc, setCalc] = useState<QuantumCalculation>(initialCalc);
  const [isCalculatingAI, setIsCalculatingAI] = useState(false);

  // Synchronize interest amount dynamically
  const computedMoratoryInterest = Math.round(
    (calc.principalClaim * (calc.statutoryInterestRate / 100) * calc.interestPeriodMonths) / 12
  );

  const totalCalculatedClaim = 
    calc.principalClaim + 
    calc.contractualPenalty + 
    computedMoratoryInterest + 
    calc.immaterialDamages + 
    calc.otherCosts;

  const totalProvenAmount = calc.items.reduce((acc, curr) => acc + (curr.provenAmount || 0), 0);

  const formatIDR = (val: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSaveCalculation = (updated: QuantumCalculation) => {
    setCalc(updated);
    onUpdateCase({
      ...caseData,
      claimAmount: formatIDR(totalCalculatedClaim),
      quantumCalculation: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAICalculate = async () => {
    setIsCalculatingAI(true);
    try {
      const res = await fetch('/api/gemini/calculate-quantum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData, currentCalc: calc }),
      });

      const data = await res.json();
      if (data.quantum) {
        handleSaveCalculation(data.quantum);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCalculatingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                SOP LCA-011
              </span>
              <h3 className="text-sm font-bold text-white">Quantum of Damages Calculator (Uji Matematis Tuntutan)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Kalkulator kerugian perdata berstandar yuridis: Pokok, Denda, Bunga Legal 6% (Pasal 1250 KUHPerdata), dan Kerugian Imateril.
            </p>
          </div>
        </div>

        <button
          onClick={handleAICalculate}
          disabled={isCalculatingAI}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isCalculatingAI ? 'animate-spin' : ''}`} />
          <span>{isCalculatingAI ? 'Menghitung Quantum...' : 'AI Audit Quantum Tuntutan'}</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Grand Claim */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Total Tuntutan (Petitum)</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{formatIDR(totalCalculatedClaim)}</div>
          <span className="text-[10px] text-slate-400 block">Total akumulasi seluruh komponen tuntutan</span>
        </div>

        {/* Principal Damage */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Kerugian Pokok (Materil)</span>
          <div className="text-lg font-bold text-slate-200">{formatIDR(calc.principalClaim)}</div>
          <span className="text-[10px] text-emerald-400 font-medium">100% didukung invoice & BAST</span>
        </div>

        {/* Moratory Interest */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">Bunga Moratoir (6%/thn)</span>
            <Percent className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-400">{formatIDR(computedMoratoryInterest)}</div>
          <span className="text-[10px] text-slate-400">{calc.interestPeriodMonths} bulan kelalaian (Pasal 1250)</span>
        </div>

        {/* Proven / Low Risk Amount */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">Estimasi Terbukti di Sidang</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-indigo-300">{formatIDR(totalProvenAmount || (calc.principalClaim + computedMoratoryInterest))}</div>
          <span className="text-[10px] text-slate-400">Berdasarkan kekuatan alat bukti fisik</span>
        </div>

      </div>

      {/* Interactive Parameters Adjuster */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-emerald-400" />
          <span>Parameter Perhitungan Matematis Yuridis</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Kerugian Pokok / Nilai Kontrak (Rp)
            </label>
            <input
              type="number"
              value={calc.principalClaim}
              onChange={(e) => handleSaveCalculation({ ...calc, principalClaim: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Denda Keterlambatan Kontraktual (Rp)
            </label>
            <input
              type="number"
              value={calc.contractualPenalty}
              onChange={(e) => handleSaveCalculation({ ...calc, contractualPenalty: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Durasi Keterlambatan (Bulan)
            </label>
            <input
              type="number"
              value={calc.interestPeriodMonths}
              onChange={(e) => handleSaveCalculation({ ...calc, interestPeriodMonths: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Bunga Moratoir Legal (% per Tahun)
            </label>
            <input
              type="number"
              value={calc.statutoryInterestRate}
              disabled
              className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 font-mono text-xs cursor-not-allowed"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Pasal 1250 KUHPerdata (Standar 6% p.a.)</span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Tuntutan Kerugian Imateril (Rp)
            </label>
            <input
              type="number"
              value={calc.immaterialDamages}
              onChange={(e) => handleSaveCalculation({ ...calc, immaterialDamages: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Biaya Kuasa Hukum & Pemulihan (Rp)
            </label>
            <input
              type="number"
              value={calc.otherCosts}
              onChange={(e) => handleSaveCalculation({ ...calc, otherCosts: Number(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>
      </div>

      {/* Itemized Quantum Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Tabel Rincian & Dasar Pembuktian Tuntutan
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Komponen Kerugian</th>
                <th className="py-3 px-3">Uraian & Dasar Fakta</th>
                <th className="py-3 px-3">Dasar Hukum</th>
                <th className="py-3 px-3">Nilai Dituntut</th>
                <th className="py-3 px-3">Alat Bukti</th>
                <th className="py-3 px-3">Status Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {calc.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{item.category}</td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs">{item.description}</td>
                  <td className="py-3 px-3 font-mono text-amber-400 text-[11px]">{item.legalBasis}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">{formatIDR(item.claimedAmount)}</td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{item.evidenceRef}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'Fully Documented' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
