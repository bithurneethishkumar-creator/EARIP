import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { BusinessInsight } from '../types';

interface RecommendationsPageProps {
  insights: BusinessInsight[];
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ insights = [] }) => {
  return (
    <div className="space-y-4 pb-8">
      <div className="glass-panel rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white tracking-tight">AI Strategic Recommendations</h2>
          <span className="text-[10px] font-mono text-slate-400">({insights.length} Interventions)</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
          Prescriptive Strategy
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((item: any) => {
          const isCritical = item.businessImpact === 'Critical' || item.business_impact === 'Critical';
          const isHigh = item.businessImpact === 'High' || item.business_impact === 'High';
          const impact = String(item.businessImpact || item.business_impact || 'Medium');
          const title = String(item.title || '');
          const finding = String(item.insightText || item.insight_text || '');
          const rec = String(item.recommendationText || item.recommendation_text || '');
          const cat = String(item.category || 'General');
          const status = String(item.status || 'Active');

          return (
            <div
              key={item.id}
              className={`glass-panel rounded-xl p-4 border transition-all flex flex-col justify-between ${
                isCritical
                  ? 'border-brand-500/40 bg-brand-500/5'
                  : 'border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-white/10">
                      {cat}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400'
                          : isHigh
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {impact} Impact
                    </span>
                  </div>
                  <span className="text-[11px] text-accent-emerald font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">{title}</h3>

                <div className="mt-2 p-2.5 rounded-lg bg-slate-950/50 text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-slate-200 block mb-0.5">Finding:</strong>
                  {finding}
                </div>

                <div className="mt-2 p-2.5 rounded-lg bg-brand-500/10 border border-brand-500/20 text-[11px] text-slate-200 leading-relaxed">
                  <strong className="text-brand-300 block mb-0.5">Action Plan:</strong>
                  {rec}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-end text-xs">
                <button className="flex items-center gap-1 text-accent-cyan hover:text-white font-semibold transition-colors text-[11px]">
                  Rollout Action <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
