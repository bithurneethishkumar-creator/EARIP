import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CustomerSegment } from '../../types';

interface SegmentDonutProps {
  segments: CustomerSegment[];
}

const COLORS: Record<string, string> = {
  'Regular Customers': '#6366f1',
  'Loyal Customers': '#06b6d4',
  'At-Risk': '#f59e0b',
  'VIP': '#10b981',
  'Hibernating': '#64748b',
};

export const SegmentDonut: React.FC<SegmentDonutProps> = ({ segments = [] }) => {
  const safeSegments = (segments || []).filter(Boolean);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-white/10 p-2.5 rounded-lg shadow-xl text-xs space-y-0.5">
          <div className="font-bold text-white text-xs">{data.segment}</div>
          <div className="text-slate-300 text-[11px]">
            {data.count?.toLocaleString()} accounts ({data.percentage}%)
          </div>
          <div className="text-slate-400 text-[10px]">
            Avg Spend: ${data.avgMonetary?.toLocaleString()}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-xl p-4 border border-white/10 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Customer RFM Segments</h3>
        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
          4,312 Total
        </span>
      </div>

      <div className="h-44 min-h-[176px] my-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeSegments}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={68}
              paddingAngle={3}
              dataKey="count"
              nameKey="segment"
            >
              {safeSegments.map((entry, index) => (
                <Cell
                  key={`cell-${entry.segment || index}`}
                  fill={COLORS[entry.segment] || '#a855f7'}
                  stroke="rgba(15,23,42,0.8)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Compact Legend Grid */}
      <div className="grid grid-cols-2 gap-1 pt-2 border-t border-white/5 text-[10px]">
        {safeSegments.map((seg) => (
          <div key={seg.segment} className="flex items-center justify-between p-1 rounded bg-slate-950/40">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[seg.segment] || '#a855f7' }}
              />
              <span className="text-slate-300 truncate text-[10px]">{seg.segment}</span>
            </div>
            <span className="text-white font-mono font-bold text-[10px] ml-1">{seg.count?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
