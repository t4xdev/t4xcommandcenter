export interface VesselData {
  id: string;
  name: string;
  imo: string;
  master: string;
  company: string;
  fleet: string;
  location: string;
  longitude: number;
  latitude: number;
  status: "normal" | "warning" | "critical";
  hiringStatus: "ON-Hire" | "OFF-Hire";
  client: string;
  reportDate: string;
  reportTime: string;
  speed: number;
  course: number;
  fuelBalance: number;
  fuelUsed: number;
  fuelStart: number;
  waterBalance: number;
  dpOpsHrs: string;
  transitHrs: string;
  portHrs: string;
  totalOpsHrs: string;
  crewOnBoard: number;
  maintenanceDone: number;
  outstandingDefects: number;
  certificatesValid: number;
  certificatesExpired: number;
  provisionDays: number;
  hseToolbox: number;
  hseDrills: number;
  lti: number;
  nearMisses: number;
  lastOps: string;
  maintenanceRemarks: string;
  overallRemarks: string;
}

export interface AlertHighlight {
  id: string;
  title: string;
  vesselName: string;
  description: string;
  severity: "critical" | "warning" | "info" | "normal";
  timestamp: string;
}

// --- Single company in fleet ---
const companies = [
  { name: "MVA Maritime FZCO", fleet: "MVA Fleet", color: "#1c3557" },
];

// --- Active vessels (sourced from latest daily reports 27-Apr-2026) ---
// Note: Both vessels operating out of Luanda, Angola.
// Fuel/Water values converted from m³ to Ltrs (×1000) for consistency with dashboard label "Ltrs".
export const vesselData: VesselData[] = [
  {
    id: "v1",
    name: "Anjali",
    imo: "9714159",
    master: "Capt. Dheeraj Kohli",
    company: "MVA Maritime FZCO",
    fleet: "MVA Fleet",
    location: "Luanda Inner Bay Anchorage, Angola",
    longitude: 13.2457,
    latitude: -8.7855,
    status: "warning",
    hiringStatus: "ON-Hire",
    client: "XPTS LDA",
    reportDate: "27-Apr-2026",
    reportTime: "23:59",
    speed: 0,
    course: 0,
    fuelBalance: 44500,
    fuelUsed: 2100,
    fuelStart: 46600,
    waterBalance: 70000,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "24:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 17,
    maintenanceDone: 41,
    outstandingDefects: 0,
    certificatesValid: 94,
    certificatesExpired: 0,
    provisionDays: 27,
    hseToolbox: 2,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Vessel at Luanda inner bay anchorage — 24:00 hrs at anchor. ON-Hire with XPTS LDA since 05-Apr-2026.",
    maintenanceRemarks: "Deck: Housekeeping in all assigned areas, Monkey Island bridge A/C room cleaned (painting in progress), GMDSS battery room bulkhead cleaned. Engine: TBT in ECR, fire/security rounds, ER emergency escape hatches cleaning & painting in progress, galley exhaust fan repair in progress, bridge laminating machine and electric grinding machine repaired.",
    overallRemarks: "Satisfactory. Fuel ROB low — replenishment recommended. 17 crew on board. Provisions received 24-Apr-2026 (27 days available).",
  },
  {
    id: "v2",
    name: "Island Queen",
    imo: "9653056",
    master: "Desrineldi Syafii",
    company: "MVA Maritime FZCO",
    fleet: "MVA Fleet",
    location: "Ilha Jetty, Luanda, Angola",
    longitude: 13.2501,
    latitude: -8.7768,
    status: "warning",
    hiringStatus: "ON-Hire",
    client: "XPTS",
    reportDate: "27-Apr-2026",
    reportTime: "00:01",
    speed: 0,
    course: 0,
    fuelBalance: 45360,
    fuelUsed: 250,
    fuelStart: 45610,
    waterBalance: 74000,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "24:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 11,
    maintenanceDone: 12,
    outstandingDefects: 0,
    certificatesValid: 48,
    certificatesExpired: 10,
    provisionDays: 30,
    hseToolbox: 2,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Vessel beaching at Ilha Jetty Luanda — 24:00 hrs at jetty. Cleaning accommodations and lifting life raft to the car for renewal service.",
    maintenanceRemarks: "Steering gear room painting work in progress. PMS routines carried out. Main engines and aux engines using 15W-40 oil.",
    overallRemarks: "10 certificates expired — renewal action required. ON-Hire with XPTS since 25-Apr-2025. Provisions received 23-Apr-2026 (30 days available).",
  },
];

