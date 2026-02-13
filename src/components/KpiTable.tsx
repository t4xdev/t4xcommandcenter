import { getModuleKPIs, type ModuleName } from "@/data/kpiData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiTableProps {
  module: ModuleName;
}

export function KpiTable({ module }: KpiTableProps) {
  const kpis = getModuleKPIs(module);

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground">Detailed KPI Breakdown</h3>
        <p className="text-xs text-muted-foreground">{module} module — all features</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">#</th>
              <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Feature</th>
              <th className="text-left px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">KPIs</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Score</th>
              <th className="text-right px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
              <th className="text-center px-4 py-2.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((kpi) => {
              const TrendIcon = kpi.trend > 1 ? TrendingUp : kpi.trend < -1 ? TrendingDown : Minus;
              const trendColor = kpi.trend > 1 ? "text-success" : kpi.trend < -1 ? "text-destructive" : "text-muted-foreground";
              const statusDot = kpi.status === "good" ? "bg-success" : kpi.status === "warning" ? "bg-warning" : "bg-destructive";

              return (
                <tr key={kpi.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{kpi.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{kpi.feature}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {kpi.kpis.map((k) => (
                        <span key={k} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{k}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold">{kpi.value}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 ${trendColor}`}>
                      <TrendIcon className="w-3 h-3" />
                      <span className="text-xs font-mono">{kpi.trend > 0 ? "+" : ""}{kpi.trend}%</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${statusDot} mx-auto`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
