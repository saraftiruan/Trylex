import { LegalCase } from '../types';

export const ADDITIONAL_CRIMINAL_CASES: LegalCase[] = [
  {
    id: 'case-pca-002',
    title: 'Dugaan Tindak Pidana Perbankan, Penipuan Investasi Fintek & TPPU vs Dittipideksus Bareskrim Polri',
    refNumber: 'TRX/2026/CRM-088',
    client: 'Dr. Ir. Adrian Wicaksono, M.B.A. (Chief Technology Officer / Terdakwa)',
    opposingParty: 'Dittipideksus Bareskrim Polri & JPU Kejaksaan Tinggi DKI Jakarta',
    methodology: 'PCA',
    caseType: 'Tindak Pidana Pasar Modal & Perbankan',
    jurisdiction: 'Indonesia',
    courtForum: 'Pengadilan Negeri Jakarta Selatan (Khusus Tipideksus / Kejahatan Finansial)',
    owner: 'Adv. Meliala Imran, S.H., LL.M.',
    reviewer: 'Partner Ronald Simanjuntak, S.H., M.H.',
    confidentiality: 'Strictly Confidential',
    proceduralPosition: 'Penetapan Tersangka / Praperadilan',
    status: 'In Review',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-30T14:30:00Z',
    currentSOPStage: 'PCA-003',
    summary: 'Perkara dugaan tindak pidana perbankan tanpa izin Pasal 46 UU No. 10/1998 jo. Pasal 378 KUHP (Penipuan) jo. Pasal 28 ayat (1) UU ITE No. 1/2024 jo. Pasal 3 & 5 UU TPPU No. 8/2010. Terdakwa selaku CTO platform P2P lending berizin OJK dituduh merekayasa algoritma pencairan dana pinjaman fiktif senilai Rp 42,5 Miliar. Pembelaan membuktikan telah terjadi serangan siber malware zero-day dari sindikat internasional yang meretas API gateway bank kustodian mitra, terverifikasi dari audit forensik BSSN dan ketiadaan niat jahat (mens rea) dari Terdakwa.',
    claimAmount: 'Tuntutan: Pidana Penjara 15 Tahun, Denda Rp 10 Miliar & Restitusi Rp 42.500.000.000',
    incidentDate: '2025-10-14',
    contractDate: '2023-04-10',
    allegedBreachDate: '2025-10-15',
    noticeDate: '2026-02-12',
    lawsuitDate: '2026-06-25',
    parties: [
      {
        id: 'pty-crm2-1',
        name: 'Dr. Ir. Adrian Wicaksono, M.B.A.',
        type: 'Individual',
        role: 'Terdakwa / Pemohon Praperadilan',
        legalRepresentative: 'TriyLex Cyber & Financial Defense Practice Group',
        conflictNotes: 'CTO profesional non-pemegang saham pengendali, tidak memiliki akses mutasi rekening penampung.',
      },
      {
        id: 'pty-crm2-2',
        name: 'Subdit Perbankan & TPPU Dittipideksus Bareskrim Polri',
        type: 'Government Body',
        role: 'Penyidik / Termohon Praperadilan',
        legalRepresentative: 'Divisi Hukum Polri (Divkum Polri)',
      },
      {
        id: 'pty-crm2-3',
        name: 'Tim Jaksa Penuntut Umum Kejati DKI Jakarta',
        type: 'Government Body',
        role: 'Jaksa Penuntut Umum (JPU)',
        legalRepresentative: 'Asisten Tindak Pidana Khusus Kejati DKI Jakarta',
      },
      {
        id: 'pty-crm2-4',
        name: 'Dr. Pratama Dahlian Persadha (Ahli Forensik Digital BSSN)',
        type: 'Individual',
        role: 'Saksi Ahli Digital Forensik',
        legalRepresentative: 'Lembaga Riset Keamanan Siber CISSReC',
        conflictNotes: 'Saksi ahli independen yang mengonfirmasi adanya jejak injeksi payload malware remote code execution.',
      }
    ],
    claims: [
      {
        id: 'clm-crm2-1',
        title: 'Dakwaan Kesatu: Pasal 46 ayat (1) jo. Pasal 16 UU Perbankan No. 10/1998',
        description: 'Menghimpun dana dari masyarakat dalam bentuk simpanan tanpa izin usaha dari Pimpinan Bank Indonesia / OJK.',
        type: 'Surat Dakwaan / Dakwaan Primer',
        claimedAmount: 'Pidana Penjara 15 Tahun & Denda Rp 10 Miliar',
        legalBasis: 'Pasal 46 ayat (1) UU No. 10 Tahun 1998',
      },
      {
        id: 'clm-crm2-2',
        title: 'Dakwaan Kedua: Pasal 378 KUHP jo. Pasal 28 ayat (1) UU ITE No. 1/2024',
        description: 'Menyebarkan berita bohong dan menyesatkan yang mengakibatkan kerugian konsumen dalam transaksi elektronik.',
        type: 'Dakwaan Subsidair',
        claimedAmount: 'Pidana Penjara 6 Tahun',
        legalBasis: 'Pasal 28 ayat (1) jo. Pasal 45A ayat (1) UU ITE',
      },
      {
        id: 'clm-crm2-3',
        title: 'Dakwaan Ketiga: Pasal 3 jo. Pasal 5 UU No. 8 Tahun 2010 (TPPU)',
        description: 'Menempatkan, mentransfer, mengalihkan harta kekayaan yang diketahuinya merupakan hasil tindak pidana.',
        type: 'Dakwaan Kumulatif TPPU',
        claimedAmount: 'Restitusi Rp 42.500.000.000',
        legalBasis: 'UU Tindak Pidana Pencucian Uang',
      }
    ],
    timeline: [
      {
        id: 'tm-crm2-1',
        date: '2023-04-10',
        title: 'Penerbitan Izin Resmi Penyelenggara Fintek OJK',
        description: 'Platform P2P Lending Mitra Mandiri resmi memperoleh tanda berizin penuh dari Otoritas Jasa Keuangan (OJK).',
        category: 'Contract',
        importance: 'Key',
        documentRef: 'D-FIN-01',
        documentName: 'Surat_Izin_Resmi_OJK_2023.pdf',
        actor: 'Otoritas Jasa Keuangan (OJK)',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm2-2',
        date: '2025-10-14',
        title: 'Insiden Anomali Siber & Eksfiltrasi Gateway Bank',
        description: 'Sistem deteksi IDS mencatat serangan injeksi SQL zero-day dari IP beralamat Eropa Timur yang mengeksploitasi webhook bank kustodian mitra.',
        category: 'Breach',
        importance: 'Key',
        documentRef: 'D-FIN-02',
        documentName: 'Audit_Forensik_BSSN_Cyber_Attack.pdf',
        actor: 'Sindikat Hacker Internasional (Unknown)',
        proceduralStatus: 'Breached / In Mora'
      },
      {
        id: 'tm-crm2-3',
        date: '2025-10-16',
        title: 'Pelaporan Resmi Insiden Kejahatan Siber ke CSIRT BSSN',
        description: 'CTO dan Tim IT resmi melaporkan insiden breach dan membekukan seluruh API token demi melindungi dana nasabah.',
        category: 'Notice',
        importance: 'Key',
        documentRef: 'D-FIN-03',
        documentName: 'Tanda_Terima_Laporan_Insiden_CSIRT.pdf',
        actor: 'Dr. Ir. Adrian Wicaksono, M.B.A.',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm2-4',
        date: '2026-02-12',
        title: 'Penetapan Tersangka Tanpa Pemeriksaan Ahli Digital Forensik',
        description: 'Penyidik Bareskrim menerbitkan Surat Ketetapan Tersangka tergesa-gesa tanpa menyertakan hasil uji laboratorium digital forensik resmi.',
        category: 'Litigation',
        importance: 'Key',
        documentRef: 'D-FIN-04',
        documentName: 'SPDP_dan_Penetapan_Tersangka_Polri.pdf',
        actor: 'Penyidik Bareskrim Polri',
        proceduralStatus: 'Pre-trial Window'
      },
      {
        id: 'tm-crm2-5',
        date: '2026-06-25',
        title: 'Pendaftaran Permohonan Praperadilan (Pasal 77 KUHAP)',
        description: 'Tim Advokat mendaftarkan gugatan Praperadilan di PN Jakarta Selatan menguji keabsahan penetapan Tersangka dan penyitaan server tanpa izin KPN.',
        category: 'Court',
        importance: 'Key',
        documentRef: 'D-FIN-05',
        documentName: 'Berkas_Permohonan_Praperadilan_PN_Jaksel.pdf',
        actor: 'TriyLex Criminal Defense Group',
        proceduralStatus: 'Pending Court Action'
      }
    ],
    facts: [
      {
        id: 'f-crm2-1',
        statement: 'Terdakwa adalah Chief Technology Officer yang hanya bertanggung jawab pada arsitektur teknis dan sama sekali tidak memiliki hak otoritas rekening bank perseroan.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-FIN-01'],
        tags: ['Ketiadaan Mens Rea', 'Bukan Penanggung Jawab Keuangan'],
        verified: true,
        confidence: 'High',
      },
      {
        id: 'f-crm2-2',
        statement: 'Hasil audit forensik BSSN membuktikan terjadi 1.482 serangan remote code execution pada rentang 14-15 Oktober 2025 yang membobol payment gateway pihak ketiga.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-FIN-02', 'D-FIN-03'],
        tags: ['Cyber Attack', 'Force Majeure Digital', 'Ketiadaan Niat Jahat'],
        verified: true,
        confidence: 'High',
      },
      {
        id: 'f-crm2-3',
        statement: 'Penyitaan terhadap 4 unit server data center dilakukan penyidik tanpa mengantongi izin penyitaan dari Ketua Pengadilan Negeri setempat (Pasal 38 KUHAP).',
        status: 'Disputed',
        relevanceScore: 'High',
        sourceDocIds: ['D-FIN-04'],
        tags: ['Cacat Prosedur KUHAP', 'Unlawful Seizure'],
        verified: true,
        confidence: 'High',
      }
    ],
    evidenceMatrix: [
      {
        evidenceId: 'ev-crm2-1',
        name: 'Laporan Audit Investigatif Forensik BSSN No. BSSN/FOR/2025/X-99',
        type: 'Surat / Dokumen Resmi (184 ayat 1c)',
        supportsFactId: 'f-crm2-2',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-FIN-02',
        notes: 'Bukti otentik saintifik pembuktian ketiadaan rekayasa internal dan adanya peretasan dari luar negeri.'
      },
      {
        evidenceId: 'ev-crm2-2',
        name: 'Surat Keputusan Dewan Direksi tentang Struktur Tata Kelola & Batasan Wewenang CTO',
        type: 'Surat/Akta Otentik',
        supportsFactId: 'f-crm2-1',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-FIN-01',
        notes: 'Menegaskan Terdakwa tidak memiliki otorisasi penarikan dana escrow.'
      }
    ],
    evidenceGaps: [
      {
        id: 'eg-crm2-1',
        description: 'Log audit internal bank kustodian mitra belum diserahkan secara sukarela.',
        impact: 'High',
        recommendation: 'Memohon Majelis Hakim memerintahkan Bank Kustodian membuka rekaman log transaksi API gateway pada tanggal kejadian.',
        status: 'Open',
      }
    ],
    statutes: [
      {
        articleId: 'st-crm2-1',
        code: 'UU No. 10 Tahun 1998 tentang Perbankan',
        article: 'Pasal 46 ayat (1)',
        title: 'Penghimpunan Dana Tanpa Izin',
        verbatimText: 'Barangsiapa menghimpun dana dari masyarakat dalam bentuk simpanan tanpa izin usaha dari Pimpinan Bank Indonesia diancam dengan pidana penjara sekurang-kurangnya 5 tahun.',
        relevanceScore: 0.95,
        benchmarkNotes: 'Tidak dapat diterapkan pada platform P2P lending yang beroperasi dengan skema peer-to-peer dan mengantongi izin resmi OJK.'
      },
      {
        articleId: 'st-crm2-2',
        code: 'KUHAP',
        article: 'Pasal 77 jo. Putusan MK No. 21/PUU-XII/2014',
        title: 'Objek Praperadilan atas Penetapan Tersangka',
        verbatimText: 'Pengadilan negeri berwenang untuk memeriksa dan memutus sah atau tidaknya penetapan tersangka, penangkapan, dan/atau penahanan.',
        relevanceScore: 0.98,
        benchmarkNotes: 'Landasan formil gugatan Praperadilan membatalkan status Tersangka.'
      }
    ],
    riskMatrix: {
      legalExposure: 'High',
      evidenceStrength: 'Strong',
      contradictionRisk: 'Low',
      temporalRisk: 'Low',
      proceduralRisk: 'Critical',
      researchDependency: 'Medium',
      analyticalConfidence: 'High',
      summaryNotes: 'Peluang pembatalan status Tersangka melalui Praperadilan mencapai 82% karena penetapan Tersangka diterbitkan sebelum selesainya audit forensik BSSN.'
    },
    strategyPlan: {
      primaryObjective: 'Menyatakan Penetapan Tersangka Batal Demi Hukum melalui Putusan Praperadilan PN Jaksel',
      settlementThreshold: 'Praperadilan Dikabulkan & Pembukaan Blokir Rekening Operasional Perusahaan',
      proceduralRoadmap: [
        'Pendaftaran Permohonan Praperadilan di Pengadilan Negeri Jakarta Selatan',
        'Pemeriksaan Saksi Ahli Forensik Digital BSSN dan Ahli Hukum Acara Pidana UI',
        'Pengajuan Putusan Sela dan Pembatalan Berita Acara Penyitaan Server',
        'Pemberitahuan Resmi kepada OJK mengenai Pemulihan Hak Keperdataan Perseroan'
      ],
      fallbackPlan: 'Jika Praperadilan ditolak, ajukan Eksepsi Pasal 156 KUHAP atas ketidakcermatan penguraian unsur mens rea CTO dalam surat dakwaan.'
    },
    quantumCalculation: {
      totalClaimed: 42500000000,
      totalProven: 0,
      gapAmount: 42500000000,
      interestCalculated: 0,
      breakdown: [
        {
          id: 'q-crm2-1',
          category: 'Kerugian Pokok (Materil)',
          description: 'Klaim kerugian dana nasabah escrow yang dieksfiltrasi peretas siber',
          claimedAmount: 42500000000,
          provenAmount: 0,
          legalBasis: 'Tuntutan Ganti Rugi Restitusi Jaksa Penuntut Umum',
          evidenceRef: 'Laporan Audit Forensik BSSN',
          status: 'Partially Documented'
        }
      ]
    },
    documents: [
      {
        id: 'D-FIN-01',
        name: 'Surat_Izin_Resmi_OJK_2023.pdf',
        size: '2.4 MB',
        fileType: 'PDF',
        uploadDate: '2026-08-20T10:15:00Z',
        status: 'Ready for analysis',
        category: 'Kontrak/Perjanjian',
        pageCount: 18,
        ocrQuality: 'High (99%)',
        ocrConfidence: 0.99,
        extractedText: 'KEPUTUSAN OTORITAS JASA KEUANGAN NOMOR KEP-42/D.05/2023 TENTANG PEMBERIAN IZIN USAHA PENYELENGGARA LAYANAN PENDANAAN BERSAMA BERBASIS TEKNOLOGI INFORMASI KEPADA PT MITRA MANDIRI FINTEK.',
        hash: 'sha256-f78a0b9821cb34e98f01a938cde998231',
        piiRedacted: true
      },
      {
        id: 'D-FIN-02',
        name: 'Audit_Forensik_BSSN_Cyber_Attack.pdf',
        size: '8.7 MB',
        fileType: 'PDF',
        uploadDate: '2026-08-20T10:30:00Z',
        status: 'Ready for analysis',
        category: 'Putusan/Dokumen Pengadilan',
        pageCount: 64,
        ocrQuality: 'High (98%)',
        ocrConfidence: 0.98,
        extractedText: 'HASIL AUDIT FORENSIK DAN ANALISIS LOG SERVER BADAN SIBER DAN SANDI NEGARA (BSSN): Ditemukan jejak serangan persisten injeksi modul exploit CVE-2025-8812 yang mengeksfiltrasi database kredensial token API gateway.',
        hash: 'sha256-a9912bc87e023910ffbe871142998a123',
        piiRedacted: true
      }
    ],
    comments: [
      {
        id: 'comm-crm2-1',
        author: 'Adv. Meliala Imran, S.H., LL.M.',
        role: 'Lead Counsel',
        createdAt: '2026-08-21T09:00:00Z',
        text: 'Fokus Praperadilan: Penyidik menetapkan status Tersangka kepada CTO tanpa didahului gelar perkara bersama ahli siber independen.'
      }
    ],
    completedSOPStages: ['PCA-001', 'PCA-002', 'PCA-003'],
    pcaDueProcessAudit: {
      suratTugasSpdpValid: true,
      spdpDeliveredOnTime: false,
      twoValidEvidenceAvailable: false,
      warrantHasClearLocusTempus: true,
      seizureApproval: {
        hasCourtPermit: false,
        emergencyProtocolValid: false,
        notes: 'Penyitaan server data center di IDC Duren Tiga dilakukan tanpa izin KPN dan tanpa keadaan mendesak yang sah (cacat Pasal 38 KUHAP).'
      },
      legalCounselRight: {
        article56Compliant: true,
        bapAccompanied: true,
        notes: 'Pemeriksaan saksi didampingi Penasihat Hukum.'
      },
      praperadilanViability: 'Sangat Tinggi (Strong)',
      praperadilanArguments: [
        'Penetapan Tersangka tidak didasarkan pada 2 alat bukti yang sah yang mengaitkan Terdakwa dengan unsur kesengajaan.',
        'Penyitaan benda tidak bergerak/server digital melanggar Pasal 38 KUHAP tanpa izin Ketua Pengadilan Negeri.'
      ]
    },
    pcaElementsDeconstruction: {
      indictmentArticle: 'Pasal 46 ayat (1) UU Perbankan jo. Pasal 28 UU ITE jo. Pasal 3 UU TPPU',
      penalSystemComparison: {
        wvsOldArticle: 'Pasal 378 KUHP (Penipuan)',
        kuhpNewUU12023Article: 'Pasal 492 UU No. 1/2023',
        specialLawArticle: 'Pasal 46 UU Perbankan & Pasal 3 UU TPPU',
        transitionPrinciple: 'Lex Favor Reo: Menerapkan ketentuan paling menguntungkan terdakwa.'
      },
      objectiveElements: [
        {
          element: 'Menghimpun dana masyarakat tanpa izin perbankan',
          fulfillment: 'Tidak Terpenuhi',
          analysis: 'Perusahaan beroperasi sebagai P2P lending resmi berizin OJK, bukan perbankan konvensional penghimpun simpanan dana.',
          supportingEvidence: ['Surat Izin OJK 2023']
        }
      ],
      subjectiveElements: [
        {
          element: 'Dengan sengaja dan dengan maksud menguntungkan diri sendiri',
          fulfillment: 'Tidak Terpenuhi',
          analysis: 'Tidak ditemukan transfer aliran dana (money trail) ke rekening pribadi Terdakwa maupun keluarganya.',
          supportingEvidence: ['Hasil Kliring PPATK & Rekening Koran Bank BCA']
        }
      ],
      causalityAnalysis: 'Kerugian nasabah bukan timbul akibat tindakan rekayasa Terdakwa, melainkan akibat eksfiltrasi malware peretas internasional.'
    },
    pcaWitnessMatrix: {
      crossExamStrategy: [
        {
          witnessName: 'Ipda Budi Santoso (Penyidik Siber Polri)',
          witnessRole: 'Saksi BAP Penyidik',
          targetedContradiction: 'Waktu penetapan Tersangka mendahului penerbitan Berita Acara Pemeriksaan Forensik Digital.',
          trappingQuestions: [
            'Apakah saat menetapkan Tersangka pada 12 Februari 2026, Saudara telah menerima laporan resmi analisis malware BSSN?',
            'Apakah Saudara dapat menunjukkan bukti aliran dana dari escrow ke rekening pribadi Terdakwa?'
          ],
          expectedTrapGoal: 'Membuktikan penetapan Tersangka dilakukan prematur berdasarkan asumsi administratif semata.'
        }
      ],
      aDeChargeStrategy: [
        {
          witnessCategory: 'Ahli Forensik Digital / Auditor Finansial',
          testimonyGoal: 'Menerangkan bahwa kerentanan zero-day tidak dapat diprediksi secara manusiawi dan merupakan anomali siber eksternal.',
          keyQuestions: [
            'Bagaimana karakteristik serangan exploit CVE-2025-8812 terhadap payment gateway?',
            'Apakah tindakan CTO mengisolasi server segera setelah breach merupakan tindakan pencegahan standar ISO 27001?'
          ]
        }
      ]
    },
    pcaSentencingMatrix: {
      primaryPenaltyRange: 'Tuntutan Jaksa 15 Tahun Penjara. Potensi Putusan: Bebas Murni (Vrijspraak).',
      restitutionOrStateLoss: 'Restitusi Rp 42.500.000.000 (Dapat ditolak karena Terdakwa bukan pelaku penikmat dana hasil kejahatan siber).',
      assetForfeitureRisk: 'Nihil karena tidak terbukti adanya aset yang bersumber dari tindak pidana.',
      restorativeJusticeViability: 'Diskresi Penegak Hukum',
      mitigatingCircumstances: [
        'Terdakwa bersikap sangat kooperatif dan menyerahkan seluruh log enkripsi secara sukarela kepada penegak hukum.',
        'Terdakwa adalah akademisi dan peraih paten teknologi enkripsi nasional yang berprestasi.'
      ],
      aggravatingCircumstances: [
        'Jumlah korban nasabah penabung yang menuntut pengembalian dana melalui media sosial.'
      ]
    },
    pcaPledoiDossier: {
      pledoiTitle: 'NOTA KEBERATAN & PEMBELAAN: KEJAHATAN SIBER BUKAN DOSA ARSITEK TEKNOLOGI YANG MENJADI KORBAN PERETASAN',
      defenseTarget: 'Vrijspraak (Bebas Murni)',
      pledoiText: 'MAJELIS HAKIM YANG MULIA,\\n\\nMenghukum seorang insinyur teknologi atas kejahatan peretas siber internasional adalah kekeliruan fatal yang mencederai keadilan hukum pidana. Tidak ada niat jahat (Geen Straf Zonder Schuld). Kami memohon putusan Bebas Murni demi tegaknya kepastian hukum.'
    }
  },
  {
    id: 'case-pca-003',
    title: 'Pertanggungjawaban Pidana Korporasi Kebakaran Hutan & Lahan (Karhutla) vs Gakkum KLHK & Kejati Riau',
    refNumber: 'TRX/2026/CRM-105',
    client: 'PT Sawit Lestari Khatulistiwa (Direktur Utama: Bambang Hartono, S.E. / Terdakwa)',
    opposingParty: 'Penyidik Gakkum KLHK & Penuntut Umum Kejaksaan Negeri Siak',
    methodology: 'PCA',
    caseType: 'Tindak Pidana Lingkungan Hidup & Kehutanan',
    jurisdiction: 'Indonesia',
    courtForum: 'Pengadilan Negeri Siak Sri Indrapura',
    owner: 'Adv. Meliala Imran, S.H., LL.M.',
    reviewer: 'Senior Partner Hendra Wijaya, S.H.',
    confidentiality: 'Highly Confidential',
    proceduralPosition: 'Tahap Pembuktian',
    status: 'Ready for Analysis',
    createdAt: '2026-07-10T08:30:00Z',
    updatedAt: '2026-09-25T11:15:00Z',
    currentSOPStage: 'PCA-006',
    summary: 'Dugaan tindak pidana lingkungan hidup Pasal 98 ayat (1) jo. Pasal 99 ayat (1) jo. Pasal 116 ayat (1) huruf a UU No. 32/2009 tentang PPLH jo. Perma No. 13/2016 tentang Pidana Korporasi atas kebakaran 120 hektar gambut di Siak. Penuntut umum menuntut pertanggungjawaban mutlak (strict liability). Pembelaan membuktikan api berasal dari lompatan kebakaran liar (spot fires) di kawasan hutan negara terbuka di luar HGU saat anomali iklim El Nino ekstrem (overmacht/force majeure). Perusahaan telah memenuhi sarana pemadam api berstandar KLHK, memiliki 12 embung aktif, dan mengerahkan 80 personel Manggala Agni internal.',
    claimAmount: 'Tuntutan: Denda Korporasi Rp 15 Miliar & Biaya Pemulihan Ekologis Rp 35.800.000.000',
    incidentDate: '2025-08-20',
    contractDate: '2021-05-18',
    allegedBreachDate: '2025-08-22',
    noticeDate: '2025-11-10',
    lawsuitDate: '2026-04-18',
    parties: [
      {
        id: 'pty-crm3-1',
        name: 'PT Sawit Lestari Khatulistiwa (Bambang Hartono, S.E.)',
        type: 'Corporate Entity',
        role: 'Terdakwa Korporasi',
        legalRepresentative: 'TriyLex Environmental & Corporate Criminal Defense',
        conflictNotes: 'Memiliki izin HGU perkebunan sawit berkelanjutan bersertifikat ISPO.',
      },
      {
        id: 'pty-crm3-2',
        name: 'Balai Penegakan Hukum (Gakkum) KLHK Wilayah Sumatera',
        type: 'Government Body',
        role: 'Penyidik Pegawai Negeri Sipil (PPNS)',
        legalRepresentative: 'Ditjen Gakkum KLHK RI',
      },
      {
        id: 'pty-crm3-3',
        name: 'Tim Jaksa Penuntut Umum Kejaksaan Negeri Siak',
        type: 'Government Body',
        role: 'Jaksa Penuntut Umum (JPU)',
        legalRepresentative: 'Kejaksaan Tinggi Riau',
      },
      {
        id: 'pty-crm3-4',
        name: 'Prof. Dr. Ir. Bambang Hero Saharjo (Ahli Forensik Kebakaran Hutan IPB)',
        type: 'Individual',
        role: 'Saksi Ahli Penuntut Umum',
        legalRepresentative: 'Fakultas Kehutanan Institut Pertanian Bogor',
      }
    ],
    claims: [
      {
        id: 'clm-crm3-1',
        title: 'Dakwaan Primer: Pasal 98 ayat (1) UU PPLH jo. Pasal 116 ayat (1) huruf a',
        description: 'Perbuatan dengan sengaja melakukan tindakan yang mengakibatkan dilampauinya baku mutu kerusakan lingkungan hidup.',
        type: 'Surat Dakwaan / Dakwaan Primer',
        claimedAmount: 'Denda Rp 15.000.000.000 & Penutupan Lokasi Usaha',
        legalBasis: 'Pasal 98 ayat (1) UU No. 32/2009',
      },
      {
        id: 'clm-crm3-2',
        title: 'Dakwaan Subsidair: Pasal 99 ayat (1) UU PPLH',
        description: 'Kelalaian korporasi dalam mencegah dan menanggulangi terjadinya kebakaran di areal kerja.',
        type: 'Dakwaan Subsidair',
        claimedAmount: 'Pidana Denda Rp 5.000.000.000',
        legalBasis: 'Pasal 99 ayat (1) UU No. 32/2009',
      },
      {
        id: 'clm-crm3-3',
        title: 'Pidana Tambahan: Pasal 119 huruf c UU PPLH',
        description: 'Tuntutan pemulihan fungsi lingkungan hidup dan ekosistem gambut.',
        type: 'Tuntutan Pidana Tambahan',
        claimedAmount: 'Biaya Pemulihan Rp 35.800.000.000',
        legalBasis: 'Pasal 119 UU PPLH',
      }
    ],
    timeline: [
      {
        id: 'tm-crm3-1',
        date: '2021-05-18',
        title: 'Penerbitan Izin Lingkungan & AMDAL Perkebunan',
        description: 'Pemerintah menerbitkan dokumen AMDAL dan izin lingkungan lengkap dengan persetujuan instalasi sekat kanal gambut.',
        category: 'Contract',
        importance: 'Supporting',
        documentRef: 'D-ENV-01',
        documentName: 'AMDAL_dan_Izin_Lingkungan_KLHK.pdf',
        actor: 'Kementerian Lingkungan Hidup dan Kehutanan',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm3-2',
        date: '2025-08-20',
        title: 'Deteksi Titik Api (Hotspot) Pertama di Luar Batas HGU',
        description: 'Satelit Terra/Aqua LAPAN merekam titik api pertama kali berkobar pada koordinat hutan negara yang berjarak 3,8 km di luar konsesi perusahaan.',
        category: 'Notice',
        importance: 'Key',
        documentRef: 'D-ENV-02',
        documentName: 'Citra_Satelit_LAPAN_BMKG_Hotspot.pdf',
        actor: 'LAPAN / BMKG',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm3-3',
        date: '2025-08-22',
        title: 'Api Melompat Masuk Batas Blok Perkebunan Akibat Angin Kencang',
        description: 'Lompatan bara api di udara (spot fire) melompati kanal batas akibat angin kencang 45 km/jam di tengah kemarau ekstrem.',
        category: 'Breach',
        importance: 'Key',
        documentRef: 'D-ENV-03',
        documentName: 'Berita_Acara_Pemadaman_Karhutla_Internal.pdf',
        actor: 'Kondisi Cuaca Ekstrem (El Nino / Overmacht)',
        proceduralStatus: 'Breached / In Mora'
      },
      {
        id: 'tm-crm3-4',
        date: '2025-08-23',
        title: 'Pengerahan Total Tim Pemadam Kebakaran Korporasi',
        description: 'Perusahaan mengerahkan 80 personel regu damkar, 14 pompa bertekanan tinggi, dan 2 helikopter water bombing carteran untuk memadamkan api.',
        category: 'Evidence',
        importance: 'Key',
        documentRef: 'D-ENV-04',
        documentName: 'Logbook_Damkar_dan_Sertifikasi_Sarpras.pdf',
        actor: 'Regu Pemadam Kebakaran PT SLK',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm3-5',
        date: '2026-04-18',
        title: 'Pelimpahan Berkas Perkara ke Pengadilan Negeri Siak',
        description: 'Sidang perdana pembacaan surat dakwaan perkara pidana lingkungan hidup nomor reg: PDM-12/Siak/2026.',
        category: 'Court',
        importance: 'Key',
        documentRef: 'D-ENV-05',
        documentName: 'Surat_Dakwaan_Kejari_Siak_Karhutla.pdf',
        actor: 'Kejaksaan Negeri Siak',
        proceduralStatus: 'Pending Court Action'
      }
    ],
    facts: [
      {
        id: 'f-crm3-1',
        statement: 'Titik api mula-mula terbukti secara ilmiah berasal dari kawasan hutan lindung terlantar di luar batas HGU perusahaan.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-ENV-02'],
        tags: ['Overmacht', 'Bukan Asal Api Internal'],
        verified: true,
        confidence: 'High',
      },
      {
        id: 'f-crm3-2',
        statement: 'Perusahaan telah memenuhi 100% kepatuhan sarana dan prasarana pencegahan karhutla berdasarkan Peraturan Menteri Pertanian No. 05/2018.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-ENV-04'],
        tags: ['Ketiadaan Kelalaian', 'SOP Terpenuhi'],
        verified: true,
        confidence: 'High',
      }
    ],
    evidenceMatrix: [
      {
        evidenceId: 'ev-crm3-1',
        name: 'Analisis Peta Spasial Temporal Citra Satelit Sentinel-2 & Modis',
        type: 'Surat / Dokumen Resmi (184 ayat 1c)',
        supportsFactId: 'f-crm3-1',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-ENV-02',
        notes: 'Membuktikan perambatan api dari arah luar ke dalam konsesi (arah mata angin barat ke timur).'
      },
      {
        evidenceId: 'ev-crm3-2',
        name: 'Sertifikasi Audit Sarpras Damkar & Embung dari Dinas Perkebunan Provinsi Riau',
        type: 'Surat/Akta Otentik',
        supportsFactId: 'f-crm3-2',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-ENV-04',
        notes: 'Bukti formil pembantah dakwaan kelalaian sarana prasarana.'
      }
    ],
    evidenceGaps: [
      {
        id: 'eg-crm3-1',
        description: 'Laporan penetapan status tanggap darurat bencana karhutla bupati Siak belum dilegalisir basah.',
        impact: 'Medium',
        recommendation: 'Meminta salinan resmi Keputusan Bupati Siak tentang Status Tanggap Darurat Bencana Asap Karhutla 2025.',
        status: 'Open',
      }
    ],
    statutes: [
      {
        articleId: 'st-crm3-1',
        code: 'UU No. 32 Tahun 2009 tentang PPLH',
        article: 'Pasal 98 & Pasal 116',
        title: 'Tindak Pidana Lingkungan Hidup oleh Korporasi',
        verbatimText: 'Apabila tindak pidana lingkungan hidup dilakukan oleh, untuk, atau atas nama badan usaha, tuntutan pidana dan sanksi pidana dijatuhkan kepada badan usaha.',
        relevanceScore: 0.96,
        benchmarkNotes: 'Memerlukan pembuktian adanya hubungan kerja dan ketiadaan sistem kepatuhan (compliance defence).'
      }
    ],
    riskMatrix: {
      legalExposure: 'Critical',
      evidenceStrength: 'Strong',
      contradictionRisk: 'Low',
      temporalRisk: 'Low',
      proceduralRisk: 'Medium',
      researchDependency: 'High',
      analyticalConfidence: 'High',
      summaryNotes: 'Kekuatan bukti sains spasial sangat tinggi. Keberhasilan bergantung pada penolakan doktrin strict liability mutlak tanpa pembuktian sebab-akibat (causality).'
    },
    strategyPlan: {
      primaryObjective: 'Putusan Lepas dari Segala Tuntutan Hukum (Onslag van alle rechtsvervolging) atas Alasan Daya Paksa / Overmacht',
      settlementThreshold: 'Pembebasan Pidana Denda & Pengurangan Biaya Pemulihan Mengikuti Luasan Riil',
      proceduralRoadmap: [
        'Pemeriksaan Saksi Petugas Manggala Agni Lapangan',
        'Pemeriksaan Ahli Klimatologi BMKG dan Ahli Hukum Lingkungan Universitas Riau',
        'Penyampaian Nota Pembelaan (Pledoi) Menolak Analisis Total Loss Ahli JPU',
        'Penyusunan Rencana Pemulihan Mandiri (Restorasi Gambut Sukarela)'
      ],
      fallbackPlan: 'Jika dinyatakan bersalah secara kelalaian, maksimalkan keringanan pidana denda dengan merujuk kepatuhan sertifikasi ISPO dan itikad baik pemadaman.'
    },
    quantumCalculation: {
      totalClaimed: 50800000000,
      totalProven: 0,
      gapAmount: 50800000000,
      interestCalculated: 0,
      breakdown: [
        {
          id: 'q-crm3-1',
          category: 'Biaya Operasional & Pemulihan',
          description: 'Tuntutan pemulihan lingkungan versi jaksa penuntut umum',
          claimedAmount: 35800000000,
          provenAmount: 0,
          legalBasis: 'Perhitungan Valuasi Ekologis IPB',
          evidenceRef: 'D-ENV-05',
          status: 'Partially Documented'
        }
      ]
    },
    documents: [
      {
        id: 'D-ENV-01',
        name: 'AMDAL_dan_Izin_Lingkungan_KLHK.pdf',
        size: '14.2 MB',
        fileType: 'PDF',
        uploadDate: '2026-07-10T09:00:00Z',
        status: 'Ready for analysis',
        category: 'Kontrak/Perjanjian',
        pageCount: 140,
        ocrQuality: 'High (97%)',
        ocrConfidence: 0.97,
        extractedText: 'SURAT KEPUTUSAN MENTERI LINGKUNGAN HIDUP DAN KEHUTANAN TENTANG KELAYAKAN LINGKUNGAN HIDUP KEGIATAN PERKEBUNAN KELAPA SAWIT PT SAWIT LESTARI KHATULISTIWA.',
        hash: 'sha256-e991209bca34821c99831ef78921a911',
        piiRedacted: false
      },
      {
        id: 'D-ENV-02',
        name: 'Citra_Satelit_LAPAN_BMKG_Hotspot.pdf',
        size: '6.4 MB',
        fileType: 'PDF',
        uploadDate: '2026-07-10T09:30:00Z',
        status: 'Ready for analysis',
        category: 'Putusan/Dokumen Pengadilan',
        pageCount: 32,
        ocrQuality: 'High (99%)',
        ocrConfidence: 0.99,
        extractedText: 'ANALISIS DETEKSI CITRA SATELIT MULTISPEKTRAL: Titik api pertama tercatat pada koordinat 0°52\'14"N 101°48\'22"E berada di luar batas izin konsesi.',
        hash: 'sha256-b8109923ca18290faef0129388471192',
        piiRedacted: false
      }
    ],
    comments: [],
    completedSOPStages: ['PCA-001', 'PCA-002', 'PCA-003', 'PCA-004', 'PCA-005', 'PCA-006'],
    pcaDueProcessAudit: {
      suratTugasSpdpValid: true,
      spdpDeliveredOnTime: true,
      twoValidEvidenceAvailable: true,
      warrantHasClearLocusTempus: true,
      seizureApproval: {
        hasCourtPermit: true,
        emergencyProtocolValid: true,
        notes: 'Penyitaan sampel arang gambut dan papan segel telah berizin pengadilan.'
      },
      legalCounselRight: {
        article56Compliant: true,
        bapAccompanied: true,
        notes: 'Direksi didampingi advokat.'
      },
      praperadilanViability: 'Lemah / Tidak Layak (Weak)',
      praperadilanArguments: []
    },
    pcaElementsDeconstruction: {
      indictmentArticle: 'Pasal 98 ayat (1) jo. Pasal 116 UU PPLH',
      penalSystemComparison: {
        wvsOldArticle: 'Pasal 187 & 188 KUHP (Pembakaran & Kealpaan)',
        kuhpNewUU12023Article: 'Pasal 342 & 343 UU No. 1/2023',
        specialLawArticle: 'Pasal 98 UU No. 32/2009',
        transitionPrinciple: 'Lex Favor Reo'
      },
      objectiveElements: [
        {
          element: 'Melakukan perbuatan yang mengakibatkan dilampauinya baku mutu kerusakan lingkungan',
          fulfillment: 'Diragukan / Celah Pembelaan',
          analysis: 'Penyebab api adalah kebakaran liar dari luar konsesi yang terbawa angin badai El Nino.',
          supportingEvidence: ['Citra Satelit BMKG', 'Saksi Petugas Damkar']
        }
      ],
      subjectiveElements: [
        {
          element: 'Dengan sengaja / kelalaian yang disengaja (culpa lata)',
          fulfillment: 'Tidak Terpenuhi',
          analysis: 'Korporasi tidak pernah menginstruksikan pembakaran dan sebaliknya mengucurkan dana damkar darurat Rp 1,8 Miliar.',
          supportingEvidence: ['Bukti Pengeluaran Kas Operasi Pemadaman']
        }
      ],
      causalityAnalysis: 'Ada intervensi faktor alam ekstrem (vis major) yang memutus mata rantai kausalitas perbuatan korporasi.'
    },
    pcaWitnessMatrix: {
      crossExamStrategy: [
        {
          witnessName: 'Prof. Dr. Ir. Bambang Hero Saharjo (Ahli JPU)',
          witnessRole: 'Ahli Penuntut Umum',
          targetedContradiction: 'Metode penentuan titik awal mula api dan asumsi pembakaran untuk pembukaan lahan.',
          trappingQuestions: [
            'Apakah Saudara Ahli memeriksa langsung data citra satelit jam-per-jam pada 20 Agustus 2025 sebelum api masuk batas HGU?',
            'Apakah kelapa sawit di areal terbakar merupakan sawit produktif berbuah umur 8 tahun yang merugikan perusahaan jika terbakar?'
          ],
          expectedTrapGoal: 'Membuktikan bahwa membakar sawit produktif adalah tindakan irasional yang membuktikan ketiadaan motif korporasi.'
        }
      ],
      aDeChargeStrategy: [
        {
          witnessCategory: 'Ahli Forensik Digital / Auditor Finansial',
          testimonyGoal: 'Membuktikan analisis citra satelit dan ketiadaan motif ekonomi pembakaran.',
          keyQuestions: [
            'Bagaimana arah rambat api berdasarkan peta isoterm kebakaran gambut?',
            'Berapa kerugian investasi perusahaan akibat terbakarnya 120 ha sawit berbuah pasir?'
          ]
        }
      ]
    },
    pcaSentencingMatrix: {
      primaryPenaltyRange: 'Ancaman UU PPLH: Denda Korporasi Rp 3 Miliar s/d Rp 15 Miliar.',
      restitutionOrStateLoss: 'Tuntutan Pemulihan Rp 35.800.000.000.',
      assetForfeitureRisk: 'Nihil.',
      restorativeJusticeViability: 'Tidak Memenuhi Syarat',
      mitigatingCircumstances: [
        'Perusahaan telah berinvestasi miliaran rupiah membangun 12 unit sekat kanal dan embung permanen.',
        'Perusahaan secara sukarela telah menanam kembali tanaman revegetasi endemic gambut pasca-insiden.'
      ],
      aggravatingCircumstances: [
        'Dampak kabut asap regional yang sempat mengganggu jadwal penerbangan bandara.'
      ]
    },
    pcaPledoiDossier: {
      pledoiTitle: 'NOTA PEMBELAAN KORPORASI: MENEGAKKAN KEADILAN EKOLOGIS TANPA MENGORBANKAN KORBAN BENCANA KEBAKARAN LIAR',
      defenseTarget: 'Onslag van alle rechtsvervolging (Lepas dari Segala Tuntutan)',
      pledoiText: 'MAJELIS HAKIM YANG MULIA,\\n\\nPeristiwa ini adalah bencana alam kebakaran liar yang melompati konsesi perusahaan saat kemarau El Nino terparah dalam dua dekade. Perusahaan adalah korban yang telah mengerahkan seluruh daya upaya pemadaman. Menghukum pihak yang telah berupaya maksimal memadamkan api akan mematikan motivasi pencegahan bencana. Kami memohon Terdakwa dinyatakan LEPAS DARI SEGALA TUNTUTAN HUKUM (Onslag van alle rechtsvervolging).'
    }
  },
  {
    id: 'case-pca-004',
    title: 'Dugaan Pidana Perpajakan Penerbitan Faktur Pajak Fiktif / TBTS vs Ditjen Pajak & Kejari Kota Bekasi',
    refNumber: 'TRX/2026/CRM-137',
    client: 'Suryadi Tanuwidjaja (Komisaris PT Logam Mulia Abadi / Terdakwa)',
    opposingParty: 'PPNS Kanwil Ditjen Pajak Jawa Barat II & JPU Kejaksaan Negeri Kota Bekasi',
    methodology: 'PCA',
    caseType: 'Tindak Pidana Perpajakan & Kepabeanan',
    jurisdiction: 'Indonesia',
    courtForum: 'Pengadilan Negeri Kota Bekasi',
    owner: 'Adv. Meliala Imran, S.H., LL.M.',
    reviewer: 'Partner Ronald Simanjuntak, S.H., M.H.',
    confidentiality: 'Strictly Confidential',
    proceduralPosition: 'Eksepsi / Keberatan (Pasal 156 KUHAP)',
    status: 'In Review',
    createdAt: '2026-08-05T09:15:00Z',
    updatedAt: '2026-09-29T15:45:00Z',
    currentSOPStage: 'PCA-008',
    summary: 'Perkara dugaan tindak pidana perpajakan Pasal 39A huruf a jo. Pasal 43 ayat (1) UU KUP No. 6/1983 jo. UU No. 7/2021 (UU HPP) atas penerbitan Faktur Pajak yang Tidak Berdasarkan Transaksi Sebenarnya (TBTS) dengan potensi kerugian negara Rp 14,2 Miliar. Terdakwa selaku Komisaris didakwa turut serta menyuruh lakukan. Pembelaan membuktikan Terdakwa adalah komisaris non-eksekutif murni tanpa wewenang operasional (Pasal 114 UU PT), seluruh transaksi pengiriman tembaga didukung Surat Jalan fisik, bukti timbang jembatan, resi kliring Bank BCA, dan telah terjadi pembobolan akun e-Faktur oleh mantan manajer keuangan yang telah menjadi DPO Kepolisian.',
    claimAmount: 'Tuntutan: Pidana Penjara 6 Tahun & Denda 4x Pokok Pajak (Rp 56.800.000.000)',
    incidentDate: '2024-11-15',
    contractDate: '2023-09-01',
    allegedBreachDate: '2025-03-10',
    noticeDate: '2025-10-18',
    lawsuitDate: '2026-05-20',
    parties: [
      {
        id: 'pty-crm4-1',
        name: 'Suryadi Tanuwidjaja',
        type: 'Individual',
        role: 'Terdakwa / Komisaris Non-Eksekutif',
        legalRepresentative: 'TriyLex Tax Crime Defense Practice Group',
        conflictNotes: 'Tidak menjabat sebagai direksi pengelola harian, memegang 20% saham pasif.',
      },
      {
        id: 'pty-crm4-2',
        name: 'Penyidik Pegawai Negeri Sipil (PPNS) Kanwil DJP Jawa Barat II',
        type: 'Government Body',
        role: 'Penyidik Pajak',
        legalRepresentative: 'Direktorat Penegakan Hukum Kantor Pusat Ditjen Pajak',
      },
      {
        id: 'pty-crm4-3',
        name: 'Jaksa Penuntut Umum Kejaksaan Negeri Kota Bekasi',
        type: 'Government Body',
        role: 'Jaksa Penuntut Umum (JPU)',
        legalRepresentative: 'Seksi Tindak Pidana Khusus Kejari Kota Bekasi',
      },
      {
        id: 'pty-crm4-4',
        name: 'Dr. Nur Hidayat, S.H., M.H., Ak. (Ahli Hukum Acara Pajak)',
        type: 'Individual',
        role: 'Saksi Ahli Perpajakan & Hukum Perseroan',
        legalRepresentative: 'Asosiasi Konsultan Pajak Publik Indonesia',
      }
    ],
    claims: [
      {
        id: 'clm-crm4-1',
        title: 'Dakwaan Tunggal: Pasal 39A huruf a jo. Pasal 43 ayat (1) UU KUP jo. UU No. 7/2021',
        description: 'Menerbitkan dan/atau menggunakan faktur pajak, bukti pemungutan pajak yang tidak berdasarkan transaksi yang sebenarnya.',
        type: 'Surat Dakwaan / Dakwaan Primer',
        claimedAmount: 'Pidana Penjara 6 Tahun & Denda Rp 56.800.000.000',
        legalBasis: 'Pasal 39A huruf a UU KUP jo. UU HPP',
      }
    ],
    timeline: [
      {
        id: 'tm-crm4-1',
        date: '2023-09-01',
        title: 'Penunjukan sebagai Komisaris Independen Pasif',
        description: 'Rapat Umum Pemegang Saham Luar Biasa (RUPSLB) mengangkat Terdakwa sebagai Komisaris tanpa hak otorisasi rekening perseroan.',
        category: 'Contract',
        importance: 'Key',
        documentRef: 'D-TAX-01',
        documentName: 'Akta_RUPSLB_Penetapan_Komisaris_PT_LMA.pdf',
        actor: 'Notaris & Pemegang Saham Perseroan',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm4-2',
        date: '2024-11-15',
        title: 'Transaksi Penjualan Bahan Baku Tembaga Riil',
        description: 'Pengiriman 8 kontainer katoda tembaga selesai dikirimkan lengkap dengan delivery order basah dan sertifikat surveyor Sucofindo.',
        category: 'Evidence',
        importance: 'Key',
        documentRef: 'D-TAX-02',
        documentName: 'Surat_Jalan_dan_Sertifikat_Mutu_Sucofindo.pdf',
        actor: 'Divisi Logistik & PT Sucofindo',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm4-3',
        date: '2025-03-10',
        title: 'Pembobolan Sertifikat Elektronik Pajak oleh Staf Keuangan',
        description: 'Oknum manajer keuangan internal memalsukan password enofa dan menerbitkan invoice pajak luar tanpa sepengetahuan direksi.',
        category: 'Breach',
        importance: 'Key',
        documentRef: 'D-TAX-03',
        documentName: 'Laporan_Polisi_Tindak_Pidana_Penggelapan_Karyawan.pdf',
        actor: 'Oknum Mantan Manajer Keuangan (DPO)',
        proceduralStatus: 'Breached / In Mora'
      },
      {
        id: 'tm-crm4-4',
        date: '2025-10-18',
        title: 'Surat Panggilan Pemeriksaan Bukti Permulaan (Bukper) Pajak',
        description: 'Kanwil DJP menerbitkan SP2 Bukper Nomor SP2.Bukper-44/WPJ.09/2025.',
        category: 'Notice',
        importance: 'Supporting',
        documentRef: 'D-TAX-04',
        documentName: 'Surat_Pemberitahuan_Bukper_DJP.pdf',
        actor: 'Penyidik PPNS DJP Jabar II',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm4-5',
        date: '2026-05-20',
        title: 'Pelimpahan Berkas Dakwaan ke Pengadilan Negeri Kota Bekasi',
        description: 'Jaksa Penuntut Umum membacakan dakwaan menuntut Terdakwa selaku pihak yang menyuruh lakukan.',
        category: 'Court',
        importance: 'Key',
        documentRef: 'D-TAX-05',
        documentName: 'Surat_Dakwaan_Pajak_Kejari_Bekasi.pdf',
        actor: 'JPU Kejari Kota Bekasi',
        proceduralStatus: 'Pending Court Action'
      }
    ],
    facts: [
      {
        id: 'f-crm4-1',
        statement: 'Terdakwa tidak pernah menandatangani e-Faktur dan tidak pernah menerima pembagian deviden dari faktur yang dipersoalkan.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-TAX-01', 'D-TAX-03'],
        tags: ['Ketiadaan Peran Pelaku', 'Bukan Penanggung Pajak Riil'],
        verified: true,
        confidence: 'High',
      },
      {
        id: 'f-crm4-2',
        statement: 'Transaksi jual beli tembaga bernilai Rp 142 miliar memiliki arus fisik barang yang diverifikasi oleh surveyor independen PT Sucofindo.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-TAX-02'],
        tags: ['Transaksi Riil', 'Bukan Faktur TBTS Fiktif'],
        verified: true,
        confidence: 'High',
      }
    ],
    evidenceMatrix: [
      {
        evidenceId: 'ev-crm4-1',
        name: 'Sertifikat Verifikasi Arus Barang & Resi Timbangan Jembatan Sucofindo',
        type: 'Surat/Akta Otentik',
        supportsFactId: 'f-crm4-2',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-TAX-02',
        notes: 'Bukti mutlak bahwa barang benar-benar dikirimkan dan bukan faktur terbang.'
      },
      {
        evidenceId: 'ev-crm4-2',
        name: 'Surat Tanda Terima Laporan Polisi Pembobolan Akun Enofa No. LP/B/992/III/2025/SPKT',
        type: 'Surat / Dokumen Resmi (184 ayat 1c)',
        supportsFactId: 'f-crm4-1',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-TAX-03',
        notes: 'Bukti bahwa Terdakwa adalah pelapor korban pembajakan akun pajak oleh pihak ketiga.'
      }
    ],
    evidenceGaps: [
      {
        id: 'eg-crm4-1',
        description: 'Keterangan BAP saksi oknum staf keuangan yang melarikan diri belum dapat dihadirkan di persidangan.',
        impact: 'High',
        recommendation: 'Meminta bantuan Kejaksaan dan Kepolisian untuk melacak keberadaan DPO sebagai saksi mahkota kunci.',
        status: 'Open',
      }
    ],
    statutes: [
      {
        articleId: 'st-crm4-1',
        code: 'UU No. 6 Tahun 1983 jo. UU No. 7 Tahun 2021 (UU HPP)',
        article: 'Pasal 39A huruf a jo. Pasal 43 ayat (1)',
        title: 'Faktur Pajak Tidak Berdasarkan Transaksi Sebenarnya',
        verbatimText: 'Setiap orang yang dengan sengaja menerbitkan dan/atau menggunakan faktur pajak yang tidak berdasarkan transaksi yang sebenarnya dipidana dengan pidana penjara paling singkat 2 tahun.',
        relevanceScore: 0.98,
        benchmarkNotes: 'Mensyaratkan unsur kesengajaan penuh (opzet) dan peran nyata dalam pengelolaan.'
      },
      {
        articleId: 'st-crm4-2',
        code: 'UU No. 40 Tahun 2007 tentang Perseroan Terbatas',
        article: 'Pasal 114 ayat (1) dan (5)',
        title: 'Tanggung Jawab Dewan Komisaris',
        verbatimText: 'Dewan Komisaris melakukan pengawasan atas kebijakan pengurusan dan tidak bertanggung jawab atas kerugian jika telah melakukan pengawasan dengan itikad baik.',
        relevanceScore: 0.92,
        benchmarkNotes: 'Perlindungan hukum bagi komisaris non-aktif.'
      }
    ],
    riskMatrix: {
      legalExposure: 'High',
      evidenceStrength: 'Strong',
      contradictionRisk: 'Low',
      temporalRisk: 'Low',
      proceduralRisk: 'Medium',
      researchDependency: 'Medium',
      analyticalConfidence: 'High',
      summaryNotes: 'Dokumen arus fisik barang (Sucofindo) dan bukti transfer perbankan menghancurkan premis utama jaksa bahwa transaksi tersebut fiktif/TBTS.'
    },
    strategyPlan: {
      primaryObjective: 'Putusan Bebas Murni (Vrijspraak) karena Terbukti Transaksi Nyata dan Ketiadaan Kesalahan Komisaris',
      settlementThreshold: 'Penerapan Pasal 44B UU KUP (Penghentian Penuntutan Demi Kepentingan Penerimaan Negara) jika diperlukan',
      proceduralRoadmap: [
        'Pengajuan Eksepsi Obscuur Libel atas Ketidakcermatan Jaksa Mencampuradukkan Peran Komisaris dan Direksi',
        'Pemeriksaan Saksi Ahli Auditor Sucofindo dan Ahli Perpajakan UI',
        'Pembuktian Rekening Koran Bank Mandiri & BCA Kliring Sistem BI-RTGS',
        'Penyusunan Pledoi Pembelaan Berbasis Prinsip Geen Straf Zonder Schuld'
      ],
      fallbackPlan: 'Manfaatkan fasilitas ultimum remedium Pasal 44B UU HPP dengan pelunasan pokok pajak tanpa pidana badan.'
    },
    quantumCalculation: {
      totalClaimed: 56800000000,
      totalProven: 0,
      gapAmount: 56800000000,
      interestCalculated: 0,
      breakdown: [
        {
          id: 'q-crm4-1',
          category: 'Kerugian Pokok (Materil)',
          description: 'Tuntutan denda pidana 4x nilai faktur yang dipersoalkan',
          claimedAmount: 56800000000,
          provenAmount: 0,
          legalBasis: 'Pasal 39A UU KUP jo. UU HPP',
          evidenceRef: 'D-TAX-05',
          status: 'Partially Documented'
        }
      ]
    },
    documents: [
      {
        id: 'D-TAX-01',
        name: 'Akta_RUPSLB_Penetapan_Komisaris_PT_LMA.pdf',
        size: '3.1 MB',
        fileType: 'PDF',
        uploadDate: '2026-08-05T09:30:00Z',
        status: 'Ready for analysis',
        category: 'Akta Notaris',
        pageCount: 22,
        ocrQuality: 'High (99%)',
        ocrConfidence: 0.99,
        extractedText: 'AKTA NOTARIS NOMOR 18 TENTANG PERUBAHAN ANGGARAN DASAR DAN SUSUNAN PENGURUS: Menyatakan bahwa pengurusan sehari-hari sepenuhnya berada pada Direktur Utama.',
        hash: 'sha256-a9918237bafe00192384719283719283',
        piiRedacted: true
      },
      {
        id: 'D-TAX-02',
        name: 'Surat_Jalan_dan_Sertifikat_Mutu_Sucofindo.pdf',
        size: '12.4 MB',
        fileType: 'PDF',
        uploadDate: '2026-08-05T09:45:00Z',
        status: 'Ready for analysis',
        category: 'Kontrak/Perjanjian',
        pageCount: 88,
        ocrQuality: 'High (98%)',
        ocrConfidence: 0.98,
        extractedText: 'PT SUCOFINDO (PERSERO) CERTIFICATE OF SAMPLING AND ANALYSIS: Menyatakan bahwa komoditas tembaga murni dengan total berat 184.220 kg telah diperiksa dan dikirimkan.',
        hash: 'sha256-bc901823901823901823901823901823',
        piiRedacted: true
      }
    ],
    comments: [],
    completedSOPStages: ['PCA-001', 'PCA-002', 'PCA-003', 'PCA-004', 'PCA-005', 'PCA-006', 'PCA-007', 'PCA-008'],
    pcaDueProcessAudit: {
      suratTugasSpdpValid: true,
      spdpDeliveredOnTime: true,
      twoValidEvidenceAvailable: false,
      warrantHasClearLocusTempus: true,
      seizureApproval: {
        hasCourtPermit: true,
        emergencyProtocolValid: true,
        notes: 'Penyitaan dokumen pembukuan berizin pengadilan.'
      },
      legalCounselRight: {
        article56Compliant: true,
        bapAccompanied: true,
        notes: 'Pemeriksaan didampingi kuasa hukum.'
      },
      praperadilanViability: 'Cukup Beralasan (Moderate)',
      praperadilanArguments: [
        'Penetapan Tersangka tidak mempertimbangkan pemenuhan kewajiban kepatuhan pajak formal.'
      ]
    },
    pcaElementsDeconstruction: {
      indictmentArticle: 'Pasal 39A huruf a UU KUP jo. Pasal 55 KUHP',
      penalSystemComparison: {
        wvsOldArticle: 'Pasal 263 KUHP (Pemalsuan Surat)',
        kuhpNewUU12023Article: 'Pasal 391 UU No. 1/2023',
        specialLawArticle: 'Pasal 39A UU No. 7/2021',
        transitionPrinciple: 'Lex Favor Reo'
      },
      objectiveElements: [
        {
          element: 'Menerbitkan faktur pajak tidak berdasarkan transaksi sebenarnya',
          fulfillment: 'Tidak Terpenuhi',
          analysis: 'Arus fisik barang dan arus uang terbukti 100% nyata melalui bukti uji Sucofindo dan kliring BI.',
          supportingEvidence: ['Sertifikat Sucofindo', 'Rekening Koran BCA']
        }
      ],
      subjectiveElements: [
        {
          element: 'Dengan sengaja',
          fulfillment: 'Tidak Terpenuhi',
          analysis: 'Terdakwa tidak mengetahui penyalahgunaan akun enofa oleh karyawan nakal.',
          supportingEvidence: ['Laporan Polisi Penipuan Karyawan']
        }
      ],
      causalityAnalysis: 'Tidak ada kerugian negara karena PPN terutang telah disetor oleh pembeli akhir.'
    },
    pcaWitnessMatrix: {
      crossExamStrategy: [
        {
          witnessName: 'Drs. Hendro Wibowo (Pemeriksa Pajak Madya DJP)',
          witnessRole: 'Ahli Penuntut Umum',
          targetedContradiction: 'Metode pengujian arus barang yang hanya memeriksa sampling invoice tanpa memeriksa gudang fisik.',
          trappingQuestions: [
            'Apakah Saudara pemeriksa pernah melakukan verifikasi fisik ke pabrik peleburan tembaga PT Sucofindo?',
            'Apakah Saudara menemukan satu rupiah pun uang kompensasi faktur yang masuk ke kantong pribadi Terdakwa?'
          ],
          expectedTrapGoal: 'Memaksa saksi ahli mengakui bahwa pemeriksa pajak hanya melakukan audit desktop tanpa verifikasi faktual di lapangan.'
        }
      ],
      aDeChargeStrategy: [
        {
          witnessCategory: 'Ahli Forensik Digital / Auditor Finansial',
          testimonyGoal: 'Menerangkan perbedaan tanggung jawab hukum komisaris non-eksekutif dan keabsahan dokumen e-Faktur.',
          keyQuestions: [
            'Apakah menurut UU PT seorang komisaris bertanggung jawab atas perbuatan pidana yang dilakukan oleh staf operasional?',
            'Bagaimana status hukum faktur pajak jika transaksi fisik barang terbukti sah melalui surveyor negara?'
          ]
        }
      ]
    },
    pcaSentencingMatrix: {
      primaryPenaltyRange: 'Tuntutan JPU 6 Tahun Penjara & Denda Rp 56,8 Miliar. Target: Bebas Murni.',
      restitutionOrStateLoss: 'Nihil karena pajak telah disetor.',
      assetForfeitureRisk: 'Nihil.',
      restorativeJusticeViability: 'Memenuhi Syarat (RJ Eligible)',
      mitigatingCircumstances: [
        'Terdakwa adalah pembayar pajak teladan selama 30 tahun dan tidak pernah memiliki catatan pidana.',
        'Usia terdakwa telah memasuki 68 tahun dengan riwayat sakit jantung.'
      ],
      aggravatingCircumstances: [
        'Target penerimaan pajak negara yang ketat pada tahun anggaran berjalan.'
      ]
    },
    pcaPledoiDossier: {
      pledoiTitle: 'NOTA PEMBELAAN: TRANSAKSI NYATA BUKAN TINDAK PIDANA, JANGAN MENGORBANKAN KOMISARIS YANG BERIKTIKAD BAIK',
      defenseTarget: 'Vrijspraak (Bebas Murni)',
      pledoiText: 'MAJELIS HAKIM YANG MULIA,\\n\\nKetika barang nyata dikirimkan, ketika timbangan resmi pabrik mencatat berat ratusan ton, dan ketika uang dibayarkan melalui perbankan nasional, maka mendakwa transaksi tersebut fiktif adalah kekeliruan nyata yang bertentangan dengan akal sehat dan hukum. Terdakwa adalah komisaris yang beritikad baik. Bebaskan Terdakwa dari segala tuntutan!'
    }
  },
  {
    id: 'case-pca-005',
    title: 'Dugaan Kelalaian Tenaga Medis Operasi Elektif Pasien (Pasal 359 KUHP jo. UU Kesehatan 17/2023) vs Polda Metro Jaya',
    refNumber: 'TRX/2026/CRM-219',
    client: 'dr. Sarah Natasha, Sp.An-TI, Subsp.IC(K) (Dokter Spesialis Anestesi / Terdakwa)',
    opposingParty: 'Subdit Renakta Ditreskrimum Polda Metro Jaya & JPU Kejati DKI Jakarta',
    methodology: 'PCA',
    caseType: 'Tindak Pidana Umum (KUHP: Penipuan, Penggelapan, Pemalsuan Surat)',
    jurisdiction: 'Indonesia',
    courtForum: 'Pengadilan Negeri Jakarta Barat',
    owner: 'Adv. Meliala Imran, S.H., LL.M.',
    reviewer: 'Senior Partner Hendra Wijaya, S.H.',
    confidentiality: 'Highly Confidential',
    proceduralPosition: 'Pembacaan Surat Dakwaan (Pasal 143 KUHAP)',
    status: 'Ready for Analysis',
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-10-01T10:20:00Z',
    currentSOPStage: 'PCA-001',
    summary: 'Perkara dugaan tindak pidana kelalaian medis yang mengakibatkan kematian pasien Pasal 359 KUHP jo. Pasal 440 ayat (1) UU No. 17/2023 tentang Kesehatan pada tindakan pembedahan elektif laparoskopi. Pasien mengalami henti jantung saat induksi obat anestesi. Pembelaan membuktikan ketiadaan culpa lata (kelalaian berat), seluruh tindakan telah 100% lege artis memenuhi SOP Perdatin, keluarga pasien merahasiakan riwayat defisiensi Pseudocholinesterase bawaan dan konsumsi suplemen herbal tidak terdaftar dalam lembar Informed Consent Pra-Bedah, serta rekomendasi Majelis Kehormatan Disiplin Kedokteran (MKDKI) yang menyatakan tindakan dokter bebas dari pelanggaran disiplin profesi.',
    claimAmount: 'Tuntutan: Pidana Penjara 3 Tahun 6 Bulan & Rekomendasi Pencabutan Izin Praktik SIP 5 Tahun',
    incidentDate: '2025-12-10',
    contractDate: '2025-12-09',
    allegedBreachDate: '2025-12-10',
    noticeDate: '2026-03-15',
    lawsuitDate: '2026-07-22',
    parties: [
      {
        id: 'pty-crm5-1',
        name: 'dr. Sarah Natasha, Sp.An-TI, Subsp.IC(K)',
        type: 'Individual',
        role: 'Terdakwa / Dokter Spesialis Anestesi',
        legalRepresentative: 'TriyLex Medical Malpractice & Health Defense Practice Group',
        conflictNotes: 'Dokter spesialis senior dengan rekam jejak lebih dari 12 tahun tanpa catatan malpraktik.',
      },
      {
        id: 'pty-crm5-2',
        name: 'Subdit Renakta Ditreskrimum Polda Metro Jaya',
        type: 'Government Body',
        role: 'Penyidik Kepolisian',
        legalRepresentative: 'Bidkum Polda Metro Jaya',
      },
      {
        id: 'pty-crm5-3',
        name: 'Keluarga Pasien Alm. Cynthia Dewi (Pelapor)',
        type: 'Individual',
        role: 'Saksi Pelapor / Korban',
        legalRepresentative: 'Kuasa Hukum Keluarga Korban',
      },
      {
        id: 'pty-crm5-4',
        name: 'Prof. Dr. dr. Eddy Rahardjo, Sp.An-KIC (Ketua Kehormatan Etik Anestesiologi)',
        type: 'Individual',
        role: 'Saksi Ahli Medis Perdatin & Konsil Kedokteran',
        legalRepresentative: 'Majelis Disiplin Profesi Tenaga Medis Indonesia (MKDKI)',
      }
    ],
    claims: [
      {
        id: 'clm-crm5-1',
        title: 'Dakwaan Primer: Pasal 359 KUHP',
        description: 'Barangsiapa karena kesalahannya (kealpaannya) menyebabkan orang lain mati.',
        type: 'Surat Dakwaan / Dakwaan Primer',
        claimedAmount: 'Pidana Penjara 3 Tahun 6 Bulan',
        legalBasis: 'Pasal 359 Kitab Undang-Undang Hukum Pidana',
      },
      {
        id: 'clm-crm5-2',
        title: 'Dakwaan Subsidair: Pasal 440 ayat (1) UU No. 17 Tahun 2023 tentang Kesehatan',
        description: 'Setiap Tenaga Medis yang melakukan kealpaan berat yang mengakibatkan kematian pasien.',
        type: 'Dakwaan Subsidair',
        claimedAmount: 'Pidana Penjara 3 Tahun & Pencabutan Surat Izin Praktik (SIP)',
        legalBasis: 'Pasal 440 ayat (1) UU No. 17/2023',
      }
    ],
    timeline: [
      {
        id: 'tm-crm5-1',
        date: '2025-12-09',
        title: 'Pemeriksaan Pra-Anestesi & Penandatanganan Informed Consent',
        description: 'dr. Sarah memeriksa kondisi tanda vital pasien dan menyerahkan kuesioner alergi obat, di mana keluarga menyatakan pasien tidak memiliki riwayat alergi maupun kelainan genetik.',
        category: 'Contract',
        importance: 'Key',
        documentRef: 'D-MED-01',
        documentName: 'Formulir_Informed_Consent_dan_Asesmen_Pra_Anestesi.pdf',
        actor: 'dr. Sarah Natasha & Pasien',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm5-2',
        date: '2025-12-10',
        title: 'Tindakan Induksi Anestesi di Kamar Operasi Sesuai SOP',
        description: 'Pemberian obat induksi Propofol dan Rocuronium dilakukan sesuai dosis kalkulasi berat badan dan dimonitor mesin anestesi canggih.',
        category: 'Evidence',
        importance: 'Key',
        documentRef: 'D-MED-02',
        documentName: 'Rekam_Medis_Anestesi_dan_Log_Monitor_Vital.pdf',
        actor: 'Tim Anestesi Kamar Bedah',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm5-3',
        date: '2025-12-10',
        title: 'Terjadinya Spasme Bronkus Akut & Tindakan Resusitasi Jantung Paru (RJP)',
        description: 'Pasien mendadak mengalami reaksi anafilaksis dan spasme laring refrakter. Tim melakukan protokol resusitasi ACLS selama 45 menit tanpa henti.',
        category: 'Breach',
        importance: 'Key',
        documentRef: 'D-MED-03',
        documentName: 'Berita_Acara_Resusitasi_Jantung_Paru_Code_Blue.pdf',
        actor: 'Tim Medis Code Blue RS',
        proceduralStatus: 'Breached / In Mora'
      },
      {
        id: 'tm-crm5-4',
        date: '2026-03-15',
        title: 'Putusan Majelis Kehormatan Disiplin Kedokteran Indonesia (MKDKI)',
        description: 'MKDKI mengeluarkan putusan resmi nomor 04/MKDKI/2026 yang menyatakan dr. Sarah bertindak lege artis dan bebas dari pelanggaran disiplin.',
        category: 'Notice',
        importance: 'Key',
        documentRef: 'D-MED-04',
        documentName: 'Salinan_Putusan_Sidang_Etik_MKDKI.pdf',
        actor: 'Majelis Kehormatan Disiplin Kedokteran (MKDKI)',
        proceduralStatus: 'Compliant / On-Time'
      },
      {
        id: 'tm-crm5-5',
        date: '2026-07-22',
        title: 'Pelimpahan Berkas Perkara ke Pengadilan Negeri Jakarta Barat',
        description: 'Jaksa Penuntut Umum membacakan surat dakwaan dengan mengabaikan rekomendasi MKDKI dan Pasal 306 UU Kesehatan 2023.',
        category: 'Court',
        importance: 'Key',
        documentRef: 'D-MED-05',
        documentName: 'Surat_Dakwaan_Kejati_DKI_Malpraktik.pdf',
        actor: 'Kejaksaan Tinggi DKI Jakarta',
        proceduralStatus: 'Pending Court Action'
      }
    ],
    facts: [
      {
        id: 'f-crm5-1',
        statement: 'Tindakan medis yang dilakukan Terdakwa telah 100% mematuhi Standar Pelayanan Profesi (SPP) dan SOP Perhimpunan Dokter Spesialis Anestesiologi (Perdatin).',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-MED-02', 'D-MED-04'],
        tags: ['Tindakan Lege Artis', 'Ketiadaan Culpa Lata'],
        verified: true,
        confidence: 'High',
      },
      {
        id: 'f-crm5-2',
        statement: 'Keluarga pasien menyembunyikan riwayat konsumsi suplemen herbal penurun nafsu makan tidak berizin BPOM yang mengandung zat pemicu aritmia jantung.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-MED-01'],
        tags: ['Informed Consent Cacat dari Pasien', 'Faktor Resiko Tersembunyi'],
        verified: true,
        confidence: 'High',
      },
      {
        id: 'f-crm5-3',
        statement: 'Penuntut Umum melanggar Pasal 306 ayat (3) UU No. 17/2023 yang mewajibkan penyidikan dugaan kelalaian medis mendengarkan rekomendasi majelis disiplin terlebih dahulu.',
        status: 'Established',
        relevanceScore: 'High',
        sourceDocIds: ['D-MED-04', 'D-MED-05'],
        tags: ['Cacat Prosedur Formil', 'Pelanggaran UU Kesehatan 2023'],
        verified: true,
        confidence: 'High',
      }
    ],
    evidenceMatrix: [
      {
        evidenceId: 'ev-crm5-1',
        name: 'Lembar Asesmen Pra-Bedah & Informed Consent Tertulis Asli',
        type: 'Surat/Akta Otentik',
        supportsFactId: 'f-crm5-2',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-MED-01',
        notes: 'Bukti bahwa pasien tidak mencantumkan konsumsi suplemen herbal berisiko.'
      },
      {
        evidenceId: 'ev-crm5-2',
        name: 'Salinan Resmi Putusan Sidang Mahkamah Disiplin Tenaga Medis (MKDKI)',
        type: 'Putusan/Dokumen Pengadilan',
        supportsFactId: 'f-crm5-1',
        reliability: 'High',
        isDirect: true,
        corroborationStatus: 'Corroborated',
        documentRef: 'D-MED-04',
        notes: 'Putusan lembaga resmi penilai etik dokter yang membebaskan dokter dari kelalaian profesi.'
      }
    ],
    evidenceGaps: [],
    statutes: [
      {
        articleId: 'st-crm5-1',
        code: 'UU No. 17 Tahun 2023 tentang Kesehatan',
        article: 'Pasal 306 & Pasal 440',
        title: 'Perlindungan Hukum Tenaga Medis & Standar Kealpaan Berat',
        verbatimText: 'Tenaga Medis yang melaksanakan pelayanan kesehatan sesuai dengan standar profesi, standar pelayanan, dan standar prosedur operasional berhak mendapatkan pelindungan hukum.',
        relevanceScore: 0.99,
        benchmarkNotes: 'Ketentuan lex specialis terbaru yang melindungi dokter yang bertindak lege artis.'
      },
      {
        articleId: 'st-crm5-2',
        code: 'KUHP',
        article: 'Pasal 359',
        title: 'Kealpaan yang Menyebabkan Kematian',
        verbatimText: 'Barang siapa karena kesalahannya (kealpaannya) menyebabkan orang lain mati diancam dengan pidana penjara paling lama lima tahun.',
        relevanceScore: 0.90,
        benchmarkNotes: 'Harus diartikan sebagai kealpaan berat (gross negligence / culpa lata), bukan risiko medis murni.'
      }
    ],
    riskMatrix: {
      legalExposure: 'Medium',
      evidenceStrength: 'Strong',
      contradictionRisk: 'Low',
      temporalRisk: 'Low',
      proceduralRisk: 'Critical',
      researchDependency: 'Medium',
      analyticalConfidence: 'High',
      summaryNotes: 'Peluang bebas murni sangat tinggi berkat keberadaan Putusan MKDKI dan dasar hukum Pasal 306 UU Kesehatan No. 17/2023.'
    },
    strategyPlan: {
      primaryObjective: 'Putusan Bebas Murni (Vrijspraak) & Pemulihan Nama Baik Serta Kehormatan Profesi Dokter',
      settlementThreshold: 'Pemberhentian Penuntutan / Penghentian Perkara demi Keadilan Restoratif (Pasal 306 ayat 4 UU 17/2023)',
      proceduralRoadmap: [
        'Pengajuan Eksepsi Surat Dakwaan Prematur Melanggar Mekanisme Sidang Disiplin MKDKI',
        'Pemeriksaan Saksi Ahli Anestesiologi Konsultan Intensive Care Universitas Indonesia',
        'Demonstrasi Grafis Log Monitor Tanda Vital Mesin Anestesi Digital',
        'Penyampaian Nota Pembelaan (Pledoi) Menolak Kriminalisasi Risiko Medis (Medical Accident)'
      ],
      fallbackPlan: 'Mendorong pendekatan restorative justice medis dengan santunan asuransi tanggung gugat profesi medis (medical indemnity insurance).'
    },
    quantumCalculation: {
      totalClaimed: 0,
      totalProven: 0,
      gapAmount: 0,
      interestCalculated: 0,
      breakdown: []
    },
    documents: [
      {
        id: 'D-MED-01',
        name: 'Formulir_Informed_Consent_dan_Asesmen_Pra_Anestesi.pdf',
        size: '1.8 MB',
        fileType: 'PDF',
        uploadDate: '2026-08-25T11:15:00Z',
        status: 'Ready for analysis',
        category: 'Kontrak/Perjanjian',
        pageCount: 12,
        ocrQuality: 'High (99%)',
        ocrConfidence: 0.99,
        extractedText: 'FORMULIR PERSETUJUAN TINDAKAN MEDIS (INFORMED CONSENT) ANESTESI UMUM: Pasien dan keluarga menyatakan tidak memiliki alergi makanan, obat, ataupun kelainan darah.',
        hash: 'sha256-d8819283710928301928301928301928',
        piiRedacted: true
      },
      {
        id: 'D-MED-04',
        name: 'Salinan_Putusan_Sidang_Etik_MKDKI.pdf',
        size: '4.5 MB',
        fileType: 'PDF',
        uploadDate: '2026-08-25T11:30:00Z',
        status: 'Ready for analysis',
        category: 'Putusan/Dokumen Pengadilan',
        pageCount: 28,
        ocrQuality: 'High (98%)',
        ocrConfidence: 0.98,
        extractedText: 'MAJELIS KEHORMATAN DISIPLIN KEDOKTERAN INDONESIA: Menimbang bahwa Teradu telah melakukan tindakan asesmen dan resusitasi sesuai standar profesi tertinggi, Teradu dinyatakan TIDAK BERSALAH melakukan pelanggaran disiplin.',
        hash: 'sha256-c7719283019283019283019283019283',
        piiRedacted: true
      }
    ],
    comments: [],
    completedSOPStages: ['PCA-001'],
    pcaDueProcessAudit: {
      suratTugasSpdpValid: true,
      spdpDeliveredOnTime: true,
      twoValidEvidenceAvailable: false,
      warrantHasClearLocusTempus: true,
      seizureApproval: {
        hasCourtPermit: true,
        emergencyProtocolValid: true,
        notes: 'Penyitaan rekam medis telah berizin pengadilan.'
      },
      legalCounselRight: {
        article56Compliant: true,
        bapAccompanied: true,
        notes: 'Didampingi kuasa hukum dan Biro Hukum IDI.'
      },
      praperadilanViability: 'Sangat Tinggi (Strong)',
      praperadilanArguments: [
        'Pelanggaran Pasal 306 ayat (3) UU No. 17/2023 yang mensyaratkan persetujuan majelis disiplin sebelum penyidikan pidana.'
      ]
    },
    pcaElementsDeconstruction: {
      indictmentArticle: 'Pasal 359 KUHP jo. Pasal 440 UU Kesehatan No. 17/2023',
      penalSystemComparison: {
        wvsOldArticle: 'Pasal 359 KUHP (Kealpaan yang Menyebabkan Mati)',
        kuhpNewUU12023Article: 'Pasal 474 ayat (3) UU No. 1/2023',
        specialLawArticle: 'Pasal 440 UU Kesehatan No. 17/2023',
        transitionPrinciple: 'Lex Specialis Derogat Legi Generali'
      },
      objectiveElements: [
        {
          element: 'Karena kealpaannya menyebabkan orang lain mati',
          fulfillment: 'Tidak Terpenuhi',
          analysis: 'Bukan timbul dari kelalaian (culpa), melainkan kecelakaan medis (medical accident) tak terduga akibat respon anafilaksis langka.',
          supportingEvidence: ['Putusan MKDKI', 'Rekam Medis Monitor Anestesi']
        }
      ],
      subjectiveElements: [
        {
          element: 'Kealpaan Berat (Culpa Lata / Gross Negligence)',
          fulfillment: 'Tidak Terpenuhi',
          analysis: 'Tindakan telah mematuhi 100% SOP Perdatin dan melakukan protokol RJP standar ACLS.',
          supportingEvidence: ['SOP Perdatin 2024', 'Berita Acara Code Blue']
        }
      ],
      causalityAnalysis: 'Penyebab henti jantung dipicu oleh interaksi zat kimia herbal yang disembunyikan keluarga pasien.'
    },
    pcaWitnessMatrix: {
      crossExamStrategy: [
        {
          witnessName: 'dr. Anton Wijaya, Sp.F (Dokter Forensik Autopsi Klinis)',
          witnessRole: 'Ahli Penuntut Umum',
          targetedContradiction: 'Hasil autopsi yang tidak dapat membedakan antara syok anafilaksis dan over-dosis.',
          trappingQuestions: [
            'Apakah Saudara Ahli menemukan tanda-tanda edema laring yang merupakan ciri khas reaksi alergi fatal?',
            'Apakah konsentrasi obat dalam darah pasien berada pada rentang batas terapeutik normal?'
          ],
          expectedTrapGoal: 'Mengonfirmasi bahwa kadar obat anestesi normal dan kematian diakibatkan oleh reaksi anafilaktoid yang tidak dapat diuji sebelumnya.'
        }
      ],
      aDeChargeStrategy: [
        {
          witnessCategory: 'Ahli Forensik Digital / Auditor Finansial',
          testimonyGoal: 'Menerangkan bahwa spasme laring refrakter adalah risiko medis yang tidak dapat diprediksi.',
          keyQuestions: [
            'Apakah uji alergi rutin (skin test) diwajibkan untuk obat anestesi propofol?',
            'Bagaimana prosedur resusitasi yang tepat jika terjadi henti jantung mendadak di meja operasi?'
          ]
        }
      ]
    },
    pcaSentencingMatrix: {
      primaryPenaltyRange: 'Tuntutan JPU 3 Tahun 6 Bulan Penjara. Target: Bebas Murni (Vrijspraak).',
      restitutionOrStateLoss: 'Nihil.',
      assetForfeitureRisk: 'Nihil.',
      restorativeJusticeViability: 'Memenuhi Syarat (RJ Eligible)',
      mitigatingCircumstances: [
        'Terdakwa telah berjuang selama 45 menit melakukan resusitasi tanpa henti untuk menyelamatkan pasien.',
        'Terdakwa belum pernah dijatuhi sanksi etik ataupun hukum selama bertugas sebagai dokter.'
      ],
      aggravatingCircumstances: [
        'Duka mendalam keluarga korban yang kehilangan anggota keluarga usia produktif.'
      ]
    },
    pcaPledoiDossier: {
      pledoiTitle: 'NOTA PEMBELAAN: JANGAN MENGKRIMINALISASI RESIKO MEDIS, DOKTER BUKAN TUHAN YANG BISA MENJAMIN KESEMBUHAN MUTLAK',
      defenseTarget: 'Vrijspraak (Bebas Murni)',
      pledoiText: 'MAJELIS HAKIM YANG MULIA,\\n\\nDalam dunia medis, dokter berikhtiar dengan standar ilmu terbaik (inspanningsverbintenis), bukan menjamin hasil akhir (resultaatsverbintenis). Dokter Sarah telah berjuang menyelamatkan pasien sesuai seluruh SOP yang ada. Menghukum dokter atas reaksi anafilaktik yang tak terduga akan menciptakan defensive medicine yang merugikan jutaan pasien di Indonesia. Kami memohon Terdakwa diputus BEBAS MURNI!'
    }
  }
];
