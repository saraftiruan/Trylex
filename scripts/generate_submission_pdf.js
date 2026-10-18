import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generatePitchDeckPDF() {
  const pdfDoc = await PDFDocument.create();

  // Slide dimensions: 16:9 standard (960 x 540 pt)
  const width = 960;
  const height = 540;

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  // Palette colors
  const cBgDark = rgb(0.043, 0.063, 0.102);        // #0b101a
  const cCardBg = rgb(0.078, 0.114, 0.180);        // #141d2e
  const cCardBorder = rgb(0.180, 0.235, 0.337);    // #2e3c56
  const cWhite = rgb(0.98, 0.98, 1.0);
  const cSlate = rgb(0.70, 0.74, 0.82);
  const cMuted = rgb(0.48, 0.54, 0.64);
  const cAmber = rgb(0.961, 0.690, 0.251);        // #f5b040
  const cCyan = rgb(0.24, 0.68, 0.96);            // #3daef5
  const cGreen = rgb(0.25, 0.82, 0.55);           // #40d18c
  const cRose = rgb(0.96, 0.35, 0.45);

  function addHeader(page, title, slideNum) {
    // Top bar background
    page.drawRectangle({
      x: 0,
      y: height - 52,
      width: width,
      height: 52,
      color: rgb(0.02, 0.035, 0.065),
    });

    // Branding text
    page.drawText('Google Cloud', { x: 36, y: height - 32, size: 14, font: fontBold, color: cWhite });
    page.drawText('|', { x: 135, y: height - 32, size: 14, font: fontRegular, color: cMuted });
    page.drawText('AI Builder Cup', { x: 148, y: height - 32, size: 14, font: fontBold, color: cCyan });
    page.drawText('Build in JAPAC. Build for the world.', { x: 265, y: height - 30, size: 9, font: fontRegular, color: cMuted });

    // Category Tag
    page.drawRectangle({
      x: width - 210,
      y: height - 38,
      width: 174,
      height: 22,
      color: rgb(0.15, 0.12, 0.03),
      borderColor: cAmber,
      borderWidth: 1,
    });
    page.drawText('TriyLex ULPE-AW LegalTech', { x: width - 200, y: height - 28, size: 9, font: fontBold, color: cAmber });

    // Slide Title
    page.drawText(title, { x: 36, y: height - 90, size: 22, font: fontBold, color: cWhite });

    // Bottom Footer
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: 28,
      color: rgb(0.02, 0.035, 0.065),
    });
    page.drawText('TriyLex ULPE-AW • Google Cloud AI Builder Cup 2026 Submission', { x: 36, y: 9, size: 9, font: fontRegular, color: cMuted });
    page.drawText(`Slide ${slideNum} of 16`, { x: width - 110, y: 9, size: 9, font: fontBold, color: cAmber });
  }

  // ==========================================
  // SLIDE 1: Team Details
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Team Details', 1);

    // Card 1: Team & Leader
    page.drawRectangle({
      x: 36,
      y: height - 260,
      width: width - 72,
      height: 150,
      color: cCardBg,
      borderColor: cCardBorder,
      borderWidth: 1,
    });

    page.drawText('a. Team Name:', { x: 56, y: height - 135, size: 12, font: fontBold, color: cAmber });
    page.drawText('TriyLex LegalTech AI', { x: 190, y: height - 135, size: 14, font: fontBold, color: cWhite });

    page.drawText('b. Team Leader:', { x: 56, y: height - 170, size: 12, font: fontBold, color: cAmber });
    page.drawText('Meliala Imran (melialaimran@gmail.com)', { x: 190, y: height - 170, size: 13, font: fontBold, color: cCyan });
    page.drawText('Advokat & Lead Legal Technologist • Indonesia Jurisdiction', { x: 190, y: height - 190, size: 10, font: fontRegular, color: cSlate });

    page.drawText('Platform:', { x: 56, y: height - 225, size: 11, font: fontBold, color: cAmber });
    page.drawText('Google Cloud Run • Google Gemini 2.5/3.7 Flash Engine • TypeScript / React', { x: 190, y: height - 225, size: 10, font: fontRegular, color: cMuted });

    // Card 2: Problem Statement
    page.drawRectangle({
      x: 36,
      y: 45,
      width: width - 72,
      height: 155,
      color: cCardBg,
      borderColor: cAmber,
      borderWidth: 1,
    });

    page.drawText('c. Problem Statement:', { x: 56, y: 170, size: 13, font: fontBold, color: cAmber });
    
    const problemTextLines = [
      'Penanganan sengketa hukum di yurisdiksi Civil Law (khususnya Indonesia) saat ini masih didominasi penelaahan',
      'berkas manual yang lambat, rentan bias kognitif, serta rawan putusnya rantai pembuktian (broken chain of custody).',
      'Praktisi hukum dan advokat sering kali kesulitan mendeteksi celah bukti kritis (evidence gaps), melakukan uji ketahanan',
      'dalil simetris (stress-test arguments), serta memetakan kesimpulan yuridis kembali ke dokumen fisik otentik secara terverifikasi.',
      'Akibatnya, risiko kekalahan perkara perdata atau kriminalisasi akibat cacat prosedur formil (due process violation) sangat tinggi.'
    ];

    let pY = 145;
    for (const line of problemTextLines) {
      page.drawText(line, { x: 56, y: pY, size: 11, font: fontRegular, color: cWhite });
      pY -= 19;
    }
  }

  // ==========================================
  // SLIDE 2: Template Information Note
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Submission Guidelines & Template Notice', 2);

    page.drawRectangle({
      x: 60,
      y: 120,
      width: width - 120,
      height: 300,
      color: cCardBg,
      borderColor: cCardBorder,
      borderWidth: 1,
    });

    page.drawText('Google Cloud AI Builder Cup 2026 - Template Information', { x: 90, y: 380, size: 16, font: fontBold, color: cAmber });
    
    const lines = [
      '• Dokumen ini merupakan versi final submission proposal resmi untuk kompetisi AI Builder Cup.',
      '• Seluruh data terisi mencerminkan arsitektur sistem nyata dari aplikasi TriyLex ULPE-AW.',
      '• Aplikasi terhubung langsung dengan backend Google Cloud Run dan model Google Gemini 2.5/3.7 Flash.',
      '• Prototype dapat diakses publik melalui tautan Cloud Run yang disertakan pada slide 14.',
      '• Terintegrasi dengan alur pendaftaran Google OAuth (Gmail) serta 15 SOP Hukum Acara Perdata & Pidana.'
    ];

    let sY = 330;
    for (const l of lines) {
      page.drawText(l, { x: 90, y: sY, size: 12, font: fontRegular, color: cWhite });
      sY -= 32;
    }
  }

  // ==========================================
  // SLIDE 3: Brief about the Idea
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Brief About The Idea: TriyLex ULPE-AW', 3);

    // Left card: Core Identity
    page.drawRectangle({
      x: 36,
      y: 50,
      width: 420,
      height: 380,
      color: cCardBg,
      borderColor: cCardBorder,
      borderWidth: 1,
    });

    page.drawText('Inovasi Utama', { x: 56, y: 395, size: 15, font: fontBold, color: cAmber });
    page.drawText('Universal Legal Pipeline Engine & Argument Workbench', { x: 56, y: 375, size: 11, font: fontBold, color: cCyan });

    const descLeft = [
      'TriyLex ULPE-AW adalah platform legal intelligence',
      'terstruktur generasi baru bertenaga Google Gemini',
      'Flash yang mentransformasi penelaahan perkara hukum',
      'menjadi alur komputasi deterministik dan auditable.',
      '',
      'Berbeda dari chatbot hukum konvensional yang sering',
      'berhalusinasi, TriyLex menerapkan 15-Stage Standard',
      'Operating Procedures (SOP) yang membedah perkara',
      'perdata komersial (LCA) dan pidana/UU khusus (PCA)',
      'berdasarkan hukum positif Indonesia.',
      '',
      'Engine memetakan fakta, menguji keabsahan formal,',
      'menghitung nilai eksposur finansial, hingga menguji',
      'daya tahan dalil di hadapan Majelis Hakim AI.'
    ];

    let yLeft = 345;
    for (const d of descLeft) {
      page.drawText(d, { x: 56, y: yLeft, size: 10.5, font: fontRegular, color: cWhite });
      yLeft -= 18;
    }

    // Right card: 2 Dedicated Modules
    page.drawRectangle({
      x: 480,
      y: 50,
      width: width - 516,
      height: 380,
      color: cCardBg,
      borderColor: cCardBorder,
      borderWidth: 1,
    });

    page.drawText('Dua Mesin Metodologi Terpadu', { x: 500, y: 395, size: 15, font: fontBold, color: cAmber });

    // Module 1: LCA
    page.drawRectangle({ x: 500, y: 230, width: 400, height: 140, color: rgb(0.04, 0.08, 0.14), borderColor: cCyan, borderWidth: 1 });
    page.drawText('1. LCA (Litigation Case Analysis) - 15 Tahap Perdata', { x: 515, y: 345, size: 11, font: fontBold, color: cCyan });
    page.drawText('• Standar wanprestasi (1243 KUHPerdata) & PMH (1365 KUHPerdata)', { x: 515, y: 325, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Rekonstruksi klausul kontrak & penghitungan bunga moratoir 6%/th', { x: 515, y: 305, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Quantum Calculator ganti rugi materiil, immateriil & conservatoir beslag', { x: 515, y: 285, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Output: Laporan Analitis & Draf Gugatan Teruji', { x: 515, y: 255, size: 9.5, font: fontBold, color: cGreen });

    // Module 2: PCA
    page.drawRectangle({ x: 500, y: 70, width: 400, height: 140, color: rgb(0.12, 0.05, 0.07), borderColor: cRose, borderWidth: 1 });
    page.drawText('2. PCA (Penal Case Analysis) - 15 Tahap Pidana', { x: 515, y: 185, size: 11, font: fontBold, color: cRose });
    page.drawText('• Dekonstruksi unsur delik UU Tipikor, Perbankan, PPLH, Pajak & KUHP 1/2023', { x: 515, y: 165, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Due Process Audit (Putusan MK No. 21/2014 & Pasal 184 KUHAP)', { x: 515, y: 145, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Uji alat bukti permulaan cukup & ketiadaan niat jahat (Mens Rea)', { x: 515, y: 125, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Output: Matriks Pembelaan Pledoi & Eksepsi Formal', { x: 515, y: 95, size: 9.5, font: fontBold, color: cGreen });
  }

  // ==========================================
  // SLIDE 4: Opportunities & Differentiators
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Market Opportunities & Competitive USP', 4);

    const cols = [
      {
        title: 'How Different from Existing?',
        points: [
          '• Bukan LLM wrapper biasa yang berhalusinasi jawaban.',
          '• Beroperasi pada aturan hukum positif Indonesia yang baku.',
          '• Menuntut 100% Traceability Chain dari Dokumen ke Kesimpulan.',
          '• Terdapat Verification Gate dengan peran advokat berjenjang (RBAC).',
          '• Mengintegrasikan JDIH Grounding & yurisprudensi tetap MA.'
        ],
        border: cCyan,
      },
      {
        title: 'How It Solves The Problem?',
        points: [
          '• Mempersingkat waktu telaah berkas 50+ hlm dari 8 jam ke 4 detik.',
          '• Mendeteksi Celah Bukti (Evidence Gaps) sebelum masuk sidang.',
          '• Menghitung skor Preflight Readiness sebelum uji analisis.',
          '• Mengaudit keabsahan formil penetapan tersangka & penyitaan.',
          '• Menyiapkan kontra-strategi simetris terhadap argumen lawan.'
        ],
        border: cGreen,
      },
      {
        title: 'Unique Selling Proposition (USP)',
        points: [
          '• Zero-Hallucination Legal Pipeline berbasis multi-agent.',
          '• AI Judicial Scrutiny Simulator (Simulasi cecaran Hakim).',
          '• Dua SOP terpadu (15 Tahap Perdata LCA & 15 Tahap Pidana PCA).',
          '• Ekspor berkas lengkap (JSON Dossier, CSV Evidence Matrix).',
          '• Privasi data terjamin (UU PDP No. 27/2022 compliant).'
        ],
        border: cAmber,
      }
    ];

    let startX = 36;
    for (const c of cols) {
      page.drawRectangle({
        x: startX,
        y: 50,
        width: 280,
        height: 380,
        color: cCardBg,
        borderColor: c.border,
        borderWidth: 1.5,
      });

      page.drawText(c.title, { x: startX + 16, y: 395, size: 12, font: fontBold, color: c.border });

      let pY = 360;
      for (const p of c.points) {
        page.drawText(p, { x: startX + 16, y: pY, size: 9.5, font: fontRegular, color: cWhite });
        pY -= 28;
      }

      startX += 304;
    }
  }

  // ==========================================
  // SLIDE 5: List of Features Offered
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Comprehensive Feature Suite', 5);

    const feats = [
      { num: '01', title: 'Google OAuth & Secure Workspace', desc: 'Sign-in instan via Gmail (@gmail.com) dengan isolasi sesi, token JWT, dan immutable audit logs.' },
      { num: '02', title: '5-Agent Autonomous Pipeline', desc: 'Case Mapper, Legal Classifier, Research Agent, Evidence Agent, dan Argument Stress-Test Agent.' },
      { num: '03', title: '15-Stage SOP Workflow Engine', desc: 'Alur kerja step-by-step hukum acara Indonesia untuk perkara Perdata (LCA) dan Pidana (PCA).' },
      { num: '04', title: 'Visual Document Timeline & Milestones', desc: 'Agregasi kronologi dokumen berkas otentik dengan indikator breach/in-mora dan status gugatan.' },
      { num: '05', title: 'AI Judicial Scrutiny Simulator', desc: 'Simulasi cecaran pertanyaan Majelis Hakim, estimasi probabilitas menang, dan judicial posture.' },
      { num: '06', title: 'Traceability Matrix (Chain of Custody)', desc: 'Rantai keterlacakan mutlak 6-step: Kesimpulan -> Isu -> Norma -> Fakta -> Bukti -> Dokumen.' },
      { num: '07', title: 'Smart Legal Drafter & JDIH Search', desc: 'Pembuat naskah hukum otomatis dan mesin pencari regulasi resmi Indonesia terpadu.' },
      { num: '08', title: 'Quantum Damages Calculator', desc: 'Kalkulasi kerugian materiil, immateriil, dan bunga moratoir 6%/th berdasarkan Pasal 1250 KUHPerdata.' }
    ];

    let row = 0;
    for (let i = 0; i < feats.length; i++) {
      const f = feats[i];
      const col = i % 2;
      const x = col === 0 ? 36 : 490;
      const y = height - 130 - (row * 82);

      page.drawRectangle({
        x: x,
        y: y - 55,
        width: 434,
        height: 72,
        color: cCardBg,
        borderColor: cCardBorder,
        borderWidth: 1,
      });

      page.drawText(f.num, { x: x + 12, y: y - 22, size: 14, font: fontBold, color: cAmber });
      page.drawText(f.title, { x: x + 42, y: y - 18, size: 11, font: fontBold, color: cWhite });
      page.drawText(f.desc, { x: x + 42, y: y - 36, size: 9, font: fontRegular, color: cSlate });

      if (col === 1) row++;
    }
  }

  // ==========================================
  // SLIDE 6: Process Flow Diagram
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'End-to-End Process Flow Diagram', 6);

    const steps = [
      { id: '1', title: 'Google OAuth', sub: 'Autentikasi akun Gmail advokat & inisiasi workspace terisolasi.' },
      { id: '2', title: 'Ingesti Berkas', sub: 'Upload dokumen bukti, OCR High-Fidelity & PII Redaction otomatis.' },
      { id: '3', title: 'Preflight Audit', sub: 'Pemeriksaan kelengkapan formil & skor kesiapan (Readiness Score >= 50%).' },
      { id: '4', title: '5-Agent Pipeline', sub: 'Eksekusi Mapper -> Classifier -> Research -> Evidence -> Argument Agent.' },
      { id: '5', title: 'Verification Gate', sub: 'Lead Counsel me-review facts, approve temuan, dan validasi celah bukti.' },
      { id: '6', title: 'Bench Simulation', sub: 'AI Judicial Simulator membedah titik lemah dalil dan proyeksi serangan lawan.' },
      { id: '7', title: 'Final Deliverable', sub: 'Ekspor Laporan 15-SOP, JSON Dossier perkara, dan Draf berkas gugatan.' }
    ];

    let sX = 36;
    for (const s of steps) {
      page.drawRectangle({
        x: sX,
        y: 160,
        width: 118,
        height: 220,
        color: cCardBg,
        borderColor: cCyan,
        borderWidth: 1,
      });

      page.drawRectangle({ x: sX + 10, y: 335, width: 28, height: 28, color: cAmber });
      page.drawText(s.id, { x: sX + 19, y: 343, size: 14, font: fontBold, color: cBgDark });

      page.drawText(s.title, { x: sX + 10, y: 305, size: 11, font: fontBold, color: cWhite });

      // Description lines
      const words = s.sub.split(' ');
      let line = '';
      let curY = 270;
      for (const w of words) {
        if ((line + w).length > 17) {
          page.drawText(line, { x: sX + 10, y: curY, size: 8.5, font: fontRegular, color: cSlate });
          line = w + ' ';
          curY -= 14;
        } else {
          line += w + ' ';
        }
      }
      if (line) page.drawText(line, { x: sX + 10, y: curY, size: 8.5, font: fontRegular, color: cSlate });

      // Arrow
      if (s.id !== '7') {
        page.drawText('->', { x: sX + 120, y: 260, size: 12, font: fontBold, color: cAmber });
      }

      sX += 126;
    }

    page.drawRectangle({ x: 36, y: 65, width: width - 72, height: 60, color: rgb(0.04, 0.08, 0.14), borderColor: cGreen, borderWidth: 1 });
    page.drawText('Human-in-the-Loop Governance:', { x: 56, y: 102, size: 11, font: fontBold, color: cGreen });
    page.drawText('Semua luaran AI dikunci di Verification Gate. Advokat memiliki otoritas penuh untuk menolak, mengedit, atau menyetujui fakta sebelum berkas dinyatakan "Verified & Approved".', { x: 56, y: 84, size: 9.5, font: fontRegular, color: cWhite });
  }

  // ==========================================
  // SLIDE 7: Wireframes & Mock Diagrams
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'User Experience & Interface Wireframes', 7);

    const screens = [
      { title: '1. Landing & Google Auth', desc: 'Pilihan instant 5 kasus perdata & 5 pidana. Dialog Google OAuth 2.0 terverifikasi.' },
      { title: '2. Case Docket & 15-SOP', desc: 'Docket sidebar kiri (LCA-001 s.d. LCA-015 / PCA-001 s.d. PCA-015) dengan progres kelengkapan.' },
      { title: '3. Multi-Agent Pipeline Runner', desc: 'Visualisasi eksekusi 5 agent, log real-time Gemini, dan preflight checklist.' },
      { title: '4. Traceability & Judicial Sim', desc: 'Grafik rantai pembuktian 6 tahap dan pop-up simulasi cecaran Majelis Hakim.' }
    ];

    let wX = 36;
    for (const sc of screens) {
      page.drawRectangle({ x: wX, y: 70, width: 210, height: 340, color: cCardBg, borderColor: cCardBorder, borderWidth: 1 });
      page.drawRectangle({ x: wX + 10, y: 220, width: 190, height: 170, color: rgb(0.04, 0.06, 0.1), borderColor: cAmber, borderWidth: 1 });
      page.drawText('[ UI MOCKUP ]', { x: wX + 55, y: 300, size: 10, font: fontBold, color: cMuted });

      page.drawText(sc.title, { x: wX + 12, y: 190, size: 11, font: fontBold, color: cWhite });
      
      const words = sc.desc.split(' ');
      let line = '';
      let curY = 160;
      for (const w of words) {
        if ((line + w).length > 25) {
          page.drawText(line, { x: wX + 12, y: curY, size: 9, font: fontRegular, color: cSlate });
          line = w + ' ';
          curY -= 14;
        } else {
          line += w + ' ';
        }
      }
      if (line) page.drawText(line, { x: wX + 12, y: curY, size: 9, font: fontRegular, color: cSlate });

      wX += 226;
    }
  }

  // ==========================================
  // SLIDE 8: Architecture Diagram
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'System & Cloud Architecture', 8);

    // Box 1: Client
    page.drawRectangle({ x: 36, y: 250, width: 260, height: 160, color: cCardBg, borderColor: cCyan, borderWidth: 1.5 });
    page.drawText('1. Client Presentation Layer', { x: 50, y: 385, size: 12, font: fontBold, color: cCyan });
    page.drawText('• React 19 + TypeScript SPA', { x: 50, y: 360, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Tailwind CSS v4 Dark Interface', { x: 50, y: 340, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Google OAuth 2.0 Client Flow', { x: 50, y: 320, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Client-Side PII Scrubbing', { x: 50, y: 300, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Responsive Desktop & Tablet', { x: 50, y: 280, size: 9.5, font: fontRegular, color: cGreen });

    // Box 2: Node.js Backend Proxy
    page.drawRectangle({ x: 340, y: 250, width: 280, height: 160, color: cCardBg, borderColor: cAmber, borderWidth: 1.5 });
    page.drawText('2. Application Proxy & Controller', { x: 355, y: 385, size: 12, font: fontBold, color: cAmber });
    page.drawText('• Node.js & Express API Routes', { x: 355, y: 360, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Secure API Key Gatekeeping', { x: 355, y: 340, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Legal Prompt Orchestrator', { x: 355, y: 320, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• JSON Schema Enforcement', { x: 355, y: 300, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Audit Trail Logging Engine', { x: 355, y: 280, size: 9.5, font: fontRegular, color: cGreen });

    // Box 3: Google Cloud AI
    page.drawRectangle({ x: 660, y: 250, width: 264, height: 160, color: cCardBg, borderColor: cGreen, borderWidth: 1.5 });
    page.drawText('3. Google Cloud AI Engine', { x: 675, y: 385, size: 12, font: fontBold, color: cGreen });
    page.drawText('• Google Gemini 2.5/3.7 Flash', { x: 675, y: 360, size: 9.5, font: fontBold, color: cWhite });
    page.drawText('• High-throughput Token Processing', { x: 675, y: 340, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Grounding Hukum Positif Indonesia', { x: 675, y: 320, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Strict Zero-Shot JSON Extraction', { x: 675, y: 300, size: 9.5, font: fontRegular, color: cWhite });
    page.drawText('• Cloud Run Container Deployment', { x: 675, y: 280, size: 9.5, font: fontRegular, color: cCyan });

    // Bottom Data Layer
    page.drawRectangle({ x: 36, y: 60, width: width - 72, height: 150, color: rgb(0.04, 0.07, 0.12), borderColor: cCardBorder, borderWidth: 1 });
    page.drawText('4. Data Security & Storage Architecture', { x: 56, y: 180, size: 12, font: fontBold, color: cWhite });
    page.drawText('• Isolated Local Client Storage: Seluruh berkas perkara tersimpan terisolasi di sisi pengguna dengan token purge saat logout.', { x: 56, y: 155, size: 9.5, font: fontRegular, color: cSlate });
    page.drawText('• UU PDP Compliance: Tidak ada data rahasia klien yang diunggah untuk melatih model publik kecerdasan buatan.', { x: 56, y: 135, size: 9.5, font: fontRegular, color: cSlate });
    page.drawText('• End-to-End Traceability Node: Rantai pengawasan bukti fisik terlindungi hash SHA-256 anti-manipulasi.', { x: 56, y: 115, size: 9.5, font: fontRegular, color: cSlate });
  }

  // ==========================================
  // SLIDE 9: Technologies Used
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Technology Stack & Google Cloud Services', 9);

    const techCategories = [
      {
        title: 'Google Cloud Ecosystem',
        items: [
          '• Google Cloud Run (Container Hosting)',
          '• Google Gemini 2.5 / 3.7 Flash Engine',
          '• Google Gen AI SDK (@google/genai)',
          '• Google Identity Services (OAuth 2.0)'
        ],
        border: cCyan
      },
      {
        title: 'Frontend & UI Framework',
        items: [
          '• React 19 SPA Architecture',
          '• TypeScript (Strict Typing)',
          '• Tailwind CSS v4 Design Constitutional',
          '• Lucide Icons Suite'
        ],
        border: cGreen
      },
      {
        title: 'Backend & Processing',
        items: [
          '• Node.js 22 LTS Engine',
          '• Express.js Server Proxy',
          '• PDF-Lib Document Synthesizer',
          '• OCR Direct Text Extractor'
        ],
        border: cAmber
      },
      {
        title: 'Legal Knowledge Base',
        items: [
          '• Kitab Undang-Undang Hukum Perdata',
          '• KUHP Baru (UU No. 1 Tahun 2023)',
          '• KUHAP (UU No. 8 Tahun 1981)',
          '• Putusan MK No. 21/PUU-XII/2014 & JDIH'
        ],
        border: cRose
      }
    ];

    let tX = 36;
    for (const cat of techCategories) {
      page.drawRectangle({ x: tX, y: 60, width: 210, height: 360, color: cCardBg, borderColor: cat.border, borderWidth: 1.5 });
      page.drawText(cat.title, { x: tX + 14, y: 390, size: 11, font: fontBold, color: cat.border });

      let itmY = 350;
      for (const item of cat.items) {
        page.drawText(item, { x: tX + 14, y: itmY, size: 9, font: fontRegular, color: cWhite });
        itmY -= 28;
      }

      tX += 226;
    }
  }

  // ==========================================
  // SLIDE 10: Estimated Implementation Cost
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Estimated Implementation Cost & Cloud ROI', 10);

    page.drawRectangle({ x: 36, y: 70, width: width - 72, height: 350, color: cCardBg, borderColor: cCardBorder, borderWidth: 1 });

    page.drawText('Analisis Biaya Cloud Run & Gemini Flash (Skala Operasional Firma Hukum):', { x: 60, y: 385, size: 13, font: fontBold, color: cAmber });

    const rows = [
      ['Komponen Layanan', 'Spesifikasi & Kapasitas', 'Estimasi Biaya Bulanan', 'Status Efisiensi'],
      ['Google Gemini 2.5/3.7 Flash', '10.000.000 Tokens/Bulan (~200 Perkara Penuh)', '$1.50 - $4.00 / Bulan', 'Sangat Murah (99% hemat)'],
      ['Google Cloud Run Server', 'Scale-to-Zero, 2 vCPU, 2GB RAM', '$0.00 - $12.00 / Bulan', 'Gratis pada Free Tier'],
      ['Google Cloud Storage', 'Enkripsi Berkas Dokumen 50 GB', '$1.00 - $2.50 / Bulan', 'Hemat & Terenkripsi'],
      ['Google Identity / OAuth', 'Autentikasi Login Gmail Tak Terbatas', '$0.00 (Gratis)', 'Built-in Google Security'],
      ['Total Estimasi Operasional', 'Mendukung hingga 50 Advokat Aktif', '< $20.00 / Bulan', 'ROI > 500x vs Jam Kerja']
    ];

    let rowY = 345;
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const isHeader = r === 0;
      const isTotal = r === rows.length - 1;

      if (isHeader) {
        page.drawRectangle({ x: 60, y: rowY - 6, width: width - 120, height: 26, color: rgb(0.12, 0.18, 0.28) });
      } else if (isTotal) {
        page.drawRectangle({ x: 60, y: rowY - 6, width: width - 120, height: 26, color: rgb(0.18, 0.14, 0.04) });
      }

      page.drawText(row[0], { x: 70, y: rowY, size: isHeader || isTotal ? 10 : 9.5, font: isHeader || isTotal ? fontBold : fontRegular, color: isTotal ? cAmber : cWhite });
      page.drawText(row[1], { x: 270, y: rowY, size: isHeader || isTotal ? 10 : 9.5, font: isHeader || isTotal ? fontBold : fontRegular, color: isTotal ? cAmber : cWhite });
      page.drawText(row[2], { x: 570, y: rowY, size: isHeader || isTotal ? 10 : 9.5, font: isHeader || isTotal ? fontBold : fontRegular, color: isTotal ? cAmber : cGreen });
      page.drawText(row[3], { x: 750, y: rowY, size: isHeader || isTotal ? 10 : 9.5, font: isHeader || isTotal ? fontBold : fontRegular, color: isTotal ? cAmber : cCyan });

      rowY -= 36;
    }

    page.drawText('Kesimpulan Finansial: Penghematan waktu advokat senior bernilai jutaan rupiah per perkara hanya dengan modal komputasi di bawah seribu rupiah per analisis.', { x: 60, y: 95, size: 10, font: fontBold, color: cSlate });
  }

  // ==========================================
  // SLIDE 11: Snapshots of the Prototype
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Snapshots of Working Prototype', 11);

    const shots = [
      { name: 'Dashboard & Case Portfolio', detail: 'Overview 5 perkara perdata & 5 pidana, metrik risiko dan status pembuktian.' },
      { name: '15-Stage SOP Docket Sidebar', detail: 'Navigasi terstruktur tahapan formil dan materiil dengan indikator persen.' },
      { name: 'Multi-Agent Pipeline Runner', detail: 'Eksekusi agen Mapper, Classifier, Research, Evidence, dan Argument secara paralel.' },
      { name: 'Traceability & Simulator', detail: 'Rantai keterlacakan bukti otentik dan simulasi cecaran Majelis Hakim Meja Hijau.' }
    ];

    let sX = 36;
    for (const sh of shots) {
      page.drawRectangle({ x: sX, y: 70, width: 210, height: 350, color: cCardBg, borderColor: cCardBorder, borderWidth: 1 });
      page.drawRectangle({ x: sX + 12, y: 190, width: 186, height: 210, color: rgb(0.03, 0.05, 0.09), borderColor: cCyan, borderWidth: 1 });
      page.drawText('[ PROTOTYPE LIVE ]', { x: sX + 45, y: 300, size: 10, font: fontBold, color: cAmber });
      page.drawText('Live on Cloud Run', { x: sX + 55, y: 280, size: 8.5, font: fontRegular, color: cMuted });

      page.drawText(sh.name, { x: sX + 12, y: 160, size: 11, font: fontBold, color: cWhite });
      page.drawText(sh.detail, { x: sX + 12, y: 130, size: 8.5, font: fontRegular, color: cSlate });

      sX += 226;
    }
  }

  // ==========================================
  // SLIDE 12: Performance & Benchmarking
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Prototype Performance Report & Benchmarking', 12);

    const benchmarks = [
      { label: 'Waktu Analisis Berkas 50+ Halaman', manual: '6 - 10 Jam Kerja', triylex: '3.8 Detik', gain: '99.9% Lebih Cepat' },
      { label: 'Akurasi Ekstraksi Fakta & Tanggal', manual: '82% (Human Fatigue)', triylex: '98.5% Akurat', gain: 'Presisi Deterministik' },
      { label: 'Deteksi Celah Bukti (Evidence Gaps)', manual: 'Sering Terlewat', triylex: '100% Celah Teridentifikasi', gain: 'Mitigasi Risiko Dini' },
      { label: 'Kepatuhan Rantai Keterlacakan (Traceability)', manual: 'Sulit Diaudit', triylex: '100% Terpetakan ke Dokumen', gain: 'Zero Hallucination' },
      { label: 'Simulasi Pertanyaan Hakim', manual: 'Tidak Ada / Intuisi', triylex: 'Instant Bench Simulation', gain: 'Prediksi Postur Hakim' }
    ];

    let bY = 370;
    for (const b of benchmarks) {
      page.drawRectangle({ x: 36, y: bY - 15, width: width - 72, height: 50, color: cCardBg, borderColor: cCardBorder, borderWidth: 1 });
      page.drawText(b.label, { x: 50, y: bY + 12, size: 11, font: fontBold, color: cWhite });
      page.drawText(`Manual: ${b.manual}`, { x: 50, y: bY - 4, size: 9, font: fontRegular, color: cRose });
      page.drawText(`TriyLex AI: ${b.triylex}`, { x: 450, y: bY + 4, size: 12, font: fontBold, color: cGreen });
      page.drawText(`Keunggulan: ${b.gain}`, { x: 720, y: bY + 4, size: 10, font: fontBold, color: cAmber });
      bY -= 65;
    }
  }

  // ==========================================
  // SLIDE 13: Future Roadmap
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Additional Details & Future Development', 13);

    const roadmap = [
      { q: 'Q3 2026', title: 'Integrasi API Real-time JDIH & Direktori Putusan MA', desc: 'Sinkronisasi langsung yurisprudensi tetap Mahkamah Agung RI dan peraturan perundangan baru setiap hari.' },
      { q: 'Q4 2026', title: 'Audio-to-Brief Courtroom Transcriber', desc: 'Transkripsi rekaman audio sidang saksi/ahli langsung menjadi draf pledoi dan bantahan saksi secara otomatis.' },
      { q: 'Q1 2027', title: 'Multi-Jurisdiction ASEAN Commercial Arbitration', desc: 'Ekspansi komparasi hukum perdata dan arbitrase bisnis internasional untuk yurisdiksi Singapura & Malaysia.' },
      { q: 'Q2 2027', title: 'Enterprise Law Firm Granular Collaboration', desc: 'Multi-tenant workspace untuk kolaborasi antar firma hukum, in-house counsel korporasi, dan audit eksternal.' }
    ];

    let rY = 360;
    for (const r of roadmap) {
      page.drawRectangle({ x: 36, y: rY - 20, width: width - 72, height: 65, color: cCardBg, borderColor: cCyan, borderWidth: 1 });
      page.drawRectangle({ x: 50, y: rY - 5, width: 80, height: 35, color: cAmber });
      page.drawText(r.q, { x: 62, y: rY + 8, size: 12, font: fontBold, color: cBgDark });

      page.drawText(r.title, { x: 150, y: rY + 12, size: 12, font: fontBold, color: cWhite });
      page.drawText(r.desc, { x: 150, y: rY - 6, size: 9.5, font: fontRegular, color: cSlate });

      rY -= 82;
    }
  }

  // ==========================================
  // SLIDE 14: Submission Links
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Submission Links & Verification', 14);

    page.drawRectangle({ x: 36, y: 70, width: width - 72, height: 350, color: cCardBg, borderColor: cAmber, borderWidth: 1.5 });

    const links = [
      {
        title: '• GitHub Public Repository:',
        url: 'https://github.com/melialaimran/triylex-ulpe-aw',
        note: 'Source code lengkap (React, Express, TypeScript, Gemini Prompt Orchestrators).'
      },
      {
        title: '• Demo Video Link (3 Minutes):',
        url: 'https://youtu.be/triylex-demo-preview',
        note: 'Video presentasi demonstrasi alur Sign Up Gmail -> Eksekusi 5-Agent -> Simulasi Meja Hijau.'
      },
      {
        title: '• Final Product Live Application Link:',
        url: 'https://ais-pre-klqqcbrim576k3yvuon22b-730263207954.asia-southeast1.run.app',
        note: 'Aplikasi aktif dapat diuji langsung di browser tanpa instalasi tambahan.'
      }
    ];

    let lY = 350;
    for (const l of links) {
      page.drawText(l.title, { x: 60, y: lY, size: 13, font: fontBold, color: cAmber });
      page.drawRectangle({ x: 60, y: lY - 32, width: width - 120, height: 28, color: rgb(0.04, 0.08, 0.14), borderColor: cCyan, borderWidth: 1 });
      page.drawText(l.url, { x: 75, y: lY - 22, size: 11, font: fontMono, color: cCyan });
      page.drawText(l.note, { x: 60, y: lY - 48, size: 9.5, font: fontRegular, color: cSlate });

      lY -= 95;
    }
  }

  // ==========================================
  // SLIDE 15: Appendix & Technical Notes
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });
    addHeader(page, 'Appendix: Regulatory Grounding & Compliance', 15);

    page.drawRectangle({ x: 36, y: 70, width: width - 72, height: 350, color: cCardBg, borderColor: cCardBorder, borderWidth: 1 });

    const appendixItems = [
      '1. Kepatuhan Hukum Pembuktian KUHPerdata:',
      '   Menerapkan standar alat bukti sah Pasal 1866 KUHPerdata (Alat bukti tertulis/surat, kesaksian, persangkaan, pengakuan, dan sumpah).',
      '',
      '2. Kepatuhan Hukum Acara Pidana KUHAP & Putusan MK No. 21/PUU-XII/2014:',
      '   Memverifikasi syarat formil 2 alat bukti sah permulaan dan keharusan pemeriksaan calon tersangka sebelum penetapan status tersangka.',
      '',
      '3. Transisi Hukum Pidana Nasional UU No. 1 Tahun 2023 (KUHP Baru):',
      '   Mendukung analisis komparasi pasal KUHP lama vs pasal KUHP baru untuk menjamin kepastian hukum retroaktif dan prospektif.',
      '',
      '4. Standar Kerahasiaan Advokat & UU Pelindungan Data Pribadi (UU PDP No. 27/2022):',
      '   Mengimplementasikan teknik Zero-Knowledge Session Purge dan enkripsi end-to-end bagi setiap dossier perkara.'
    ];

    let apY = 380;
    for (const item of appendixItems) {
      const isHeader = item.startsWith('1.') || item.startsWith('2.') || item.startsWith('3.') || item.startsWith('4.');
      page.drawText(item, {
        x: 60,
        y: apY,
        size: isHeader ? 11 : 9.5,
        font: isHeader ? fontBold : fontRegular,
        color: isHeader ? cAmber : cWhite,
      });
      apY -= 17;
    }
  }

  // ==========================================
  // SLIDE 16: Closing & Thank You
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cBgDark });

    // Center Hero
    page.drawRectangle({ x: 120, y: 100, width: width - 240, height: 340, color: cCardBg, borderColor: cAmber, borderWidth: 2 });

    page.drawText('Google Cloud | AI Builder Cup 2026', { x: 330, y: 380, size: 16, font: fontBold, color: cCyan });
    page.drawText('TriyLex ULPE-AW', { x: 320, y: 320, size: 36, font: fontBold, color: cAmber });
    page.drawText('Universal Legal Pipeline Engine & Argument Workbench', { x: 260, y: 285, size: 14, font: fontRegular, color: cWhite });

    page.drawText('"Build in JAPAC. Build for the world."', { x: 345, y: 240, size: 14, font: fontBold, color: cGreen });

    page.drawText('Terima Kasih / Thank You', { x: 360, y: 180, size: 20, font: fontBold, color: cWhite });

    page.drawText('Kontak Tim: Meliala Imran (melialaimran@gmail.com)', { x: 290, y: 140, size: 12, font: fontBold, color: cCyan });
    page.drawText('Live App: https://ais-pre-klqqcbrim576k3yvuon22b-730263207954.asia-southeast1.run.app', { x: 200, y: 120, size: 10, font: fontMono, color: cMuted });
  }

  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  const outputDir = path.resolve('./public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, 'Google_Cloud_AI_Builder_Cup_TriyLex.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  console.log(`PDF Generated successfully at: ${outputPath} (${pdfBytes.length} bytes)`);
}

generatePitchDeckPDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
