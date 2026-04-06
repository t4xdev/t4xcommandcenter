import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  BarChart3, Ship, FileText, AlertTriangle, GitCompare, Settings,
  TrendingUp, TrendingDown, Fuel, Leaf, Activity, ChevronDown,
  ChevronRight, Eye, Download, Plus, Search, Filter, Check,
  Clock, MapPin, Anchor, Navigation, AlertCircle, Info, XCircle,
  CheckCircle, ArrowUpRight, ArrowDownRight, MoreVertical,
  Thermometer, Droplets, Wind, Gauge, FileCheck, Users, Calendar,
  Upload, Paperclip, Save, X, Bell, ArrowLeft,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  vesselProfiles, voyageReports, vesselEmissionSummaries, emissionAlerts,
  fleetMonthlyTrend, fleetFuelBreakdown, emissionsByActivity, vesselDailyTrend,
  emissionFactors, calculateEmissions,
  type VesselProfile, type VoyageReport, type EmissionAlert, type FuelType, type ReportType,
} from "@/data/emissionsData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const tip = {
  backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 15%, 90%)",
  borderRadius: "8px", fontSize: "11px", color: "hsl(222, 52%, 15%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const COLORS = [
  "hsl(var(--primary))", "hsl(var(--info))", "hsl(var(--warning))", "hsl(var(--success))",
  "hsl(var(--destructive))", "hsl(var(--accent))",
];

type Page = "overview" | "vessels" | "vessel-detail" | "data-entry" | "reports" | "alerts" | "benchmarks" | "settings";

