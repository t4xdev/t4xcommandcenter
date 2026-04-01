// ─── Types ───
export type FuelType = "HFO" | "VLSFO" | "MGO" | "MDO" | "LNG";
export type ReportType = "underway" | "in_port" | "standby" | "dp" | "cargo_ops" | "manoeuvring";
export type AlertSeverity = "critical" | "warning" | "info";
export type VesselClass = "Tanker" | "Bulk Carrier" | "Container" | "Offshore Support" | "AHTS";

export interface EmissionFactor {
  fuelType: FuelType;
  co2Factor: number; // tCO2 per tonne fuel
  ch4Factor: number;
  n2oFactor: number;
  soxFactor: number;
  noxFactor: number;
}

export interface VesselProfile {
  id: string;
  name: string;
  imo: string;
  vesselClass: VesselClass;
  flag: string;
  dwt: number;
  built: number;
  manager: string;
  status: "active" | "dry_dock" | "laid_up";
}

export interface FuelEntry {
  fuelType: FuelType;
  openingROB: number;
  received: number;
  transferred: number;
  closingROB: number;
  consumed: number; // calculated
  meConsumption: number;
  aeConsumption: number;
  boilerConsumption: number;
}

export interface VoyageReport {
  id: string;
  vesselId: string;
  vesselName: string;
  date: string;
  periodStart: string;
  periodEnd: string;
  voyageNo: string;
  reportType: ReportType;
  master: string;
  chiefEngineer: string;
  departurePort: string;
  arrivalPort: string;
  distanceNM: number;
  voyageDuration: number;
  hoursUnderway: number;
  hoursInPort: number;
  hoursAnchorage: number;
  hoursStandby: number;
  hoursDp: number;
  hoursCargoOps: number;
  hoursIdle: number;
  avgSpeed: number;
  weatherRemarks: string;
  fuelEntries: FuelEntry[];
  meRunningHours: number;
  aeRunningHours: number;
  boilerRunningHours: number;
  cargoTonnage: number;
  pob: number;
  remarks: string;
  status: "submitted" | "reviewed" | "approved" | "rejected";
  submittedBy: string;
  submittedAt: string;
}

export interface EmissionResult {
  totalCO2: number;
  totalCH4: number;
  totalN2O: number;
  totalSOx: number;
  totalNOx: number;
  co2PerNM: number;
  co2PerHour: number;
  fuelPerNM: number;
  fuelPerHour: number;
  totalFuel: number;
}

export interface EmissionAlert {
  id: string;
  vesselName: string;
  type: string;
  message: string;
  severity: AlertSeverity;
  date: string;
  acknowledged: boolean;
}

export interface MonthlyFleetSummary {
  month: string;
  totalFuel: number;
  totalCO2: number;
  avgCO2PerNM: number;
  vesselCount: number;
}

// ─── Emission Factors (configurable) ───
export const emissionFactors: EmissionFactor[] = [
  { fuelType: "HFO", co2Factor: 3.114, ch4Factor: 0.00006, n2oFactor: 0.00016, soxFactor: 0.050, noxFactor: 0.087 },
  { fuelType: "VLSFO", co2Factor: 3.151, ch4Factor: 0.00006, n2oFactor: 0.00016, soxFactor: 0.010, noxFactor: 0.087 },
  { fuelType: "MGO", co2Factor: 3.206, ch4Factor: 0.00006, n2oFactor: 0.00016, soxFactor: 0.004, noxFactor: 0.087 },
  { fuelType: "MDO", co2Factor: 3.206, ch4Factor: 0.00006, n2oFactor: 0.00016, soxFactor: 0.010, noxFactor: 0.087 },
  { fuelType: "LNG", co2Factor: 2.750, ch4Factor: 0.00550, n2oFactor: 0.00011, soxFactor: 0.000, noxFactor: 0.020 },
];

// ─── Calculation helpers ───
export function calculateFuelConsumed(entry: Pick<FuelEntry, "openingROB" | "received" | "transferred" | "closingROB">): number {
  return Math.max(0, entry.openingROB + entry.received - entry.transferred - entry.closingROB);
}

