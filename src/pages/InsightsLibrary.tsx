import { useState } from "react";
import { Search, Filter, ArrowRight, AlertTriangle, TrendingUp, Shield } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { insightsData, type InsightItem, type Severity } from "@/data/dashboardData";

const severityIcon = {
  high: AlertTriangle,
  medium: Shield,
  low: TrendingUp,
};

const categoryLabels: Record<string, string> = {
  ops: "Operations",
  finance: "Finance",
  sales: "Sales",
  product: "Product",
};

export default function InsightsLibrary() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filtered = insightsData.filter((i) => {
    if (severityFilter !== "all" && i.severity !== severityFilter) return false;
    if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.explanation.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="Insights Library" subtitle="Searchable repository of AI-generated insights" />

      <div className="flex-1 p-8 space-y-6 overflow-auto">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["all", "high", "medium", "low"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  severityFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {["all", "ops", "finance", "sales"].map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  categoryFilter === c
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                {c === "all" ? "All" : categoryLabels[c] || c}
              </button>
            ))}
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((insight, i) => {
            const Icon = severityIcon[insight.severity];
            const severityCls = `severity-${insight.severity}`;
            return (
              <div
                key={insight.id}
                className="card-elevated p-5 animate-fade-in-up flex flex-col"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${insight.severity === "high" ? "text-destructive" : insight.severity === "medium" ? "text-warning" : "text-success"}`} />
                    <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${severityCls}`}>
                    {insight.severity}
                  </span>
                </div>

                {insight.metric && (
                  <div className="bg-accent/50 rounded-md px-3 py-1.5 mb-3">
                    <p className="text-xs font-mono font-semibold text-foreground">{insight.metric}</p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{insight.explanation}</p>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[10px] text-muted-foreground">{insight.date}</span>
                  <button className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline">
                    View Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No insights match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
