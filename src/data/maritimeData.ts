// ─── Maritime KPI Dashboard Data ───

export type Severity = "high" | "medium" | "low";

// ─── Fleets & Vessels ───
export interface Vessel {
  id: string;
  name: string;
  fleet: string;
  type: string;
  flag: string;
  imo: string;
  status: "operational" | "dry-dock" | "anchored";
}

export const fleets = ["All Fleets", "Coastal Fleet", "Offshore Fleet", "Bulk Fleet"] as const;
export type FleetName = (typeof fleets)[number];

export const vessels: Vessel[] = [
  { id: "v1", name: "MT Kaveri", fleet: "Coastal Fleet", type: "Bulk Carrier", flag: "India", imo: "9876543", status: "operational" },
  { id: "v2", name: "MV Godavari", fleet: "Coastal Fleet", type: "Container", flag: "India", imo: "9876544", status: "operational" },
  { id: "v3", name: "MV Narmada", fleet: "Offshore Fleet", type: "AHTS", flag: "India", imo: "9876545", status: "dry-dock" },
  { id: "v4", name: "MV Krishna", fleet: "Offshore Fleet", type: "PSV", flag: "India", imo: "9876546", status: "operational" },
  { id: "v5", name: "MV Tapti", fleet: "Bulk Fleet", type: "Bulk Carrier", flag: "India", imo: "9876547", status: "operational" },
  { id: "v6", name: "MT Chambal", fleet: "Bulk Fleet", type: "Tanker", flag: "India", imo: "9876548", status: "anchored" },
  { id: "v7", name: "MV Mahanadi", fleet: "Coastal Fleet", type: "Bulk Carrier", flag: "India", imo: "9876549", status: "operational" },
  { id: "v8", name: "MV Sabarmati", fleet: "Bulk Fleet", type: "Bulk Carrier", flag: "India", imo: "9876550", status: "operational" },
];

export function getVesselsByFleet(fleet: FleetName): Vessel[] {
  if (fleet === "All Fleets") return vessels;
  return vessels.filter((v) => v.fleet === fleet);
}

// ─── Domain: QHSE & Incidents ───
export interface QhseKpi {
  id: string;
  label: string;
  value: string;
  unit: string;
  trend: number;
  severity: Severity;
  target?: string;
}

export const qhseKpis: QhseKpi[] = [
  { id: "ltif", label: "LTIF (Lost Time Injury Freq)", value: "0.42", unit: "per million hrs", trend: -12, severity: "low", target: "< 0.5" },
  { id: "trir", label: "TRIR (Total Recordable Rate)", value: "1.8", unit: "per million hrs", trend: 5, severity: "medium", target: "< 1.5" },
  { id: "near-miss", label: "Near Miss Reports", value: "34", unit: "this month", trend: 18, severity: "low" },
  { id: "safety-drills", label: "Safety Drills Completed", value: "96%", unit: "compliance", trend: 2, severity: "low", target: "100%" },
  { id: "env-incidents", label: "Environmental Incidents", value: "0", unit: "this quarter", trend: 0, severity: "low", target: "0" },
  { id: "psc-deficiency", label: "PSC Deficiency Rate", value: "1.2", unit: "per inspection", trend: -8, severity: "low", target: "< 2.0" },
];

export interface IncidentRecord {
  id: string;
  vessel: string;
  type: string;
  severity: Severity;
  date: string;
  description: string;
  status: "open" | "investigating" | "closed";
}

export const incidents: IncidentRecord[] = [
  { id: "inc1", vessel: "MT Kaveri", type: "Near Miss", severity: "low", date: "2026-02-12", description: "Unsecured deck cargo during heavy weather", status: "closed" },
  { id: "inc2", vessel: "MV Godavari", type: "First Aid", severity: "medium", date: "2026-02-11", description: "Minor hand injury during mooring operations", status: "closed" },
  { id: "inc3", vessel: "MV Tapti", type: "Near Miss", severity: "low", date: "2026-02-10", description: "Crane limit switch malfunction during cargo ops", status: "investigating" },
  { id: "inc4", vessel: "MV Sabarmati", type: "Environmental", severity: "medium", date: "2026-02-08", description: "Minor oil sheen observed during bunkering", status: "investigating" },
  { id: "inc5", vessel: "MV Mahanadi", type: "Near Miss", severity: "low", date: "2026-02-07", description: "Gangway clearance issue during berthing", status: "closed" },
];