export function calculateEmissions(fuelEntries: FuelEntry[], distanceNM: number, totalHours: number): EmissionResult {
  let totalCO2 = 0, totalCH4 = 0, totalN2O = 0, totalSOx = 0, totalNOx = 0, totalFuel = 0;
  for (const entry of fuelEntries) {
    const ef = emissionFactors.find(f => f.fuelType === entry.fuelType);
    if (!ef) continue;
    totalFuel += entry.consumed;
    totalCO2 += entry.consumed * ef.co2Factor;
    totalCH4 += entry.consumed * ef.ch4Factor;
    totalN2O += entry.consumed * ef.n2oFactor;
    totalSOx += entry.consumed * ef.soxFactor;
    totalNOx += entry.consumed * ef.noxFactor;
  }
  return {
    totalCO2: Math.round(totalCO2 * 100) / 100,
    totalCH4: Math.round(totalCH4 * 100) / 100,
    totalN2O: Math.round(totalN2O * 100) / 100,
    totalSOx: Math.round(totalSOx * 100) / 100,
    totalNOx: Math.round(totalNOx * 100) / 100,
    co2PerNM: distanceNM > 0 ? Math.round((totalCO2 / distanceNM) * 1000) / 1000 : 0,
    co2PerHour: totalHours > 0 ? Math.round((totalCO2 / totalHours) * 100) / 100 : 0,
    fuelPerNM: distanceNM > 0 ? Math.round((totalFuel / distanceNM) * 1000) / 1000 : 0,
    fuelPerHour: totalHours > 0 ? Math.round((totalFuel / totalHours) * 100) / 100 : 0,
    totalFuel: Math.round(totalFuel * 100) / 100,
  };
}

// ─── Vessel Profiles ───
export const vesselProfiles: VesselProfile[] = [
  { id: "v1", name: "MT Kaveri", imo: "9876543", vesselClass: "Tanker", flag: "India", dwt: 47000, built: 2018, manager: "Twenty4x Maritime", status: "active" },
  { id: "v2", name: "MV Godavari", imo: "9876544", vesselClass: "Bulk Carrier", flag: "India", dwt: 63000, built: 2019, manager: "Twenty4x Maritime", status: "active" },
  { id: "v3", name: "MT Narmada", imo: "9876545", vesselClass: "Tanker", flag: "India", dwt: 45000, built: 2017, manager: "Twenty4x Maritime", status: "active" },
  { id: "v4", name: "MV Krishna", imo: "9876546", vesselClass: "Offshore Support", flag: "India", dwt: 5200, built: 2020, manager: "Twenty4x Maritime", status: "active" },
  { id: "v5", name: "MV Tungabhadra", imo: "9876547", vesselClass: "AHTS", flag: "India", dwt: 3800, built: 2016, manager: "Twenty4x Maritime", status: "dry_dock" },
  { id: "v6", name: "MT Cauvery", imo: "9876548", vesselClass: "Tanker", flag: "India", dwt: 52000, built: 2021, manager: "Twenty4x Maritime", status: "active" },
  { id: "v7", name: "MV Mahanadi", imo: "9876549", vesselClass: "Bulk Carrier", flag: "India", dwt: 58000, built: 2018, manager: "Twenty4x Maritime", status: "active" },
  { id: "v8", name: "MV Sabarmati", imo: "9876550", vesselClass: "Container", flag: "India", dwt: 35000, built: 2020, manager: "Twenty4x Maritime", status: "active" },
];

// ─── Mock Voyage Reports ───
function makeFuelEntries(me: number, ae: number, boiler: number, fuelType: FuelType = "VLSFO", openROB: number = 800): FuelEntry[] {
  const consumed = me + ae + boiler;
  return [{
    fuelType,
    openingROB: openROB,
    received: 0,
    transferred: 0,
    closingROB: openROB - consumed,
    consumed,
    meConsumption: me,
    aeConsumption: ae,
    boilerConsumption: boiler,
  }];
}

