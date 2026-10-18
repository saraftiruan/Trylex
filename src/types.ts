export type UserRole = 'Admin' | 'Lead Counsel' | 'Analyst' | 'Reviewer' | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  jurisdiction: string;
  avatarUrl?: string;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
  authProvider?: 'google' | 'email';
  emailVerified?: boolean;
}

export type FactStatus = 'Established' | 'Alleged' | 'Disputed' | 'Unknown';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Unknown';
export type VerificationStatus = 'Verified' | 'Partially verified' | 'Unverified' | 'Contradicted' | 'Insufficient information';

export interface LegalFact {
  id: string;
  text?: string;
  statement?: string;
  status: FactStatus;
  confidence: ConfidenceLevel;
  sourceDocId?: string;
  sourceDocIds?: string[];
  disputedBy?: string;
  category?: 'Chronology' | 'Contractual' | 'Financial' | 'Conduct' | 'Procedural';
  verified?: boolean;
  relevanceScore?: string;
  tags?: string[];
}

export interface LegalParty {
  id: string;
  name: string;
  type: 'Individual' | 'Corporation' | 'Government Body' | 'Organization' | 'Corporate Entity';
  role: string;
  legalRepresentative?: string;
  conflictNotes?: string;
}

export interface CaseClaim {
  id: string;
  title: string;
  description: string;
  type: string;
  claimedAmount?: string;
  legalBasis?: string;
}

export interface LegalLayer {
  id: string;
  layerName: string;
  priorityScore: number;
  primarySources: string[];
  triggeringFacts: string[];
  potentialIssues: string[];
  classificationReason?: string;
}

export interface StatutorySource {
  id?: string;
  articleId?: string;
  lawName?: string;
  code?: string;
  article: string;
  title?: string;
  verbatimText?: string;
  status?: 'Current' | 'Amended' | 'Repealed' | 'Requires Review';
  effectiveDate?: string;
  relevance?: string;
  relevanceScore?: number;
  benchmarkNotes?: string;
  confidence?: ConfidenceLevel;
  requiresResearch?: boolean;
}

export interface EvidenceItem {
  evidenceId: string;
  name: string;
  type: string;
  supportsFactId: string;
  reliability: ConfidenceLevel;
  isDirect: boolean;
  corroborationStatus: 'Corroborated' | 'Single Source' | 'Contradicted' | 'Unconfirmed';
  documentRef?: string;
  notes?: string;
}

export interface EvidenceGap {
  id: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  recommendation: string;
  status: 'Open' | 'Mitigated' | 'Waived';
}

export interface SymmetricArgument {
  issueId: string;
  issueTitle: string;
  claimantArgument: string;
  defendantArgument: string;
  stressTestAnalysis: string;
  weaknessAnalysis?: string;
  counterstrategy?: string;
}

export interface TraceabilityNode {
  conclusionId: string;
  conclusionText: string;
  issueId: string;
  element: string;
  factId: string;
  evidenceId: string;
  documentRef: string;
}

export interface RiskMatrix {
  legalExposure: 'Low' | 'Medium' | 'High' | 'Critical';
  evidenceStrength: 'Weak' | 'Moderate' | 'Strong';
  contradictionRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  temporalRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  proceduralRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  researchDependency?: 'Low' | 'Medium' | 'High' | 'Critical';
  analyticalConfidence: 'High' | 'Medium' | 'Low';
  summaryNotes: string;
}

export interface VerificationGate {
  status: VerificationStatus;
  auditScore: number;
  checklist: {
    item: string;
    verified: boolean;
    notes: string;
  }[];
}

