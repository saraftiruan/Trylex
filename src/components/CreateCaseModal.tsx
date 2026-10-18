import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  User, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { LegalCase, UserProfile } from '../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onCreateCase: (newCase: LegalCase) => void;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCreateCase,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Methodology selection: LCA (Civil) vs PCA (Criminal)
  const [methodology, setMethodology] = useState<LegalCase['methodology']>('LCA');

  // AI Narrative Ingestion State
  const [showAiExtractor, setShowAiExtractor] = useState(false);
  const [rawNarrative, setRawNarrative] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [refNumber, setRefNumber] = useState(`TRX/2026/CIV-${Math.floor(Math.random() * 800 + 100)}`);
  const [client, setClient] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [caseType, setCaseType] = useState<LegalCase['caseType']>('Perdata / Wanprestasi');
  const [jurisdiction, setJurisdiction] = useState<LegalCase['jurisdiction']>('Indonesia');
  const [courtForum, setCourtForum] = useState('Pengadilan Negeri / BANI');
  const [confidentiality, setConfidentiality] = useState<LegalCase['confidentiality']>('Confidential');
  const [proceduralPosition, setProceduralPosition] = useState<LegalCase['proceduralPosition']>('Penyelidikan / Legal Due Diligence');
  
  // Step 2 State: Claims & Parties
  const [claimTitle, setClaimTitle] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [summary, setSummary] = useState('');

  // Step 3 State: Dates
  const [incidentDate, setIncidentDate] = useState('');
  const [contractDate, setContractDate] = useState('');
  const [allegedBreachDate, setAllegedBreachDate] = useState('');

  // Auto-extracted collections from AI
  const [extractedTimeline, setExtractedTimeline] = useState<any[]>([]);
  const [extractedFacts, setExtractedFacts] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleExtractFromNarrative = async () => {
    if (!rawNarrative.trim() || isExtracting) return;
    setIsExtracting(true);
    setAiSuccessMessage('');

    try {
      const res = await fetch('/api/gemini/generate-case-from-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ narrative: rawNarrative }),
      });

      const data = await res.json();
      if (data.caseDraft) {
        const d = data.caseDraft;
        if (d.title) setTitle(d.title);
        if (d.client) setClient(d.client);
        if (d.opposingParty) setOpposingParty(d.opposingParty);
        if (d.caseType) setCaseType(d.caseType);
        if (d.summary) setSummary(d.summary);
        if (d.claimAmount) setClaimAmount(d.claimAmount);
        if (d.incidentDate) setIncidentDate(d.incidentDate);
        if (d.contractDate) setContractDate(d.contractDate);
        if (d.allegedBreachDate) setAllegedBreachDate(d.allegedBreachDate);
        if (d.claims?.[0]?.title) setClaimTitle(d.claims[0].title);
        if (d.timeline) setExtractedTimeline(d.timeline);
        if (d.facts) setExtractedFacts(d.facts);

        setAiSuccessMessage('Struktur perkara berhasil diekstrak oleh Gemini! Periksa data di bawah.');
        setShowAiExtractor(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || !opposingParty) return;

    const isCriminal = methodology === 'PCA';

    const newCase: LegalCase = {
      id: `case-${Date.now().toString().slice(-4)}`,
      title,
      refNumber,
      client,
      opposingParty,
      methodology,
      caseType,
      jurisdiction,
      courtForum,
      owner: currentUser.name,
      reviewer: 'Senior Partner Hendra Wijaya, S.H.',
      confidentiality,
      proceduralPosition,
      currentSOPStage: isCriminal ? 'pca-001' : 'LCA-001',
      status: 'Ready for Analysis',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      summary: summary || (isCriminal 
        ? `Perkara ${caseType} atas nama Klien ${client} sehubungan dengan proses hukum yang diajukan oleh ${opposingParty}.`
        : `Perkara ${caseType} antara ${client} dan ${opposingParty} mengenai pemenuhan kewajiban perdata/komersial.`),
      claimAmount: claimAmount || (isCriminal ? 'Ancaman Sanksi Pidana Maksimal' : 'Rp 0'),
      incidentDate: incidentDate || new Date().toISOString().split('T')[0],
      contractDate: contractDate || undefined,
      allegedBreachDate: allegedBreachDate || undefined,
      parties: [
        {
          id: `pty-1`,
          name: client,
          type: 'Individual',
          role: isCriminal ? 'Terlapor / Tersangka / Terdakwa' : 'Claimant',
          legalRepresentative: `${currentUser.organization}`,
          conflictNotes: 'Telah diperiksa bebas benturan kepentingan',
        },
        {
          id: `pty-2`,
          name: opposingParty,
          type: isCriminal ? 'Government Body' : 'Corporation',
          role: isCriminal ? 'Jaksa Penuntut Umum (JPU)' : 'Defendant',
        },
      ],
      claims: [
        {
          id: `clm-1`,
          title: claimTitle || (isCriminal ? 'Surat Dakwaan / Sangkaan Pokok' : 'Tuntutan Pemenuhan Prestasi / Ganti Kerugian'),
          description: summary || (isCriminal ? 'Dugaan tindak pidana materiil yang disangkakan/didakwakan.' : 'Gugatan atas dugaan pelanggaran kesepakatan atau kewajiban hukum.'),
          type: isCriminal ? 'Surat Dakwaan / Dakwaan Primer' : 'Main Claim',
          claimedAmount: claimAmount || undefined,
          legalBasis: isCriminal 
            ? (caseType.includes('Tipikor') ? 'Pasal 2 & 3 UU No. 31/1999 jo. UU No. 20/2001' : 'Pasal 1 ayat (2) jo. KUHP Baru UU 1/2023')
            : (caseType.includes('PMH') ? 'Pasal 1365 KUHPerdata' : 'Pasal 1243 & 1338 KUHPerdata'),
        },
      ],
      admittedFacts: [
        isCriminal 
          ? `Klien (${client}) bertindak dalam status subjek hukum resmi yang teridentifikasi.`
          : `Para pihak (${client} dan ${opposingParty}) memiliki hubungan hukum formal yang disepakati.`,
      ],
      disputedFacts: [
        isCriminal
          ? 'Kebenaran pemenuhan unsur niat jahat (Mens Rea) dan kualifikasi melawan hukum yang disangkakan.'
          : 'Kebenaran dugaan kelalaian atau pelanggaran klausul oleh pihak Tergugat.',
      ],
      unknownFacts: [],
      documents: [
        {
          id: `doc-${Date.now().toString().slice(-4)}`,
          name: isCriminal ? `Berkas_Penyidikan_${client.replace(/\s+/g, '_')}.pdf` : `Berkas_Awal_${client.replace(/\s+/g, '_')}_vs_${opposingParty.replace(/\s+/g, '_')}.pdf`,
          size: '3.8 MB',
          fileType: 'PDF',
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'Ready for analysis',
          category: isCriminal ? 'Putusan/Dokumen Pengadilan' : 'Kontrak/Perjanjian',
          author: currentUser.name,
          pageCount: 16,
          ocrQuality: 'OCR Direct Text',
          hash: 'sha256-' + Math.random().toString(36).substring(2, 10),
          piiRedacted: true,
          extractedText: isCriminal 
            ? `Dokumen berkas perkara ${caseType} atas nama ${client}. Terdaftar pada tahapan ${proceduralPosition}.`
            : `Dokumen pokok perjanjian antara ${client} dan ${opposingParty}. Tanggal perikatan: ${contractDate || 'Tercatat'}.`,
        },
      ],
      timeline: extractedTimeline.length > 0 ? extractedTimeline.map((item, idx) => ({
        id: `tm-${idx + 1}`,
        date: item.date || contractDate || '2025-01-10',
        title: item.title || 'Peristiwa Kronologis',
        description: item.description || '',
        category: item.category || 'Contract',
        importance: item.importance || 'Key',
      })) : [
        {
          id: 'tm-1',
          date: contractDate || '2025-01-10',
          title: isCriminal ? 'Awal Peristiwa / Terbitnya Administrasi Terkait' : 'Awal Hubungan Hukum / Perjanjian',
          description: isCriminal 
            ? `Peristiwa awal terkait dugaan perkara ${caseType}.`
            : `Penandatanganan akta kesepakatan antara ${client} dan ${opposingParty}.`,
          category: isCriminal ? 'Contract' : 'Contract',
          importance: 'Key',
        },
      ],
      facts: extractedFacts.length > 0 ? extractedFacts.map((f, idx) => ({
        id: `F-${idx + 1 < 10 ? '0' : ''}${idx + 1}`,
        text: f.text || f,
        status: f.status || 'Established',
        confidence: 'High',
        category: f.category || (isCriminal ? 'Conduct' : 'Contractual'),
        verified: true,
      })) : [
        {
          id: 'F-01',
          text: isCriminal 
            ? `Tindakan Klien (${client}) dilakukan berdasarkan kewenangan administratif kedinasan yang sah.`
            : `Perjanjian sah dibuat dan disepakati oleh ${client} dan ${opposingParty}.`,
          status: 'Established',
          confidence: 'High',
          category: isCriminal ? 'Conduct' : 'Contractual',
          verified: true,
        },
      ],
      legalLayers: [
        {
          id: 'L-01',
          layerName: isCriminal 
            ? `Hukum Pidana Materiil & Acara Pidana (${caseType})`
            : (caseType.includes('PMH') ? 'Perbuatan Melawan Hukum (Pasal 1365 KUHPerdata)' : 'Hukum Perjanjian & Wanprestasi (KUHPerdata)'),
          priorityScore: 98,
          primarySources: isCriminal 
            ? ['KUHP Baru UU No. 1/2023', 'KUHAP UU No. 8/1981', 'Putusan MK No. 21/PUU-XII/2014']
            : ['Pasal 1320 KUHPerdata', 'Pasal 1338 KUHPerdata'],
          triggeringFacts: ['F-01'],
          potentialIssues: isCriminal 
            ? ['Apakah terdapat bukti permulaan yang cukup dan niat jahat (Mens Rea) menurut Pasal 184 KUHAP?']
            : ['Apakah telah terjadi cidera janji atau perbuatan melawan hukum yang merugikan Klien?'],
        },
      ],
      statutes: [
        {
          id: 'S-01',
          lawName: isCriminal ? 'Undang-Undang No. 8 Tahun 1981 (KUHAP)' : 'Kitab Undang-Undang Hukum Perdata',
          article: isCriminal ? 'Pasal 184 ayat (1)' : 'Pasal 1338 ayat (1)',
          status: 'Current',
          effectiveDate: 'Berlaku umum Indonesia',
          relevance: isCriminal ? 'Standar alat bukti sah dalam proses peradilan pidana' : 'Asas Pacta Sunt Servanda',
          confidence: 'High',
        },
      ],
      evidenceMatrix: [
        {
          evidenceId: 'E-01',
          name: isCriminal ? `Salinan Berkas Surat Administrasi / SOP Resmi ${client}` : `Salinan Akta Perjanjian Pokok ${client}`,
          type: isCriminal ? 'Surat / Dokumen Resmi (184 ayat 1c)' : 'Akta Bawah Tangan',
          supportsFactId: 'F-01',
          reliability: 'High',
          isDirect: true,
          corroborationStatus: 'Corroborated',
        },
      ],
      evidenceGaps: [
        {
          id: 'GAP-01',
          description: isCriminal 
            ? 'Hasil audit investigatif resmi independen pembanding belum dilampirkan.'
            : 'Surat Bukti Peringatan / Somasi resmi bertanda terima belum dilampirkan.',
          impact: 'High',
          recommendation: isCriminal 
            ? 'Mintakan audit investigasi pembanding guna membuktikan ketiadaan kerugian negara nyata.'
            : 'Unggah bukti surat somasi dan tanda terima kurir untuk memenuhi syarat kelalaian.',
          status: 'Open',
        },
      ],
      symmetricArguments: [
        {
          issueId: 'I-01',
          issueTitle: isCriminal ? 'Unsur Niat Jahat (Mens Rea) & Kualifikasi Melawan Hukum' : 'Kualifikasi Pelanggaran & Pemenuhan Ganti Kerugian',
          claimantArgument: isCriminal 
            ? `${client} bertindak dengan itikad baik dan ketiadaan niat jahat, sehingga tidak dapat dipidana.`
            : `${client} telah memenuhi seluruh kewajibannya dan menuntut pemulihan hak sesuai hukum.`,
          defendantArgument: isCriminal 
            ? `${opposingParty} mendalilkan adanya kerugian atau pelanggaran ketentuan hukum pidana.`
            : `${opposingParty} mendalilkan adanya keadaan atau alasan pembenar atas tertundanya pelaksanaan.`,
          stressTestAnalysis: isCriminal 
            ? 'Perlu verifikasi ketiadaan aliran dana pribadi (kickback) dan pemenuhan Putusan MK 21/2014.'
            : 'Perlu verifikasi tanggal jatuh tempo dan bukti korespondensi tertulis.',
        },
      ],
      traceability: [
        {
          conclusionId: 'C-01',
          conclusionText: isCriminal 
            ? `Tindakan ${client} tidak memenuhi unsur tindak pidana materil secara sah dan meyakinkan.`
            : `Terdapat hubungan hukum yang sah antara ${client} dan ${opposingParty}.`,
          issueId: 'I-01',
          element: isCriminal ? 'Unsur Mens Rea & Actus Reus' : 'Keabsahan Perjanjian (Pasal 1320 KUHPerdata)',
          factId: 'F-01',
          evidenceId: 'E-01',
          documentRef: isCriminal ? 'Berkas_Penyidikan.pdf' : 'Berkas_Awal.pdf',
        },
      ],
      comments: [],
      // Baseline PCA objects if criminal
      ...(isCriminal ? {
        pcaDueProcessAudit: {
          suspectDesignationLegality: {
            hasTwoValidEvidence: false,
            calonTskExamined: false,
            mk21Compliance: false,
            notes: 'Perlu verifikasi pemenuhan Putusan MK No. 21/PUU-XII/2014.',
          },
          searchAndSeizureLegality: {
            hasCourtPermit: true,
            emergencyProtocolValid: true,
            notes: 'Izin pengadilan diperlukan untuk penetapan penyitaan sah.',
          },
          legalCounselRight: {
            article56Compliant: true,
            bapAccompanied: true,
            notes: 'Didampingi penasihat hukum resmi.',
          },
          praperadilanViability: 'Sangat Tinggi (Strong)',
          praperadilanArguments: [
            'Uji minimal 2 alat bukti sah penetapan tersangka.',
            'Pemeriksaan calon tersangka sebelum penetapan status.',
          ],
        },
      } : {}),
    };

    onCreateCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white">Buat Perkara Hukum Baru (ULPE-AW)</h2>
              <p className="text-xs text-slate-400">Langkah {step} dari 3: {step === 1 ? 'Identitas & Yurisdiksi' : step === 2 ? 'Pihak & Tuntutan' : 'Jadwal & Kronologi'}</p>
            </div>
          </div>

          <button
            id="close-create-case-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-amber-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* AI Quick Ingestion Assist Banner */}
        <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                Input Cepat: Auto-Generate dari Narasi Klien / Chat
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAiExtractor(prev => !prev)}
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
            >
              {showAiExtractor ? 'Tutup Asisten AI' : '+ Buka Generator AI'}
            </button>
          </div>

          {aiSuccessMessage && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </div>
          )}

          {showAiExtractor && (
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-400">
                Tempelkan transkrip percakapan WhatsApp, notulen rapat klien, atau kronologi naratif mentah. Gemini akan mengekstrak nama pihak, pasal rujukan, nilai tuntutan, dan peristiwa kunci secara otomatis ke dalam formulir.
              </p>
              
              <textarea
                rows={4}
                placeholder="Contoh: Klien kami PT Sumber Bahagia membuat perjanjian sewa alat berat dengan PT Konstruksi Jaya pada 12 Februari 2025. Tergugat belum membayar sewa 4 bulan total Rp 850.000.000 dan somasi ke-1 tanggal 10 Mei diabaikan..."
                value={rawNarrative}
                onChange={(e) => setRawNarrative(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isExtracting || !rawNarrative.trim()}
                  onClick={handleExtractFromNarrative}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isExtracting ? 'animate-spin' : ''}`} />
                  <span>{isExtracting ? 'Mengekstrak Data Perkara...' : 'Ekstrak & Isi Formulir Otomatis'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STEP 1: IDENTITAS & DOMAIN METODOLOGI */}
          {step === 1 && (
            <div className="space-y-4 text-xs">
              
              {/* Methodology Selector */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Domain Metodologi Analisis *</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setMethodology('LCA');
                      setRefNumber(`TRX/2026/CIV-${Math.floor(Math.random() * 800 + 100)}`);
                      setCaseType('Perdata / Wanprestasi');
                      setCourtForum('Pengadilan Negeri / BANI');
                      setProceduralPosition('Penyelidikan / Legal Due Diligence');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      methodology === 'LCA'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Perdata & Bisnis (SOP LCA)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMethodology('PCA');
                      setRefNumber(`TRX/2026/CRM-${Math.floor(Math.random() * 800 + 100)}`);
                      setCaseType('Tindak Pidana Korupsi (Tipikor)');
                      setCourtForum('Pengadilan Tindak Pidana Korupsi pada PN Jakarta Pusat');
                      setProceduralPosition('Penyidikan / SPDP Diterbitkan');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      methodology === 'PCA'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Pidana & UU Khusus (SOP PCA)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {methodology === 'PCA' 
                    ? 'Mode Pidana (PCA): Audit Due Process of Law (MK 21/2014), Bedah Unsur Delik (Actus Reus & Mens Rea), Komparasi KUHP Baru UU 1/2023, Uji Silang BAP, Eksepsi 156 & Pledoi.' 
                    : 'Mode Perdata (LCA): Rekonstruksi Kontrak & Klausul, Kalkulator Kuantum Bunga Legal 6%, Uji Wanprestasi/PMH, Traceability Matrix & Somasi.'}
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {methodology === 'PCA' ? 'Judul Perkara Pidana / Dugaan Tindak Pidana *' : 'Judul Lengkap Perkara *'}
                </label>
                <input
                  id="new-case-title-input"
                  type="text"
                  required
                  placeholder={methodology === 'PCA' ? "Contoh: Dugaan Tindak Pidana Korupsi & TPPU Pengadaan Server..." : "Contoh: Sengketa Wanprestasi Kontrak EPC Pembangkit Listrik..."}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {methodology === 'PCA' ? 'Nomor LP / Sprindik / Ref Perkara' : 'Nomor Referensi Perkara'}
                  </label>
                  <input
                    id="new-case-ref-input"
                    type="text"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {methodology === 'PCA' ? 'Klasifikasi Tindak Pidana *' : 'Jenis Perkara *'}
                  </label>
                  <select
                    id="new-case-type-select"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  >
                    {methodology === 'PCA' ? (
                      <>
                        <option value="Tindak Pidana Korupsi (Tipikor)">Tindak Pidana Korupsi (Tipikor)</option>
                        <option value="Tindak Pidana Pencucian Uang (TPPU)">Tindak Pidana Pencucian Uang (TPPU)</option>
                        <option value="Tindak Pidana Siber & ITE">Tindak Pidana Siber & ITE</option>
                        <option value="Tindak Pidana Bisnis & Korporasi">Tindak Pidana Bisnis & Korporasi</option>
                        <option value="Tindak Pidana Perpajakan & Kepabeanan">Tindak Pidana Perpajakan & Kepabeanan</option>
                        <option value="Tindak Pidana Pasar Modal & Perbankan">Tindak Pidana Pasar Modal & Perbankan</option>
                        <option value="Tindak Pidana Lingkungan Hidup & Kehutanan">Tindak Pidana Lingkungan Hidup & Kehutanan</option>
                        <option value="Tindak Pidana Narkotika & Psikotropika">Tindak Pidana Narkotika & Psikotropika</option>
                        <option value="Tindak Pidana Umum (KUHP: Penipuan, Penggelapan, Pemalsuan Surat)">Tindak Pidana Umum (KUHP: Penipuan, Penggelapan, Pemalsuan)</option>
                      </>
                    ) : (
                      <>
                        <option value="Perdata / Wanprestasi">Perdata / Wanprestasi</option>
                        <option value="Perbuatan Melawan Hukum (PMH)">Perbuatan Melawan Hukum (PMH)</option>
                        <option value="Sengketa Ketenagakerjaan (PHI)">Sengketa Ketenagakerjaan (PHI)</option>
                        <option value="Hak Kekayaan Intelektual (HAKI)">Hak Kekayaan Intelektual (HAKI)</option>
                        <option value="Arbitrase & ADR">Arbitrase & ADR</option>
                        <option value="Kepailitan & PKPU">Kepailitan & PKPU</option>
                        <option value="Hukum Korporasi & M&A">Hukum Korporasi & M&A</option>
                        <option value="Hukum Tata Usaha Negara (PTUN)">Hukum Tata Usaha Negara (PTUN)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {methodology === 'PCA' ? 'Pengadilan / Forum Acara' : 'Yurisdiksi & Pengadilan / Forum'}
                  </label>
                  <input
                    id="new-case-forum-input"
                    type="text"
                    placeholder={methodology === 'PCA' ? "Contoh: Pengadilan Tindak Pidana Korupsi pada PN Jakarta Pusat" : "Contoh: Pengadilan Negeri Jakarta Pusat / BANI"}
                    value={courtForum}
                    onChange={(e) => setCourtForum(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {methodology === 'PCA' ? 'Tahapan Acara Pidana' : 'Tahapan Prosedural'}
                  </label>
                  <select
                    id="new-case-procedural-select"
                    value={proceduralPosition}
                    onChange={(e) => setProceduralPosition(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  >
                    {methodology === 'PCA' ? (
                      <>
                        <option value="Penyelidikan / Klarifikasi">Penyelidikan / Klarifikasi</option>
                        <option value="Penyidikan / SPDP Diterbitkan">Penyidikan / SPDP Diterbitkan</option>
                        <option value="Penetapan Tersangka / Praperadilan">Penetapan Tersangka / Upaya Praperadilan</option>
                        <option value="Pemeriksaan BAP & Penyitaan">Pemeriksaan BAP & Penyitaan</option>
                        <option value="Pelimpahan Berkas Tahap II (P-21)">Pelimpahan Berkas Tahap II (P-21)</option>
                        <option value="Pembacaan Surat Dakwaan (Pasal 143 KUHAP)">Pembacaan Surat Dakwaan (Pasal 143 KUHAP)</option>
                        <option value="Eksepsi / Keberatan (Pasal 156 KUHAP)">Eksepsi / Keberatan (Pasal 156 KUHAP)</option>
                        <option value="Putusan Sela">Putusan Sela</option>
                        <option value="Pembuktian Saksi JPU (A Charge)">Pembuktian Saksi JPU (A Charge)</option>
                        <option value="Pembuktian Saksi Meringankan (A De Charge)">Pembuktian Saksi Meringankan (A De Charge)</option>
                        <option value="Tuntutan Pidana (Requisitoir)">Tuntutan Pidana (Requisitoir)</option>
                        <option value="Nota Pembelaan (Pledoi)">Nota Pembelaan (Pledoi)</option>
                        <option value="Vonis Pengadilan Tingkat Pertama">Vonis Pengadilan Tingkat Pertama</option>
                      </>
                    ) : (
                      <>
                        <option value="Penyelidikan / Legal Due Diligence">Penyelidikan / Legal Due Diligence</option>
                        <option value="Somasi & Negosiasi">Somasi & Negosiasi</option>
                        <option value="Pendaftaran Gugatan">Pendaftaran Gugatan</option>
                        <option value="Jawaban / Eksepsi">Jawaban / Eksepsi</option>
                        <option value="Replik / Duplik">Replik / Duplik</option>
                        <option value="Tahap Pembuktian">Tahap Pembuktian</option>
                        <option value="Kesimpulan">Kesimpulan</option>
                        <option value="Putusan Tingkat Pertama">Putusan Tingkat Pertama</option>
                        <option value="Banding">Banding</option>
                        <option value="Kasasi / PK">Kasasi / PK</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PIHAK & TUNTUTAN */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Klien (Penggugat / Pemohon) *</label>
                  <input
                    id="new-case-client-input"
                    type="text"
                    required
                    placeholder="Contoh: PT Mega Cahaya Prima"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nama Pihak Lawan (Tergugat / Termohon) *</label>
                  <input
                    id="new-case-opposing-input"
                    type="text"
                    required
                    placeholder="Contoh: PT Global Solusi Mandiri"
                    value={opposingParty}
                    onChange={(e) => setOpposingParty(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Nilai Tuntutan Ganti Rugi / Petitum (IDR)</label>
                <input
                  id="new-case-amount-input"
                  type="text"
                  placeholder="Contoh: Rp 25.000.000.000"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Ringkasan Duduk Perkara (Summary)</label>
                <textarea
                  id="new-case-summary-input"
                  rows={3}
                  placeholder="Jelaskan pokok sengketa, hubungan hukum para pihak, dan kronologi singkat..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>
            </div>
          )}

          {/* STEP 3: JADWAL & KRONOLOGI */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tanggal Kontrak / Perikatan</label>
                  <input
                    id="new-case-contract-date"
                    type="date"
                    value={contractDate}
                    onChange={(e) => setContractDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tanggal Dugaan Pelanggaran</label>
                  <input
                    id="new-case-breach-date"
                    type="date"
                    value={allegedBreachDate}
                    onChange={(e) => setAllegedBreachDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tanggal Kejadian Kritis</label>
                  <input
                    id="new-case-incident-date"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
                <span className="font-semibold text-amber-400 block">Inisiasi Dokumen & ULPE-AW Auto-Setup</span>
                <p className="text-[11px] text-slate-400">
                  Setelah disimpan, sistem akan secara otomatis membuat berkas perkara awal, menginisiasi checklist Preflight Readiness, dan menyiapkan rantai Traceability.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                disabled={step === 1 && (!title || !caseType)}
                onClick={() => setStep((step + 1) as any)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Lanjut</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Buat & Buka Perkara</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