export const voyageReports: VoyageReport[] = [
  // MT Kaveri - Recent voyages
  {
    id: "vr1", vesselId: "v1", vesselName: "MT Kaveri", date: "2026-03-28", periodStart: "2026-03-25", periodEnd: "2026-03-28",
    voyageNo: "KV-2026-012", reportType: "underway", master: "Capt. Rajan Pillai", chiefEngineer: "C/E Suresh Kumar",
    departurePort: "Mumbai", arrivalPort: "Kochi", distanceNM: 520, voyageDuration: 48, hoursUnderway: 42,
    hoursInPort: 4, hoursAnchorage: 2, hoursStandby: 0, hoursDp: 0, hoursCargoOps: 0, hoursIdle: 0,
    avgSpeed: 12.4, weatherRemarks: "Moderate swell, SW monsoon residual",
    fuelEntries: makeFuelEntries(38, 8, 2), meRunningHours: 42, aeRunningHours: 48, boilerRunningHours: 6,
    cargoTonnage: 35000, pob: 24, remarks: "Normal voyage, no issues", status: "approved",
    submittedBy: "Capt. Rajan Pillai", submittedAt: "2026-03-28T18:00:00Z",
  },
  {
    id: "vr2", vesselId: "v1", vesselName: "MT Kaveri", date: "2026-03-22", periodStart: "2026-03-18", periodEnd: "2026-03-22",
    voyageNo: "KV-2026-011", reportType: "underway", master: "Capt. Rajan Pillai", chiefEngineer: "C/E Suresh Kumar",
    departurePort: "Kandla", arrivalPort: "Mumbai", distanceNM: 430, voyageDuration: 40, hoursUnderway: 36,
    hoursInPort: 3, hoursAnchorage: 1, hoursStandby: 0, hoursDp: 0, hoursCargoOps: 0, hoursIdle: 0,
    avgSpeed: 11.9, weatherRemarks: "Calm seas",
    fuelEntries: makeFuelEntries(32, 7, 1.5, "VLSFO", 750), meRunningHours: 36, aeRunningHours: 40, boilerRunningHours: 4,
    cargoTonnage: 33000, pob: 24, remarks: "", status: "approved",
    submittedBy: "Capt. Rajan Pillai", submittedAt: "2026-03-22T16:00:00Z",
  },
  // MV Godavari
  {
    id: "vr3", vesselId: "v2", vesselName: "MV Godavari", date: "2026-03-30", periodStart: "2026-03-26", periodEnd: "2026-03-30",
    voyageNo: "GD-2026-008", reportType: "underway", master: "Capt. Anand Sharma", chiefEngineer: "C/E Vikram Singh",
    departurePort: "Visakhapatnam", arrivalPort: "Paradip", distanceNM: 340, voyageDuration: 36, hoursUnderway: 30,
    hoursInPort: 4, hoursAnchorage: 2, hoursStandby: 0, hoursDp: 0, hoursCargoOps: 0, hoursIdle: 0,
    avgSpeed: 11.3, weatherRemarks: "NE swell 1.5m, visibility good",
    fuelEntries: makeFuelEntries(28, 6, 1.5, "HFO", 900), meRunningHours: 30, aeRunningHours: 36, boilerRunningHours: 5,
    cargoTonnage: 48000, pob: 22, remarks: "Cargo loading delayed by 2 hours", status: "reviewed",
    submittedBy: "Capt. Anand Sharma", submittedAt: "2026-03-30T20:00:00Z",
  },
  // MT Narmada
  {
    id: "vr4", vesselId: "v3", vesselName: "MT Narmada", date: "2026-03-29", periodStart: "2026-03-27", periodEnd: "2026-03-29",
    voyageNo: "NM-2026-015", reportType: "in_port", master: "Capt. Deepak Nair", chiefEngineer: "C/E Rajiv Menon",
    departurePort: "Chennai", arrivalPort: "Chennai", distanceNM: 0, voyageDuration: 48, hoursUnderway: 0,
    hoursInPort: 40, hoursAnchorage: 8, hoursStandby: 0, hoursDp: 0, hoursCargoOps: 24, hoursIdle: 16,
    avgSpeed: 0, weatherRemarks: "In port, calm conditions",
    fuelEntries: makeFuelEntries(0, 12, 3, "MGO", 200), meRunningHours: 0, aeRunningHours: 48, boilerRunningHours: 10,
    cargoTonnage: 30000, pob: 23, remarks: "Cargo discharge operations", status: "submitted",
    submittedBy: "Capt. Deepak Nair", submittedAt: "2026-03-29T14:00:00Z",
  },
  // MV Krishna - DP Operations
  {
    id: "vr5", vesselId: "v4", vesselName: "MV Krishna", date: "2026-03-31", periodStart: "2026-03-28", periodEnd: "2026-03-31",
    voyageNo: "KR-2026-022", reportType: "dp", master: "Capt. Pradeep Joshi", chiefEngineer: "C/E Mohan Das",
    departurePort: "Mumbai High", arrivalPort: "Mumbai High", distanceNM: 15, voyageDuration: 72, hoursUnderway: 4,
    hoursInPort: 0, hoursAnchorage: 0, hoursStandby: 8, hoursDp: 56, hoursCargoOps: 4, hoursIdle: 0,
    avgSpeed: 3.8, weatherRemarks: "Moderate seas, wind 15-20 kts",
    fuelEntries: makeFuelEntries(42, 18, 2, "MGO", 350), meRunningHours: 60, aeRunningHours: 72, boilerRunningHours: 8,
    cargoTonnage: 0, pob: 35, remarks: "DP operations for platform supply", status: "approved",
    submittedBy: "Capt. Pradeep Joshi", submittedAt: "2026-03-31T22:00:00Z",
  },
  // MT Cauvery
  {
    id: "vr6", vesselId: "v6", vesselName: "MT Cauvery", date: "2026-03-27", periodStart: "2026-03-24", periodEnd: "2026-03-27",
    voyageNo: "CV-2026-009", reportType: "underway", master: "Capt. Sanjay Reddy", chiefEngineer: "C/E Anil Prasad",
    departurePort: "Haldia", arrivalPort: "Colombo", distanceNM: 1100, voyageDuration: 84, hoursUnderway: 78,
    hoursInPort: 0, hoursAnchorage: 6, hoursStandby: 0, hoursDp: 0, hoursCargoOps: 0, hoursIdle: 0,
    avgSpeed: 14.1, weatherRemarks: "Bay of Bengal, moderate seas",
    fuelEntries: makeFuelEntries(72, 14, 3, "VLSFO", 1200), meRunningHours: 78, aeRunningHours: 84, boilerRunningHours: 12,
    cargoTonnage: 42000, pob: 25, remarks: "Long haul voyage, good weather overall", status: "approved",
    submittedBy: "Capt. Sanjay Reddy", submittedAt: "2026-03-27T10:00:00Z",
  },
  // MV Mahanadi
  {
    id: "vr7", vesselId: "v7", vesselName: "MV Mahanadi", date: "2026-03-26", periodStart: "2026-03-23", periodEnd: "2026-03-26",
    voyageNo: "MH-2026-006", reportType: "underway", master: "Capt. Ramesh Iyer", chiefEngineer: "C/E Karthik Raj",
    departurePort: "Mundra", arrivalPort: "Tuticorin", distanceNM: 880, voyageDuration: 72, hoursUnderway: 66,
    hoursInPort: 2, hoursAnchorage: 4, hoursStandby: 0, hoursDp: 0, hoursCargoOps: 0, hoursIdle: 0,
    avgSpeed: 13.3, weatherRemarks: "Clear weather, slight swell",
    fuelEntries: makeFuelEntries(58, 12, 2.5, "HFO", 1000), meRunningHours: 66, aeRunningHours: 72, boilerRunningHours: 8,
    cargoTonnage: 52000, pob: 23, remarks: "", status: "approved",
    submittedBy: "Capt. Ramesh Iyer", submittedAt: "2026-03-26T08:00:00Z",
  },
  // MV Sabarmati
  {
    id: "vr8", vesselId: "v8", vesselName: "MV Sabarmati", date: "2026-03-30", periodStart: "2026-03-27", periodEnd: "2026-03-30",
    voyageNo: "SB-2026-014", reportType: "underway", master: "Capt. Vinod Gupta", chiefEngineer: "C/E Harish Babu",
    departurePort: "JNPT", arrivalPort: "Colombo", distanceNM: 750, voyageDuration: 60, hoursUnderway: 54,
    hoursInPort: 3, hoursAnchorage: 3, hoursStandby: 0, hoursDp: 0, hoursCargoOps: 0, hoursIdle: 0,
    avgSpeed: 13.9, weatherRemarks: "Good weather, calm seas",
    fuelEntries: makeFuelEntries(48, 10, 2, "VLSFO", 950), meRunningHours: 54, aeRunningHours: 60, boilerRunningHours: 6,
    cargoTonnage: 28000, pob: 22, remarks: "Container ops, efficient turnaround", status: "submitted",
    submittedBy: "Capt. Vinod Gupta", submittedAt: "2026-03-30T12:00:00Z",
  },
];

