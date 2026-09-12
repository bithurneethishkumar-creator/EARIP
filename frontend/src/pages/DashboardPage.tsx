import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Globe,
  LineChart,
  BrainCircuit,
  Bot,
  Search,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';
import { KpiCard } from '../components/dashboard/KpiCard';
import { TrendChart } from '../components/dashboard/TrendChart';
import { SegmentDonut } from '../components/dashboard/SegmentDonut';
import { TopProductsChart } from '../components/dashboard/TopProductsChart';
import {
  KpiMetrics,
  MonthlySales,
  CustomerSegment,
  TopProduct,
  Anomaly,
  BusinessInsight,
  SalesForecast,
} from '../types';

interface DashboardPageProps {
  kpis: KpiMetrics | null;
  monthlySales: MonthlySales[];
  segments: CustomerSegment[];
  topProducts: TopProduct[];
  anomalies: Anomaly[];
  insights: BusinessInsight[];
  forecast: SalesForecast[];
  onNavigate: (tab: string, param?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  kpis,
  monthlySales = [],
  segments = [],
  topProducts = [],
  anomalies = [],
  insights = [],
  forecast = [],
  onNavigate,
}) => {
  if (!kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-3">
        <div className="w-8 h-8 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
        <div className="text-xs font-semibold text-slate-300">Loading Enterprise Intelligence Metrics...</div>
      </div>
    );
  }

  const topInsight = insights[0];
  const recentAnomaly = anomalies[0];

  return (
    <div className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* 1. EXECUTIVE KPI HERO ROW (TOP PRIORITY - ALL 6 KPIS VISIBLE AT ONCE) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <KpiCard
          title="Total Revenue"
          value={`$${(kpis.totalRevenue / 1000000).toFixed(2)}M`}
          change={kpis.monthlyGrowthRate}
          icon={DollarSign}
          variant="indigo"
          actionLabel="Investigate"
          onAction={() => onNavigate('investigation', 'revenue_drop_2010_04')}
        />

        <KpiCard
          title="Total Orders"
          value={kpis.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          variant="cyan"
          actionLabel="Sales Trends"
          onAction={() => onNavigate('sales')}
        />

        <KpiCard
          title="Active Accounts"
          value={kpis.totalCustomers.toLocaleString()}
          icon={Users}
          variant="emerald"
          actionLabel="RFM Churn"
          onAction={() => onNavigate('investigation', 'retention_at_risk')}
        />

        <KpiCard
          title="Avg Order Value"
          value={`$${kpis.avgOrderValue.toFixed(0)}`}
          icon={TrendingUp}
          variant="purple"
          actionLabel="SKU Pricing"
          onAction={() => onNavigate('products')}
        />

        <KpiCard
          title="UK Concentration"
          value={`${kpis.ukConcentrationPct}%`}
          icon={Globe}
          variant="amber"
          actionLabel="Market Risk"
          onAction={() => onNavigate('investigation', 'uk_concentration')}
        />

        <KpiCard
          title="Return Rate"
          value={`${kpis.returnRate}%`}
          icon={RotateCcw}
          variant="rose"
          actionLabel="Dec Spike"
          onAction={() => onNavigate('investigation', 'return_spike_2010_12')}
        />
      </div>

      {/* 2. STRATEGIC DECISION INTELLIGENCE & AI COMMAND CENTER (2 BALANCED CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card 1: Insight Investigation Engine */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 border border-brand-500/25 bg-gradient-to-br from-brand-950/30 via-slate-900/90 to-slate-900 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-500/15 text-brand-300 border border-brand-500/25">
                  <BrainCircuit className="w-4 h-4 text-accent-cyan" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/25">
                  Decision Intelligence
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">Variance Decomposition</span>
            </div>

            <h3 className="text-sm font-bold text-white mt-2.5 tracking-tight flex items-center gap-1.5">
              <span>Insight Investigation Engine</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Find out <strong>WHY</strong> retail metrics changed. Deconstruct unexpected shifts into geographic contractions, order volume velocities, and customer RFM dormancy with mathematical attribution.
            </p>

            {/* Diagnostic Snapshot Pill */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">Live Diagnostic Scenario:</div>
                <div className="font-semibold text-white">
                  Apr 2010 Contraction <strong className="text-accent-rose font-mono">(-18.24% / -$152.0k)</strong>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Primary Root Cause:</div>
                <div className="font-mono text-accent-cyan text-[11px] font-bold">UK Volume (90.05%)</div>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">100% Calculated Empirical Variance</span>
            <button
              onClick={() => onNavigate('investigation', 'revenue_drop_2010_04')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Search className="w-3.5 h-3.5" /> Investigate Root Causes &rarr;
            </button>
          </div>
        </div>

        {/* Card 2: AI Business Analyst Copilot */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-4 border border-cyan-500/25 bg-gradient-to-br from-cyan-950/30 via-slate-900/90 to-slate-900 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                  <Bot className="w-4 h-4 text-accent-cyan" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                  AI Business Analyst
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">Grounded in 525k Records</span>
            </div>

            <h3 className="text-sm font-bold text-white mt-2.5 tracking-tight flex items-center gap-1.5">
              <span>Enterprise AI Copilot</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Ask natural language business questions grounded in 525,461 transactional records. Query top VIP accounts, single-market UK exposure, high-defect SKUs, and quarterly forecast projections.
            </p>

            {/* Quick Inquiry Chips */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                { label: 'VIP Accounts (Top 6)', query: 'Who are our most valuable customers?' },
                { label: 'UK Risk (85.8%)', query: 'Which country generates the most revenue?' },
                { label: 'Q1 ML Trajectory', query: 'What is the ML revenue forecast trajectory for Q1 2011?' },
                { label: 'Defect SKU Rates', query: 'Which products need attention?' },
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate('analyst', chip.query)}
                  className="text-[10px] font-medium px-2 py-1 rounded-md bg-slate-950/80 border border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">Groq Llama-3.3-70B Active</span>
            <button
              onClick={() => onNavigate('analyst')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Launch AI Copilot &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 3. STRATEGIC PRIORITY INTERVENTION BANNER */}
      {topInsight && (
        <div className="rounded-xl px-4 py-2.5 bg-gradient-to-r from-brand-900/40 via-slate-900 to-slate-900 border border-brand-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded-md bg-brand-500/20 text-brand-300 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            </div>
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300">
                {topInsight.category} Priority
              </span>
              <span className="text-xs font-bold text-white truncate">{topInsight.title}</span>
              <span className="text-xs text-slate-400 hidden md:inline truncate">&mdash; {topInsight.insightText}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('recommendations')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white font-semibold text-[11px] transition-colors flex-shrink-0"
          >
            Review Strategy <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 4. PRIMARY ANALYTICAL ROW: TRENDS & CUSTOMER RFM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TrendChart data={monthlySales} />
        </div>
        <div>
          <SegmentDonut segments={segments} />
        </div>
      </div>

      {/* 5. SECONDARY ROW: PRODUCT INTELLIGENCE & OPERATIONAL RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TopProductsChart products={topProducts} />
        </div>

        {/* Forecast & Anomaly Mini Deck */}
        <div className="space-y-3.5">
          {/* Mini Forecast with Ask AI */}
          <div className="glass-panel rounded-xl p-3.5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <LineChart className="w-3.5 h-3.5 text-accent-cyan" />
                <h4 className="text-xs font-bold text-white">Q1 2011 ML Forecast</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('analyst', 'What is the ML revenue forecast trajectory for Q1 2011?')}
                  className="text-[10px] text-accent-cyan hover:underline font-semibold flex items-center gap-0.5"
                >
                  <Bot className="w-2.5 h-2.5" /> Ask AI
                </button>
                <button
                  onClick={() => onNavigate('forecast')}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Full &rarr;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(forecast || []).slice(0, 3).map((f: any, i) => {
                const pred = Number(f.predictedRevenue ?? f.predicted_revenue ?? 0);
                const month = String(f.forecastMonth ?? f.forecast_month ?? '');
                return (
                  <div key={month || i} className="p-2 rounded-lg bg-slate-950/70 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">{month}</div>
                    <div className="text-xs font-extrabold text-accent-cyan mt-0.5">
                      ${(pred / 1000).toFixed(0)}k
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Anomaly with Investigate */}
          {recentAnomaly && (
            <div className="glass-panel rounded-xl p-3.5 border border-accent-rose/25 bg-accent-rose/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-accent-rose">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <h4 className="text-xs font-bold">Operational Anomaly Alert</h4>
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent-rose text-white">
                  {recentAnomaly.severity}
                </span>
              </div>
              <div className="text-xs font-semibold text-white truncate">{recentAnomaly.metricName}</div>
              <p className="text-[11px] text-slate-300 line-clamp-1">{recentAnomaly.rootCauseAnalysis}</p>
              <div className="flex items-center justify-between pt-1 border-t border-accent-rose/15 text-[10px]">
                <button
                  onClick={() => onNavigate('investigation', 'return_spike_2010_12')}
                  className="font-bold text-accent-rose hover:underline flex items-center gap-0.5"
                >
                  <Search className="w-2.5 h-2.5" /> Investigate Spike &rarr;
                </button>
                <button
                  onClick={() => onNavigate('anomalies')}
                  className="text-slate-400 hover:text-white"
                >
                  Diagnostics &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
