import { useState, useMemo } from "react";
import TopNav from "@/components/TopNav";
import {
  Activity, AlertTriangle, Anchor, Droplets, Gauge, Thermometer, Waves,
  Zap, Wifi, WifiOff, Clock, Circle, BarChart3, Fuel, Cog, Fan,
  Ship, ChevronDown, Heart, Info, Shield, HelpCircle, Signal, TrendingUp, Target, CheckCircle,
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  allVesselSensors, recentAlerts, getFleetIotSummary, getVesselKpiMetrics,
  getVesselTelemetry, getGaugeColor, getStatusBg, getStatusText,
  getHealthColor, getHealthLabel, fleetOptions,
  healthProgressionData, getSensorStatusDistribution, getAlertsByCategory,
  getFleetHealthComparison, getVesselHealthBars, getComponentHealthBreakdown,
  monthlyProgressionData, getSensorsByComponent, componentLabels,
  type SensorStatus, type SensorPoint, type VesselSensors,
} from "@/data/iotSensorData";

// ─── Tooltip Styles ───
const tip = {
  backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 15%, 90%)",
  borderRadius: "8px", fontSize: "12px", color: "hsl(222, 52%, 15%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

// ─── Reusable Components ───
function StatusIndicator({ status, size = "sm" }: { status: SensorStatus; size?: "sm" | "md" }) {
  const color = status === "critical" ? "bg-destructive" : status === "warning" ? "bg-warning" : "bg-success";
  const dim = size === "md" ? "h-3 w-3" : "h-2.5 w-2.5";
  return (
    <span className={`relative flex ${dim}`}>
      {status !== "normal" && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />}
      <span className={`relative inline-flex rounded-full ${dim} ${color}`} />
    </span>
  );
}

