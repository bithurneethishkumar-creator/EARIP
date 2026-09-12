import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TopProduct } from '../../types';

interface TopProductsChartProps {
  products: TopProduct[];
}

export const TopProductsChart: React.FC<TopProductsChartProps> = ({ products = [] }) => {
  const safeProducts = (products || []).filter(Boolean);
  const top7 = safeProducts.slice(0, 6).map((p: any) => {
    const desc = String(p.description || p.Description || p.stockCode || 'Unknown SKU');
    const rev = Number(p.totalRevenue ?? p.total_revenue ?? 0);
    const qty = Number(p.totalQuantity ?? p.total_quantity ?? 0);
    const ret = Number(p.returnRate ?? p.return_rate ?? 0);
    const code = String(p.stockCode || p.StockCode || '');

    return {
      stockCode: code,
      description: desc,
      shortName: desc.length > 18 ? desc.slice(0, 16) + '...' : desc,
      revenue: rev,
      quantity: qty,
      returnRate: ret,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-white/10 p-2.5 rounded-lg shadow-xl text-xs space-y-0.5 max-w-xs">
          <div className="font-bold text-white text-xs truncate">{data.description}</div>
          <div className="text-slate-400 font-mono text-[10px]">SKU: {data.stockCode}</div>
          <div className="text-accent-cyan font-semibold">
            Revenue: ${data.revenue?.toLocaleString()}
          </div>
          <div className="text-slate-300 text-[11px]">
            Units: {data.quantity?.toLocaleString()} | Return Rate: {data.returnRate}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-white">Top Revenue Generating SKUs</h3>
        <span className="text-[10px] text-slate-400 font-mono">Ranked by Volume</span>
      </div>

      <div className="w-full h-48 min-h-[192px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top7} layout="vertical" margin={{ top: 5, right: 25, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            />
            <YAxis
              type="category"
              dataKey="shortName"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
              {top7.map((p, index) => (
                <Cell
                  key={`cell-${p.stockCode || index}`}
                  fill={index === 0 ? '#6366f1' : index === 1 ? '#06b6d4' : '#818cf8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
