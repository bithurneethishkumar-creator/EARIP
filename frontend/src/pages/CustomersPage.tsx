import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Award, AlertCircle } from 'lucide-react';
import { CustomerSegment, CustomerItem } from '../types';
import { api } from '../services/api';

interface CustomersPageProps {
  segments: CustomerSegment[];
}

export const CustomersPage: React.FC<CustomersPageProps> = ({ segments = [] }) => {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadCustomers();
  }, [page, selectedSegment]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomers(page, 12, selectedSegment, searchQuery);
      setCustomers(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadCustomers();
  };

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'VIP':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'Loyal Customers':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'At-Risk':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Regular Customers':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Segment Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(segments || []).map((seg) => {
          const isAtRisk = seg.segment === 'At-Risk';
          const isVip = seg.segment === 'VIP';
          const isSelected = selectedSegment === seg.segment;
          return (
            <div
              key={seg.segment}
              onClick={() => {
                setSelectedSegment(isSelected ? 'All' : seg.segment);
                setPage(1);
              }}
              className={`glass-panel rounded-xl p-3 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-brand-500 bg-brand-500/10 shadow-sm'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-300 truncate">{seg.segment}</span>
                {isVip && <Award className="w-3.5 h-3.5 text-accent-emerald" />}
                {isAtRisk && <AlertCircle className="w-3.5 h-3.5 text-accent-amber" />}
              </div>
              <div className="text-xl font-bold text-white">{seg.count?.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{seg.percentage}% of total</div>

              <div className="mt-2 pt-2 border-t border-white/5 flex justify-between text-[10px] text-slate-400">
                <span>Avg: ${seg.avgMonetary?.toFixed(0)}</span>
                <span>{seg.avgRecency}d ago</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Table */}
      <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Customer Account Explorer</h3>
            <span className="text-[10px] font-mono text-slate-400">({totalCount} accounts)</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSegment}
              onChange={(e) => {
                setSelectedSegment(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="All">All Segments</option>
              {segments.map((s) => (
                <option key={s.segment} value={s.segment}>
                  {s.segment} ({s.count})
                </option>
              ))}
            </select>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search ID or Country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-white/10 text-xs text-white rounded-lg pl-7 pr-2.5 py-1.5 w-44 focus:outline-none focus:border-brand-500"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-2">Account ID</th>
                <th className="pb-2">RFM Tier</th>
                <th className="pb-2">Country</th>
                <th className="pb-2 text-right">Recency</th>
                <th className="pb-2 text-right">Orders</th>
                <th className="pb-2 text-right">Total Spend ($)</th>
                <th className="pb-2 text-right">AOV</th>
                <th className="pb-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400 font-sans">
                    Loading accounts...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400 font-sans">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.customerId} className="hover:bg-white/5 transition-colors">
                    <td className="py-2 text-white font-bold">#{c.customerId}</td>
                    <td className="py-2 font-sans">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${getSegmentBadge(c.segment)}`}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="py-2 text-slate-300 font-sans">{c.country}</td>
                    <td className="py-2 text-right text-slate-300">{c.recencyDays}d</td>
                    <td className="py-2 text-right text-slate-300">{c.frequencyOrders}</td>
                    <td className="py-2 text-right font-bold text-brand-400">
                      ${Number(c.monetaryTotal || 0).toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-slate-300">${Number(c.avgOrderValue || 0).toFixed(0)}</td>
                    <td className="py-2 text-right text-accent-cyan font-bold">{c.rfmScore}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
          <div>
            Page <span className="font-semibold text-white">{page}</span> of{' '}
            <span className="font-semibold text-white">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1 rounded bg-slate-900 border border-white/10 hover:bg-slate-850 disabled:opacity-40 transition-colors flex items-center gap-1 text-[11px]"
            >
              <ChevronLeft className="w-3 h-3" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded bg-slate-900 border border-white/10 hover:bg-slate-850 disabled:opacity-40 transition-colors flex items-center gap-1 text-[11px]"
            >
              Next <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
