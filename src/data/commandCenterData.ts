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

// --- Seed locations along realistic shipping lanes & port approaches ---
const locationPools = [
  // Arabian Sea — spread across 55-75°E, 10-25°N
  { name: "Off Mumbai", lon: 71.5, lat: 19.0, region: "Arabian Sea" },
  { name: "Off Kandla", lon: 68.5, lat: 22.5, region: "Arabian Sea" },
  { name: "Gujarat Offshore", lon: 69.5, lat: 20.5, region: "Arabian Sea" },
  { name: "Off Goa", lon: 72.0, lat: 15.5, region: "Arabian Sea" },
  { name: "Off Mangalore", lon: 73.0, lat: 13.0, region: "Arabian Sea" },
  { name: "Off Kochi", lon: 74.5, lat: 10.5, region: "Arabian Sea" },
  { name: "Lakshadweep Sea", lon: 72.0, lat: 11.5, region: "Arabian Sea" },
  { name: "Arabian Sea West", lon: 60.0, lat: 16.0, region: "Arabian Sea" },
  { name: "Arabian Sea Central", lon: 64.0, lat: 18.0, region: "Arabian Sea" },
  { name: "Off Oman", lon: 58.0, lat: 21.0, region: "Arabian Sea" },
  { name: "Arabian Sea South", lon: 62.0, lat: 12.0, region: "Arabian Sea" },
  { name: "Off Muscat", lon: 57.0, lat: 23.0, region: "Arabian Sea" },
  { name: "Mid Arabian Sea", lon: 66.0, lat: 15.0, region: "Arabian Sea" },
  // Bay of Bengal — spread across 80-95°E, 5-20°N
  { name: "Off Chennai", lon: 81.5, lat: 13.5, region: "Bay of Bengal" },
  { name: "Off Vizag", lon: 84.5, lat: 17.5, region: "Bay of Bengal" },
  { name: "Off Paradip", lon: 87.0, lat: 19.5, region: "Bay of Bengal" },
  { name: "Off Kolkata", lon: 88.5, lat: 20.5, region: "Bay of Bengal" },
  { name: "Bay of Bengal Central", lon: 86.0, lat: 14.0, region: "Bay of Bengal" },
  { name: "Bay of Bengal South", lon: 83.0, lat: 8.0, region: "Bay of Bengal" },
  { name: "Bay of Bengal East", lon: 90.0, lat: 12.0, region: "Bay of Bengal" },
  { name: "Bay of Bengal North", lon: 88.0, lat: 18.0, region: "Bay of Bengal" },
  { name: "Off Trincomalee", lon: 82.0, lat: 9.0, region: "Bay of Bengal" },
  // South India / Sri Lanka corridor
  { name: "Off Tuticorin", lon: 78.5, lat: 8.5, region: "Coastal" },
  { name: "South of Sri Lanka", lon: 80.5, lat: 5.5, region: "Coastal" },
  { name: "Off Kanyakumari", lon: 77.0, lat: 7.5, region: "Coastal" },
  // Andaman Sea — 92-100°E, 5-18°N
  { name: "Andaman Sea North", lon: 94.0, lat: 14.0, region: "Andaman Sea" },
  { name: "Off Port Blair", lon: 93.0, lat: 12.0, region: "Andaman Sea" },
  { name: "Andaman Sea South", lon: 95.0, lat: 8.0, region: "Andaman Sea" },
  { name: "Andaman Sea Central", lon: 96.0, lat: 11.0, region: "Andaman Sea" },
  // Southern Indian Ocean — 40-90°E, -5 to -20°S
  { name: "South Indian Ocean NW", lon: 50.0, lat: -8.0, region: "Transit" },
  { name: "South Indian Ocean NE", lon: 75.0, lat: -6.0, region: "Transit" },
  { name: "Equatorial Lane West", lon: 58.0, lat: -2.0, region: "Transit" },
  { name: "Equatorial Lane East", lon: 72.0, lat: 1.0, region: "Transit" },
  { name: "Off Maldives", lon: 73.0, lat: 4.0, region: "Transit" },
  { name: "South Indian Ocean Central", lon: 65.0, lat: -12.0, region: "Transit" },
  // Mozambique Channel — 38-48°E, -12 to -22°S
  { name: "Mozambique Channel North", lon: 42.0, lat: -13.0, region: "Mozambique" },
  { name: "Mozambique Channel South", lon: 44.0, lat: -20.0, region: "Mozambique" },
  { name: "Mozambique Channel Central", lon: 43.0, lat: -17.0, region: "Mozambique" },
  // West Africa — 0-15°W, 0-10°N
  { name: "Off Monrovia", lon: -10.5, lat: 5.5, region: "West Africa" },
  { name: "Gulf of Guinea", lon: -3.0, lat: 4.0, region: "West Africa" },
  { name: "Off Abidjan", lon: -4.0, lat: 5.0, region: "West Africa" },
  // Southeast Asia — 100-125°E, 5-15°N
  { name: "Off Batangas", lon: 121.0, lat: 13.5, region: "Southeast Asia" },
  { name: "South China Sea", lon: 115.0, lat: 10.0, region: "Southeast Asia" },
  { name: "Strait of Malacca", lon: 100.5, lat: 3.0, region: "Southeast Asia" },
  { name: "Off Singapore", lon: 104.0, lat: 1.5, region: "Southeast Asia" },
  // South Africa coast — 18-35°E, -28 to -35°S
  { name: "Off Durban", lon: 31.5, lat: -30.0, region: "South Africa" },
  { name: "Off Capetown", lon: 18.5, lat: -34.0, region: "South Africa" },
  { name: "Off Port Elizabeth", lon: 26.0, lat: -34.0, region: "South Africa" },
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
      company: "Adani Ports", fleet: "Adani Fleet", location: "B-12 Platform",
      longitude: 69.7077, latitude: 22.7147, status: "normal", hiringStatus: "ON-Hire",
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
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "Kandla Port",
      longitude: 70.2232, latitude: 23.0113, status: "normal", hiringStatus: "ON-Hire",
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
      longitude: 57.7220, latitude: 19.6623, status: "warning", hiringStatus: "OFF-Hire",
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
      company: "Adani Ports", fleet: "Adani Fleet", location: "Indian Ocean, en route Capetown",
      longitude: 32.8374, latitude: -31.8227, status: "warning", hiringStatus: "OFF-Hire",
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
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "Kandla Port",
      longitude: 70.2232, latitude: 23.0109, status: "critical", hiringStatus: "ON-Hire",
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
      longitude: -10.0482, latitude: 5.8539, status: "normal", hiringStatus: "ON-Hire",
      client: "-", reportDate: "05-Apr-2026", reportTime: "12:01",
      speed: 0, course: 0, fuelBalance: 35153, fuelUsed: 200, fuelStart: 35353,
      waterBalance: 27000, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "00:00",
      totalOpsHrs: "24:00", crewOnBoard: 7, maintenanceDone: 12, outstandingDefects: 0,
      certificatesValid: 28, certificatesExpired: 0, provisionDays: 20,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Standby at infield location - Buchanan Port, Liberia",
      maintenanceRemarks: "Filter mats replaced, propulsion hydraulic systems inspected, battery terminals cleaned",
      overallRemarks: "All systems normal, standby operations",
    },
    {
      id: "v7", name: "Tahid Ilijan", imo: "1099917", master: "Greg Gregorio",
      company: "Adani Ports", fleet: "Adani Fleet", location: "Ilijan Batangas, Philippines",
      longitude: 121.0917, latitude: 13.6210, status: "normal", hiringStatus: "ON-Hire",
      client: "LFC", reportDate: "06-Apr-2026", reportTime: "12:01",
      speed: 0, course: 0, fuelBalance: 54676, fuelUsed: 430, fuelStart: 55106,
      waterBalance: 10100, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 8, maintenanceDone: 6, outstandingDefects: 0,
      certificatesValid: 26, certificatesExpired: 1, provisionDays: 0,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "At anchor in Dela Paz anchorage, tow line ops for LNG Santander Knutsen",
      maintenanceRemarks: "Daily cleaning on bridge, galley, accommodation and main deck",
      overallRemarks: "Vessel at anchor awaiting further instructions",
    },
  ];

  vessels.push(...realVessels);

  // Generate ~210 more vessels
  for (let i = 7; i <= 215; i++) {
    const companyIdx = Math.floor(rand() * companies.length);
    const company = companies[companyIdx];
    const locIdx = Math.floor(rand() * locationPools.length);
    const loc = locationPools[locIdx];

    // Jitter ±1.5° to spread along lanes without landing on coast
    const lonOffset = (rand() - 0.5) * 3;
    const latOffset = (rand() - 0.5) * 3;

    const statusRoll = rand();
    const status: VesselData["status"] = statusRoll < 0.7 ? "normal" : statusRoll < 0.9 ? "warning" : "critical";

    const hiringRoll = rand();
    const hiringStatus: VesselData["hiringStatus"] = hiringRoll < 0.75 ? "ON-Hire" : "OFF-Hire";

    const prefix = vesselPrefixes[Math.floor(rand() * vesselPrefixes.length)];
    const suffix = vesselSuffixes[Math.floor(rand() * vesselSuffixes.length)];
    const nameNum = Math.floor(rand() * 100);
    const vesselName = rand() > 0.5 ? `${prefix} ${suffix}` : `${prefix}-${String(nameNum).padStart(2, "0")}`;

    // Realistic ops mode: most vessels either DP/berthing ops, transit, or port/standby
    const opsMode = rand();
    let speed: number, dpHrs: number, transitHrs: number, portHrs: number;
    if (opsMode < 0.45) {
      // DP/berthing operations (like Dolphin-04) - most common
      dpHrs = Math.round(16 + rand() * 8); // 16-24 hrs
      transitHrs = 0;
      portHrs = 24 - dpHrs;
      speed = 0;
    } else if (opsMode < 0.65) {
      // Transit (like Tahid Verde) - vessel underway
      dpHrs = 0;
      transitHrs = 24;
      portHrs = 0;
      speed = Math.round((8 + rand() * 5) * 10) / 10; // 8-13 knots realistic
    } else if (opsMode < 0.85) {
      // Port/standby (like Zaharat, Sabarmati)
      dpHrs = 0;
      transitHrs = 0;
      portHrs = 24;
      speed = 0;
    } else {
      // Mixed ops (partial DP + transit)
      dpHrs = Math.round(4 + rand() * 10); // 4-14 hrs
      transitHrs = Math.round(2 + rand() * (20 - dpHrs));
      portHrs = Math.max(24 - dpHrs - transitHrs, 0);
      speed = Math.round((4 + rand() * 6) * 10) / 10;
    }

    // Fuel: realistic ranges from VDRs (15k-97k start, 0-3700 used)
    const fuelStart = Math.round(20000 + rand() * 75000);
    const fuelUsed = speed > 0 ? Math.round(200 + rand() * 3500) : Math.round(rand() * 500);
    const fuelBalance = Math.max(fuelStart - fuelUsed, 0);

    // Water: realistic (10-40000 ltrs based on vessel size)
    const waterBalance = Math.round(5000 + rand() * 35000);
    // Crew: 5-14 from VDRs
    const crewOnBoard = Math.round(5 + rand() * 9);
    // Maintenance: 0-12 per day from VDRs
    const maintenanceDone = Math.round(rand() * 12);
    const outstandingDefects = status === "critical" ? Math.round(1 + rand() * 4) : status === "warning" ? Math.round(rand() * 2) : 0;
    // Certs: 22-35 valid from VDRs
    const certsValid = Math.round(22 + rand() * 13);
    const certsExpired = status === "critical" ? Math.round(1 + rand() * 2) : status === "warning" && rand() > 0.6 ? 1 : 0;
    // Provisions: 0-20 days from VDRs
    const provisionDays = Math.round(rand() * 20);

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