// ─── Domain: Maintenance / PMS ───
export interface MaintenanceKpi {
  id: string;
  label: string;
  value: string;
  unit: string;
  trend: number;
  severity: Severity;
}

export const maintenanceKpis: MaintenanceKpi[] = [
  { id: "pms-completion", label: "PMS Task Completion", value: "87%", unit: "on schedule", trend: -3, severity: "medium" },
  { id: "overdue", label: "Overdue Jobs", value: "23", unit: "tasks", trend: 15, severity: "high" },
  { id: "running-hrs", label: "Running Hours Reported", value: "98%", unit: "accuracy", trend: 1, severity: "low" },
  { id: "spare-stock", label: "Critical Spare Availability", value: "91%", unit: "in stock", trend: -5, severity: "medium" },
  { id: "dry-dock", label: "Dry Dock Status", value: "1", unit: "vessel in dock", trend: 0, severity: "low" },
  { id: "defect-closure", label: "Defect Closure Rate", value: "78%", unit: "within SLA", trend: -8, severity: "medium" },
];

export interface MaintenanceTask {
  id: string;
  vessel: string;
  equipment: string;
  task: string;
  dueDate: string;
  status: "completed" | "overdue" | "upcoming";
  priority: Severity;
}

export const maintenanceTasks: MaintenanceTask[] = [
  { id: "mt1", vessel: "MT Kaveri", equipment: "Main Engine", task: "Cylinder liner inspection", dueDate: "2026-02-15", status: "upcoming", priority: "high" },
  { id: "mt2", vessel: "MV Godavari", equipment: "Aux Boiler", task: "Safety valve overhaul", dueDate: "2026-02-08", status: "overdue", priority: "high" },
  { id: "mt3", vessel: "MV Tapti", equipment: "Purifier", task: "Seal ring replacement", dueDate: "2026-02-20", status: "upcoming", priority: "medium" },
  { id: "mt4", vessel: "MV Krishna", equipment: "Crane #1", task: "Wire rope inspection", dueDate: "2026-02-05", status: "overdue", priority: "medium" },
  { id: "mt5", vessel: "MV Sabarmati", equipment: "Lifeboat", task: "Annual davit load test", dueDate: "2026-02-18", status: "upcoming", priority: "high" },
  { id: "mt6", vessel: "MV Mahanadi", equipment: "Nav Equipment", task: "ECDIS software update", dueDate: "2026-02-25", status: "upcoming", priority: "low" },
];

// ─── Domain: Documents & Compliance ───
export interface DocKpi {
  id: string;
  label: string;
  value: string;
  unit: string;
  trend: number;
  severity: Severity;
}

export const docKpis: DocKpi[] = [
  { id: "cert-renewal", label: "Certificates Renewed On Time", value: "94%", unit: "compliance", trend: 2, severity: "low" },
  { id: "cert-expiring", label: "Certificates Expiring (30 days)", value: "7", unit: "across fleet", trend: 40, severity: "high" },
  { id: "mandatory-read", label: "Mandatory Read Acknowledgement", value: "82%", unit: "crew rate", trend: -6, severity: "medium" },
  { id: "sop-adherence", label: "SOP Adherence", value: "91%", unit: "compliance", trend: 1, severity: "low" },
  { id: "circular-ack", label: "Circular Acknowledgement", value: "76%", unit: "response rate", trend: -10, severity: "medium" },
  { id: "statutory", label: "Statutory Compliance", value: "98%", unit: "audit pass rate", trend: 0.5, severity: "low" },
];

export interface CertificateAlert {
  id: string;
  vessel: string;
  certificate: string;
  expiryDate: string;
  daysRemaining: number;
  severity: Severity;
  acknowledged: boolean;
}

