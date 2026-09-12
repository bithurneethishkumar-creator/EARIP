import React from 'react';
import { TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react';
import { Anomaly } from '../types';

interface AnomaliesPageProps {
  anomalies: Anomaly[];
}

export const AnomaliesPage: React.FC<AnomaliesPageProps> = ({ anomalies = [] }) => {
  return (
    <div className="space-y-4 pb-8">
      <div className="glass-panel rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white tracking-tight">Anomaly Detection Diagnostics</h2>
          <span className="text-[10px] font-mono text-slate-400">({anomalies.length} Flagged Events)</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
          Z-Score & IQR Outlier Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {anomalies.map((a: any) => {
          const isSpike = (a.deviationPct ?? a.deviation_pct ?? 0) > 0;
          const isHigh = a.severity === 'HIGH';
          const dev = Number(a.deviationPct ?? a.deviation_pct ?? 0);
          const act = Number(a.actualValue ?? a.actual_value ?? 0);
          const exp = Number(a.expectedValue ?? a.expected_value ?? 0);
          const date = String(a.detectedDate ?? a.detected_date ?? '');
          const metric = String(a.metricName ?? a.metric_name ?? '');
          const type = String(a.anomalyType ?? a.anomaly_type ?? '');
          const root = String(a.rootCauseAnalysis ?? a.root_cause_analysis ?? '');
          const action = String(a.recommendedAction ?? a.recommended_action ?? '');

          return (
            <div
              key={a.id}
              className={`glass-panel rounded-xl p-4 border transition-all ${
                isHigh ? 'border-rose-500/30' : 'border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="font-mono text-slate-400">{date}</span>
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded ${
                        isHigh ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {a.severity}
                    </span>
                    <span className="text-slate-400">{type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{metric}</h3>
                </div>

                <div className={`p-1.5 rounded-lg ${isHigh ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'}`}>
                  {isSpike ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-950/50 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Actual</span>
                  <span className="font-bold text-white">${act.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Expected</span>
                  <span className="text-slate-300">${exp.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Deviation</span>
                  <span className={`font-bold ${isSpike ? 'text-accent-rose' : 'text-accent-amber'}`}>
                    {dev > 0 ? `+${dev}%` : `${dev}%`}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 space-y-1.5 text-[11px]">
                <p className="text-slate-300 leading-relaxed"><strong className="text-slate-200">Root Cause:</strong> {root}</p>
                <p className="text-accent-cyan leading-relaxed"><strong className="text-accent-cyan">Mitigation:</strong> {action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
