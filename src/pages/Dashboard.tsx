import { useState, useRef, useEffect } from "react";
import {
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Send, Bot, User,
  Sparkles, Shield, Anchor, Bell, Activity, Ship, Wrench, FileCheck,
  ClipboardList, ChevronDown, Circle,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import {
  getFleetSummary, qhseKpis, incidents, maintenanceKpis, maintenanceTasks,
  docKpis, certificateAlerts, opsKpis, incidentTrendData, pmsComplianceData,
  certStatusData, drillComplianceData, predefinedQuestions, aiResponses,
  fleets, getVesselsByFleet,
  incidentTypeDistribution, vesselStatusDistribution, maintenanceStatusDistribution, budgetUtilization,
  type Severity, type FleetName, type ChatMessage, type PredefinedQuestion,
} from "@/data/maritimeData";

// ─── Helpers ───
function SeverityBadge({ severity }: { severity: Severity }) {
  const cls = { high: "severity-high", medium: "severity-medium", low: "severity-low" }[severity];
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${cls}`}>{severity}</span>;
}

function StatusDot({ status }: { status: string }) {
  const color = status === "operational" ? "text-success" : status === "dry-dock" ? "text-warning" : "text-muted-foreground";
  return <Circle className={`w-2.5 h-2.5 fill-current ${color}`} />;
}

const tip = {
  backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 15%, 90%)",
  borderRadius: "8px", fontSize: "12px", color: "hsl(222, 52%, 15%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

function KpiCard({ label, value, unit, trend, severity, index }: {
  label: string; value: string; unit: string; trend: number; severity: Severity; index: number;
}) {
  const isNeg = (trend > 0 && severity === "high") || (trend < 0 && severity !== "low");
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Activity;
  return (
    <div className="card-elevated p-4 animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <p className="text-[11px] font-medium text-muted-foreground mb-2 leading-tight">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xl font-bold text-foreground font-mono">{value}</span>
          <span className="text-[10px] text-muted-foreground ml-1">{unit}</span>
        </div>
        <div className={`flex items-center gap-0.5 ${isNeg ? "kpi-trend-down" : trend !== 0 ? "kpi-trend-up" : "text-muted-foreground"}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="text-[10px] font-mono font-semibold">{trend > 0 ? "+" : ""}{trend}%</span>
        </div>
      </div>
    </div>
  );
}

const domains = [
  { id: "qhse", label: "QHSE & Incidents", icon: Shield },
  { id: "maintenance", label: "Maintenance & PMS", icon: Wrench },
  { id: "documents", label: "Documents & Compliance", icon: FileCheck },
  { id: "operations", label: "Operations & Procurement", icon: ClipboardList },
] as const;

type DomainId = (typeof domains)[number]["id"];

const chatCategories: Record<string, string> = {
  safety: "Safety & QHSE",
  maintenance: "Maintenance",
  documents: "Documents",
  operations: "Operations",
};
const chatCatColors: Record<string, string> = {
  safety: "bg-destructive/10 text-destructive border-destructive/20",
  maintenance: "bg-warning/10 text-warning border-warning/20",
  documents: "bg-info/10 text-info border-info/20",
  operations: "bg-success/10 text-success border-success/20",
};

