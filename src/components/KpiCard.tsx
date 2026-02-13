import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPI } from "@/data/kpiData";

interface KpiCardProps {
  kpi: KPI;
}

export function KpiCard({ kpi }: KpiCardProps) {
  const statusColor = {
    good: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
  }[kpi.status];

  const statusBg = {
    good: "bg-success/10",
    warning: "bg-warning/10",
    critical: "bg-destructive/10",
  }[kpi.status];

  const TrendIcon = kpi.trend > 1 ? TrendingUp : kpi.trend < -1 ? TrendingDown : Minus;
  const trendColor = kpi.trend > 1 ? "text-success" : kpi.trend < -1 ? "text-destructive" : "text-muted-foreground";

  return (
    <div className="glass-card p-4 hover:glow-border transition-all duration-300 group animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">#{kpi.id}</p>
          <h3 className="text-sm font-semibold text-foreground mt-1 truncate">{kpi.feature}</h3>
        </div>
        <div className={`${statusBg} ${statusColor} px-2 py-0.5 rounded-full text-xs font-medium`}>
          {kpi.value}%
        </div>
      </div>

      {/* Mini bar */}
      <div className="w-full h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            kpi.status === "good" ? "bg-success" : kpi.status === "warning" ? "bg-warning" : "bg-destructive"
          }`}
          style={{ width: `${kpi.value}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {kpi.kpis.slice(0, 2).map((k) => (
            <span key={k} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {k}
            </span>
          ))}
        </div>
        <div className={`flex items-center gap-0.5 ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="text-[10px] font-mono">{kpi.trend > 0 ? "+" : ""}{kpi.trend}%</span>
        </div>
      </div>
    </div>
  );
}
