import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import t4xLogo from "@/assets/t4x_logo.png";
import {
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Send, Bot, User,
  Sparkles, Shield, Anchor, Bell, Activity, Ship, Wrench, FileCheck,
  ClipboardList, ChevronDown, Circle, HardHat, CheckCircle, Clock, Target, ShoppingCart,
  Package, Filter, X, Check, Maximize2, Minimize2, Radio, BarChart3, Wallet,
  FileText, PieChart as PieChartIcon, Settings, Users, Cpu,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IotDashboard from "@/pages/IotDashboard";
import SurveyPlanner from "@/pages/SurveyPlanner";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import {
  getFleetSummary, qhseKpis, incidents, maintenanceKpis, maintenanceTasks,
  docKpis, certificateAlerts, opsKpis, incidentTrendData, pmsComplianceData,
  certStatusData, drillComplianceData, predefinedQuestions, aiResponses,
  fleets, vessels, getVesselsByFleet,
  incidentTypeDistribution, vesselStatusDistribution, maintenanceStatusDistribution, budgetUtilization,
  budgetVsActualData, budgetTrendMonthly,
  dryDockKpis, dryDockEntries, dryDockCostBreakdown,
  procurementKpis, procurementPipelineData, vendorPerformanceData,
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

function KpiCard({ label, value, unit, trend, severity, index, lastMonth, avg6m }: {
  label: string; value: string; unit: string; trend: number; severity: Severity; index: number; lastMonth?: string; avg6m?: string;
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
      {(lastMonth || avg6m) && (
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
          {lastMonth && (
            <div className="flex-1">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Last Month</p>
              <p className="text-xs font-semibold font-mono text-foreground">{lastMonth}</p>
            </div>
          )}
          {avg6m && (
            <div className="flex-1">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">6M Avg</p>
              <p className="text-xs font-semibold font-mono text-foreground">{avg6m}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Graph Summary Card ───
interface InsightCard { icon: typeof CheckCircle; label: string; value: string; detail: string; color: string }

function GraphSummary({ insights }: { insights: InsightCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
      {insights.map((ins, i) => (
        <div key={i} className={`rounded-lg border px-4 py-3 ${ins.color}`}>
          <div className="flex items-center gap-2 mb-1">
            <ins.icon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{ins.label}</span>
          </div>
          <p className="text-lg font-bold font-mono">{ins.value}</p>
          <p className="text-[10px] opacity-80">{ins.detail}</p>
        </div>
      ))}
    </div>
  );
}

const domains = [
  { id: "qhse", label: "QHSE & Incidents", icon: Shield },
  { id: "maintenance", label: "Maintenance & PMS", icon: Wrench },
  { id: "documents", label: "Documents & Compliance", icon: FileCheck },
  { id: "operations", label: "Operations", icon: ClipboardList },
  { id: "procurement", label: "Procurement", icon: ShoppingCart },
  { id: "drydock", label: "Dry Dock", icon: HardHat },
] as const;

type DomainId = (typeof domains)[number]["id"];

const chatCategories: Record<string, string> = {
  safety: "Safety & QHSE", maintenance: "Maintenance", documents: "Documents", operations: "Operations",
};
const chatCatColors: Record<string, string> = {
  safety: "bg-destructive/10 text-destructive border-destructive/20",
  maintenance: "bg-warning/10 text-warning border-warning/20",
  documents: "bg-info/10 text-info border-info/20",
  operations: "bg-success/10 text-success border-success/20",
};

// ─── Dashboard ───
export default function Dashboard() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFullscreen, setChatFullscreen] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<FleetName>(() => {
    const named = fleets.filter(f => f !== "All Fleets");
    return named[Math.floor(Math.random() * named.length)];
  });
  const [activeDomain, setActiveDomain] = useState<DomainId>("qhse");
  const [selectedVesselIds, setSelectedVesselIds] = useState<Set<string>>(new Set(vessels.map(v => v.id)));
  const [vesselFilterOpen, setVesselFilterOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Welcome to Smart Insights MIS. Ask questions about your fleet's safety, maintenance, compliance, or operations.", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeView, setActiveView] = useState<"dashboard" | "iot" | "survey">("dashboard");
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Close filter popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setVesselFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // When fleet changes, select all vessels in that fleet
  const fleetVessels = getVesselsByFleet(selectedFleet);
  useEffect(() => {
    setSelectedVesselIds(new Set(fleetVessels.map(v => v.id)));
  }, [selectedFleet]);

  const toggleVessel = (id: string) => {
    setSelectedVesselIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); } else next.add(id);
      return next;
    });
  };

  const selectAllVessels = () => setSelectedVesselIds(new Set(fleetVessels.map(v => v.id)));
  const deselectAllVessels = () => {
    if (fleetVessels.length > 0) setSelectedVesselIds(new Set([fleetVessels[0].id]));
  };

  // Filtered vessels based on selection
  const activeVessels = useMemo(() => fleetVessels.filter(v => selectedVesselIds.has(v.id)), [fleetVessels, selectedVesselIds]);
  const activeVesselNames = useMemo(() => new Set(activeVessels.map(v => v.name)), [activeVessels]);

  // Filter vessel-dependent data
  const filteredIncidents = useMemo(() => incidents.filter(i => activeVesselNames.has(i.vessel)), [activeVesselNames]);
  const filteredMaintenanceTasks = useMemo(() => maintenanceTasks.filter(t => activeVesselNames.has(t.vessel)), [activeVesselNames]);
  const filteredCertAlerts = useMemo(() => certificateAlerts.filter(c => activeVesselNames.has(c.vessel)), [activeVesselNames]);
  const filteredDryDockEntries = useMemo(() => dryDockEntries.filter(d => activeVesselNames.has(d.vessel)), [activeVesselNames]);
  const filteredPmsData = useMemo(() => pmsComplianceData.filter(p => activeVessels.some(v => v.name.includes(p.vessel))), [activeVessels]);

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
  const groupedQ = predefinedQuestions.reduce((a, q) => { (a[q.category] ??= []).push(q); return a; }, {} as Record<string, PredefinedQuestion[]>);

  const activeLabel = activeView === "dashboard" ? "Dashboard" : activeView === "iot" ? "IoT Sensors" : "Survey Planner";
  const breadcrumb = `User / ${activeLabel}`;

  const menuItems = [
    {
      label: "Documents", icon: FileText,
      items: [
        { label: "Documents & Compliance", action: () => { setActiveView("dashboard"); setActiveDomain("documents"); } },
        { label: "Certificate Alerts", action: () => { setActiveView("dashboard"); setActiveDomain("documents"); } },
      ],
    },
    {
      label: "Reports", icon: BarChart3,
      items: [
        { label: "MIS Dashboard", action: () => setActiveView("dashboard") },
        { label: "QHSE & Incidents", action: () => { setActiveView("dashboard"); setActiveDomain("qhse"); } },
        { label: "Operations", action: () => { setActiveView("dashboard"); setActiveDomain("operations"); } },
      ],
    },
    {
      label: "Procurement", icon: ShoppingCart,
      items: [
        { label: "Procurement Overview", action: () => { setActiveView("dashboard"); setActiveDomain("procurement"); } },
        { label: "Vendor Performance", action: () => { setActiveView("dashboard"); setActiveDomain("procurement"); } },
      ],
    },
    {
      label: "PMS", icon: Wrench,
      items: [
        { label: "Maintenance & PMS", action: () => { setActiveView("dashboard"); setActiveDomain("maintenance"); } },
        { label: "Dry Dock", action: () => { setActiveView("dashboard"); setActiveDomain("drydock"); } },
        { label: "Survey Planner", action: () => setActiveView("survey") },
      ],
    },
    {
      label: "Crewing", icon: Users,
      items: [
        { label: "Payroll Management", action: () => navigate("/payroll") },
        { label: "Crew Dashboard", action: () => navigate("/payroll") },
      ],
    },
    {
      label: "Vessel", icon: Ship,
      items: [
        { label: "Fleet Overview", action: () => setActiveView("dashboard") },
        { label: "IoT Sensors", action: () => setActiveView("iot") },
        { label: "Emissions Tracker", action: () => navigate("/emissions") },
      ],
    },
    {
      label: "Admin", icon: Settings,
      items: [
        { label: "User Management", action: () => {} },
        { label: "Settings", action: () => {} },
      ],
    },
    {
      label: "SA", icon: Shield,
      items: [
        { label: "Super Admin", action: () => {} },
        { label: "System Config", action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center h-12 px-4">
          {/* Logo */}
          <div className="flex items-center mr-6 shrink-0">
            <img src={t4xLogo} alt="Twenty4X Logo" className="h-8 w-auto object-contain" />
          </div>

          {/* Menu Items */}
          <nav className="flex items-center gap-0.5 flex-1">
            {menuItems.map((menu) => (
              <DropdownMenu key={menu.label}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent rounded-md transition-colors outline-none">
                    <menu.icon className="w-3.5 h-3.5" />
                    {menu.label}
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={4}>
                  {menu.items.map((item) => (
                    <DropdownMenuItem key={item.label} onClick={item.action} className="text-xs cursor-pointer">
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select value={selectedFleet} onChange={(e) => setSelectedFleet(e.target.value as FleetName)} className="appearance-none bg-muted pl-3 pr-7 py-1.5 text-[11px] font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring rounded-md border border-border">
                {fleets.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
            </div>
            <button className="relative p-1.5 rounded-md hover:bg-accent text-muted-foreground"><Bell className="w-4 h-4" /><span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full" /></button>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"><User className="w-3.5 h-3.5 text-primary-foreground" /></div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="px-4 py-1.5 border-t border-border bg-muted/30">
          <span className="text-[11px] text-muted-foreground">{breadcrumb}</span>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-5">
        {activeView === "iot" ? (
          <IotDashboard fleet={selectedFleet} />
        ) : activeView === "survey" ? (
          <SurveyPlanner />
        ) : (
          <div className="space-y-5 animate-fade-in-up">
            {/* Vessel Strip */}
            <div className="card-elevated p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{selectedFleet}</span>
                  <span className="text-[10px] text-muted-foreground">· {activeVessels.length}/{fleetVessels.length} selected</span>
                </div>
                <div>
                  <button onClick={() => setVesselFilterOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                    <Filter className="w-3 h-3" />
                    View All
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {fleetVessels.map((v) => (
                  <button key={v.id} onClick={() => toggleVessel(v.id)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${selectedVesselIds.has(v.id) ? "bg-primary/10 border border-primary/30 text-foreground" : "bg-muted/50 border border-transparent text-muted-foreground opacity-50"}`}>
                    <StatusDot status={v.status} />
                    <span className="font-medium">{v.name}</span>
                    <span className={selectedVesselIds.has(v.id) ? "text-muted-foreground" : "text-muted-foreground/50"}>{v.type}</span>
                  </button>
                ))}
              </div>
            </div>

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

            {/* Domain Tabs */}
            <div className="flex items-center gap-1 border-b border-border pb-0 overflow-x-auto">
              {domains.map((d) => (
                <button key={d.id} onClick={() => setActiveDomain(d.id)} className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-lg transition-all border-b-2 whitespace-nowrap ${activeDomain === d.id ? "border-secondary text-foreground bg-card" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  <d.icon className="w-4 h-4" />
                  {d.label}
                </button>
              ))}
            </div>

            {/* ═══════ QHSE ═══════ */}
            {activeDomain === "qhse" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {qhseKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Incident Trend */}
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
                    <GraphSummary insights={[
                      { icon: TrendingUp, label: "Proactive Reporting", value: "+183%", detail: "Near-miss reports up — strong safety culture", color: "bg-success/10 text-success border-success/20" },
                      { icon: TrendingDown, label: "Injury Reduction", value: "-33%", detail: "Medical cases dropped from 1 to 0 this quarter", color: "bg-info/10 text-info border-info/20" },
                      { icon: Target, label: "Target Gap", value: "0.08", detail: "LTIF 0.42 — only 0.08 above target of < 0.5", color: "bg-warning/10 text-warning border-warning/20" },
                    ]} />
                  </div>
                  {/* Drill Compliance */}
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
                    <GraphSummary insights={[
                      { icon: CheckCircle, label: "Proactive", value: "20%", detail: "Drills completed before scheduled time", color: "bg-success/10 text-success border-success/20" },
                      { icon: Clock, label: "Reactive", value: "30%", detail: "Completed after due date — needs attention", color: "bg-warning/10 text-warning border-warning/20" },
                      { icon: Target, label: "Scope of Improvement", value: "10%", detail: "Drills still due — compliance gap to close", color: "bg-destructive/10 text-destructive border-destructive/20" },
                    ]} />
                  </div>
                </div>
                {/* Donut Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Incident Type Distribution</h3>
                    <p className="text-xs text-muted-foreground mb-4">Year-to-date breakdown</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={incidentTypeDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={false}>
                            {incidentTypeDistribution.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, name]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value: string, entry: any) => `${value} (${entry.payload.value}%)`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: CheckCircle, label: "Positive Trend", value: "45%", detail: "Near-miss dominance indicates proactive reporting", color: "bg-success/10 text-success border-success/20" },
                      { icon: AlertTriangle, label: "Watch Area", value: "12%", detail: "Medical cases need root-cause analysis", color: "bg-warning/10 text-warning border-warning/20" },
                      { icon: Target, label: "Env. Risk", value: "10%", detail: "Environmental incidents — regulatory exposure", color: "bg-info/10 text-info border-info/20" },
                    ]} />
                  </div>
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Fleet Status</h3>
                    <p className="text-xs text-muted-foreground mb-4">Current vessel operational status</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={vesselStatusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" label={false}>
                            {vesselStatusDistribution.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [value, name]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value: string, entry: any) => `${value} (${entry.payload.value})`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: CheckCircle, label: "Operational", value: "75%", detail: "6 of 8 vessels fully operational", color: "bg-success/10 text-success border-success/20" },
                      { icon: Wrench, label: "In Dry Dock", value: "1", detail: "MV Narmada — scheduled maintenance", color: "bg-warning/10 text-warning border-warning/20" },
                      { icon: Anchor, label: "Anchored", value: "1", detail: "MT Chambal — awaiting berth allocation", color: "bg-muted text-muted-foreground border-border" },
                    ]} />
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
                      {filteredIncidents.map((inc) => (
                        <tr key={inc.id} className="border-b border-border/40 hover:bg-accent/20"><td className="px-5 py-2.5 text-xs text-muted-foreground font-mono">{inc.date}</td><td className="px-5 py-2.5 font-medium">{inc.vessel}</td><td className="px-5 py-2.5"><SeverityBadge severity={inc.severity} /></td><td className="px-5 py-2.5 text-xs text-muted-foreground">{inc.description}</td><td className="px-5 py-2.5 text-center"><span className={`text-[10px] font-semibold uppercase ${inc.status === "closed" ? "text-success" : "text-warning"}`}>{inc.status}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ═══════ MAINTENANCE ═══════ */}
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
                        <BarChart data={filteredPmsData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="vessel" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} width={60} />
                          <Tooltip contentStyle={tip} />
                          <Bar dataKey="completion" radius={[0, 4, 4, 0]} barSize={14}>
                            {filteredPmsData.map((e, i) => <Cell key={i} fill={e.completion >= 90 ? "hsl(152,55%,42%)" : e.completion >= 80 ? "hsl(38,92%,50%)" : e.completion === 0 ? "hsl(220,15%,85%)" : "hsl(0,72%,55%)"} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: CheckCircle, label: "Above Target", value: "3", detail: "Kaveri, Tapti, Mahanadi above 90% compliance", color: "bg-success/10 text-success border-success/20" },
                      { icon: AlertTriangle, label: "Below Target", value: "4", detail: "Vessels between 78-89% — need acceleration", color: "bg-warning/10 text-warning border-warning/20" },
                      { icon: Target, label: "Fleet Target", value: "95%", detail: "Current avg 87% — 8% gap to close", color: "bg-info/10 text-info border-info/20" },
                    ]} />
                  </div>
                  <div className="card-elevated overflow-hidden">
                    <div className="px-5 py-3 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Priority Tasks</h3></div>
                    <div className="divide-y divide-border/40">
                      {filteredMaintenanceTasks.map((t) => (
                        <div key={t.id} className="px-5 py-3 flex items-center justify-between hover:bg-accent/20">
                          <div>
                            <p className="text-xs font-medium text-foreground">{t.vessel} — {t.equipment}</p>
                            <p className="text-[11px] text-muted-foreground">{t.task}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-foreground">{t.dueDate}</span>
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${t.status === "overdue" ? "severity-high" : t.status === "upcoming" ? "severity-low" : "severity-medium"}`}>{t.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Maintenance Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Task Status Breakdown</h3>
                    <p className="text-xs text-muted-foreground mb-4">Current maintenance task distribution</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={maintenanceStatusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" label={false}>
                            {maintenanceStatusDistribution.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, name]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value: string, entry: any) => `${value} (${entry.payload.value}%)`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: CheckCircle, label: "On Track", value: "62%", detail: "Tasks completed within SLA", color: "bg-success/10 text-success border-success/20" },
                      { icon: Clock, label: "Pipeline", value: "28%", detail: "Upcoming tasks scheduled this month", color: "bg-info/10 text-info border-info/20" },
                      { icon: AlertTriangle, label: "Overdue", value: "10%", detail: "23 tasks past due — escalation needed", color: "bg-destructive/10 text-destructive border-destructive/20" },
                    ]} />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ DOCUMENTS ═══════ */}
            {activeDomain === "documents" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {docKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Certificate Status</h3>
                    <p className="text-xs text-muted-foreground mb-4">Fleet-wide certificate health</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={certStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={false}>
                            {certStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, name]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value: string, entry: any) => `${value} (${entry.payload.value}%)`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: CheckCircle, label: "Compliant", value: "78%", detail: "Certificates valid with >30 days remaining", color: "bg-success/10 text-success border-success/20" },
                      { icon: Clock, label: "Expiring Soon", value: "15%", detail: "7 certificates within 30-day window", color: "bg-warning/10 text-warning border-warning/20" },
                      { icon: AlertTriangle, label: "Critical Risk", value: "7%", detail: "3 unacknowledged — potential vessel detention", color: "bg-destructive/10 text-destructive border-destructive/20" },
                    ]} />
                  </div>
                  <div className="card-elevated overflow-hidden">
                    <div className="px-5 py-3 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Certificate Alerts</h3></div>
                    <div className="divide-y divide-border/40">
                      {filteredCertAlerts.filter((c) => c.daysRemaining <= 20).map((c) => (
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

            {/* ═══════ OPERATIONS ═══════ */}
            {activeDomain === "operations" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {opsKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Monthly Budget Trend */}
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Monthly OPEX Trend</h3>
                    <p className="text-xs text-muted-foreground mb-4">Budget vs Actual spend per month (USD '000)</p>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={budgetTrendMonthly}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tip} formatter={(value: number) => [`$${value}K`, ""]} />
                          <Area type="monotone" dataKey="budget" stroke="hsl(222,52%,23%)" fill="hsl(222,52%,23%)" fillOpacity={0.15} strokeWidth={2} name="Budget" />
                          <Area type="monotone" dataKey="actual" stroke="hsl(28,93%,54%)" fill="hsl(28,93%,54%)" fillOpacity={0.15} strokeWidth={2} name="Actual" />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: TrendingUp, label: "Peak Spend", value: "Jan", detail: "$1,420K actual vs $1,350K budget", color: "bg-warning/10 text-warning border-warning/20" },
                      { icon: CheckCircle, label: "Best Month", value: "Dec", detail: "$50K under budget — cost controls effective", color: "bg-success/10 text-success border-success/20" },
                      { icon: Target, label: "Avg Overrun", value: "4.2%", detail: "Consistent overspend — procurement review needed", color: "bg-info/10 text-info border-info/20" },
                    ]} />
                  </div>
                  {/* Budget Utilization Donut */}
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Budget Utilization</h3>
                    <p className="text-xs text-muted-foreground mb-4">OPEX distribution by category</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={budgetUtilization} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={false}>
                            {budgetUtilization.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, name]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value: string, entry: any) => `${value} (${entry.payload.value}%)`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: Target, label: "Largest Spend", value: "35%", detail: "Maintenance dominates — optimize vendor contracts", color: "bg-info/10 text-info border-info/20" },
                      { icon: CheckCircle, label: "Crew Efficiency", value: "28%", detail: "Crew cost stable — in line with benchmarks", color: "bg-success/10 text-success border-success/20" },
                      { icon: AlertTriangle, label: "Spares Risk", value: "18%", detail: "Rising spare costs — bulk procurement advised", color: "bg-warning/10 text-warning border-warning/20" },
                    ]} />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ PROCUREMENT ═══════ */}
            {activeDomain === "procurement" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {procurementKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Budget vs Actual */}
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Budget vs Actual (USD '000)</h3>
                    <p className="text-xs text-muted-foreground mb-4">Category-wise OPEX comparison — YTD</p>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={budgetVsActualData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} width={85} />
                          <Tooltip contentStyle={tip} formatter={(value: number) => [`$${value}K`, ""]} />
                          <Bar dataKey="budget" fill="hsl(222,52%,23%)" radius={[0,3,3,0]} barSize={10} name="Budget" />
                          <Bar dataKey="actual" fill="hsl(28,93%,54%)" radius={[0,3,3,0]} barSize={10} name="Actual" />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: TrendingDown, label: "Over Budget", value: "$830K", detail: "Maintenance, Spares & Bunkering exceeded budget", color: "bg-destructive/10 text-destructive border-destructive/20" },
                      { icon: CheckCircle, label: "Under Budget", value: "$120K", detail: "Crew, Insurance, Port & Admin within limits", color: "bg-success/10 text-success border-success/20" },
                      { icon: Target, label: "Net Variance", value: "-$710K", detail: "Total OPEX 6.8% over annual budget", color: "bg-warning/10 text-warning border-warning/20" },
                    ]} />
                  </div>
                  {/* Procurement Pipeline */}
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Procurement Pipeline</h3>
                    <p className="text-xs text-muted-foreground mb-4">Requisition status & value (USD '000)</p>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={procurementPipelineData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" />
                          <XAxis dataKey="status" tick={{ fontSize: 10, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tip} />
                          <Bar yAxisId="left" dataKey="count" fill="hsl(222,52%,23%)" radius={[3,3,0,0]} barSize={20} name="Orders" />
                          <Bar yAxisId="right" dataKey="value" fill="hsl(28,93%,54%)" radius={[3,3,0,0]} barSize={20} name="Value ($K)" />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: Package, label: "In Pipeline", value: "123", detail: "Active requisitions across all stages", color: "bg-info/10 text-info border-info/20" },
                      { icon: Clock, label: "In Transit", value: "18", detail: "$142K worth of orders en route to vessels", color: "bg-warning/10 text-warning border-warning/20" },
                      { icon: CheckCircle, label: "Delivered YTD", value: "156", detail: "$1.24M in completed orders this year", color: "bg-success/10 text-success border-success/20" },
                    ]} />
                  </div>
                </div>
                {/* Vendor Performance Donut */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Vendor Performance</h3>
                    <p className="text-xs text-muted-foreground mb-4">Supplier delivery & quality metrics</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={vendorPerformanceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" label={false}>
                            {vendorPerformanceData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, name]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value: string, entry: any) => `${value} (${entry.payload.value}%)`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: CheckCircle, label: "Reliable", value: "81%", detail: "On-time delivery rate — target 90%", color: "bg-success/10 text-success border-success/20" },
                      { icon: AlertTriangle, label: "Quality Issues", value: "8%", detail: "Returns & rejections — vendor audit needed", color: "bg-destructive/10 text-destructive border-destructive/20" },
                      { icon: Clock, label: "Delayed", value: "11%", detail: "Late deliveries impacting vessel operations", color: "bg-warning/10 text-warning border-warning/20" },
                    ]} />
                  </div>
                </div>
              </div>
            )}

            {/* ═══════ DRY DOCK ═══════ */}
            {activeDomain === "drydock" && (
              <div className="space-y-5 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {dryDockKpis.map((k, i) => <KpiCard key={k.id} {...k} index={i} />)}
                </div>
                {/* Dry Dock Schedule */}
                <div className="card-elevated overflow-hidden">
                  <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Dry Dock Schedule & Status</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-accent/30">
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Vessel</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Yard</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Period</th>
                      <th className="text-left px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Scope</th>
                      <th className="text-right px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Budget</th>
                      <th className="text-right px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actual</th>
                      <th className="text-center px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Progress</th>
                      <th className="text-center px-5 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    </tr></thead>
                    <tbody>
                      {filteredDryDockEntries.map((dd) => (
                        <tr key={dd.id} className="border-b border-border/40 hover:bg-accent/20">
                          <td className="px-5 py-2.5 font-medium text-xs">{dd.vessel}</td>
                          <td className="px-5 py-2.5 text-xs text-muted-foreground">{dd.yard}</td>
                          <td className="px-5 py-2.5 text-[11px] font-mono text-muted-foreground">{dd.startDate} → {dd.endDate}</td>
                          <td className="px-5 py-2.5 text-[11px] text-muted-foreground max-w-[200px] truncate">{dd.scope}</td>
                          <td className="px-5 py-2.5 text-xs font-mono text-right">${(dd.budgetUSD / 1000).toFixed(0)}K</td>
                          <td className="px-5 py-2.5 text-xs font-mono text-right">{dd.actualUSD > 0 ? `$${(dd.actualUSD / 1000).toFixed(0)}K` : "—"}</td>
                          <td className="px-5 py-2.5 text-center">
                            <div className="flex items-center gap-2 justify-center">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${dd.completionPct}%` }} />
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground">{dd.completionPct}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-2.5 text-center">
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${dd.status === "completed" ? "severity-low" : dd.status === "in-progress" ? "severity-medium" : "bg-info/10 text-info border-info/20"}`}>{dd.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Dry Dock Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Dry Dock Cost Breakdown</h3>
                    <p className="text-xs text-muted-foreground mb-4">Average cost distribution by work category</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dryDockCostBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={false}>
                            {dryDockCostBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, name]} />
                          <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value: string, entry: any) => `${value} (${entry.payload.value}%)`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: Target, label: "Major Cost", value: "55%", detail: "Hull & Machinery account for over half of dry dock spend", color: "bg-info/10 text-info border-info/20" },
                      { icon: CheckCircle, label: "Compliance", value: "15%", detail: "Class survey costs predictable & within norms", color: "bg-success/10 text-success border-success/20" },
                      { icon: AlertTriangle, label: "BWTS Rising", value: "12%", detail: "Environmental retrofits increasing — plan ahead", color: "bg-warning/10 text-warning border-warning/20" },
                    ]} />
                  </div>
                  {/* Dry Dock Budget vs Actual */}
                  <div className="card-elevated p-5">
                    <h3 className="text-sm font-semibold text-foreground mb-1">Dry Dock Budget vs Actual</h3>
                    <p className="text-xs text-muted-foreground mb-4">Per vessel cost comparison (USD '000)</p>
                    <div className="h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredDryDockEntries.filter(d => d.budgetUSD > 0).map(d => ({ vessel: d.vessel.replace("MV ", "").replace("MT ", ""), budget: Math.round(d.budgetUSD / 1000), actual: Math.round(d.actualUSD / 1000) }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,92%)" />
                          <XAxis dataKey="vessel" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tip} formatter={(value: number) => [`$${value}K`, ""]} />
                          <Bar dataKey="budget" fill="hsl(222,52%,23%)" radius={[3,3,0,0]} barSize={20} name="Budget" />
                          <Bar dataKey="actual" fill="hsl(28,93%,54%)" radius={[3,3,0,0]} barSize={20} name="Actual" />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <GraphSummary insights={[
                      { icon: AlertTriangle, label: "Overrun", value: "$35K", detail: "MT Chambal exceeded budget by 9% — valve overhaul", color: "bg-destructive/10 text-destructive border-destructive/20" },
                      { icon: CheckCircle, label: "On Track", value: "MV Narmada", detail: "Currently 78% done, 93% budget consumed — on target", color: "bg-success/10 text-success border-success/20" },
                      { icon: Target, label: "Annual Budget", value: "$2.04M", detail: "3 dry docks planned — 68% budget utilized YTD", color: "bg-info/10 text-info border-info/20" },
                    ]} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── Floating Chat Button ─── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          title="Ask Smart Insights AI"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* ─── Floating Chat Panel ─── */}
      {chatOpen && (
        <div className={`fixed z-[90] flex flex-col bg-card border border-border shadow-2xl animate-fade-in-up overflow-hidden transition-all duration-300 ${chatFullscreen ? "inset-0 rounded-none" : "bottom-6 right-6 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-5rem)] rounded-2xl"}`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground ${chatFullscreen ? "" : "rounded-t-2xl"}`}>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <p className="text-sm font-bold leading-none">Smart Insights AI</p>
                <p className="text-[10px] opacity-70 mt-0.5">Fleet Intelligence Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setChatFullscreen(f => !f)} className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors" title={chatFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                {chatFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => { setChatOpen(false); setChatFullscreen(false); }} className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isU = msg.role === "user";
              return (
                <div key={msg.id} className={`flex gap-2 animate-fade-in-up ${isU ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isU ? "bg-primary" : "bg-secondary"}`}>
                    {isU ? <User className="w-3.5 h-3.5 text-primary-foreground" /> : <Bot className="w-3.5 h-3.5 text-secondary-foreground" />}
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${isU ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                    {msg.content.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold mb-1">{line.replace(/\*\*/g, "")}</p>;
                      if (line.startsWith("| ")) return <p key={i} className="font-mono text-[10px] text-muted-foreground">{line}</p>;
                      if (/^[-\d⚠️🔴🟡📈📋📦]/.test(line.trim())) return <p key={i} className="ml-1 mb-0.5">{line}</p>;
                      if (!line.trim()) return <br key={i} />;
                      return <p key={i} className="mb-0.5">{line.replace(/\*\*/g, "")}</p>;
                    })}
                  </div>
                </div>
              );
            })}

            {/* Suggested Questions — inline in chat scroll area */}
            {!isTyping && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Suggested Questions</p>
                {Object.entries(groupedQ).flatMap(([cat, qs]) =>
                  qs.slice(0, 2).map((q) => (
                    <button key={q.id} onClick={() => handleSend(q.question, q.id)} className={`w-full text-left text-[11px] px-3 py-2 rounded-lg border font-medium transition-all hover:shadow-sm ${chatCatColors[cat]}`}>
                      {q.question}
                    </button>
                  ))
                )}
              </div>
            )}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-secondary-foreground" /></div>
                <div className="bg-accent rounded-xl px-3 py-2 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-subtle" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-subtle" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && handleSend(input)}
                placeholder="Ask about safety, maintenance, compliance…"
                className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button onClick={() => input.trim() && handleSend(input)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vessel Filter Modal */}
      {vesselFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setVesselFilterOpen(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-[600px] max-w-[90vw] max-h-[80vh] flex flex-col animate-fade-in-up" onClick={e => e.stopPropagation()} ref={filterRef}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-foreground">Select Vessels</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">{activeVessels.length} of {fleetVessels.length} vessels selected · {selectedFleet}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={selectAllVessels} className="text-[11px] font-medium text-primary hover:underline">Select All</button>
                <button onClick={deselectAllVessels} className="text-[11px] font-medium text-muted-foreground hover:underline">Clear All</button>
                <button onClick={() => setVesselFilterOpen(false)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground"><X className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fleetVessels.map(v => (
                  <label key={v.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${selectedVesselIds.has(v.id) ? "bg-primary/5 border-primary/30" : "bg-card border-border hover:bg-accent/50"}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selectedVesselIds.has(v.id) ? "bg-primary border-primary" : "border-input"}`} onClick={(e) => { e.preventDefault(); toggleVessel(v.id); }}>
                      {selectedVesselIds.has(v.id) && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <StatusDot status={v.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{v.name}</p>
                      <p className="text-[10px] text-muted-foreground">{v.type} · {v.fleet} · IMO {v.imo}</p>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${v.status === "operational" ? "severity-low" : v.status === "dry-dock" ? "severity-medium" : "bg-muted text-muted-foreground"}`}>{v.status}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-3 border-t border-border flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">{activeVessels.length}</span> vessels will be shown in dashboard</p>
              <button onClick={() => setVesselFilterOpen(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">Apply & Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
