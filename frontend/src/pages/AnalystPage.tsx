import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  ArrowRight,
  Database,
  RefreshCw,
  HelpCircle,
  BarChart3,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AnalystMessage } from '../types';
import { api } from '../services/api';

interface AnalystPageProps {
  initialQuery?: string;
}

export const AnalystPage: React.FC<AnalystPageProps> = ({ initialQuery }) => {
  const [messages, setMessages] = useState<AnalystMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I am **EARIP AI**, your Enterprise Retail Analyst.\n\nI have evaluated the **UCI Online Retail II dataset** ($10.3M revenue, 20,951 orders, 4,312 customers). Ask me anything regarding sales trends, retention, UK concentration risks, or Q1 2011 forecasting.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metricsCited: [
        { label: 'Revenue', value: '$10.3M' },
        { label: 'UK Share', value: '85.8%' },
        { label: 'At-Risk', value: '1,031' },
      ],
      suggestedQuestions: [
        'What is our current business performance?',
        'Who are our VIP customers?',
        'Which country generates the most revenue?',
        'Why did revenue change?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: AnalystMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await api.askAnalyst(textToSend, historyPayload);

      const aiMsg: AnalystMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsCited: response.metricsCited,
        suggestedQuestions: response.suggestedQuestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || 'Unable to complete AI analysis query.');
      const errorMsg: AnalystMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Encountered an issue processing query against the retail dataset. Please try asking again or select one of the suggested inquiries below.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          "Conversation reset. I am **EARIP AI**, grounded in verified retail transaction data ($10.3M revenue, 20,951 orders, 4,312 customers). What would you like to investigate?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metricsCited: [
          { label: 'Gross Revenue', value: '$10.3M' },
          { label: 'Active Accounts', value: '4,312' },
          { label: 'UK Concentration', value: '85.8%' },
        ],
        suggestedQuestions: [
          'What is our current business performance?',
          'Who are our VIP customers?',
          'Which country generates the most revenue?',
          'What are our biggest risks?',
        ],
      },
    ]);
  };

  const suggestedQuestions = [
    'What is our current business performance?',
    'Who are our VIP customers?',
    'Which country generates the most revenue?',
    'Which products need attention?',
    'What are our biggest risks?',
    'Why did revenue change?',
    'What should management focus on?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-5xl mx-auto pb-2 space-y-2.5">
      {/* Header Info Banner */}
      <div className="glass-panel rounded-xl px-4 py-2.5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center text-white text-xs shadow-glow-indigo">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white tracking-tight">AI Business Analyst</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Grounded Intelligence Active
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300">
                AI-Powered
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Grounded exclusively in authentic retail transaction logs &amp; variance telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Evidence Provenance Toggle */}
          <button
            onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-brand-500/30 transition-colors"
          >
            <Database className="w-3 h-3 text-accent-cyan" />
            <span>Dataset Provenance</span>
            {showEvidenceDrawer ? (
              <ChevronUp className="w-3 h-3 text-slate-400" />
            ) : (
              <ChevronDown className="w-3 h-3 text-slate-400" />
            )}
          </button>

          {/* Reset Chat */}
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dataset Provenance Drawer */}
      {showEvidenceDrawer && (
        <div className="glass-panel rounded-xl p-3.5 border border-brand-500/25 bg-brand-950/20 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1">
              <Database className="w-3 h-3 text-accent-cyan" /> Grounding Database Context
            </span>
            <span className="text-[10px] text-slate-400 font-mono">UCI Online Retail II Pipeline</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-slate-950/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Total Volume</span>
              <strong className="text-white">$10,305,892.02</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Transactions</span>
              <strong className="text-accent-cyan">20,951 orders</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">Customer Base</span>
              <strong className="text-accent-emerald">4,312 accounts</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-950/80 border border-white/5">
              <span className="text-[10px] text-slate-400 block">UK Revenue Share</span>
              <strong className="text-accent-amber">85.83% domestic</strong>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto glass-panel rounded-xl p-4 border border-white/10 space-y-4 text-xs">
        {messages.map((m) => {
          const isAi = m.role === 'assistant';
          return (
            <div key={m.id} className={`flex gap-3 ${isAi ? 'items-start' : 'items-start justify-end'}`}>
              {isAi && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-2 ${isAi ? 'text-left' : 'text-right'}`}>
                {/* Message Bubble */}
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                    isAi
                      ? 'bg-slate-900/90 border border-white/10 text-slate-200 shadow-sm'
                      : 'bg-brand-600 text-white font-medium shadow-glow-indigo'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                    {m.content}
                  </div>
                </div>

                {/* Supporting Metrics Badges */}
                {m.metricsCited && m.metricsCited.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {m.metricsCited.map((metric, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950/90 border border-brand-500/20 text-slate-300 flex items-center gap-1"
                      >
                        <BarChart3 className="w-2.5 h-2.5 text-accent-cyan" />
                        <strong className="text-accent-cyan">{metric.label}:</strong> {metric.value}
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested Follow-up Questions */}
                {m.suggestedQuestions && m.suggestedQuestions.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {m.suggestedQuestions.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sq)}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950/80 border border-brand-500/25 text-slate-300 hover:text-white hover:border-brand-500/60 hover:bg-white/5 transition-colors flex items-center gap-1.5"
                      >
                        {sq} <ArrowRight className="w-2.5 h-2.5 text-accent-cyan" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs flex items-center gap-2.5 text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-accent-cyan" />
              <span>Querying transaction models &amp; retrieving verified retail metrics...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Inquiries Quick Bar */}
      <div className="py-1 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 flex-shrink-0 pl-1">
          <Sparkles className="w-3 h-3 text-accent-cyan" /> Suggested Inquiries:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-brand-500/40 hover:bg-brand-500/10 transition-colors whitespace-nowrap flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-panel rounded-xl p-1.5 border border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask EARIP AI about revenue, UK concentration, VIP customers, or ML forecasts..."
          className="flex-1 bg-transparent px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-40 transition-colors flex-shrink-0 shadow-glow-indigo"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
