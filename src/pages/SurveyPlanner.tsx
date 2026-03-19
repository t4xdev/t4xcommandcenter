import { useState, useMemo, useRef } from "react";
import {
  Ship, Calendar, ChevronLeft, ChevronRight, Filter, Search,
  AlertTriangle, CheckCircle, Clock, Anchor, FileCheck, Eye, X,
} from "lucide-react";
import {
  surveyMonths, surveyVessels, surveyTypeColors, surveyTypeBgClasses,
  type SurveyType, type SurveyVessel,
} from "@/data/surveyPlannerData";

const ALL_SURVEY_TYPES: SurveyType[] = [
  "Annual Survey", "Intermediate Docking Survey", "Docking Survey",
  "Direction Propeller", "CSM/CSH", "FSI",
];

const surveyIcons: Record<SurveyType, typeof Calendar> = {
  "Annual Survey": Calendar,
  "Intermediate Docking Survey": Anchor,
  "Docking Survey": Ship,
  "Direction Propeller": Clock,
  "CSM/CSH": FileCheck,
  "FSI": AlertTriangle,
};

// Group months by fiscal year (Apr-Mar)
function getFiscalYears() {
  const years: { label: string; months: string[] }[] = [];
  let current: string[] = [];
  let startYear = "";
  for (const m of surveyMonths) {
    if (m.startsWith("Apr") && current.length > 0) {
      years.push({ label: `FY ${startYear}`, months: current });
      current = [];
    }
    if (current.length === 0) startYear = `20${m.split("-")[1]}`;
    current.push(m);
  }
  if (current.length > 0) years.push({ label: `FY ${startYear}`, months: current });
  return years;
}

// Get urgency: how many months away is the date
function getUrgency(month: string): "past" | "imminent" | "upcoming" | "future" {
  const idx = surveyMonths.indexOf(month);
  // Current month is roughly Mar-26 based on date 2026-03-19
  const currentIdx = surveyMonths.indexOf("Mar-26");
  if (idx < currentIdx) return "past";
  if (idx <= currentIdx + 2) return "imminent";
  if (idx <= currentIdx + 6) return "upcoming";
  return "future";
}