export interface CaseDocument {
  id: string;
  name: string;
  size: string;
  fileType: string;
  uploadDate: string;
  status: 'Uploaded' | 'Scanning' | 'Extracting text' | 'OCR processing' | 'Classified' | 'Ready for analysis' | 'Failed' | 'Needs review';
  category: 'Kontrak/Perjanjian' | 'Surat Somasi/Peringatan' | 'Akta Notaris' | 'Bukti Keuangan/Mutasi' | 'Surat Elektronik/Chat' | 'Putusan/Dokumen Pengadilan' | 'Kronologi Manual' | 'Lainnya';
  author?: string;
  pageCount: number;
  ocrQuality?: string;
  ocrConfidence?: string | number;
  hash: string;
  piiRedacted: boolean;
  extractedText?: string;
  relatedParties?: string[];
  relatedClaims?: string[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'Contract' | 'Breach' | 'Notice' | 'Litigation' | 'Regulatory' | 'Investigation' | 'Evidence' | 'Court';
  importance: 'Key' | 'Supporting' | 'Contextual';
  documentRef?: string;
  documentName?: string;
  sourceSnippet?: string;
  proceduralPhase?: string;
  actor?: string;
  statutoryDeadline?: string;
  proceduralStatus?: 'Compliant / On-Time' | 'Breached / In Mora' | 'Pending Court Action' | 'Pre-trial Window' | 'Statute of Limitations (Daluwarsa)';
  status?: 'Confirmed' | 'Estimated' | 'Disputed';
}

export interface CaseComment {
  id: string;
  targetType?: 'fact' | 'evidence' | 'issue' | 'source' | 'general';
  targetId?: string;
  author: string;
  authorRole?: UserRole;
  role?: string;
  text: string;
  createdAt: string;
  resolved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  caseId?: string;
  userId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'analysis_done' | 'review_request' | 'evidence_gap' | 'security' | 'system' | 'verification';
  timestamp: string;
  read: boolean;
  caseId?: string;
}

export type CaseNotification = NotificationItem;

export type LCACategory = 
  | 'FACT'
  | 'CLAIM'
  | 'DISPUTED'
  | 'EVIDENCE'
  | 'INFERENCE'
  | 'LEGAL_ISSUE'
  | 'UNKNOWN_ISSUE'
  | 'EVIDENCE_GAP';

export interface LCACategoryDef {
  key: LCACategory;
  label: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
}

export interface ContractClauseItem {
  id: string;
  clauseNumber: string;
  title: string;
  verbatimText: string;
  obligorParty: string;
  beneficiaryParty: string;
  performanceStandard: string;
  breachIndicator: string;
  status: 'Fulfilled' | 'Alleged Default' | 'Disputed' | 'Pending' | 'Waived';
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface ContractReconstruction {
  contractTitle: string;
  contractType: 'Written Agreement' | 'Oral Agreement' | 'Purchase Order / PO' | 'Work Order / WO' | 'Quotation & Invoice' | 'Framework / Master Service Agreement';
  executionDate: string;
  effectiveDate: string;
  governingLaw: string;
  disputeForum: string;
  amendments: {
    id: string;
    date: string;
    title: string;
    description: string;
    documentRef?: string;
  }[];
  clauses: ContractClauseItem[];
  defaultAnalysis: string;
}

export interface QuantumDamageItem {
  id: string;
  category: 'Kerugian Pokok (Materil)' | 'Bunga Moratoir (6% p.a.)' | 'Denda Keterlambatan Kontraktual' | 'Biaya Operasional & Pemulihan' | 'Kerugian Imateril / Reputasi' | 'Bunga Kompensatoir';
  description: string;
  claimedAmount: number;
  provenAmount: number;
  legalBasis: string;
  evidenceRef: string;
  status: 'Fully Documented' | 'Partially Documented' | 'Undocumented / Gap';
}

export interface QuantumCalculation {
  principalClaim?: number;
  totalClaimed?: number;
  totalProven?: number;
  gapAmount?: number;
  interestCalculated?: number;
  contractualPenalty?: number;
  statutoryInterestRate?: number; // default 6% per annum as per Indonesian standard
  interestPeriodMonths?: number;
  immaterialDamages?: number;
  otherCosts?: number;
  items?: QuantumDamageItem[];
  breakdown?: any[];
  currency?: string;
  calculationNotes?: string;
}

export interface CaseStrategyPlan {
  primaryPath?: 'Somasi & Negosiasi Damai' | 'Gugatan Perdata Wanprestasi / PMH (PN)' | 'Permohonan PKPU / Pailit (Pengadilan Niaga)' | 'Arbitrase (BANI / SIAC)' | 'Laporan Pidana Terkait (Polri)';
  primaryObjective?: string;
  settlementThreshold?: string;
  proceduralRoadmap?: string[];
  alternativePath?: string;
  fallbackPlan?: string;
  settlementTarget?: string;
  conservatorySeizureTarget?: string; // Sita Jaminan (Conservatoir Beslag)
  tacticalRoadmap?: {
    phase: string;
    timeline: string;
    actionItem: string;
    responsibleRole: string;
    riskMitigation: string;
  }[];
  executiveStrategicNotes?: string;
}

export type CaseMethodology = 'LCA' | 'PCA';

// === PCA (Penal / Criminal Case Analyst) Structures ===

export interface PCADueProcessAudit {
  suratTugasSpdpValid?: boolean;
  spdpDeliveredOnTime?: boolean;
  twoValidEvidenceAvailable?: boolean;
  warrantHasClearLocusTempus?: boolean;
  suspectDesignationLegality?: {
    hasTwoValidEvidence: boolean;
    calonTskExamined: boolean;
    mk21Compliance: boolean;
    notes: string;
  };
  searchAndSeizureLegality?: {
    hasCourtPermit: boolean;
    emergencyProtocolValid: boolean;
    notes: string;
  };
  seizureApproval?: {
    hasCourtPermit: boolean;
    emergencyProtocolValid: boolean;
    notes: string;
  };
  legalCounselRight: {
    article56Compliant: boolean;
    bapAccompanied: boolean;
    notes: string;
  };
  praperadilanViability: 'Sangat Tinggi (Strong)' | 'Cukup Beralasan (Moderate)' | 'Lemah / Tidak Layak (Weak)' | 'Tidak Relevan';
  praperadilanArguments: string[];
}

export interface PCAElementsDeconstruction {
  indictmentArticle: string;
  penalSystemComparison: {
    wvsOldArticle: string;
    kuhpNewUU12023Article: string;
    specialLawArticle: string;
    transitionPrinciple: string; // Lex Favor Reo (Pasal 1 ayat 2 KUHP)
  };
  objectiveElements: {
    element: string;
    fulfillment: 'Terpenuhi' | 'Tidak Terpenuhi' | 'Diragukan / Celah Pembelaan';
    analysis: string;
    supportingEvidence: string[];
  }[];
  subjectiveElements: {
    element: string;
    fulfillment: 'Terpenuhi' | 'Tidak Terpenuhi' | 'Diragukan / Celah Pembelaan';
    analysis: string;
    supportingEvidence: string[];
  }[];
  causalityAnalysis: string;
}

export interface PCAParticipationCorporate {
  participationForm: 'Pleger (Pelaku Tunggal)' | 'Doen Plegen (Menyuruh Lakukan)' | 'Medepleger (Turut Serta Melakukan Ps 55-1-1)' | 'Uitlokker (Penganjur Ps 55-1-2)' | 'Medeplichtige (Pembantu Kejahatan Ps 56)';
  participationAnalysis: string;
  corporateLiabilityApplicable: boolean;
  corporateDoctrineUsed?: 'Identification Doctrine' | 'Vicarious Liability' | 'Strict Liability' | 'Perma No. 13 Tahun 2016';
  corporateAnalysis?: string;
}

export interface PCADefenseExclusion {
  rechtvaardigingsgrond?: {
    type: 'Noodweer (Pembelaan Terpaksa Ps 49-1)' | 'Perintah Jabatan Sah (Ps 51-1)' | 'Menjalankan Peraturan UU (Ps 50)' | 'Ketiadaan Sifat Melawan Hukum Materiil';
    argument: string;
    applicable: boolean;
  };
  schulduitsluitingsgrond?: {
    type: 'Noodweerexces (Ps 49-2)' | 'Daya Paksa / Overmacht (Ps 48)' | 'Perintah Jabatan Tanpa Wewenang tapi Itikad Baik (Ps 51-2)' | 'Gangguan Jiwa (Ps 44)' | 'Tiada Kesalahan Tanpa Pidana (Geen Straf Zonder Schuld)' | 'Kesesatan Fakta (Dwaling)';
    argument: string;
    applicable: boolean;
  };
  defenseConclusion: string;
}

export interface PCAIndictmentStressTest {
  indictmentType: 'Tunggal' | 'Alternatif' | 'Subsidairitas' | 'Kumulatif' | 'Kombinasi';
  formalDefects: string[];
  obscuurLibelAnalysis: string;
  nebisInIdemAnalysis: string;
  daluwarsaAnalysis: string;
  eksepsiRecommendations: string[];
  eksepsiDraftText?: string;
}

export interface PCACrossExaminationSimulator {
  witnessQuestions: {
    witnessName: string;
    witnessRole: 'Saksi BAP Penyidik' | 'Saksi Korban' | 'Saksi Mahkota' | 'Ahli Penuntut Umum';
    targetedContradiction: string;
    trappingQuestions: string[];
    expectedTrapGoal: string;
  }[];
  aDeChargeStrategy: {
    witnessCategory: 'Saksi Fakta Alibi' | 'Ahli Hukum Pidana Materiil' | 'Ahli Forensik Digital / Auditor Finansial';
    testimonyGoal: string;
    keyQuestions: string[];
  }[];
}

export interface PCASentencingMatrix {
  primaryPenaltyRange: string;
  restitutionOrStateLoss: string;
  assetForfeitureRisk: string;
  restorativeJusticeViability: 'Memenuhi Syarat (RJ Eligible)' | 'Tidak Memenuhi Syarat' | 'Diskresi Penegak Hukum';
  mitigatingCircumstances: string[];
  aggravatingCircumstances: string[];
}

export interface PCAPledoiDossier {
  pledoiTitle: string;
  defenseTarget: 'Vrijspraak (Bebas Murni)' | 'Onslag van alle rechtsvervolging (Lepas dari Segala Tuntutan)' | 'Pidana Minimum / Percobaan' | 'Restorative Justice';
  pledoiText?: string;
}

export interface LegalCase {
  id: string;
  title: string;
  refNumber: string;
  client: string;
  opposingParty: string;
  methodology?: CaseMethodology; // 'LCA' for Civil/Business, 'PCA' for Criminal & Special Crimes
  caseType: 
    | 'Perdata / Wanprestasi' 
    | 'Perbuatan Melawan Hukum (PMH)' 
    | 'Sengketa Ketenagakerjaan (PHI)' 
    | 'Kepailitan & PKPU' 
    | 'Arbitrase & ADR' 
    | 'Hak Kekayaan Intelektual (HAKI)' 
    | 'Hukum Korporasi & M&A' 
    | 'Hukum Tata Usaha Negara (PTUN)' 
    | 'Pidana Bisnis / White Collar'
    | 'Tindak Pidana Korupsi (Tipikor)'
    | 'Tindak Pidana Pencucian Uang (TPPU)'
    | 'Tindak Pidana Siber & ITE'
    | 'Tindak Pidana Bisnis & Korporasi'
    | 'Tindak Pidana Perpajakan & Kepabeanan'
    | 'Tindak Pidana Pasar Modal & Perbankan'
    | 'Tindak Pidana Lingkungan Hidup & Kehutanan'
    | 'Tindak Pidana Narkotika & Psikotropika'
    | 'Tindak Pidana Umum (KUHP: Penipuan, Penggelapan, Pemalsuan Surat)';
  jurisdiction: 'Indonesia' | 'Singapura' | 'Cross-Border / Multi-Jurisdiction';
  courtForum: string;
  owner: string;
  reviewer: string;
  confidentiality: 'Strictly Confidential' | 'Highly Confidential' | 'Confidential' | 'Internal';
  proceduralPosition: 
    | 'Penyelidikan / Legal Due Diligence' 
    | 'Somasi & Negosiasi' 
    | 'Pendaftaran Gugatan' 
    | 'Jawaban / Eksepsi' 
    | 'Replik / Duplik' 
    | 'Tahap Pembuktian' 
    | 'Kesimpulan' 
    | 'Putusan Tingkat Pertama' 
    | 'Banding' 
    | 'Kasasi / PK'
    // Criminal Procedural Positions
    | 'Penyelidikan / Klarifikasi'
    | 'Penyidikan / SPDP Diterbitkan'
    | 'Penetapan Tersangka / Praperadilan'
    | 'Pemeriksaan BAP & Penyitaan'
    | 'Pelimpahan Berkas Tahap II (P-21)'
    | 'Pembacaan Surat Dakwaan (Pasal 143 KUHAP)'
    | 'Eksepsi / Keberatan (Pasal 156 KUHAP)'
    | 'Putusan Sela'
    | 'Pembuktian Saksi JPU (A Charge)'
    | 'Pembuktian Saksi Meringankan (A De Charge)'
    | 'Tuntutan Pidana (Requisitoir)'
    | 'Nota Pembelaan (Pledoi)'
    | 'Vonis Pengadilan Tingkat Pertama';
  status: 'Draft' | 'Ready for Analysis' | 'Analyzing' | 'In Review' | 'Verified & Approved' | 'Archived';
  createdAt: string;
  updatedAt: string;
  summary: string;
  claimAmount?: string;
  incidentDate?: string;
  contractDate?: string;
  allegedBreachDate?: string;
  noticeDate?: string;
  lawsuitDate?: string;
  parties: LegalParty[];
  claims: CaseClaim[];
  admittedFacts?: string[];
  disputedFacts?: string[];
  unknownFacts?: string[];
  documents: CaseDocument[];
  timeline: TimelineEvent[];
  facts: LegalFact[];
  legalLayers?: LegalLayer[];
  statutes: StatutorySource[];
  evidenceMatrix: EvidenceItem[];
  evidenceGaps: EvidenceGap[];
  symmetricArguments?: SymmetricArgument[];
  traceability?: TraceabilityNode[];
  riskMatrix?: RiskMatrix;
  verificationGate?: VerificationGate;
  comments: CaseComment[];
  executiveSummary?: string;
  approvedBy?: string;
  approvedAt?: string;
  currentSOPStage?: string;
  completedSOPStages?: string[];
  // LCA Additions
  contractReconstruction?: ContractReconstruction;
  quantumCalculation?: QuantumCalculation;
  strategyPlan?: CaseStrategyPlan;
  finalReportText?: string;
  // PCA Additions (Criminal Case Analyst)
  pcaDueProcessAudit?: PCADueProcessAudit;
  pcaElementsDeconstruction?: PCAElementsDeconstruction;
  pcaParticipationCorporate?: PCAParticipationCorporate;
  pcaDefenseExclusion?: PCADefenseExclusion;
  pcaIndictmentStressTest?: PCAIndictmentStressTest;
  pcaCrossExaminationSimulator?: PCACrossExaminationSimulator;
  pcaSentencingMatrix?: PCASentencingMatrix;
  pcaPledoiDossier?: PCAPledoiDossier;
  pcaWitnessMatrix?: any;
}

export interface JDIHKeyPoint {
  articleOrPoint: string;
  content: string;
  relevanceNotes?: string;
}

export interface JDIHDocument {
  id: string;
  type: 'Undang-Undang' | 'Peraturan Pemerintah' | 'Perpres' | 'Peraturan Menteri' | 'Yurisprudensi MA' | 'Putusan Landmark MA' | 'SEMA / PERMA' | 'KUHPerdata / KUHP / HIR';
  title: string;
  number: string;
  year: string;
  source: 'JDIHN BPHN' | 'Direktori Putusan MA' | 'JDIH Sektoral' | 'Kodifikasi Hukum Positif';
  status: 'Berlaku Penuh' | 'Diubah Sebagian' | 'Dicabut / Tidak Berlaku' | 'Yurisprudensi Tetap' | 'Uji Materiil MK';
  summary: string;
  keyArticlesOrPrecedents: JDIHKeyPoint[];
  ratioDecidendi?: string;
  relevanceScore: number;
  tags: string[];
  citationFormat: string;
  fullPdfUrl?: string;
}
