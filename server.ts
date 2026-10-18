import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "25mb" }));

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "TriyLex Legal Intelligence Backend",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// API: ULPE-AW Multi-Agent Case Analysis (LCA Perdata & PCA Pidana)
app.post("/api/gemini/analyze-case", async (req, res) => {
  try {
    const { caseData, documents, agentStage } = req.body;
    const ai = getGeminiClient();

    const isCriminalCase = 
      caseData?.methodology === 'PCA' || 
      [
        'Tindak Pidana Korupsi (Tipikor)',
        'Tindak Pidana Pencucian Uang (TPPU)',
        'Tindak Pidana Siber & ITE',
        'Tindak Pidana Bisnis & Korporasi',
        'Tindak Pidana Perpajakan & Kepabeanan',
        'Tindak Pidana Pasar Modal & Perbankan',
        'Tindak Pidana Lingkungan Hidup & Kehutanan',
        'Tindak Pidana Narkotika & Psikotropika',
        'Tindak Pidana Umum (KUHP: Penipuan, Penggelapan, Pemalsuan Surat)',
        'Pidana Bisnis / White Collar'
      ].some(t => (caseData?.caseType || '').includes(t) || (caseData?.caseType || '').toLowerCase().includes('pidana'));

    if (!ai) {
      return res.json({
        success: true,
        source: "engine_fallback",
        message: "Running using TriyLex Built-in Rule Engine (Configure GEMINI_API_KEY in Secrets for live LLM reasoning).",
        analysis: null,
      });
    }

    // MASTER PROMPT FOR CIVIL / LCA
    const lcaPrompt = `Anda adalah sistem kecerdasan hukum terstruktur "TriyLex ULPE-AW" (Universal Legal Prompt Engine) yang menganalisis perkara hukum perdata & komersial dengan yurisdiksi Indonesia.

DATA PERKARA:
Judul: ${caseData.title || "Perkara Tanpa Judul"}
Nomor Referensi: ${caseData.refNumber || "-"}
Klien: ${caseData.client || "-"} vs Lawan: ${caseData.opposingParty || "-"}
Jenis Perkara: ${caseData.caseType || "Perdata"}
Yurisdiksi: ${caseData.jurisdiction || "Indonesia"}
Pengadilan/Forum: ${caseData.courtForum || "Pengadilan Negeri"}
Posisi Prosedural: ${caseData.proceduralPosition || "Pemeriksaan Awal"}
Ringkasan Singkat: ${caseData.summary || "-"}

KLAIM & FAKTA AWAL:
Klaim Utama: ${JSON.stringify(caseData.claims || [])}
Petitum / Ganti Rugi: ${caseData.claimAmount || "-"}
Fakta Yang Diakui: ${JSON.stringify(caseData.admittedFacts || [])}
Fakta Disengketakan: ${JSON.stringify(caseData.disputedFacts || [])}

DOKUMEN BUKTI TERCATAT:
${documents?.map((d: any, idx: number) => `[D-${idx + 1}] ${d.name} (${d.category || "Dokumen"}): ${d.extractedText?.slice(0, 300) || "Teks belum diekstrak"}`).join("\n") || "Belum ada dokumen terunggah"}

TUGAS ANALISIS (Format JSON Murni):
Berikan hasil analisis komprehensif berstruktur ULPE-AW sesuai standar hukum Indonesia dengan format JSON valid sebagai berikut:
{
  "executiveSummary": "Ringkasan eksekutif 2-3 paragraf mengenai pokok sengketa, posisi yuridis para pihak, dan evaluasi awal",
  "facts": [
    {
      "id": "F-01",
      "text": "Deskripsi fakta konkret",
      "status": "Established" | "Alleged" | "Disputed" | "Unknown",
      "confidence": "High" | "Medium" | "Low",
      "sourceDocId": "D-1",
      "disputedBy": "Tergugat/Penggugat jika disengketakan"
    }
  ],
  "legalLayers": [
    {
      "id": "L-01",
      "layerName": "Nama Lapisan Hukum (contoh: Hukum Perjanjian & Wanprestasi / KUHPerdata)",
      "priorityScore": 95,
      "primarySources": ["Pasal 1320 KUHPerdata", "Pasal 1338 KUHPerdata", "Pasal 1243 KUHPerdata"],
      "triggeringFacts": ["F-01"],
      "potentialIssues": ["Apakah keterlambatan memenuhi kualifikasi wanprestasi atau keadaan memaksa (force majeure)?"]
    }
  ],
  "statutes": [
    {
      "id": "S-01",
      "lawName": "Kitab Undang-Undang Hukum Perdata (KUHPerdata)",
      "article": "Pasal 1243 & Pasal 1338 ayat (1)",
      "status": "Current",
      "effectiveDate": "Berlaku umum",
      "relevance": "Landasan gugatan ganti rugi atas kelalaian debitur dan asas pacta sunt servanda",
      "confidence": "High"
    }
  ],
  "evidenceMatrix": [
    {
      "evidenceId": "E-01",
      "name": "Nama Alat Bukti",
      "type": "Surat/Akta Otentik",
      "supportsFactId": "F-01",
      "reliability": "High",
      "isDirect": true,
      "corroborationStatus": "Corroborated",
      "notes": "Analisis kekuatan pembuktian"
    }
  ],
  "evidenceGaps": [
    {
      "id": "GAP-01",
      "description": "Dokumen atau bukti penting yang belum ada (contoh: Surat Somasi Resmi ke-3, Berita Acara Rekonsiliasi)",
      "impact": "High" | "Medium" | "Low",
      "recommendation": "Tindakan hukum atau dokumen yang wajib dilengkapi untuk menutup celah"
    }
  ],
  "argumentsSymmetric": [
    {
      "issueId": "I-01",
      "issueTitle": "Pokok Permasalahan Hukum",
      "claimantArgument": "Dalil dan dasar hukum posisi Penggugat/Klien",
      "defendantArgument": "Dalil sanggahan dan dasar posisi Tergugat/Lawan",
      "stressTestAnalysis": "Uji ketahanan argumentasi dan titik lemah utama",
      "counterstrategy": "Rekomendasi mitigasi strategi pembuktian di persidangan"
    }
  ],
  "traceability": [
    {
      "conclusionId": "C-01",
      "conclusionText": "Kesimpulan yuridis awal",
      "issueId": "I-01",
      "element": "Unsur wanprestasi / PMH terkait",
      "factId": "F-01",
      "evidenceId": "E-01",
      "documentRef": "D-01"
    }
  ],
  "riskMatrix": {
    "legalExposure": "Medium",
    "evidenceStrength": "Strong",
    "contradictionRisk": "Low",
    "temporalRisk": "Low",
    "proceduralRisk": "Medium",
    "analyticalConfidence": "High",
    "summaryNotes": "Catatan mitigasi risiko dan proyeksi pembuktian"
  },
  "verificationGate": {
    "status": "Verified",
    "auditScore": 88,
    "checklist": [
      { "item": "Verifikasi Kualifikasi Dokumen Legalitas", "verified": true, "notes": "Akta pendirian dan perizinan terverifikasi" },
      { "item": "Uji Konsistensi Fakta vs Kronologi", "verified": true, "notes": "Tidak ditemukan kontradiksi tanggal material" },
      { "item": "Verifikasi Validitas Sumber UU & Peraturan", "verified": true, "notes": "Pasal rujukan sah dan masih berlaku aktif" }
    ]
  }
}
HANYA berikan JSON valid.`;

    // MASTER PROMPT FOR CRIMINAL & SPECIAL CRIMES / PCA (PCA-001 s.d. PCA-015)
    const pcaPrompt = `Anda adalah sistem intelijen pembelaan perkara pidana tingkat tinggi "TriyLex PCA Master Engine" (Penal Case Analyst).
Tugas Anda adalah melakukan audit yuridis mendalam atas perkara pidana di Indonesia dengan standar pembuktian Beyond a Reasonable Doubt, asas praduga tak bersalah (Presumption of Innocence), Due Process of Law (Pasal 184 KUHAP & Putusan MK No. 21/PUU-XII/2014), serta perbandingan KUHP Baru UU 1/2023 vs WvS KUHP Lama & UU Pidana Khusus.

DATA PERKARA PIDANA:
Judul: ${caseData.title || "Perkara Pidana"}
Nomor Ref/LP/Sprindik: ${caseData.refNumber || "-"}
Tersangka/Terdakwa (Klien): ${caseData.client || "-"} vs Pelapor/Penyidik/JPU: ${caseData.opposingParty || "-"}
Klasifikasi Delik: ${caseData.caseType || "Tindak Pidana Khusus"}
Pengadilan/Forum: ${caseData.courtForum || "Pengadilan Negeri / Pengadilan Tipikor"}
Posisi Prosedural: ${caseData.proceduralPosition || "Penyidikan"}
Ringkasan Duduk Perkara: ${caseData.summary || "-"}
Tuntutan / Ancaman Pidana: ${caseData.claimAmount || "-"}

FAKTA DAN DOKUMEN:
Fakta Yang Diakui: ${JSON.stringify(caseData.admittedFacts || [])}
Fakta Disengketakan / Bantahan Alibi: ${JSON.stringify(caseData.disputedFacts || [])}
Dokumen Bukti & BAP: ${documents?.map((d: any, idx: number) => `[D-${idx + 1}] ${d.name} (${d.category}): ${d.extractedText?.slice(0, 300) || "Teks belum diekstrak"}`).join("\n") || "Belum ada"}

TUGAS ANALISIS PCA (Format JSON Murni):
Berikan hasil analisis komprehensif berstandar Litigasi Pidana Indonesia (PCA-001 s.d. PCA-015) dengan format JSON valid berikut:
{
  "executiveSummary": "Ringkasan eksekutif 3 paragraf: pokok sangkaan/dakwaan JPU, titik lemah pembuktian formil & materiil, serta proyeksi peluang putusan bebas (Vrijspraak) atau lepas (Onslag)",
  "facts": [
    {
      "id": "F-01",
      "text": "Uraian fakta konkret material peristiwa pidana (locus & tempus delicti)",
      "status": "Established" | "Alleged" | "Disputed",
      "confidence": "High" | "Medium" | "Low",
      "sourceDocId": "D-1",
      "disputedBy": "Terdakwa/Penasihat Hukum"
    }
  ],
  "legalLayers": [
    {
      "id": "L-01",
      "layerName": "Lapisan Norma Pidana (contoh: Unsur Melawan Hukum & Kerugian Keuangan Negara UU Tipikor jo. KUHP Baru UU 1/2023)",
      "priorityScore": 98,
      "primarySources": ["Pasal 2 ayat (1) jo. Pasal 18 UU Tipikor", "Pasal 55 ayat (1) ke-1 KUHP", "Pasal 603 UU No. 1/2023"],
      "triggeringFacts": ["F-01"],
      "potentialIssues": ["Apakah kerugian keuangan negara bersifat nyata dan pasti (actual loss) berdasarkan audit BPK, atau hanya potensi kerugian (potential loss)?"]
    }
  ],
  "statutes": [
    {
      "id": "S-01",
      "lawName": "Undang-Undang Tindak Pidana Korupsi jo. KUHP Baru UU 1/2023",
      "article": "Pasal 2 & 3 UU 31/1999 jo. Pasal 603 UU 1/2023",
      "status": "Current",
      "effectiveDate": "Berlaku Positif",
      "relevance": "Ketentuan delik materiil dan perbandingan ancaman pidana minimum berdasar asas Lex Favor Reo",
      "confidence": "High"
    }
  ],
  "evidenceMatrix": [
    {
      "evidenceId": "E-01",
      "name": "Keterangan Saksi / Ahli / Berkas BAP",
      "type": "Keterangan Saksi (184 ayat 1a)" | "Keterangan Ahli (184 ayat 1b)" | "Surat / Dokumen Resmi (184 ayat 1c)" | "Petunjuk (184 ayat 1d)" | "Bukti Elektronik (UU ITE/TPPU)",
      "supportsFactId": "F-01",
      "reliability": "High" | "Medium" | "Low",
      "isDirect": true,
      "corroborationStatus": "Corroborated" | "Single Source",
      "notes": "Analisis kekuatan pembuktian menurut Pasal 184 KUHAP dan doktrin Unus Testis Nullus Testis"
    }
  ],
  "evidenceGaps": [
    {
      "id": "GAP-01",
      "description": "Celah pembuktian JPU (contoh: Tiadanya audit investigatif BPK yang berkekuatan hukum, atau ketiadaan bukti perintah langsung / Mens Rea)",
      "impact": "High" | "Medium",
      "recommendation": "Gunakan sebagai dasar permohonan putusan bebas (Vrijspraak) pada Pledoi"
    }
  ],
  "argumentsSymmetric": [
    {
      "issueId": "I-01",
      "issueTitle": "Unsur Perbuatan Melawan Hukum & Niat Jahat (Mens Rea)",
      "claimantArgument": "Dalil Tuntutan/Dakwaan JPU: Terdakwa dianggap menyalahgunakan wewenang dan menguntungkan diri sendiri.",
      "defendantArgument": "Pembelaan Penasihat Hukum: Tindakan merupakan kebijakan bisnis murni (Business Judgment Rule) tanpa niat jahat (Mens Rea) dan telah disetujui dalam RUPS.",
      "stressTestAnalysis": "JPU kesulitan membuktikan aliran dana pribadi (kickback) ke Terdakwa.",
      "counterstrategy": "Hadirkan Saksi Ahli Hukum Pidana Korporasi dan Ahli Audit Forensik Keuangan Independen."
    }
  ],
  "traceability": [
    {
      "conclusionId": "C-01",
      "conclusionText": "Unsur kesengajaan (Dolus) dan kerugian negara tidak terbukti secara sah dan meyakinkan",
      "issueId": "I-01",
      "element": "Unsur Subyektif Mens Rea Pasal 2 ayat 1 UU Tipikor",
      "factId": "F-01",
      "evidenceId": "E-01",
      "documentRef": "D-01"
    }
  ],
  "riskMatrix": {
    "legalExposure": "Critical",
    "evidenceStrength": "Moderate",
    "contradictionRisk": "High",
    "temporalRisk": "Low",
    "proceduralRisk": "High",
    "analyticalConfidence": "High",
    "summaryNotes": "Terdapat pelanggaran formil prosedur penyidikan yang dapat diajukan ke Praperadilan atau Eksepsi Pasal 156 KUHAP."
  },
  "verificationGate": {
    "status": "Verified",
    "auditScore": 92,
    "checklist": [
      { "item": "Audit Uji Keabsahan Penetapan Tersangka (Putusan MK 21/2014)", "verified": true, "notes": "Tidak didahului pemeriksaan calon tersangka secara sah" },
      { "item": "Uji Rantai Kustodi Bukti Elektronik (UU ITE Pasal 5 & 6)", "verified": true, "notes": "Metadata digital tidak dilengkapi sertifikat digital forensik resmi" },
      { "item": "Uji Pemenuhan Unsur Mens Rea vs Culpa", "verified": true, "notes": "Tidak ditemukan niat jahat subjektif terdakwa" }
    ]
  },
  "pcaDueProcessAudit": {
    "suspectDesignationLegality": {
      "hasTwoValidEvidence": false,
      "calonTskExamined": false,
      "mk21Compliance": false,
      "notes": "Penetapan Tersangka melanggar Putusan MK No. 21/PUU-XII/2014 karena tidak didahului pemeriksaan sebagai calon tersangka dengan didampingi penasihat hukum."
    },
    "searchAndSeizureLegality": {
      "hasCourtPermit": true,
      "emergencyProtocolValid": true,
      "notes": "Penyitaan memiliki izin Ketua Pengadilan Negeri setempat."
    },
    "legalCounselRight": {
      "article56Compliant": true,
      "bapAccompanied": true,
      "notes": "Terdakwa didampingi advokat saat pemeriksaan BAP lanjutan."
    },
    "praperadilanViability": "Sangat Tinggi (Strong)",
    "praperadilanArguments": [
      "Penetapan Tersangka prematur sebelum terbitnya Laporan Hasil Audit PKN BPK RI resmi.",
      "Pelanggaran asas Due Process of Law atas hak membela diri pada tahap penyidikan.",
      "Penyitaan dokumen non-terkait tindak pidana tanpa penetapan pengadilan."
    ]
  },
  "pcaElementsDeconstruction": {
    "indictmentArticle": "Pasal 2 ayat (1) jo. Pasal 18 UU Tipikor jo. Pasal 55 ayat (1) ke-1 KUHP",
    "penalSystemComparison": {
      "wvsOldArticle": "Pasal 2 ayat (1) UU No. 31/1999 jo. UU No. 20/2001 (Ancaman min 4 tahun)",
      "kuhpNewUU12023Article": "Pasal 603 UU No. 1/2023 (Ancaman min 2 tahun, memuat klausul tujuan kepentingan umum)",
      "specialLawArticle": "UU No. 31 Tahun 1999 jo. UU No. 20 Tahun 2001 jo. UU No. 8 Tahun 2010 (TPPU)",
      "transitionPrinciple": "Asas Lex Favor Reo (Pasal 1 ayat 2 KUHP) - Ketentuan paling menguntungkan bagi terdakwa wajib diterapkan."
    },
    "objectiveElements": [
      {
        "element": "Setiap Orang (Natuurlijke Persoon)",
        "fulfillment": "Terpenuhi",
        "analysis": "Identitas terdakwa sesuai dengan surat dakwaan dan BAP penyidik.",
        "supportingEvidence": ["KTP Terdakwa", "Surat Keputusan Pengangkatan"]
      },
      {
        "element": "Secara Melawan Hukum (Wederrechtelijk)",
        "fulfillment": "Diragukan / Celah Pembelaan",
        "analysis": "Perbuatan didasarkan pada Keputusan Direksi dan SOP Perseroan yang sah, bukan perbuatan pidana melainkan ranah administratif/keperdataan.",
        "supportingEvidence": ["Akta Notaris SOP", "Notulen Rapat Direksi"]
      },
      {
        "element": "Dapat Merugikan Keuangan Negara atau Perekonomian Negara",
        "fulfillment": "Tidak Terpenuhi",
        "analysis": "Hasil audit investigatif BPK belum final; pekerjaan fisik telah selesai 100% dan menghasilkan manfaat operasional bagi negara.",
        "supportingEvidence": ["Berita Acara Serah Terima (BAST)", "Laporan Audit Fisik Independen"]
      }
    ],
    "subjectiveElements": [
      {
        "element": "Dengan Tujuan Menguntungkan Diri Sendiri atau Orang Lain atau Suatu Korporasi",
        "fulfillment": "Tidak Terpenuhi",
        "analysis": "Tidak ditemukan aliran dana masuk (kickback / suap) ke rekening terdakwa atau keluarga.",
        "supportingEvidence": ["Rekening Koran 5 Tahun Terakhir", "Laporan Hasil Analisis PPATK"]
      }
    ],
    "causalityAnalysis": "Tidak terdapat hubungan sebab-akibat langsung (causal nexus) antara keputusan administratif terdakwa dengan selisih perhitungan biaya proyek."
  },
  "pcaParticipationCorporate": {
    "participationForm": "Medepleger (Turut Serta Melakukan Ps 55-1-1)",
    "participationAnalysis": "JPU menuduh adanya perbarengan (medeplegen), namun tidak terbukti adanya kesepakatan batin (bewust samenwerking) dan pelaksanaan fisik bersama (gezamenlijke uitvoering) untuk melakukan kejahatan.",
    "corporateLiabilityApplicable": true,
    "corporateDoctrineUsed": "Perma No. 13 Tahun 2016",
    "corporateAnalysis": "Tindakan dilakukan dalam lingkup usaha perseroan; jika ada kesalahan prosedur, tanggung jawab berada pada subjek korporasi sesuai Perma No. 13/2016, bukan pidana perseorangan direksi."
  },
  "pcaDefenseExclusion": {
    "rechtvaardigingsgrond": {
      "type": "Menjalankan Peraturan UU (Ps 50)",
      "argument": "Tindakan terdakwa dilaksanakan untuk menjalankan ketentuan Keputusan Menteri dan regulasi pengadaan darurat bencana nasional.",
      "applicable": true
    },
    "schulduitsluitingsgrond": {
      "type": "Tiada Kesalahan Tanpa Pidana (Geen Straf Zonder Schuld)",
      "argument": "Terdakwa bertindak dengan itikad baik (good faith) tanpa niat jahat memperkaya diri.",
      "applicable": true
    },
    "defenseConclusion": "Terdapat alasan penghapus pidana (rechtvaardigingsgrond) dan ketiadaan Mens Rea, sehingga Terdakwa wajib dilepaskan dari segala tuntutan hukum (Onslag van alle rechtsvervolging)."
  },
  "pcaIndictmentStressTest": {
    "indictmentType": "Subsidairitas",
    "formalDefects": [
      "Uraian peranan antar-terdakwa kabur dan saling bertentangan (Obscuur Libel).",
      "Tidak diuraikannya secara cermat dan lengkap locus delicti pada dakwaan subsidair."
    ],
    "obscuurLibelAnalysis": "Surat Dakwaan JPU melanggar Pasal 143 ayat (2) huruf b KUHAP karena tidak merinci perbuatan materiil masing-masing terdakwa secara individual.",
    "nebisInIdemAnalysis": "Tidak ada unsur nebis in idem.",
    "daluwarsaAnalysis": "Daluwarsa penuntutan belum terlampaui (Pasal 78 KUHP).",
    "eksepsiRecommendations": [
      "Ajukan Eksepsi Surat Dakwaan Batal Demi Hukum (Null and Void) berdasarkan Pasal 143 ayat (3) KUHAP.",
      "Daftarkan Permohonan Praperadilan atas penetapan Tersangka sebelum sidang pembacaan dakwaan dimulai."
    ],
    "eksepsiDraftText": "Bahwa Surat Dakwaan Penuntut Umum Nomor Reg. Perkara PDS-04/JKT/2026 tanggal 14 Agustus 2026 dinyatakan BATAL DEMI HUKUM karena disusun secara tidak cermat, tidak jelas, dan tidak lengkap (obscuur libel)..."
  },
  "pcaCrossExaminationSimulator": {
    "witnessQuestions": [
      {
        "witnessName": "Saksi Investigator BAP (Penyidik)",
        "witnessRole": "Saksi BAP Penyidik",
        "targetedContradiction": "Apakah penyidik melakukan klarifikasi langsung kepada Terdakwa sebelum status ditingkatkan ke Tersangka?",
        "trappingQuestions": [
          "Bisa saksi jelaskan dasar tanggal penetapan Tersangka diterbitkan?",
          "Apakah saat penetapan tersebut, hasil audit resmi BPK sudah diserahkan kepada penyidik?",
          "Jika belum ada hasil audit BPK, dari mana penyidik menyimpulkan adanya kerugian negara nyata?"
        ],
        "expectedTrapGoal": "Mengakui bahwa penetapan TSK dilakukan secara prematur sebelum ada audit kerugian negara yang pasti."
      }
    ],
    "aDeChargeStrategy": [
      {
        "witnessCategory": "Ahli Hukum Pidana Materiil",
        "testimonyGoal": "Menegaskan bahwa delik Pasal 2 & 3 UU Tipikor merupakan delik materiil yang mensyaratkan kerugian nyata (actual loss) pasca Putusan MK No. 25/PUU-XIV/2016.",
        "keyQuestions": [
          "Bagaimana kedudukan hukum frasa 'dapat merugikan keuangan negara' pasca Putusan MK No. 25/2016?",
          "Apakah selisih administrasi kontraktual dapat serta-merta dikriminalisasi sebagai tindak pidana korupsi?"
        ]
      }
    ]
  },
  "pcaSentencingMatrix": {
    "primaryPenaltyRange": "Ancaman Primer: Pidana Penjara Seumur Hidup atau Min 4 Tahun Max 20 Tahun, Denda Rp 200 Juta - Rp 1 Miliar (Berdasarkan UU Tipikor Lama) vs Min 2 Tahun Max 20 Tahun (KUHP Baru UU 1/2023).",
    "restitutionOrStateLoss": "Tuntutan Uang Pengganti sebesar nilai selisih kontrak (Rp 18.400.000.000)",
    "assetForfeitureRisk": "Risiko pemblokiran dan perampasan aset rekening keluarga berdasar UU TPPU No. 8/2010.",
    "restorativeJusticeViability": "Tidak Memenuhi Syarat (Tipikor dikecualikan dari Restorative Justice kecuali tindak pidana umum ringan).",
    "mitigatingCircumstances": [
      "Terdakwa belum pernah dihukum pidana.",
      "Terdakwa bersikap kooperatif selama persidangan.",
      "Proyek fisik telah diserahterimakan dan dimanfaatkan oleh masyarakat."
    ],
    "aggravatingCircumstances": [
      "Perhatian publik yang tinggi terhadap perkara pengadaan infrastruktur digital."
    ]
  },
  "pcaPledoiDossier": {
    "pledoiTitle": "NOTA PEMBELAAN (PLEDOI): MENEGAKKAN KEADILAN TANPA MENGKRIMINALISASI KEBIJAKAN ADMINISTRATIF",
    "defenseTarget": "Vrijspraak (Bebas Murni)",
    "pledoiText": "MAJELIS HAKIM YANG MULIA,\\nJAKSA PENUNTUT UMUM YANG KAMI HORMATI,\\n\\nBerdasarkan fakta-fakta yang terungkap di muka persidangan, terbukti secara terang benderang bahwa Terdakwa tidak terbukti secara sah dan meyakinkan melakukan tindak pidana korupsi sebagaimana didakwakan dalam Dakwaan Primer maupun Subsidair. Oleh karena itu, kami memohon Majelis Hakim menyatakan Terdakwa BEBAS DARI SEGALA DAKWAAN (Vrijspraak) atau setidak-tidaknya DILEPASKAN DARI SEGALA TUNTUTAN HUKUM (Onslag van alle rechtsvervolging)..."
  }
}
HANYA berikan JSON valid, tanpa awalan markdown \`\`\`json.`;

    const prompt = isCriminalCase ? pcaPrompt : lcaPrompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    return res.json({
      success: true,
      source: isCriminalCase ? "gemini-3.7-flash (PCA Penal Intelligence)" : "gemini-3.7-flash (LCA Civil Intelligence)",
      analysis: parsed,
    });
  } catch (error: any) {
    console.error("Gemini Analysis API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to run AI analysis",
    });
  }
});

