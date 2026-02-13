import { TrendingUp, TrendingDown, AlertTriangle, ArrowRight } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import {
  kpiCards, revenueTrendData, ticketBacklogData, slaBreakdownData,
  costSpikeData, insightsData, type KpiItem, type InsightItem, type Severity,
} from "@/data/dashboardData";

function SeverityBadge({ severity }: { severity: Severity }) {
  const cls = {
    high: "severity-high",
    medium: "severity-medium",
    low: "severity-low",
  }[severity];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${cls}`}>
      {severity}
    </span>
  );
}

function KpiCard({ kpi, index }: { kpi: KpiItem; index: number }) {
  const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
  const isNegativeTrend = (kpi.trend === "up" && kpi.severity === "high") || (kpi.trend === "down" && kpi.severity === "low" && kpi.id === "delivery");
  const trendCls = isNegativeTrend ? "kpi-trend-down" : "kpi-trend-up";

  return (
    <div
      className="card-elevated p-5 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground leading-tight">{kpi.title}</p>
        <SeverityBadge severity={kpi.severity} />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground font-mono">{kpi.value}</p>
        <div className={`flex items-center gap-1 ${trendCls}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{kpi.change}%</span>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: InsightItem }) {
  return (
    <div className="card-elevated p-4 animate-slide-in-right">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {insight.severity === "high" && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
          <p className="text-xs font-semibold text-foreground">{insight.title}</p>
        </div>
        <SeverityBadge severity={insight.severity} />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.explanation}</p>
      <button className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline transition-colors">
        {insight.action}
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

const chartTooltipStyle = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(220, 15%, 90%)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(222, 52%, 15%)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

export default function DashboardHome() {
  const topInsights = insightsData.filter((i) => i.severity === "high" || i.severity === "medium").slice(0, 4);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <PageHeader title="Executive Overview" subtitle="Real-time KPI monitoring & smart insights" />

      <div className="flex-1 p-8 space-y-6 overflow-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiCards.map((kpi, i) => (
            <KpiCard key={kpi.id} kpi={kpi} index={i} />
          ))}
        </div>

        {/* Charts + Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Charts section - 3 cols */}
          <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground mb-4">Monthly revenue vs target (₹ Lakhs)</p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(222, 52%, 23%)" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(222, 52%, 23%)" }} />
                    <Line type="monotone" dataKey="target" stroke="hsl(28, 93%, 54%)" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ticket Backlog */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">Ticket Backlog Trend</h3>
              <p className="text-xs text-muted-foreground mb-4">Weekly open vs closed tickets</p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticketBacklogData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="open" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} barSize={18} name="Open" />
                    <Bar dataKey="closed" fill="hsl(152, 55%, 42%)" radius={[4, 4, 0, 0]} barSize={18} name="Closed" />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SLA Breakdown */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">SLA Breach Breakdown</h3>
              <p className="text-xs text-muted-foreground mb-4">Current compliance distribution</p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={slaBreakdownData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {slaBreakdownData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost Spike */}
            <div className="card-elevated p-5">
              <h3 className="text-sm font-semibold text-foreground mb-1">Cost Spike Detection</h3>
              <p className="text-xs text-muted-foreground mb-4">Daily actual vs baseline (₹ Lakhs)</p>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costSpikeData}>
                    <defs>
                      <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 92%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area type="monotone" dataKey="actual" stroke="hsl(0, 72%, 55%)" fill="url(#costGrad)" strokeWidth={2} name="Actual" />
                    <Area type="monotone" dataKey="baseline" stroke="hsl(220, 10%, 70%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="Baseline" />
                    <Legend wrapperStyle={{ fontSize: "11px" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Smart Insights Panel - 1 col */}
          <div className="xl:col-span-1 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-foreground">Smart Insights</h3>
              <span className="text-[10px] font-mono text-muted-foreground">AI-powered</span>
            </div>
            {topInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
