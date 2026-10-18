import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Scale, 
  BookOpen, 
  ShieldAlert, 
  Layers, 
  Minimize2, 
  Maximize2,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Swords,
  SearchCheck,
  Award
} from 'lucide-react';
import { LegalCase, UserProfile } from '../types';

interface AIChatCopilotProps {
  currentCase?: LegalCase;
  currentUser: UserProfile;
}

export type CopilotPersona = 'lead_counsel' | 'statute_expert' | 'evidence_auditor' | 'opposing_advocate';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  persona?: CopilotPersona;
}

const PERSONA_CONFIG: Record<CopilotPersona, {
  name: string;
  roleTitle: string;
  icon: React.ElementType;
  badgeColor: string;
  description: string;
  suggestedPrompts: string[];
}> = {
  lead_counsel: {
    name: 'Lead Litigation Counsel',
    roleTitle: 'Strategi Litigasi & Manajemen Risiko',
    icon: Award,
    badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    description: 'Fokus pada strategi pemenangan perkara di persidangan, mitigasi risiko pembuktian, dan manajemen klien.',
    suggestedPrompts: [
      'Evaluasi probabilitas kemenangan gugatan',
      'Rekomendasi taktik pembuktian sidang pertama',
      'Susun strategi negosiasi perdamaian (Mediasi)',
    ],
  },
  statute_expert: {
    name: 'Pakar Norma & Yurisprudensi',
    roleTitle: 'KUHPerdata & UU Sektoral Khusus',
    icon: BookOpen,
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    description: 'Analisis mendalam hierarki peraturan, doktrin Lex Specialis, dan yurisprudensi Mahkamah Agung RI.',
    suggestedPrompts: [
      'Uraikan unsur Pasal 1243 vs Pasal 1365 KUHPerdata',
      'Apakah ada yurisprudensi MA tentang wanprestasi tanpa somasi?',
      'Uji kesesuaian asas Pacta Sunt Servanda',
    ],
  },
  evidence_auditor: {
    name: 'Forensik & Gap Auditor',
    roleTitle: 'Audit Alat Bukti & Rantai Kustodi',
    icon: SearchCheck,
    badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    description: 'Pemeriksaan kekuatan bukti otentik, di bawah tangan, digital (UU ITE), dan deteksi bukti hearsay.',
    suggestedPrompts: [
      'Audit kelemahan bukti dokumen yang ada',
      'Cek syarat formil bukti digital chat & email',
      'Apakah bukti surat memenuhi syarat bermeterai & legalisasi?',
    ],
  },
  opposing_advocate: {
    name: "Devil's Advocate / Lawan",
    roleTitle: 'Simulasi Serangan Kuasa Hukum Lawan',
    icon: Swords,
    badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    description: 'Menguji dalil secara kritis, membedah celah hukum, dan merumuskan eksepsi perlawanan.',
    suggestedPrompts: [
      'Serang gugatan ini dengan eksepsi Obscurum Libellum',
      'Dalilkan keadaan memaksa (Force Majeure) dari pihak lawan',
      'Cari kontradiksi antara tanggal kontrak dan klaim wanprestasi',
    ],
  },
};