// API: PCA-003 Due Process of Law & Praperadilan Audit Engine
app.post("/api/gemini/pca-audit-due-process", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        audit: {
          suspectDesignationLegality: {
            hasTwoValidEvidence: false,
            calonTskExamined: false,
            mk21Compliance: false,
            notes: "Penetapan Tersangka melanggar Putusan MK No. 21/PUU-XII/2014 karena tidak didahului pemeriksaan calon tersangka secara sah."
          },
          searchAndSeizureLegality: {
            hasCourtPermit: true,
            emergencyProtocolValid: true,
            notes: "Terdapat surat izin penyitaan dari Ketua Pengadilan Negeri."
          },
          legalCounselRight: {
            article56Compliant: true,
            bapAccompanied: true,
            notes: "Terdakwa didampingi penasihat hukum pada saat pemeriksaan lanjutan."
          },
          praperadilanViability: "Sangat Tinggi (Strong)",
          praperadilanArguments: [
            "Penetapan Tersangka tidak didasarkan pada minimal 2 alat bukti yang sah menurut Pasal 184 KUHAP.",
            "Pelanggaran hak konstitusional calon Tersangka untuk didengar keterangannya sebelum penetapan status.",
            "Penyitaan barang bukti non-korpora delicti tanpa penetapan pengadilan."
          ]
        }
      });
    }

    const prompt = `Anda adalah Ahli Hukum Acara Pidana & Litigasi Praperadilan (SOP PCA-003 Due Process Audit).
Lakukan audit uji keabsahan formil proses penyidikan, penetapan tersangka berdasarkan Putusan MK No. 21/PUU-XII/2014, keabsahan penggeledahan/penyitaan (Pasal 32-49 KUHAP), dan hak bantuan hukum (Pasal 56 KUHAP):

DATA PERKARA:
Judul: ${caseData?.title}
Tersangka/Klien: ${caseData?.client} vs Penyidik/JPU: ${caseData?.opposingParty}
Klasifikasi: ${caseData?.caseType}
Ringkasan Fakta: ${caseData?.summary}
Fakta: ${JSON.stringify(caseData?.facts || [])}
Bukti Terdaftar: ${JSON.stringify(caseData?.evidenceMatrix || [])}

Format JSON yang HARUS dikembalikan:
{
  "suspectDesignationLegality": {
    "hasTwoValidEvidence": boolean,
    "calonTskExamined": boolean,
    "mk21Compliance": boolean,
    "notes": "Analisis yuridis keabsahan penetapan Tersangka"
  },
  "searchAndSeizureLegality": {
    "hasCourtPermit": boolean,
    "emergencyProtocolValid": boolean,
    "notes": "Analisis keabsahan surat geledah dan sita"
  },
  "legalCounselRight": {
    "article56Compliant": boolean,
    "bapAccompanied": boolean,
    "notes": "Analisis pemenuhan hak advokat Pasal 56 KUHAP"
  },
  "praperadilanViability": "Sangat Tinggi (Strong)" | "Cukup Beralasan (Moderate)" | "Lemah / Tidak Layak (Weak)",
  "praperadilanArguments": [
    "Daftar 3-4 dalil pokok permohonan Praperadilan yang paling solid untuk membatalkan status Tersangka"
  ]
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, audit: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: PCA-008 Elements of Crime Deconstruction (Actus Reus, Mens Rea & Dual KUHP)
app.post("/api/gemini/pca-deconstruct-elements", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        deconstruction: {
          indictmentArticle: "Pasal 2 ayat (1) jo. Pasal 18 UU Tipikor jo. Pasal 55 ayat (1) ke-1 KUHP",
          penalSystemComparison: {
            wvsOldArticle: "Pasal 2 ayat (1) UU Tipikor (Pidana Penjara min. 4 tahun)",
            kuhpNewUU12023Article: "Pasal 603 UU No. 1/2023 (Pidana Penjara min. 2 tahun)",
            specialLawArticle: "UU No. 31/1999 jo. UU No. 20/2001 & UU No. 8/2010 (TPPU)",
            transitionPrinciple: "Asas Lex Favor Reo (Pasal 1 ayat 2 KUHP) - Penerapan ketentuan pidana yang paling menguntungkan bagi terdakwa."
          },
          objectiveElements: [
            {
              element: "Setiap Orang",
              fulfillment: "Terpenuhi",
              analysis: "Subjek hukum orang perorangan telah teridentifikasi sesuai BAP.",
              supportingEvidence: ["KTP & SK Pengangkatan"]
            },
            {
              element: "Secara Melawan Hukum (Wederrechtelijk)",
              fulfillment: "Diragukan / Celah Pembelaan",
              analysis: "Perbuatan dilakukan berdasarkan SOP resmi korporasi dan diskresi bisnis, bukan pelanggaran norma pidana.",
              supportingEvidence: ["SOP Perusahaan", "Notulen Rapat"]
            }
          ],
          subjectiveElements: [
            {
              element: "Dengan Sengaja / Niat Jahat (Mens Rea)",
              fulfillment: "Tidak Terpenuhi",
              analysis: "Tidak ditemukan adanya niat jahat (dolus) untuk menguntungkan diri sendiri.",
              supportingEvidence: ["Rekening koran tanpa aliran kickback"]
            }
          ],
          causalityAnalysis: "Tidak ada hubungan kausalitas langsung antara tindakan administratif dengan potensi keterlambatan proyek."
        }
      });
    }

    const prompt = `Anda adalah Guru Besar / Ahli Hukum Pidana Materiil Indonesia (SOP PCA-008 & PCA-007 Elements Deconstruction).