function StatusBadge({ status }: { status: SensorStatus }) {
  const labels = { normal: "Normal", warning: "Attention Needed", critical: "Action Required" };
  const cls = status === "critical" ? "severity-high" : status === "warning" ? "severity-medium" : "severity-low";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${cls}`}>{labels[status]}</span>;
}

function GaugeCard({ label, description, value, unit, max, status }: { label: string; description?: string; value: number; unit: string; max: number; status: SensorStatus }) {
  const pct = Math.min((value / max) * 100, 100);
  const gaugeData = [{ value: pct, fill: getGaugeColor(status) }, { value: 100 - pct, fill: "hsl(216, 15%, 93%)" }];
  const statusLabel = status === "critical" ? "Critical" : status === "warning" ? "Caution" : "OK";
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center group relative">
      <p className="text-[11px] font-medium text-muted-foreground mb-1">{label}</p>
      <div className="w-24 h-24 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={gaugeData} cx="50%" cy="50%" innerRadius={30} outerRadius={42} startAngle={180} endAngle={0} dataKey="value" stroke="none">
              {gaugeData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
          <span className={`text-lg font-bold font-mono ${getStatusText(status)}`}>{value}</span>
          <span className="text-[9px] text-muted-foreground">{unit}</span>
        </div>
      </div>
      <span className={`text-[9px] font-semibold mt-1 ${getStatusText(status)}`}>{statusLabel}</span>
      {description && (
        <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48">
          <div className="bg-card border border-border rounded-lg shadow-xl p-2.5 text-[10px] text-muted-foreground">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sensor Map (grid-based) ───
const componentIcons: Record<string, { icon: typeof Cog; label: string }> = {
  engine: { icon: Cog, label: "Main Engine" },
  fuel: { icon: Fuel, label: "Fuel System" },
  propeller: { icon: Fan, label: "Propulsion" },
  thruster: { icon: Zap, label: "Thrusters" },
  vibration: { icon: Waves, label: "Vibration" },
  pressure: { icon: Gauge, label: "Pressure" },
  environment: { icon: Thermometer, label: "Environment" },
  auxiliary: { icon: Cog, label: "Aux Engines" },
  electrical: { icon: Zap, label: "Electrical" },
  steering: { icon: Anchor, label: "Steering" },
  tanks: { icon: Droplets, label: "Tanks & Levels" },
  cargo: { icon: Ship, label: "Cargo" },
  navigation: { icon: Signal, label: "Navigation" },
  boiler: { icon: Thermometer, label: "Boiler" },
  safety: { icon: Shield, label: "Safety" },
};

function VesselDiagram({ sensors, vesselName }: { sensors: SensorPoint[]; vesselName: string }) {
  const [expandedComp, setExpandedComp] = useState<string | null>(null);
  const grouped = useMemo(() => {
    const map: Record<string, SensorPoint[]> = {};
    sensors.forEach((s) => { (map[s.component] ??= []).push(s); });
    return map;
  }, [sensors]);

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
        <Anchor className="w-3.5 h-3.5 text-primary" /> Sensor Map — {vesselName}
      </h3>
      <p className="text-[10px] text-muted-foreground mb-3">Click any system to expand sensor details. Colored indicators show status at a glance.</p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {Object.entries(grouped).map(([component, sensorList]) => {
          const meta = componentIcons[component] || { icon: Circle, label: component };
          const Icon = meta.icon;
          const worstStatus = sensorList.some(s => s.status === "critical") ? "critical" : sensorList.some(s => s.status === "warning") ? "warning" : "normal";
          const isExpanded = expandedComp === component;
          const issueCount = sensorList.filter(s => s.status !== "normal").length;
          return (
            <div key={component} className="relative">
              <button
                onClick={() => setExpandedComp(isExpanded ? null : component)}
                className={`w-full p-2.5 rounded-lg border-2 text-center transition-all hover:scale-[1.02] ${isExpanded ? "ring-2 ring-primary/40" : ""} ${getStatusBg(worstStatus)}`}
              >
                <Icon className={`w-4 h-4 mx-auto mb-1 ${getStatusText(worstStatus)}`} />
                <p className="text-[9px] font-semibold text-foreground leading-tight">{meta.label}</p>
                <p className="text-[8px] text-muted-foreground">{sensorList.length} sensors</p>
                {issueCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center text-primary-foreground ${worstStatus === "critical" ? "bg-destructive" : "bg-warning"}`}>{issueCount}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
      {/* Expanded detail panel */}
      {expandedComp && grouped[expandedComp] && (
        <div className="mt-3 rounded-lg border border-border bg-accent/20 p-3 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-bold text-foreground">{componentIcons[expandedComp]?.label || expandedComp}</h4>
            <button onClick={() => setExpandedComp(null)} className="text-[9px] text-muted-foreground hover:text-foreground">Close ✕</button>
          </div>
          <div className="space-y-1.5">
            {grouped[expandedComp].map(s => (
              <div key={s.id} className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md border ${getStatusBg(s.status)}`}>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-medium text-foreground">{s.name}</span>
                  <p className="text-[8px] text-muted-foreground truncate">{s.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-mono font-bold ${getStatusText(s.status)}`}>{s.value} {s.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Fleet Overview Card ───
function FleetOverviewCards({ fleet }: { fleet: string | undefined }) {
  const summary = getFleetIotSummary(fleet);
  const cards = [
    { label: "Total Vessels", value: `${summary.totalVessels}`, description: "Number of monitored vessels", icon: Ship, color: "text-primary" },
    { label: "Online", value: `${summary.online}/${summary.totalVessels}`, description: "Vessels sending live data", icon: Wifi, color: "text-success" },
    { label: "Fleet Health", value: `${summary.avgHealth}%`, description: getHealthLabel(summary.avgHealth), icon: Heart, color: getHealthColor(summary.avgHealth) },
    { label: "Active Alerts", value: `${summary.totalAlerts}`, description: "Across all vessels", icon: AlertTriangle, color: summary.totalAlerts > 5 ? "text-destructive" : "text-warning" },
    { label: "Critical Sensors", value: `${summary.criticalSensors}`, description: "Needs immediate attention", icon: Shield, color: summary.criticalSensors > 0 ? "text-destructive" : "text-success" },
    { label: "Warnings", value: `${summary.warningSensors}`, description: "Monitor closely", icon: Info, color: summary.warningSensors > 0 ? "text-warning" : "text-success" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((c, i) => (
        <div key={c.label} className="card-elevated p-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="flex items-center gap-2 mb-2">
            <c.icon className={`w-4 h-4 ${c.color}`} />
            <span className="text-[10px] font-medium text-muted-foreground">{c.label}</span>
          </div>
          <p className="text-xl font-bold font-mono text-foreground">{c.value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{c.description}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Vessel Strip ───
const MAX_VISIBLE_VESSELS = 8;

function VesselButton({ v, isSelected, onClick }: { v: VesselSensors; isSelected: boolean; onClick: () => void }) {
  const connColor = v.connectionStatus === "online" ? "bg-success" : v.connectionStatus === "intermittent" ? "bg-warning" : "bg-destructive";
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${isSelected ? "bg-primary/10 border border-primary/30 text-foreground font-semibold" : "bg-muted/50 border border-transparent text-muted-foreground hover:bg-accent"}`}>
      <span className={`w-2 h-2 rounded-full ${connColor}`} />
      <span>{v.vesselName}</span>
      <span className={`text-[9px] font-mono font-bold ${getHealthColor(v.healthScore)}`}>{v.healthScore}%</span>
      {v.alertCount > 0 && (
        <span className="bg-destructive/15 text-destructive text-[9px] font-bold px-1.5 py-0.5 rounded-full">{v.alertCount}</span>
      )}
    </button>
  );
}

function VesselSelector({ vessels, selectedId, onSelect }: { vessels: VesselSensors[]; selectedId: string | null; onSelect: (id: string | null) => void }) {
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  const visibleVessels = vessels.slice(0, MAX_VISIBLE_VESSELS);
  const hasMore = vessels.length > MAX_VISIBLE_VESSELS;

  const filteredVesselsInModal = useMemo(() => {
    if (!search.trim()) return vessels;
    const q = search.toLowerCase();
    return vessels.filter((v) => v.vesselName.toLowerCase().includes(q) || v.vesselId.toLowerCase().includes(q) || v.fleet.toLowerCase().includes(q));
  }, [vessels, search]);

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Select Vessel</span>
            <span className="text-[10px] text-muted-foreground">({vessels.length} vessels)</span>
          </div>
          {hasMore && (
            <button onClick={() => setShowAll(true)} className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View All
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onSelect(null)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedId === null ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border text-muted-foreground hover:bg-accent"}`}>
            <Activity className="w-3 h-3" />
            Fleet Overview
          </button>
          {visibleVessels.map((v) => (
            <VesselButton key={v.vesselId} v={v} isSelected={selectedId === v.vesselId} onClick={() => onSelect(v.vesselId)} />
          ))}
          {hasMore && (
            <button onClick={() => setShowAll(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/5 border border-primary/20 text-primary hover:bg-primary/10 transition-all">
              +{vessels.length - MAX_VISIBLE_VESSELS} more
            </button>
          )}
        </div>
      </div>

      {/* View All Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setShowAll(false)}>
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Select Vessel</span>
                <span className="text-xs text-muted-foreground">({vessels.length} vessels)</span>
              </div>
              <button onClick={() => setShowAll(false)} className="text-muted-foreground hover:text-foreground text-lg leading-none px-2">×</button>
            </div>
            <div className="px-4 pt-3 pb-2">
              <input
                type="text"
                placeholder="Search vessels by name, ID, or fleet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => { onSelect(null); setShowAll(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${selectedId === null ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border text-muted-foreground hover:bg-accent"}`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Fleet Overview
                </button>
                {filteredVesselsInModal.map((v) => {
                  const isSelected = selectedId === v.vesselId;
                  const connColor = v.connectionStatus === "online" ? "bg-success" : v.connectionStatus === "intermittent" ? "bg-warning" : "bg-destructive";
                  return (
                    <button
                      key={v.vesselId}
                      onClick={() => { onSelect(v.vesselId); setShowAll(false); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs transition-all text-left ${isSelected ? "bg-primary/10 border border-primary/30 text-foreground font-semibold ring-1 ring-primary/30" : "bg-muted/50 border border-transparent text-muted-foreground hover:bg-accent"}`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${connColor}`} />
                      <span className="flex-1 truncate">{v.vesselName}</span>
                      <span className="text-[9px] text-muted-foreground font-mono">{v.fleet}</span>
                      <span className={`text-[9px] font-mono font-bold ${getHealthColor(v.healthScore)}`}>{v.healthScore}%</span>
                      {v.alertCount > 0 && (
                        <span className="bg-destructive/15 text-destructive text-[9px] font-bold px-1.5 py-0.5 rounded-full">{v.alertCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {filteredVesselsInModal.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">No vessels match "{search}"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Vessel Health Table (fleet view) ───
function FleetVesselTable({ vessels }: { vessels: VesselSensors[] }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
        <Ship className="w-3.5 h-3.5 text-primary" /> Vessel Health Overview
      </h3>
      <p className="text-[10px] text-muted-foreground mb-3">Health score shows overall vessel condition. Click a vessel above for detailed sensor readings.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Vessel</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Fleet</th>
              <th className="text-center py-2 text-muted-foreground font-medium">Connection</th>
              <th className="text-center py-2 text-muted-foreground font-medium">Health</th>
              <th className="text-center py-2 text-muted-foreground font-medium">Alerts</th>
              <th className="text-center py-2 text-muted-foreground font-medium">Critical</th>
              <th className="text-center py-2 text-muted-foreground font-medium">Warnings</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {vessels.map(v => {
              const critCount = v.sensors.filter(s => s.status === "critical").length;
              const warnCount = v.sensors.filter(s => s.status === "warning").length;
              const connIcon = v.connectionStatus === "online" ? "🟢" : v.connectionStatus === "intermittent" ? "🟡" : "🔴";
              return (
                <tr key={v.vesselId} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-semibold text-foreground">{v.vesselName}</td>
                  <td className="py-2.5 text-muted-foreground">{v.type}</td>
                  <td className="py-2.5 text-muted-foreground">{v.fleet}</td>
                  <td className="py-2.5 text-center">
                    <span className="text-[10px]">{connIcon} {v.connectionStatus}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={`font-bold font-mono ${getHealthColor(v.healthScore)}`}>{v.healthScore}%</span>
                    <span className={`block text-[9px] ${getHealthColor(v.healthScore)}`}>{getHealthLabel(v.healthScore)}</span>
                  </td>
                  <td className="py-2.5 text-center">
                    {v.alertCount > 0 ? <span className="bg-destructive/15 text-destructive text-[10px] font-bold px-2 py-0.5 rounded-full">{v.alertCount}</span> : <span className="text-muted-foreground">0</span>}
                  </td>
                  <td className="py-2.5 text-center">
                    {critCount > 0 ? <span className="text-destructive font-bold">{critCount}</span> : <span className="text-success">0</span>}
                  </td>
                  <td className="py-2.5 text-center">
                    {warnCount > 0 ? <span className="text-warning font-bold">{warnCount}</span> : <span className="text-success">0</span>}
                  </td>
                  <td className="py-2.5 text-right text-muted-foreground text-[10px]">{new Date(v.lastSync).toLocaleTimeString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type TimeRange = "1h" | "6h" | "24h";

// ─── Main Dashboard ───
export default function IotDashboard({ fleet = "All Fleets" }: { fleet?: string }) {
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  const selectedFleet = fleet;

  const filteredVessels = useMemo(() =>
    selectedFleet === "All Fleets" ? allVesselSensors : allVesselSensors.filter(v => v.fleet === selectedFleet),
    [selectedFleet]
  );

  // Reset vessel selection when fleet changes
  useMemo(() => { setSelectedVesselId(null); }, [selectedFleet]);

  const selectedVessel = useMemo(() =>
    selectedVesselId ? allVesselSensors.find(v => v.vesselId === selectedVesselId) || null : null,
    [selectedVesselId]
  );

  const vesselIndex = selectedVessel ? allVesselSensors.indexOf(selectedVessel) : 0;
  const hours = timeRange === "1h" ? 1 : timeRange === "6h" ? 6 : 24;
  const telemetry = useMemo(() => getVesselTelemetry(vesselIndex, hours), [vesselIndex, hours]);

  const fuelTrendData = useMemo(() => telemetry.map(d => ({
    time: d.time,
    consumption: Math.round(d.fuelConsumption * 10) / 10,
  })), [telemetry]);

  const filteredAlerts = useMemo(() => {
    if (selectedVessel) return recentAlerts.filter(a => a.vessel === selectedVessel.vesselName);
    if (selectedFleet === "All Fleets") return recentAlerts;
    const vesselNames = new Set(filteredVessels.map(v => v.vesselName));
    return recentAlerts.filter(a => vesselNames.has(a.vessel));
  }, [selectedVessel, selectedFleet, filteredVessels]);

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Info Bar */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Signal className="w-4 h-4 text-primary" />
              IoT Vessel Monitoring
            </h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Live sensor data from onboard IoT devices — monitor vessel health, fuel, engine, and equipment status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              Live
            </div>
          </div>
        </div>
      </div>

      {/* Vessel Selector Strip */}
      <VesselSelector vessels={filteredVessels} selectedId={selectedVesselId} onSelect={setSelectedVesselId} />

      {/* Fleet Summary KPIs */}
      <FleetOverviewCards fleet={selectedFleet === "All Fleets" ? undefined : selectedFleet} />

      {/* Fleet view */}
      {!selectedVessel && (
        <>
          {/* ─── Executive Charts Section ─── */}
          {(() => {
            const fleetFilter = selectedFleet === "All Fleets" ? undefined : selectedFleet;
            const sensorDist = getSensorStatusDistribution(fleetFilter);
            const alertsByCat = getAlertsByCategory(fleetFilter);
            const fleetComparison = getFleetHealthComparison();
            const vesselBars = getVesselHealthBars(fleetFilter);
            const componentHealth = getComponentHealthBreakdown(fleetFilter);
            const totalSensors = sensorDist.reduce((s, d) => s + d.value, 0);
            const normalPct = totalSensors > 0 ? Math.round((sensorDist[0]?.value || 0) / totalSensors * 100) : 0;

            return (
              <>
                {/* Row 1: Health Progression + Sensor Status Donut + Alert Pie */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                  {/* Health Progression Over Time */}
                  <div className="bg-card rounded-xl border border-border p-5 xl:col-span-2">
                    <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" /> Fleet Health Progression
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Weekly health score trend by fleet — higher is better (target: above 80%)</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={healthProgressionData}>
                          <defs>
                            <linearGradient id="healthGradP" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(210, 80%, 52%)" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="hsl(210, 80%, 52%)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="healthGradA" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="healthGradI" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(152, 55%, 42%)" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="hsl(152, 55%, 42%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                          <XAxis dataKey="day" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 10 }} />
                          <YAxis domain={[50, 100]} tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 10 }} width={30} />
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, name]} />
                          <Area type="monotone" dataKey="Pacific" stroke="hsl(210, 80%, 52%)" fill="url(#healthGradP)" strokeWidth={2} name="Pacific Fleet" />
                          <Area type="monotone" dataKey="Atlantic" stroke="hsl(38, 92%, 50%)" fill="url(#healthGradA)" strokeWidth={2} name="Atlantic Fleet" />
                          <Area type="monotone" dataKey="Indian" stroke="hsl(152, 55%, 42%)" fill="url(#healthGradI)" strokeWidth={2} name="Indian Fleet" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-5 mt-2">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ backgroundColor: "hsl(210, 80%, 52%)" }} /><span className="text-[9px] text-muted-foreground">Pacific</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ backgroundColor: "hsl(38, 92%, 50%)" }} /><span className="text-[9px] text-muted-foreground">Atlantic</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ backgroundColor: "hsl(152, 55%, 42%)" }} /><span className="text-[9px] text-muted-foreground">Indian</span></div>
                    </div>
                    {/* Summary cards */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="rounded-lg border px-3 py-2 bg-info/10 text-info border-info/20">
                        <div className="flex items-center gap-1.5 mb-0.5"><TrendingUp className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Best</span></div>
                        <p className="text-sm font-bold font-mono">Pacific 91%</p>
                        <p className="text-[9px] opacity-80">Consistently highest health scores</p>
                      </div>
                      <div className="rounded-lg border px-3 py-2 bg-warning/10 text-warning border-warning/20">
                        <div className="flex items-center gap-1.5 mb-0.5"><AlertTriangle className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Needs Attention</span></div>
                        <p className="text-sm font-bold font-mono">Atlantic 64%</p>
                        <p className="text-[9px] opacity-80">Declining trend — MT Chambal impacting score</p>
                      </div>
                      <div className="rounded-lg border px-3 py-2 bg-success/10 text-success border-success/20">
                        <div className="flex items-center gap-1.5 mb-0.5"><Target className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Target</span></div>
                        <p className="text-sm font-bold font-mono">80%+</p>
                        <p className="text-[9px] opacity-80">Fleet health target — 2 of 3 fleets meeting</p>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Status Distribution Donut */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-success" /> Sensor Status
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Distribution of all sensor readings across fleet</p>
                    <div className="h-[180px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={sensorDist} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" stroke="none" paddingAngle={2}>
                            {sensorDist.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value} sensors`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold font-mono text-foreground">{normalPct}%</span>
                        <span className="text-[9px] text-muted-foreground">Healthy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      {sensorDist.map(d => (
                        <div key={d.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                          <span className="text-[9px] text-muted-foreground">{d.name} ({d.value})</span>
                        </div>
                      ))}
                    </div>
                    {/* Insight */}
                    <div className="mt-3 rounded-lg border px-3 py-2 bg-success/10 text-success border-success/20">
                      <div className="flex items-center gap-1.5 mb-0.5"><CheckCircle className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Status</span></div>
                      <p className="text-[10px]">{normalPct >= 85 ? "Fleet sensors are mostly healthy" : normalPct >= 70 ? "Some sensors need monitoring" : "Multiple sensors require attention"}</p>
                    </div>
                  </div>
                </div>

                {/* Row 2: Vessel Health Bars + Fleet Comparison + Alert Type Pie */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                  {/* Vessel Health Bar Chart */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-primary" /> Vessel Health Scores
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Individual vessel health — green ≥85%, yellow ≥60%, red &lt;60%</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vesselBars} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} />
                          <YAxis type="category" dataKey="vessel" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 10 }} width={70} />
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}%`, "Health Score"]} />
                          <Bar dataKey="health" radius={[0, 4, 4, 0]} barSize={16}>
                            {vesselBars.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Fleet Comparison Bar Chart */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Ship className="w-3.5 h-3.5 text-info" /> Fleet Comparison
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Compare health, alerts, and online vessels across fleets</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={fleetComparison}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                          <XAxis dataKey="fleet" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 10 }} />
                          <YAxis tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} width={30} />
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [name === "Health Score" ? `${value}%` : value, name]} />
                          <Bar dataKey="health" fill="hsl(210, 80%, 52%)" radius={[4, 4, 0, 0]} barSize={20} name="Health Score" />
                          <Bar dataKey="alerts" fill="hsl(357, 96%, 46%)" radius={[4, 4, 0, 0]} barSize={20} name="Alerts" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: "hsl(210, 80%, 52%)" }} /><span className="text-[9px] text-muted-foreground">Health %</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: "hsl(357, 96%, 46%)" }} /><span className="text-[9px] text-muted-foreground">Alerts</span></div>
                    </div>
                  </div>

                  {/* Alert Types Pie Chart */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-warning" /> Alert Categories
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Breakdown of alerts by type — shows most common issues</p>
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={alertsByCat} cx="50%" cy="50%" outerRadius={70} dataKey="value" stroke="hsl(0, 0%, 100%)" strokeWidth={2} label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                            {alertsByCat.map((e, i) => <Cell key={i} fill={e.fill} />)}
                          </Pie>
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value} alerts`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                      {alertsByCat.map(d => (
                        <div key={d.name} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                          <span className="text-[8px] text-muted-foreground">{d.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 3: Component Health + Monthly Progression */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {/* Component Health Breakdown */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Cog className="w-3.5 h-3.5 text-warning" /> Component Health Breakdown
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Healthy vs issue sensors by equipment type</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={componentHealth}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                          <XAxis dataKey="name" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} />
                          <YAxis tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} width={25} />
                          <Tooltip contentStyle={tip} />
                          <Bar dataKey="healthy" stackId="a" fill="hsl(152, 55%, 42%)" radius={[0, 0, 0, 0]} name="Healthy" />
                          <Bar dataKey="issues" stackId="a" fill="hsl(357, 96%, 46%)" radius={[4, 4, 0, 0]} name="Issues" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: "hsl(152, 55%, 42%)" }} /><span className="text-[9px] text-muted-foreground">Healthy</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: "hsl(357, 96%, 46%)" }} /><span className="text-[9px] text-muted-foreground">Issues</span></div>
                    </div>
                  </div>

                  {/* Monthly Progression */}
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-success" /> 6-Month Progression
                    </h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Fleet health, alerts, and uptime trends over the past 6 months</p>
                    <div className="h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyProgressionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                          <XAxis dataKey="month" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 10 }} />
                          <YAxis tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} width={30} />
                          <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [name.includes("Alert") ? value : `${value}%`, name]} />
                          <Line type="monotone" dataKey="health" stroke="hsl(210, 80%, 52%)" strokeWidth={2} dot={{ r: 4 }} name="Health %" />
                          <Line type="monotone" dataKey="uptime" stroke="hsl(152, 55%, 42%)" strokeWidth={2} dot={{ r: 4 }} name="Uptime %" />
                          <Line type="monotone" dataKey="alerts" stroke="hsl(357, 96%, 46%)" strokeWidth={2} dot={{ r: 4 }} name="Alerts" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-5 mt-2">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-info" /><span className="text-[9px] text-muted-foreground">Health</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-success" /><span className="text-[9px] text-muted-foreground">Uptime</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-destructive" /><span className="text-[9px] text-muted-foreground">Alerts</span></div>
                    </div>
                    {/* Summary cards */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="rounded-lg border px-3 py-2 bg-info/10 text-info border-info/20">
                        <div className="flex items-center gap-1.5 mb-0.5"><TrendingUp className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Health</span></div>
                        <p className="text-sm font-bold font-mono">+3%</p>
                        <p className="text-[9px] opacity-80">Improved from Oct baseline</p>
                      </div>
                      <div className="rounded-lg border px-3 py-2 bg-success/10 text-success border-success/20">
                        <div className="flex items-center gap-1.5 mb-0.5"><CheckCircle className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Uptime</span></div>
                        <p className="text-sm font-bold font-mono">95%</p>
                        <p className="text-[9px] opacity-80">Above 93% target</p>
                      </div>
                      <div className="rounded-lg border px-3 py-2 bg-destructive/10 text-destructive border-destructive/20">
                        <div className="flex items-center gap-1.5 mb-0.5"><AlertTriangle className="w-3 h-3" /><span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span></div>
                        <p className="text-sm font-bold font-mono">-39%</p>
                        <p className="text-[9px] opacity-80">Reduced from 18 to 11 avg/month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          <FleetVesselTable vessels={filteredVessels} />

          {/* Alert Panel */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> Recent Alerts Across Fleet
            </h3>
            <p className="text-[10px] text-muted-foreground mb-3">Alerts sorted by severity — critical issues appear first and need immediate attention</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusBg(alert.severity)}`}>
                  <StatusIndicator status={alert.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-foreground">{alert.sensorName}</span>
                      <StatusBadge status={alert.severity} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                      <Ship className="w-2.5 h-2.5" /><span className="font-medium">{alert.vessel}</span>
                      <span>·</span><span>{alert.alertType}</span>
                      <span>·</span><span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Individual Vessel View */}
      {selectedVessel && (
        <>
          {/* Vessel Info Bar */}
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground">{selectedVessel.vesselName}</h2>
                  <p className="text-[10px] text-muted-foreground">IMO {selectedVessel.imo} · {selectedVessel.type} · {selectedVessel.fleet} Fleet</p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${selectedVessel.connectionStatus === "online" ? "bg-success/15 border border-success/30" : selectedVessel.connectionStatus === "intermittent" ? "bg-warning/15 border border-warning/30" : "bg-destructive/15 border border-destructive/30"}`}>
                  {selectedVessel.connectionStatus === "online" ? <Wifi className="w-3 h-3 text-success" /> : selectedVessel.connectionStatus === "intermittent" ? <Signal className="w-3 h-3 text-warning" /> : <WifiOff className="w-3 h-3 text-destructive" />}
                  <span className={`text-[10px] font-semibold capitalize ${selectedVessel.connectionStatus === "online" ? "text-success" : selectedVessel.connectionStatus === "intermittent" ? "text-warning" : "text-destructive"}`}>
                    {selectedVessel.connectionStatus === "intermittent" ? "Unstable Connection" : selectedVessel.connectionStatus}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className={`text-lg font-bold font-mono ${getHealthColor(selectedVessel.healthScore)}`}>{selectedVessel.healthScore}%</p>
                  <p className={`text-[9px] font-medium ${getHealthColor(selectedVessel.healthScore)}`}>{getHealthLabel(selectedVessel.healthScore)}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Last sync: {new Date(selectedVessel.lastSync).toLocaleTimeString()}
                </div>
                {selectedVessel.alertCount > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/15 border border-destructive/30">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                    <span className="text-[10px] font-semibold text-destructive">{selectedVessel.alertCount} Alert{selectedVessel.alertCount > 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* KPI Cards with descriptions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
            {getVesselKpiMetrics(selectedVessel).map((m, i) => (
              <div key={m.label} className={`bg-card rounded-xl border p-3 text-center animate-fade-in-up group relative ${m.status === "critical" ? "border-destructive/40" : m.status === "warning" ? "border-warning/40" : "border-border"}`} style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-center justify-center gap-1">
                  <StatusIndicator status={m.status} />
                  <HelpCircle className="w-2.5 h-2.5 text-muted-foreground/50" />
                </div>
                <p className="text-lg font-bold font-mono text-foreground mt-1">{m.value}</p>
                <p className="text-[9px] text-muted-foreground">{m.unit}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1">{m.label}</p>
                {/* Tooltip */}
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-40">
                  <div className="bg-card border border-border rounded-lg shadow-xl p-2 text-[10px] text-muted-foreground text-left">
                    <p className="font-semibold text-foreground mb-0.5">{m.label}</p>
                    <p>{m.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <VesselDiagram sensors={selectedVessel.sensors} vesselName={selectedVessel.vesselName} />

            {/* Fuel Monitoring */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                <Droplets className="w-3.5 h-3.5 text-info" /> Fuel Monitoring
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">Current fuel status and consumption trend</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(() => {
                  const fuel = selectedVessel.sensors.find(s => s.name === "Fuel Level");
                  const flow = selectedVessel.sensors.find(s => s.name === "Fuel Flow Rate");
                  return (
                    <>
                      <GaugeCard label="Fuel Level" description="Remaining fuel percentage" value={fuel?.value || 72} unit="%" max={100} status={fuel?.status || "normal"} />
                      <GaugeCard label="Flow Rate" description="Current fuel consumption rate" value={flow?.value || 42.5} unit="L/h" max={65} status={flow?.status || "normal"} />
                      <GaugeCard label="Efficiency" description="How efficiently fuel is being used" value={88} unit="%" max={100} status="normal" />
                    </>
                  );
                })()}
              </div>
              <div className="h-[130px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fuelTrendData.slice(-20)}>
                    <defs>
                      <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(210, 80%, 52%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(210, 80%, 52%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                    <XAxis dataKey="time" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} width={30} />
                    <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value} L/h`, "Fuel Consumption"]} />
                    <Area type="monotone" dataKey="consumption" stroke="hsl(210, 80%, 52%)" fill="url(#fuelGrad)" strokeWidth={2} name="Fuel Consumption" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Engine Monitoring */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                <Cog className="w-3.5 h-3.5 text-warning" /> Engine Monitoring
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">Key engine parameters — watch for yellow/red indicators</p>
              <div className="grid grid-cols-2 gap-3">
                {(() => {
                  const rpm = selectedVessel.sensors.find(s => s.name === "Engine RPM");
                  const temp = selectedVessel.sensors.find(s => s.name === "Main Engine Temp");
                  const oil = selectedVessel.sensors.find(s => s.name === "Oil Pressure");
                  const vib = selectedVessel.sensors.find(s => s.name === "Vibration Level");
                  return (
                    <>
                      <GaugeCard label="RPM" description="Engine rotation speed" value={rpm?.value || 1480} unit="RPM" max={2000} status={rpm?.status || "normal"} />
                      <GaugeCard label="Temperature" description="Main engine temperature" value={temp?.value || 82} unit="°C" max={105} status={temp?.status || "normal"} />
                      <GaugeCard label="Oil Pressure" description="Engine oil lubrication pressure" value={oil?.value || 4.1} unit="bar" max={6} status={oil?.status || "normal"} />
                      <GaugeCard label="Vibration" description="Engine vibration — high = potential issue" value={vib?.value || 2.1} unit="mm/s" max={6} status={vib?.status || "normal"} />
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Propeller & Telemetry */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                <Fan className="w-3.5 h-3.5 text-success" /> Propeller & Thruster
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">Propulsion system status — propeller drives forward, thruster assists steering</p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(() => {
                  const prop = selectedVessel.sensors.find(s => s.name === "Propeller RPM");
                  const thrust = selectedVessel.sensors.find(s => s.name === "Thruster Power");
                  return (
                    <>
                      <GaugeCard label="Propeller" description="Main propeller speed" value={prop?.value || 125} unit="RPM" max={180} status={prop?.status || "normal"} />
                      <GaugeCard label="Thruster" description="Side thruster power usage" value={thrust?.value || 68} unit="%" max={100} status={thrust?.status || "normal"} />
                      <GaugeCard label="Load" description="Overall propulsion system load" value={54} unit="%" max={100} status="normal" />
                    </>
                  );
                })()}
              </div>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetry.slice(-20)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                    <XAxis dataKey="time" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} width={35} />
                    <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${Math.round(value * 10) / 10}`, name]} />
                    <Line type="monotone" dataKey="propellerRPM" stroke="hsl(152, 55%, 42%)" strokeWidth={2} dot={false} name="Propeller RPM" />
                    <Line type="monotone" dataKey="thrusterPower" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Thruster %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-primary" /> Sensor Trends Over Time
                </h3>
                <div className="flex items-center gap-1">
                  {(["1h", "6h", "24h"] as TimeRange[]).map((t) => (
                    <button key={t} onClick={() => setTimeRange(t)} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${timeRange === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">Historical sensor readings — spot patterns or unusual spikes</p>
              <div className="h-[210px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={telemetry}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                    <XAxis dataKey="time" tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }} width={35} />
                    <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${Math.round(value * 10) / 10}`, name]} />
                    <Line type="monotone" dataKey="engineTemp" stroke="hsl(357, 96%, 46%)" strokeWidth={1.5} dot={false} name="Engine Temp (°C)" />
                    <Line type="monotone" dataKey="fuelConsumption" stroke="hsl(210, 80%, 52%)" strokeWidth={1.5} dot={false} name="Fuel (L/h)" />
                    <Line type="monotone" dataKey="vibration" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} dot={false} name="Vibration (mm/s)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-destructive" /><span className="text-[9px] text-muted-foreground">Engine Temp</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-info" /><span className="text-[9px] text-muted-foreground">Fuel Consumption</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded bg-warning" /><span className="text-[9px] text-muted-foreground">Vibration</span></div>
              </div>
            </div>
          </div>

          {/* All Sensors Table by Component */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary" /> All Sensor Readings — {selectedVessel.vesselName}
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4">Complete list of {selectedVessel.sensors.length} onboard sensors grouped by system. Green = Normal, Yellow = Attention Needed, Red = Action Required.</p>
            {(() => {
              const grouped = getSensorsByComponent(selectedVessel);
              return (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {Object.entries(grouped).map(([comp, sensors]) => (
                    <div key={comp}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] font-bold text-foreground">{componentLabels[comp] || comp}</span>
                        <span className="text-[9px] text-muted-foreground">({sensors.length} sensors)</span>
                        {sensors.some(s => s.status === "critical") && <span className="w-2 h-2 rounded-full bg-destructive" />}
                        {!sensors.some(s => s.status === "critical") && sensors.some(s => s.status === "warning") && <span className="w-2 h-2 rounded-full bg-warning" />}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border/50">
                              <th className="text-left py-1.5 text-muted-foreground font-medium w-[30%]">Sensor</th>
                              <th className="text-left py-1.5 text-muted-foreground font-medium w-[35%]">Description</th>
                              <th className="text-right py-1.5 text-muted-foreground font-medium">Value</th>
                              <th className="text-center py-1.5 text-muted-foreground font-medium">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sensors.map(s => (
                              <tr key={s.id} className="border-b border-border/30 hover:bg-accent/30 transition-colors">
                                <td className="py-2 font-medium text-foreground">{s.name}</td>
                                <td className="py-2 text-[10px] text-muted-foreground">{s.description}</td>
                                <td className={`py-2 text-right font-mono font-bold ${getStatusText(s.status)}`}>{s.value} {s.unit}</td>
                                <td className="py-2 text-center"><StatusBadge status={s.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Vessel Alerts */}
          {filteredAlerts.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> Alerts for {selectedVessel.vesselName}
              </h3>
              <p className="text-[10px] text-muted-foreground mb-3">Sensor readings that exceeded safe operating thresholds</p>
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusBg(alert.severity)}`}>
                    <StatusIndicator status={alert.severity} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-foreground">{alert.sensorName}</span>
                        <StatusBadge status={alert.severity} />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                        <span>{alert.alertType}</span>
                        <span>·</span>
                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