export const certificateAlerts: CertificateAlert[] = [
  { id: "ca1", vessel: "MT Kaveri", certificate: "Safety Management Certificate", expiryDate: "2026-02-25", daysRemaining: 12, severity: "high", acknowledged: false },
  { id: "ca2", vessel: "MV Godavari", certificate: "IOPP Certificate", expiryDate: "2026-02-28", daysRemaining: 15, severity: "medium", acknowledged: true },
  { id: "ca3", vessel: "MV Tapti", certificate: "Class Certificate", expiryDate: "2026-03-05", daysRemaining: 20, severity: "medium", acknowledged: false },
  { id: "ca4", vessel: "MV Sabarmati", certificate: "DOC (Company)", expiryDate: "2026-02-20", daysRemaining: 7, severity: "high", acknowledged: false },
  { id: "ca5", vessel: "MV Mahanadi", certificate: "Load Line Certificate", expiryDate: "2026-03-10", daysRemaining: 25, severity: "low", acknowledged: true },
  { id: "ca6", vessel: "MV Krishna", certificate: "ISPS Certificate", expiryDate: "2026-02-22", daysRemaining: 9, severity: "high", acknowledged: false },
  { id: "ca7", vessel: "MT Chambal", certificate: "CLC Certificate", expiryDate: "2026-03-15", daysRemaining: 30, severity: "low", acknowledged: true },
];

// ─── Domain: Operations / Procurement ───
export interface OpsKpi {
  id: string;
  label: string;
  value: string;
  unit: string;
  trend: number;
  severity: Severity;
}

export const opsKpis: OpsKpi[] = [
  { id: "daily-report", label: "Daily Report Submission", value: "96%", unit: "on time", trend: 2, severity: "low" },
  { id: "rest-hours", label: "Rest Hours Compliance", value: "99%", unit: "crew compliant", trend: 0, severity: "low" },
  { id: "requisition-time", label: "Requisition Cycle Time", value: "4.2", unit: "days avg", trend: -8, severity: "low" },
  { id: "po-accuracy", label: "PO Accuracy", value: "94%", unit: "error-free", trend: 3, severity: "low" },
  { id: "vendor-vetting", label: "Vendor Vetting Compliance", value: "88%", unit: "approved vendors", trend: -2, severity: "medium" },
  { id: "invoice-time", label: "Invoice Processing Time", value: "3.1", unit: "days avg", trend: 12, severity: "medium" },
];

// ─── Fleet Summary Stats ───
export interface FleetSummaryItem {
  label: string;
  value: string;
  sub: string;
  severity: Severity;
}

export function getFleetSummary(): FleetSummaryItem[] {
  return [
    { label: "Total Vessels", value: String(vessels.length), sub: `${vessels.filter((v) => v.status === "operational").length} operational`, severity: "low" },
    { label: "Open Incidents", value: String(incidents.filter((i) => i.status !== "closed").length), sub: "this month", severity: incidents.some((i) => i.status === "investigating" && i.severity === "high") ? "high" : "medium" },
    { label: "Overdue PMS Tasks", value: String(maintenanceTasks.filter((t) => t.status === "overdue").length), sub: "across fleet", severity: "high" },
    { label: "Certificates At Risk", value: String(certificateAlerts.filter((c) => c.daysRemaining <= 15).length), sub: "expiring ≤15 days", severity: "high" },
    { label: "LTIF", value: "0.42", sub: "per million man-hours", severity: "low" },
    { label: "Crew Rest Compliance", value: "99%", sub: "all vessels", severity: "low" },
  ];
}

// ─── Chart Data ───
export const incidentTrendData = [
  { month: "Sep", nearMiss: 12, firstAid: 3, medical: 1 },
  { month: "Oct", nearMiss: 15, firstAid: 2, medical: 0 },
  { month: "Nov", nearMiss: 18, firstAid: 4, medical: 1 },
  { month: "Dec", nearMiss: 22, firstAid: 1, medical: 0 },
  { month: "Jan", nearMiss: 28, firstAid: 3, medical: 0 },
  { month: "Feb", nearMiss: 34, firstAid: 2, medical: 0 },
];