// ─── Fleet Monthly Trend Data ───
export const fleetMonthlyTrend: MonthlyFleetSummary[] = [
  { month: "Oct 2025", totalFuel: 1420, totalCO2: 4480, avgCO2PerNM: 0.185, vesselCount: 8 },
  { month: "Nov 2025", totalFuel: 1380, totalCO2: 4350, avgCO2PerNM: 0.178, vesselCount: 8 },
  { month: "Dec 2025", totalFuel: 1510, totalCO2: 4760, avgCO2PerNM: 0.192, vesselCount: 8 },
  { month: "Jan 2026", totalFuel: 1460, totalCO2: 4600, avgCO2PerNM: 0.182, vesselCount: 8 },
  { month: "Feb 2026", totalFuel: 1340, totalCO2: 4220, avgCO2PerNM: 0.175, vesselCount: 7 },
  { month: "Mar 2026", totalFuel: 1550, totalCO2: 4890, avgCO2PerNM: 0.190, vesselCount: 8 },
];

// ─── Vessel Comparison Data ───
export interface VesselEmissionSummary {
  vesselId: string;
  vesselName: string;
  vesselClass: VesselClass;
  totalFuel: number;
  totalCO2: number;
  co2PerNM: number;
  fuelPerNM: number;
  distanceNM: number;
  voyageCount: number;
  trend: number; // % change from prev month
}

