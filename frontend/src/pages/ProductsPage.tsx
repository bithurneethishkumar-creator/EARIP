import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { TopProduct } from '../types';

interface ProductsPageProps {
  products: TopProduct[];
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products = [] }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'quantity' | 'returnRate'>('revenue');

  const safeProducts = (products || []).filter(Boolean);
  const q = (search || '').toLowerCase().trim();

  const filtered = safeProducts
    .filter((p: any) => {
      const desc = String(p?.description || p?.Description || '').toLowerCase();
      const code = String(p?.stockCode || p?.StockCode || '').toLowerCase();
      return desc.includes(q) || code.includes(q);
    })
    .sort((a: any, b: any) => {
      const aRev = Number(a?.totalRevenue ?? a?.total_revenue ?? 0);
      const bRev = Number(b?.totalRevenue ?? b?.total_revenue ?? 0);
      const aQty = Number(a?.totalQuantity ?? a?.total_quantity ?? 0);
      const bQty = Number(b?.totalQuantity ?? b?.total_quantity ?? 0);
      const aRet = Number(a?.returnRate ?? a?.return_rate ?? 0);
      const bRet = Number(b?.returnRate ?? b?.return_rate ?? 0);

      if (sortBy === 'quantity') return bQty - aQty;
      if (sortBy === 'returnRate') return bRet - aRet;
      return bRev - aRev;
    });

  return (
    <div className="space-y-4 pb-8">
      {/* Header Controls */}
      <div className="glass-panel rounded-xl p-3.5 border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white tracking-tight">Product SKUs & Inventory Performance</h2>
          <span className="text-[10px] font-mono text-slate-400">({filtered.length} SKUs)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter SKU or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg pl-7 pr-2.5 py-1.5 w-48 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="quantity">Sort by Volume</option>
            <option value="returnRate">Sort by Return Rate</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="pb-2">SKU Code</th>
              <th className="pb-2">Description</th>
              <th className="pb-2 text-right">Revenue ($)</th>
              <th className="pb-2 text-right">Units Sold</th>
              <th className="pb-2 text-right">Orders</th>
              <th className="pb-2 text-right">Unit Price</th>
              <th className="pb-2 text-right">Return Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {filtered.map((p: any) => {
              const code = String(p.stockCode || p.StockCode || '');
              const desc = String(p.description || p.Description || 'Unknown SKU');
              const rev = Number(p.totalRevenue ?? p.total_revenue ?? 0);
              const qty = Number(p.totalQuantity ?? p.total_quantity ?? 0);
              const ord = Number(p.orderCount ?? p.order_count ?? 0);
              const price = Number(p.avgUnitPrice ?? p.avg_unit_price ?? 0);
              const ret = Number(p.returnRate ?? p.return_rate ?? 0);
              const isHighReturn = ret > 5.0;

              return (
                <tr key={code} className="hover:bg-white/5 transition-colors">
                  <td className="py-2 font-bold text-accent-cyan">{code}</td>
                  <td className="py-2 text-white font-sans max-w-sm truncate">{desc}</td>
                  <td className="py-2 text-right font-bold text-brand-400">${rev.toLocaleString()}</td>
                  <td className="py-2 text-right text-slate-300">{qty.toLocaleString()}</td>
                  <td className="py-2 text-right text-slate-400">{ord.toLocaleString()}</td>
                  <td className="py-2 text-right text-slate-300">${price.toFixed(2)}</td>
                  <td className="py-2 text-right">
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isHighReturn ? 'bg-rose-500/15 text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {ret}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