export default function SurveyPlanner() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<SurveyType>>(new Set(ALL_SURVEY_TYPES));
  const [selectedVessel, setSelectedVessel] = useState<SurveyVessel | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fiscalYears = useMemo(() => getFiscalYears(), []);
  const [activeFY, setActiveFY] = useState(1); // Default to FY 2026

  const filteredVessels = useMemo(() => {
    const q = search.toLowerCase();
    return surveyVessels.filter(
      (v) => v.name.toLowerCase().includes(q) || v.imo.includes(q)
    );
  }, [search]);

  const activeMonths = fiscalYears[activeFY]?.months ?? surveyMonths.slice(0, 12);

  // Stats
  const stats = useMemo(() => {
    let total = 0, imminent = 0, upcoming = 0, completed = 0;
    for (const v of surveyVessels) {
      for (const s of v.surveys) {
        for (const d of s.dates) {
          total++;
          const u = getUrgency(d.month);
          if (u === "past") completed++;
          else if (u === "imminent") imminent++;
          else if (u === "upcoming") upcoming++;
        }
      }
    }
    return { total, imminent, upcoming, completed, vessels: surveyVessels.length };
  }, []);

  const toggleType = (t: SurveyType) => {
    const next = new Set(selectedTypes);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    setSelectedTypes(next);
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Vessels", value: stats.vessels, icon: Ship, cls: "bg-info/10 text-info" },
          { label: "Total Surveys", value: stats.total, icon: Calendar, cls: "bg-primary/10 text-primary" },
          { label: "Due in 3 Months", value: stats.imminent, icon: AlertTriangle, cls: "bg-destructive/10 text-destructive" },
          { label: "Due in 6 Months", value: stats.upcoming, icon: Clock, cls: "bg-warning/10 text-warning" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, cls: "bg-success/10 text-success" },
        ].map((k) => (
          <div key={k.label} className="card-elevated p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.cls}`}>
                <k.icon className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-medium text-muted-foreground">{k.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vessels..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* FY Switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {fiscalYears.map((fy, i) => (
            <button
              key={fy.label}
              onClick={() => setActiveFY(i)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeFY === i ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {fy.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button onClick={() => setViewMode("timeline")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === "timeline" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            Timeline
          </button>
          <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            List
          </button>
        </div>
      </div>

      {/* Survey Type Filters */}
      <div className="flex flex-wrap gap-2">
        {ALL_SURVEY_TYPES.map((t) => {
          const Icon = surveyIcons[t];
          const active = selectedTypes.has(t);
          return (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                active ? surveyTypeBgClasses[t] : "bg-muted/50 text-muted-foreground border-transparent opacity-50"
              }`}
            >
              <Icon className="w-3 h-3" />
              {t}
            </button>
          );
        })}
      </div>

      {/* Timeline View */}
      {viewMode === "timeline" ? (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto" ref={scrollRef}>
            <table className="w-full border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-[200px] min-w-[200px]">
                    Vessel
                  </th>
                  <th className="sticky left-[200px] z-10 bg-card px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-[160px] min-w-[160px]">
                    Survey Type
                  </th>
                  {activeMonths.map((m) => {
                    const isCurrent = m === "Mar-26";
                    return (
                      <th
                        key={m}
                        className={`px-1 py-3 text-center text-[10px] font-medium min-w-[70px] ${
                          isCurrent ? "bg-primary/5 text-primary font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {m}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredVessels.map((vessel, vi) => {
                  const visibleSurveys = vessel.surveys.filter((s) => selectedTypes.has(s.type));
                  if (visibleSurveys.length === 0) return null;
                  return visibleSurveys.map((survey, si) => (
                    <tr
                      key={`${vessel.name}-${survey.type}`}
                      className={`border-b border-border/50 hover:bg-accent/30 transition-colors ${
                        si === 0 && vi > 0 ? "border-t-2 border-t-border" : ""
                      }`}
                    >
                      {si === 0 && (
                        <td
                          className="sticky left-0 z-10 bg-card px-4 py-2 align-top"
                          rowSpan={visibleSurveys.length}
                        >
                          <button
                            onClick={() => setSelectedVessel(vessel)}
                            className="text-left group"
                          >
                            <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                              {vessel.name}
                            </p>
                            {vessel.imo && (
                              <p className="text-[10px] text-muted-foreground">
                                IMO {vessel.imo}
                              </p>
                            )}
                          </button>
                        </td>
                      )}
                      <td className="sticky left-[200px] z-10 bg-card px-3 py-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${surveyTypeBgClasses[survey.type]}`}>
                          {survey.type}
                        </span>
                      </td>
                      {activeMonths.map((m) => {
                        const hasDate = survey.dates.find((d) => d.month === m);
                        const isCurrent = m === "Mar-26";
                        if (!hasDate) {
                          return (
                            <td
                              key={m}
                              className={`px-1 py-2 text-center ${isCurrent ? "bg-primary/5" : ""}`}
                            />
                          );
                        }
                        const urgency = getUrgency(m);
                        const dotCls =
                          urgency === "past"
                            ? "bg-muted-foreground/40"
                            : urgency === "imminent"
                            ? "bg-destructive animate-pulse"
                            : urgency === "upcoming"
                            ? "bg-warning"
                            : "bg-info";
                        return (
                          <td
                            key={m}
                            className={`px-1 py-2 text-center ${isCurrent ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <span
                                className={`w-3 h-3 rounded-full ${dotCls} cursor-pointer hover:scale-125 transition-transform`}
                                title={`${survey.type}: ${hasDate.date}`}
                              />
                              <span className="text-[9px] text-muted-foreground font-mono leading-none">
                                {hasDate.date.split("-")[0]}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-border flex flex-wrap items-center gap-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status:</span>
            {[
              { label: "Completed", cls: "bg-muted-foreground/40" },
              { label: "Due Soon (≤3mo)", cls: "bg-destructive" },
              { label: "Upcoming (≤6mo)", cls: "bg-warning" },
              { label: "Planned", cls: "bg-info" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${l.cls}`} />
                <span className="text-[10px] text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredVessels.map((vessel) => {
            const visibleSurveys = vessel.surveys.filter((s) => selectedTypes.has(s.type));
            if (visibleSurveys.length === 0) return null;
            // Find next upcoming survey
            const allDates = visibleSurveys.flatMap((s) =>
              s.dates.filter((d) => getUrgency(d.month) !== "past").map((d) => ({ ...d, type: s.type }))
            );
            allDates.sort((a, b) => surveyMonths.indexOf(a.month) - surveyMonths.indexOf(b.month));

            return (
              <div key={vessel.name} className="card-elevated p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{vessel.name}</h3>
                    {vessel.imo && <p className="text-[10px] text-muted-foreground">IMO {vessel.imo}</p>}
                  </div>
                  <button
                    onClick={() => setSelectedVessel(vessel)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View All
                  </button>
                </div>

                {allDates.length > 0 && (
                  <div className="mb-3 p-2.5 rounded-lg bg-accent/30 border border-border">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Next Upcoming</p>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${surveyTypeBgClasses[allDates[0].type as SurveyType]}`}>
                        {allDates[0].type}
                      </span>
                      <span className="text-xs font-mono font-semibold text-foreground">{allDates[0].date}</span>
                      <span className="text-[10px] text-muted-foreground">({allDates[0].month})</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {visibleSurveys.map((s) => {
                    const count = s.dates.length;
                    return (
                      <span
                        key={s.type}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${surveyTypeBgClasses[s.type]}`}
                      >
                        {s.type}
                        <span className="bg-background/50 rounded-full px-1 text-[9px] font-bold">{count}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vessel Detail Modal */}
      {selectedVessel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setSelectedVessel(null)}>
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-[700px] max-w-[95vw] max-h-[85vh] flex flex-col animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-sm font-bold text-foreground">{selectedVessel.name}</h2>
                {selectedVessel.imo && <p className="text-[11px] text-muted-foreground">IMO {selectedVessel.imo}</p>}
              </div>
              <button onClick={() => setSelectedVessel(null)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {selectedVessel.surveys.map((s) => (
                <div key={s.type} className="p-4 rounded-xl border border-border bg-accent/20">
                  <div className="flex items-center gap-2 mb-3">
                    {(() => { const Icon = surveyIcons[s.type]; return <Icon className="w-4 h-4 text-muted-foreground" />; })()}
                    <h3 className="text-xs font-semibold text-foreground">{s.type}</h3>
                    <span className="text-[10px] text-muted-foreground font-mono">({s.dates.length} scheduled)</span>
                  </div>
                  {s.dates.length === 0 ? (
                    <p className="text-[11px] text-muted-foreground italic">No surveys scheduled</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {s.dates.map((d, i) => {
                        const u = getUrgency(d.month);
                        const cls =
                          u === "past"
                            ? "bg-muted text-muted-foreground border-border"
                            : u === "imminent"
                            ? "bg-destructive/10 text-destructive border-destructive/30"
                            : u === "upcoming"
                            ? "bg-warning/10 text-warning border-warning/30"
                            : "bg-info/10 text-info border-info/30";
                        return (
                          <div key={i} className={`px-3 py-1.5 rounded-lg border text-center ${cls}`}>
                            <p className="text-[11px] font-semibold font-mono">{d.date}</p>
                            <p className="text-[9px] opacity-70">{d.month}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
