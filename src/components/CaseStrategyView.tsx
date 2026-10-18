import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Target, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Scale, 
  Building2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { LegalCase, CaseStrategyPlan } from '../types';

interface CaseStrategyViewProps {
  caseData: LegalCase;
  onUpdateCase: (updatedCase: LegalCase) => void;
}

export const CaseStrategyView: React.FC<CaseStrategyViewProps> = ({
  caseData,
  onUpdateCase,
}) => {
  const [isFormulating, setIsFormulating] = useState(false);

  const defaultStrategy: CaseStrategyPlan = caseData.strategyPlan || {
    primaryPath: 'Gugatan Perdata Wanprestasi / PMH (PN)',
    alternativePath: 'Permohonan PKPU di Pengadilan Niaga jika terdapat kreditur lain',
    settlementTarget: caseData.claimAmount || 'Rp 950.000.000 (Minimal 85% dari pokok + denda)',
    conservatorySeizureTarget: 'Sita Jaminan (Conservatoir Beslag) atas Rekening Bank Operasional Tergugat dan Aset Tanah/Bangunan Kantor Pusat Tergugat',
    executiveStrategicNotes: `Strategi penanganan perkara difokuskan pada penguncian aset likuid Tergugat melalui permohonan Sita Jaminan (Conservatoir Beslag) bersamaan dengan pendaftaran Gugatan Wanprestasi di Pengadilan Negeri. Hal ini guna mencegah Tergugat mengalihkan aset selama proses persidangan berjalan dan mendorong tercapainya kesepakatan perdamaian di ruang Mediasi Hakim (PERMA No. 1 Tahun 2016).`,
    tacticalRoadmap: [
      {
        phase: 'Fase 1: Somasi Final & Persiapan Dokumen',
        timeline: 'Minggu 1 - 2',
        actionItem: 'Kirimkan Somasi Final berbatas waktu 7 hari kerja dan lengkapi bukti legalisir/nazegelen di Kantor Pos.',
        responsibleRole: 'Lead Counsel & Legal Admin',
        riskMitigation: 'Pastikan tanda terima somasi tercatat resmi oleh ekspedisi.',
      },
      {
        phase: 'Fase 2: Pendaftaran Gugatan & Permohonan Sita Jaminan',
        timeline: 'Minggu 3 - 4',
        actionItem: 'Pendaftaran gugatan melalui e-Court Mahkamah Agung RI serta cantumkan petitum provisi / sita jaminan atas rekening bank Tergugat.',
        responsibleRole: 'Advokat / Kuasa Hukum',
        riskMitigation: 'Lakukan penelusuran aset (asset tracing) awal untuk memastikan objek sita tidak berstatus hak tanggungan bank pihak ketiga.',
      },
      {
        phase: 'Fase 3: Tahap Mediasi & Penawaran Restrukturisasi',
        timeline: 'Minggu 5 - 8',
        actionItem: 'Manfaatkan 30 hari mediasi wajib untuk menawarkan skema cicilan pelunasan dengan jaminan fidusia / personal guarantee direksi.',
        responsibleRole: 'Lead Counsel & Klien',
        riskMitigation: 'Jika mediasi gagal, pastikan akta mediasi ditandatangani dan langsung lanjut ke pembacaan gugatan.',
      },
      {
        phase: 'Fase 4: Pembuktian Dokumen & Saksi Fakta',
        timeline: 'Minggu 9 - 14',
        actionItem: 'Ajukan seluruh bukti P-1 s/d P-8 asli di persidangan beserta saksi kunci penandatangan BAST.',
        responsibleRole: 'Litigation Team',
        riskMitigation: 'Simulasikan pemeriksaan saksi fakta sebelum hadir di muka persidangan.',
      },
      {
        phase: 'Fase 5: Putusan Serta-Merta & Eksekusi',
        timeline: 'Minggu 15+',
        actionItem: 'Permohonan Putusan Serta Merta (Uitvoerbaar bij Voorraad) dan penetapan Aanmaning jika Tergugat tidak melaksanakan putusan sukarela.',
        responsibleRole: 'Managing Partner',
        riskMitigation: 'Pantau potensi upaya hukum banding dari pihak Tergugat.',
      }
    ],
  };

  const handleAIFormulate = async () => {
    setIsFormulating(true);
    try {
      const res = await fetch('/api/gemini/formulate-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });

      const data = await res.json();
      if (data.strategy) {
        onUpdateCase({
          ...caseData,
          strategyPlan: data.strategy,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFormulating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                SOP LCA-014
              </span>
              <h3 className="text-sm font-bold text-white">Case Strategy & Tactical Litigation Roadmap</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Penetapan opsi jalur penyelesaian hukum, target pemulihan aset, permohonan sita jaminan, dan linimasa eksekusi.
            </p>
          </div>
        </div>

        <button
          onClick={handleAIFormulate}
          disabled={isFormulating}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isFormulating ? 'animate-spin' : ''}`} />
          <span>{isFormulating ? 'Menyusun Rencana Strategi...' : 'AI Formulate Strategy'}</span>
        </button>
      </div>

      {/* Strategic Choices & Key Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Primary Pathway */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Scale className="w-4 h-4 text-blue-400" />
            <span>Jalur Hukum Utama (Primary Pathway)</span>
          </div>
          <p className="text-xs font-bold text-white bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            {defaultStrategy.primaryPath}
          </p>
          {defaultStrategy.alternativePath && (
            <p className="text-[11px] text-slate-400">
              <strong className="text-slate-300">Opsi Alternatif:</strong> {defaultStrategy.alternativePath}
            </p>
          )}
        </div>

        {/* Settlement Target */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Target Pemulihan Finansial (Settlement)</span>
          </div>
          <p className="text-xs font-semibold text-emerald-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            {defaultStrategy.settlementTarget}
          </p>
          <span className="text-[10px] text-slate-400 block">Ambang batas kompromi mediasi yang disetujui klien</span>
        </div>

        {/* Seizure Target */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Target Sita Jaminan (Conservatoir Beslag)</span>
          </div>
          <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            {defaultStrategy.conservatorySeizureTarget}
          </p>
        </div>

      </div>

      {/* Strategic Executive Summary Box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Analisis Taktis & Catatan Keputusan Lead Counsel</span>
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">
          {defaultStrategy.executiveStrategicNotes}
        </p>
      </div>

      {/* Tactical Roadmap Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Linimasa & Tahapan Eksekusi Taktis ({defaultStrategy.tacticalRoadmap.length} Fase)
        </h4>

        <div className="space-y-3">
          {defaultStrategy.tacticalRoadmap.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">
                  0{idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">{item.phase}</h5>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                      {item.timeline}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{item.actionItem}</p>
                  <p className="text-[11px] text-amber-300/80">
                    <strong className="text-amber-400">Mitigasi Risiko:</strong> {item.riskMitigation}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Penanggung Jawab</span>
                <span className="text-xs font-semibold text-slate-200">{item.responsibleRole}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
