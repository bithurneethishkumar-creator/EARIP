import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  ShoppingBag,
  Globe,
  LineChart,
  AlertTriangle,
  Bot,
  Lightbulb,
  FileText,
  BrainCircuit,
  Database,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string, param?: string) => void;
  anomalyCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'rose' | 'amber';
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  anomalyCount = 4,
}) => {
  const sections: NavSection[] = [
    {
      title: 'Core Analytics',
      items: [
        {
          id: 'dashboard',
          label: 'Executive Overview',
          icon: LayoutDashboard,
        },
        {
          id: 'sales',
          label: 'Sales Intelligence',
          icon: TrendingUp,
        },
        {
          id: 'customers',
          label: 'Customer Intelligence',
          icon: Users,
          badge: '4.3k',
          badgeType: 'default',
        },
        {
          id: 'products',
          label: 'Product Intelligence',
          icon: ShoppingBag,
        },
        {
          id: 'geography',
          label: 'Geographic Intelligence',
          icon: Globe,
        },
      ],
    },
    {
      title: 'Decision Intelligence & AI',
      items: [
        {
          id: 'investigation',
          label: 'Insight Investigation',
          icon: BrainCircuit,
          badge: 'Root Cause',
          badgeType: 'amber',
          highlight: true,
        },
        {
          id: 'analyst',
          label: 'AI Business Analyst',
          icon: Bot,
          badge: 'Copilot',
          badgeType: 'accent',
          highlight: true,
        },
        {
          id: 'forecast',
          label: 'Revenue Forecast',
          icon: LineChart,
          badge: 'ML',
          badgeType: 'accent',
        },
        {
          id: 'anomalies',
          label: 'Anomaly Detection',
          icon: AlertTriangle,
          badge: String(anomalyCount),
          badgeType: 'rose',
        },
      ],
    },
    {
      title: 'Strategy & Operations',
      items: [
        {
          id: 'recommendations',
          label: 'Recommendations',
          icon: Lightbulb,
        },
        {
          id: 'reports',
          label: 'Reports & Export',
          icon: FileText,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col h-screen select-none z-30 transition-all duration-200 flex-shrink-0">
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-accent-cyan p-0.5 shadow-glow-indigo flex-shrink-0">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-white font-extrabold text-sm tracking-wider">
              E
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm text-white tracking-tight">EARIP</h1>
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">
              Enterprise Retail AI Platform
            </p>
          </div>
        </div>
      </div>

      {/* Grouped Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {section.title}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-900/30'
                      : item.highlight && item.id === 'investigation'
                      ? 'text-amber-200/90 hover:text-white hover:bg-amber-500/10 border border-amber-500/20'
                      : item.highlight && item.id === 'analyst'
                      ? 'text-cyan-200/90 hover:text-white hover:bg-cyan-500/10 border border-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {/* Left active line accent */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-accent-cyan" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : item.id === 'investigation'
                          ? 'text-accent-amber'
                          : item.id === 'analyst'
                          ? 'text-accent-cyan'
                          : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span className="truncate text-left whitespace-nowrap">{item.label}</span>
                  </div>

                  {/* Badges */}
                  {item.badge && (
                    <div className="flex items-center flex-shrink-0 ml-1.5">
                      {item.badgeType === 'rose' ? (
                        <span className="text-[9px] font-bold bg-accent-rose text-white px-1.5 py-0.5 rounded-full shadow-sm">
                          {item.badge}
                        </span>
                      ) : item.badgeType === 'amber' ? (
                        <span
                          className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : item.badgeType === 'accent' ? (
                        <span
                          className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        <span
                          className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-800 text-slate-300 border border-white/5'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Dataset & System Health Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Database className="w-3 h-3 text-brand-400" /> UCI Online Retail II
            </span>
            <span className="text-accent-emerald font-semibold flex items-center gap-1.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" /> Live
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>525,461 transactions</span>
            <span>4,312 accounts</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