Bedah delik pidana pada perkara berikut: pisahkan Unsur Obyektif (Actus Reus), Unsur Subyektif (Mens Rea: Dolus vs Culpa), ajaran Kausalitas, serta perbandingan hukum materiil KUHP Baru UU 1/2023 vs WvS KUHP Lama & UU Pidana Khusus dengan asas Lex Favor Reo:

DATA PERKARA:
Judul: ${caseData?.title}
Terdakwa/Klien: ${caseData?.client} vs JPU: ${caseData?.opposingParty}
Klasifikasi Delik: ${caseData?.caseType}
Ringkasan: ${caseData?.summary}
Fakta & Bukti: ${JSON.stringify(caseData?.facts || [])}

Format JSON yang HARUS dikembalikan:
{
  "indictmentArticle": "Pasal dakwaan lengkap (contoh: Pasal 2 ayat 1 UU Tipikor jo. Pasal 55 KUHP)",
  "penalSystemComparison": {
    "wvsOldArticle": "Bunyi pasal & ancaman sanksi dalam WvS / UU Khusus saat ini",
    "kuhpNewUU12023Article": "Ketentuan ekivalen dalam KUHP Baru UU No. 1/2023",
    "specialLawArticle": "Pasal UU Pidana Khusus terkait (Tipikor/TPPU/ITE/Pajak/Narkotika)",
    "transitionPrinciple": "Analisis penerapan Asas Transisi Lex Favor Reo (Pasal 1 ayat 2 KUHP)"
  },
  "objectiveElements": [
    {
      "element": "Nama Unsur Obyektif / Actus Reus",
      "fulfillment": "Terpenuhi" | "Tidak Terpenuhi" | "Diragukan / Celah Pembelaan",
      "analysis": "Uraian fakta pembuktian unsur",
      "supportingEvidence": ["Rujukan bukti pendukung atau ketiadaan bukti"]
    }
  ],
  "subjectiveElements": [
    {
      "element": "Nama Unsur Subyektif / Mens Rea (Kesengajaan / Kealpaan / Maksud)",
      "fulfillment": "Terpenuhi" | "Tidak Terpenuhi" | "Diragukan / Celah Pembelaan",
      "analysis": "Uraian ada/tidaknya niat jahat (Mens Rea)",
      "supportingEvidence": ["Rujukan fakta"]
    }
  ],
  "causalityAnalysis": "Analisis ajaran kausalitas (Conditio Sine Qua Non / Adequaat / Individualiserende)"
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, deconstruction: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: PCA-012 Cross-Examination Simulator & Saksi A De Charge Preparator
app.post("/api/gemini/pca-cross-examination", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        crossExam: {
          witnessQuestions: [
            {
              witnessName: "Saksi Penyidik / Investigator BAP",
              witnessRole: "Saksi BAP Penyidik",
              targetedContradiction: "Dasar kepastian kerugian negara sebelum penetapan tersangka.",
              trappingQuestions: [
                "Apakah saat Saudara memeriksa saksi, Laporan Audit BPK RI sudah diterbitkan?",
                "Siapa yang pertama kali menyebutkan angka dugaan kerugian tersebut?",
                "Apakah Saudara mengonfirmasi dokumen pembanding dari pihak Terdakwa?"
              ],
              expectedTrapGoal: "Membuktikan bahwa penyidik menarik kesimpulan prematur tanpa dasar audit kerugian riil."
            }
          ],
          aDeChargeStrategy: [
            {
              witnessCategory: "Ahli Hukum Pidana Materiil",
              testimonyGoal: "Menegaskan batasan ranah pidana vs perdata serta doktrin ketiadaan Mens Rea.",
              keyQuestions: [
                "Bagaimana penerapan asas Ultimum Remedium dalam perkara kebijakan korporasi?",
                "Apakah kerugian yang belum dihitung secara nyata dapat dijadikan dasar pemidanaan?"
              ]
            }
          ]
        }
      });
    }

    const prompt = `Anda adalah Litigator Pidana Senior & Pakar Cross-Examination Persidangan (SOP PCA-012).
Buat strategi uji silang (cross-examination) terhadap saksi-saksi yang memberatkan (A Charge / Penyidik / Pelapor) untuk mengungkap kontradiksi BAP, serta panduan pemeriksaan saksi meringankan (A De Charge) dan ahli di persidangan:

DATA PERKARA:
Judul: ${caseData?.title}
Terdakwa: ${caseData?.client} vs JPU/Penyidik: ${caseData?.opposingParty}
Klasifikasi: ${caseData?.caseType}
Duduk Perkara: ${caseData?.summary}
Fakta: ${JSON.stringify(caseData?.facts || [])}
Bukti: ${JSON.stringify(caseData?.evidenceMatrix || [])}

Format JSON yang HARUS dikembalikan:
{
  "witnessQuestions": [
    {
      "witnessName": "Nama / Kategori Saksi Memberatkan (A Charge)",
      "witnessRole": "Saksi BAP Penyidik" | "Saksi Korban" | "Saksi Mahkota" | "Ahli Penuntut Umum",
      "targetedContradiction": "Poin kontradiksi atau kelemahan yang dibidik",
      "trappingQuestions": [
        "Daftar 3 pertanyaan menjebak berurutan yang menuntut jawaban ya/tidak atau fakta mutlak"
      ],
      "expectedTrapGoal": "Tujuan akhir yang diharapkan dari pengakuan saksi di muka persidangan"
    }
  ],
  "aDeChargeStrategy": [
    {
      "witnessCategory": "Saksi Fakta Alibi" | "Ahli Hukum Pidana Materiil" | "Ahli Forensik Digital / Auditor Finansial",
      "testimonyGoal": "Tujuan pokok kesaksian yang akan membantah dalil JPU",
      "keyQuestions": [
        "Daftar 2-3 pertanyaan terarah untuk menggali keterangan ahli/saksi meringankan"
      ]
    }
  ]
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ success: true, crossExam: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: PCA-015 Master Pledoi (Nota Pembelaan) & Eksepsi Compiler
app.post("/api/gemini/pca-draft-pledoi", async (req, res) => {
  try {
    const { caseData, docType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        draftText: `# NOTA PEMBELAAN (PLEDOI)
Nomor Perkara: ${caseData?.refNumber || "TRX/2026/CRM-042"}
Pengadilan: ${caseData?.courtForum || "Pengadilan Tindak Pidana Korupsi"}

Majelis Hakim Yang Mulia,
Jaksa Penuntut Umum Yang Kami Hormati,

Bertindak untuk dan atas nama Terdakwa ${caseData?.client || "Klien"}, bersama ini kami sampaikan Nota Pembelaan (Pledoi) atas Surat Tuntutan (Requisitoir) Penuntut Umum.

I. PENDAHULUAN & ASAS PRADUGA TAK BERSALAH
Terdakwa hadir di hadapan persidangan ini dilindungi oleh asas praduga tak bersalah (Presumption of Innocence) dan asas tiada pidana tanpa kesalahan (Geen Straf Zonder Schuld).

II. FAKTA-FAKTA YANG TERUNGKAP DI PERSIDANGAN
Berdasarkan keterangan saksi-saksi dan bukti surat yang diajukan, terbukti bahwa tidak ada satupun aliran dana atau niat jahat yang mengalir kepada Terdakwa.

III. ANALISIS YURIDIS ATAS UNSUR-UNSUR DAKWAAN
Unsur "Secara Melawan Hukum" dan "Menguntungkan Diri Sendiri" TIDAK TERBUKTI secara sah dan meyakinkan menurut Pasal 183 jo. Pasal 184 KUHAP.

IV. PETITUM
Memohon Majelis Hakim yang Mulia memutuskan:
1. Menyatakan Terdakwa tidak terbukti secara sah dan meyakinkan bersalah melakukan tindak pidana sebagaimana didakwakan.
2. Membebaskan Terdakwa dari segala dakwaan (Vrijspraak) atau melepaskan Terdakwa dari segala tuntutan hukum (Onslag van alle rechtsvervolging).
3. Memulihkan harkat, martabat, dan nama baik Terdakwa.`
      });
    }

    const isEksepsi = (docType || "").toLowerCase().includes("eksepsi");

    const prompt = isEksepsi ? `Anda adalah Litigator Pidana Senior. Susun draf resmi "NOTA KEBERATAN / EKSEPSI" (Pasal 156 ayat 1 KUHAP) atas Surat Dakwaan Penuntut Umum untuk perkara berikut:
DATA PERKARA:
Perkara: ${caseData?.title}
No. Reg: ${caseData?.refNumber}
Terdakwa: ${caseData?.client} vs JPU: ${caseData?.opposingParty}
Pengadilan: ${caseData?.courtForum}
Dakwaan: ${caseData?.pcaElementsDeconstruction?.indictmentArticle || caseData?.summary}
Cacat Dakwaan: ${JSON.stringify(caseData?.pcaIndictmentStressTest?.formalDefects || ["Dakwaan kabur / Obscuur Libel", "Tidak cermat dan tidak jelas (Pasal 143 ayat 2 KUHAP)"])}

Susun Nota Eksepsi lengkap dengan Format:
1. KEPALA EKSEPSI & IDENTITAS TERDAKWA
2. DASAR HUKUM PENGAJUAN EKSEPSI (Pasal 156 KUHAP)
3. ALASAN-ALASAN KEBERATAN (Kompetensi Pengadilan, Dakwaan Batal Demi Hukum / Obscuur Libel Pasal 143 ayat 2b KUHAP)
4. PETITUM EKSEPSI (Menerima Eksepsi, Menyatakan Dakwaan Batal Demi Hukum, Memerintahkan Terdakwa Dikeluarkan dari Tahanan).
Format Markdown rapi.` : `Anda adalah Lead Criminal Defense Counsel senior di Indonesia.
Susun draf resmi "NOTA PEMBELAAN (PLEDOI)" Terdakwa & Penasihat Hukum secara komprehensif, tajam, elegan, dan berbobot hukum tinggi untuk dibacakan di hadapan Majelis Hakim:

DATA PERKARA:
Judul: ${caseData?.title}
No. Perkara: ${caseData?.refNumber}
Terdakwa: ${caseData?.client}
Jaksa Penuntut Umum: ${caseData?.opposingParty}
Forum: ${caseData?.courtForum}
Dakwaan/Tuntutan: ${caseData?.pcaElementsDeconstruction?.indictmentArticle || caseData?.summary}
Duduk Perkara & Fakta: ${JSON.stringify(caseData?.facts || [])}
Alat Bukti: ${JSON.stringify(caseData?.evidenceMatrix || [])}
Bedah Unsur Delik: ${JSON.stringify(caseData?.pcaElementsDeconstruction || {})}
Alasan Penghapus Pidana: ${JSON.stringify(caseData?.pcaDefenseExclusion || {})}

SUSUN NOTA PEMBELAAN (PLEDOI) LENGKAP MEMUAT 7 BAB POKOK:
1. JUDUL & KATA PENGANTAR (Mengutip adagium hukum: Lebih baik membebaskan 100 orang bersalah daripada menghukum 1 orang tidak bersalah / In Dubio Pro Reo)
2. DUDUK PERKARA & IDENTITAS TERDAKWA
3. FAKTA-FAKTA HUKUM YANG TERUNGKAP DI MUKA PERSIDANGAN (Saksi, Ahli, Bukti Surat & Keterangan Terdakwa)
4. ANALISIS YURIDIS: BEDAH KETIDAKTERBUKTIAN UNSUR-UNSUR DAKWAAN (Actus Reus & Mens Rea)
5. ALASAN PEMBENAR DAN/ATAU ALASAN PEMAAF (Pasal 48 - 51 KUHP & Doktrin Geen Straf Zonder Schuld)
6. PERTIMBANGAN HAL-HAL YANG MERINGANKAN
7. PETITUM PEMBELAAN (Permohonan Putusan Bebas Murni / Vrijspraak atau Lepas dari Segala Tuntutan / Onslag van alle rechtsvervolging).

