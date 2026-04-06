import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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
  Pause,
  Play,
} from "lucide-react";
import { vesselData, alertHighlights, fleetComparisonData, type VesselData } from "@/data/commandCenterData";
import { cn } from "@/lib/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const statusColors: Record<string, string> = {
  normal: "hsl(152, 55%, 42%)",
  warning: "hsl(38, 92%, 50%)",
  critical: "hsl(357, 96%, 46%)",
};

const companyColors: Record<string, string> = {
  "Adani Ports": "hsl(215, 50%, 23%)",
  "Ocean Sparkle": "hsl(357, 96%, 46%)",
  "Global Maritime": "hsl(152, 55%, 32%)",
  "Pacific Shipping": "hsl(38, 92%, 45%)",
};

const severityStyles: Record<string, string> = {
  critical: "border-l-4 border-l-destructive bg-destructive/5",
  warning: "border-l-4 border-l-warning bg-warning/5",
  info: "border-l-4 border-l-info bg-info/5",
  normal: "border-l-4 border-l-success bg-success/5",
};

const comparisonMetrics = [
  { key: "efficiency", label: "Efficiency %", color: "hsl(152, 55%, 42%)" },
  { key: "fuelConsumption", label: "Total Fuel Used", color: "hsl(38, 92%, 50%)" },
  { key: "downtime", label: "Avg Downtime", color: "hsl(357, 96%, 46%)" },
  { key: "compliance", label: "Compliance %", color: "hsl(210, 80%, 52%)" },
];

const ROTATION_INTERVAL = 5000;