export const vesselEmissionSummaries: VesselEmissionSummary[] = [
  { vesselId: "v1", vesselName: "MT Kaveri", vesselClass: "Tanker", totalFuel: 88.5, totalCO2: 279.0, co2PerNM: 0.294, fuelPerNM: 0.093, distanceNM: 950, voyageCount: 2, trend: -3.2 },
  { vesselId: "v2", vesselName: "MV Godavari", vesselClass: "Bulk Carrier", totalFuel: 35.5, totalCO2: 110.5, co2PerNM: 0.325, fuelPerNM: 0.104, distanceNM: 340, voyageCount: 1, trend: 5.1 },
  { vesselId: "v3", vesselName: "MT Narmada", vesselClass: "Tanker", totalFuel: 15.0, totalCO2: 48.1, co2PerNM: 0, fuelPerNM: 0, distanceNM: 0, voyageCount: 1, trend: -12.5 },
  { vesselId: "v4", vesselName: "MV Krishna", vesselClass: "Offshore Support", totalFuel: 62.0, totalCO2: 198.8, co2PerNM: 13.250, fuelPerNM: 4.133, distanceNM: 15, voyageCount: 1, trend: 8.4 },
  { vesselId: "v6", vesselName: "MT Cauvery", vesselClass: "Tanker", totalFuel: 89.0, totalCO2: 280.4, co2PerNM: 0.255, fuelPerNM: 0.081, distanceNM: 1100, voyageCount: 1, trend: -1.8 },
  { vesselId: "v7", vesselName: "MV Mahanadi", vesselClass: "Bulk Carrier", totalFuel: 72.5, totalCO2: 225.8, co2PerNM: 0.256, fuelPerNM: 0.082, distanceNM: 880, voyageCount: 1, trend: 2.3 },
  { vesselId: "v8", vesselName: "MV Sabarmati", vesselClass: "Container", totalFuel: 60.0, totalCO2: 189.1, co2PerNM: 0.252, fuelPerNM: 0.080, distanceNM: 750, voyageCount: 1, trend: -4.6 },
];

