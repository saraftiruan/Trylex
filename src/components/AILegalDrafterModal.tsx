import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Scale, 
  ShieldAlert, 
  Send, 
  RotateCcw,
  BookOpen,
  Plus,
  Printer
} from 'lucide-react';
import { LegalCase, CaseDocument } from '../types';

interface AILegalDrafterModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: LegalCase;
  onSaveToCaseDocuments: (newDoc: CaseDocument) => void;
}

export type DocumentDraftType = 
  | 'Surat Somasi / Teguran Hukum'
  | 'Surat Gugatan Wanprestasi / PMH'
  | 'Eksepsi & Jawaban Tergugat'
  | 'Legal Opinion Memo (LO)'
  | 'Permohonan Praperadilan (Pasal 77 KUHAP)'
  | 'Nota Keberatan / Eksepsi (Pasal 156 ayat 1 KUHAP)'
  | 'Nota Pembelaan / Pledoi (Pasal 182 KUHAP)'
  | 'Permohonan Penangguhan Penahanan (Pasal 31 KUHAP)';

export const AILegalDrafterModal: React.FC<AILegalDrafterModalProps> = ({
  isOpen,
  onClose,
  caseData,
  onSaveToCaseDocuments,
}) => {
  const isCriminal = caseData?.methodology === 'PCA';
  const [docType, setDocType] = useState<DocumentDraftType>(
    isCriminal ? 'Nota Pembelaan / Pledoi (Pasal 182 KUHAP)' : 'Surat Somasi / Teguran Hukum'
  );
  const [specificInstructions, setSpecificInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/gemini/draft-legal-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          caseData,
          specificInstructions,
        }),
      });

      const data = await res.json();
      if (data.draft) {
        setDraftContent(data.draft);
      } else {
        setDraftContent('// Gagal menghasilkan draf. Silakan coba kembali.');
      }
    } catch (err) {
      console.error(err);
      setDraftContent('// Terjadi kendala saat menyusun draf dokumen hukum.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!draftContent) return;
    navigator.clipboard.writeText(draftContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!draftContent) return;
    const element = document.createElement('a');
    const file = new Blob([draftContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `DRAF_${docType.replace(/\s+/g, '_')}_${caseData.refNumber.replace(/[\/\\]/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveToDocuments = () => {
    if (!draftContent) return;

    const newDoc: CaseDocument = {
      id: `doc-draft-${Date.now().toString().slice(-4)}`,
      name: `DRAF_${docType.replace(/[\/\s]+/g, '_')}_${caseData.client.replace(/\s+/g, '_')}.md`,
      size: `${(draftContent.length / 1024).toFixed(1)} KB`,
      fileType: 'DOCX',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Ready for analysis',
      category: docType.includes('Somasi') ? 'Surat Somasi/Peringatan' : 'Putusan/Dokumen Pengadilan',
      author: 'TriyLex AI Legal Drafter',
      pageCount: Math.ceil(draftContent.split('\n').length / 40) || 2,
      ocrQuality: 'AI Generated Draft',
      hash: 'sha256-' + Math.random().toString(36).substring(2, 10),
      piiRedacted: false,
      extractedText: draftContent,
    };

    onSaveToCaseDocuments(newDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">TriyLex AI Legal Drafter Studio</h3>
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20">
                  Norm-Compliant Drafter
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Penyusunan berkas & dokumen hukum otomatis berbasis fakta kasus <span className="font-mono text-slate-300">{caseData.refNumber}</span>
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

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Configuration Panel */}
          <div className="lg:col-span-4 p-5 bg-slate-950/50 border-r border-slate-800 flex flex-col justify-between overflow-y-auto space-y-5">
            <div className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Tipe Dokumen Hukum
                </label>
                <div className="space-y-2">
                  {(
                    isCriminal
                      ? [
                          'Nota Pembelaan / Pledoi (Pasal 182 KUHAP)',
                          'Nota Keberatan / Eksepsi (Pasal 156 ayat 1 KUHAP)',
                          'Permohonan Praperadilan (Pasal 77 KUHAP)',
                          'Permohonan Penangguhan Penahanan (Pasal 31 KUHAP)',
                          'Legal Opinion Memo (LO)',
                        ]
                      : [
                          'Surat Somasi / Teguran Hukum',
                          'Surat Gugatan Wanprestasi / PMH',
                          'Eksepsi & Jawaban Tergugat',
                          'Legal Opinion Memo (LO)',
                        ]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocType(type as DocumentDraftType)}
                      className={`w-full p-2.5 rounded-xl border text-xs text-left font-medium transition-all flex items-center justify-between ${
                        docType === type
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{type}</span>
                      </div>
                      {docType === type && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Case Context Summary Card */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Data Kontekstual Perkara
                </span>
                <div className="text-slate-300 space-y-1">
                  <div><strong className="text-slate-400">Pihak:</strong> {caseData.client} vs {caseData.opposingParty}</div>
                  <div><strong className="text-slate-400">Klasifikasi:</strong> {caseData.caseType}</div>
                  <div><strong className="text-slate-400">Tuntutan:</strong> {caseData.claimAmount}</div>
                  <div><strong className="text-slate-400">Total Bukti:</strong> {caseData.evidenceMatrix.length} item bukti terverifikasi</div>
                </div>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Instruksi Khusus / Klausul Tambahan (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Berikan tenggat waktu somasi 7 hari kerja, tekankan pasal 1338 ayat (3) itikad baik, atau minta sita jaminan (conservatoir beslag)..."
                  value={specificInstructions}
                  onChange={(e) => setSpecificInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

            {/* Action Trigger */}
            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Menyusun Naskah Dokumen...' : `Generate ${docType}`}</span>
            </button>
          </div>

          {/* Right Editor & Preview Panel */}
          <div className="lg:col-span-8 p-5 flex flex-col justify-between overflow-hidden bg-slate-950/20">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Naskah Dokumen Hukum</span>
                {draftContent && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Draft Siap Diperiksa
                  </span>
                )}
              </div>

              {draftContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .MD</span>
                  </button>

                  <button
                    onClick={handleSaveToDocuments}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Tersimpan!' : 'Simpan ke Berkas Perkara'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-200 font-mono text-xs leading-relaxed">
              {draftContent ? (
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200">
                  {draftContent}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                  <BookOpen className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-semibold text-slate-400 mb-1">
                    Belum Ada Draf Dokumen
                  </p>
                  <p className="text-xs max-w-md">
                    Pilih tipe dokumen di panel kiri lalu klik tombol "Generate" untuk menyusun naskah hukum berbasis norma KUHPerdata dan pembuktian perkara ini secara otomatis.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
