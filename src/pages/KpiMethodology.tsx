import { useState } from "react";
import { Search, BookOpen, Calculator, Info } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { kpiMeasurements, type KpiMeasurement } from "@/data/kpiMeasurements";

export default function KpiMethodology() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const modules = ["all", ...new Set(kpiMeasurements.map((m) => m.module))];

  const filtered = kpiMeasurements.filter((m) => {
    if (moduleFilter !== "all" && m.module !== moduleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.feature.toLowerCase().includes(q) ||
        m.kpi.toLowerCase().includes(q) ||
        m.howToMeasure.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group by feature
  const grouped = filtered.reduce((acc, m) => {
    if (!acc[m.feature]) acc[m.feature] = [];
    acc[m.feature].push(m);
    return acc;
  }, {} as Record<string, KpiMeasurement[]>);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="KPI Methodology" subtitle="Measurement definitions, formulas, and data sources" />

      <div className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search KPIs, features, or formulas..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {modules.map((m) => (
              <button
                key={m}
                onClick={() => setModuleFilter(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  moduleFilter === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                {m === "all" ? "All Modules" : m}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card-elevated p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total KPIs Defined</p>
              <p className="text-xl font-bold font-mono text-foreground">{kpiMeasurements.length}</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Calculator className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">With Formulas</p>
              <p className="text-xl font-bold font-mono text-foreground">{kpiMeasurements.filter((m) => m.formula).length}</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Info className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">With Methodology</p>
              <p className="text-xl font-bold font-mono text-foreground">{kpiMeasurements.filter((m) => m.howToMeasure).length}</p>
            </div>
          </div>
        </div>

        {/* KPI Cards grouped by feature */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([feature, kpis]) => (
            <div key={feature} className="card-elevated overflow-hidden animate-fade-in-up">
              <div className="px-5 py-3 border-b border-border bg-accent/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{feature}</h3>
                  <p className="text-[10px] text-muted-foreground">{kpis[0].module} Module</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{kpis.length} KPI{kpis.length > 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y divide-border/50">
                {kpis.map((kpi, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">{kpi.kpi}</h4>
                    </div>
                    {kpi.howToMeasure && (
                      <div className="mb-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">How to Measure</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{kpi.howToMeasure}</p>
                      </div>
                    )}
                    {kpi.formula && (
                      <div className="bg-primary/5 border border-primary/10 rounded-md px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Formula</p>
                        <p className="text-xs font-mono text-foreground">{kpi.formula}</p>
                      </div>
                    )}
                    {!kpi.howToMeasure && !kpi.formula && (
                      <p className="text-xs text-muted-foreground/60 italic">Methodology not yet defined</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(grouped).length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No KPIs match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
