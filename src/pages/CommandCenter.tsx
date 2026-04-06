import { useState, useEffect, useRef, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Ship,
  Fuel,
  Droplets,
  Clock,
  Users,
  Wrench,
  Shield,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Anchor,
  Navigation,
  MapPin,
  TrendingUp,
  TrendingDown,
  Radio,
} from "lucide-react";
import { vesselData, alertHighlights, fleetComparisonData, type VesselData } from "@/data/commandCenterData";
import { cn } from "@/lib/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const statusColors: Record<string, string> = {
  normal: "hsl(152, 55%, 42%)",
  warning: "hsl(38, 92%, 50%)",
  critical: "hsl(357, 96%, 46%)",
};

const severityStyles: Record<string, string> = {
  critical: "border-l-4 border-l-destructive bg-destructive/5",
  warning: "border-l-4 border-l-warning bg-warning/5",
  info: "border-l-4 border-l-info bg-info/5",
  normal: "border-l-4 border-l-success bg-success/5",
};

const comparisonMetrics = [
  { key: "efficiency", label: "Efficiency %", color: "hsl(152, 55%, 42%)" },
  { key: "fuelConsumption", label: "Fuel Used (Ltr)", color: "hsl(38, 92%, 50%)" },
  { key: "downtime", label: "Downtime (Hrs)", color: "hsl(357, 96%, 46%)" },
  { key: "compliance", label: "Compliance %", color: "hsl(210, 80%, 52%)" },
];

