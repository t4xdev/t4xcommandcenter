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

// --- Companies in fleet ---
const companies = [
  { name: "The Adani Harbour International DMCC", fleet: "TAHID Fleet", color: "#1c3557" },
  { name: "Trident Maritime Corporation", fleet: "Trident Fleet", color: "#e30613" },
  { name: "SLSC", fleet: "SLSC Fleet", color: "#0e7c46" },
];

// --- The 6 active vessels (sourced from latest daily reports) ---
export const vesselData: VesselData[] = [
  {
    id: "v1",
    name: "Dela Paz",
    imo: "1099890",
    master: "Efivar Carabuena",
    company: "Trident Maritime Corporation",
    fleet: "Trident Fleet",
    location: "Dela Paz Batangas, Philippines",
    longitude: 121.0985,
    latitude: 13.6221,
    status: "normal",
    hiringStatus: "ON-Hire",
    client: "TAHID DELA PAZ",
    reportDate: "25-Apr-2026",
    reportTime: "12:00",
    speed: 0,
    course: 0,
    fuelBalance: 87906,
    fuelUsed: 200,
    fuelStart: 88106,
    waterBalance: 17500,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "24:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 0,
    maintenanceDone: 5,
    outstandingDefects: 0,
    certificatesValid: 38,
    certificatesExpired: 0,
    provisionDays: 6,
    hseToolbox: 0,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Vessel at anchor in Dela Paz Batangas - 24:00 hrs in port.",
    maintenanceRemarks: "Engine: Cleaned main seachest strainer & all seawater strainers, replaced floodlight bulb fwd stbd. Deck: Continuation painting on bulwark exterior, weekly tests of echo sounder & autopilot.",
    overallRemarks: "All operations normal. Provisions received 17-Apr-2026.",
  },
  {
    id: "v2",
    name: "Ilijan",
    imo: "1099917",
    master: "Greg Gregorio",
    company: "Trident Maritime Corporation",
    fleet: "Trident Fleet",
    location: "Ilijan Batangas, Philippines",
    longitude: 121.0962,
    latitude: 13.6222,
    status: "normal",
    hiringStatus: "ON-Hire",
    client: "LFC",
    reportDate: "25-Apr-2026",
    reportTime: "12:01",
    speed: 0,
    course: 0,
    fuelBalance: 90202,
    fuelUsed: 170,
    fuelStart: 90372,
    waterBalance: 36,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "24:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 0,
    maintenanceDone: 5,
    outstandingDefects: 0,
    certificatesValid: 28,
    certificatesExpired: 0,
    provisionDays: 7,
    hseToolbox: 0,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "24-25 Apr: Vessel at anchor in Dela Paz anchorage.",
    maintenanceRemarks: "Daily cleaning on deck, bridge, galley and accommodation.",
    overallRemarks: "Variance of 5361 Ltrs D.O added to ROB by LNG charterer correction (total 92242 Ltrs).",
  },
  {
    id: "v3",
    name: "Mahaweli",
    imo: "1099905",
    master: "Vinoth Gunathilaka",
    company: "SLSC",
    fleet: "SLSC Fleet",
    location: "Colombo, Sri Lanka",
    longitude: 79.8481,
    latitude: 6.9426,
    status: "warning",
    hiringStatus: "ON-Hire",
    client: "SLPA",
    reportDate: "24-Apr-2026",
    reportTime: "12:01",
    speed: 0,
    course: 0,
    fuelBalance: 81145,
    fuelUsed: 2043,
    fuelStart: 83188,
    waterBalance: 53998,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "00:00",
    totalOpsHrs: "00:00",
    crewOnBoard: 8,
    maintenanceDone: 35,
    outstandingDefects: 0,
    certificatesValid: 25,
    certificatesExpired: 1,
    provisionDays: 0,
    hseToolbox: 0,
    hseDrills: 1,
    lti: 0,
    nearMisses: 0,
    lastOps: "7 tug operations - berthing/sailing for MSC ROWAN, MAERSK HANGZHOU, CMA CGM GANGES, NEW FAITH, SCI MUMBAI, HR FARHA, MAERSK ARAS.",
    maintenanceRemarks: "Engine room safety round carried out. Fire drill conducted.",
    overallRemarks: "Technical Superintendent (Ekramy Ahmed Shalaby) onboard to inspect tug condition. 30,000 Ltrs fresh water received.",
  },
  {
    id: "v4",
    name: "Narmada",
    imo: "9960679",
    master: "Sapriyandi Zainal Abidin",
    company: "The Adani Harbour International DMCC",
    fleet: "TAHID Fleet",
    location: "Dakar Anchorage, Senegal",
    longitude: -17.4013,
    latitude: 14.6846,
    status: "warning",
    hiringStatus: "OFF-Hire",
    client: "-",
    reportDate: "24-Apr-2026",
    reportTime: "00:00",
    speed: 0,
    course: 0,
    fuelBalance: 60649,
    fuelUsed: 0,
    fuelStart: 60649,
    waterBalance: 42000,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "24:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 7,
    maintenanceDone: 31,
    outstandingDefects: 0,
    certificatesValid: 43,
    certificatesExpired: 0,
    provisionDays: 35,
    hseToolbox: 0,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Deck watch 00:01h - 24:00h at Dakar Port.",
    maintenanceRemarks: "Deck: Housekeeping deck to bridge, weather deck Port & Stbd 1st topcoat painting applied.",
    overallRemarks: "Vessel in good condition, all equipment fully operational. Tug OFF-Hire from 09-Feb-2026 06:00 hrs.",
  },
  {
    id: "v5",
    name: "Sabarmati",
    imo: "9960681",
    master: "Islam Abdelfattah Mohamed",
    company: "The Adani Harbour International DMCC",
    fleet: "TAHID Fleet",
    location: "Buchanan Port, Liberia",
    longitude: -10.0481,
    latitude: 5.8541,
    status: "normal",
    hiringStatus: "ON-Hire",
    client: "AML",
    reportDate: "24-Apr-2026",
    reportTime: "12:01",
    speed: 0,
    course: 0,
    fuelBalance: 55841,
    fuelUsed: 794,
    fuelStart: 56635,
    waterBalance: 31000,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "18:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 7,
    maintenanceDone: 26,
    outstandingDefects: 0,
    certificatesValid: 32,
    certificatesExpired: 0,
    provisionDays: 5,
    hseToolbox: 2,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Berthing/Unberthing operations (06:00 hrs Tow/AH/Rig/Sup, 18:00 hrs in port).",
    maintenanceRemarks: "Deck: Daily cleaning, mooring lines repair. Engine: Stbd ME secondary fuel filter changed, engine room cleaning & painting, GS pump test runs.",
    overallRemarks: "MGO consumption: ME 594 Ltrs, Gens 200 Ltrs. Fresh Water 2000 Ltrs. Endurance till 25-Apr-2026.",
  },
  {
    id: "v6",
    name: "Verde Island",
    imo: "1099929",
    master: "Milan Hajdukovic",
    company: "The Adani Harbour International DMCC",
    fleet: "TAHID Fleet",
    location: "Anchorage - Cape Town, South Africa",
    longitude: 18.4607,
    latitude: -33.8855,
    status: "warning",
    hiringStatus: "OFF-Hire",
    client: "-",
    reportDate: "24-Apr-2026",
    reportTime: "12:00",
    speed: 0,
    course: 0,
    fuelBalance: 106600,
    fuelUsed: 150,
    fuelStart: 106750,
    waterBalance: 21500,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "24:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 0,
    maintenanceDone: 13,
    outstandingDefects: 0,
    certificatesValid: 32,
    certificatesExpired: 0,
    provisionDays: 0,
    hseToolbox: 1,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Vessel at anchorage Cape Town - 24:00 hrs at anchor.",
    maintenanceRemarks: "House keeping, grease nipples on moving parts. Hydraulic oil for winch on board (580 Ltrs), sludge on board (700 Ltrs).",
    overallRemarks: "Vessel OFF-Hire. Endurance till 25-Apr-2026. Updated ship certificates amended.",
  },
];

export const realVesselIds = new Set(vesselData.map(v => v.id));
export const realVessels = vesselData;

// --- Generate alerts from vessel data ---
function generateAlerts(): AlertHighlight[] {
  const alerts: AlertHighlight[] = [];
  let id = 1;

  for (const v of vesselData) {
    if (v.fuelBalance < 20000) {
      alerts.push({
        id: `a${id++}`, title: "Low Fuel Alert", vesselName: v.name,
        description: `Fuel balance at ${v.fuelBalance.toLocaleString()} Ltrs - below threshold.`,
        severity: v.fuelBalance < 15000 ? "critical" : "warning", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
    if (v.certificatesExpired > 0) {
      alerts.push({
        id: `a${id++}`, title: "Certificates Expired", vesselName: v.name,
        description: `${v.certificatesExpired} certificate(s) expired. Renewal required.`,
        severity: "critical", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
    if (v.provisionDays > 0 && v.provisionDays < 3) {
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
