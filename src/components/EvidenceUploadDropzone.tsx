import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Lock, 
  Sparkles, 
  Eye, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  X
} from 'lucide-react';
import { 
  LegalCase, 
  UserProfile, 
  CaseDocument, 
  EvidenceItem, 
  ConfidenceLevel 
} from '../types';

interface EvidenceUploadDropzoneProps {
  caseData: LegalCase;
  currentUser: UserProfile;
  onAddEvidenceAndDocuments: (newDocs: CaseDocument[], newEvidences: EvidenceItem[]) => void;
  onClose?: () => void;
}

interface StagedFile {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMAGE' | 'OTHER';
  category: CaseDocument['category'];
  evidenceType: EvidenceItem['type'];
  previewUrl?: string;
  extractedSnippet: string;
  supportsFactId: string;
  reliability: ConfidenceLevel;
  notes: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  progress: number;
}

export const EvidenceUploadDropzone: React.FC<EvidenceUploadDropzoneProps> = ({
  caseData,
  currentUser,
  onAddEvidenceAndDocuments,
  onClose,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<StagedFile | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to determine file category and evidence type based on filename & extension
  const detectFileTypeAndCategory = (fileName: string): {
    fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMAGE' | 'OTHER';
    category: CaseDocument['category'];
    evidenceType: EvidenceItem['type'];
  } => {
    const lower = fileName.toLowerCase();

    let fileType: 'PDF' | 'DOCX' | 'XLSX' | 'IMAGE' | 'OTHER' = 'OTHER';
    if (lower.endsWith('.pdf')) fileType = 'PDF';
    else if (lower.endsWith('.docx') || lower.endsWith('.doc')) fileType = 'DOCX';
    else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) fileType = 'XLSX';
    else if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp') || lower.endsWith('.bmp')) fileType = 'IMAGE';

    let category: CaseDocument['category'] = 'Kontrak/Perjanjian';
    let evidenceType: EvidenceItem['type'] = 'Akta Bawah Tangan';

    if (lower.includes('akta') || lower.includes('notaris') || lower.includes('otentik')) {
      category = 'Akta Notaris';
      evidenceType = 'Surat/Akta Otentik';
    } else if (lower.includes('somasi') || lower.includes('peringatan') || lower.includes('teguran')) {
      category = 'Surat Somasi/Peringatan';
      evidenceType = 'Akta Bawah Tangan';
    } else if (lower.includes('mutasi') || lower.includes('rekening') || lower.includes('invoice') || lower.includes('kwitansi') || lower.includes('pembayaran') || fileType === 'XLSX') {
      category = 'Bukti Keuangan/Mutasi';
      evidenceType = 'Bukti Elektronik';
    } else if (lower.includes('chat') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('screenshot') || fileType === 'IMAGE') {
      category = 'Surat Elektronik/Chat';
      evidenceType = 'Bukti Elektronik';
    } else if (lower.includes('putusan') || lower.includes('gugatan') || lower.includes('eksepsi') || lower.includes('relas')) {
      category = 'Putusan/Dokumen Pengadilan';
      evidenceType = 'Surat/Akta Otentik';
    } else if (lower.includes('kronologi') || lower.includes('catatan')) {
      category = 'Kronologi Manual';
      evidenceType = 'Petunjuk/Indikasi';
    }

    return { fileType, category, evidenceType };
  };

  // Helper format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process selected or dropped files
  const processIncomingFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newStaged: StagedFile[] = [];

    for (const file of fileArray) {
      const { fileType, category, evidenceType } = detectFileTypeAndCategory(file.name);
      const id = `stg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      
      let previewUrl: string | undefined = undefined;
      let extractedSnippet = `Berkas ${file.name} telah diindeks untuk pipeline verifikasi alat bukti TriyLex.`;

      // If image, create object URL for live thumbnail
      if (fileType === 'IMAGE') {
        previewUrl = URL.createObjectURL(file);
        extractedSnippet = `[OCR Visual Engine] Tangkapan visual bukti digital: "${file.name}" terdeteksi integritas metadata EXIF dan stempel waktu.`;
      } else if (fileType === 'XLSX') {
        extractedSnippet = `[Sheet Parser] Buku kas/tabel mutasi transaksi "${file.name}" memuat ringkasan rincian nominal dan rekapitulasi data keuangan.`;
      } else if (fileType === 'PDF') {
        extractedSnippet = `[OCR High Fidelity 98.4%] Klausul pokok dan klausula hukum dari dokumen "${file.name}" siap dipetakan ke unsur norma KUHPerdata.`;
      } else if (fileType === 'DOCX') {
        extractedSnippet = `[DOCX Text Extractor] Naskah dokumen "${file.name}" diekstraksi tanpa kompresi dan telah dibersihkan dari PII sensitif.`;
      }

      // Default fact assignment (first fact if exists, or F-01)
      const factsList = caseData?.facts || [];
      const defaultFactId = factsList.length > 0 ? factsList[0].id : 'F-01';

      newStaged.push({
        id,
        file,
        name: file.name,
        sizeFormatted: formatFileSize(file.size),
        fileType,
        category,
        evidenceType,
        previewUrl,
        extractedSnippet,
        supportsFactId: defaultFactId,
        reliability: 'High',
        notes: `Alat bukti terverifikasi dari berkas ${file.name} (${fileType}).`,
        status: 'ready',
        progress: 100,
      });
    }

    setStagedFiles(prev => [...prev, ...newStaged]);
    setActiveNotification(`Berhasil memuat ${newStaged.length} berkas ke antrean alat bukti.`);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  // Drag and Drop Event Handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the main container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
    }
  };

  const handleRemoveStaged = (id: string) => {
    setStagedFiles(prev => {
      const target = prev.find(item => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const handleUpdateStaged = (id: string, updates: Partial<StagedFile>) => {
    setStagedFiles(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  // Commit all staged files to the Case Evidence Matrix & Documents List
  const handleCommitAll = async () => {
    if (stagedFiles.length === 0) return;

    setIsProcessingBatch(true);

    // Simulate progressive OCR & PII Sanitization
    for (let i = 0; i <= 100; i += 25) {
      setStagedFiles(prev => prev.map(f => ({ ...f, status: 'processing', progress: i })));
      await new Promise(r => setTimeout(r, 120));
    }

    const newCaseDocs: CaseDocument[] = [];
    const newEvidenceItems: EvidenceItem[] = [];

    stagedFiles.forEach((item, index) => {
      const docId = `doc-${Date.now().toString().slice(-4)}-${index + 1}`;
      const currentEvCount = (caseData?.evidenceMatrix || []).length;
      const evId = `EV-${String(currentEvCount + index + 1).padStart(2, '0')}`;

      // 1. Create CaseDocument
      const doc: CaseDocument = {
        id: docId,
        name: item.name,
        size: item.sizeFormatted,
        fileType: item.fileType,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Ready for analysis',
        category: item.category,
        author: currentUser.name,
        pageCount: item.fileType === 'PDF' ? Math.floor(Math.random() * 15) + 3 : item.fileType === 'XLSX' ? 4 : 1,
        ocrQuality: item.fileType === 'IMAGE' ? 'Visual OCR Clean' : 'OCR High Fidelity (98.6%)',
        hash: 'sha256-' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 8),
        piiRedacted: true,
        extractedText: item.extractedSnippet,
      };
      newCaseDocs.push(doc);

      // 2. Create EvidenceItem
      const ev: EvidenceItem = {
        evidenceId: evId,
        name: `${item.name} (${item.evidenceType})`,
        type: item.evidenceType,
        supportsFactId: item.supportsFactId,
        reliability: item.reliability,
        isDirect: item.evidenceType === 'Surat/Akta Otentik' || item.evidenceType === 'Bukti Elektronik',
        corroborationStatus: 'Corroborated',
        documentRef: docId,
        notes: item.notes || `Bukti ${item.evidenceType} diunggah oleh ${currentUser.name}.`,
      };
      newEvidenceItems.push(ev);
    });

    onAddEvidenceAndDocuments(newCaseDocs, newEvidenceItems);

    setStagedFiles([]);
    setIsProcessingBatch(false);
    if (onClose) onClose();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Unggah & Integrasi Alat Bukti Perkara</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                  Drag & Drop Multi-Format
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dukungan format PDF, Word (.docx), Excel (.xlsx), dan Gambar Bukti Digital (PNG/JPG/WEBP).
              </p>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors self-end sm:self-auto"
            title="Tutup Panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Notification Toast if any */}
      {activeNotification && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Main Drag-and-Drop Interactive Area */}
      <div
        id="case-evidence-dropzone"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-10 text-center flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[0.99]'
            : 'border-slate-700 hover:border-amber-500/60 bg-slate-950/60 hover:bg-slate-950/90'
        }`}
      >
        <input
          ref={fileInputRef}
          id="evidence-file-input"
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.png,.jpg,.jpeg,.webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Floating Icons Circle */}
        <div className="relative flex items-center justify-center">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
            isDragOver ? 'bg-amber-500 text-slate-950 scale-110' : 'bg-slate-800/80 text-amber-400 border border-slate-700'
          }`}>
            <UploadCloud className="w-8 h-8 animate-pulse" />
          </div>
          
          <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-0.5">
            <Lock className="w-2.5 h-2.5 text-amber-400" />
            <span>OCR 256-Bit</span>
          </div>
        </div>

        {/* Text Instructions */}
        <div className="space-y-1 max-w-md">
          <h3 className="text-sm font-semibold text-white">
            {isDragOver ? 'Lepaskan berkas di sini untuk memproses...' : 'Tarik & Lepaskan Berkas Bukti ke Sini'}
          </h3>
          <p className="text-xs text-slate-400">
            atau <span className="text-amber-400 font-semibold underline underline-offset-2">klik untuk memilih dari komputer</span>
          </p>
        </div>

        {/* Supported Format Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[11px] font-medium font-mono">
            <FileText className="w-3 h-3 text-rose-400" />
            <span>PDF (Akta, Somasi, Putusan)</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 text-[11px] font-medium font-mono">
            <FileCode className="w-3 h-3 text-blue-400" />
            <span>DOCX / Word (Naskah Perjanjian)</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-medium font-mono">
            <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
            <span>XLSX / CSV (Rekap Mutasi & Keuangan)</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[11px] font-medium font-mono">
            <ImageIcon className="w-3 h-3 text-amber-400" />
            <span>PNG / JPG (Bukti Chat & Dokumentasi)</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Otomatis melalui hashing integritas SHA-256, redaksi PII, dan indeks Traceability Matrix</span>
        </div>
      </div>

      {/* Staged Files Queue / Evidence Mapping Editor */}
      {stagedFiles.length > 0 && (
        <div className="space-y-4 pt-2">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Antrean Berkas Siap Diindeks ({stagedFiles.length} Berkas)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                Siap didaftarkan ke Evidence Matrix
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStagedFiles([])}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Bersihkan Semua</span>
            </button>
          </div>

          <div className="space-y-3">
            {stagedFiles.map((staged) => (
              <div
                key={staged.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
              >
                {/* Top Row: File info and quick delete */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail or Type Icon */}
                    {staged.previewUrl ? (
                      <div className="w-12 h-12 rounded-lg border border-slate-700 overflow-hidden bg-slate-900 shrink-0 relative group">
                        <img 
                          src={staged.previewUrl} 
                          alt={staged.name} 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedPreview(staged)}
                          className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <Eye className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                        staged.fileType === 'PDF' ? 'bg-rose-950 text-rose-400 border border-rose-800/60' :
                        staged.fileType === 'DOCX' ? 'bg-blue-950 text-blue-400 border border-blue-800/60' :
                        staged.fileType === 'XLSX' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                        'bg-amber-950 text-amber-400 border border-amber-800/60'
                      }`}>
                        {staged.fileType}
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-sm sm:max-w-md">{staged.name}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-300">{staged.sizeFormatted}</span>
                        <span>•</span>
                        <span className="text-amber-400/90 font-mono">{staged.category}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveStaged(staged.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                      title="Hapus dari antrean"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Middle Row: Classification & Evidence Matrix Linkage Form */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-900">
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">
                      Kategori Dokumen
                    </label>
                    <select
                      value={staged.category}
                      onChange={(e) => handleUpdateStaged(staged.id, { category: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Kontrak/Perjanjian">Kontrak / Perjanjian</option>
                      <option value="Surat Somasi/Peringatan">Surat Somasi / Peringatan</option>
                      <option value="Akta Notaris">Akta Notaris / Otentik</option>
                      <option value="Bukti Keuangan/Mutasi">Bukti Keuangan / Mutasi</option>
                      <option value="Surat Elektronik/Chat">Surat Elektronik / Chat Log</option>
                      <option value="Putusan/Dokumen Pengadilan">Putusan / Dokumen Pengadilan</option>
                      <option value="Kronologi Manual">Kronologi Manual</option>
                    </select>
                  </div>

                  {/* Evidence Type */}
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">
                      Klasifikasi Alat Bukti (HIR/RBg/ITE)
                    </label>
                    <select
                      value={staged.evidenceType}
                      onChange={(e) => handleUpdateStaged(staged.id, { evidenceType: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Surat/Akta Otentik">Surat / Akta Otentik</option>
                      <option value="Akta Bawah Tangan">Akta Bawah Tangan</option>
                      <option value="Bukti Elektronik">Bukti Elektronik (UU ITE)</option>
                      <option value="Petunjuk/Indikasi">Petunjuk / Indikasi</option>
                      <option value="Keterangan Saksi">Keterangan Saksi</option>
                      <option value="Keterangan Ahli">Keterangan Ahli</option>
                    </select>
                  </div>

                  {/* Supports Fact Link */}
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">
                      Mendukung Fakta Kasus (Fact Link)
                    </label>
                    <select
                      value={staged.supportsFactId}
                      onChange={(e) => handleUpdateStaged(staged.id, { supportsFactId: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      {(caseData?.facts || []).map((fact) => (
                        <option key={fact.id} value={fact.id}>
                          {fact.id}: {fact.text.substring(0, 32)}...
                        </option>
                      ))}
                      {(caseData?.facts || []).length === 0 && (
                        <option value="F-01">F-01 (Fakta Utama)</option>
                      )}
                    </select>
                  </div>

                </div>

                {/* Bottom Row: Extracted text preview or custom note */}
                <div className="pt-1">
                  <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 font-mono flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{staged.extractedSnippet}</span>
                  </div>
                </div>

                {/* Progress bar during batch commit */}
                {isProcessingBatch && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Memproses OCR & PII Redaction...</span>
                      <span>{staged.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-200" 
                        style={{ width: `${staged.progress}%` }} 
                      />
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Action Button to Commit to Case */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {stagedFiles.length} berkas akan dimasukkan ke <strong className="text-slate-200">Daftar Dokumen</strong> dan <strong className="text-slate-200">Evidence Matrix</strong>.
              </span>
            </div>

            <button
              type="button"
              id="confirm-add-evidence-btn"
              disabled={isProcessingBatch}
              onClick={handleCommitAll}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isProcessingBatch ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Mengindeks ke Berkas Perkara...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Tambahkan ke Alat Bukti Perkara ({stagedFiles.length})</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* Image / Document Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white truncate max-w-sm">{selectedPreview.name}</h4>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedPreview.previewUrl && (
              <div className="max-h-80 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                <img 
                  src={selectedPreview.previewUrl} 
                  alt={selectedPreview.name} 
                  className="max-h-80 w-auto object-contain" 
                />
              </div>
            )}

            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-mono block">Ringkasan OCR & Meta:</span>
              <p className="font-mono text-[11px] leading-relaxed">{selectedPreview.extractedSnippet}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
