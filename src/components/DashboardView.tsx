import React, { useState } from 'react';
import { 
  FolderPlus, 
  Search, 
  Filter, 
  FileText, 
  Scale, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Layers, 
  BarChart3, 
  TrendingUp, 
  UserCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { LegalCase, UserProfile } from '../types';

interface DashboardViewProps {
  cases: LegalCase[];
  currentUser: UserProfile;
  onSelectCase: (caseId: string) => void;
  onCreateCase: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  currentUser,
  onSelectCase,
  onCreateCase,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [methodologyFilter, setMethodologyFilter] = useState<'ALL' | 'LCA' | 'PCA'>('ALL');

  // Metrics calculations
  const validCases = (cases || []).filter(Boolean);
  const totalCases = validCases.length;
  const inReviewCount = validCases.filter(c => c.status === 'In Review').length;
  const totalEvidence = validCases.reduce((acc, curr) => acc + (curr?.evidenceMatrix?.length || 0), 0);
  const totalVerifiedFacts = validCases.reduce((acc, curr) => acc + (curr?.facts?.filter(f => f?.verified)?.length || 0), 0);
  const totalFacts = validCases.reduce((acc, curr) => acc + (curr?.facts?.length || 0), 0);
  const verificationRate = totalFacts > 0 ? Math.round((totalVerifiedFacts / totalFacts) * 100) : 0;

  // Filter cases
  const filteredCases = validCases.filter(c => {
    if (!c) return false;
    const isCriminal = c?.methodology === 'PCA' || (c?.caseType || '').toLowerCase().includes('pidana') || (c?.caseType || '').toLowerCase().includes('tipikor');
    const caseMethodology = isCriminal ? 'PCA' : 'LCA';

    const matchesMethodology = methodologyFilter === 'ALL' || caseMethodology === methodologyFilter;

    const matchesSearch = 
      (c?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.refNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.client || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.opposingParty || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.caseType || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c?.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || (c?.caseType || '').includes(typeFilter);

    return matchesMethodology && matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Workspace: {currentUser.organization}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Pusat Pengelolaan & Analisis Perkara Hukum
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Sistem intelijen perkara terstruktur berbasis ULPE-AW. Analisis multi-lapisan KUHPerdata, UU Khusus, dan pembuktian berantai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-create-case-btn"
            onClick={onCreateCase}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Buat Perkara Baru</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Perkara Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{totalCases}</span>
            <span className="text-[11px] text-slate-400">perkara tercatat</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Semua yurisdiksi Indonesia</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Laporan Siap Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{inReviewCount}</span>
            <span className="text-[11px] text-amber-400 font-medium">memerlukan atensi</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-amber-400" />
            <span>Lead Counsel & Reviewer gate</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Evidence Items Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{totalEvidence}</span>
            <span className="text-[11px] text-slate-400">alat bukti terindeks</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-purple-400" />
            <span>Akta, surat, & bukti digital</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Verification Rate (Fakta)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{verificationRate}%</span>
            <span className="text-[11px] text-emerald-400 font-medium">terverifikasi</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>{totalVerifiedFacts} dari {totalFacts} fakta terbukti</span>
          </div>
        </div>

      </div>

      {/* Case Management Workspace Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="dashboard-search-input"
              type="text"
              placeholder="Cari judul perkara, nomor referensi, klien, atau lawan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Methodology Filter (ALL / LCA / PCA) */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl p-1 text-xs">
              <button
                id="filter-methodology-all"
                onClick={() => setMethodologyFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  methodologyFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua ({cases.length})
              </button>
              <button
                id="filter-methodology-pca"
                onClick={() => setMethodologyFilter('PCA')}
                className={`px-3 py-1 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
                  methodologyFilter === 'PCA'
                    ? 'bg-rose-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scale className="w-3 h-3 text-rose-300" />
                <span>Pidana (PCA)</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] text-rose-300 font-mono font-bold">
                  {validCases.filter(c => c?.methodology === 'PCA' || (c?.caseType || '').toLowerCase().includes('pidana') || (c?.caseType || '').toLowerCase().includes('tipikor')).length}
                </span>
              </button>
              <button
                id="filter-methodology-lca"
                onClick={() => setMethodologyFilter('LCA')}
                className={`px-3 py-1 rounded-lg transition-colors font-medium flex items-center gap-1.5 ${
                  methodologyFilter === 'LCA'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3 h-3 text-slate-900" />
                <span>Perdata (LCA)</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] text-amber-400 font-mono font-bold">
                  {validCases.filter(c => c?.methodology !== 'PCA' && !(c?.caseType || '').toLowerCase().includes('pidana') && !(c?.caseType || '').toLowerCase().includes('tipikor')).length}
                </span>
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-xl p-1 text-xs">
              {['ALL', 'Ready for Analysis', 'In Review', 'Verified & Approved'].map((status) => (
                <button
                  key={status}
                  id={`filter-status-${status.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                    statusFilter === status 
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status === 'ALL' ? 'Semua Status' : status}
                </button>
              ))}
            </div>

            {/* Case Type Filter */}
            <select
              id="dashboard-type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Klasifikasi Perkara</option>
              <option value="Perdata">Perdata / Wanprestasi</option>
              <option value="Korupsi">Tipikor & Keuangan Negara</option>
              <option value="Perbankan">Perbankan & Kejahatan Finansial</option>
              <option value="Lingkungan">Lingkungan Hidup & Karhutla</option>
              <option value="Perpajakan">Pidana Perpajakan / Faktur</option>
              <option value="Kesehatan">Profesi Medis & Kesehatan</option>
              <option value="HAKI">Hak Kekayaan Intelektual</option>
              <option value="Ketenagakerjaan">Ketenagakerjaan (PHI)</option>
              <option value="Arbitrase">Arbitrase & ADR</option>
            </select>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredCases.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <Scale className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">Tidak ada perkara yang cocok</h3>
              <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
            </div>
          ) : (
            filteredCases.map((c) => (
              <div
                key={c.id}
                id={`case-card-${c.id}`}
                className="group bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 rounded-xl p-5 transition-all shadow-md hover:shadow-amber-500/5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                      {c.refNumber}
                    </span>
                    {c.methodology === 'PCA' ? (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80 flex items-center gap-1">
                        <Scale className="w-2.5 h-2.5" />
                        <span>PIDANA (PCA)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80 flex items-center gap-1">
                        <Layers className="w-2.5 h-2.5" />
                        <span>PERDATA (LCA)</span>
                      </span>
                    )}
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700">
                      {c.caseType}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-800/50">
                      {c.courtForum}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                      c.status === 'Verified & Approved' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' :
                      c.status === 'In Review' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      ● {c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-400">
                    <p><strong className="text-slate-300 font-medium">Klien:</strong> {c.client}</p>
                    <p><strong className="text-slate-300 font-medium">Lawan:</strong> {c.opposingParty}</p>
                    <p><strong className="text-slate-300 font-medium">Posisi:</strong> {c.proceduralPosition}</p>
                    <p><strong className="text-slate-300 font-medium">Nilai Tuntutan:</strong> <span className="text-amber-400 font-mono">{c.claimAmount || '-'}</span></p>
                  </div>
                </div>

                {/* Right side stats & action */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="text-center lg:text-right">
                      <span className="block font-bold text-white font-mono">{c.documents.length}</span>
                      <span className="text-[10px] text-slate-500">Dokumen</span>
                    </div>
                    <div className="text-center lg:text-right">
                      <span className="block font-bold text-amber-400 font-mono">{c.evidenceMatrix.length}</span>
                      <span className="text-[10px] text-slate-500">Bukti</span>
                    </div>
                    <div className="text-center lg:text-right">
                      <span className="block font-bold text-emerald-400 font-mono">{c.verificationGate?.auditScore || 0}%</span>
                      <span className="text-[10px] text-slate-500">Audit Score</span>
                    </div>
                  </div>

                  <button
                    id={`open-case-btn-${c.id}`}
                    onClick={() => onSelectCase(c.id)}
                    className="px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 hover:border-amber-500 font-medium text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Buka Workspace Perkara</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