export const realVesselIds = new Set(vesselData.map(v => v.id));
export const realVessels = vesselData;

// --- Generate alerts from vessel data ---
function generateAlerts(): AlertHighlight[] {
  const alerts: AlertHighlight[] = [];
  let id = 1;

  for (const v of vesselData) {
    if (v.fuelBalance < 50000) {
      alerts.push({
        id: `a${id++}`, title: "Low Fuel Alert", vesselName: v.name,
        description: `Fuel ROB at ${v.fuelBalance.toLocaleString()} Ltrs - replenishment recommended.`,
        severity: v.fuelBalance < 30000 ? "critical" : "warning", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
    if (v.waterBalance < 10000) {
      alerts.push({
        id: `a${id++}`, title: "Critical Fresh Water", vesselName: v.name,
        description: `Fresh water balance at ${v.waterBalance.toLocaleString()} Ltrs - immediate resupply required.`,
        severity: "critical", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
    if (v.certificatesExpired > 0) {
      alerts.push({
        id: `a${id++}`, title: "Certificates Expired", vesselName: v.name,
        description: `${v.certificatesExpired} certificate(s) expired. Renewal required.`,
        severity: v.certificatesExpired >= 5 ? "critical" : "warning", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
    if (v.provisionDays > 0 && v.provisionDays < 5) {
      alerts.push({
        id: `a${id++}`, title: "Low Provisions", vesselName: v.name,
        description: `Only ${v.provisionDays} days of provisions remaining. Resupply needed.`,
        severity: "warning", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
    if (v.outstandingDefects > 2) {
      alerts.push({
        id: `a${id++}`, title: "Outstanding Defects", vesselName: v.name,
        description: `${v.outstandingDefects} outstanding defects reported. Maintenance attention required.`,
        severity: "warning", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
    if (v.hiringStatus === "OFF-Hire") {
      alerts.push({
        id: `a${id++}`, title: "Vessel OFF-Hire", vesselName: v.name,
        description: `Vessel currently OFF-Hire at ${v.location}.`,
        severity: "info", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
  }

  return alerts;
}

export const alertHighlights: AlertHighlight[] = generateAlerts();

// --- Fleet comparison aggregated by company ---
export const fleetComparisonData = companies.map((c) => {
  const companyVessels = realVessels.filter((v) => v.company === c.name);
  const count = companyVessels.length;
  if (count === 0) return { vessel: c.name, efficiency: 0, fuelConsumption: 0, downtime: 0, compliance: 0 };

  const avgEfficiency = Math.round(companyVessels.reduce((s, v) => {
    const dpH = parseInt(v.dpOpsHrs.split(":")[0]) || 0;
    return s + (dpH / 24) * 100;
  }, 0) / count);

  const totalFuel = companyVessels.reduce((s, v) => s + v.fuelUsed, 0);
  const avgDowntime = Math.round(companyVessels.reduce((s, v) => {
    const pH = parseInt(v.portHrs.split(":")[0]) || 0;
    return s + pH;
  }, 0) / count * 10) / 10;

  const compliance = Math.round(companyVessels.reduce((s, v) => {
    return s + (v.certificatesExpired === 0 ? 100 : (v.certificatesValid / (v.certificatesValid + v.certificatesExpired)) * 100);
  }, 0) / count);

  return { vessel: c.name, efficiency: avgEfficiency, fuelConsumption: totalFuel, downtime: avgDowntime, compliance };
});
