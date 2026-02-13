import { Activity, Anchor, Shield } from "lucide-react";
import { kpiData } from "@/data/kpiData";

export function DashboardHeader() {
  const totalKPIs = kpiData.length;
  const avgScore = Math.round(kpiData.reduce((s, k) => s + k.value, 0) / totalKPIs);
  const criticalCount = kpiData.filter((k) => k.status === "critical").length;

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Anchor className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                Twenty4x <span className="text-gradient">Analytics</span>
              </h1>
              <p className="text-xs text-muted-foreground">KPI Performance Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 glass-card px-3 py-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-muted-foreground">{totalKPIs} KPIs</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs font-mono text-foreground font-semibold">{avgScore}% avg</span>
            </div>
            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 glass-card px-3 py-2 border-destructive/30">
                <Shield className="w-4 h-4 text-destructive" />
                <span className="text-xs font-mono text-destructive font-semibold">{criticalCount} critical</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