// ─── Dashboard ───
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "chat">("overview");
  const [selectedFleet, setSelectedFleet] = useState<FleetName>("All Fleets");
  const [activeDomain, setActiveDomain] = useState<DomainId>("qhse");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Welcome to Smart Insights MIS. Ask questions about your fleet's safety, maintenance, compliance, or operations.", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text: string, qid?: string) => {
    setMessages((p) => [...p, { id: `u-${Date.now()}`, role: "user", content: text, timestamp: new Date() }]);
    setInput(""); setIsTyping(true);
    setTimeout(() => {
      const resp = qid && aiResponses[qid] ? aiResponses[qid] : "Analyzing fleet data for your query. For detailed insights, select a predefined question from the panel.";
      setMessages((p) => [...p, { id: `a-${Date.now()}`, role: "assistant", content: resp, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200);
  };

  const summary = getFleetSummary();
  const fleetVessels = getVesselsByFleet(selectedFleet);
  const groupedQ = predefinedQuestions.reduce((a, q) => { (a[q.category] ??= []).push(q); return a; }, {} as Record<string, PredefinedQuestion[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Anchor className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Smart Insights <span className="text-gradient-brand">MIS</span></h1>
              <p className="text-[10px] text-muted-foreground">Maritime Fleet Analytics</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-accent rounded-lg p-0.5">
            <button onClick={() => setActiveTab("overview")} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "overview" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              Fleet Overview
            </button>
            <button onClick={() => setActiveTab("chat")} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === "chat" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              AI Analytics
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Fleet Selector */}
            <div className="relative">
              <select
                value={selectedFleet}
                onChange={(e) => setSelectedFleet(e.target.value as FleetName)}
                className="appearance-none card-elevated pl-3 pr-8 py-1.5 text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
              >
                {fleets.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground"><Bell className="w-4 h-4" /><span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" /></button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><User className="w-4 h-4 text-primary-foreground" /></div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-5">
        {activeTab === "overview" ? (
          <div className="space-y-5 animate-fade-in-up">
            {/* Fleet Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {summary.map((s, i) => (
                <div key={s.label} className="card-elevated p-4 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <p className="text-[11px] font-medium text-muted-foreground mb-1">{s.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold text-foreground font-mono">{s.value}</span>
                    <SeverityBadge severity={s.severity} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Vessel Strip */}
            <div className="card-elevated p-3">
              <div className="flex items-center gap-2 mb-2">
                <Ship className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">{selectedFleet}</span>
                <span className="text-[10px] text-muted-foreground">· {fleetVessels.length} vessels</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {fleetVessels.map((v) => (
                  <div key={v.id} className="flex items-center gap-1.5 bg-accent px-2.5 py-1 rounded-md text-xs">
                    <StatusDot status={v.status} />
                    <span className="font-medium text-foreground">{v.name}</span>
                    <span className="text-muted-foreground">{v.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Tabs */}
            <div className="flex items-center gap-1 border-b border-border pb-0">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setActiveDomain(d.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all border-b-2 ${
                    activeDomain === d.id
                      ? "border-secondary text-foreground bg-card"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <d.icon className="w-4 h-4" />
                  {d.label}
                </button>
              ))}
            </div>

            {/* Domain Content */}
            {activeDomain === "qhse" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {qhseKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Incident Trend</h3>
                    <p className="text-xs text-muted-foreground mb-4">Monthly near-miss vs injuries</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incidentTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tip} />
                          <Bar dataKey="nearMiss" fill="hsl(38,92%,50%)" radius={[3,3,0,0]} barSize={16} name="Near Miss" />
                          <Bar dataKey="firstAid" fill="hsl(28,93%,54%)" radius={[3,3,0,0]} barSize={16} name="First Aid" />
                          <Bar dataKey="medical" fill="hsl(0,72%,55%)" radius={[3,3,0,0]} barSize={16} name="Medical" />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Drill Compliance</h3>
                    <p className="text-xs text-muted-foreground mb-4">Monthly drill completion rate (%)</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={drillComplianceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} domain={[85, 100]} />
                          <Tooltip contentStyle={tip} />
                          <Line type="monotone" dataKey="fire" stroke="hsl(0,72%,55%)" strokeWidth={2} dot={{ r: 3 }} name="Fire Drill" />
                          <Line type="monotone" dataKey="abandon" stroke="hsl(28,93%,54%)" strokeWidth={2} dot={{ r: 3 }} name="Abandon Ship" />
                          <Line type="monotone" dataKey="man_overboard" stroke="hsl(222,52%,23%)" strokeWidth={2} dot={{ r: 3 }} name="Man Overboard" />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                {/* Donut Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Incident Type Distribution</h3>
                    <p className="text-xs text-muted-foreground mb-4">Year-to-date breakdown</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={incidentTypeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                            {incidentTypeDistribution.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Fleet Status</h3>
                    <p className="text-xs text-muted-foreground mb-4">Current vessel operational status</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={vesselStatusDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                            {vesselStatusDistribution.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                {/* Recent Incidents */}
                <div className="card-elevated overflow-hidden">
                  <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-semibold text-foreground">Recent Incidents</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-accent/30">
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Vessel</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                      <th className="text-center px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr></thead>
                    <tbody>
                      {incidents.map((inc) => (
                        <tr key={inc.id} className="border-b border-border/40 hover:bg-accent/20"><td className="px-5 py-2.5 text-xs text-muted-foreground font-mono">{inc.date}</td><td className="px-5 py-2.5 font-medium">{inc.vessel}</td><td className="px-5 py-2.5"><SeverityBadge severity={inc.severity} /></td><td className="px-5 py-2.5 text-xs text-muted-foreground">{inc.description}</td><td className="px-5 py-2.5 text-center"><span className={`text-[10px] font-semibold uppercase ${inc.status === "closed" ? "text-success" : "text-warning"}`}>{inc.status}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeDomain === "maintenance" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {maintenanceKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">PMS Completion by Vessel</h3>
                    <p className="text-xs text-muted-foreground mb-4">Current month task completion (%)</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={pmsComplianceData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="vessel" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} width={60} />
                          <Tooltip contentStyle={tip} />
                          <Bar dataKey="completion" radius={[0, 4, 4, 0]} barSize={14}>
                            {pmsComplianceData.map((e, i) => <Cell key={i} fill={e.completion >= 90 ? "hsl(152,55%,42%)" : e.completion >= 80 ? "hsl(38,92%,50%)" : e.completion === 0 ? "hsl(220,15%,85%)" : "hsl(0,72%,55%)"} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card-elevated overflow-hidden">
                    <div className="px-5 py-3 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Priority Tasks</h3></div>
                    <div className="divide-y divide-border/40">
                      {maintenanceTasks.map((t) => (
                        <div key={t.id} className="px-5 py-3 flex items-center justify-between hover:bg-accent/20">
                          <div>
                            <p className="text-xs font-medium text-foreground">{t.vessel} — {t.equipment}</p>
                            <p className="text-[11px] text-muted-foreground">{t.task}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{t.dueDate}</span>
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                              t.status === "overdue" ? "severity-high" : t.status === "upcoming" ? "severity-low" : "severity-medium"
                            }`}>{t.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Maintenance Donut Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Task Status Breakdown</h3>
                    <p className="text-xs text-muted-foreground mb-4">Current maintenance task distribution</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={maintenanceStatusDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                            {maintenanceStatusDistribution.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDomain === "documents" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {docKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Certificate Status</h3>
                    <p className="text-xs text-muted-foreground mb-4">Fleet-wide certificate health</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={certStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                            {certStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card-elevated overflow-hidden">
                    <div className="px-5 py-3 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Certificate Alerts</h3></div>
                    <div className="divide-y divide-border/40">
                      {certificateAlerts.filter((c) => c.daysRemaining <= 20).map((c) => (
                        <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-accent/20">
                          <div>
                            <p className="text-xs font-medium text-foreground">{c.vessel} — {c.certificate}</p>
                            <p className="text-[10px] text-muted-foreground">Expires: {c.expiryDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold font-mono ${c.daysRemaining <= 10 ? "text-destructive" : "text-warning"}`}>{c.daysRemaining}d</span>
                            <span className={`text-[10px] ${c.acknowledged ? "text-success" : "text-destructive"}`}>{c.acknowledged ? "✓ Ack" : "✗ Pending"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDomain === "operations" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {opsKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Budget Utilization</h3>
                    <p className="text-xs text-muted-foreground mb-4">OPEX distribution by category</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={budgetUtilization} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                            {budgetUtilization.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ─── AI Chat ─── */
          <div className="flex gap-5 h-[calc(100vh-100px)] animate-fade-in-up">
            <div className="flex-1 flex flex-col card-elevated overflow-hidden">
              <div className="flex-1 overflow-auto p-5 space-y-4">
                {messages.map((msg) => {
                  const isU = msg.role === "user";
                  return (
                    <div key={msg.id} className={`flex gap-3 animate-fade-in-up ${isU ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isU ? "bg-primary" : "bg-secondary"}`}>
                        {isU ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-secondary-foreground" />}
                      </div>
                      <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${isU ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                        {msg.content.split("\n").map((line, i) => {
                          if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold mb-1">{line.replace(/\*\*/g, "")}</p>;
                          if (line.startsWith("| ")) return <p key={i} className="font-mono text-[11px] text-muted-foreground">{line}</p>;
                          if (/^[-\d⚠️🔴🟡📈📋📦]/.test(line.trim())) return <p key={i} className="ml-2 mb-0.5">{line}</p>;
                          if (!line.trim()) return <br key={i} />;
                          return <p key={i} className="mb-1">{line.replace(/\*\*/g, "")}</p>;
                        })}
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"><Bot className="w-4 h-4 text-secondary-foreground" /></div><div className="bg-accent rounded-xl px-4 py-3 flex gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" /><span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "150ms" }} /><span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "300ms" }} /></div></div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && handleSend(input)} placeholder="Ask about fleet safety, maintenance, compliance..." className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <button onClick={() => input.trim() && handleSend(input)} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
            <div className="w-72 shrink-0 overflow-auto hidden lg:block">
              <div className="flex items-center gap-2 mb-4"><Sparkles className="w-4 h-4 text-secondary" /><h3 className="text-sm font-semibold text-foreground">Quick Insights</h3></div>
              {Object.entries(groupedQ).map(([cat, qs]) => (
                <div key={cat} className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{chatCategories[cat]}</p>
                  <div className="space-y-1.5">
                    {qs.map((q) => <button key={q.id} onClick={() => handleSend(q.question, q.id)} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all hover:shadow-sm ${chatCatColors[cat]}`}>{q.question}</button>)}
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
