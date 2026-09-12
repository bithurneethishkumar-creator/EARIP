import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlySales } from '../types';

interface SalesPageProps {
  monthlySales: MonthlySales[];
  selectedCountry: string;
}

export const SalesPage: React.FC<SalesPageProps> = ({ monthlySales = [], selectedCountry }) => {
  const safeSales = (monthlySales || []).map((m: any) => {
    const rev = Number(m.totalRevenue ?? m.total_revenue ?? 0);
    const ord = Number(m.totalOrders ?? m.total_orders ?? 0);
    const custs = Number(m.uniqueCustomers ?? m.unique_customers ?? 0);
    const aov = Number(m.avgOrderValue ?? m.avg_order_value ?? 0);
    const ret = Number(m.returnRate ?? m.return_rate ?? 0);
    const growth = Number(m.growthRate ?? m.growth_rate ?? 0);
    const ym = String(m.YearMonth ?? m.month_year ?? m.monthYear ?? '');

    return {
      YearMonth: ym,
      totalRevenue: rev,
      totalOrders: ord,
      uniqueCustomers: custs,
      avgOrderValue: aov,
      returnRate: ret,
      growthRate: growth,
    };
  });

  const totalRev = safeSales.reduce((acc, m) => acc + m.totalRevenue, 0);
  const totalOrders = safeSales.reduce((acc, m) => acc + m.totalOrders, 0);

  let runningRev = 0;
  const cumulativeData = safeSales.map((m) => {
    runningRev += m.totalRevenue;
    return {
      ...m,
      cumulativeRevenue: runningRev,
    };
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Compact Top Banner */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Sales & Revenue Analytics</h2>
          <p className="text-[11px] text-slate-400">Monthly progression and cumulative volume ({selectedCountry})</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Total: </span>
            <span className="font-bold text-brand-400">${(totalRev / 1000000).toFixed(2)}M</span>
          </div>
          <div className="pl-3 border-l border-white/10">
            <span className="text-slate-400">Orders: </span>
            <span className="font-bold text-accent-cyan">{totalOrders.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cumulative Revenue Curve */}
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <h3 className="text-xs font-bold text-white mb-2">Cumulative Revenue Growth ($)</h3>
          <div className="w-full h-52 min-h-[208px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="YearMonth" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Cumulative']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', fontSize: '11px' }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeRevenue"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 2.5, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Month-over-Month Growth Rate */}
        <div className="glass-panel rounded-xl p-4 border border-white/10">
          <h3 className="text-xs font-bold text-white mb-2">Month-over-Month Growth Rate (%)</h3>
          <div className="w-full h-52 min-h-[208px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeSales} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="YearMonth" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Growth']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', fontSize: '11px' }}
                />
                <Bar dataKey="growthRate" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Compact Monthly Ledger Table */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 overflow-x-auto">
        <h3 className="text-xs font-bold text-white mb-3">Monthly Financial Performance</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-2">Period</th>
              <th className="pb-2 text-right">Gross Revenue</th>
              <th className="pb-2 text-right">Orders</th>
              <th className="pb-2 text-right">Unique Customers</th>
              <th className="pb-2 text-right">Avg Order Value</th>
              <th className="pb-2 text-right">Return Rate</th>
              <th className="pb-2 text-right">MoM Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {safeSales.map((row) => (
              <tr key={row.YearMonth} className="hover:bg-white/5 transition-colors">
                <td className="py-2 text-white font-bold">{row.YearMonth}</td>
                <td className="py-2 text-right text-brand-400 font-semibold">
                  ${row.totalRevenue?.toLocaleString()}
                </td>
                <td className="py-2 text-right text-slate-300">{row.totalOrders?.toLocaleString()}</td>
                <td className="py-2 text-right text-slate-300">{row.uniqueCustomers?.toLocaleString()}</td>
                <td className="py-2 text-right text-white">${row.avgOrderValue?.toFixed(2)}</td>
                <td className="py-2 text-right text-accent-rose">{row.returnRate}%</td>
                <td className="py-2 text-right font-semibold">
                  <span className={row.growthRate >= 0 ? 'text-accent-emerald' : 'text-accent-rose'}>
                    {row.growthRate >= 0 ? `+${row.growthRate}%` : `${row.growthRate}%`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
