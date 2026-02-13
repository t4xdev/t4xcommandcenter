export interface KPI {
  id: number;
  module: string;
  feature: string;
  kpis: string[];
  value: number;       // mock percentage
  trend: number;       // mock trend change
  status: "good" | "warning" | "critical";
}

export const modules = ["Documents", "Reports", "Procurement", "Maintenance"] as const;
export type ModuleName = typeof modules[number];

export const moduleColors: Record<ModuleName, string> = {
  Documents: "hsl(174, 62%, 47%)",
  Reports: "hsl(210, 80%, 55%)",
  Procurement: "hsl(38, 92%, 55%)",
  Maintenance: "hsl(152, 60%, 45%)",
};

export const moduleIcons: Record<ModuleName, string> = {
  Documents: "FileText",
  Reports: "BarChart3",
  Procurement: "ShoppingCart",
  Maintenance: "Wrench",
};

function mockValue() {
  return Math.round(60 + Math.random() * 38);
}
function mockTrend() {
  return +((-5 + Math.random() * 12).toFixed(1));
}
function status(v: number): KPI["status"] {
  if (v >= 85) return "good";
  if (v >= 70) return "warning";
  return "critical";
}

const rawData: [string, number, string, string][] = [
  ["Documents", 1, "Company Documents", "Document retrieval time; Compliance rate; User adoption"],
  ["Documents", 2, "Vessel Certificates", "% certificates renewed on time; Alert response time"],
  ["Documents", 3, "Circulars / Tips", "Read / acknowledge rate; Time to dissemination"],
  ["Documents", 4, "Manuals (Vessel / Technical)", "Access frequency; Update cycle time"],
  ["Documents", 5, "Legacy Data Storage", "Data retrieval speed; Data integrity"],
  ["Documents", 6, "Health & Safety", "Incident rate; Register update frequency"],
  ["Documents", 7, "Technical Manuals", "Access frequency; Update cycle time"],
  ["Documents", 8, "Financial", "Report accuracy; Processing time"],
  ["Documents", 9, "Dry Dock", "Downtime duration; Cost variance"],
  ["Documents", 10, "Defect", "Defect closure rate; Reporting lag"],
  ["Documents", 11, "Nav Comm", "Communication uptime; Issue resolution time"],
  ["Documents", 12, "Statutory Compliance", "Audit pass rate; Non-compliance incidents"],
  ["Documents", 13, "Survey Documents", "Survey completion rate; Document accuracy"],
  ["Documents", 14, "SOPs", "SOP adherence; Update frequency"],
  ["Documents", 15, "Mandatory Read / Acknowledge", "Acknowledgement rate; Time to acknowledge"],
  ["Reports", 16, "Vessel Daily Report", "Submission timeliness; Data completeness"],
  ["Reports", 17, "Offline Reporting", "% reports submitted offline; Sync success rate"],
  ["Reports", 18, "Rest Hours (Crew)", "Compliance with rest regulations; Reporting accuracy"],
  ["Reports", 19, "Drills", "Drill completion rate; Compliance"],
  ["Reports", 20, "Checklist Forms", "Completion rate; Error rate"],
  ["Reports", 21, "Dashboard", "User engagement; Decision speed"],
  ["Procurement", 22, "Create Requisition", "Requisition cycle time; Error rate"],
  ["Procurement", 23, "Vetting", "Vendor approval time; Compliance"],
  ["Procurement", 24, "Create RFQ", "RFQ turnaround time; Vendor response rate"],
  ["Procurement", 25, "Update RFQ", "RFQ turnaround time; Vendor response rate"],
  ["Procurement", 26, "Approve Quotation (Tech)", "Approval cycle time; Error rate"],
  ["Procurement", 27, "Approve Quotation (Fin)", "Approval cycle time; Error rate"],
  ["Procurement", 28, "Create PR", "PR / PO cycle time; Accuracy"],
  ["Procurement", 29, "Create PO", "PO cycle time; Accuracy"],
  ["Procurement", 30, "Procurement Admin", "Admin task completion; Error rate"],
  ["Procurement", 31, "Invoice Integration", "Invoice processing time; Error rate"],
  ["Procurement", 32, "Equipment / Materials Master", "Data accuracy; Update frequency"],
  ["Procurement", 33, "Material Master", "Data accuracy; Update frequency"],
  ["Maintenance", 34, "PMS Assignment", "Task completion rate; Overdue tasks"],
  ["Maintenance", 35, "PMS Updates", "Task completion rate; Overdue tasks"],
  ["Maintenance", 36, "Update Running Hours", "Reporting accuracy; Timeliness"],
  ["Maintenance", 37, "Inventory (Spare Parts)", "Stockout rate; Inventory accuracy"],
  ["Maintenance", 38, "Manufacturer Dropdowns", "Data consistency; Selection errors"],
];

export const kpiData: KPI[] = rawData.map(([module, id, feature, kpiStr]) => {
  const v = mockValue();
  return {
    id,
    module,
    feature,
    kpis: kpiStr.split("; "),
    value: v,
    trend: mockTrend(),
    status: status(v),
  };
});

export function getModuleKPIs(module: ModuleName): KPI[] {
  return kpiData.filter((k) => k.module === module);
}

export function getModuleSummary(module: ModuleName) {
  const items = getModuleKPIs(module);
  const avg = Math.round(items.reduce((s, k) => s + k.value, 0) / items.length);
  const good = items.filter((k) => k.status === "good").length;
  const warning = items.filter((k) => k.status === "warning").length;
  const critical = items.filter((k) => k.status === "critical").length;
  return { total: items.length, avg, good, warning, critical };
}

// Mock time series for charts
export function getMonthlyData(module: ModuleName) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => ({
    month,
    performance: Math.round(65 + Math.random() * 30),
    compliance: Math.round(70 + Math.random() * 28),
    efficiency: Math.round(60 + Math.random() * 35),
  }));
}