// ─── Alerts ───
export const emissionAlerts: EmissionAlert[] = [
  { id: "ea1", vesselName: "MV Godavari", type: "spike", message: "CO2/NM increased 18% vs previous voyage — check ME performance", severity: "warning", date: "2026-03-30", acknowledged: false },
  { id: "ea2", vesselName: "MV Krishna", type: "dp_high", message: "DP emissions 198.8 tCO2 in 72h — significantly above fleet average for OSV class", severity: "critical", date: "2026-03-31", acknowledged: false },
  { id: "ea3", vesselName: "MV Tungabhadra", type: "missing", message: "No voyage report submitted for 14+ days", severity: "warning", date: "2026-03-28", acknowledged: false },
  { id: "ea4", vesselName: "MT Narmada", type: "idle", message: "Port idle time 16 hours with generators running — consider shore power", severity: "info", date: "2026-03-29", acknowledged: true },
  { id: "ea5", vesselName: "MV Godavari", type: "rob", message: "Closing ROB inconsistency detected — variance of 2.3 MT from expected", severity: "warning", date: "2026-03-30", acknowledged: false },
  { id: "ea6", vesselName: "MT Cauvery", type: "benchmark", message: "CO2/NM 15% better than sister vessel average — record for reference", severity: "info", date: "2026-03-27", acknowledged: true },
];

// ─── Fuel breakdown by type for fleet ───
export const fleetFuelBreakdown = [
  { fuelType: "VLSFO", consumed: 308.5, percentage: 62.1 },
  { fuelType: "HFO", consumed: 108.0, percentage: 21.7 },
  { fuelType: "MGO", consumed: 77.0, percentage: 15.5 },
  { fuelType: "LNG", consumed: 3.5, percentage: 0.7 },
];

// ─── Emissions by activity type ───
export const emissionsByActivity = [
  { activity: "Underway", co2: 892, percentage: 66.8 },
  { activity: "DP Operations", co2: 199, percentage: 14.9 },
  { activity: "In Port", co2: 128, percentage: 9.6 },
  { activity: "Anchorage", co2: 62, percentage: 4.6 },
  { activity: "Cargo Ops", co2: 38, percentage: 2.8 },
  { activity: "Standby", co2: 16, percentage: 1.2 },
];

// ─── Vessel daily trend (for vessel detail page) ───
export const vesselDailyTrend = [
  { date: "Mar 20", fuel: 14.2, co2: 44.8, distance: 156 },
  { date: "Mar 21", fuel: 15.8, co2: 49.8, distance: 168 },
  { date: "Mar 22", fuel: 13.5, co2: 42.6, distance: 148 },
  { date: "Mar 23", fuel: 16.1, co2: 50.7, distance: 172 },
  { date: "Mar 24", fuel: 14.8, co2: 46.7, distance: 160 },
  { date: "Mar 25", fuel: 15.2, co2: 47.9, distance: 164 },
  { date: "Mar 26", fuel: 12.8, co2: 40.4, distance: 140 },
  { date: "Mar 27", fuel: 17.2, co2: 54.2, distance: 188 },
  { date: "Mar 28", fuel: 14.5, co2: 45.7, distance: 155 },
  { date: "Mar 29", fuel: 3.2, co2: 10.3, distance: 0 },
  { date: "Mar 30", fuel: 15.5, co2: 48.9, distance: 165 },
  { date: "Mar 31", fuel: 16.8, co2: 53.0, distance: 178 },
];
