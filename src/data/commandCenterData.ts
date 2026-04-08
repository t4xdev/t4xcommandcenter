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
  { name: "Adani Ports", fleet: "TAHID Fleet", color: "#1c3557" },
  { name: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", color: "#e30613" },
  { name: "SSIDL", fleet: "SSIDL Fleet", color: "#0e7c46" },
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

  // All real vessels from the fleet
  const realVessels: VesselData[] = [
    // === SSIDL Vessels ===
    {
      id: "v1", name: "Dolphin-04", imo: "9328364", master: "Santosh Kumar Pandey",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "SOUTH BASIN TUG BERTH",
      longitude: 69.7217, latitude: 22.6902, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "07-Apr-2026", reportTime: "07:25",
      speed: 0, course: 0, fuelBalance: 24645, fuelUsed: 1630, fuelStart: 26275,
      waterBalance: 18000, dpOpsHrs: "11:48", transitHrs: "00:00", portHrs: "12:12",
      totalOpsHrs: "24:00", crewOnBoard: 0, maintenanceDone: 0, outstandingDefects: 0,
      certificatesValid: 22, certificatesExpired: 2, provisionDays: 0,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "B3 BERTHING 0030-0412, CB4 BERTHING 0854-1048, CB3 UNBIRTHING 1048-1136, CB3 BERTHING 1136-1300, B5 UNBIRTHING 1318-1500, SB5 UNBIRTHING 2312-2400",
      maintenanceRemarks: "Mess room floor cleaning",
      overallRemarks: "All operations normal",
    },
    {
      id: "v8", name: "Dolphin-07", imo: "9439565", master: "Arun Kumar Chauhan",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Hazira Port",
      longitude: 72.6167, latitude: 21.1000, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 36566, fuelUsed: 210, fuelStart: 36776,
      waterBalance: 30000, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 0, maintenanceDone: 0, outstandingDefects: 0,
      certificatesValid: 0, certificatesExpired: 0, provisionDays: 0,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "-",
      maintenanceRemarks: "-",
      overallRemarks: "-",
    },
    {
      id: "v9", name: "Dolphin-10", imo: "9511583", master: "BHAGAD ABDUL KARIM",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "SB",
      longitude: 69.7084, latitude: 22.7451, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 20002, fuelUsed: 2206, fuelStart: 22208,
      waterBalance: 38000, dpOpsHrs: "14:30", transitHrs: "00:00", portHrs: "09:30",
      totalOpsHrs: "24:00", crewOnBoard: 10, maintenanceDone: 0, outstandingDefects: 0,
      certificatesValid: 24, certificatesExpired: 3, provisionDays: 6,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Unberthing 0155-0300, 0300-0400, 0536-0706, 0742-0854, 0854-1000; Berthing 1000-1142, 1218-1312, 1312-1554, 1854-2130; Unberthing 1812-1854",
      maintenanceRemarks: "Tug inside clean properly, both deck mopping",
      overallRemarks: "All operations normal",
    },
    {
      id: "v10", name: "Dolphin-11", imo: "9511595", master: "JAHANGIR ALAM MONDAL",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "MUNDRA SPM",
      longitude: 69.6553, latitude: 22.7116, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "21-Mar-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 32632, fuelUsed: 1, fuelStart: 32634,
      waterBalance: 12000, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 0, maintenanceDone: 0, outstandingDefects: 0,
      certificatesValid: 27, certificatesExpired: 3, provisionDays: 0,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Standby Infield 24:00",
      maintenanceRemarks: "-",
      overallRemarks: "All operations normal",
    },
    {
      id: "v11", name: "Dolphin-15", imo: "9574561", master: "Naresh Das",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra WB",
      longitude: 69.5659, latitude: 22.7468, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "07:15",
      speed: 0, course: 0, fuelBalance: 23923, fuelUsed: 878, fuelStart: 24801,
      waterBalance: 38001, dpOpsHrs: "05:30", transitHrs: "00:00", portHrs: "18:30",
      totalOpsHrs: "24:00", crewOnBoard: 13, maintenanceDone: 4, outstandingDefects: 0,
      certificatesValid: 31, certificatesExpired: 0, provisionDays: 16,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at WB, Berthing: 4, Unberthing: 4",
      maintenanceRemarks: "General clean ship, fwd railing chipping and primer touch up",
      overallRemarks: "All operations normal",
    },
    {
      id: "v12", name: "Dolphin-16", imo: "9574585", master: "Bosudeb Mondal",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra RORO Jetty",
      longitude: 69.7054, latitude: 22.7491, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "06:50",
      speed: 0, course: 0, fuelBalance: 23477, fuelUsed: 2360, fuelStart: 25837,
      waterBalance: 18998, dpOpsHrs: "16:18", transitHrs: "00:00", portHrs: "07:42",
      totalOpsHrs: "24:00", crewOnBoard: 14, maintenanceDone: 3, outstandingDefects: 0,
      certificatesValid: 30, certificatesExpired: 0, provisionDays: 7,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at RORO Jetty, Berthing: 5, Unberthing: 4",
      maintenanceRemarks: "M/E T.C filter cloth changed, general cleaning",
      overallRemarks: "All operations normal",
    },
    {
      id: "v13", name: "Dolphin-17", imo: "9574597", master: "Vasudev",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra RORO Jetty",
      longitude: 69.7052, latitude: 22.7489, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "07:30",
      speed: 0, course: 0, fuelBalance: 30053, fuelUsed: 2, fuelStart: 30055,
      waterBalance: 31, dpOpsHrs: "12:36", transitHrs: "00:00", portHrs: "11:24",
      totalOpsHrs: "24:00", crewOnBoard: 12, maintenanceDone: 2, outstandingDefects: 0,
      certificatesValid: 34, certificatesExpired: 0, provisionDays: 18,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at RORO, Berthing: 3, Unberthing: 2",
      maintenanceRemarks: "Engine room maintenance, T/C filter changed",
      overallRemarks: "All operations normal",
    },
    {
      id: "v14", name: "Dolphin-18", imo: "9606364", master: "Satya Narayan Bera",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra RORO",
      longitude: 69.5660, latitude: 22.7472, status: "warning", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "06:55",
      speed: 0, course: 0, fuelBalance: 16236, fuelUsed: 2713, fuelStart: 18949,
      waterBalance: 34, dpOpsHrs: "15:07", transitHrs: "00:00", portHrs: "08:53",
      totalOpsHrs: "24:00", crewOnBoard: 13, maintenanceDone: 3, outstandingDefects: 0,
      certificatesValid: 33, certificatesExpired: 0, provisionDays: 11,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at RORO, Sailing/Unberthing/Berthing ops",
      maintenanceRemarks: "New towing rope installed, sea suction strainer cleaning",
      overallRemarks: "Monitor fuel levels - below 20k threshold",
    },
    {
      id: "v15", name: "Dolphin-23", imo: "9644873", master: "Ravikant Kumar",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Hazira CB2",
      longitude: 72.6324, latitude: 21.0498, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "07:10",
      speed: 0, course: 0, fuelBalance: 42823, fuelUsed: 1226, fuelStart: 44049,
      waterBalance: 27997, dpOpsHrs: "02:00", transitHrs: "00:00", portHrs: "22:00",
      totalOpsHrs: "24:00", crewOnBoard: 12, maintenanceDone: 4, outstandingDefects: 0,
      certificatesValid: 35, certificatesExpired: 0, provisionDays: 15,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at CB2, deck washing and winch painting",
      maintenanceRemarks: "Deck washing, fwd winch painting, mushroom vents greased",
      overallRemarks: "All operations normal",
    },
    {
      id: "v16", name: "Dolphin-30", imo: "9891268", master: "Sahadeb Mondal",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Kandla Port",
      longitude: 70.2309, latitude: 22.9752, status: "warning", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "05-Apr-2026", reportTime: "06:40",
      speed: 0, course: 0, fuelBalance: 18200, fuelUsed: 2536, fuelStart: 20736,
      waterBalance: 40, dpOpsHrs: "11:18", transitHrs: "00:00", portHrs: "12:42",
      totalOpsHrs: "24:00", crewOnBoard: 11, maintenanceDone: 5, outstandingDefects: 0,
      certificatesValid: 34, certificatesExpired: 0, provisionDays: 19,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at Kandla Port, Berthing: 2, Unberthing: 2",
      maintenanceRemarks: "Turbo charger maintenance",
      overallRemarks: "Monitor fuel levels - below 20k threshold",
    },
    {
      id: "v17", name: "Dolphin-37", imo: "9909302", master: "Shaikh Saifuddin",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra RORO Jetty",
      longitude: 69.7053, latitude: 22.7388, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "07:20",
      speed: 0, course: 0, fuelBalance: 36996, fuelUsed: 2553, fuelStart: 39549,
      waterBalance: 30, dpOpsHrs: "16:24", transitHrs: "00:00", portHrs: "07:36",
      totalOpsHrs: "24:00", crewOnBoard: 13, maintenanceDone: 2, outstandingDefects: 0,
      certificatesValid: 32, certificatesExpired: 0, provisionDays: 13,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at RORO Jetty, Berthing: 4, Unberthing: 3",
      maintenanceRemarks: "Fuel system cleaning",
      overallRemarks: "All operations normal",
    },
    {
      id: "v18", name: "Dolphin-42", imo: "9778210", master: "Ramadhar Kumar Pal",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra HMEL SPM",
      longitude: 69.6196, latitude: 22.6829, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "06:35",
      speed: 0, course: 0, fuelBalance: 56371, fuelUsed: 3127, fuelStart: 59498,
      waterBalance: 19, dpOpsHrs: "17:00", transitHrs: "00:00", portHrs: "07:00",
      totalOpsHrs: "24:00", crewOnBoard: 12, maintenanceDone: 3, outstandingDefects: 0,
      certificatesValid: 33, certificatesExpired: 0, provisionDays: 9,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at HMEL SPM, Berthing: 3, Unberthing: 2",
      maintenanceRemarks: "Cooling system maintenance",
      overallRemarks: "All operations normal",
    },
    {
      id: "v19", name: "B1-Brahmani", imo: "9572800", master: "Bidya Shankar Chaudhry",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra Ro Ro Jetty",
      longitude: 69.7120, latitude: 22.7458, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "07:00",
      speed: 0, course: 0, fuelBalance: 50004, fuelUsed: 519, fuelStart: 50523,
      waterBalance: 38000, dpOpsHrs: "04:55", transitHrs: "00:00", portHrs: "19:05",
      totalOpsHrs: "24:00", crewOnBoard: 14, maintenanceDone: 4, outstandingDefects: 0,
      certificatesValid: 31, certificatesExpired: 0, provisionDays: 6,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at Ro Ro Jetty, Berthing: 6, Unberthing: 5",
      maintenanceRemarks: "Electrical system check",
      overallRemarks: "All operations normal",
    },
    {
      id: "v20", name: "B3-Baitarani", imo: "9572812", master: "Ganesh Kumar Singh",
      company: "SSIDL", fleet: "SSIDL Fleet", location: "Mundra WB Tug Berth",
      longitude: 69.5660, latitude: 22.7472, status: "normal", hiringStatus: "ON-Hire",
      client: "SSIDL", reportDate: "05-Apr-2026", reportTime: "06:50",
      speed: 0, course: 0, fuelBalance: 31573, fuelUsed: 244, fuelStart: 31817,
      waterBalance: 43, dpOpsHrs: "01:04", transitHrs: "00:00", portHrs: "22:56",
      totalOpsHrs: "24:00", crewOnBoard: 14, maintenanceDone: 3, outstandingDefects: 0,
      certificatesValid: 29, certificatesExpired: 0, provisionDays: 4,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "DP Operations at WB Tug Berth",
      maintenanceRemarks: "Deck machinery overhaul",
      overallRemarks: "Low provisions - resupply requested",
    },
    // === Ocean Sparkle Vessels ===
    {
      id: "v2", name: "Ocean Lancer", imo: "9719604", master: "Mostafijur Rahaman Sapui",
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "Kandla Port",
      longitude: 70.2232, latitude: 23.0113, status: "normal", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "04-Apr-2026", reportTime: "00:00",
      speed: 0, course: 0, fuelBalance: 35817, fuelUsed: 884, fuelStart: 36701,
      waterBalance: 20, dpOpsHrs: "05:30", transitHrs: "00:00", portHrs: "18:30",
      totalOpsHrs: "24:00", crewOnBoard: 11, maintenanceDone: 3, outstandingDefects: 0,
      certificatesValid: 32, certificatesExpired: 0, provisionDays: 15,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "Berthing: 2, Unberthing: 4 at Kandla Port",
      maintenanceRemarks: "Battery inspection completed",
      overallRemarks: "All systems operational",
    },
    {
      id: "v5", name: "Ocean Progress", imo: "9766451", master: "Naresh Mahadev Patil",
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "Kandla Port",
      longitude: 70.2231, latitude: 23.0108, status: "critical", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "04-Apr-2026", reportTime: "00:00",
      speed: 0, course: 0, fuelBalance: 13473, fuelUsed: 940, fuelStart: 14413,
      waterBalance: 8, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "05:30",
      totalOpsHrs: "05:30", crewOnBoard: 10, maintenanceDone: 2, outstandingDefects: 3,
      certificatesValid: 30, certificatesExpired: 1, provisionDays: 5,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Berthing: 3, Unberthing: 2 at Kandla Port",
      maintenanceRemarks: "Main engine port & stbd running at 8.4 hrs",
      overallRemarks: "Low fuel warning - refueling required",
    },
    {
      id: "v21", name: "Ocean Challenger", imo: "9815812", master: "Samim Ahshan Sk",
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "Kandla Port",
      longitude: 70.2231, latitude: 23.0113, status: "normal", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "05-Apr-2026", reportTime: "00:00",
      speed: 0, course: 0, fuelBalance: 36956, fuelUsed: 1206, fuelStart: 38162,
      waterBalance: 14, dpOpsHrs: "05:48", transitHrs: "00:00", portHrs: "18:12",
      totalOpsHrs: "24:00", crewOnBoard: 11, maintenanceDone: 4, outstandingDefects: 0,
      certificatesValid: 33, certificatesExpired: 0, provisionDays: 12,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "Berthing: 4, Unberthing: 3 at Kandla Port",
      maintenanceRemarks: "Hull cleaning scheduled",
      overallRemarks: "All systems operational",
    },
    {
      id: "v22", name: "Ocean Promise", imo: "9464209", master: "Ravi Shankar",
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "Off Paradip",
      longitude: 86.5, latitude: 20.2, status: "normal", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "05-Apr-2026", reportTime: "00:00",
      speed: 0, course: 0, fuelBalance: 28900, fuelUsed: 1850, fuelStart: 30750,
      waterBalance: 16000, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "10:00",
      totalOpsHrs: "10:00", crewOnBoard: 10, maintenanceDone: 2, outstandingDefects: 0,
      certificatesValid: 31, certificatesExpired: 0, provisionDays: 17,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Berthing: 3, Unberthing: 3 at Paradip Port",
      maintenanceRemarks: "Generator oil change completed",
      overallRemarks: "All systems operational",
    },
    {
      id: "v23", name: "Ocean Quest", imo: "9239381", master: "Gopal Krishna",
      company: "Ocean Sparkle", fleet: "Ocean Sparkle Fleet", location: "Off Chennai",
      longitude: 80.3, latitude: 13.1, status: "warning", hiringStatus: "ON-Hire",
      client: "Ocean Sparkle Ltd", reportDate: "05-Apr-2026", reportTime: "00:00",
      speed: 0, course: 0, fuelBalance: 17200, fuelUsed: 2100, fuelStart: 19300,
      waterBalance: 9500, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "07:30",
      totalOpsHrs: "07:30", crewOnBoard: 10, maintenanceDone: 1, outstandingDefects: 1,
      certificatesValid: 28, certificatesExpired: 1, provisionDays: 3,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Berthing: 2, Unberthing: 1 at Chennai Port",
      maintenanceRemarks: "Anchor windlass serviced",
      overallRemarks: "Low provisions - resupply scheduled",
    },
    // === TAHID / Adani Ports Vessels ===
    {
      id: "v3", name: "Zaharat Al Behar", imo: "9581473", master: "Akhilesh Mondal",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "ADS Dock2, Duqm, Oman",
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
      company: "Adani Ports", fleet: "TAHID Fleet", location: "Indian Ocean, en route Capetown",
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
      id: "v6", name: "Tahid Sabarmati", imo: "9960681", master: "Ahmed Abdelaziz",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "Buchanan Port, Liberia",
      longitude: -10.0482, latitude: 5.8539, status: "normal", hiringStatus: "ON-Hire",
      client: "AML", reportDate: "05-Apr-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 35153, fuelUsed: 200, fuelStart: 35353,
      waterBalance: 27000, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 6, maintenanceDone: 12, outstandingDefects: 6,
      certificatesValid: 28, certificatesExpired: 0, provisionDays: 20,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Standby at Buchanan Port, Liberia",
      maintenanceRemarks: "PTO 2 towing winch remote start defect, exhaust temp sensor port ME incorrect, water temp sensors AHU defective, jacket water pipeline stbd ME under warranty",
      overallRemarks: "6 outstanding defects under warranty claims",
    },
    {
      id: "v7", name: "Tahid Ilijan", imo: "1099917", master: "Greg Gregorio",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "Ilijan Batangas, Philippines",
      longitude: 121.0917, latitude: 13.6210, status: "normal", hiringStatus: "ON-Hire",
      client: "LFC", reportDate: "06-Apr-2026", reportTime: "12:01",
      speed: 0, course: 0, fuelBalance: 54676, fuelUsed: 430, fuelStart: 55106,
      waterBalance: 10100, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 8, maintenanceDone: 6, outstandingDefects: 0,
      certificatesValid: 26, certificatesExpired: 1, provisionDays: 0,
      hseToolbox: 0, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "At anchor in Ilijan, tow line ops for LNG Santander Knutsen",
      maintenanceRemarks: "Daily cleaning on bridge, galley, accommodation and main deck",
      overallRemarks: "Vessel at anchor awaiting further instructions",
    },
    {
      id: "v24", name: "Tahid Narmada", imo: "9960679", master: "Sapriyandi Zainal Abidin",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "Dakar Anchorage Area, Senegal",
      longitude: -17.4035, latitude: 14.6864, status: "normal", hiringStatus: "OFF-Hire",
      client: "O3s - Woodside Energies", reportDate: "05-Apr-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 64067, fuelUsed: 285, fuelStart: 64352,
      waterBalance: 53000, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 7, maintenanceDone: 8, outstandingDefects: 3,
      certificatesValid: 30, certificatesExpired: 0, provisionDays: 18,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "Standby at Dakar Anchorage - GTA HUB Senegal",
      maintenanceRemarks: "PT autopilot under warranty claim, fwd PA speaker not operational, tension meter for fwd winch not reading",
      overallRemarks: "3 outstanding defects under warranty claims",
    },
    {
      id: "v25", name: "Ameerat Al Behar", imo: "9581461", master: "Sekh Abdul Halim",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "ADS Duqm, Oman",
      longitude: 57.7207, latitude: 19.6614, status: "normal", hiringStatus: "ON-Hire",
      client: "ADC Duqm Oman", reportDate: "05-Apr-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 44051, fuelUsed: 1123, fuelStart: 45174,
      waterBalance: 28680, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 6, maintenanceDone: 5, outstandingDefects: 0,
      certificatesValid: 32, certificatesExpired: 0, provisionDays: 14,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Standby at ADS Duqm, Oman",
      maintenanceRemarks: "General housekeeping, engine room checks",
      overallRemarks: "All systems normal",
    },
    {
      id: "v26", name: "Dorat Al Behar", imo: "9581459", master: "Kalyan Manna",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "ADC Quay 1, Duqm, Oman",
      longitude: 57.7211, latitude: 19.6617, status: "normal", hiringStatus: "OFF-Hire",
      client: "ADC Duqm Oman", reportDate: "05-Apr-2026", reportTime: "00:01",
      speed: 0, course: 0, fuelBalance: 44761, fuelUsed: 0, fuelStart: 44761,
      waterBalance: 42480, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 6, maintenanceDone: 2, outstandingDefects: 0,
      certificatesValid: 33, certificatesExpired: 0, provisionDays: 10,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "Standby at ADC Quay 1, Duqm, Oman",
      maintenanceRemarks: "Daily cleaning and watch duty",
      overallRemarks: "All systems normal",
    },
    {
      id: "v27", name: "Tahid Dela Paz", imo: "1099890", master: "Efivar Carabuena",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "Dela Paz, Batangas, Philippines",
      longitude: 121.0984, latitude: 13.6221, status: "normal", hiringStatus: "ON-Hire",
      client: "TAHID", reportDate: "06-Apr-2026", reportTime: "12:00",
      speed: 0, course: 0, fuelBalance: 48454, fuelUsed: 988, fuelStart: 49442,
      waterBalance: 15400, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 8, maintenanceDone: 4, outstandingDefects: 0,
      certificatesValid: 29, certificatesExpired: 0, provisionDays: 8,
      hseToolbox: 1, hseDrills: 0, lti: 0, nearMisses: 0,
      lastOps: "At anchor in Dela Paz anchorage",
      maintenanceRemarks: "Deck maintenance and accommodation cleaning",
      overallRemarks: "All systems normal",
    },
    {
      id: "v28", name: "Tahid Mahaweli", imo: "1099905", master: "Vinoth Gunathilaka",
      company: "Adani Ports", fleet: "TAHID Fleet", location: "Colombo, Sri Lanka",
      longitude: 79.8470, latitude: 6.9402, status: "normal", hiringStatus: "ON-Hire",
      client: "SLPA", reportDate: "05-Apr-2026", reportTime: "12:00",
      speed: 0, course: 0, fuelBalance: 74135, fuelUsed: 3349, fuelStart: 77484,
      waterBalance: 34499, dpOpsHrs: "00:00", transitHrs: "00:00", portHrs: "24:00",
      totalOpsHrs: "24:00", crewOnBoard: 7, maintenanceDone: 3, outstandingDefects: 0,
      certificatesValid: 31, certificatesExpired: 0, provisionDays: 12,
      hseToolbox: 1, hseDrills: 1, lti: 0, nearMisses: 0,
      lastOps: "Standby at Colombo Port - SLPA operations",
      maintenanceRemarks: "Engine room checks, fuel line inspection",
      overallRemarks: "All systems normal",
    },
  ];

  const realVesselIds = new Set(realVessels.map(v => v.id));
  vessels.push(...realVessels);

  // Generate ~185 more dummy vessels
  for (let i = 29; i <= 215; i++) {
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
export const realVesselIds = new Set([
  "v1","v2","v3","v4","v5","v6","v7","v8","v9","v10","v11","v12","v13","v14",
  "v15","v16","v17","v18","v19","v20","v21","v22","v23","v24","v25","v26","v27","v28",
]);
export const realVessels = vesselData.filter(v => realVesselIds.has(v.id));

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
