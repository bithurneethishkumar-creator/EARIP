import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Globe,
  Clock,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import {
  InvestigationResult,
  InvestigationContributor,
  InvestigationScenario,
} from '../types';

interface InvestigationPageProps {
  initialMetricId?: string;
  onNavigate?: (tab: string) => void;
}

export const InvestigationPage: React.FC<InvestigationPageProps> = ({
  initialMetricId = 'revenue_drop_2010_04',
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>(initialMetricId);
  const [scenarios, setScenarios] = useState<InvestigationScenario[]>([]);
  const [data, setData] = useState<InvestigationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialMetricId) {
      setSelectedMetric(initialMetricId);
    }
  }, [initialMetricId]);

  useEffect(() => {
    fetchInvestigation(selectedMetric);
  }, [selectedMetric]);

  const fetchInvestigation = async (metricId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getInvestigation(metricId);
      setData(response.investigation);
      if (response.availableScenarios && response.availableScenarios.length > 0) {
        setScenarios(response.availableScenarios);
      }
    } catch (err: any) {
      console.error('Failed to load insight investigation:', err);
      setError(err.message || 'Unable to retrieve investigation findings.');
    } finally {
      setIsLoading(false);
    }
  };

  const getContributorIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('country') || cat.includes('geograph')) return Globe;
    if (cat.includes('product')) return Package;
    if (cat.includes('customer') || cat.includes('account')) return Users;
    if (cat.includes('order') || cat.includes('volume')) return ShoppingCart;
    if (cat.includes('value') || cat.includes('aov') || cat.includes('price')) return DollarSign;
    if (cat.includes('return') || cat.includes('dispatch')) return AlertTriangle;
    if (cat.includes('recency') || cat.includes('window')) return Clock;
    return Info;
  };

  const isInsufficient =
    data?.status === 'insufficient_data' ||
    data?.metricId === 'insufficient_sample' ||
    (data && data.contributors.length === 0);

  return (
    <div className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* Page Header with Scenario Switcher */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Insight Investigation Engine</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Decision Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic variance decomposition explaining <strong>WHY</strong> key business metrics shifted.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Selector Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-[11px] font-medium text-slate-400">Select Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchInvestigation(selectedMetric)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white hover:border-brand-500/40 transition-colors disabled:opacity-50"
            title="Re-run variance analysis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="glass-panel rounded-xl p-12 border border-white/10 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-300">
            Decomposing transaction variance across geography, products, and customer RFM...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="glass-panel rounded-xl p-6 border border-accent-rose/30 bg-accent-rose/5 text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-accent-rose mx-auto" />
          <h3 className="text-sm font-bold text-white">Investigation Data Unavailable</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchInvestigation(selectedMetric)}
            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
          >
            Retry Investigation
          </button>
        </div>
      )}

      {/* Main Investigation Content */}
      {data && !isLoading && !error && (
        <>
          {/* Insufficient Data State */}
          {isInsufficient ? (
            <div className="glass-panel rounded-xl p-8 border border-amber-500/30 bg-amber-500/5 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  Insufficient data to determine the primary cause.
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {data.businessInterpretation ||
                    'Available retail transaction records lack granular attribution or variance telemetry for this specific parameter.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 max-w-md mx-auto text-left">
                <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                  Suggested Data Logging Requirements:
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {(data.suggestedActions || []).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedMetric('revenue_drop_2010_04')}
                className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition-colors"
              >
                Investigate Verified Revenue Contraction (-18.24%) &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Metric Overview Hero Card */}
              <div className="glass-panel rounded-xl p-5 border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Investigated Metric:
                      </span>
                      <h3 className="text-lg font-extrabold text-white tracking-tight">{data.metricName}</h3>
                    </div>
                    <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">{data.summary}</p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span>
                        Baseline: <strong className="text-slate-200">{data.baselinePeriod || 'Baseline'}</strong>
                      </span>
                      <span>&bull;</span>
                      <span>
                        Comparison:{' '}
                        <strong className="text-slate-200">{data.comparisonPeriod || 'Comparison'}</strong>
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Statistical Confidence:{' '}
                        {(data.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Status & Change Badges */}
                  <div className="flex items-center gap-3 self-start lg:self-auto flex-shrink-0">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-right min-w-[130px]">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Current Status
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-end gap-1">
                        {data.statusDirection === 'down' ? (
                          <span className="text-accent-rose flex items-center">
                            <TrendingDown className="w-4 h-4 mr-0.5" /> {data.currentStatus}
                          </span>
                        ) : (
                          <span className="text-accent-emerald flex items-center">
                            <TrendingUp className="w-4 h-4 mr-0.5" /> {data.currentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-right min-w-[130px]">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Net Change
                      </div>
                      <div
                        className={`text-xl font-black mt-0.5 font-mono ${
                          data.changePct < 0 ? 'text-accent-rose' : 'text-accent-emerald'
                        }`}
                      >
                        {data.changePct > 0 ? `+${data.changePct}%` : `${data.changePct}%`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KEY CONTRIBUTORS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">Key Contributors</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/15 text-brand-300 border border-brand-500/20">
                      Ranked by Variance Impact
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Showing {data.contributors.length} analytical factors
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {data.contributors.map((c: InvestigationContributor, idx: number) => {
                    const Icon = getContributorIcon(c.category);
                    const isDown = c.direction === 'down';
                    const impactBadge = {
                      Critical: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
                      High: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
                      Medium: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
                      Low: 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald/30',
                    }[c.impact] || 'bg-slate-800 text-slate-300';

                    return (
                      <div
                        key={idx}
                        className="glass-panel glass-panel-hover rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          {/* Header of Contributor Card */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-slate-900 border border-white/10 text-brand-400">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  {c.category}
                                </span>
                                <h4 className="text-xs font-bold text-white line-clamp-1">{c.title}</h4>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${impactBadge}`}
                            >
                              {c.impact}
                            </span>
                          </div>

                          {/* Variance Magnitude & Contribution */}
                          <div className="mt-3 flex items-baseline justify-between">
                            <div className="flex items-baseline gap-1.5">
                              <span
                                className={`text-base font-extrabold font-mono flex items-center ${
                                  isDown ? 'text-accent-rose' : 'text-accent-emerald'
                                }`}
                              >
                                {isDown ? (
                                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                                ) : (
                                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                                )}
                                {c.change}
                              </span>
                            </div>

                            {c.contributionPct > 0 && (
                              <span className="text-[11px] font-semibold text-slate-400">
                                <strong className="text-accent-cyan font-mono">{c.contributionPct}%</strong> of variance
                              </span>
                            )}
                          </div>

                          {/* Detailed Explanation */}
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{c.details}</p>
                        </div>

                        {/* Progress Indicator */}
                        {c.contributionPct > 0 && (
                          <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full ${
                                isDown ? 'bg-accent-rose' : 'bg-accent-emerald'
                              }`}
                              style={{ width: `${Math.min(c.contributionPct, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* EVIDENCE & VARIANCE DECOMPOSITION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Comparative Evidence Table */}
                <div className="lg:col-span-2 glass-panel rounded-xl p-4 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Empirical Evidence & Baseline Comparison
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Verified UCI Retail Transactions</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="pb-2">Metric Parameter</th>
                          <th className="pb-2">Baseline ({data.evidence.baselinePeriod})</th>
                          <th className="pb-2">Comparison ({data.evidence.comparisonPeriod})</th>
                          <th className="pb-2 text-right">Variance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {data.evidence.metrics.map((m, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 font-semibold text-white">{m.label}</td>
                            <td className="py-2.5 font-mono text-slate-300">{m.baseline}</td>
                            <td className="py-2.5 font-mono text-slate-100 font-bold">{m.current}</td>
                            <td
                              className={`py-2.5 font-mono text-right font-bold ${
                                m.change.startsWith('-') ? 'text-accent-rose' : 'text-accent-emerald'
                              }`}
                            >
                              {m.change}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Variance Decomposition Breakdown */}
                <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Variance Decomposition
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Mathematical attribution of overall variance share.
                    </p>

                    <div className="mt-4 space-y-3">
                      {(data.evidence.decomposition || []).map((factor, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300">{factor.factor}</span>
                            <span className="font-mono font-bold text-accent-cyan">{factor.share}%</span>
                          </div>
                          <div className="w-full bg-slate-950/80 rounded-full h-2 overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-brand-600 to-accent-cyan rounded-full"
                              style={{ width: `${Math.min(factor.share, 100)}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono text-right">
                            {factor.amount < 0
                              ? `-$${Math.abs(factor.amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                              : `$${factor.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Data Source:</span>
                    <span className="text-slate-200 font-mono">UCI Online Retail II Pipeline</span>
                  </div>
                </div>
              </div>

              {/* BUSINESS INTERPRETATION & SUGGESTED ACTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Business Interpretation Card */}
                <div className="glass-panel rounded-xl p-4 border border-brand-500/20 bg-brand-950/10 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-brand-500/20 text-brand-300">
                      <Sparkles className="w-4 h-4 text-accent-cyan" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Business Interpretation
                    </h4>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {data.businessInterpretation}
                  </p>
                </div>

                {/* Practical Actions (Clearly labeled as "Suggested actions") */}
                <div className="glass-panel rounded-xl p-4 border border-emerald-500/20 bg-emerald-950/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Suggested Actions
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 italic">Not guaranteed outcomes</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-200">
                    {data.suggestedActions.map((action: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                        <span className="leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
