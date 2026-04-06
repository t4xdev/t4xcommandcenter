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

export const vesselData: VesselData[] = [
  {
    id: "v1",
    name: "Dolphin-04",
    imo: "9328364",
    master: "Santosh Kumar Pandey",
    company: "Adani",
    fleet: "Adani Fleet",
    location: "B-12 INBUNT VESSEL",
    longitude: 69.7076,
    latitude: 22.7147,
    status: "normal",
    hiringStatus: "ON-Hire",
    client: "SSIDL",
    reportDate: "05-Apr-2026",
    reportTime: "07:07",
    speed: 0,
    course: 0,
    fuelBalance: 27922,
    fuelUsed: 2963,
    fuelStart: 30885,
    waterBalance: 22000,
    dpOpsHrs: "21:24",
    transitHrs: "00:00",
    portHrs: "02:36",
    totalOpsHrs: "24:00",
    crewOnBoard: 14,
    maintenanceDone: 4,
    outstandingDefects: 0,
    certificatesValid: 35,
    certificatesExpired: 0,
    provisionDays: 12,
    hseToolbox: 1,
    hseDrills: 1,
    lti: 0,
    nearMisses: 0,
    lastOps: "DP Operations at B-12 Platform, Berthing: 5, Unberthing: 4",
    maintenanceRemarks: "Routine maintenance carried out on ME turbo charger",
    overallRemarks: "All operations normal",
  },
  {
    id: "v2",
    name: "Ocean Lancer",
    imo: "9719604",
    master: "Mostafijur Rahaman Sapui",
    company: "Ocean Sparkle",
    fleet: "Ocean Sparkle Fleet",
    location: "KANDLA PORT",
    longitude: 70.2232,
    latitude: 23.0113,
    status: "normal",
    hiringStatus: "ON-Hire",
    client: "Ocean Sparkle Limited",
    reportDate: "04-Apr-2026",
    reportTime: "00:00",
    speed: 0,
    course: 0,
    fuelBalance: 36701,
    fuelUsed: 1422,
    fuelStart: 38123,
    waterBalance: 22,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "09:18",
    totalOpsHrs: "09:18",
    crewOnBoard: 11,
    maintenanceDone: 3,
    outstandingDefects: 0,
    certificatesValid: 32,
    certificatesExpired: 0,
    provisionDays: 15,
    hseToolbox: 1,
    hseDrills: 1,
    lti: 0,
    nearMisses: 0,
    lastOps: "Berthing: 2, Unberthing: 4 at Kandla Port",
    maintenanceRemarks: "Battery inspection completed, Fire drill conducted",
    overallRemarks: "All systems operational",
  },
  {
    id: "v3",
    name: "Zaharat Al Behar",
    imo: "9581473",
    master: "Akhilesh Mondal",
    company: "Adani",
    fleet: "Adani Fleet",
    location: "ADS Dock2, Duqm, Oman",
    longitude: 57.7220,
    latitude: 19.6622,
    status: "warning",
    hiringStatus: "OFF-Hire",
    client: "-",
    reportDate: "05-Apr-2026",
    reportTime: "00:01",
    speed: 0,
    course: 0,
    fuelBalance: 54140,
    fuelUsed: 0,
    fuelStart: 54140,
    waterBalance: 37180,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "24:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 5,
    maintenanceDone: 88,
    outstandingDefects: 0,
    certificatesValid: 31,
    certificatesExpired: 2,
    provisionDays: 6,
    hseToolbox: 1,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "NIL - Vessel docked at ADS Dock2",
    maintenanceRemarks: "M/E Control Air System 100 Hrs routine maintenance. General cleanship carried out.",
    overallRemarks: "Vessel under dry dock maintenance",
  },
  {
    id: "v4",
    name: "Tahid Verde Island",
    imo: "1099929",
    master: "Milan Hajdukovic",
    company: "Adani",
    fleet: "Adani Fleet",
    location: "At Sea - Indian Ocean",
    longitude: 32.8374,
    latitude: -31.8227,
    status: "warning",
    hiringStatus: "OFF-Hire",
    client: "-",
    reportDate: "05-Apr-2026",
    reportTime: "12:00",
    speed: 12.5,
    course: 220,
    fuelBalance: 93500,
    fuelUsed: 3700,
    fuelStart: 97200,
    waterBalance: 15000,
    dpOpsHrs: "00:00",
    transitHrs: "24:00",
    portHrs: "00:00",
    totalOpsHrs: "24:00",
    crewOnBoard: 5,
    maintenanceDone: 1,
    outstandingDefects: 0,
    certificatesValid: 34,
    certificatesExpired: 0,
    provisionDays: 0,
    hseToolbox: 1,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Underway to Capetown 0000H - 2400H",
    maintenanceRemarks: "House Keeping, Kept Clean Before Arrival",
    overallRemarks: "NIL",
  },
  {
    id: "v5",
    name: "Ocean Progress",
    imo: "9766451",
    master: "Naresh Mahadev Patil",
    company: "Ocean Sparkle",
    fleet: "Ocean Sparkle Fleet",
    location: "KANDLA PORT",
    longitude: 70.2232,
    latitude: 23.0109,
    status: "critical",
    hiringStatus: "ON-Hire",
    client: "Ocean Sparkle",
    reportDate: "04-Apr-2026",
    reportTime: "00:00",
    speed: 0,
    course: 0,
    fuelBalance: 14413,
    fuelUsed: 1232,
    fuelStart: 15645,
    waterBalance: 10,
    dpOpsHrs: "00:00",
    transitHrs: "00:00",
    portHrs: "05:30",
    totalOpsHrs: "05:30",
    crewOnBoard: 10,
    maintenanceDone: 2,
    outstandingDefects: 3,
    certificatesValid: 30,
    certificatesExpired: 1,
    provisionDays: 5,
    hseToolbox: 0,
    hseDrills: 0,
    lti: 0,
    nearMisses: 0,
    lastOps: "Berthing: 3, Unberthing: 2 at Kandla Port",
    maintenanceRemarks: "Main engine port & stbd running at 8.4 hrs",
    overallRemarks: "Low fuel warning - refueling required",
  },
];