// ─── KPI Card ───
function EmKpiCard({ label, value, unit, icon: Icon, trend, color }: {
  label: string; value: string; unit: string; icon: typeof Fuel; trend?: number; color?: string;
}) {
  return (
    <div className="card-elevated p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${color || "bg-primary/10"}`}>
          <Icon className={`w-4 h-4 ${color ? "" : "text-primary"}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-[10px] font-semibold ${trend < 0 ? "text-success" : trend > 0 ? "text-destructive" : "text-muted-foreground"}`}>
            {trend < 0 ? <ArrowDownRight className="w-3 h-3" /> : trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : null}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold font-mono text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

// ─── Fleet Overview ───
function FleetOverview({ onViewVessel }: { onViewVessel: (id: string) => void }) {
  const totalFuel = vesselEmissionSummaries.reduce((s, v) => s + v.totalFuel, 0);
  const totalCO2 = vesselEmissionSummaries.reduce((s, v) => s + v.totalCO2, 0);
  const totalDistance = vesselEmissionSummaries.reduce((s, v) => s + v.distanceNM, 0);
  const avgCO2PerNM = totalDistance > 0 ? totalCO2 / totalDistance : 0;

  const sorted = [...vesselEmissionSummaries].sort((a, b) => b.totalCO2 - a.totalCO2);
  const best = [...vesselEmissionSummaries].filter(v => v.distanceNM > 0).sort((a, b) => a.co2PerNM - b.co2PerNM);

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <EmKpiCard label="Total Fuel Consumed" value={totalFuel.toFixed(1)} unit="MT" icon={Fuel} trend={-2.4} color="bg-warning/10" />
        <EmKpiCard label="Total CO₂ Emissions" value={totalCO2.toFixed(1)} unit="tCO₂" icon={Leaf} trend={-1.8} color="bg-success/10" />
        <EmKpiCard label="Avg CO₂ / NM" value={avgCO2PerNM.toFixed(3)} unit="tCO₂/NM" icon={Activity} trend={3.2} color="bg-info/10" />
        <EmKpiCard label="Active Vessels" value={vesselProfiles.filter(v => v.status === "active").length.toString()} unit="vessels" icon={Ship} color="bg-primary/10" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Emissions Trend */}
        <div className="card-elevated p-4 lg:col-span-2">
          <h3 className="text-xs font-semibold text-foreground mb-3">Fleet Emissions Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={fleetMonthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tip} />
              <Area type="monotone" dataKey="totalCO2" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" name="CO₂ (tCO₂)" />
              <Area type="monotone" dataKey="totalFuel" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.1)" name="Fuel (MT)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fuel Breakdown */}
        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Fuel Type Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={fleetFuelBreakdown} cx="50%" cy="50%" outerRadius={65} innerRadius={35} dataKey="consumed" nameKey="fuelType" paddingAngle={2}>
                {fleetFuelBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {fleetFuelBreakdown.map((f, i) => (
              <div key={f.fuelType} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-muted-foreground">{f.fuelType} ({f.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emissions by Activity + Vessel Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Emissions by Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={emissionsByActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="activity" type="category" tick={{ fontSize: 10 }} width={80} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tip} />
              <Bar dataKey="co2" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="CO₂ (tCO₂)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Vessel Emissions Ranking</h3>
          <div className="space-y-2">
            {sorted.slice(0, 5).map((v, i) => (
              <button key={v.vesselId} onClick={() => onViewVessel(v.vesselId)} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors text-left">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-destructive/10 text-destructive" : i < 3 ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                  <div>
                    <p className="text-xs font-medium text-foreground">{v.vesselName}</p>
                    <p className="text-[10px] text-muted-foreground">{v.vesselClass}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold font-mono text-foreground">{v.totalCO2.toFixed(1)} tCO₂</p>
                  <div className={`flex items-center gap-0.5 text-[10px] ${v.trend < 0 ? "text-success" : "text-destructive"}`}>
                    {v.trend < 0 ? <ArrowDownRight className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                    {Math.abs(v.trend)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Preview */}
      <div className="card-elevated p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-foreground">Recent Alerts</h3>
          <span className="text-[10px] text-muted-foreground">{emissionAlerts.filter(a => !a.acknowledged).length} unacknowledged</span>
        </div>
        <div className="space-y-2">
          {emissionAlerts.filter(a => !a.acknowledged).slice(0, 3).map(alert => (
            <div key={alert.id} className={`flex items-start gap-3 p-2 rounded-lg border ${alert.severity === "critical" ? "border-destructive/30 bg-destructive/5" : alert.severity === "warning" ? "border-warning/30 bg-warning/5" : "border-border bg-muted/30"}`}>
              {alert.severity === "critical" ? <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" /> : <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{alert.vesselName}</p>
                <p className="text-[11px] text-muted-foreground">{alert.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{alert.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Vessels List ───
function VesselsList({ onViewVessel }: { onViewVessel: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const filtered = vesselEmissionSummaries.filter(v =>
    (classFilter === "all" || v.vesselClass === classFilter) &&
    v.vesselName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vessels..." className="w-full pl-9 pr-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="text-xs bg-muted border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="all">All Classes</option>
          <option value="Tanker">Tanker</option>
          <option value="Bulk Carrier">Bulk Carrier</option>
          <option value="Container">Container</option>
          <option value="Offshore Support">Offshore Support</option>
          <option value="AHTS">AHTS</option>
        </select>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Vessel</th>
              <th className="text-left py-2.5 px-3 font-semibold text-muted-foreground">Class</th>
              <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Fuel (MT)</th>
              <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">CO₂ (tCO₂)</th>
              <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">CO₂/NM</th>
              <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Distance</th>
              <th className="text-right py-2.5 px-3 font-semibold text-muted-foreground">Trend</th>
              <th className="text-center py-2.5 px-3 font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.vesselId} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                <td className="py-2.5 px-3 font-medium text-foreground">{v.vesselName}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{v.vesselClass}</td>
                <td className="py-2.5 px-3 text-right font-mono">{v.totalFuel.toFixed(1)}</td>
                <td className="py-2.5 px-3 text-right font-mono font-semibold">{v.totalCO2.toFixed(1)}</td>
                <td className="py-2.5 px-3 text-right font-mono">{v.distanceNM > 0 ? v.co2PerNM.toFixed(3) : "—"}</td>
                <td className="py-2.5 px-3 text-right font-mono">{v.distanceNM} NM</td>
                <td className="py-2.5 px-3 text-right">
                  <span className={`inline-flex items-center gap-0.5 ${v.trend < 0 ? "text-success" : "text-destructive"}`}>
                    {v.trend < 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {Math.abs(v.trend)}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <button onClick={() => onViewVessel(v.vesselId)} className="px-2 py-1 text-[10px] font-medium bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Vessel Detail ───
function VesselDetail({ vesselId, onBack }: { vesselId: string; onBack: () => void }) {
  const vessel = vesselProfiles.find(v => v.id === vesselId);
  const summary = vesselEmissionSummaries.find(v => v.vesselId === vesselId);
  const reports = voyageReports.filter(r => r.vesselId === vesselId);

  if (!vessel || !summary) return <div className="text-muted-foreground text-sm">Vessel not found</div>;

  const sisterVessels = vesselEmissionSummaries.filter(v => v.vesselClass === vessel.vesselClass && v.vesselId !== vesselId && v.distanceNM > 0);
  const sisterAvgCO2PerNM = sisterVessels.length > 0 ? sisterVessels.reduce((s, v) => s + v.co2PerNM, 0) / sisterVessels.length : 0;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Vessels
      </button>

      {/* Vessel Header */}
      <div className="card-elevated p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">{vessel.name}</h2>
            <p className="text-xs text-muted-foreground">IMO {vessel.imo} · {vessel.vesselClass} · {vessel.flag} · {vessel.dwt.toLocaleString()} DWT · Built {vessel.built}</p>
          </div>
          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${vessel.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{vessel.status.replace("_", " ")}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <EmKpiCard label="Total Fuel" value={summary.totalFuel.toFixed(1)} unit="MT" icon={Fuel} color="bg-warning/10" />
        <EmKpiCard label="Total CO₂" value={summary.totalCO2.toFixed(1)} unit="tCO₂" icon={Leaf} trend={summary.trend} color="bg-success/10" />
        <EmKpiCard label="CO₂ / NM" value={summary.distanceNM > 0 ? summary.co2PerNM.toFixed(3) : "—"} unit="tCO₂/NM" icon={Navigation} color="bg-info/10" />
        <EmKpiCard label="Distance" value={summary.distanceNM.toLocaleString()} unit="NM" icon={MapPin} color="bg-primary/10" />
        <EmKpiCard label="Voyages" value={summary.voyageCount.toString()} unit="reports" icon={FileText} color="bg-accent/50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Daily Fuel & Emissions</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={vesselDailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tip} />
              <Line type="monotone" dataKey="co2" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="CO₂ (tCO₂)" />
              <Line type="monotone" dataKey="fuel" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="Fuel (MT)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3">Sister Vessel Benchmark</h3>
          {sisterVessels.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground mb-1">This Vessel CO₂/NM</p>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (summary.co2PerNM / (sisterAvgCO2PerNM * 1.5)) * 100)}%` }} />
                  </div>
                  <p className="text-xs font-bold font-mono mt-1">{summary.co2PerNM.toFixed(3)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground mb-1">Sister Vessel Avg</p>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-info rounded-full" style={{ width: `${Math.min(100, (sisterAvgCO2PerNM / (sisterAvgCO2PerNM * 1.5)) * 100)}%` }} />
                  </div>
                  <p className="text-xs font-bold font-mono mt-1">{sisterAvgCO2PerNM.toFixed(3)}</p>
                </div>
              </div>
              <p className={`text-[11px] font-medium ${summary.co2PerNM < sisterAvgCO2PerNM ? "text-success" : "text-destructive"}`}>
                {summary.co2PerNM < sisterAvgCO2PerNM ? "✓ Performing better than" : "⚠ Performing worse than"} sister vessel average by {Math.abs(((summary.co2PerNM - sisterAvgCO2PerNM) / sisterAvgCO2PerNM) * 100).toFixed(1)}%
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No sister vessels to compare</p>
          )}
        </div>
      </div>

      {/* Voyage Reports Table */}
      <div className="card-elevated p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3">Voyage Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Voyage</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Route</th>
                <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Type</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Distance</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground">Fuel</th>
                <th className="text-right py-2 px-2 font-semibold text-muted-foreground">CO₂</th>
                <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => {
                const em = calculateEmissions(r.fuelEntries, r.distanceNM, r.hoursUnderway + r.hoursDp + r.hoursStandby);
                return (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="py-2 px-2 font-medium">{r.voyageNo}</td>
                    <td className="py-2 px-2 text-muted-foreground">{r.departurePort} → {r.arrivalPort}</td>
                    <td className="py-2 px-2"><span className="px-1.5 py-0.5 bg-muted rounded text-[10px] capitalize">{r.reportType.replace("_", " ")}</span></td>
                    <td className="py-2 px-2 text-right font-mono">{r.distanceNM} NM</td>
                    <td className="py-2 px-2 text-right font-mono">{em.totalFuel.toFixed(1)} MT</td>
                    <td className="py-2 px-2 text-right font-mono font-semibold">{em.totalCO2.toFixed(1)}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${r.status === "approved" ? "bg-success/10 text-success" : r.status === "reviewed" ? "bg-info/10 text-info" : "bg-warning/10 text-warning"}`}>{r.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Data Entry ───
function DataEntry() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vesselId: "", date: "", voyageNo: "", reportType: "underway" as ReportType,
    departurePort: "", arrivalPort: "", distanceNM: "", hoursUnderway: "", hoursInPort: "",
    hoursStandby: "", hoursDp: "", fuelType: "VLSFO" as FuelType, openingROB: "", received: "", closingROB: "",
    meHours: "", aeHours: "", boilerHours: "", remarks: "",
  });

  const consumed = (Number(formData.openingROB) || 0) + (Number(formData.received) || 0) - (Number(formData.closingROB) || 0);
  const ef = emissionFactors.find(f => f.fuelType === formData.fuelType);
  const estimatedCO2 = consumed > 0 && ef ? consumed * ef.co2Factor : 0;

  const handleSubmit = () => {
    if (!formData.vesselId || !formData.date || !formData.voyageNo) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Report Submitted", description: `Voyage ${formData.voyageNo} report submitted successfully` });
    setFormData({
      vesselId: "", date: "", voyageNo: "", reportType: "underway",
      departurePort: "", arrivalPort: "", distanceNM: "", hoursUnderway: "", hoursInPort: "",
      hoursStandby: "", hoursDp: "", fuelType: "VLSFO", openingROB: "", received: "", closingROB: "",
      meHours: "", aeHours: "", boilerHours: "", remarks: "",
    });
  };

  const Field = ({ label, name, type = "text", required = false, placeholder = "" }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) => (
    <div>
      <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input type={type} value={(formData as any)[name]} onChange={e => setFormData(p => ({ ...p, [name]: e.target.value }))}
        placeholder={placeholder} className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Submit Voyage / Noon Report</h2>
        {consumed > 0 && (
          <div className="card-elevated px-3 py-2 flex items-center gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Est. Fuel Consumed</p>
              <p className="text-sm font-bold font-mono text-foreground">{consumed.toFixed(1)} MT</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-[10px] text-muted-foreground">Est. CO₂</p>
              <p className="text-sm font-bold font-mono text-primary">{estimatedCO2.toFixed(1)} tCO₂</p>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Ship className="w-3.5 h-3.5 text-primary" /> Basic Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Vessel <span className="text-destructive">*</span></label>
              <select value={formData.vesselId} onChange={e => setFormData(p => ({ ...p, vesselId: e.target.value }))} className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select vessel</option>
                {vesselProfiles.filter(v => v.status === "active").map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <Field label="Date" name="date" type="date" required />
            <Field label="Voyage No." name="voyageNo" required placeholder="e.g. KV-2026-013" />
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Report Type</label>
              <select value={formData.reportType} onChange={e => setFormData(p => ({ ...p, reportType: e.target.value as ReportType }))} className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="underway">Underway</option>
                <option value="in_port">In Port</option>
                <option value="standby">Standby</option>
                <option value="dp">DP Operations</option>
                <option value="cargo_ops">Cargo Ops</option>
                <option value="manoeuvring">Manoeuvring</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-info" /> Voyage & Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Departure Port" name="departurePort" placeholder="e.g. Mumbai" />
            <Field label="Arrival Port" name="arrivalPort" placeholder="e.g. Kochi" />
            <Field label="Distance (NM)" name="distanceNM" type="number" />
            <Field label="Hours Underway" name="hoursUnderway" type="number" />
            <Field label="Hours in Port" name="hoursInPort" type="number" />
            <Field label="Hours Standby" name="hoursStandby" type="number" />
            <Field label="DP Hours" name="hoursDp" type="number" />
          </div>
        </div>

        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5 text-warning" /> Fuel Consumption</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Fuel Type</label>
              <select value={formData.fuelType} onChange={e => setFormData(p => ({ ...p, fuelType: e.target.value as FuelType }))} className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="HFO">HFO</option>
                <option value="VLSFO">VLSFO</option>
                <option value="MGO">MGO</option>
                <option value="MDO">MDO</option>
                <option value="LNG">LNG</option>
              </select>
            </div>
            <Field label="Opening ROB (MT)" name="openingROB" type="number" />
            <Field label="Fuel Received (MT)" name="received" type="number" />
            <Field label="Closing ROB (MT)" name="closingROB" type="number" />
            <div className="flex items-end">
              <div className="w-full px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-[9px] text-muted-foreground uppercase">Consumed</p>
                <p className="text-sm font-bold font-mono text-primary">{consumed > 0 ? consumed.toFixed(1) : "—"} MT</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-accent-foreground" /> Machinery Hours</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Field label="ME Running Hours" name="meHours" type="number" />
            <Field label="AE / Generator Hours" name="aeHours" type="number" />
            <Field label="Boiler Hours" name="boilerHours" type="number" />
          </div>
        </div>

        <div className="card-elevated p-4">
          <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Remarks</label>
          <textarea value={formData.remarks} onChange={e => setFormData(p => ({ ...p, remarks: e.target.value }))}
            rows={3} placeholder="Weather conditions, unusual operations, notes..." className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSubmit} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5" /> Submit Report
          </button>
          <button className="px-4 py-2 text-xs font-medium bg-muted text-muted-foreground rounded-lg hover:bg-accent transition-colors">Save as Draft</button>
        </div>
      </div>
    </div>
  );
}

// ─── Reports ───
function ReportsPage() {
  const { toast } = useToast();
  const reportTypes = [
    { label: "Daily Emissions Report", desc: "Fuel and emissions for selected date", icon: Calendar },
    { label: "Weekly Summary", desc: "7-day fleet emissions overview", icon: BarChart3 },
    { label: "Monthly Emissions Summary", desc: "Complete monthly fleet report", icon: FileText },
    { label: "Vessel Performance Report", desc: "Individual vessel analysis", icon: Ship },
    { label: "Fleet Benchmark Report", desc: "Cross-vessel comparison", icon: GitCompare },
    { label: "Client Export", desc: "Management-ready emissions summary", icon: Users },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Emissions Reports</h2>
        <div className="flex items-center gap-2">
          <select className="text-xs bg-muted border border-border rounded-lg px-3 py-2">
            <option>March 2026</option>
            <option>February 2026</option>
            <option>January 2026</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {reportTypes.map(r => (
          <div key={r.label} className="card-elevated p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <r.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-foreground">{r.label}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{r.desc}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => toast({ title: "Generating PDF...", description: `${r.label} will be ready shortly` })} className="px-2 py-1 text-[10px] font-medium bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors flex items-center gap-1">
                    <Download className="w-3 h-3" /> PDF
                  </button>
                  <button onClick={() => toast({ title: "Generating Excel...", description: `${r.label} export started` })} className="px-2 py-1 text-[10px] font-medium bg-success/10 text-success rounded hover:bg-success/20 transition-colors flex items-center gap-1">
                    <Download className="w-3 h-3" /> Excel
                  </button>
                  <button onClick={() => toast({ title: "Generating CSV...", description: `${r.label} CSV download started` })} className="px-2 py-1 text-[10px] font-medium bg-info/10 text-info rounded hover:bg-info/20 transition-colors flex items-center gap-1">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="card-elevated p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3">Recently Generated</h3>
        <div className="space-y-2">
          {[
            { name: "Fleet Monthly Summary - Feb 2026", date: "2026-03-05", format: "PDF", size: "2.4 MB" },
            { name: "MT Kaveri Performance - Feb 2026", date: "2026-03-03", format: "Excel", size: "1.8 MB" },
            { name: "Client Export Q4 2025", date: "2026-01-15", format: "PDF", size: "4.1 MB" },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-foreground">{r.name}</p>
                  <p className="text-[10px] text-muted-foreground">{r.date} · {r.size}</p>
                </div>
              </div>
              <button className="px-2 py-1 text-[10px] font-medium bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                <Download className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Alerts Page ───
function AlertsPage() {
  const [alerts, setAlerts] = useState(emissionAlerts);
  const acknowledge = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Emissions Alerts</h2>
        <span className="text-[10px] px-2 py-1 bg-destructive/10 text-destructive rounded-full font-medium">
          {alerts.filter(a => !a.acknowledged).length} active
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map(alert => (
          <div key={alert.id} className={`card-elevated p-3 flex items-start gap-3 ${alert.acknowledged ? "opacity-60" : ""}`}>
            <div className={`p-1.5 rounded-lg ${alert.severity === "critical" ? "bg-destructive/10" : alert.severity === "warning" ? "bg-warning/10" : "bg-info/10"}`}>
              {alert.severity === "critical" ? <XCircle className="w-4 h-4 text-destructive" /> : alert.severity === "warning" ? <AlertTriangle className="w-4 h-4 text-warning" /> : <Info className="w-4 h-4 text-info" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-foreground">{alert.vesselName}</span>
                <span className={`px-1.5 py-0.5 text-[9px] font-semibold rounded uppercase ${alert.severity === "critical" ? "bg-destructive/10 text-destructive" : alert.severity === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"}`}>{alert.severity}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{alert.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{alert.date}</p>
            </div>
            {!alert.acknowledged && (
              <button onClick={() => acknowledge(alert.id)} className="px-2 py-1 text-[10px] font-medium bg-muted text-muted-foreground rounded hover:bg-accent transition-colors shrink-0">
                Acknowledge
              </button>
            )}
            {alert.acknowledged && <CheckCircle className="w-4 h-4 text-success shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Benchmarks ───
function BenchmarksPage({ onViewVessel }: { onViewVessel: (id: string) => void }) {
  const underwayVessels = vesselEmissionSummaries.filter(v => v.distanceNM > 0);
  const classes = [...new Set(underwayVessels.map(v => v.vesselClass))];

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-bold text-foreground">Vessel Benchmarking</h2>

      {classes.map(cls => {
        const classVessels = underwayVessels.filter(v => v.vesselClass === cls).sort((a, b) => a.co2PerNM - b.co2PerNM);
        const avg = classVessels.reduce((s, v) => s + v.co2PerNM, 0) / classVessels.length;
        return (
          <div key={cls} className="card-elevated p-4">
            <h3 className="text-xs font-semibold text-foreground mb-1">{cls} Class</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Fleet average: {avg.toFixed(3)} tCO₂/NM</p>
            <div className="space-y-2">
              {classVessels.map((v, i) => {
                const pct = avg > 0 ? ((v.co2PerNM - avg) / avg) * 100 : 0;
                return (
                  <button key={v.vesselId} onClick={() => onViewVessel(v.vesselId)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors text-left">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{v.vesselName}</p>
                      <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct <= 0 ? "bg-success" : pct < 10 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${Math.min(100, (v.co2PerNM / (avg * 1.5)) * 100)}%` }} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono">{v.co2PerNM.toFixed(3)}</p>
                      <p className={`text-[10px] ${pct <= 0 ? "text-success" : "text-destructive"}`}>{pct > 0 ? "+" : ""}{pct.toFixed(1)}%</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Comparison Chart */}
      <div className="card-elevated p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3">Fleet CO₂ Efficiency Comparison</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={underwayVessels.sort((a, b) => a.co2PerNM - b.co2PerNM)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="vesselName" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="co2PerNM" name="CO₂/NM" radius={[4, 4, 0, 0]}>
              {underwayVessels.sort((a, b) => a.co2PerNM - b.co2PerNM).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Admin Settings ───
function AdminSettings() {
  const { toast } = useToast();
  return (
    <div className="space-y-5">
      <h2 className="text-sm font-bold text-foreground">Emissions Admin Settings</h2>

      {/* Emission Factors */}
      <div className="card-elevated p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Thermometer className="w-3.5 h-3.5 text-primary" /> Emission Factors</h3>
        <p className="text-[10px] text-muted-foreground mb-3">Configurable factors used for automatic CO₂ calculation. Values in tonnes per tonne of fuel.</p>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Fuel Type</th>
              <th className="text-right py-2 px-2 font-semibold text-muted-foreground">CO₂</th>
              <th className="text-right py-2 px-2 font-semibold text-muted-foreground">CH₄</th>
              <th className="text-right py-2 px-2 font-semibold text-muted-foreground">N₂O</th>
              <th className="text-right py-2 px-2 font-semibold text-muted-foreground">SOx</th>
              <th className="text-right py-2 px-2 font-semibold text-muted-foreground">NOx</th>
            </tr>
          </thead>
          <tbody>
            {emissionFactors.map(ef => (
              <tr key={ef.fuelType} className="border-b border-border last:border-0">
                <td className="py-2 px-2 font-medium">{ef.fuelType}</td>
                <td className="py-2 px-2 text-right font-mono">{ef.co2Factor}</td>
                <td className="py-2 px-2 text-right font-mono">{ef.ch4Factor}</td>
                <td className="py-2 px-2 text-right font-mono">{ef.n2oFactor}</td>
                <td className="py-2 px-2 text-right font-mono">{ef.soxFactor}</td>
                <td className="py-2 px-2 text-right font-mono">{ef.noxFactor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => toast({ title: "Feature", description: "Emission factor editing will be available with backend integration" })} className="mt-3 px-3 py-1.5 text-[10px] font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
          Edit Factors
        </button>
      </div>

      {/* Alert Thresholds */}
      <div className="card-elevated p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-warning" /> Alert Thresholds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "Fuel spike threshold", value: "15%", desc: "Alert when consumption exceeds this % vs previous period" },
            { label: "CO₂/NM threshold", value: "0.350", desc: "Alert when vessel exceeds this carbon intensity" },
            { label: "Missing report days", value: "7", desc: "Days before alerting on missing submissions" },
            { label: "ROB variance tolerance", value: "2.0 MT", desc: "Maximum acceptable ROB discrepancy" },
          ].map(t => (
            <div key={t.label} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-foreground">{t.label}</p>
                <span className="text-xs font-bold font-mono text-primary">{t.value}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vessel Management */}
      <div className="card-elevated p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5"><Ship className="w-3.5 h-3.5 text-info" /> Registered Vessels</h3>
        <div className="space-y-2">
          {vesselProfiles.map(v => (
            <div key={v.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/30 transition-colors">
              <div>
                <p className="text-xs font-medium text-foreground">{v.name}</p>
                <p className="text-[10px] text-muted-foreground">IMO {v.imo} · {v.vesselClass} · {v.dwt.toLocaleString()} DWT</p>
              </div>
              <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded ${v.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{v.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Emissions Tracker ───
export default function EmissionsTracker() {
  const [activePage, setActivePage] = useState<Page>("overview");
  const [selectedVesselId, setSelectedVesselId] = useState<string>("");

  const handleViewVessel = (id: string) => {
    setSelectedVesselId(id);
    setActivePage("vessel-detail");
  };

  const sidebarItems: { id: Page; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "vessels", label: "Vessels", icon: Ship },
    { id: "data-entry", label: "Data Entry", icon: Plus },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "alerts", label: "Alerts", icon: AlertTriangle },
    { id: "benchmarks", label: "Benchmarks", icon: GitCompare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const unresolvedAlerts = emissionAlerts.filter(a => !a.acknowledged).length;

  return (
    <AppLayout breadcrumb={`User / Vessel / Emissions Tracker / ${sidebarItems.find(i => i.id === activePage)?.label || "Overview"}`}>
      <div className="flex flex-1 min-h-0">
      {/* Sidebar */}
      <aside className="w-52 bg-card border-r border-border shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-success/10">
              <Leaf className="w-4 h-4 text-success" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-foreground">Emissions Tracker</h2>
              <p className="text-[10px] text-muted-foreground">Fleet Monitoring</p>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-0.5">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                (activePage === item.id || (activePage === "vessel-detail" && item.id === "vessels"))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
              {item.id === "alerts" && unresolvedAlerts > 0 && (
                <span className="ml-auto text-[9px] bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center">{unresolvedAlerts}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-5 max-w-[1400px]">
        {activePage === "overview" && <FleetOverview onViewVessel={handleViewVessel} />}
        {activePage === "vessels" && <VesselsList onViewVessel={handleViewVessel} />}
        {activePage === "vessel-detail" && <VesselDetail vesselId={selectedVesselId} onBack={() => setActivePage("vessels")} />}
        {activePage === "data-entry" && <DataEntry />}
        {activePage === "reports" && <ReportsPage />}
        {activePage === "alerts" && <AlertsPage />}
        {activePage === "benchmarks" && <BenchmarksPage onViewVessel={handleViewVessel} />}
        {activePage === "settings" && <AdminSettings />}
      </main>
      </div>
    </AppLayout>
  );
}
