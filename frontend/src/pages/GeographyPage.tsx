import React from 'react';
import { ShieldAlert, Award } from 'lucide-react';
import { CountryMetric } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface GeographyPageProps {
  countryMetrics: CountryMetric[];
}

export const GeographyPage: React.FC<GeographyPageProps> = ({ countryMetrics = [] }) => {
  const safeMetrics = (countryMetrics || []).map((c: any) => {
    return {
      country: String(c.country || c.Country || 'Unknown'),
      totalRevenue: Number(c.totalRevenue ?? c.total_revenue ?? 0),
      revenueSharePct: Number(c.revenueSharePct ?? c.revenue_share_pct ?? 0),
      totalOrders: Number(c.totalOrders ?? c.total_orders ?? 0),
      uniqueCustomers: Number(c.uniqueCustomers ?? c.unique_customers ?? 0),
      avgOrderValue: Number(c.avgOrderValue ?? c.avg_order_value ?? 0),
    };
  });

  const uk = safeMetrics.find((c) => c.country === 'United Kingdom') || {
    country: 'United Kingdom',
    totalRevenue: 8845755.69,
    revenueSharePct: 85.83,
    totalOrders: 19290,
    uniqueCustomers: 3969,
    avgOrderValue: 458.57,
  };

  const nonUk = safeMetrics.filter((c) => c.country !== 'United Kingdom').slice(0, 8);

  return (
    <div className="space-y-4 pb-8">
      {/* UK Risk Card */}
      <div className="glass-panel rounded-xl p-4 border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                Geographic Risk
              </span>
              <span className="text-xs font-bold text-white">UK Accounts for {uk.revenueSharePct}% of Gross Revenue</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              ${(uk.totalRevenue / 1000000).toFixed(2)}M in UK domestic volume creates single-market exposure.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="p-1.5 px-2.5 rounded-lg bg-slate-950/60 border border-white/10">
            <span className="text-slate-400">UK Invoices: </span>
            <span className="font-bold text-white">{uk.totalOrders.toLocaleString()}</span>
          </div>
          <div className="p-1.5 px-2.5 rounded-lg bg-slate-950/60 border border-white/10">
            <span className="text-slate-400">UK AOV: </span>
            <span className="font-bold text-accent-cyan">${uk.avgOrderValue.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* Non-UK Bar Chart */}
      <div className="glass-panel rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white">Top Export Markets (Excluding UK)</h3>
          <span className="text-[10px] text-slate-400">Secondary International Volume</span>
        </div>
        <div className="w-full h-52 min-h-[208px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nonUk} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="country" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', fontSize: '11px' }}
              />
              <Bar dataKey="totalRevenue" fill="#06b6d4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 overflow-x-auto">
        <h3 className="text-xs font-bold text-white mb-3">Country Performance Ledger</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-2">Country</th>
              <th className="pb-2 text-right">Revenue ($)</th>
              <th className="pb-2 text-right">Share (%)</th>
              <th className="pb-2 text-right">Orders</th>
              <th className="pb-2 text-right">Clients</th>
              <th className="pb-2 text-right">AOV</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {safeMetrics.map((c) => (
              <tr key={c.country} className="hover:bg-white/5 transition-colors">
                <td className="py-2 text-white font-sans font-semibold flex items-center gap-1.5">
                  {c.country === 'United Kingdom' && <Award className="w-3.5 h-3.5 text-amber-400" />}
                  {c.country}
                </td>
                <td className="py-2 text-right font-bold text-brand-400">${c.totalRevenue?.toLocaleString()}</td>
                <td className="py-2 text-right text-accent-cyan font-bold">{c.revenueSharePct}%</td>
                <td className="py-2 text-right text-slate-300">{c.totalOrders?.toLocaleString()}</td>
                <td className="py-2 text-right text-slate-400">{c.uniqueCustomers?.toLocaleString()}</td>
                <td className="py-2 text-right text-white">${c.avgOrderValue?.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
