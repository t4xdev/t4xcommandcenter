import { useState, useMemo } from "react";
import {
  Activity, AlertTriangle, Anchor, Droplets, Gauge, Thermometer, Waves,
  Zap, Wifi, WifiOff, Clock, Circle, BarChart3, Fuel, Cog, Fan,
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from "recharts";
import {
  vesselSensorData, kpiMetrics, recentAlerts, fuelTrendData,
  telemetryData24h, telemetryData6h, telemetryData1h,
  getGaugeColor, getStatusBg, getStatusText,
  type SensorStatus, type SensorPoint,
} from "@/data/iotSensorData";

// ─── Helpers ───
const tip = {
  backgroundColor: "hsl(215, 50%, 8%)", border: "1px solid hsl(215, 30%, 20%)",
  borderRadius: "8px", fontSize: "12px", color: "hsl(216, 15%, 93%)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
};

function StatusIndicator({ status }: { status: SensorStatus }) {
  const color = status === "critical" ? "bg-destructive" : status === "warning" ? "bg-warning" : "bg-success";
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
    </span>
  );
}

function GaugeCard({ label, value, unit, max, status }: { label: string; value: number; unit: string; max: number; status: SensorStatus }) {
  const pct = Math.min((value / max) * 100, 100);
  const gaugeData = [{ value: pct, fill: getGaugeColor(status) }, { value: 100 - pct, fill: "hsl(215, 30%, 18%)" }];
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center">
      <p className="text-[11px] font-medium text-muted-foreground mb-2">{label}</p>
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
    </div>
  );
}

// ─── Sensor Diagram ───
const sensorPositions: Record<string, { top: string; left: string; icon: typeof Cog }> = {
  engine: { top: "30%", left: "40%", icon: Cog },
  fuel: { top: "55%", left: "25%", icon: Fuel },
  propeller: { top: "75%", left: "70%", icon: Fan },
  thruster: { top: "65%", left: "15%", icon: Zap },
  vibration: { top: "40%", left: "60%", icon: Waves },
  pressure: { top: "50%", left: "75%", icon: Gauge },
  temperature: { top: "25%", left: "55%", icon: Thermometer },
};

