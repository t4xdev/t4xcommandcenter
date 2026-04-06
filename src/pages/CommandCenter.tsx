import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import adaniLogo from "@/assets/adani-logo.png";
import vesselImg1 from "@/assets/vessel-img-1.jpg";
import vesselImg2 from "@/assets/vessel-img-2.jpg";
import vesselImg3 from "@/assets/vessel-img-3.jpg";
import vesselImg4 from "@/assets/vessel-img-4.jpg";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceDot,
  ReferenceLine,
  Label,
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
  X,
  Pause,
  Play,
  Search,
} from "lucide-react";
import { vesselData, alertHighlights, type VesselData } from "@/data/commandCenterData";
import { cn } from "@/lib/utils";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const statusColors: Record<string, string> = {
  normal: "hsl(152, 55%, 42%)",
  warning: "hsl(38, 92%, 50%)",
  critical: "hsl(357, 96%, 46%)",
};

const companyColors: Record<string, string> = {
  "Adani Ports": "hsl(215, 60%, 45%)",
  "Ocean Sparkle": "hsl(280, 45%, 45%)",
  "Global Maritime": "hsl(25, 65%, 45%)",
  "Pacific Shipping": "hsl(185, 55%, 38%)",
};

const severityStyles: Record<string, string> = {
  critical: "border-l-4 border-l-destructive bg-destructive/5",
  warning: "border-l-4 border-l-warning bg-warning/5",
  info: "border-l-4 border-l-info bg-info/5",
  normal: "border-l-4 border-l-success bg-success/5",
};


const ROTATION_OPTIONS = [5, 10, 15, 20, 30, 60];
const vesselImages = [vesselImg1, vesselImg2, vesselImg3, vesselImg4];
const imageLabels = ["Aerial View", "Port Side", "Forward Deck", "Aft Deck"];