export const AIChatCopilot: React.FC<AIChatCopilotProps> = ({
  currentCase,
  currentUser,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<CopilotPersona>('lead_counsel');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-init',
      role: 'model',
      content: `Salam advokat, **${currentUser.name}**!\n\nSaya asisten kecerdasan hukum multi-peran **TriyLex ULPE-AW**. Saya siap membantu menganalisis perkara **${currentCase ? currentCase.refNumber + ' (' + currentCase.title + ')' : 'umum'}** dengan 4 persona spesialis:\n\n- ⚖️ **Lead Counsel**: Strategi litigasi & pembuktian.\n- 📜 **Pakar Norma**: KUHPerdata, UU Sektoral & Yurisprudensi MA.\n- 🔍 **Evidence Auditor**: Validasi alat bukti & gap pembuktian.\n- ⚔️ **Devil's Advocate**: Simulasi serangan & eksepsi lawan.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: 'lead_counsel',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `m-reset-${Date.now()}`,
        role: 'model',
        content: `Riwayat percakapan telah dibersihkan. Persona aktif: **${PERSONA_CONFIG[selectedPersona].name}**. Silakan ajukan pertanyaan atau pilih salah satu prompt cepat di bawah.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: selectedPersona,
      },
    ]);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      // Send whole history formatted for server multi-turn API
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rolePersona: selectedPersona,
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          caseContext: currentCase ? {
            title: currentCase.title,
            refNumber: currentCase.refNumber,
            client: currentCase.client,
            opposingParty: currentCase.opposingParty,
            caseType: currentCase.caseType,
            summary: currentCase.summary,
            claims: currentCase.claims,
            evidenceMatrix: currentCase.evidenceMatrix,
          } : undefined,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Maaf, tidak dapat menerima tanggapan dari mesin inferensi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona: selectedPersona,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'model',
          content: 'Terjadi kendala jaringan saat menghubungi layanan AI. Silakan coba sesaat lagi.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          persona: selectedPersona,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activePersonaConfig = PERSONA_CONFIG[selectedPersona];
  const PersonaIcon = activePersonaConfig.icon;

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="open-ai-copilot-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group border border-amber-300/40"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-950 border border-emerald-400 animate-ping" />
          </div>
          <span>TriyLex AI Copilot</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-950/80 text-amber-300 text-[10px] font-mono">
            ULPE-AW
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div 
          className={`fixed z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-200 ${
            isExpanded 
              ? 'bottom-4 right-4 left-4 top-16 sm:left-auto sm:w-[680px] sm:h-[85vh]' 
              : 'bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[560px]'
          }`}
        >
          
          {/* Top Header */}
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white truncate">TriyLex Case Copilot</h3>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono">
                    Gemini 3.7
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentCase ? `Perkara: ${currentCase.refNumber}` : 'Analisis Yuridis Multi-Peran'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                title="Bersihkan Percakapan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isExpanded ? "Perkecil" : "Perbesar"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                id="close-ai-copilot-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Persona Selector Strip */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Peran:
            </span>
            {(Object.keys(PERSONA_CONFIG) as CopilotPersona[]).map((pKey) => {
              const cfg = PERSONA_CONFIG[pKey];
              const Icon = cfg.icon;
              const isActive = selectedPersona === pKey;
              return (
                <button
                  key={pKey}
                  onClick={() => setSelectedPersona(pKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{cfg.name}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Scrollable Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <PersonaIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div
                  className={`group relative p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {/* Persona Indicator for AI message */}
                  {m.role === 'model' && m.persona && (
                    <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800/80">
                      <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{PERSONA_CONFIG[m.persona]?.name || 'TriyLex AI'}</span>
                      </span>

                      <button
                        onClick={() => handleCopy(m.content, m.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 p-0.5 rounded transition-opacity"
                        title="Salin teks"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="prose prose-invert prose-xs max-w-none text-xs leading-relaxed whitespace-pre-wrap">
                    {m.content}
                  </div>

                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      m.role === 'user' ? 'text-slate-800 text-right font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 text-xs text-slate-400 italic bg-slate-950 p-3 rounded-xl border border-slate-800 animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>
                  {activePersonaConfig.name} sedang membedah perkara & merumuskan analisis...
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Persona Prompt Recommendations */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-amber-400 font-mono">
                <Zap className="w-3 h-3" />
                <span>Rekomendasi Prompt ({activePersonaConfig.name}):</span>
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
              {activePersonaConfig.suggestedPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 hover:border-amber-500/40 hover:bg-slate-850 whitespace-nowrap transition-colors flex items-center gap-1"
                >
                  <span>{qp}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Input Field */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }} 
            className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2"
          >
            <input
              id="copilot-input-field"
              type="text"
              placeholder={`Tanyakan pada ${activePersonaConfig.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 text-xs shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim</span>
            </button>
          </form>

        </div>
      )}
    </>
  );
};
