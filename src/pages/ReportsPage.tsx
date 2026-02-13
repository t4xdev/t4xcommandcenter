import { useState } from "react";
import { Download, TrendingUp, TrendingDown, Filter, Bot } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { drillDownMetrics } from "@/data/dashboardData";

export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const regions = ["all", ...new Set(drillDownMetrics.map((m) => m.region))];
  const departments = ["all", ...new Set(drillDownMetrics.map((m) => m.department))];

  const filtered = drillDownMetrics.filter((m) => {
    if (regionFilter !== "all" && m.region !== regionFilter) return false;
    if (deptFilter !== "all" && m.department !== deptFilter) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="Drill-Down Analytics" subtitle="Detailed metrics with AI-generated explanations" />

      <div className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">Filters:</span>
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {regions.map((r) => (
              <option key={r} value={r}>{r === "all" ? "All Regions" : r}</option>
            ))}
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {departments.map((d) => (
              <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>
            ))}
          </select>

          <button className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            <Download className="w-3.5 h-3.5" />
            Download Report
          </button>
        </div>

        {/* Metrics Table */}
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-accent/30">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Module</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Feature</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Metric</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Trend</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Region</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{m.id}</td>
                    <td className="px-5 py-3 font-medium">{m.module}</td>
                    <td className="px-5 py-3">{m.feature}</td>
                    <td className="px-5 py-3 text-muted-foreground">{m.metric}</td>
                    <td className="px-5 py-3 text-right font-mono font-semibold">{m.value}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`inline-flex items-center gap-0.5 ${m.trend > 0 ? "kpi-trend-up" : "kpi-trend-down"}`}>
                        {m.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span className="text-xs font-mono">{m.trend > 0 ? "+" : ""}{m.trend}%</span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs">{m.region}</td>
                    <td className="px-5 py-3 text-xs">{m.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="card-elevated p-5 border-l-4 border-secondary">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-semibold text-foreground">AI Analysis</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Based on the current filters, the data shows a mixed performance picture. <strong>Procurement cycle times</strong> have improved by 8%, 
            while <strong>PMS completion rates</strong> are declining at -5.4% — suggesting maintenance resource constraints. 
            The <strong>Inventory stockout rate</strong> increase of 15% correlates with the 2 critical spare parts flagged in the insights panel. 
            Recommend prioritizing emergency procurement for affected components.
          </p>
        </div>
      </div>
    </div>
  );
}