export default function CommandCenter() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(10);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [vesselSearch, setVesselSearch] = useState("");
  const [showVesselSearch, setShowVesselSearch] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [hoveredVesselId, setHoveredVesselId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef<number>();
  const autoRotateRef = useRef(autoRotate);
  const [mapCenter, setMapCenter] = useState<[number, number]>([75, 12]);
  const [mapZoom, setMapZoom] = useState(2.5);

  const filteredVessels = useMemo(() =>
    companyFilter ? vesselData.filter((v) => v.company === companyFilter) : vesselData,
    [companyFilter]
  );

  const selectedVessel = useMemo(
    () =>
      filteredVessels.find((v) => v.id === selectedVesselId) ??
      filteredVessels[selectedIndex % filteredVessels.length] ??
      filteredVessels[0],
    [filteredVessels, selectedIndex, selectedVesselId]
  );

  // Scatter plot data - efficiency vs fuel for all vessels
  const scatterData = useMemo(() => filteredVessels.map((v) => {
    const dpH = parseInt(v.dpOpsHrs.split(":")[0]) || 0;
    const efficiency = Math.round((dpH / 24) * 100);
    return { id: v.id, name: v.name, company: v.company, efficiency, fuelUsed: v.fuelUsed, crewOnBoard: v.crewOnBoard };
  }), [filteredVessels]);

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

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const indexedVessel = filteredVessels[selectedIndex % filteredVessels.length] ?? filteredVessels[0];
    if (indexedVessel && indexedVessel.id !== selectedVesselId) {
      setSelectedVesselId(indexedVessel.id);
    }
  }, [filteredVessels, selectedIndex, selectedVesselId]);

  // Auto-rotation every 5 seconds
  useEffect(() => {
    if (!autoRotate || !filteredVessels.length) return;
    const interval = window.setInterval(() => {
      if (!autoRotateRef.current) return;
      setSelectedIndex((prev) => (prev + 1) % filteredVessels.length);
    }, rotationInterval * 1000);
    return () => window.clearInterval(interval);
  }, [autoRotate, filteredVessels.length, rotationInterval]);

  // Image slideshow - cycle every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % vesselImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Reset image on vessel change + zoom-to-vessel animation
  useEffect(() => {
    if (!selectedVessel) return;
    setImageIndex(0);
    setShowInfoPopup(true);
    setMapCenter([selectedVessel.longitude, selectedVessel.latitude]);
    setMapZoom(3);
  }, [selectedVessel]);

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
    autoRotateRef.current = false;
    setAutoRotate(false);
    setSelectedVesselId(vessel.id);
    setShowInfoPopup(true);
    const idx = filteredVessels.findIndex((v) => v.id === vessel.id);
    if (idx >= 0) {
      setSelectedIndex(idx);
    }
  }, [filteredVessels]);

  const searchResults = useMemo(() => {
    if (!vesselSearch.trim()) return [];
    const q = vesselSearch.toLowerCase();
    return vesselData.filter((v) =>
      v.name.toLowerCase().includes(q) || v.imo.includes(q) || v.company.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [vesselSearch]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowVesselSearch(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
          <div className="flex items-center gap-1.5">
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
              {autoRotate ? "Auto" : "Paused"}
            </button>
            <select
              value={rotationInterval}
              onChange={(e) => setRotationInterval(Number(e.target.value))}
              className="text-[10px] bg-card border border-border rounded-md px-1.5 py-1 text-foreground outline-none cursor-pointer"
            >
              {ROTATION_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}s</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">LIVE</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {currentTime.toLocaleTimeString()} UTC
          </span>
          <img src={adaniLogo} alt="Adani" className="h-5 w-auto" />
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
            title="Exit Command Center"
          >
            <X className="w-3 h-3" />
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* LEFT - Map */}
        <div className="w-1/2 relative border-r border-border bg-accent/30">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 220, center: [55, 15] }}
            className="w-full h-full"
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup center={mapCenter} zoom={mapZoom} minZoom={0.5} maxZoom={8} onMoveEnd={({ coordinates, zoom }) => { setMapCenter(coordinates as [number, number]); setMapZoom(zoom); }}>
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

              {/* All vessel markers */}
              {filteredVessels.map((vessel) => {
                const isSelected = vessel.id === selectedVessel?.id;
                const isHovered = vessel.id === hoveredVesselId;
                return (
                  <Marker
                    key={vessel.id}
                    coordinates={[vessel.longitude, vessel.latitude]}
                    onClick={() => handleVesselClick(vessel)}
                    onMouseEnter={() => setHoveredVesselId(vessel.id)}
                    onMouseLeave={() => setHoveredVesselId(null)}
                  >
                    {/* Ping ring - centered at origin, no transform */}
                    {isSelected && (
                      <circle
                        r={12}
                        fill="none"
                        stroke={statusColors[vessel.status]}
                        strokeWidth={1.5}
                        opacity={0.4}
                        className="animate-ping"
                        style={{ animationDuration: "2s" }}
                      />
                    )}
                    {/* Arrow marker - rotate only, no scale shift */}
                    <g
                      transform={`rotate(${vessel.course}, 0, 0)`}
                      className="cursor-pointer"
                    >
                      <polygon
                        points="0,-3 2,2 0,1 -2,2"
                        fill={statusColors[vessel.status]}
                        stroke={isSelected ? statusColors[vessel.status] : "hsl(0, 0%, 30%)"}
                        strokeWidth={isSelected ? 2 : 0.5}
                        opacity={isSelected ? 1 : 0.8}
                      />
                    </g>
                    {/* Hover tooltip */}
                    {isHovered && !isSelected && (
                      <foreignObject x={8} y={-12} width={120} height={24} style={{ pointerEvents: "none", overflow: "visible" }}>
                        <div style={{ background: "hsl(215, 25%, 20%)", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap", width: "fit-content" }}>
                          {vessel.name}
                        </div>
                      </foreignObject>
                    )}
                    {/* Selected info popup - positioned above marker */}
                    {isSelected && showInfoPopup && (
                      <foreignObject x={-90} y={-70} width={180} height={60} style={{ overflow: "visible", pointerEvents: "none" }}>
                        <div style={{ background: "hsl(0, 0%, 100%)", border: "1px solid hsl(215, 15%, 82%)", borderRadius: 5, padding: "4px 6px", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", fontSize: 8, lineHeight: 1.4 }}>
                          <div style={{ fontWeight: 700, fontSize: 9, marginBottom: 1 }}>{vessel.name}</div>
                          <div style={{ color: "hsl(215, 15%, 45%)", fontSize: 8 }}>
                            <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", backgroundColor: statusColors[vessel.status], marginRight: 3 }} />
                            {vessel.status.charAt(0).toUpperCase() + vessel.status.slice(1)} · {vessel.hiringStatus}
                          </div>
                          <div style={{ color: "hsl(215, 15%, 45%)", fontSize: 8 }}>Speed: {vessel.speed} kn · Course: {vessel.course}°</div>
                          <div style={{ color: "hsl(215, 15%, 55%)", fontSize: 7 }}>{vessel.company}</div>
                        </div>
                      </foreignObject>
                    )}
                  </Marker>
                );
              })}


            </ZoomableGroup>
          </ComposableMap>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-sm">
            <p className="text-[10px] text-muted-foreground mb-2 font-medium">STATUS</p>
            {(["normal", "warning", "critical"] as const).map((status) => {
              const count = filteredVessels.filter((v) => v.status === status).length;
              return (
                <div key={status} className="flex items-center gap-2 mb-1 px-1 py-0.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: statusColors[status] }} />
                  <span className="text-[10px] text-foreground capitalize">{status}</span>
                  <span className="text-[9px] text-muted-foreground ml-auto">{count}</span>
                </div>
              );
            })}
            <div className="border-t border-border mt-2 pt-2">
              <p className="text-[10px] text-muted-foreground mb-1 font-medium">COMPANIES</p>
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
                    <span className="w-2.5 h-2.5 rounded shrink-0 border" style={{ borderColor: companyColors[name] }} />
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
          </div>

          {/* Vessel counter */}
          <div className="absolute top-3 left-3 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-sm px-3 py-2">
            <p className="text-[10px] text-muted-foreground font-medium">
              {companyFilter ? `${companyFilter}` : "ALL FLEETS"}
            </p>
            <p className="text-lg font-bold text-foreground">{filteredVessels.length}</p>
            <p className="text-[9px] text-muted-foreground">vessels</p>
          </div>

          {/* Vessel Search */}
          <div ref={searchRef} className="absolute top-3 right-3 z-10" style={{ width: 220 }}>
            <div
              className="flex items-center gap-1.5 bg-card/95 backdrop-blur-sm border border-border rounded-lg px-2 py-1.5 cursor-pointer"
              onClick={() => setShowVesselSearch(true)}
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={vesselSearch}
                onChange={(e) => { setVesselSearch(e.target.value); setShowVesselSearch(true); }}
                placeholder="Search vessel name or IMO..."
                className="bg-transparent text-[10px] text-foreground placeholder:text-muted-foreground outline-none w-full"
                onFocus={() => setShowVesselSearch(true)}
              />
              {vesselSearch && (
                <button onClick={(e) => { e.stopPropagation(); setVesselSearch(""); }} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {showVesselSearch && searchResults.length > 0 && (
              <div className="mt-1 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      if (companyFilter && v.company !== companyFilter) {
                        setCompanyFilter(null);
                      }
                      autoRotateRef.current = false;
                      setAutoRotate(false);
                      setSelectedVesselId(v.id);
                      const targetList = (companyFilter && v.company === companyFilter) ? filteredVessels : vesselData;
                      const idx = targetList.findIndex((fv) => fv.id === v.id);
                      if (idx >= 0) {
                        setSelectedIndex(idx);
                      }
                      setVesselSearch("");
                      setShowVesselSearch(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-accent transition-colors",
                      v.id === selectedVessel?.id && "bg-accent"
                    )}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: companyColors[v.company] || "#ccc" }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-foreground truncate">{v.name}</p>
                      <p className="text-[8px] text-muted-foreground">{v.company} · IMO {v.imo}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
              <div className="flex gap-3">
                {/* Vessel Image Slideshow Card */}
                <div className="w-[180px] shrink-0 rounded-xl border border-border overflow-hidden bg-card shadow-sm flex flex-col">
                  <div className="relative flex-1 min-h-0 overflow-hidden">
                    {vesselImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`${selectedVessel.name} - ${imageLabels[i]}`}
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                          i === imageIndex ? "opacity-100" : "opacity-0"
                        )}
                        loading="lazy"
                      />
                    ))}
                    <div className="absolute bottom-1.5 left-1.5 bg-foreground/60 backdrop-blur-sm rounded px-1.5 py-0.5">
                      <p className="text-[8px] text-white font-medium">{imageLabels[imageIndex]}</p>
                    </div>
                    {/* Dots */}
                    <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                      {vesselImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImageIndex(i)}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            i === imageIndex ? "bg-white scale-125" : "bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vessel Summary Card */}
                <div className="flex-1 bg-card rounded-xl border border-border shadow-sm p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Ship className="w-4 h-4 text-primary" />
                        <h2 className="text-sm font-bold text-foreground">{selectedVessel.name}</h2>
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

                  <div className="flex items-center gap-3 mb-2 text-[10px] text-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{selectedVessel.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-primary" />
                      <span>{selectedVessel.speed} kn / {selectedVessel.course}°</span>
                    </div>
                    {selectedVessel.client !== "-" && (
                      <div className="flex items-center gap-1">
                        <Anchor className="w-3 h-3 text-primary" />
                        <span>{selectedVessel.client}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    <KpiMini icon={Fuel} label="Fuel" value={`${(selectedVessel.fuelBalance / 1000).toFixed(1)}K`}
                      trend={selectedVessel.fuelBalance < 20000 ? "down" : "up"}
                      alert={selectedVessel.fuelBalance < 20000} />
                    <KpiMini icon={Droplets} label="Water" value={`${selectedVessel.waterBalance > 1000 ? (selectedVessel.waterBalance / 1000).toFixed(1) + "K" : selectedVessel.waterBalance}`}
                      trend={selectedVessel.waterBalance < 5000 ? "down" : "up"}
                      alert={selectedVessel.waterBalance < 5000} />
                    <KpiMini icon={Clock} label="Ops Hrs" value={selectedVessel.totalOpsHrs} />
                    <KpiMini icon={Users} label="Crew" value={`${selectedVessel.crewOnBoard}`} />
                    <KpiMini icon={Wrench} label="Maint." value={`${selectedVessel.maintenanceDone}`} />
                    <KpiMini icon={AlertTriangle} label="Defects" value={`${selectedVessel.outstandingDefects}`}
                      alert={selectedVessel.outstandingDefects > 0}
                      trend={selectedVessel.outstandingDefects > 0 ? "down" : undefined} />
                    <KpiMini icon={Shield} label="Certs" value={`${selectedVessel.certificatesValid}`}
                      alert={selectedVessel.certificatesExpired > 0}
                      subtitle={selectedVessel.certificatesExpired > 0 ? `${selectedVessel.certificatesExpired} exp` : undefined} />
                    <KpiMini icon={Activity} label="Provisions" value={`${selectedVessel.provisionDays}d`}
                      trend={selectedVessel.provisionDays < 5 ? "down" : "up"}
                      alert={selectedVessel.provisionDays < 5} />
                  </div>
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

          {/* Fleet Comparison - Scatter Plot */}
          <div className="flex-1 p-4 min-h-0 flex flex-col">
            <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase mb-2">
              Vessel Performance Scatter — Efficiency vs Fuel Usage
            </p>

            {(() => {
              const avgEfficiency = scatterData.length ? Math.round(scatterData.reduce((s, d) => s + d.efficiency, 0) / scatterData.length) : 0;
              const avgFuel = scatterData.length ? Math.round(scatterData.reduce((s, d) => s + d.fuelUsed, 0) / scatterData.length) : 0;
              return (
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(216, 15%, 89%)" />
                  <XAxis
                    type="number"
                    dataKey="efficiency"
                    name="Efficiency"
                    unit="%"
                    tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }}
                    label={{ value: "Operational Efficiency %", position: "bottom", fontSize: 9, fill: "hsl(216, 10%, 46%)", offset: 2 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="fuelUsed"
                    name="Fuel Used"
                    unit=" MT"
                    tick={{ fill: "hsl(216, 10%, 46%)", fontSize: 9 }}
                    label={{ value: "Fuel Used (MT)", angle: -90, position: "insideLeft", fontSize: 9, fill: "hsl(216, 10%, 46%)" }}
                  />
                  <ZAxis type="number" dataKey="crewOnBoard" range={[40, 200]} name="Crew" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(216, 15%, 89%)",
                      borderRadius: "8px",
                      fontSize: "10px",
                      color: "hsl(215, 50%, 15%)",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "Fuel Used" ? `${value} MT` : name === "Efficiency" ? `${value}%` : value,
                      name,
                    ]}
                    labelFormatter={() => ""}
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 shadow-md text-[10px]">
                          <p className="font-semibold text-foreground">{d?.name}</p>
                          <p className="text-muted-foreground">{d?.company}</p>
                          <p>Efficiency: <span className="font-mono font-bold">{d?.efficiency}%</span></p>
                          <p>Fuel Used: <span className="font-mono font-bold">{d?.fuelUsed} MT</span></p>
                          <p>Crew: <span className="font-mono font-bold">{d?.crewOnBoard}</span></p>
                        </div>
                      );
                    }}
                   />
                  {/* Average lines */}
                  <ReferenceLine
                    x={avgEfficiency}
                    stroke="hsl(215, 40%, 55%)"
                    strokeDasharray="5 3"
                    strokeWidth={1.5}
                    label={{ value: `Avg Eff: ${avgEfficiency}%`, position: "top", fontSize: 8, fill: "hsl(215, 40%, 55%)" }}
                  />
                  <ReferenceLine
                    y={avgFuel}
                    stroke="hsl(25, 50%, 55%)"
                    strokeDasharray="5 3"
                    strokeWidth={1.5}
                    label={{ value: `Avg Fuel: ${avgFuel} MT`, position: "right", fontSize: 8, fill: "hsl(25, 50%, 55%)" }}
                  />
                  {/* Background vessels */}
                  <Scatter data={scatterData.filter(e => e.id !== selectedVessel?.id)} name="Fleet">
                    {scatterData.filter(e => e.id !== selectedVessel?.id).map((entry, idx) => (
                      <Cell
                        key={idx}
                        fill={companyColors[entry.company] || "hsl(216, 10%, 60%)"}
                        opacity={0.35}
                        r={4}
                      />
                    ))}
                  </Scatter>
                  {/* Selected vessel - prominent */}
                  {selectedVessel && (() => {
                    const sel = scatterData.find(e => e.id === selectedVessel.id);
                    if (!sel) return null;
                    return (
                      <>
                        {/* Outer glow ring */}
                        <ReferenceDot x={sel.efficiency} y={sel.fuelUsed} r={18} fill="hsl(210, 80%, 52%)" fillOpacity={0.15} stroke="hsl(210, 80%, 52%)" strokeWidth={1} strokeOpacity={0.3} />
                        <Scatter data={[sel]} name="Selected">
                          <Cell
                            fill="hsl(210, 80%, 52%)"
                            opacity={1}
                            stroke="hsl(0, 0%, 100%)"
                            strokeWidth={3}
                            r={12}
                          />
                        </Scatter>
                      </>
                    );
                  })()}
                  {/* Label for selected vessel */}
                  {selectedVessel && (() => {
                    const sel = scatterData.find(e => e.id === selectedVessel.id);
                    if (!sel) return null;
                    return (
                      <ReferenceDot
                        x={sel.efficiency}
                        y={sel.fuelUsed}
                        r={0}
                        fill="none"
                        stroke="none"
                      >
                        <Label
                          value={`▶ ${sel.name}`}
                          position="right"
                          offset={12}
                          style={{ fontSize: 9, fontWeight: 700, fill: "hsl(215, 50%, 15%)" }}
                        />
                      </ReferenceDot>
                    );
                  })()}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
              );
            })()}

            {/* Company legend + selected vessel indicator */}
            <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-border">
              {Object.entries(companyColors).map(([name, color]) => (
                <div
                  key={name}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] transition-colors",
                    name === selectedVessel?.company && "bg-accent font-medium"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-foreground">{name}</span>
                </div>
              ))}
              {selectedVessel && (
                <div className="flex items-center gap-1 text-[9px] text-primary font-semibold ml-2 pl-2 border-l border-border">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {selectedVessel.name}
                </div>
              )}
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
