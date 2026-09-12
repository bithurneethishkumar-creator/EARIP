import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Sliders } from 'lucide-react';
import { MonthlySales, SalesForecast } from '../types';

interface ForecastPageProps {
  monthlySales: MonthlySales[];
  forecast: SalesForecast[];
}

export const ForecastPage: React.FC<ForecastPageProps> = ({ monthlySales = [], forecast = [] }) => {
  const [scenario, setScenario] = useState<'baseline' | 'optimistic' | 'conservative'>('baseline');
  const multiplier = scenario === 'optimistic' ? 1.08 : scenario === 'conservative' ? 0.92 : 1.0;

  const recentHistorical = (monthlySales || []).slice(-5).map((m: any) => ({
    period: String(m.YearMonth ?? m.month_year ?? m.monthYear ?? ''),
    actualRevenue: Number(m.totalRevenue ?? m.total_revenue ?? 0),
    predictedRevenue: null,
    lowerBound: null,
    upperBound: null,
  }));

  const forecastData = (forecast || []).map((f: any) => {
    const month = String(f.forecastMonth ?? f.forecast_month ?? '');
    const pred = Number(f.predictedRevenue ?? f.predicted_revenue ?? 0);
    const low = Number(f.lowerBound ?? f.lower_bound ?? 0);
    const up = Number(f.upperBound ?? f.upper_bound ?? 0);

    return {
      period: `${month} (Fc)`,
      actualRevenue: null,
      predictedRevenue: Math.round(pred * multiplier),
      lowerBound: Math.round(low * multiplier),
      upperBound: Math.round(up * multiplier),
    };
  });

  const combinedData = [...recentHistorical, ...forecastData];

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner with Scenario Toggle */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Revenue Forecasting (Q1 2011)</h2>
          <p className="text-[11px] text-slate-400">Holt-Winters ML predictive time series modeling</p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-white/10 text-xs">
          <span className="text-slate-400 px-1.5 flex items-center gap-1 text-[11px]">
            <Sliders className="w-3 h-3" /> Scenario:
          </span>
          <button
            onClick={() => setScenario('conservative')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              scenario === 'conservative' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            -8%
          </button>
          <button
            onClick={() => setScenario('baseline')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              scenario === 'baseline' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => setScenario('optimistic')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              scenario === 'optimistic' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            +8%
          </button>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="glass-panel rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white">Historical Actuals vs Forecast Trajectory</h3>
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-300">Historical</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
              <span className="text-slate-300">ML Forecast ({scenario})</span>
            </div>
          </div>
        </div>

        <div className="w-full h-60 min-h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={combinedData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', fontSize: '11px' }}
                formatter={(value: any, name: any) => [
                  value ? `$${Number(value).toLocaleString()}` : '-',
                  name === 'actualRevenue' ? 'Historical' : 'Forecast',
                ]}
              />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="transparent"
                fill="url(#forecastBand)"
                name="95% CI"
              />
              <Line
                type="monotone"
                dataKey="actualRevenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#6366f1' }}
              />
              <Line
                type="monotone"
                dataKey="predictedRevenue"
                stroke="#06b6d4"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3.5, fill: '#06b6d4' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Month Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(forecast || []).map((f: any, idx) => {
          const pred = Math.round(Number(f.predictedRevenue ?? f.predicted_revenue ?? 0) * multiplier);
          const low = Math.round(Number(f.lowerBound ?? f.lower_bound ?? 0) * multiplier);
          const up = Math.round(Number(f.upperBound ?? f.upper_bound ?? 0) * multiplier);
          const month = String(f.forecastMonth ?? f.forecast_month ?? '');
          const growth = Number(f.growthPct ?? f.growth_pct ?? 0);

          return (
            <div key={`fc-${month || idx}`} className="glass-panel rounded-xl p-3.5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white">{month}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    growth >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'
                  }`}
                >
                  {growth >= 0 ? `+${growth}%` : `${growth}%`} MoM
                </span>
              </div>

              <div>
                <div className="text-2xl font-bold text-accent-cyan tracking-tight">
                  ${pred.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Range: ${low.toLocaleString()} – ${up.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
