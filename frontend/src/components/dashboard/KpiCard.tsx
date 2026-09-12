import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
  actionLabel?: string;
  onAction?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  variant = 'indigo',
  actionLabel,
  onAction,
}) => {
  const variantStyles = {
    indigo: {
      border: 'border-slate-800/80 hover:border-brand-500/40 hover:shadow-glow-indigo',
      iconBg: 'bg-brand-500/15 text-brand-400 border border-brand-500/25',
      actionBadge: 'text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border-brand-500/30',
      actionContext: 'Variance cause',
    },
    cyan: {
      border: 'border-slate-800/80 hover:border-accent-cyan/40 hover:shadow-glow-cyan',
      iconBg: 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25',
      actionBadge: 'text-accent-cyan bg-accent-cyan/10 hover:bg-accent-cyan/20 border-accent-cyan/30',
      actionContext: 'Order velocity',
    },
    emerald: {
      border: 'border-slate-800/80 hover:border-accent-emerald/40',
      iconBg: 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/25',
      actionBadge: 'text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 border-accent-emerald/30',
      actionContext: 'Cohort churn',
    },
    amber: {
      border: 'border-slate-800/80 hover:border-accent-amber/40',
      iconBg: 'bg-accent-amber/15 text-accent-amber border border-accent-amber/25',
      actionBadge: 'text-accent-amber bg-accent-amber/10 hover:bg-accent-amber/20 border-accent-amber/30',
      actionContext: 'Single-market',
    },
    rose: {
      border: 'border-slate-800/80 hover:border-accent-rose/40',
      iconBg: 'bg-accent-rose/15 text-accent-rose border border-accent-rose/25',
      actionBadge: 'text-accent-rose bg-accent-rose/10 hover:bg-accent-rose/20 border-accent-rose/30',
      actionContext: 'Holiday spike',
    },
    purple: {
      border: 'border-slate-800/80 hover:border-accent-purple/40',
      iconBg: 'bg-accent-purple/15 text-accent-purple border border-accent-purple/25',
      actionBadge: 'text-accent-purple bg-accent-purple/10 hover:bg-accent-purple/20 border-accent-purple/30',
      actionContext: 'SKU pricing',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      onClick={onAction ? onAction : undefined}
      className={`glass-panel glass-panel-hover rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between h-full min-h-[118px] group ${
        style.border
      } ${onAction ? 'cursor-pointer' : ''}`}
    >
      <div>
        {/* Card Header: Label & Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className={`p-1.5 rounded-lg ${style.iconBg}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Primary Value & Change */}
        <div className="mt-2.5 flex items-baseline justify-between">
          <div className="text-xl font-extrabold text-white tracking-tight font-sans">
            {value}
          </div>

          {change !== undefined && (
            <div className="flex items-center text-[10px] font-bold">
              {change >= 0 ? (
                <span className="flex items-center text-accent-emerald bg-accent-emerald/10 px-1.5 py-0.5 rounded border border-accent-emerald/20">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +{change}%
                </span>
              ) : (
                <span className="flex items-center text-accent-rose bg-accent-rose/10 px-1.5 py-0.5 rounded border border-accent-rose/20">
                  <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> {change}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      {actionLabel && (
        <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
          <span className="text-slate-400 group-hover:text-slate-200 transition-colors truncate">
            {style.actionContext}
          </span>
          <span
            className={`font-semibold px-1.5 py-0.5 rounded border flex items-center gap-0.5 transition-colors flex-shrink-0 ${style.actionBadge}`}
          >
            {actionLabel} <ArrowUpRight className="w-2.5 h-2.5" />
          </span>
        </div>
      )}
    </div>
  );
};