Format Markdown formal dan profesional.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { temperature: 0.2 },
    });

    res.json({ success: true, draftText: response.text });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Multi-turn Interactive Case Assistant with Personas
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, rolePersona, caseContext } = req.body;
    const ai = getGeminiClient();

    const rolePersonas: Record<string, string> = {
      lead_counsel: "Anda adalah Lead Litigation Counsel & Strategist senior Indonesia. Fokus pada taktik litigasi persidangan, strategi pembuktian komprehensif, manajemen risiko, dan mitigasi posisi klien di hadapan majelis hakim.",
      statute_expert: "Anda adalah Pakar Hierarki Norma & Yurisprudensi Indonesia. Fokus pada interpretasi pasal KUHPerdata, KUHAP, UU Sektoral Khusus (UU ITE, UU Kepailitan, UU Hak Cipta, dll.), doktrin Lex Specialis Derogat Legi Generali, dan yurisprudensi Mahkamah Agung RI.",
      evidence_auditor: "Anda adalah Auditor Forensik Alat Bukti & Rantai Kustodi. Fokus pada keabsahan formil/materiil alat bukti (Pasal 1866 KUHPerdata / Pasal 184 KUHAP), deteksi bukti hearsay (testimonium de auditu), celah pembuktian (evidence gaps), dan pembuktian digital UU ITE.",
      opposing_advocate: "Anda adalah Devil's Advocate / Kuasa Hukum Lawan (Opposing Counsel). Tugas Anda adalah secara agresif menguji kelemahan dalil, mencari kontradiksi fakta, mengajukan sanggahan eksepsi (kompetensi relatif/absolut, obscurum libellum, prematur), dan mendeteksi celah dalam bukti klien.",
    };

    const selectedPersonaInstruction = rolePersonas[rolePersona || "lead_counsel"] || rolePersonas.lead_counsel;

    if (!ai) {
      const lastMsg = messages?.[messages.length - 1]?.content || "analisis perkara";
      return res.json({
        success: true,
        reply: `[Mode Standar TriyLex Offline Engine]\n\nBerdasarkan peran ${rolePersona || "Lead Counsel"} dan data perkara:\n- Isu Terkait: ${lastMsg}\n- Rekomendasi: Lakukan verifikasi silang antara dokumen bukti fisik (Traceability Matrix) dengan kronologi fakta. Pastikan pasal rujukan telah memenuhi unsur kausalitas dan tidak terdapat eksepsi daluwarsa/prematur.\n\n*(Catatan: Pasang GEMINI_API_KEY di Secrets untuk penalaran LLM langsung)*`,
      });
    }

    const systemInstruction = `${selectedPersonaInstruction}

KONTEKS PERKARA AKTIF:
Judul: ${caseContext?.title || "Perkara Terbuka"}
Nomor Ref: ${caseContext?.refNumber || "-"}
Para Pihak: ${caseContext?.client || "Klien"} (Klien) vs ${caseContext?.opposingParty || "Lawan"} (Lawan)
Jenis Perkara: ${caseContext?.caseType || "Perdata / Komersial"}
Ringkasan Fakta: ${caseContext?.summary || "-"}
Klaim Utama: ${caseContext?.claims?.map((c: any) => c.title).join("; ") || "-"}
Bukti Terdaftar: ${caseContext?.evidenceMatrix?.map((e: any) => `${e.evidenceId}: ${e.name} (${e.type})`).join("; ") || "Belum ada"}

PEDOMAN JAWABAN:
1. Gunakan bahasa Indonesia hukum yang lugas, profesional, presisi, dan terstruktur.
2. Sertakan dasar hukum positif Indonesia (pasal, UU, atau doktrin hukum acara) jika relevan.
3. Berikan rincian taktis yang dapat langsung diterapkan oleh tim advokat/analis.`;

    // Convert messages to Gemini format
    const contents = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content || "" }],
    }));

    if (contents.length === 0) {
      contents.push({
        role: "user",
        parts: [{ text: "Berikan evaluasi awal dan pokok pertimbangan hukum untuk perkara ini." }],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process chat message",
    });
  }
});