export default function CommandCenter() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef<number>();

  const filteredVessels = useMemo(() =>
    companyFilter ? vesselData.filter((v) => v.company === companyFilter) : vesselData,
    [companyFilter]
  );

  const selectedVessel = filteredVessels[selectedIndex % filteredVessels.length] || filteredVessels[0];

  // Fleet stats
  const fleetStats = useMemo(() => {
    const total = vesselData.length;
    const onHire = vesselData.filter((v) => v.hiringStatus === "ON-Hire").length;
    const critical = vesselData.filter((v) => v.status === "critical").length;
    const warning = vesselData.filter((v) => v.status === "warning").length;
    return { total, onHire, critical, warning };
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotation every 5 seconds
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % filteredVessels.length);
    }, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRotate, filteredVessels.length]);

  // Auto-scroll highlights
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

  const handleVesselClick = useCallback((vessel: VesselData) => {
    const idx = filteredVessels.findIndex((v) => v.id === vessel.id);
    if (idx >= 0) {
      setSelectedIndex(idx);
      setAutoRotate(false); // pause on manual selection
    }
  }, [filteredVessels]);


  const companyNames = Object.keys(companyColors);

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* Top Bar */}
      <header className="h-10 flex items-center justify-between px-4 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Radio className="w-4 h-4 text-secondary animate-pulse" />
          <span className="text-xs font-semibold tracking-wider uppercase text-foreground">Command Center</span>
          <div className="flex items-center gap-3 ml-3 text-[10px]">
            <span className="text-muted-foreground">{fleetStats.total} Vessels</span>
            <span className="text-success">{fleetStats.onHire} On-Hire</span>
            {fleetStats.critical > 0 && <span className="text-destructive">{fleetStats.critical} Critical</span>}
            {fleetStats.warning > 0 && <span className="text-warning">{fleetStats.warning} Warning</span>}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Auto-rotate controls */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={cn(
              "flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md border transition-colors",
              autoRotate
                ? "border-success/30 bg-success/5 text-success"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {autoRotate ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {autoRotate ? "Auto-Cycling" : "Paused"}
          </button>
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

              {filteredVessels.map((vessel) => (
                <Marker
                  key={vessel.id}
                  coordinates={[vessel.longitude, vessel.latitude]}
                  onClick={() => handleVesselClick(vessel)}
                >
                  {vessel.id === selectedVessel?.id && (
                    <circle
                      r={10}
                      fill="none"
                      stroke={companyColors[vessel.company] || statusColors[vessel.status]}
                      strokeWidth={1.5}
                      opacity={0.4}
                      className="animate-ping"
                      style={{ animationDuration: "2s" }}
                    />
                  )}
                  <circle
                    r={vessel.id === selectedVessel?.id ? 5 : 3}
                    fill={companyColors[vessel.company] || statusColors[vessel.status]}
                    stroke={vessel.id === selectedVessel?.id ? "hsl(215, 50%, 23%)" : "none"}
                    strokeWidth={vessel.id === selectedVessel?.id ? 2 : 0}
                    className="cursor-pointer transition-all duration-300"
                    opacity={vessel.id === selectedVessel?.id ? 1 : 0.7}
                  />
                  {vessel.id === selectedVessel?.id && (
                    <text
                      textAnchor="middle"
                      y={-12}
                      fill="hsl(215, 50%, 15%)"
                      fontSize={8}
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

          {/* Map Legend - Company colors */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-sm">
            <p className="text-[10px] text-muted-foreground mb-2 font-medium">COMPANIES</p>
            {companyNames.map((name) => {
              const count = vesselData.filter((v) => v.company === name).length;
              return (
                <button
                  key={name}
                  onClick={() => setCompanyFilter(companyFilter === name ? null : name)}
                  className={cn(
                    "w-full flex items-center gap-2 mb-1 text-left rounded px-1 py-0.5 transition-colors",
                    companyFilter === name && "bg-accent"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: companyColors[name] }} />
                  <span className="text-[10px] text-foreground">{name}</span>
                  <span className="text-[9px] text-muted-foreground ml-auto">{count}</span>
                </button>
              );
            })}
            {companyFilter && (
              <button
                onClick={() => setCompanyFilter(null)}
                className="text-[9px] text-primary mt-1 hover:underline"
              >
                Show All
              </button>
            )}
          </div>

          {/* Vessel counter */}
          <div className="absolute top-3 left-3 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-sm px-3 py-2">
            <p className="text-[10px] text-muted-foreground font-medium">
              {companyFilter ? `${companyFilter}` : "ALL FLEETS"}
            </p>
            <p className="text-lg font-bold text-foreground">{filteredVessels.length}</p>
            <p className="text-[9px] text-muted-foreground">vessels</p>
          </div>

          {/* Progress indicator for auto-rotation */}
          {autoRotate && (
            <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-sm px-3 py-2">
              <p className="text-[9px] text-muted-foreground">Cycling vessel</p>
              <p className="text-xs font-mono font-bold text-foreground">
                {(selectedIndex % filteredVessels.length) + 1} / {filteredVessels.length}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT - Intelligence Panel */}
        <div className="w-1/2 flex flex-col min-h-0 bg-background">
          {/* Vessel Summary Card */}
          {selectedVessel && (
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
                      <span className="font-medium" style={{ color: companyColors[selectedVessel.company] }}>
                        {selectedVessel.company}
                      </span>
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
                  <KpiMini icon={Droplets} label="Water" value={`${selectedVessel.waterBalance > 1000 ? (selectedVessel.waterBalance / 1000).toFixed(1) + "K" : selectedVessel.waterBalance}`}
                    trend={selectedVessel.waterBalance < 5000 ? "down" : "up"}
                    alert={selectedVessel.waterBalance < 5000} />
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
          )}

          {/* Scrolling Highlights */}
          <div className="px-4 py-3 border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
                Live Alerts & Insights ({alertHighlights.length})
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

          {/* Fleet Comparison - Donut Charts */}
          <div className="flex-1 p-4 min-h-0 flex flex-col">
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase mb-2">
              Fleet Comparison by Company
            </p>

            <div className="flex-1 min-h-0 grid grid-cols-4 gap-3">
              {comparisonMetrics.map((metric) => {
                const donutData = fleetComparisonData.map((d) => ({
                  name: d.vessel,
                  value: d[metric.key as keyof typeof d] as number,
                  isSelected: d.vessel === selectedVessel?.company,
                }));
                const total = donutData.reduce((s, d) => s + d.value, 0);
                const donutColors = fleetComparisonData.map((d) => companyColors[d.vessel] || "#ccc");

                return (
                  <div key={metric.key} className="flex flex-col items-center">
                    <p className="text-[9px] text-muted-foreground font-medium mb-1">{metric.label}</p>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius="55%"
                            outerRadius="85%"
                            dataKey="value"
                            stroke="hsl(0, 0%, 100%)"
                            strokeWidth={2}
                          >
                            {donutData.map((entry, idx) => (
                              <Cell
                                key={idx}
                                fill={donutColors[idx]}
                                opacity={entry.isSelected ? 1 : 0.5}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(0, 0%, 100%)",
                              border: "1px solid hsl(216, 15%, 89%)",
                              borderRadius: "8px",
                              fontSize: "10px",
                              color: "hsl(215, 50%, 15%)",
                              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            }}
                            formatter={(value: number) => [value.toLocaleString(), metric.label]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs font-bold font-mono text-foreground">{total.toLocaleString()}</p>
                    <p className="text-[8px] text-muted-foreground">Total</p>
                  </div>
                );
              })}
            </div>

            {/* Company legend */}
            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-border">
              {fleetComparisonData.map((d) => (
                <div
                  key={d.vessel}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] transition-colors",
                    d.vessel === selectedVessel?.company && "bg-accent font-medium"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: companyColors[d.vessel] }} />
                  <span className="text-foreground">{d.vessel}</span>
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
        "rounded-lg bg-accent/50 border border-border p-2 transition-all duration-500",
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
