import React from 'react';
import { 
  X, 
  BookOpen, 
  Scale, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  GitMerge, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface HelpGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuidanceModal: React.FC<HelpGuidanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">Panduan Metodologi ULPE-AW & Tata Kelola Yuridis</h2>
              <p className="text-xs text-slate-400">Universal Legal Prompt Engine with Traceable Verification</p>
            </div>
          </div>
          <button 
            id="close-help-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-6">
          
          {/* Section 1: ULPE-AW Framework */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>1. Arsitektur 5-Agent ULPE-AW</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">Agent 1: Case Mapper</span>
                <p className="text-slate-300">
                  Mengisolasi kronologi tanggal, menyaring fakta diakui vs disengketakan, memetakan hubungan para pihak.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">Agent 2: Legal Classifier</span>
                <p className="text-slate-300">
                  Mengklasifikasi hierarki norma (KUHPerdata, UU Khusus, Peraturan Pemerintah, Lex Specialis).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">Agent 3: Legal Research</span>
                <p className="text-slate-300">
                  Memvalidasi keabsahan pasal, status undang-undang transisi, dan yurisprudensi Mahkamah Agung.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400">Agent 4: Evidence Agent</span>
                <p className="text-slate-300">
                  Menyusun Evidence Matrix dan mendeteksi celah bukti (Evidence Gaps) sebelum masuk persidangan.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 sm:col-span-2">
                <span className="font-bold text-amber-400">Agent 5: Argument Agent & Verification Gate</span>
                <p className="text-slate-300">
                  Melakukan uji ketahanan simetris (dalil klaim vs sanggahan lawan) dan memvalidasi rantai pembuktian berantai (Traceability Chain).
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Traceability */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-amber-400" />
              <span>2. Prinsip Anti-Halusinasi & Traceability Berantai</span>
            </h3>
            <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              Setiap kesimpulan yuridis yang dihasilkan wajib tertaut ke satu atau lebih:
              <br />
              <strong>[Kesimpulan] → [Pokok Isu] → [Unsur Norma] → [Fakta Terbukti] → [Alat Bukti Terdaftar] → [Dokumen Asli]</strong>
              <br />
              Jika suatu dalil tidak memiliki rujukan bukti primer, sistem akan secara otomatis menandainya sebagai <em>Evidence Gap</em>.
            </p>
          </div>

          {/* Section 3: Legal Disclaimer */}
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200/90 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Disclaimer Tanggung Jawab Profesi Advokat</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              TriyLex adalah alat bantu analisis kecerdasan buatan terstruktur bagi praktisi hukum, advokat, in-house counsel, dan konsultan hukum. Hasil analisis platform ini tidak menggantikan pertimbangan hukum independen (legal opinion) dari advokat berlisensi sesuai UU No. 18 Tahun 2003 tentang Advokat.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Mengerti & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