export default function CommandCenter() {
  const [selectedVessel, setSelectedVessel] = useState<VesselData>(vesselData[0]);
  const [activeMetric, setActiveMetric] = useState("efficiency");
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scroll = () => {
      setScrollPosition((prev) => {
        const max = container.scrollWidth - container.clientWidth;
        const next = prev + 0.5;
        return next >= max ? 0 : next;
      });
      animationRef.current = requestAnimationFrame(scroll);
    };
    animationRef.current = requestAnimationFrame(scroll);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollPosition;
  }, [scrollPosition]);

  const handleScrollManual = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 300;
    setScrollPosition(dir === "left" ? Math.max(0, scrollPosition - amount) : scrollPosition + amount);
  }, [scrollPosition]);

  const currentMetricData = fleetComparisonData.map((d) => ({
    vessel: d.vessel.length > 12 ? d.vessel.slice(0, 12) + "…" : d.vessel,
    fullName: d.vessel,
    value: d[activeMetric as keyof typeof d] as number,
    isSelected: d.vessel === selectedVessel.name,
  }));

  const metricInfo = comparisonMetrics.find((m) => m.key === activeMetric)!;

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Top Bar */}
      <header className="h-10 flex items-center justify-between px-4 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Radio className="w-4 h-4 text-secondary animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-foreground">Command Center</span>
          <span className="text-[10px] text-muted-foreground ml-2">
            {vesselData.length} Vessels Tracked
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">LIVE</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {currentTime.toLocaleTimeString()} UTC
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT - Map */}
        <div className="w-1/2 relative border-r border-border bg-accent/30">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 140, center: [50, 10] }}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rpianoKey || geo.properties.name}
                      geography={geo}
                      fill="hsl(215, 22%, 88%)"
                      stroke="hsl(215, 15%, 78%)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "hsl(215, 22%, 82%)" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {vesselData.map((vessel) => (
                <Marker
                  key={vessel.id}
                  coordinates={[vessel.longitude, vessel.latitude]}
                  onClick={() => setSelectedVessel(vessel)}
                >
                  <circle
                    r={vessel.id === selectedVessel.id ? 12 : 8}
                    fill="none"
                    stroke={statusColors[vessel.status]}
                    strokeWidth={1.5}
                    opacity={0.4}
                    className="animate-ping"
                    style={{ animationDuration: "2s" }}
                  />
                  <circle
                    r={vessel.id === selectedVessel.id ? 6 : 4}
                    fill={statusColors[vessel.status]}
                    stroke={vessel.id === selectedVessel.id ? "hsl(215, 50%, 23%)" : "none"}
                    strokeWidth={vessel.id === selectedVessel.id ? 2 : 0}
                    className="cursor-pointer transition-all duration-300"
                  />
                  {vessel.id === selectedVessel.id && (
                    <text
                      textAnchor="middle"
                      y={-14}
                      fill="hsl(215, 50%, 15%)"
                      fontSize={9}
                      fontWeight={700}
                      fontFamily="Inter, sans-serif"
                    >
                      {vessel.name}
                    </text>
                  )}
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-sm">
            <p className="text-[10px] text-muted-foreground mb-2 font-medium">VESSEL STATUS</p>
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[10px] capitalize text-foreground">{status}</span>
              </div>
            ))}
          </div>

          {/* Fleet quick list */}
          <div className="absolute top-3 left-3 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-sm max-w-[200px]">
            <p className="text-[10px] text-muted-foreground px-3 pt-2 pb-1 font-medium">FLEET</p>
            {vesselData.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVessel(v)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-1.5 text-[10px] hover:bg-accent transition-colors text-foreground",
                  v.id === selectedVessel.id && "bg-accent font-medium"
                )}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColors[v.status] }} />
                <span className="truncate">{v.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT - Intelligence Panel */}
        <div className="w-1/2 flex flex-col min-h-0 bg-background">
          {/* Vessel Summary Card */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="bg-card rounded-xl border border-border shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="w-4 h-4 text-primary" />
                    <h2 className="text-base font-bold text-foreground">{selectedVessel.name}</h2>
                    <span
                      className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase",
                        selectedVessel.status === "normal" && "bg-success/10 text-success",
                        selectedVessel.status === "warning" && "bg-warning/10 text-warning",
                        selectedVessel.status === "critical" && "bg-destructive/10 text-destructive"
                      )}
                    >
                      {selectedVessel.status}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] px-2 py-0.5 rounded-full font-medium",
                        selectedVessel.hiringStatus === "ON-Hire"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {selectedVessel.hiringStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>IMO: {selectedVessel.imo}</span>
                    <span>•</span>
                    <span>{selectedVessel.company}</span>
                    <span>•</span>
                    <span>Master: {selectedVessel.master}</span>
                  </div>
                </div>
                <div className="text-right text-[10px] text-muted-foreground">
                  <p>Report: {selectedVessel.reportDate}</p>
                  <p>At: {selectedVessel.reportTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-3 text-[11px] text-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-primary" />
                  <span>{selectedVessel.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-primary" />
                  <span>{selectedVessel.speed} kn / {selectedVessel.course}°</span>
                </div>
                {selectedVessel.client !== "-" && (
                  <div className="flex items-center gap-1.5">
                    <Anchor className="w-3 h-3 text-primary" />
                    <span>Client: {selectedVessel.client}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                <KpiMini icon={Fuel} label="Fuel Balance" value={`${(selectedVessel.fuelBalance / 1000).toFixed(1)}K L`}
                  trend={selectedVessel.fuelBalance < 20000 ? "down" : "up"}
                  alert={selectedVessel.fuelBalance < 20000} />
                <KpiMini icon={Droplets} label="Water" value={`${selectedVessel.waterBalance}`}
                  trend={selectedVessel.waterBalance < 15 ? "down" : "up"}
                  alert={selectedVessel.waterBalance < 15} />
                <KpiMini icon={Clock} label="Ops Hours" value={selectedVessel.totalOpsHrs} />
                <KpiMini icon={Users} label="Crew" value={`${selectedVessel.crewOnBoard}`} />
                <KpiMini icon={Wrench} label="Maint. Done" value={`${selectedVessel.maintenanceDone}`} />
                <KpiMini icon={AlertTriangle} label="Defects" value={`${selectedVessel.outstandingDefects}`}
                  alert={selectedVessel.outstandingDefects > 0}
                  trend={selectedVessel.outstandingDefects > 0 ? "down" : undefined} />
                <KpiMini icon={Shield} label="Certs Valid" value={`${selectedVessel.certificatesValid}`}
                  alert={selectedVessel.certificatesExpired > 0}
                  subtitle={selectedVessel.certificatesExpired > 0 ? `${selectedVessel.certificatesExpired} expired` : undefined} />
                <KpiMini icon={Activity} label="Provisions" value={`${selectedVessel.provisionDays}d`}
                  trend={selectedVessel.provisionDays < 5 ? "down" : "up"}
                  alert={selectedVessel.provisionDays < 5} />
              </div>
            </div>
          </div>

          {/* Scrolling Highlights */}
          <div className="px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Live Alerts & Insights
              </p>
              <div className="flex gap-1">
                <button onClick={() => handleScrollManual("left")}
                  className="p-1 rounded hover:bg-accent text-muted-foreground">
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button onClick={() => handleScrollManual("right")}
                  className="p-1 rounded hover:bg-accent text-muted-foreground">
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-hidden"
              onMouseEnter={() => { if (animationRef.current) cancelAnimationFrame(animationRef.current); }}
              onMouseLeave={() => {
                const scroll = () => {
                  setScrollPosition((prev) => {
                    if (!scrollRef.current) return prev;
                    const max = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                    const next = prev + 0.5;
                    return next >= max ? 0 : next;
                  });
                  animationRef.current = requestAnimationFrame(scroll);
                };
                animationRef.current = requestAnimationFrame(scroll);
              }}
            >
              {[...alertHighlights, ...alertHighlights].map((alert, i) => (
                <div
                  key={`${alert.id}-${i}`}
                  className={cn(
                    "min-w-[220px] max-w-[220px] rounded-lg p-3 shrink-0",
                    severityStyles[alert.severity]
                  )}
                >
                  <p className="text-[10px] font-semibold mb-0.5 truncate text-foreground">{alert.title}</p>
                  <p className="text-[9px] text-primary mb-1">{alert.vesselName}</p>
                  <p className="text-[9px] text-muted-foreground leading-relaxed line-clamp-2">
                    {alert.description}
                  </p>
                  <p className="text-[8px] text-muted-foreground/70 mt-1">{alert.timestamp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet Comparison */}
          <div className="flex-1 p-4 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Fleet Comparison
              </p>
              <div className="flex gap-1">
                {comparisonMetrics.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setActiveMetric(m.key)}
                    className={cn(
                      "text-[9px] px-2 py-1 rounded-md transition-colors",
                      activeMetric === m.key
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentMetricData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" vertical={false} />
                  <XAxis
                    dataKey="vessel"
                    tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 10 }}
                    axisLine={{ stroke: "hsl(216, 15%, 89%)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(216, 15%, 89%)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "hsl(215, 50%, 15%)",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => [value, metricInfo.label]}
                    labelFormatter={(label: string) => {
                      const item = currentMetricData.find((d) => d.vessel === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {currentMetricData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.isSelected ? metricInfo.color : `${metricInfo.color}40`}
                        stroke={entry.isSelected ? metricInfo.color : "none"}
                        strokeWidth={entry.isSelected ? 2 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ranking strip */}
            <div className="flex gap-2 mt-2">
              {[...fleetComparisonData]
                .sort((a, b) => {
                  const valA = a[activeMetric as keyof typeof a] as number;
                  const valB = b[activeMetric as keyof typeof b] as number;
                  return activeMetric === "downtime" || activeMetric === "fuelConsumption"
                    ? valA - valB
                    : valB - valA;
                })
                .map((v, i) => (
                  <div
                    key={v.vessel}
                    className={cn(
                      "flex-1 text-center rounded-md py-1 text-[9px] border",
                      v.vessel === selectedVessel.name
                        ? "bg-primary/5 border-primary ring-1 ring-primary/20"
                        : "bg-card border-border"
                    )}
                  >
                    <span className="text-muted-foreground">#{i + 1}</span>
                    <p className="font-medium truncate px-1 text-foreground">
                      {v.vessel.length > 10 ? v.vessel.slice(0, 10) + "…" : v.vessel}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiMini({
  icon: Icon,
  label,
  value,
  trend,
  alert,
  subtitle,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: "up" | "down";
  alert?: boolean;
  subtitle?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-accent/50 border border-border p-2",
        alert && "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-3 h-3 text-muted-foreground" />
        {trend === "up" && <TrendingUp className="w-3 h-3 text-success" />}
        {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
      </div>
      <p className={cn("text-sm font-bold font-mono text-foreground", alert && "text-destructive")}>
        {value}
      </p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
      {subtitle && <p className="text-[8px] text-destructive">{subtitle}</p>}
    </div>
  );
}
