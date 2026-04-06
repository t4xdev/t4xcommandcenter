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

// --- Company definitions ---
const companies = [
  { name: "Adani Ports", fleet: "Adani Fleet", color: "#1c3557" },
  { name: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", color: "#e30613" },
  { name: "Global Maritime", fleet: "Global Maritime Fleet", color: "#0e7c46" },
  { name: "Pacific Shipping", fleet: "Pacific Shipping Fleet", color: "#d97706" },
];

// --- Seed locations in water near India & nearby seas ---
const locationPools = [
  // West coast of India (Arabian Sea)
  { name: "Off Mundra", lon: 68.8, lat: 22.5, region: "India" },
  { name: "Off Kandla", lon: 69.5, lat: 22.8, region: "India" },
  { name: "Off Mumbai", lon: 71.5, lat: 18.8, region: "India" },
  { name: "Off Goa", lon: 72.5, lat: 15.2, region: "India" },
  { name: "Off Cochin", lon: 75.0, lat: 9.5, region: "India" },
  { name: "Off Mangalore", lon: 73.5, lat: 12.5, region: "India" },
  // East coast of India (Bay of Bengal)
  { name: "Off Vizag", lon: 84.0, lat: 17.2, region: "India" },
  { name: "Off Chennai", lon: 81.0, lat: 12.8, region: "India" },
  { name: "Off Paradip", lon: 87.5, lat: 19.8, region: "India" },
  { name: "Off Haldia", lon: 88.5, lat: 21.0, region: "India" },
  { name: "Off Tuticorin", lon: 78.5, lat: 8.2, region: "India" },
  // Arabian Sea transit
  { name: "Arabian Sea West", lon: 63.0, lat: 18.0, region: "Transit" },
  { name: "Arabian Sea Central", lon: 66.0, lat: 15.0, region: "Transit" },
  { name: "Arabian Sea South", lon: 68.0, lat: 12.0, region: "Transit" },
  { name: "Lakshadweep Sea", lon: 72.0, lat: 11.0, region: "Transit" },
  // Bay of Bengal transit
  { name: "Bay of Bengal North", lon: 86.0, lat: 16.0, region: "Transit" },
  { name: "Bay of Bengal Central", lon: 84.0, lat: 12.0, region: "Transit" },
  { name: "Bay of Bengal South", lon: 82.0, lat: 8.0, region: "Transit" },
  // Gulf & Middle East (water)
  { name: "Persian Gulf", lon: 52.0, lat: 26.0, region: "Middle East" },
  { name: "Gulf of Oman", lon: 58.0, lat: 24.0, region: "Middle East" },
  { name: "Off Fujairah", lon: 56.8, lat: 25.0, region: "Middle East" },
  { name: "Off Duqm", lon: 57.5, lat: 19.2, region: "Middle East" },
  // Indian Ocean
  { name: "Indian Ocean NW", lon: 60.0, lat: 10.0, region: "Transit" },
  { name: "Indian Ocean Central", lon: 72.0, lat: 5.0, region: "Transit" },
  { name: "Maldives Waters", lon: 73.5, lat: 3.0, region: "Transit" },
];

const vesselPrefixes = [
  "Dolphin", "Ocean", "Sea", "Marine", "Pacific", "Atlantic", "Neptune", "Triton",
  "Coral", "Wave", "Storm", "Anchor", "Harbor", "Gulf", "Horizon", "Titan",
  "Phoenix", "Voyager", "Explorer", "Pioneer", "Sentinel", "Guardian", "Hawk",
  "Eagle", "Falcon", "Dragon", "Thunder", "Lightning", "Breeze", "Aurora",
  "Sapphire", "Ruby", "Emerald", "Diamond", "Platinum", "Silver", "Golden",
  "Royal", "Imperial", "Majestic", "Victory", "Liberty", "Fortune", "Glory",
  "Spirit", "Valor", "Pride", "Unity", "Progress", "Success",
];

const vesselSuffixes = [
  "Star", "Lancer", "Rider", "Swift", "Force", "Power", "Shield", "Blade",
  "Arrow", "Tiger", "Lion", "Wolf", "Bear", "Hawk", "Ray", "Quest",
  "Dream", "Hope", "Grace", "Legend", "Crown", "King", "Queen", "Prince",
  "Express", "Venture", "Spark", "Blaze", "Dawn", "Dusk", "Night", "Wind",
];

const masters = [
  "Santosh K. Pandey", "Mostafijur R. Sapui", "Akhilesh Mondal", "Milan Hajdukovic",
  "Naresh M. Patil", "Rajesh Kumar", "Anil Sharma", "Vikram Singh", "Deepak Verma",
  "Suresh Nair", "Mohammed Ali", "Pradeep Rao", "Ajay Patel", "Ramesh Iyer",
  "Sanjay Mishra", "Abhishek Das", "Kiran Joshi", "Manoj Tiwari", "Prakash Gupta",
  "Ravi Shankar", "Gopal Krishna", "Harish Menon", "Sachin Kulkarni", "Ashok Reddy",
  "Balaji Srinivasan", "Chandra Mohan", "Dinesh Babu", "Ganesh Pillai", "Hari Prasad",
  "Ivan Petrovic", "James Wilson", "Karl Schmidt", "Lars Andersen", "Marco Rossi",
];

const clients = [
  "SSIDL", "Ocean Sparkle Ltd", "ONGC", "Reliance Industries", "BPCL",
  "HPCL", "IOC", "Adani Group", "Tata Power", "L&T Hydrocarbon",
  "Vedanta Ltd", "Cairn India", "Shell India", "BP India", "Total Energies",
  "Saudi Aramco", "ADNOC", "QatarEnergy", "KPC", "NIOC",
];

const operations = [
  "DP Operations at offshore platform",
  "Berthing & Unberthing operations",
  "Cargo transfer operations",
  "STS transfer in progress",
  "Standby at infield location",
  "Transit to next port",
  "Anchor handling operations",
  "Towing operations underway",
  "Supply run to platform",
  "Survey operations",
  "Rig move assistance",
  "Emergency standby duty",
  "Port call - bunkering",
  "Dry dock maintenance",
  "Crew change operations",
];

const maintenanceNotes = [
  "Routine ME maintenance completed",
  "AE port generator serviced",
  "Hull cleaning scheduled",
  "Fire pump inspection done",
  "Lifeboat davit greased",
  "Steering gear tested",
  "Emergency generator tested",
  "Bilge system flushed",
  "Navigation equipment calibrated",
  "Safety equipment inspection",
  "Turbo charger maintenance",
  "Fuel system cleaning",
  "Cooling system maintenance",
  "Electrical system check",
  "Deck machinery overhaul",
];

// Seeded random for consistency
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateVessels(): VesselData[] {
  const vessels: VesselData[] = [];
  const rand = seededRandom(42);

  // 5 real vessels from PDFs
  const realVessels: VesselData[] = [
    {
      id: "v1", name: "Dolphin-04", imo: "9328364", master: "Santosh K. Pandey",
      company: "Adani Ports", fleet: "Adani Fleet", location: "B-12 INBUNT VESSEL",
      longitude: 68.8, latitude: 22.5, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "07:07",
      speed: 0, course: 0, fuelBalance: 27922, fuelUsed: 2963, fuelStart: 30885,
      waterBalance: 22000, dpOpsHrs: "21:24", transitHrs: "00:00", portHrs: "02:36",
      totalOpsHrs: "24:00", crewOnBoard: 14, maintenanceDone: 4, outstandingDefects: 0,
      certificatesValid: 35, certificatesExpired: 0, provisionDays: 12,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at B-12 Platform, Berthing: 5, Unberthing: 4",
      maintenanceRemarks: "Routine maintenance on ME turbo charger",
      overallRemarks: "All operations normal",
    },
    {
      id: "v2", name: "Ocean Lancer", imo: "9719604", master: "Mostafijur R. Sapui",
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "KANDLA PORT",
      longitude: 69.5, latitude: 22.8, status: "normal", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "04-Apr-2026", reportTime: "00:00",
      speed: 0, course: 0, fuelBalance: 36701, fuelUsed: 1422, fuelStart: 38123,
      waterBalance: 22, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "09:18",
      totalOpsHrs: "09:18", crewOnBoard: 11, maintenanceDone: 3, outstandingDefects: 0,
      certificatesValid: 32, certificatesExpired: 0, provisionDays: 15,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "Berthing: 2, Unberthing: 4 at Kandla Port",
      maintenanceRemarks: "Battery inspection completed",
      overallRemarks: "All systems operational",
    },
    {
      id: "v3", name: "Zaharat Al Behar", imo: "9581473", master: "Akhilesh Mondal",
      company: "Adani Ports", fleet: "Adani Fleet", location: "ADS Dock2, Duqm, Oman",
      longitude: 57.5, latitude: 19.2, status: "warning", hiringStatus: "OFF-Hire",
      client: "-", reportDate: "05-Apr-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 54140, fuelUsed: 0, fuelStart: 54140,
      waterBalance: 37180, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 5, maintenanceDone: 88, outstandingDefects: 0,
      certificatesValid: 31, certificatesExpired: 2, provisionDays: 6,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "NIL - Vessel docked at ADS Dock2",
      maintenanceRemarks: "M/E Control Air System 100 Hrs routine maintenance",
      overallRemarks: "Vessel under dry dock maintenance",
    },
    {
      id: "v4", name: "Tahid Verde Island", imo: "1099929", master: "Milan Hajdukovic",
      company: "Adani Ports", fleet: "Adani Fleet", location: "At Sea - Indian Ocean",
      longitude: 60.0, latitude: 10.0, status: "warning", hiringStatus: "OFF-Hire",
      client: "-", reportDate: "05-Apr-2026", reportTime: "12:00",
      speed: 12.5, course: 220, fuelBalance: 93500, fuelUsed: 3700, fuelStart: 97200,
      waterBalance: 15000, dpOpsHrs: "00:00", transitHrs: "24:00", portHrs: "00:00",
      totalOpsHrs: "24:00", crewOnBoard: 5, maintenanceDone: 1, outstandingDefects: 0,
      certificatesValid: 34, certificatesExpired: 0, provisionDays: 0,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Underway to Capetown 0000H - 2400H",
      maintenanceRemarks: "House Keeping, Kept Clean Before Arrival",
      overallRemarks: "NIL",
    },
    {
      id: "v5", name: "Ocean Progress", imo: "9766451", master: "Naresh M. Patil",
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "KANDLA PORT",
      longitude: 69.5, latitude: 22.9, status: "critical", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "04-Apr-2026", reportTime: "00:00",
      speed: 0, course: 0, fuelBalance: 14413, fuelUsed: 1232, fuelStart: 15645,
      waterBalance: 10, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "05:30",
      totalOpsHrs: "05:30", crewOnBoard: 10, maintenanceDone: 2, outstandingDefects: 3,
      certificatesValid: 30, certificatesExpired: 1, provisionDays: 5,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Berthing: 3, Unberthing: 2 at Kandla Port",
      maintenanceRemarks: "Main engine port & stbd running at 8.4 hrs",
      overallRemarks: "Low fuel warning - refueling required",
    },
    {
      id: "v6", name: "Tahid Sabarmati", imo: "9960681", master: "Ahmed Abdelaziz",
      company: "Adani Ports", fleet: "Adani Fleet", location: "Buchanan Port, Liberia",
      longitude: 63.0, latitude: 18.0, status: "normal", hiringStatus: "ON-Hire",
      client: "-", reportDate: "05-Apr-2026", reportTime: "12:01",
      speed: 0, course: 0, fuelBalance: 35153, fuelUsed: 200, fuelStart: 35353,
      waterBalance: 27000, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "00:00",
      totalOpsHrs: "24:00", crewOnBoard: 7, maintenanceDone: 12, outstandingDefects: 0,
      certificatesValid: 28, certificatesExpired: 0, provisionDays: 20,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Standby at infield location - Buchanan Port",
      maintenanceRemarks: "Filter mats replaced, propulsion hydraulic systems inspected, battery terminals cleaned",
      overallRemarks: "All systems normal, standby operations",
    },
  ];

  vessels.push(...realVessels);

  // Generate ~210 more vessels
  for (let i = 6; i <= 215; i++) {
    const companyIdx = Math.floor(rand() * companies.length);
    const company = companies[companyIdx];
    const locIdx = Math.floor(rand() * locationPools.length);
    const loc = locationPools[locIdx];

    // Add small random offset to coordinates
    const lonOffset = (rand() - 0.5) * 4;
    const latOffset = (rand() - 0.5) * 4;

    const statusRoll = rand();
    const status: VesselData["status"] = statusRoll < 0.7 ? "normal" : statusRoll < 0.9 ? "warning" : "critical";

    const hiringRoll = rand();
    const hiringStatus: VesselData["hiringStatus"] = hiringRoll < 0.75 ? "ON-Hire" : "OFF-Hire";

    const prefix = vesselPrefixes[Math.floor(rand() * vesselPrefixes.length)];
    const suffix = vesselSuffixes[Math.floor(rand() * vesselSuffixes.length)];
    const nameNum = Math.floor(rand() * 100);
    const vesselName = rand() > 0.5 ? `${prefix} ${suffix}` : `${prefix}-${String(nameNum).padStart(2, "0")}`;

    const speed = loc.region === "Transit" ? Math.round(rand() * 14 * 10) / 10 : Math.round(rand() * 3 * 10) / 10;
    const fuelStart = Math.round(15000 + rand() * 85000);
    const fuelUsed = Math.round(rand() * 5000);
    const fuelBalance = Math.max(fuelStart - fuelUsed, 0);

    const waterBalance = Math.round(5 + rand() * 40000);
    const crewOnBoard = Math.round(5 + rand() * 20);
    const maintenanceDone = Math.round(rand() * 10);
    const outstandingDefects = status === "critical" ? Math.round(1 + rand() * 5) : status === "warning" ? Math.round(rand() * 3) : 0;
    const certsValid = Math.round(28 + rand() * 10);
    const certsExpired = status === "critical" ? Math.round(1 + rand() * 3) : status === "warning" && rand() > 0.5 ? 1 : 0;
    const provisionDays = Math.round(rand() * 30);

    const dpHrs = Math.round(rand() * 24);
    const transitHrs = Math.round(rand() * (24 - dpHrs));
    const portHrs = 24 - dpHrs - transitHrs;

    const pad = (n: number) => String(n).padStart(2, "0");

    vessels.push({
      id: `v${i}`,
      name: vesselName,
      imo: String(9000000 + Math.floor(rand() * 999999)),
      master: masters[Math.floor(rand() * masters.length)],
      company: company.name,
      fleet: company.fleet,
      location: loc.name,
      longitude: loc.lon + lonOffset,
      latitude: loc.lat + latOffset,
      status,
      hiringStatus,
      client: hiringStatus === "ON-Hire" ? clients[Math.floor(rand() * clients.length)] : "-",
      reportDate: `0${Math.floor(3 + rand() * 3)}-Apr-2026`,
      reportTime: `${pad(Math.floor(rand() * 24))}:${pad(Math.floor(rand() * 60))}`,
      speed,
      course: Math.round(rand() * 360),
      fuelBalance,
      fuelUsed,
      fuelStart,
      waterBalance,
      dpOpsHrs: `${pad(dpHrs)}:${pad(Math.floor(rand() * 60))}`,
      transitHrs: `${pad(transitHrs)}:${pad(Math.floor(rand() * 60))}`,
      portHrs: `${pad(portHrs)}:${pad(Math.floor(rand() * 60))}`,
      totalOpsHrs: "24:00",
      crewOnBoard,
      maintenanceDone,
      outstandingDefects,
      certificatesValid: certsValid,
      certificatesExpired: certsExpired,
      provisionDays,
      hseToolbox: rand() > 0.3 ? 1 : 0,
      hseDrills: rand() > 0.5 ? 1 : 0,
      lti: 0,
      nearMisses: rand() > 0.9 ? 1 : 0,
      lastOps: operations[Math.floor(rand() * operations.length)],
      maintenanceRemarks: maintenanceNotes[Math.floor(rand() * maintenanceNotes.length)],
      overallRemarks: status === "critical" ? "Attention required" : status === "warning" ? "Monitor closely" : "Normal operations",
    });
  }

  return vessels;
}

export const vesselData: VesselData[] = generateVessels();

// Generate alerts from vessel data (critical/warning vessels)
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
    if (v.provisionDays < 3) {
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
    if (v.speed > 10) {
      alerts.push({
        id: `a${id++}`, title: "Transit Underway", vesselName: v.name,
        description: `Vessel transiting at ${v.speed} knots. Course: ${v.course}°.`,
        severity: "normal", timestamp: `${v.reportDate} ${v.reportTime}`,
      });
    }
  }

  return alerts.slice(0, 50); // Cap at 50 for carousel performance
}

export const alertHighlights: AlertHighlight[] = generateAlerts();

// Fleet comparison - aggregate by company
export const fleetComparisonData = companies.map((c) => {
  const companyVessels = vesselData.filter((v) => v.company === c.name);
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
