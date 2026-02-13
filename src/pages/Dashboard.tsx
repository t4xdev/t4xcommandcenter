import { useState, useRef, useEffect } from "react";
import {
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Send, Bot, User,
  Sparkles, Shield, Anchor, Bell, Search, Activity,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import {
  kpiCards, revenueTrendData, ticketBacklogData, slaBreakdownData,
  costSpikeData, insightsData, predefinedQuestions, aiResponses,
  type KpiItem, type InsightItem, type Severity, type ChatMessage, type PredefinedQuestion,
} from "@/data/dashboardData";

// ─── Shared helpers ───
function SeverityBadge({ severity }: { severity: Severity }) {
  const cls = { high: "severity-high", medium: "severity-medium", low: "severity-low" }[severity];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${cls}`}>
      {severity}
    </span>
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

const categoryColors: Record<string, string> = {
  operations: "bg-info/10 text-info border-info/20",
  finance: "bg-warning/10 text-warning border-warning/20",
  sales: "bg-success/10 text-success border-success/20",
  leadership: "bg-secondary/10 text-secondary border-secondary/20",
};

const categoryLabels: Record<string, string> = {
  operations: "Operations",
  finance: "Finance",
  sales: "Sales",
  leadership: "Leadership",
};

// ─── Main Dashboard ───
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "chat">("overview");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Welcome! Select a question or type your own query for AI-powered insights.", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string, questionId?: string) => {
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = questionId && aiResponses[questionId]
        ? aiResponses[questionId]
        : "I'm analyzing your query against the latest data. Please select one of the predefined questions for detailed insights, or refine your query with specific metric names.";
      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200);
  };

  const groupedQuestions = predefinedQuestions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, PredefinedQuestion[]>);

  const topInsights = insightsData.filter((i) => i.severity === "high" || i.severity === "medium").slice(0, 4);
  const totalKPIs = kpiCards.length;
  const avgScore = "82%";
  const criticalCount = kpiCards.filter((k) => k.severity === "high").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Anchor className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Smart Insights <span className="text-gradient-brand">MIS</span></h1>
              <p className="text-[11px] text-muted-foreground">KPI Performance Dashboard</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-accent rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "overview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Executive Overview
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === "chat" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AI Analytics Chat
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 card-elevated px-3 py-1.5">
              <Activity className="w-3.5 h-3.5 text-secondary" />
              <span className="text-[11px] font-mono text-muted-foreground">{totalKPIs} KPIs</span>
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] font-mono text-foreground font-semibold">{avgScore} avg</span>
            </div>
            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 card-elevated px-3 py-1.5 border-destructive/30">
                <Shield className="w-3.5 h-3.5 text-destructive" />
                <span className="text-[11px] font-mono text-destructive font-semibold">{criticalCount} critical</span>
              </div>
            )}
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {activeTab === "overview" ? (
          <div className="space-y-6 animate-fade-in-up">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {kpiCards.map((kpi, i) => {
                const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown;
                const isNeg = (kpi.trend === "up" && kpi.severity === "high") || (kpi.trend === "down" && kpi.id === "delivery");
                return (
                  <div key={kpi.id} className="card-elevated p-5 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-xs font-medium text-muted-foreground leading-tight">{kpi.title}</p>
                      <SeverityBadge severity={kpi.severity} />
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-2xl font-bold text-foreground font-mono">{kpi.value}</p>
                      <div className={`flex items-center gap-1 ${isNeg ? "kpi-trend-down" : "kpi-trend-up"}`}>
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{kpi.change}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts + Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue */}
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
                {/* Tickets */}
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
                {/* SLA */}
                <div className="card-elevated p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">SLA Breach Breakdown</h3>
                  <p className="text-xs text-muted-foreground mb-4">Current compliance distribution</p>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={slaBreakdownData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                          {slaBreakdownData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip contentStyle={chartTooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Cost */}
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

              {/* Smart Insights Panel */}
              <div className="xl:col-span-1 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-foreground">Smart Insights</h3>
                  <span className="text-[10px] font-mono text-muted-foreground">AI-powered</span>
                </div>
                {topInsights.map((insight) => (
                  <div key={insight.id} className="card-elevated p-4 animate-slide-in-right">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {insight.severity === "high" && <AlertTriangle className="w-3.5 h-3.5 text-destructive" />}
                        <p className="text-xs font-semibold text-foreground">{insight.title}</p>
                      </div>
                      <SeverityBadge severity={insight.severity} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.explanation}</p>
                    <button className="flex items-center gap-1 text-xs font-medium text-secondary hover:underline">
                      {insight.action} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ─── Chat Tab ─── */
          <div className="flex gap-6 h-[calc(100vh-120px)] animate-fade-in-up">
            {/* Chat Window */}
            <div className="flex-1 flex flex-col card-elevated overflow-hidden">
              <div className="flex-1 overflow-auto p-6 space-y-4">
                {messages.map((msg) => {
                  const isUser = msg.role === "user";
                  return (
                    <div key={msg.id} className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? "bg-primary" : "bg-secondary"}`}>
                        {isUser ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-secondary-foreground" />}
                      </div>
                      <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                      }`}>
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold mb-1">{line.replace(/\*\*/g, "")}</p>;
                          if (line.startsWith("| ")) return <p key={i} className="font-mono text-[11px] text-muted-foreground">{line}</p>;
                          if (/^[-\d]/.test(line.trim())) return <p key={i} className="ml-2 mb-0.5">{line}</p>;
                          if (line.trim() === "") return <br key={i} />;
                          return <p key={i} className="mb-1">{line.replace(/\*\*/g, "")}</p>;
                        })}
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="bg-accent rounded-xl px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && input.trim() && handleSend(input)}
                    placeholder="Type your analytics query..."
                    className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => input.trim() && handleSend(input)}
                    className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Predefined Questions */}
            <div className="w-72 shrink-0 overflow-auto hidden lg:block">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-semibold text-foreground">Quick Analytics</h3>
              </div>
              {Object.entries(groupedQuestions).map(([category, questions]) => (
                <div key={category} className="mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    {categoryLabels[category]}
                  </p>
                  <div className="space-y-1.5">
                    {questions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleSend(q.question, q.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 hover:shadow-sm ${categoryColors[category]}`}
                      >
                        {q.question}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
