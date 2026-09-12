import React from 'react';
import { Download, Printer, CheckCircle2 } from 'lucide-react';
import { KpiMetrics, BusinessInsight } from '../types';
import { api } from '../services/api';

interface ReportsPageProps {
  kpis: KpiMetrics | null;
  insights: BusinessInsight[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ kpis, insights = [] }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-8 max-w-4xl mx-auto">
      {/* Action Header */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/10 flex items-center justify-between gap-3 no-print">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Executive Intelligence Dossier & Exports</h2>
          <p className="text-[11px] text-slate-400">Download datasets or print executive report</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-semibold text-white hover:bg-slate-850"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>

          <a
            href={api.getReportDownloadUrl('csv', 'sales')}
            download
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-semibold text-white hover:bg-slate-850"
          >
            <Download className="w-3.5 h-3.5" /> Sales CSV
          </a>

          <a
            href={api.getReportDownloadUrl('csv', 'customers')}
            download
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-600 text-xs font-semibold text-white hover:bg-brand-500 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Customers CSV
          </a>
        </div>
      </div>

      {/* Printable Report */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4 bg-slate-900/95">
        <div className="border-b border-white/10 pb-4 flex items-start justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300">
              CONFIDENTIAL
            </span>
            <h1 className="text-lg font-bold text-white mt-1">Executive Retail Intelligence Briefing</h1>
            <p className="text-[11px] text-slate-400">UCI Online Retail II Dataset • EARIP Analytics Engine</p>
          </div>
          <div className="text-right text-[11px] text-slate-400 font-mono">
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {kpis && (
          <div className="grid grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-950/60 border border-white/5 font-mono text-center">
            <div>
              <div className="text-[10px] text-slate-400">Gross Revenue</div>
              <div className="text-sm font-bold text-brand-400">${(kpis.totalRevenue / 1000000).toFixed(2)}M</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Orders</div>
              <div className="text-sm font-bold text-white">{kpis.totalOrders?.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Avg Order Value</div>
              <div className="text-sm font-bold text-accent-cyan">${kpis.avgOrderValue?.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">UK Revenue Share</div>
              <div className="text-sm font-bold text-accent-amber">{kpis.ukConcentrationPct}%</div>
            </div>
          </div>
        )}

        <div className="space-y-2 text-xs text-slate-300">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Executive Findings</h3>
          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-white/5 space-y-1 text-[11px]">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0 mt-0.5" />
              <span><strong>Geographic Concentration:</strong> UK accounts for {kpis?.ukConcentrationPct}% of total volume. Expand into Netherlands ($554k) and Germany ($425k).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0 mt-0.5" />
              <span><strong>Customer Retention:</strong> {kpis?.atRiskCustomerCount} accounts are At-Risk ($1.42M historical spend). 15% discount campaign projects ~$213k recovery.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald flex-shrink-0 mt-0.5" />
              <span><strong>VIP Anchor:</strong> {kpis?.vipCustomerCount} strategic enterprise accounts drive &gt;8.4% of enterprise gross margin.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
