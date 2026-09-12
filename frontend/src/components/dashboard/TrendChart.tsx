import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { MonthlySales } from '../../types';

interface TrendChartProps {
  data: MonthlySales[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data = [] }) => {
  const [metric, setMetric] = useState<'revenue' | 'orders' | 'both'>('both');

  const formattedData = (data || []).map((d: any) => {
    const rev = Number(d.totalRevenue ?? d.total_revenue ?? 0);
    const ord = Number(d.totalOrders ?? d.total_orders ?? 0);
    const growth = Number(d.growthRate ?? d.growth_rate ?? 0);
    const ret = Number(d.returnRate ?? d.return_rate ?? 0);
    const aov = Number(d.avgOrderValue ?? d.avg_order_value ?? 0);
    const ym = String(d.YearMonth ?? d.month_year ?? d.monthYear ?? '');

    return {
      period: ym,
      revenue: rev,
      orders: ord,
      growthRate: growth,
      returnRate: ret,
      avgOrderValue: aov,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-white/10 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
          <div className="font-bold text-white text-xs">{item.period}</div>
          <div className="text-brand-400 font-semibold">
            Revenue: ${item.revenue?.toLocaleString()}
          </div>
          <div className="text-accent-cyan font-semibold">
            Orders: {item.orders?.toLocaleString()}
          </div>
          <div className="text-slate-400 text-[11px]">
            AOV: ${item.avgOrderValue?.toFixed(2)} | Growth: {item.growthRate}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white">Revenue & Orders Trend</h3>
        </div>

        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-white/10 text-[11px]">
          <button
            onClick={() => setMetric('both')}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              metric === 'both' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setMetric('revenue')}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              metric === 'revenue' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setMetric('orders')}
            className={`px-2 py-1 rounded font-medium transition-colors ${
              metric === 'orders' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      <div className="w-full h-56 min-h-[224px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="period"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              yAxisId="left"
              hide={metric === 'orders'}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              hide={metric === 'revenue'}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {(metric === 'both' || metric === 'revenue') && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Gross Revenue ($)"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revGrad)"
              />
            )}

            {(metric === 'both' || metric === 'orders') && (
              <Line
                yAxisId={metric === 'orders' ? 'right' : 'right'}
                type="monotone"
                dataKey="orders"
                name="Total Orders"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#06b6d4' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