function VesselDiagram({ sensors }: { sensors: SensorPoint[] }) {
  const grouped = useMemo(() => {
    const map: Record<string, SensorPoint[]> = {};
    sensors.forEach((s) => { (map[s.component] ??= []).push(s); });
    return map;
  }, [sensors]);

  return (
    <div className="bg-card rounded-xl border border-border p-5 relative min-h-[320px]">
      <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
        <Anchor className="w-3.5 h-3.5 text-primary" /> Vessel Sensor Map
      </h3>
      <div className="relative h-[260px] bg-accent/30 rounded-lg border border-border/50 overflow-hidden">
        {/* Ship silhouette shape */}
        <div className="absolute inset-4 border-2 border-dashed border-border/40 rounded-[40%_40%_5%_5%]" />
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-medium uppercase tracking-widest">Bow</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground font-medium uppercase tracking-widest">Stern</div>

        {Object.entries(grouped).map(([component, sensorList]) => {
          const pos = sensorPositions[component];
          if (!pos) return null;
          const worstStatus = sensorList.some(s => s.status === "critical") ? "critical" : sensorList.some(s => s.status === "warning") ? "warning" : "normal";
          const Icon = pos.icon;
          return (
            <div key={component} className="absolute group" style={{ top: pos.top, left: pos.left, transform: "translate(-50%, -50%)" }}>
              <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${getStatusBg(worstStatus)}`}>
                <Icon className={`w-4 h-4 ${getStatusText(worstStatus)}`} />
              </div>
              {/* Tooltip on hover */}
              <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                <div className="bg-card border border-border rounded-lg shadow-xl p-2.5 min-w-[140px]">
                  <p className="text-[10px] font-bold text-foreground capitalize mb-1">{component}</p>
                  {sensorList.map(s => (
                    <div key={s.id} className="flex items-center justify-between gap-3 py-0.5">
                      <span className="text-[9px] text-muted-foreground truncate">{s.name}</span>
                      <span className={`text-[10px] font-mono font-semibold ${getStatusText(s.status)}`}>{s.value}{s.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Time filter options
type TimeRange = "1h" | "6h" | "24h";

export default function IotDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const vessel = vesselSensorData;

  const telemetry = timeRange === "1h" ? telemetryData1h : timeRange === "6h" ? telemetryData6h : telemetryData24h;

  const statusIcon = vessel.connectionStatus === "online" ? Wifi : WifiOff;
  const StatusIcon = statusIcon;

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-foreground">{vessel.vesselName}</h2>
              <p className="text-[10px] text-muted-foreground">IMO {vessel.imo} · {vessel.fleet} Fleet</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 border border-success/30">
              <StatusIcon className="w-3 h-3 text-success" />
              <span className="text-[10px] font-semibold text-success capitalize">{vessel.connectionStatus}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              Last sync: {new Date(vessel.lastSync).toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/15 border border-destructive/30">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span className="text-[10px] font-semibold text-destructive">{vessel.alertCount} Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpiMetrics.map((m, i) => (
          <div key={m.label} className={`bg-card rounded-xl border p-3 text-center animate-fade-in-up ${m.status === "critical" ? "border-destructive/40" : m.status === "warning" ? "border-warning/40" : "border-border"}`} style={{ animationDelay: `${i * 40}ms` }}>
            <StatusIndicator status={m.status} />
            <p className="text-lg font-bold font-mono text-foreground mt-1">{m.value}</p>
            <p className="text-[9px] text-muted-foreground">{m.unit}</p>
            <p className="text-[10px] font-medium text-muted-foreground mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Vessel Diagram */}
        <VesselDiagram sensors={vessel.sensors} />

        {/* Fuel Monitoring */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
            <Droplets className="w-3.5 h-3.5 text-info" /> Fuel Monitoring
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <GaugeCard label="Fuel Level" value={72} unit="%" max={100} status="normal" />
            <GaugeCard label="Flow Rate" value={42.5} unit="L/h" max={65} status="normal" />
            <GaugeCard label="Efficiency" value={88} unit="%" max={100} status="normal" />
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
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 30%, 20%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(216, 10%, 55%)", fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "hsl(216, 10%, 55%)", fontSize: 9 }} width={30} />
                <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${value}`, name]} />
                <Area type="monotone" dataKey="consumption" stroke="hsl(210, 80%, 52%)" fill="url(#fuelGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engine Monitoring */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
            <Cog className="w-3.5 h-3.5 text-warning" /> Engine Monitoring
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <GaugeCard label="RPM" value={1480} unit="RPM" max={2000} status="normal" />
            <GaugeCard label="Temperature" value={82} unit="°C" max={105} status="normal" />
            <GaugeCard label="Oil Pressure" value={3.2} unit="bar" max={6} status="warning" />
            <GaugeCard label="Vibration" value={4.8} unit="mm/s" max={6} status="critical" />
          </div>
        </div>
      </div>

      {/* Propeller & Thruster + Sensor Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Propeller & Thruster */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
            <Fan className="w-3.5 h-3.5 text-success" /> Propeller & Thruster
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <GaugeCard label="Propeller RPM" value={125} unit="RPM" max={180} status="normal" />
            <GaugeCard label="Thruster Power" value={68} unit="%" max={100} status="normal" />
            <GaugeCard label="Load" value={54} unit="%" max={100} status="normal" />
          </div>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 30%, 20%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(216, 10%, 55%)", fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "hsl(216, 10%, 55%)", fontSize: 9 }} width={35} />
                <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${Math.round(value * 10) / 10}`, name]} />
                <Line type="monotone" dataKey="propellerRPM" stroke="hsl(152, 55%, 42%)" strokeWidth={2} dot={false} name="Propeller RPM" />
                <Line type="monotone" dataKey="thrusterPower" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="Thruster %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-Time Sensor Charts */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary" /> Real-Time Telemetry
            </h3>
            <div className="flex items-center gap-1">
              {(["1h", "6h", "24h"] as TimeRange[]).map((t) => (
                <button key={t} onClick={() => setTimeRange(t)} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${timeRange === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 30%, 20%)" />
                <XAxis dataKey="time" tick={{ fill: "hsl(216, 10%, 55%)", fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "hsl(216, 10%, 55%)", fontSize: 9 }} width={35} />
                <Tooltip contentStyle={tip} formatter={(value: number, name: string) => [`${Math.round(value * 10) / 10}`, name]} />
                <Line type="monotone" dataKey="engineTemp" stroke="hsl(357, 96%, 46%)" strokeWidth={1.5} dot={false} name="Engine Temp (°C)" />
                <Line type="monotone" dataKey="fuelConsumption" stroke="hsl(210, 80%, 52%)" strokeWidth={1.5} dot={false} name="Fuel (L/h)" />
                <Line type="monotone" dataKey="vibration" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} dot={false} name="Vibration (mm/s)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 rounded bg-destructive" /><span className="text-[9px] text-muted-foreground">Engine Temp</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 rounded bg-info" /><span className="text-[9px] text-muted-foreground">Fuel</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 rounded bg-warning" /><span className="text-[9px] text-muted-foreground">Vibration</span></div>
          </div>
        </div>
      </div>

      {/* Alert Panel */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> Recent Alerts
        </h3>
        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${getStatusBg(alert.severity)}`}>
              <StatusIndicator status={alert.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-foreground">{alert.sensorName}</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${alert.severity === "critical" ? "severity-high" : alert.severity === "warning" ? "severity-medium" : "severity-low"}`}>{alert.severity}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{alert.message}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[9px] text-muted-foreground">{alert.vessel}</span>
                  <span className="text-[9px] text-muted-foreground">·</span>
                  <span className="text-[9px] text-muted-foreground">{alert.alertType}</span>
                  <span className="text-[9px] text-muted-foreground">·</span>
                  <span className="text-[9px] text-muted-foreground">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