// API: AI Case Ingestion & Structuring from Raw Narrative
app.post("/api/gemini/generate-case-from-narrative", async (req, res) => {
  try {
    const { narrative } = req.body;
    const ai = getGeminiClient();

    if (!ai || !narrative) {
      return res.json({
        success: true,
        source: "fallback",
        caseDraft: {
          title: "Sengketa Perdata Komersial Berdasarkan Narasi Klien",
          client: "PT Klien Sejahtera",
          opposingParty: "PT Mitra Usaha Lawan",
          caseType: "Perdata / Wanprestasi",
          summary: narrative?.slice(0, 300) || "Ekstraksi ringkasan kasus dari narasi kronologis para pihak.",
          claimAmount: "Rp 1.500.000.000",
          incidentDate: new Date().toISOString().split("T")[0],
          claims: [{ title: "Ganti Rugi & Pemenuhan Kewajiban Kontraktual", claimedAmount: "Rp 1.500.000.000" }],
          timeline: [{ date: "2025-01-15", title: "Awal Hubungan Hukum", description: "Kesepakatan awal para pihak" }],
          facts: [{ id: "F-01", text: "Para pihak mengikatkan diri dalam hubungan hukum." }],
        },
      });
    }

    const prompt = `Anda adalah sistem ekstraksi cerdas perkara hukum Indonesia TriyLex ULPE-AW.
Tugas Anda adalah membaca narasi/kronologi mentah berikut dan mengekstraknya menjadi struktur data perkara yang rapi dan terverifikasi.

NARASI / CATATAN MENTAH KASUS:
"""
${narrative}
"""

Format output yang HARUS dihasilkan HANYA berupa JSON valid dengan skema berikut:
{
  "title": "Judul perkara formal yang ringkas dan deskriptif",
  "client": "Nama Klien / Pihak Pertama",
  "opposingParty": "Nama Pihak Lawan / Tergugat / Terlapor",
  "caseType": "Perdata / Wanprestasi" | "Perdata / Perbuatan Melawan Hukum (PMH)" | "Komersial / Arbitrase & Bisnis" | "Ketenagakerjaan (PHI)" | "Tata Usaha Negara (TUN)" | "Pidana Khusus / Tipikor & Cyber",
  "summary": "Ringkasan duduk perkara 2-3 paragraf",
  "claimAmount": "Contoh: Rp 2.450.000.000 (atau Rp 0 jika non-materiil)",
  "incidentDate": "YYYY-MM-DD",
  "contractDate": "YYYY-MM-DD atau null",
  "allegedBreachDate": "YYYY-MM-DD atau null",
  "claims": [
    {
      "title": "Judul klaim / tuntutan",
      "description": "Uraian pokok tuntutan",
      "claimedAmount": "Rp Nominal",
      "legalBasis": "Pasal rujukan (contoh: Pasal 1243 KUHPerdata)"
    }
  ],
  "timeline": [
    {
      "date": "YYYY-MM-DD",
      "title": "Judul Peristiwa",
      "description": "Rincian peristiwa kronologis",
      "category": "Contract" | "Payment" | "Communication" | "Breach" | "Formal Notice",
      "importance": "Key" | "Secondary"
    }
  ],
  "facts": [
    {
      "id": "F-01",
      "text": "Fakta konkret yang dapat dibuktikan",
      "status": "Established" | "Disputed" | "Alleged",
      "category": "Contractual" | "Financial" | "Communication" | "Conduct"
    }
  ],
  "admittedFacts": ["Fakta yang diakui kedua pihak"],
  "disputedFacts": ["Fakta yang disengketakan"],
  "suggestedStatutes": [
    {
      "lawName": "Nama Peraturan / Kitab UU",
      "article": "Pasal terkait",
      "relevance": "Relevansi dengan perkara"
    }
  ]
}

HANYA kembalikan JSON valid tanpa markdown \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json({
      success: true,
      caseDraft: parsed,
    });
  } catch (error: any) {
    console.error("Case Generation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: AI Legal Document Drafter (Somasi, Gugatan, Eksepsi, Legal Opinion)
app.post("/api/gemini/draft-legal-document", async (req, res) => {
  try {
    const { docType, caseData, specificInstructions } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "template_engine",
        draft: `# DRAF RESMI: ${docType?.toUpperCase() || "DOKUMEN HUKUM"}
Nomor Ref: ${caseData?.refNumber || "TRX/2026/DRAFT"}
Perkara: ${caseData?.title || "Sengketa Perdata"}

Kepada Yth.
${caseData?.opposingParty || "Pihak Terkait"}
Di Tempat

Dengan hormat,
Bertindak untuk dan atas nama klien kami, ${caseData?.client || "Klien"}, bersama ini kami sampaikan ${docType || "surat teguran/permohonan"} sehubungan dengan dugaan wanprestasi/pelanggaran pemenuhan kewajiban senilai ${caseData?.claimAmount || "Rp 0"}.

POKOK PERMASALAHAN:
${caseData?.summary || "Uraian pokok sengketa"}

DASAR HUKUM:
1. Pasal 1320, 1338 ayat (1), dan Pasal 1243 Kitab Undang-Undang Hukum Perdata (KUHPerdata).
2. Doktrin itikad baik dalam pelaksanaan perjanjian.

PETITUM / TUNTUTAN:
1. Meminta penyelesaian kewajiban dalam jangka waktu 7 (tujuh) hari kalender.
2. Membayar ganti rugi materiil secara tunai dan seketika.

Hormat kami,
Kuasa Hukum ${caseData?.client || "Klien"}
TriyLex Law Firm & Partners`,
      });
    }

    const prompt = `Anda adalah Master Legal Drafter spesialis hukum perdata, bisnis, dan tindak pidana Indonesia.
Buat draf resmi dokumen hukum bertipe "${docType}" untuk perkara berikut:

DATA PERKARA:
Judul: ${caseData?.title}
No. Perkara/LP/Sprindik: ${caseData?.refNumber}
Klien (Pihak Kami): ${caseData?.client}
Lawan (Pihak Lawan/JPU/Penyidik): ${caseData?.opposingParty}
Jenis: ${caseData?.caseType}
Pengadilan/Forum: ${caseData?.courtForum}
Nilai Tuntutan / Ancaman Pidana: ${caseData?.claimAmount}
Ringkasan Sengketa / Duduk Perkara: ${caseData?.summary}

KLAIM & PETITUM:
${JSON.stringify(caseData?.claims || [])}

FAKTA POKOK & BUKTI:
Fakta: ${JSON.stringify(caseData?.facts?.map((f: any) => f.text) || [])}
Bukti: ${JSON.stringify(caseData?.evidenceMatrix?.map((e: any) => `${e.name} (${e.type})`) || [])}
Dasar UU: ${JSON.stringify(caseData?.statutes?.map((s: any) => `${s.article} - ${s.lawName}`) || [])}

INSTRUKSI KHUSUS PENGGUNA:
"${specificInstructions || "Buat draf komprehensif, formal, memenuhi syarat formil dan materiil hukum acara Indonesia."}"

PEDOMAN PENYUSUNAN BERDASARKAN TIPE DOKUMEN:
- Jika "Surat Somasi / Teguran Hukum": Buat surat somasi formal dengan tenggat waktu tegas (7 hari kerja), peringatan konsekuensi hukum perdata & pidana jika relevan, dan perincian kerugian.
- Jika "Surat Gugatan Wanprestasi/PMH": Susun format gugatan lengkap (Identitas Para Pihak, Posita / Dasar Gugatan berdasar fakta konkret & kronologis, Petitum Primer & Subsider / Ex Aequo Et Bono).
- Jika "Eksepsi & Jawaban Tergugat": Susun Eksepsi Formil (Kompetensi, Obscurum Libellum, Error in Persona) dan Bantahan Pokok Perkara (Materieel Verweer).
- Jika "Legal Opinion Memo (LO)": Susun Executive Legal Opinion Memo berstandar law firm Tier-1 (Executive Summary, Statement of Facts, Legal Issues & Regulatory Framework, In-Depth Legal Analysis & Risk Assessment, Practical Recommendations).
- Jika "Permohonan Praperadilan (Pasal 77 KUHAP jo. Putusan MK 21/2014)": Susun Permohonan Praperadilan atas Keabsahan Penetapan Tersangka / Geledah / Sita, mencakup Duduk Perkara, Alasan Hukum Uji 2 Alat Bukti Sah, Yurisprudensi MK No. 21/PUU-XII/2014, dan Petitum Pembatalan Penetapan Tersangka serta Perintah Penghentian Penyidikan (SP3).
- Jika "Nota Keberatan / Eksepsi Pidana (Pasal 156 KUHAP)": Susun Eksepsi Surat Dakwaan Batal Demi Hukum (Null and Void) Pasal 143 ayat (2) KUHAP (dakwaan kabur / obscuur libel, tidak cermat, tidak jelas, tidak lengkap, atau daluwarsa Pasal 78 KUHP).
- Jika "Nota Pembelaan / Pledoi (Terdakwa & Penasihat Hukum)": Susun Pledoi lengkap 7 Bab (Pendahuluan In Dubio Pro Reo, Fakta Persidangan, Analisis Yuridis Ketidakterbuktian Unsur Actus Reus & Mens Rea, Alasan Penghapus Pidana Pasal 48-51 KUHP, Hal-hal Meringankan, dan Petitum Bebas Vrijspraak / Lepas Onslag).
- Jika "Surat Permohonan Penangguhan / Pengalihan Penahanan (Pasal 31 KUHAP)": Susun surat permohonan resmi dengan jaminan orang/uang, komitmen kooperatif, tidak melarikan diri, tidak merusak barang bukti.
- Jika "Daftar Pertanyaan Saksi Sidang (Cross-Examination Matrix)": Susun daftar pertanyaan jebakan untuk saksi verbalisan / penyidik dan saksi A Charge JPU di persidangan.
- Jika "Memori Banding Pidana": Susun Memori Banding membedah kekeliruan penerapan hukum (judex facti) oleh Pengadilan Negeri.

Sajikan dalam format Markdown yang elegan, berstruktur rapi dengan nomor pasal dan rujukan hukum positif yang presisi.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    res.json({
      success: true,
      draft: response.text,
    });
  } catch (error: any) {
    console.error("Legal Drafting Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: AI Simulated Judicial Scrutiny & Stress Test (LCA Perdata & PCA Pidana)
app.post("/api/gemini/simulate-stress-test", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();
    const isCriminal = caseData?.methodology === 'PCA';

    if (!ai) {
      return res.json({
        success: true,
        simulation: isCriminal ? {
          successProbability: 72,
          judicialPosture: "Majelis Hakim Pidana mencermati potensi Obscuur Libel pada Surat Dakwaan JPU dan ketidaksinkronan keterangan saksi mahkota",
          criticalVulnerabilities: [
            "Penyidik belum membuktikan aliran dana (mens rea perbuatan memperkaya diri) secara riil dalam audit BPK/BPKP.",
            "Tersangka belum didampingi advokat saat pemeriksaan BAP awal."
          ],
          opposingCounterAttack: "JPU akan mendalilkan doktrin penyertaan (Pasal 55 ayat 1 ke-1 KUHP) dan pemufakatan jahat tanpa perlu bukti fisik uang tunai.",
          judgeBenchQuestions: [
            "Bagaimana peran riil Terdakwa dalam proses persetujuan lelang/kontrak menurut SOP internal?",
            "Apakah penghitungan kerugian keuangan negara telah berstatus final (Inkracht Audit BPKP) atau perkiraan estimasi semata?",
            "Bagaimana penasihat hukum membantah keterangan saksi yang menyebut Terdakwa hadir dalam pertemuan koordinasi?"
          ],
          mitigationChecklist: [
            "Ajukan Eksepsi Surat Dakwaan Cacat Formil berdasarkan Pasal 143 ayat (2) huruf b KUHAP (dakwaan kabur/tidak cermat).",
            "Hadirkan Ahli Hukum Pidana dan Ahli Keuangan Negara untuk menguji batasan Kerugian Negara Riil vs Risiko Bisnis (Business Judgment Rule)."
          ]
        } : {
          successProbability: 76,
          judicialPosture: "Cenderung Berpihak ke Klien dengan Syarat Pembuktian Asli Dokumen Kontrak Dilengkapi",
          criticalVulnerabilities: [
            "Surat Somasi ke-3 belum dilengkapi tanda terima ekspedisi resmi (tanda terima basah).",
            "Dalil ganti rugi immateriil belum diuraikan kalkulasi rincian kerugian riilnya."
          ],
          opposingCounterAttack: "Tergugat akan mendalilkan Force Majeure dan keterlambatan pasokan diakibatkan kelalaian verifikasi oleh Penggugat.",
          judgeBenchQuestions: [
            "Apakah ada adendum tertulis atas perpanjangan jangka waktu pembayaran?",
            "Bagaimana penghitungan bunga moratoir 6% per tahun dijustifikasi?"
          ],
          mitigationChecklist: [
            "Segera mintakan bukti tanda terima pengiriman somasi ke kantor pos/kurir.",
            "Siapkan saksi ahli hukum perjanjian untuk memperkuat penafsiran Pasal 1338 KUHPerdata."
          ]
        }
      });
    }

    const prompt = isCriminal
      ? `Anda adalah Majelis Hakim Pengadilan Tindak Pidana Korupsi (Tipikor) / Pengadilan Negeri Pidana senior yang memeriksa berkas perkara pidana berikut:

DATA PERKARA PIDANA:
Judul: ${caseData?.title}
Terdakwa/Klien: ${caseData?.client} vs Penuntut Umum/Pelapor: ${caseData?.opposingParty}
Klasifikasi Delik: ${caseData?.caseType}
Pasal Dakwaan/Tuduhan: ${JSON.stringify(caseData?.statutes || [])}
Kronologi & Fakta: ${JSON.stringify(caseData?.facts || [])}
Alat Bukti (Pasal 184 KUHAP): ${JSON.stringify(caseData?.evidenceMatrix || [])}

TUGAS: Jalankan simulasi pemeriksaan sidang perkara pidana mendalam (Uji Stres Pembuktian Minimal 2 Alat Bukti Sah, Celah Dakwaan, dan Potensi Putusan Bebas/Lepas). Berikan output JSON murni:
{
  "successProbability": 70,
  "judicialPosture": "Kecenderungan pandangan Majelis Hakim Pidana terhadap dakwaan JPU vs pembelaan advokat",
  "criticalVulnerabilities": [
    "Daftar titik lemah atau celah pembuktian yang berisiko memperberat terdakwa atau celah dakwaan JPU"
  ],
  "opposingCounterAttack": "Manuver tuntutan dan replik paling agresif dari Jaksa Penuntut Umum (JPU)",
  "judgeBenchQuestions": [
    "Daftar 3 pertanyaan tajam dan menekan yang akan diajukan Ketua/Anggota Majelis Hakim di muka persidangan"
  ],
  "mitigationChecklist": [
    "Langkah taktis pembelaan (Eksepsi, Cross-examination saksi memberatkan, saksi a de charge, ahli, atau materi pledoi)"
  ]
}
HANYA kembalikan JSON valid.`
      : `Anda adalah Majelis Hakim Pengadilan Niaga / Pengadilan Negeri senior yang sedang membedah perkara berikut untuk menguji kekuatan pembuktian dan kemungkinan putusan:

DATA PERKARA:
Judul: ${caseData?.title}
Klien vs Lawan: ${caseData?.client} vs ${caseData?.opposingParty}
Jenis: ${caseData?.caseType}
Ringkasan: ${caseData?.summary}
Fakta: ${JSON.stringify(caseData?.facts || [])}
Bukti: ${JSON.stringify(caseData?.evidenceMatrix || [])}
Statuta: ${JSON.stringify(caseData?.statutes || [])}

TUGAS: Jalankan simulasi pemeriksaan peradilan mendalam dan uji stres simetris. Berikan output JSON murni:
{
  "successProbability": 78,
  "judicialPosture": "Kecenderungan pandangan Majelis Hakim terhadap kedudukan perkara",
  "criticalVulnerabilities": [
    "Daftar titik lemah atau celah pembuktian yang berisiko digugurkan hakim"
  ],
  "opposingCounterAttack": "Strategi tangkisan paling berbahaya yang akan diajukan oleh kuasa hukum lawan",
  "judgeBenchQuestions": [
    "Daftar 3 pertanyaan krusial yang pasti akan dicecar oleh Majelis Hakim di persidangan"
  ],
  "mitigationChecklist": [
    "Daftar tindakan korektif dan mitigasi taktis sebelum sidang pembuktian"
  ]
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json({
      success: true,
      simulation: parsed,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Legacy Interactive Case Assistant (backward compatible)
app.post("/api/gemini/assist", async (req, res) => {
  try {
    const { question, prompt: altPrompt, context, caseContext } = req.body;
    const ai = getGeminiClient();
    const query = question || altPrompt || "Analisis perkara ini";
    const ctx = context || caseContext;

    if (!ai) {
      return res.json({
        success: true,
        answer: `[Mode Standar TriyLex] Pertanyaan: "${query}". Silakan periksa tab Traceability dan Evidence Matrix untuk rincian rujukan dokumen.`,
        reply: `[Mode Standar TriyLex] Pertanyaan: "${query}". Rantai pembuktian memerlukan kepastian alat bukti tertulis (Pasal 1866 KUHPerdata) yang sinkron dengan kronologi fakta.`
      });
    }

    const prompt = `Anda adalah asisten kecerdasan hukum TriyLex untuk perkara: "${ctx?.title || "Perkara Terbuka"}".
Konteks Perkara:
- Klien vs Lawan: ${ctx?.client || "-"} vs ${ctx?.opposingParty || "-"}
- Jenis: ${ctx?.caseType || "Perdata"}
- Ringkasan: ${ctx?.summary || "-"}

Pertanyaan Analis/Advokat: "${query}"

Berikan tanggapan hukum profesional, terstruktur, berbasis hukum Indonesia (sebutkan pasal/asas relevan).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      answer: response.text,
      reply: response.text,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// API: LCA-005 Contract Reconstruction Engine
app.post("/api/gemini/reconstruct-contract", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        reconstruction: {
          contractTitle: `Perjanjian Pokok Kerjasama (${caseData?.client || "Klien"} vs ${caseData?.opposingParty || "Tergugat"})`,
          contractType: "Written Agreement",
          executionDate: caseData?.contractDate || "2025-01-15",
          effectiveDate: caseData?.contractDate || "2025-01-15",
          governingLaw: "Hukum Republik Indonesia (KUHPerdata)",
          disputeForum: caseData?.courtForum || "Pengadilan Negeri",
          amendments: [
            {
              id: "amd-1",
              date: "2025-02-20",
              title: "Addendum I: Penyesuaian Termin Pembayaran",
              description: "Perubahan jadwal pembayaran termin kedua dan penegasan denda 1‰ per hari."
            }
          ],
          clauses: [
            {
              id: "cl-1",
              clauseNumber: "Pasal 3 ayat (2)",
              title: "Kewajiban Pembayaran Termin II",
              verbatimText: "Tergugat wajib melunasi pembayaran termin kedua selambat-lambatnya 14 hari kalender setelah invoice dan BAST diterbitkan.",
              obligorParty: caseData?.opposingParty || "Tergugat",
              beneficiaryParty: caseData?.client || "Klien",
              performanceStandard: "Transfer rekening bank resmi",
              breachIndicator: "Tergugat menunggak lebih dari 60 hari",
              status: "Alleged Default",
              riskScore: "Critical"
            },
            {
              id: "cl-2",
              clauseNumber: "Pasal 7 ayat (1)",
              title: "Klausul Denda Keterlambatan",
              verbatimText: "Keterlambatan pemenuhan prestasi dikenakan denda sebesar 1‰ per hari hingga maksimal 5%.",
              obligorParty: caseData?.opposingParty || "Tergugat",
              beneficiaryParty: caseData?.client || "Klien",
              performanceStandard: "Pembayaran terakumulasi pada invoice",
              breachIndicator: "Denda belum dibayar",
              status: "Alleged Default",
              riskScore: "High"
            }
          ],
          defaultAnalysis: `Tergugat (${caseData?.opposingParty}) terbukti telah cidera janji (wanprestasi) atas Pasal 3 ayat (2) jo. Pasal 1243 KUHPerdata, di mana prestasi pokok dan denda belum dipenuhi.`
        }
      });
    }

    const prompt = `Anda adalah Ahli Analisis Kontrak Hukum Bisnis (SOP LCA-005 Contract Reconstruction).
Bedah perkara berikut dan buat rekonstruksi perjanjian, klausul pokok, hak & kewajiban para pihak, serta indikator wanprestasi/cidera janji:

DATA PERKARA:
Judul: ${caseData?.title}
Klien: ${caseData?.client} vs Tergugat: ${caseData?.opposingParty}
Ringkasan: ${caseData?.summary}
Fakta: ${JSON.stringify(caseData?.facts || [])}
Bukti Terdaftar: ${JSON.stringify(caseData?.evidenceMatrix || [])}

Format JSON yang HARUS dikembalikan:
{
  "contractTitle": "Judul Perjanjian",
  "contractType": "Written Agreement" | "Oral Agreement" | "Purchase Order / PO" | "Work Order / WO" | "Quotation & Invoice",
  "executionDate": "YYYY-MM-DD",
  "effectiveDate": "YYYY-MM-DD",
  "governingLaw": "Hukum Republik Indonesia (KUHPerdata)",
  "disputeForum": "Pengadilan Negeri / BANI",
  "amendments": [
    {
      "id": "amd-1",
      "date": "YYYY-MM-DD",
      "title": "Judul Addendum / Perubahan",
      "description": "Uraian perubahan kesepakatan"
    }
  ],
  "clauses": [
    {
      "id": "cl-1",
      "clauseNumber": "Pasal X ayat Y",
      "title": "Judul Klausul",
      "verbatimText": "Kutipan bunyi klausul perjanjian",
      "obligorParty": "Pihak yang berkewajiban",
      "beneficiaryParty": "Pihak yang berhak menerima",
      "performanceStandard": "Standar dan syarat pemenuhan prestasi",
      "breachIndicator": "Uraian fakta cidera janji / wanprestasi",
      "status": "Alleged Default" | "Fulfilled" | "Disputed" | "Pending",
      "riskScore": "Critical" | "High" | "Medium" | "Low"
    }
  ],
  "defaultAnalysis": "Paragraf kesimpulan yuridis analisis wanprestasi berdasarkan Pasal 1243 KUHPerdata"
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = response.text || "{}";
    let parsed;
    try { parsed = JSON.parse(text); }
    catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json({ success: true, reconstruction: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: LCA-009 Argument Mapping Engine
app.post("/api/gemini/map-arguments", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        arguments: [
          {
            issueId: "iss-1",
            issueTitle: "Keabsahan Somasi & Terpenuhinya Syarat Wanprestasi (Pasal 1243 KUHPerdata)",
            claimantArgument: `Klien (${caseData?.client}) telah mengirimkan 2 kali somasi tertulis secara patut. Tergugat tetap lalai melunasi kewajiban pembayaran.`,
            defendantArgument: "Tergugat berdalih ada kesepakatan lisan perpanjangan waktu dan keadaan memaksa.",
            stressTestAnalysis: "Bantahan force majeure Tergugat lemah karena klausul kontrak mensyaratkan pemberitahuan resmi 3x24 jam.",
            weaknessAnalysis: "Pastikan tanda terima fisik somasi tercatat resmi oleh kurir/pos.",
            counterstrategy: "Siapkan bukti resi ekspedisi resmi dan tegaskan asas Pacta Sunt Servanda (Pasal 1338 ayat 1 KUHPerdata)."
          }
        ]
      });
    }

    const prompt = `Anda adalah Litigator Senior (SOP LCA-009 Argument Mapping).
Petakan argumentasi simetris dari para pihak yang bersengketa (Claims vs Counter-Claims), uji kelemahan, dan siapkan tangkisan replik:

DATA PERKARA:
Judul: ${caseData?.title}
Klien: ${caseData?.client} vs Tergugat: ${caseData?.opposingParty}
Ringkasan: ${caseData?.summary}
Fakta: ${JSON.stringify(caseData?.facts || [])}
Statuta: ${JSON.stringify(caseData?.statutes || [])}

Format JSON yang HARUS dikembalikan (Array):
{
  "arguments": [
    {
      "issueId": "iss-1",
      "issueTitle": "Isu Hukum Pokok",
      "claimantArgument": "Dalil Posita Penggugat/Klien",
      "defendantArgument": "Eksepsi dan Tangkisan Tergugat",
      "stressTestAnalysis": "Uji Kekuatan & Kelemahan Yuridis",
      "weaknessAnalysis": "Celah yang harus diantisipasi",
      "counterstrategy": "Strategi pembuktian dan dalil replik"
    }
  ]
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = response.text || "{}";
    let parsed;
    try { parsed = JSON.parse(text); }
    catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json({ success: true, arguments: parsed?.arguments || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Document History Milestone & Procedural Oversight Aggregator Engine
app.post("/api/gemini/extract-timeline-milestones", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback synthetic milestones from existing case documents & timeline
      const fallbackMilestones = (caseData?.timeline && caseData.timeline.length > 0)
        ? caseData.timeline.map((evt: any, i: number) => ({
            ...evt,
            documentName: evt.documentName || caseData?.documents?.[i % (caseData?.documents?.length || 1)]?.name || "Dokumen Berkas Utama",
            sourceSnippet: evt.sourceSnippet || "Tercatat dalam berkas dokumen hukum resmi yang telah diverifikasi.",
            proceduralPhase: evt.proceduralPhase || (evt.category === 'Contract' ? 'Fase Kontraktual & Perikatan' : evt.category === 'Breach' ? 'Fase Wanprestasi / Dugaan Pelanggaran' : 'Fase Penegakan Hukum & Litigasi'),
            actor: evt.actor || (i % 2 === 0 ? caseData?.client : caseData?.opposingParty),
            proceduralStatus: evt.proceduralStatus || (evt.category === 'Breach' ? 'Breached / In Mora' : 'Compliant / On-Time'),
            status: evt.status || 'Confirmed',
          }))
        : [
            {
              id: 'ms-fallback-1',
              date: caseData?.contractDate || '2024-02-15',
              title: 'Penandatanganan Perjanjian Pokok',
              description: `Para pihak (${caseData?.client || 'Klien'} dan ${caseData?.opposingParty || 'Lawan'}) meratifikasi kesepakatan perikatan.`,
              category: 'Contract',
              importance: 'Key',
              documentRef: caseData?.documents?.[0]?.id || 'doc-1',
              documentName: caseData?.documents?.[0]?.name || 'Perjanjian_Pokok.pdf',
              sourceSnippet: 'Klausul mengikat para pihak sejak tanggal penandatanganan.',
              proceduralPhase: 'Fase Kontraktual',
              actor: caseData?.client || 'Klien',
              proceduralStatus: 'Compliant / On-Time',
              status: 'Confirmed'
            }
          ];

      return res.json({
        success: true,
        source: "fallback",
        milestones: fallbackMilestones,
        reportMarkdown: `### KRONOLOGI PERISTIWA HUKUM & MILESTONES DOKUMEN (SOP LCA-004 / PCA-005)\n\nBerdasarkan kompilasi ${caseData?.documents?.length || 0} berkas dokumen perkara ${caseData?.refNumber || ''}:\n\n` +
          fallbackMilestones.map((m: any, idx: number) => `${idx + 1}. **${m.date}** — **${m.title}** (${m.documentName || 'Dokumen'})\n   - *Uraian:* ${m.description}\n   - *Status Prosedural:* ${m.proceduralStatus || 'Compliant'}`).join('\n\n')
      });
    }

    const docsSummary = (caseData?.documents || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      uploadDate: d.uploadDate,
      extractedSnippet: d.extractedText ? d.extractedText.slice(0, 350) : ''
    }));

    const prompt = `Anda adalah Master Litigator & Panitera Khusus Pengadilan Tinggi (Chief Procedural Chronologist & Timeline Overseer).
Tugas Anda adalah membedah dan mengagregasi SELURUH peristiwa kritis (critical events) dan tonggak prosedural (milestones) dari riwayat dokumen hukum berikut:

DATA PERKARA:
Judul: ${caseData?.title}
Nomor Ref: ${caseData?.refNumber}
Klien vs Lawan: ${caseData?.client} vs ${caseData?.opposingParty}
Metodologi: ${caseData?.methodology === 'PCA' ? 'SOP Pidana & UU Khusus (PCA)' : 'SOP Perdata & Bisnis (LCA)'}
Klasifikasi: ${caseData?.caseType}
Tanggal Peristiwa Penting: Kontrak=${caseData?.contractDate || '-'}, Dugaan Pelanggaran=${caseData?.allegedBreachDate || '-'}, Somasi/SPDP=${caseData?.noticeDate || '-'}, Gugatan/Sidang=${caseData?.lawsuitDate || '-'}

RIWAYAT BERKAS DOKUMEN:
${JSON.stringify(docsSummary, null, 2)}

FAKTA DAN TIMELINE YANG SUDAH TERCATAT:
Fakta: ${JSON.stringify(caseData?.facts || [], null, 2)}
Timeline Eksisting: ${JSON.stringify(caseData?.timeline || [], null, 2)}

INSTRUKSI KHUSUS PROSEDURAL OVERSIGHT:
1. Ekstrak setiap tanggal penting peristiwa dari riwayat dokumen (tanggal akta, tanggal BAST, batas waktu notice somasi, tanggal pelanggaran, tanggal laporan, tanggal penetapan status, batas waktu verifikasi).
2. Tautkan setiap milestone ke nama dokumen (documentName) dan kutipan ringkas pembuktian (sourceSnippet).
3. Evaluasi "proceduralStatus":
   - "Compliant / On-Time" jika dipenuhi tepat waktu
   - "Breached / In Mora" jika terjadi cidera janji / kelalaian
   - "Pending Court Action" jika menunggu panggilan/jadwal sidang
   - "Pre-trial Window" jika dalam tenggat uji praperadilan / eksepsi
   - "Statute of Limitations (Daluwarsa)" jika mendekati/melewati batas kedaluwarsa hukum
4. Susun bab laporan markdown "reportMarkdown" yang siap dimasukkan ke dalam Final Case Intelligence Report.

FORMAT JSON MURNI YANG HARUS DIKEMBALIKAN:
{
  "milestones": [
    {
      "id": "ms-1",
      "date": "YYYY-MM-DD",
      "title": "Judul Singkat Peristiwa Kritis",
      "description": "Uraian fakta substansial peristiwa hukum",
      "category": "Contract" | "Breach" | "Notice" | "Litigation" | "Regulatory" | "Investigation" | "Evidence" | "Court",
      "importance": "Key" | "Supporting" | "Contextual",
      "documentRef": "doc-id-rujukan",
      "documentName": "NamaFileDokumen.pdf",
      "sourceSnippet": "Kutipan verbatim ringkas dari dokumen pembuktian",
      "proceduralPhase": "Pra-Litigasi & Somasi" | "Penyidikan & Uji Formil" | "Pendaftaran Perkara" | "Tahap Pembuktian" | "Putusan",
      "actor": "Pihak Pelaksana / Penandatangan",
      "statutoryDeadline": "Ketentuan batas waktu atau daluwarsa jika ada",
      "proceduralStatus": "Compliant / On-Time" | "Breached / In Mora" | "Pending Court Action" | "Pre-trial Window" | "Statute of Limitations (Daluwarsa)",
      "status": "Confirmed" | "Estimated" | "Disputed"
    }
  ],
  "proceduralDigest": {
    "totalMilestones": 5,
    "criticalDeadlinesMet": true,
    "statuteOfLimitationsAlert": "Uraian telaah risiko daluwarsa",
    "proceduralRiskSummary": "Catatan singkat kesiapan prosedural perkara"
  },
  "reportMarkdown": "Bab Laporan Markdown Formal (minimal 3 paragraf komprehensif memuat tabel ringkasan timeline)"
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = response.text || "{}";
    let parsed;
    try { parsed = JSON.parse(text); }
    catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json({
      success: true,
      milestones: parsed?.milestones || [],
      proceduralDigest: parsed?.proceduralDigest || null,
      reportMarkdown: parsed?.reportMarkdown || ""
    });
  } catch (error: any) {
    console.error("Timeline extraction error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: LCA-011 Quantum of Damages Calculator
app.post("/api/gemini/calculate-quantum", async (req, res) => {
  try {
    const { caseData, currentCalc } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        quantum: currentCalc
      });
    }

    const prompt = `Anda adalah Financial Legal Analyst (SOP LCA-011 Quantum Reconstruction).
Lakukan pengujian matematis dan yuridis terhadap seluruh komponen tuntutan ganti rugi:
- Pokok (Materil)
- Denda Kontraktual
- Bunga Moratoir Legal 6%/tahun (Pasal 1250 KUHPerdata)
- Kerugian Imateril

DATA PERKARA:
Klien: ${caseData?.client} vs Tergugat: ${caseData?.opposingParty}
Tuntutan Saat Ini: ${caseData?.claimAmount || "Rp 1.000.000.000"}
Fakta Finansial: ${JSON.stringify(caseData?.facts || [])}

Format JSON yang HARUS dikembalikan:
{
  "principalClaim": 850000000,
  "contractualPenalty": 85000000,
  "statutoryInterestRate": 6,
  "interestPeriodMonths": 8,
  "immaterialDamages": 200000000,
  "otherCosts": 25000000,
  "currency": "IDR",
  "calculationNotes": "Uraian metode matematis yuridis tuntutan ganti rugi",
  "items": [
    {
      "id": "q-1",
      "category": "Kerugian Pokok (Materil)" | "Bunga Moratoir (6% p.a.)" | "Denda Keterlambatan Kontraktual" | "Biaya Operasional & Pemulihan" | "Kerugian Imateril / Reputasi",
      "description": "Uraian fakta dasar komponen kerugian",
      "claimedAmount": 850000000,
      "provenAmount": 850000000,
      "legalBasis": "Pasal rujukan UU/Kontrak",
      "evidenceRef": "Rujukan dokumen bukti pendukung",
      "status": "Fully Documented" | "Partially Documented" | "Undocumented / Gap"
    }
  ]
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = response.text || "{}";
    let parsed;
    try { parsed = JSON.parse(text); }
    catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json({ success: true, quantum: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: LCA-014 Case Strategy & Tactical Roadmap
app.post("/api/gemini/formulate-strategy", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        source: "fallback",
        strategy: {
          primaryPath: "Gugatan Perdata Wanprestasi / PMH (PN)",
          alternativePath: "Permohonan PKPU di Pengadilan Niaga",
          settlementTarget: caseData?.claimAmount || "Rp 950.000.000",
          conservatorySeizureTarget: "Sita Jaminan atas Rekening Bank dan Gedung Kantor Tergugat",
          executiveStrategicNotes: "Fokus pada permohonan sita jaminan (Conservatoir Beslag) guna mencegah pengalihan aset dan memicu negosiasi damai pada tahap mediasi.",
          tacticalRoadmap: [
            {
              phase: "Fase 1: Somasi & Due Diligence",
              timeline: "Minggu 1-2",
              actionItem: "Kirim somasi final dan legalkan dokumen",
              responsibleRole: "Lead Counsel",
              riskMitigation: "Pastikan tanda terima resmi"
            }
          ]
        }
      });
    }

    const prompt = `Anda adalah Managing Partner & Chief Litigation Strategist (SOP LCA-014 Case Strategy).
Susun rencana strategi hukum komprehensif, penetapan jalur (Somasi/Gugatan PN/PKPU Niaga/Arbitrase), permohonan sita jaminan (Conservatoir Beslag), dan roadmap tahapan eksekusi:

DATA PERKARA:
Judul: ${caseData?.title}
Klien vs Tergugat: ${caseData?.client} vs ${caseData?.opposingParty}
Tuntutan: ${caseData?.claimAmount}
Fakta & Bukti: ${JSON.stringify(caseData?.facts || [])}

Format JSON yang HARUS dikembalikan:
{
  "primaryPath": "Somasi & Negosiasi Damai" | "Gugatan Perdata Wanprestasi / PMH (PN)" | "Permohonan PKPU / Pailit (Pengadilan Niaga)" | "Arbitrase (BANI / SIAC)" | "Laporan Pidana Terkait (Polri)",
  "alternativePath": "Jalur alternatif jika jalur primer terhambat",
  "settlementTarget": "Target nilai kompromi pemulihan hak klien",
  "conservatorySeizureTarget": "Target objek sita jaminan (Conservatoir Beslag)",
  "executiveStrategicNotes": "Catatan keputusan strategis komprehensif dari Managing Partner",
  "tacticalRoadmap": [
    {
      "phase": "Fase 1: Judul Fase",
      "timeline": "Minggu X - Y",
      "actionItem": "Tindakan operasional hukum konkret",
      "responsibleRole": "Peran PIC pelaksana",
      "riskMitigation": "Langkah mitigasi risiko"
    }
  ]
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = response.text || "{}";
    let parsed;
    try { parsed = JSON.parse(text); }
    catch {
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    res.json({ success: true, strategy: parsed });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: LCA-015 / PCA-015 Final Case Intelligence Report Generator
app.post("/api/gemini/generate-final-report", async (req, res) => {
  try {
    const { caseData } = req.body;
    const ai = getGeminiClient();
    const isCriminal = caseData?.methodology === 'PCA';

    // Build Chronological Timeline Markdown Table
    const timelineList = (caseData?.timeline && caseData.timeline.length > 0)
      ? caseData.timeline
      : (caseData?.documents || []).map((d: any, i: number) => ({
          id: `tm-${i}`,
          date: d.uploadDate ? d.uploadDate.split('T')[0] : '2024-03-01',
          title: `Penerbitan / Penerimaan Dokumen ${d.name}`,
          description: `Bukti ${d.category || 'Surat'} terdaftar dalam berkas perkara.`,
          documentName: d.name,
          actor: caseData?.client,
          category: 'Evidence',
          proceduralStatus: 'Compliant / On-Time'
        }));

    const timelineMarkdownTable = `| No | Tanggal | Tonggak Peristiwa & Dokumen Terkait | Aktor / Pihak | Kategori & Status Prosedural |\n` +
      `|---|---|---|---|---|\n` +
      timelineList.map((evt: any, idx: number) => 
        `| ${idx + 1} | ${evt.date} | **${evt.title}**<br/>${evt.documentName ? `*Rujukan: ${evt.documentName}*` : ''}<br/>${evt.description} | ${evt.actor || '-'} | ${evt.category} - *${evt.proceduralStatus || 'Confirmed'}* |`
      ).join('\n') + `\n\n*Catatan Pengawasan Prosedural:* Seluruh peristiwa terhubung langsung dengan dokumen pembuktian dan bebas dari risiko daluwarsa penuntutan/gugatan.`;

    if (!ai) {
      if (isCriminal) {
        return res.json({
          success: true,
          source: "fallback",
          report: `# FINAL CASE INTELLIGENCE REPORT (PCA-015)
Nomor Registrasi: ${caseData?.refNumber || "TRX/2026/CRM-042"}
Tanggal: ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
Perkara: ${caseData?.title}
Para Pihak: ${caseData?.client} (Terdakwa) vs ${caseData?.opposingParty} (Penuntut Umum)
Forum Peradilan: ${caseData?.courtForum || "Pengadilan Tindak Pidana Korupsi"}

1. RINGKASAN EKSEKUTIF
Laporan intelejen perkara pidana dan undang-undang khusus ini menganalisis konstruksi hukum dakwaan penuntut umum, keabsahan proses penyelidikan/penyidikan, serta kelemahan pembuktian formil dan materiil terkait ${caseData?.title}.

2. IDENTIFIKASI PARA PIHAK & INSTANSI PENEGAK HUKUM
- Terdakwa / Klien: ${caseData?.client}
- Penuntut Umum: ${caseData?.opposingParty}
- Instansi Penyidik: ${caseData?.courtForum}

3. KRONOLOGI PERISTIWA HUKUM & AGREGASI TONGGAK DOKUMEN
Dihimpun secara otentik dari riwayat dokumen pembuktian perkara:

${timelineMarkdownTable}

4. MATRIKS ALAT BUKTI (PASAL 184 KUHAP)
Mencakup keterangan saksi, surat resmi perizinan/kontrak, keterangan ahli, dan petunjuk yang membuktikan tidak adanya mens rea niat jahat.

5. DEKONSTRUKSI UNSUR DELIK (ACTUS REUS & MENS REA)
Unsur "secara melawan hukum" dan "merugikan keuangan negara" tidak terpenuhi karena terdakwa bertindak dalam diskresi administratif dan force majeure.

6. UJI FORMALITAS & PRA-PERADILAN (PASAL 77 & 143 KUHAP)
Ditemukan cacat prosedur dalam penetapan tersangka dan ketidakcermatan surat dakwaan (obscuur libel).

7. UJI ALIBI & INTEGRITAS RANTAI BUKTI (CHAIN OF CUSTODY)
Seluruh jejak dokumen elektronik dan audit forensik menunjukkan tidak adanya aliran dana gelap (money trail).

8. MATRIKS PEMERIKSAAN SILANG SAKSI (CROSS-EXAMINATION)
Daftar pertanyaan krusial untuk melucuti kredibilitas saksi memberatkan (a charge).

9. ANALISIS KOMPARASI SANKSI (KUHP LAMA VS UU 1/2023)
Pemberlakuan prinsip lex favor reo (Pasal 1 ayat 2 KUHP / Pasal 3 UU 1/2023) demi ancaman pidana yang lebih menguntungkan terdakwa.

10. RISK ASSESSMENT & PROBABILITAS PUTUSAN
Peluang putusan bebas murni (vrijspraak) atau lepas dari segala tuntutan hukum (onslag van alle rechtsvervolging) mencapai 72%.

11. SINKRONISASI NOTA KEBERATAN & NOTA PEMBELAAN (PLEDOI)
Fokus pada ketiadaan niat jahat, iktikad baik pejabat pelaksana, dan audit tandingan independen.

12. REKOMENDASI STRATEGI & ROADMAP PERSIDANGAN
Pengajuan eksepsi formal, penolakan saksi mahkota tanpa penetapan terpisah, dan permohonan pengalihan tahanan kota.`
        });
      }

      return res.json({
        success: true,
        source: "fallback",
        report: `# FINAL CASE INTELLIGENCE REPORT (LCA-015)
Nomor Registrasi: ${caseData?.refNumber || "TRX/2026/CIV-001"}
Tanggal: ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
Perkara: ${caseData?.title}
Para Pihak: ${caseData?.client} (Penggugat/Klien) vs ${caseData?.opposingParty} (Tergugat)

1. RINGKASAN EKSEKUTIF
Perkara ini merupakan sengketa wanprestasi atas kelalaian pemenuhan pembayaran kewajiban kontraktual oleh Tergugat dengan total tuntutan ${caseData?.claimAmount || "Rp 0"}.

2. IDENTIFIKASI PARA PIHAK
- Pihak Klien: ${caseData?.client}
- Pihak Lawan: ${caseData?.opposingParty}

3. KRONOLOGI PERISTIWA HUKUM & AGREGASI TONGGAK DOKUMEN
Dihimpun dari seluruh riwayat berkas pembuktian perkara:

${timelineMarkdownTable}

4. MATRIKS FAKTA & ALAT BUKTI
Didukung bukti tertulis perjanjian, BAST, invoice penagihan, serta surat somasi.

5. ISU HUKUM UTAMA (POINTS TO PROVE)
Terpenuhinya unsur kelalaian wanprestasi berdasarkan Pasal 1243 KUHPerdata dan keabsahan Somasi.

6. DASAR HUKUM & YURISPRUDENSI
Pasal 1320, 1338 ayat (1), 1243, 1250 KUHPerdata jo. Yurisprudensi MA No. 272 K/Pdt/1983.

7. ANALISIS PERTANGGUNGJAWABAN HUKUM (LIABILITY)
Tergugat terbukti berada dalam keadaan lalai (in mora) secara melawan hak.

8. REKONSTRUKSI KUANTUM & KERUGIAN
Total Tuntutan: ${caseData?.claimAmount || "Rp 0"} meliputi Pokok, Denda Kontraktual, dan Bunga Moratoir 6%/tahun.

9. RISK ASSESSMENT & WIN-RATE
Probabilitas Keberhasilan: 78% dengan mitigasi pemenuhan asli dokumen somasi.

10. EVIDENCE GAP ACTION PLAN
Melengkapi tanda terima pos basah dan legalisasi kantor pos atas seluruh bukti fotokopi.

11. REKOMENDASI STRATEGI & ROADMAP EKSEKUSI
Pendaftaran gugatan perdata disertai permohonan Sita Jaminan (Conservatoir Beslag).

12. CATATAN PENUTUP
Disusun oleh TriyLex Legal Intelligence Team.`
      });
    }

    const prompt = isCriminal
      ? `Anda adalah Lead Criminal Defense Counsel senior yang menyusun "Final Case Intelligence Report (PCA-015)" untuk perkara pidana/tindak pidana khusus:
DATA LENGKAP PERKARA:
Judul: ${caseData?.title}
No. Ref: ${caseData?.refNumber}
Terdakwa: ${caseData?.client} vs Penuntut: ${caseData?.opposingParty}
Klasifikasi: ${caseData?.caseType}
Forum: ${caseData?.courtForum}
Tuntutan: ${caseData?.claimAmount}
Riwayat Linimasa & Dokumen:
${timelineMarkdownTable}
Bukti & Dokumen: ${JSON.stringify(caseData?.documents || [])}

TUGAS:
Susun dokumen resmi "FINAL CASE INTELLIGENCE REPORT (PCA-015)" dengan format 12 Bab terstruktur, presisi, mendalam, dan memuat tabel kronologi dokumen peristiwa hukum di Bab 3.
Gunakan Bahasa Indonesia hukum yang baku dan format Markdown formal.`
      : `Anda adalah Lead Legal Counsel senior yang menyusun "Final Case Intelligence Report" (SOP LCA-015) berdasarkan kompilasi 14 tahapan analisis SOP (LCA-001 s.d. LCA-014).

DATA LENGKAP PERKARA:
Judul: ${caseData?.title}
No. Ref: ${caseData?.refNumber}
Klien: ${caseData?.client} vs Tergugat: ${caseData?.opposingParty}
Klasifikasi: ${caseData?.caseType}
Forum: ${caseData?.courtForum}
Nilai Tuntutan: ${caseData?.claimAmount}
Riwayat Linimasa & Dokumen:
${timelineMarkdownTable}
Kronologi & Fakta: ${JSON.stringify(caseData?.facts || [])}
Bukti & Celah: ${JSON.stringify(caseData?.evidenceMatrix || [])} | Celah: ${JSON.stringify(caseData?.evidenceGaps || [])}
Statuta: ${JSON.stringify(caseData?.statutes || [])}
Rekonstruksi Kontrak: ${JSON.stringify(caseData?.contractReconstruction || {})}
Kalkulasi Kuantum: ${JSON.stringify(caseData?.quantumCalculation || {})}
Strategi: ${JSON.stringify(caseData?.strategyPlan || {})}

TUGAS:
Susun dokumen resmi "FINAL CASE INTELLIGENCE REPORT (LCA-015)" dengan format 12 Bab terstruktur, objektif, elegan, dan siap digunakan oleh Advokat / Legal Counsel:
1. RINGKASAN EKSEKUTIF
2. IDENTIFIKASI PARA PIHAK & HUBUNGAN HUKUM
3. KRONOLOGI PERISTIWA HUKUM & AGREGASI TONGGAK DOKUMEN (Sajikan dalam tabel Markdown komprehensif)
4. MATRIKS FAKTA & ALAT BUKTI (HIGHLIGHT FAKTA DISENGKETAKAN)
5. REKONSTRUKSI KONTRAK & KLAUSUL WANPRESTASI
6. ISU HUKUM UTAMA & LANDASAN STATUTA (KUHPERDATA/YURISPRUDENSI)
7. PEMETAAN ARGUMEN (POSITA VS EKSEPSI TERGUGAT)
8. ANALISIS PERTANGGUNGJAWABAN HUKUM (LIABILITY ASSESSMENT)
9. REKONSTRUKSI KUANTUM KERUGIAN (POKOK, DENDA, BUNGA 6% PASAL 1250)
10. PENILAIAN RISIKO & PROBABILITAS KEMENANGAN (WIN-RATE %)
11. IDENTIFIKASI KESENJANGAN BUKTI & ACTION PLAN PEMENUHAN
12. REKOMENDASI STRATEGI & ROADMAP LITIGASI (TERMASUK SITA JAMINAN)

Gunakan Bahasa Indonesia hukum yang baku, presisi, dan komprehensif dalam format Markdown formal.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
    });

    res.json({
      success: true,
      report: response.text,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: JDIHN & Supreme Court (MA RI) Precedents Search
app.post("/api/gemini/search-jdih", async (req, res) => {
  try {
    const { query, category, statusFilter, caseContext } = req.body;
    const ai = getGeminiClient();

    // Default Curated Database for Fallback / Offline
    const defaultDatabase = [
      {
        id: "JDIH-UU-001",
        type: "Undang-Undang",
        title: "Undang-Undang Nomor 1 Tahun 2024 tentang Perubahan Kedua atas Undang-Undang Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik (UU ITE)",
        number: "UU No. 1 Tahun 2024",
        year: "2024",
        source: "JDIHN BPHN",
        status: "Berlaku Penuh",
        summary: "Mengatur legalitas bukti elektronik, keabsahan tanda tangan digital, kontrak elektronik, dan tanggung jawab penyelenggara sistem elektronik di Indonesia.",
        relevanceScore: 98,
        citationFormat: "Pasal 5 ayat (1) jo. Pasal 11 UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE",
        tags: ["Bukti Elektronik", "Tanda Tangan Digital", "Kontrak Elektronik", "ITE"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Pasal 5 ayat (1)",
            content: "Informasi Elektronik dan/atau Dokumen Elektronik dan/atau hasil cetaknya merupakan alat bukti hukum yang sah.",
            relevanceNotes: "Dasar pembuktian formal mutasi rekening digital, email korespondensi bisnis, dan bukti chat.",
          },
          {
            articleOrPoint: "Pasal 11 ayat (1)",
            content: "Tanda Tangan Elektronik memiliki kekuatan hukum dan akibat hukum yang sah selama memenuhi persyaratan yang ditentukan.",
            relevanceNotes: "Mengonfirmasi keabsahan addendum dan kontrak yang ditandatangani via platform tersertifikasi.",
          }
        ]
      },
      {
        id: "JDIH-BW-002",
        type: "KUHPerdata / KUHP / HIR",
        title: "Kitab Undang-Undang Hukum Perdata (Burgerlijk Wetboek) - Buku III: Hukum Perikatan",
        number: "KUHPerdata",
        year: "1847",
        source: "Kodifikasi Hukum Positif",
        status: "Berlaku Penuh",
        summary: "Prinsip dasar perjanjian, syarat sahnya kontrak (Pasal 1320), asas pacta sunt servanda (Pasal 1338), serta tuntutan ganti rugi wanprestasi (Pasal 1243).",
        relevanceScore: 99,
        citationFormat: "Pasal 1243, 1244, 1250 jo. Pasal 1338 KUHPerdata",
        tags: ["Perikatan", "Wanprestasi", "Ganti Rugi", "Pacta Sunt Servanda", "Bunga Moratoir"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Pasal 1243 KUHPerdata",
            content: "Penggantian biaya, kerugian dan bunga karena tak dipenuhinya suatu perikatan mulai diwajibkan, bila debitur, walaupun telah dinyatakan lalai, tetap lalai untuk memenuhi perikatan itu...",
            relevanceNotes: "Pijakan hukum utama menuntut ganti kerugian materiil dan penegasan status cidera janji.",
          },
          {
            articleOrPoint: "Pasal 1250 KUHPerdata",
            content: "Dalam perikatan yang semata-mata mengenai pembayaran sejumlah uang, penggantian biaya, kerugian dan bunga yang timbul karena keterlambatan pelaksanaannya, hanya terdiri atas bunga yang ditentukan oleh undang-undang...",
            relevanceNotes: "Dasar hukum menuntut bunga legal moratoir 6% per tahun terhitung sejak debitur disomasi/digugat.",
          },
          {
            articleOrPoint: "Pasal 1338 ayat (1) & (3)",
            content: "Semua persetujuan yang dibuat sesuai dengan undang-undang berlaku sebagai undang-undang bagi mereka yang membuatnya. Persetujuan harus dilaksanakan dengan itikad baik.",
            relevanceNotes: "Asas kebebasan berkontrak dan kewajiban itikad baik (good faith).",
          }
        ]
      },
      {
        id: "JDIH-MA-003",
        type: "Yurisprudensi MA",
        title: "Putusan Mahkamah Agung RI No. 409 K/Sip/1972 (Kaidah Batasan Force Majeure / Keadaan Memaksa)",
        number: "Putusan MA No. 409 K/Sip/1972",
        year: "1972",
        source: "Direktori Putusan MA",
        status: "Yurisprudensi Tetap",
        summary: "Kaidah hukum tetap bahwa kesulitan finansial atau krisis keuangan yang dialami debitur tidak dapat dikualifikasikan sebagai Keadaan Memaksa (Overmacht/Force Majeure) untuk membebaskannya dari kewajiban kontrak.",
        ratioDecidendi: "Kesulitan keuangan pribadi atau perusahaan debitur tidak termasuk dalam kategori overmacht sebagaimana dimaksud dalam Pasal 1244 dan 1245 KUHPerdata, melainkan merupakan risiko usaha yang wajib ditanggung sendiri oleh debitur.",
        relevanceScore: 95,
        citationFormat: "Yurisprudensi Mahkamah Agung RI No. 409 K/Sip/1972 tanggal 13 Desember 1972",
        tags: ["Force Majeure", "Overmacht", "Wanprestasi", "Eksepsi"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Ratio Decidendi MA",
            content: "Debitur yang mendalilkan krisis likuiditas tidak dapat melepaskan diri dari kewajiban pembayaran ganti rugi kepada Kreditur.",
            relevanceNotes: "Alat tangkisan utama (Replik) mematahkan dalil eksepsi force majeure Tergugat.",
          }
        ]
      },
      {
        id: "JDIH-MA-004",
        type: "Yurisprudensi MA",
        title: "Putusan Mahkamah Agung RI No. 272 K/Pdt/1983 (Kaidah Penghitungan Bunga Moratoir Legal 6%)",
        number: "Putusan MA No. 272 K/Pdt/1983",
        year: "1983",
        source: "Direktori Putusan MA",
        status: "Yurisprudensi Tetap",
        summary: "Bunga moratoir sebesar 6% setahun (berdasarkan Staatsblad 1848 No. 22 jo. Pasal 1250 KUHPerdata) mulai dihitung sejak tanggal somasi pertama yang sah atau sejak gugatan didaftarkan di Kepaniteraan Pengadilan.",
        ratioDecidendi: "Penuntutan bunga moratoir atas kelalaian pembayaran utang uang harus dikabulkan sebesar 6% per tahun terhitung sejak hari kelalaian dinyatakan secara resmi.",
        relevanceScore: 94,
        citationFormat: "Yurisprudensi Mahkamah Agung RI No. 272 K/Pdt/1983",
        tags: ["Bunga Moratoir", "Staatsblad 1848", "Petitum", "Ganti Rugi"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Ratio Decidendi MA",
            content: "Kreditur berhak atas bunga moratoir 6% per tahun meskipun tidak diperjanjikan secara tegas dalam klausul kontrak pokok.",
            relevanceNotes: "Penguat petitum gugatan ganti kerugian bunga keterlambatan.",
          }
        ]
      },
      {
        id: "JDIH-MA-005",
        type: "SEMA / PERMA",
        title: "Surat Edaran Mahkamah Agung (SEMA) No. 6 Tahun 1994 tentang Surat Kuasa Khusus",
        number: "SEMA No. 6 Tahun 1994",
        year: "1994",
        source: "Direktori Putusan MA",
        status: "Berlaku Penuh",
        summary: "Menetapkan syarat formil mutlak Surat Kuasa Khusus untuk beracara di Pengadilan agar tidak dinyatakan cacat formil oleh Majelis Hakim.",
        relevanceScore: 92,
        citationFormat: "SEMA No. 6 Tahun 1994 jo. Pasal 123 HIR",
        tags: ["Surat Kuasa Khusus", "Syarat Formil", "Eksepsi Kuasa", "SEMA"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Klausul Wajib",
            content: "Surat Kuasa Khusus harus secara eksplisit menyebutkan identitas para pihak, objek sengketa, nomor perkara/pengadilan yang dituju, dan hak substitusi.",
            relevanceNotes: "Mencegah eksepsi Surat Kuasa Cacat Formil dari pihak Tergugat.",
          }
        ]
      },
      {
        id: "JDIH-UU-006",
        type: "Undang-Undang",
        title: "Undang-Undang Nomor 40 Tahun 2007 tentang Perseroan Terbatas (jo. UU Cipta Kerja)",
        number: "UU No. 40 Tahun 2007",
        year: "2007",
        source: "JDIHN BPHN",
        status: "Diubah Sebagian",
        summary: "Mengatur legal standing direksi mewakili perseroan di dalam dan di luar pengadilan (Pasal 98), doktrin piercing the corporate veil (Pasal 3 ayat 2), serta tanggung jawab pribadi organ perseroan.",
        relevanceScore: 90,
        citationFormat: "Pasal 98 jo. Pasal 3 ayat (2) UU No. 40 Tahun 2007",
        tags: ["Perseroan Terbatas", "Direksi", "Legal Standing", "Piercing Corporate Veil"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Pasal 98 ayat (1)",
            content: "Direksi mewakili Perseroan baik di dalam maupun di luar pengadilan.",
            relevanceNotes: "Verifikasi kewenangan penandatangan kontrak dan pemberi kuasa hukum.",
          }
        ]
      },
      {
        id: "JDIH-PID-007",
        type: "Undang-Undang",
        title: "Undang-Undang Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana (KUHP Nasional Baru)",
        number: "UU No. 1 Tahun 2023",
        year: "2023",
        source: "JDIHN BPHN",
        status: "Berlaku Penuh",
        summary: "Menggantikan KUHP warisan kolonial Belanda (WvS). Mengatur prinsip legalitas materiil, pertanggungjawaban pidana korporasi, alternatif sanksi kerja sosial/pengawasan, dan asas transisi Lex Favor Reo.",
        relevanceScore: 100,
        citationFormat: "UU No. 1 Tahun 2023 tentang KUHP Nasional",
        tags: ["KUHP Baru", "Lex Favor Reo", "Pidana Korporasi", "Restorative Justice", "Hukum Pidana"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Pasal 1 ayat (2)",
            content: "Dalam hal terdapat perubahan peraturan perundang-undangan setelah perbuatan terjadi, diberlakukan peraturan yang meringankan bagi pelaku tindak pidana.",
            relevanceNotes: "Asas fundamental Lex Favor Reo untuk menuntut penerapan sanksi atau delik yang lebih ringan bagi Terdakwa.",
          },
          {
            articleOrPoint: "Pasal 45 - 50",
            content: "Pengaturan komprehensif pertanggungjawaban pidana korporasi dan pengurus perseroan.",
            relevanceNotes: "Memisahkan kesalahan organ pribadi dari tanggung jawab badan usaha.",
          }
        ]
      },
      {
        id: "JDIH-PID-008",
        type: "KUHPerdata / KUHP / HIR",
        title: "Undang-Undang Nomor 8 Tahun 1981 tentang Hukum Acara Pidana (KUHAP)",
        number: "UU No. 8 Tahun 1981",
        year: "1981",
        source: "Kodifikasi Hukum Positif",
        status: "Berlaku Penuh",
        summary: "Hukum acara pidana nasional yang mengatur due process of law, hak-hak tersangka/terdakwa, syarat sah penangkapan/penahanan/penyitaan, serta alat bukti sah menurut Pasal 184 KUHAP.",
        relevanceScore: 99,
        citationFormat: "Pasal 143, 156, 183, 184 KUHAP",
        tags: ["KUHAP", "Alat Bukti Sah", "Praperadilan", "Eksepsi", "Pembuktian"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Pasal 184 ayat (1)",
            content: "Alat bukti yang sah ialah: a. keterangan saksi; b. keterangan ahli; c. surat; d. petunjuk; e. keterangan terdakwa.",
            relevanceNotes: "Standar mutlak pembuktian formil penuntut umum untuk membuktikan kesalahan terdakwa.",
          },
          {
            articleOrPoint: "Pasal 143 ayat (2) & (3)",
            content: "Surat dakwaan harus diberi tanggal dan ditandatangani serta berisi uraian secara cermat, jelas dan lengkap mengenai tindak pidana yang didakwakan. Surat dakwaan yang tidak memenuhi ketentuan tersebut BATAL DEMI HUKUM.",
            relevanceNotes: "Landasan utama pengajuan Nota Keberatan (Eksepsi) atas dakwaan kabur (obscuur libel).",
          }
        ]
      },
      {
        id: "JDIH-PID-009",
        type: "Putusan Landmark MA",
        title: "Putusan Mahkamah Konstitusi No. 21/PUU-XII/2014 (Kaidah Uji Keabsahan Penetapan Tersangka via Praperadilan)",
        number: "Putusan MK No. 21/PUU-XII/2014",
        year: "2014",
        source: "JDIHN BPHN",
        status: "Yurisprudensi Tetap",
        summary: "Menyatakan Pasal 77 huruf a KUHAP inkonstitusional bersyarat sepanjang tidak dimaknai termasuk penetapan tersangka, penggeledahan, dan penyitaan. Menetapkan syarat mutlak minimal 2 alat bukti sah dan pemeriksaan calon tersangka.",
        ratioDecidendi: "Penetapan tersangka sebagai bagian dari proses penyidikan merupakan pintu masuk perampasan hak asasi seseorang, sehingga wajib diuji keabsahannya melalui lembaga Praperadilan dan harus didahului minimal 2 alat bukti yang sah serta pemeriksaan calon tersangka.",
        relevanceScore: 99,
        citationFormat: "Putusan Mahkamah Konstitusi No. 21/PUU-XII/2014 jo. Pasal 77 KUHAP",
        tags: ["Praperadilan", "Penetapan Tersangka", "Due Process of Law", "Mahkamah Konstitusi"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Amar Putusan Angka 1",
            content: "Frasa 'penetapan tersangka, penggeledahan, dan penyitaan' masuk dalam wewenang Praperadilan.",
            relevanceNotes: "Gugatan Praperadilan untuk membatalkan status Tersangka yang ditetapkan secara prematur / sewenang-wenang.",
          }
        ]
      },
      {
        id: "JDIH-PID-010",
        type: "Undang-Undang",
        title: "Undang-Undang Nomor 31 Tahun 1999 jo. UU No. 20 Tahun 2001 tentang Pemberantasan Tindak Pidana Korupsi (UU Tipikor)",
        number: "UU No. 31/1999 jo. UU No. 20/2001",
        year: "2001",
        source: "JDIHN BPHN",
        status: "Diubah Sebagian",
        summary: "Mengatur delik korupsi Pasal 2 (memperkaya diri secara melawan hukum) dan Pasal 3 (penyalahgunaan wewenang), uang pengganti Pasal 18, dan delik gratifikasi/suap.",
        relevanceScore: 96,
        citationFormat: "Pasal 2 ayat (1), Pasal 3, Pasal 18 UU No. 31/1999 jo. UU No. 20/2001",
        tags: ["Tipikor", "Kerugian Negara", "Melawan Hukum", "Penyalahgunaan Wewenang", "Pledoi"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Putusan MK No. 25/PUU-XIV/2016",
            content: "Frasa 'dapat merugikan keuangan negara' harus dimaknai sebagai kerugian negara nyata dan pasti (actual loss), bukan sekadar potensi (potential loss).",
            relevanceNotes: "Pijakan pembelaan Pledoi bahwa tanpa audit investigatif BPK yang sah, unsur kerugian negara tidak terbukti.",
          }
        ]
      },
      {
        id: "JDIH-PID-011",
        type: "SEMA / PERMA",
        title: "Peraturan Mahkamah Agung (PERMA) No. 13 Tahun 2016 tentang Tata Cara Penanganan Perkara Tindak Pidana oleh Korporasi",
        number: "PERMA No. 13 Tahun 2016",
        year: "2016",
        source: "Direktori Putusan MA",
        status: "Berlaku Penuh",
        summary: "Pedoman hakim dalam menilai kesalahan korporasi, kriteria korporasi dapat dipidana, dan pemisahan pertanggungjawaban antara pengurus perseroan dan korporasi.",
        relevanceScore: 95,
        citationFormat: "PERMA No. 13 Tahun 2016 jo. Pasal 20 UU Tipikor",
        tags: ["Pidana Korporasi", "PERMA 13/2016", "Pengurus Perseroan", "Business Judgment Rule"],
        keyArticlesOrPrecedents: [
          {
            articleOrPoint: "Pasal 4 ayat (2)",
            content: "Hakim dapat menilai kesalahan korporasi apabila korporasi tidak melakukan langkah-langkah pencegahan, mencegah dampak yang lebih besar, dan memastikan kepatuhan terhadap ketentuan hukum yang berlaku.",
            relevanceNotes: "Alat bukti pembebasan direksi perorangan dengan membuktikan berjalannya sistem kepatuhan internal.",
          }
        ]
      }
    ];

    if (!ai) {
      // Filter default database based on search terms
      const qLower = (query || "").toLowerCase();
      const filtered = defaultDatabase.filter(d => 
        !qLower || 
        d.title.toLowerCase().includes(qLower) || 
        d.summary.toLowerCase().includes(qLower) || 
        d.number.toLowerCase().includes(qLower) || 
        d.tags.some(t => t.toLowerCase().includes(qLower)) ||
        d.keyArticlesOrPrecedents.some(k => k.content.toLowerCase().includes(qLower) || k.articleOrPoint.toLowerCase().includes(qLower))
      );

      return res.json({
        success: true,
        source: "jdih_curated_engine",
        query,
        count: filtered.length,
        documents: filtered.length > 0 ? filtered : defaultDatabase,
        analysisSummary: `Ditemukan referensi hukum positif JDIH dan Yurisprudensi MA RI yang relevan dengan kueri "${query || 'Semua Peraturan'}".`,
      });
    }

    const prompt = `Anda adalah Mesin Riset Hukum Intelijen Terintegrasi "TriyLex JDIH & Yurisprudensi Engine" yang tersambung dengan basis data JDIHN (BPHN Kemenkumham), JDIH Sektoral, serta Direktori Putusan & Yurisprudensi Mahkamah Agung Republik Indonesia.

KUERI PENCARIAN ADVOKAT:
"${query}"

KATEGORI DOKUMEN: ${category || "Semua (UU, PP, Permen, Putusan MA, Yurisprudensi, SEMA)"}
FILTER STATUS: ${statusFilter || "Semua"}
KONTEKS PERKARA AKTIF:
${caseContext ? JSON.stringify(caseContext) : "Analisis umum hukum Indonesia"}

TUGAS RISET:
Lakukan pencarian dan analisis komprehensif atas peraturan perundang-undangan (JDIH), Yurisprudensi Tetap MA RI, Putusan Landmark, atau Peraturan Mahkamah Agung/SEMA yang paling presisi, mutakhir, dan relevan dengan kueri tersebut.
Perhatikan status hukum terkini (apakah masih Berlaku Penuh, Diubah Sebagian oleh UU Cipta Kerja/UU terbaru, Dicabut, atau Yurisprudensi Tetap).

FORMAT OUTPUT (MANDATORY JSON ONLY):
{
  "analysisSummary": "Uraian 2-3 kalimat mengenai peta regulasi dan arah yurisprudensi terkait topik yang dicari",
  "documents": [
    {
      "id": "JDIH-XXX",
      "type": "Undang-Undang" | "Peraturan Pemerintah" | "Perpres" | "Peraturan Menteri" | "Yurisprudensi MA" | "Putusan Landmark MA" | "SEMA / PERMA" | "KUHPerdata / KUHP / HIR",
      "title": "Nama Lengkap Peraturan / Putusan",
      "number": "Nomor Resmi (misal: UU No. 1/2024 atau Putusan MA No. 409 K/Sip/1972)",
      "year": "Tahun penerbitan/putusan",
      "source": "JDIHN BPHN" | "Direktori Putusan MA" | "JDIH Sektoral" | "Kodifikasi Hukum Positif",
      "status": "Berlaku Penuh" | "Diubah Sebagian" | "Dicabut / Tidak Berlaku" | "Yurisprudensi Tetap" | "Uji Materiil MK",
      "summary": "Ringkasan substansi hukum / konsiderans",
      "ratioDecidendi": "Pertimbangan hukum hakim (khusus untuk Putusan/Yurisprudensi)",
      "relevanceScore": 95,
      "tags": ["Tag1", "Tag2", "Tag3"],
      "citationFormat": "Format sitasi resmi untuk dimasukkan ke dalam Gugatan/Replik/Duplik/LCA-006",
      "keyArticlesOrPrecedents": [
        {
          "articleOrPoint": "Pasal / Poin Spesifik",
          "content": "Isi bunyi pasal atau kutipan amar pertimbangan",
          "relevanceNotes": "Alasan mengapa pasal/kaidah ini penting untuk sengketa ini"
        }
      ]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || "{}");

    res.json({
      success: true,
      source: "gemini_jdih_intelligence",
      query,
      count: parsedData.documents?.length || 0,
      documents: parsedData.documents || defaultDatabase,
      analysisSummary: parsedData.analysisSummary || "Hasil riset JDIH dan Yurisprudensi MA RI berhasil dikompilasi.",
    });
  } catch (error: any) {
    console.error("JDIH Search Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: "Gagal memproses pencarian JDIH, silakan coba kembali.",
    });
  }
});

// API: Document Processing & OCR Redaction Simulation

app.post("/api/ocr-process", (req, res) => {
  const { fileName, fileType } = req.body;
  const isScan = fileName.toLowerCase().includes("scan") || fileName.toLowerCase().includes("foto") || fileName.toLowerCase().includes("img");
  
  res.json({
    success: true,
    fileInfo: {
      fileName,
      fileType,
      pageCount: Math.floor(Math.random() * 8) + 2,
      ocrQuality: isScan ? "Good (96% accuracy)" : "Direct Digital Text",
      detectedPii: [
        "NIK: 3174**********0001 (Redacted)",
        "No. Rekening: 122-00-*****-8 (Redacted)",
        "Nomor Telepon: +62 812-****-4390 (Redacted)",
      ],
      hash: "sha256-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      suggestedCategory: fileName.toLowerCase().includes("kontrak") || fileName.toLowerCase().includes("perjanjian") 
        ? "Kontrak / Akta Perjanjian" 
        : fileName.toLowerCase().includes("gugatan") || fileName.toLowerCase().includes("somasi") 
        ? "Dokumen Acara / Somasi" 
        : fileName.toLowerCase().includes("rekening") || fileName.toLowerCase().includes("invoice") 
        ? "Bukti Keuangan & Mutasi" 
        : "Korespondensi / Surat",
    },
  });
});

// PDF Presentation Download & View Routes
app.get("/Google_Cloud_AI_Builder_Cup_TriyLex.pdf", (_req, res) => {
  const filePath = path.resolve(process.cwd(), "public", "Google_Cloud_AI_Builder_Cup_TriyLex.pdf");
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filePath);
});

app.get("/api/download-submission-pdf", (_req, res) => {
  const filePath = path.resolve(process.cwd(), "public", "Google_Cloud_AI_Builder_Cup_TriyLex.pdf");
  res.download(filePath, "Google_Cloud_AI_Builder_Cup_TriyLex.pdf");
});

async function startServer() {
  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TriyLex Legal Platform Server running on http://localhost:${PORT}`);
  });
}

startServer();
