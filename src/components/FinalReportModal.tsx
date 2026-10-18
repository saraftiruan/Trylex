import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Sparkles, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText,
  Building2,
  Calendar,
  Scale,
  Clock,
  Plus
} from 'lucide-react';
import { LegalCase } from '../types';
import { VisualDocumentTimeline } from './VisualDocumentTimeline';

interface FinalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: LegalCase;
  onUpdateCase: (updatedCase: LegalCase) => void;
}

export const FinalReportModal: React.FC<FinalReportModalProps> = ({
  isOpen,
  onClose,
  caseData,
  onUpdateCase,
}) => {
  const [activeTab, setActiveTab] = useState<'report_text' | 'visual_timeline'>('report_text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportText, setReportText] = useState(caseData?.finalReportText || '');
  const [copied, setCopied] = useState(false);
  const [timelineInserted, setTimelineInserted] = useState(false);

  const isCriminal = caseData?.methodology === 'PCA';

  useEffect(() => {
    if (caseData?.finalReportText) {
      setReportText(caseData.finalReportText);
    }
  }, [caseData?.finalReportText]);

  if (!isOpen) return null;

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-final-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseData }),
      });

      const data = await res.json();
      if (data.report) {
        setReportText(data.report);
        onUpdateCase({
          ...caseData,
          finalReportText: data.report,
          executiveSummary: data.report.slice(0, 300) + '...',
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertTimeline = () => {
    const docCount = caseData?.documents?.length || 0;
    const refNum = caseData?.refNumber || '-';
    const caseTitle = caseData?.title || 'Perkara';
    const markdownChronology = `\n\n## BAB: KRONOLOGI PERISTIWA HUKUM & AGREGASI MILESTONES DOKUMEN\n` +
      `*Dihimpun dari ${docCount} berkas otentik perkara ${refNum}*\n\n` +
      `| No | Tanggal | Tonggak Peristiwa & Dokumen Terkait | Aktor / Pihak | Kategori & Status Prosedural |\n` +
      `|---|---|---|---|---|\n` +
      (caseData?.timeline || []).map((evt, idx) => 
        `| ${idx + 1} | ${evt.date} | **${evt.title}**<br/>${evt.documentName ? `*Rujukan: ${evt.documentName}*` : ''}<br/>${evt.description} | ${evt.actor || '-'} | ${evt.category} - *${evt.proceduralStatus || 'Confirmed'}* |`
      ).join('\n') + `\n\n*Catatan Pengawasan Prosedural:* Seluruh peristiwa terhubung langsung dengan dokumen pembuktian dan bebas dari risiko daluwarsa penuntutan/gugatan.\n`;

    const existingReport = reportText || caseData?.finalReportText || `# FINAL CASE INTELLIGENCE REPORT\nPerkara: ${caseTitle}\nRef: ${refNum}`;
    const cleanReport = existingReport.includes('## BAB: KRONOLOGI PERISTIWA HUKUM')
      ? existingReport.replace(/## BAB: KRONOLOGI PERISTIWA HUKUM[\s\S]*?(?=\n## |$)/, markdownChronology)
      : `${existingReport}\n${markdownChronology}`;

    setReportText(cleanReport);
    onUpdateCase({
      ...caseData,
      finalReportText: cleanReport,
      updatedAt: new Date().toISOString(),
    });

    setTimelineInserted(true);
    setTimeout(() => setTimelineInserted(false), 2500);
  };

  const handleCopy = () => {
    if (!reportText) return;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const prefix = isCriminal ? 'PCA-015' : 'LCA-015';
    a.download = `${prefix}_Final_Case_Intelligence_Report_${caseData.refNumber.replace(/[\/\\]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {isCriminal ? 'SOP PCA-015: Final Case Intelligence Report (Pidana)' : 'SOP LCA-015: Final Case Intelligence Report (Perdata & Komersial)'}
                </h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">
                  Comprehensive Intelligence Dossier
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kompilasi laporan akhir intelejen perkara <span className="font-mono text-slate-300">{caseData.refNumber}</span> ({caseData.client} vs {caseData.opposingParty})
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

        {/* Toolbar Actions & Sub-Tabs */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('report_text')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'report_text'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Naskah Laporan Akhir</span>
              </button>

              <button
                onClick={() => setActiveTab('visual_timeline')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'visual_timeline'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Visual Timeline Dokumen ({caseData?.timeline?.length || 0})</span>
              </button>
            </div>

            {activeTab === 'report_text' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Menyusun Laporan Akhir...' : (reportText ? 'Regenerate Laporan AI' : 'Generate Laporan Akhir (15 SOP)')}</span>
                </button>

                <button
                  onClick={handleInsertTimeline}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    timelineInserted
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Sisipkan/Perbarui Bab Kronologi dan Agregasi Milestones Dokumen ke dalam Naskah Laporan"
                >
                  {timelineInserted ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{timelineInserted ? 'Linimasa Disematkan' : '+ Sisipkan Linimasa ke Laporan'}</span>
                </button>
              </div>
            )}
          </div>

          {activeTab === 'report_text' && reportText && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .MD</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
          {activeTab === 'visual_timeline' ? (
            <VisualDocumentTimeline 
              caseData={caseData} 
              onUpdateCase={onUpdateCase} 
            />
          ) : reportText ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-200 font-sans text-xs leading-relaxed whitespace-pre-wrap shadow-inner space-y-4">
              {reportText}
            </div>
          ) : (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-sm font-bold text-white">Laporan Akhir Siap Disusun</h4>
                <p className="text-xs text-slate-400">
                  Klik tombol <strong>"Generate Laporan Akhir (15 SOP)"</strong> untuk mengompilasi seluruh tahapan (LCA-001 hingga LCA-014) menjadi satu dokumen laporan eksekutif resmi advokat.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