export const pmsComplianceData = [
  { vessel: "Kaveri", completion: 92 },
  { vessel: "Godavari", completion: 84 },
  { vessel: "Narmada", completion: 0 },
  { vessel: "Krishna", completion: 89 },
  { vessel: "Tapti", completion: 95 },
  { vessel: "Chambal", completion: 78 },
  { vessel: "Mahanadi", completion: 91 },
  { vessel: "Sabarmati", completion: 88 },
];

export const certStatusData = [
  { name: "Valid", value: 78, fill: "hsl(152, 55%, 42%)" },
  { name: "Expiring Soon", value: 15, fill: "hsl(38, 92%, 50%)" },
  { name: "Expired/Critical", value: 7, fill: "hsl(0, 72%, 55%)" },
];

export const drillComplianceData = [
  { month: "Sep", fire: 100, abandon: 95, man_overboard: 90 },
  { month: "Oct", fire: 100, abandon: 100, man_overboard: 95 },
  { month: "Nov", fire: 95, abandon: 100, man_overboard: 100 },
  { month: "Dec", fire: 100, abandon: 95, man_overboard: 100 },
  { month: "Jan", fire: 100, abandon: 100, man_overboard: 95 },
  { month: "Feb", fire: 96, abandon: 98, man_overboard: 92 },
];

// ─── AI Chat Data ───
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface PredefinedQuestion {
  id: string;
  question: string;
  category: "safety" | "maintenance" | "documents" | "operations";
}

export const predefinedQuestions: PredefinedQuestion[] = [
  { id: "q1", question: "What is the fleet-wide LTIF trend?", category: "safety" },
  { id: "q2", question: "Any open incidents requiring attention?", category: "safety" },
  { id: "q3", question: "Which vessels have overdue PMS jobs?", category: "maintenance" },
  { id: "q4", question: "Critical spare parts stock status?", category: "maintenance" },
  { id: "q5", question: "Which certificates are expiring soon?", category: "documents" },
  { id: "q6", question: "Crew mandatory read acknowledgement status?", category: "documents" },
  { id: "q7", question: "Daily report submission compliance?", category: "operations" },
  { id: "q8", question: "Top 3 risks across the fleet?", category: "operations" },
];