export const alertHighlights: AlertHighlight[] = [
  {
    id: "a1",
    title: "Low Fuel Alert",
    vesselName: "Ocean Progress",
    description: "Fuel balance at 14,413 Ltrs - below threshold. Refueling required urgently.",
    severity: "critical",
    timestamp: "04-Apr-2026 08:30",
  },
  {
    id: "a2",
    title: "Certificates Expired",
    vesselName: "Zaharat Al Behar",
    description: "2 certificates expired. Renewal required before next voyage.",
    severity: "critical",
    timestamp: "05-Apr-2026 00:01",
  },
  {
    id: "a3",
    title: "Low Provisions",
    vesselName: "Tahid Verde Island",
    description: "Provision days at 0. Endurance till 09-Apr-2026. Resupply at Capetown.",
    severity: "warning",
    timestamp: "05-Apr-2026 12:00",
  },
  {
    id: "a4",
    title: "Outstanding Defects",
    vesselName: "Ocean Progress",
    description: "3 outstanding defects reported. Maintenance attention required.",
    severity: "warning",
    timestamp: "04-Apr-2026 06:00",
  },
  {
    id: "a5",
    title: "Vessel OFF-Hire",
    vesselName: "Zaharat Al Behar",
    description: "Vessel currently OFF-Hire at ADS Dock2, Duqm, Oman for dry dock maintenance.",
    severity: "info",
    timestamp: "05-Apr-2026 00:01",
  },
  {
    id: "a6",
    title: "Transit Underway",
    vesselName: "Tahid Verde Island",
    description: "Vessel transiting to Capetown at 12.5 knots. ETA pending.",
    severity: "info",
    timestamp: "05-Apr-2026 12:00",
  },
  {
    id: "a7",
    title: "High DP Operations",
    vesselName: "Dolphin-04",
    description: "21h 24m DP operations logged. Total 152 towing moves completed.",
    severity: "normal",
    timestamp: "05-Apr-2026 07:07",
  },
  {
    id: "a8",
    title: "Fire Drill Completed",
    vesselName: "Ocean Lancer",
    description: "Fire drill successfully conducted. All crew participated.",
    severity: "normal",
    timestamp: "04-Apr-2026 14:00",
  },
  {
    id: "a9",
    title: "Low Water Supply",
    vesselName: "Ocean Progress",
    description: "Water balance at 10 ML - critically low. Replenishment needed.",
    severity: "critical",
    timestamp: "04-Apr-2026 07:00",
  },
  {
    id: "a10",
    title: "Maintenance Milestone",
    vesselName: "Zaharat Al Behar",
    description: "88 maintenance jobs completed today during dry dock period.",
    severity: "normal",
    timestamp: "05-Apr-2026 18:00",
  },
];

export const fleetComparisonData = [
  { vessel: "Dolphin-04", efficiency: 92, fuelConsumption: 2963, downtime: 2.6, compliance: 100 },
  { vessel: "Ocean Lancer", efficiency: 78, fuelConsumption: 1422, downtime: 14.7, compliance: 100 },
  { vessel: "Zaharat Al Behar", efficiency: 0, fuelConsumption: 0, downtime: 24, compliance: 94 },
  { vessel: "Tahid Verde Island", efficiency: 85, fuelConsumption: 3700, downtime: 0, compliance: 100 },
  { vessel: "Ocean Progress", efficiency: 65, fuelConsumption: 1232, downtime: 18.5, compliance: 97 },
];