export const aiResponses: Record<string, string> = {
  "q1": "**Fleet LTIF Trend (6-Month)**\n\nCurrent LTIF: **0.42** per million man-hours (Target: < 0.5)\n\n| Month | LTIF | Man-Hours |\n|-------|------|----------|\n| Sep | 0.58 | 245,000 |\n| Oct | 0.52 | 251,000 |\n| Nov | 0.48 | 248,000 |\n| Dec | 0.45 | 260,000 |\n| Jan | 0.44 | 255,000 |\n| Feb (MTD) | 0.42 | 189,000 |\n\n📈 Consistent downward trend. LTIF has improved 27.6% over 6 months.\n\n**Key Drivers:**\n1. Enhanced toolbox talks across fleet\n2. Near-miss reporting culture improvement (+183%)\n3. Safety observation card program on MT Kaveri",
  "q2": "**Open Incidents Requiring Attention**\n\n⚠️ **2 incidents under investigation:**\n\n1. **MV Tapti** — Crane limit switch malfunction (Feb 10)\n   - Type: Near Miss\n   - Status: Root cause analysis pending\n   - Action: Crane operations suspended until inspection\n\n2. **MV Sabarmati** — Minor oil sheen during bunkering (Feb 8)\n   - Type: Environmental\n   - Status: Investigation ongoing\n   - Action: SOPEP drill conducted, samples collected\n\n**Recommendation:** Prioritize MV Sabarmati investigation due to environmental regulatory risk.",
  "q3": "**Vessels with Overdue PMS Jobs**\n\n🔴 **2 vessels with critical overdue tasks:**\n\n| Vessel | Equipment | Task | Overdue By |\n|--------|-----------|------|-----------|\n| MV Godavari | Aux Boiler | Safety valve overhaul | 5 days |\n| MV Krishna | Crane #1 | Wire rope inspection | 8 days |\n\n⚠️ **MV Godavari**: Safety valve overhaul is critical — potential Class condition. Recommend immediate scheduling.\n\n⚠️ **MV Krishna**: Wire rope inspection overdue — crane ops should be restricted until completion.\n\n**Fleet PMS Completion Rate:** 87% (target: 95%)",
  "q4": "**Critical Spare Parts Status**\n\nOverall availability: **91%** (target: 95%)\n\n🔴 **Critical items below minimum stock:**\n\n| Item | Vessel | Current | Min | Lead Time |\n|------|--------|---------|-----|----------|\n| Cylinder liner O-rings | MT Kaveri | 2 | 6 | 21 days |\n| Purifier seal kit | MV Tapti | 1 | 3 | 14 days |\n| Aux engine fuel pump | MV Sabarmati | 0 | 2 | 28 days |\n\n**Action Required:** Emergency requisition recommended for MV Sabarmati fuel pump. Lead time exceeds next scheduled port call.\n\n📦 Total inventory items tracked: 2,847 across 8 vessels",
  "q5": "**Certificates Expiring Within 30 Days**\n\n🔴 **7 certificates across the fleet:**\n\n| Vessel | Certificate | Expiry | Days Left | Ack'd |\n|--------|------------|--------|-----------|-------|\n| MV Sabarmati | DOC (Company) | Feb 20 | 7 | ❌ |\n| MV Krishna | ISPS Certificate | Feb 22 | 9 | ❌ |\n| MT Kaveri | Safety Mgmt Cert | Feb 25 | 12 | ❌ |\n| MV Godavari | IOPP Certificate | Feb 28 | 15 | ✅ |\n| MV Tapti | Class Certificate | Mar 5 | 20 | ❌ |\n| MV Mahanadi | Load Line Cert | Mar 10 | 25 | ✅ |\n| MT Chambal | CLC Certificate | Mar 15 | 30 | ✅ |\n\n⚠️ **3 HIGH priority** (≤12 days) — unacknowledged. Immediate vessel manager notification required.",
  "q6": "**Crew Mandatory Read Status**\n\nFleet-wide acknowledgement rate: **82%** (target: 95%)\n\n| Vessel | Pending Reads | Crew Onboard | Rate |\n|--------|--------------|-------------|------|\n| MT Chambal | 8 | 22 | 64% |\n| MV Krishna | 5 | 18 | 72% |\n| MV Sabarmati | 4 | 24 | 83% |\n| MV Tapti | 3 | 20 | 85% |\n| Others | 0-2 each | — | >90% |\n\n📋 Most pending: Safety Circular SC-2026-08 (Bunkering Procedures)\n\n**Action:** Send reminder alerts to MT Chambal and MV Krishna.",
  "q7": "**Daily Report Submission Compliance**\n\nFleet-wide: **96%** on-time submission (target: 100%)\n\nLast 7 days:\n| Vessel | On Time | Late | Missed |\n|--------|---------|------|--------|\n| MT Kaveri | 7/7 | 0 | 0 |\n| MV Godavari | 7/7 | 0 | 0 |\n| MV Narmada | N/A (dry dock) | — | — |\n| MV Krishna | 6/7 | 1 | 0 |\n| MV Tapti | 7/7 | 0 | 0 |\n| MT Chambal | 5/7 | 1 | 1 |\n| MV Mahanadi | 7/7 | 0 | 0 |\n| MV Sabarmati | 7/7 | 0 | 0 |\n\n⚠️ MT Chambal has 1 missed report (Feb 9) — connectivity issue reported.",
  "q8": "**Top 3 Fleet Risks — Next 30 Days**\n\n🔴 **1. Certificate Lapse Risk (HIGH)**\n3 certificates expiring within 12 days without acknowledgement. DOC expiry for MV Sabarmati (7 days) could result in vessel detention.\n\n🟡 **2. Overdue Maintenance (MEDIUM-HIGH)**\nAux boiler safety valve on MV Godavari overdue 5 days. Potential Class condition if not addressed. Crane restriction on MV Krishna impacting cargo operations.\n\n🟡 **3. Spare Parts Stockout (MEDIUM)**\nMV Sabarmati has zero stock on aux engine fuel pump with 28-day lead time. Next port call in 18 days — emergency procurement required.\n\n**Executive Summary:** Immediate action needed on certificate renewals and MV Godavari boiler. Recommend emergency procurement for critical spares.",
};
