// ── Types ──
export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Record<string, string[]>; // module -> permission keys
  createdAt: string;
  isSystem?: boolean;
}

export interface SAUser {
  id: string;
  name: string;
  email: string;
  username: string;
  designation: string;
  department: string;
  userType: "On-Shore" | "On-Board";
  role: string;
  company: string;
  country: string;
  status: "active" | "inactive" | "suspended";
  assignedVessels: string[];
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

export interface Vessel {
  id: string;
  name: string;
  shortName: string;
  imo: string;
  callSign: string;
  officialNo: string;
  mmsi: string;
  portOfRegistry: string;
  type: string;
  company: string;
  flag: string;
  nationality: string;
  fuelType: string;
  lengthOverall: string;
  lengthPerpendicular: string;
  deckMainArea: string;
  deckArea: string;
  designDraft: string;
  deadWeight: string;
  grossTonnage: string;
  netTonnage: string;
  cargoDeckArea: string;
  deckStrength: string;
  vesselEmail: string;
  status: "active" | "laid-up" | "dry-dock";
  crew: number;
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
  country: string;
  fiscalStartMonth: string;
  yearPrefixFormat: string;
  controllingScope: string;
  companyColor: string;
  vesselCount: number;
  userCount: number;
  status: "active" | "inactive";
}

// ── Permission modules ──
export const permissionModules: Record<string, { label: string; permissions: { key: string; label: string }[] }> = {
  dashboard: {
    label: "Dashboard",
    permissions: [
      { key: "pdf_info", label: "PDF & Info" },
      { key: "weather", label: "Weather Status" },
      { key: "consumable", label: "Consumable Status" },
      { key: "crew_list", label: "Crew List" },
      { key: "tender_tracker", label: "Tender Tracker Status" },
      { key: "requisition_overall", label: "Requisition Overall Status" },
      { key: "requisition", label: "Requisition Status" },
      { key: "maintenance", label: "Maintenance Status" },
      { key: "work_done", label: "Work Done Status" },
      { key: "safety_drills", label: "Safety Drills" },
      { key: "qhse", label: "QHSE" },
      { key: "certificates", label: "Certificates" },
      { key: "basic_info_maps", label: "Basic Info & Maps" },
      { key: "global_dashboard", label: "Global Dashboard" },
    ],
  },
  documents: {
    label: "Documents",
    permissions: [
      { key: "company_docs", label: "Company Documents" },
      { key: "vessel_certs", label: "Vessel Certificates" },
      { key: "circulars", label: "Circulars & Tips" },
      { key: "manuals", label: "Manuals" },
      { key: "legacy", label: "Legacy Data" },
      { key: "msds", label: "MSDS Register" },
      { key: "technical", label: "Technical / Manuals" },
      { key: "financial", label: "Financial" },
      { key: "dry_dock", label: "Dry Dock" },
      { key: "nav_comm", label: "Nav Comm" },
      { key: "statutory", label: "Statutory Compliance" },
      { key: "survey_docs", label: "Survey Documents" },
    ],
  },
  reports: {
    label: "Reports",
    permissions: [
      { key: "vdr", label: "VDR" },
      { key: "rest_hours", label: "Rest Hours" },
      { key: "drills", label: "Drills" },
      { key: "checklist_forms", label: "Checklist Forms" },
      { key: "hseq_kpi", label: "HSEQ Monthly KPIs" },
    ],
  },
  procurement: {
    label: "Procurement",
    permissions: [
      { key: "requisitions", label: "Requisitions" },
      { key: "purchase_orders", label: "Purchase Orders" },
      { key: "vendor_mgmt", label: "Vendor Management" },
      { key: "budgets", label: "Budgets" },
    ],
  },
  pms: {
    label: "PMS",
    permissions: [
      { key: "maintenance_plan", label: "Maintenance Plan" },
      { key: "work_orders", label: "Work Orders" },
      { key: "spare_parts", label: "Spare Parts" },
      { key: "survey_planner", label: "Survey Planner" },
    ],
  },
  crewing: {
    label: "Crewing",
    permissions: [
      { key: "crew_mgmt", label: "Crew Management" },
      { key: "payroll", label: "Payroll" },
      { key: "training", label: "Training & Certificates" },
      { key: "appraisals", label: "Appraisals" },
    ],
  },
  vessel: {
    label: "Vessel",
    permissions: [
      { key: "fleet_overview", label: "Fleet Overview" },
      { key: "iot_sensors", label: "IoT Sensors" },
      { key: "emissions", label: "Emissions Tracker" },
      { key: "voyage_reports", label: "Voyage Reports" },
    ],
  },
  admin: {
    label: "Admin",
    permissions: [
      { key: "user_mgmt", label: "User Management" },
      { key: "settings", label: "Settings" },
      { key: "audit_log", label: "Audit Log" },
    ],
  },
};

// ── Mock data ──
export const mockRoles: Role[] = [
  {
    id: "r1", name: "Admin", description: "Full system access with all permissions", userCount: 3,
    permissions: Object.fromEntries(Object.entries(permissionModules).map(([k, v]) => [k, v.permissions.map(p => p.key)])),
    createdAt: "2025-01-15", isSystem: true,
  },
  {
    id: "r2", name: "Fleet Manager", description: "Manages fleet operations, vessels and crew", userCount: 5,
    permissions: { dashboard: ["pdf_info", "weather", "crew_list", "global_dashboard"], vessel: ["fleet_overview", "iot_sensors", "emissions", "voyage_reports"], crewing: ["crew_mgmt", "payroll"] },
    createdAt: "2025-02-10",
  },
  {
    id: "r3", name: "Vessel Master", description: "On-board vessel operations and reporting", userCount: 12,
    permissions: { dashboard: ["pdf_info", "weather", "consumable", "crew_list", "safety_drills"], reports: ["vdr", "rest_hours", "drills", "checklist_forms"], documents: ["manuals", "vessel_certs"] },
    createdAt: "2025-02-10",
  },
  {
    id: "r4", name: "Procurement Officer", description: "Handles purchasing and vendor relations", userCount: 4,
    permissions: { procurement: ["requisitions", "purchase_orders", "vendor_mgmt", "budgets"], dashboard: ["requisition", "requisition_overall", "tender_tracker"] },
    createdAt: "2025-03-01",
  },
  {
    id: "r5", name: "Crew Manager", description: "Manages crew payroll and HR operations", userCount: 3,
    permissions: { crewing: ["crew_mgmt", "payroll", "training", "appraisals"], dashboard: ["crew_list"] },
    createdAt: "2025-03-15",
  },
  {
    id: "r6", name: "Viewer", description: "Read-only access to dashboards and reports", userCount: 8,
    permissions: { dashboard: ["pdf_info", "weather", "global_dashboard"], reports: ["vdr", "rest_hours"] },
    createdAt: "2025-04-01", isSystem: true,
  },
];

export const mockCompanies: Company[] = [
  { id: "c1", name: "Khimji's Sparkle Marine Services. SAOC", shortName: "KSMS", country: "Oman", fiscalStartMonth: "Jan", yearPrefixFormat: "None", controllingScope: "Vessel wise controlling", companyColor: "#1a365d", vesselCount: 3, userCount: 12, status: "active" },
  { id: "c2", name: "The Adani Harbour International DMCC", shortName: "AHID", country: "UAE", fiscalStartMonth: "Apr", yearPrefixFormat: "FY", controllingScope: "Vessel wise controlling", companyColor: "#2d3748", vesselCount: 4, userCount: 18, status: "active" },
  { id: "c3", name: "Trident Maritime Corporation", shortName: "TMC", country: "India", fiscalStartMonth: "Apr", yearPrefixFormat: "None", controllingScope: "Company wise controlling", companyColor: "#1e40af", vesselCount: 2, userCount: 8, status: "active" },
  { id: "c4", name: "SLSC", shortName: "SLSC", country: "Sri Lanka", fiscalStartMonth: "Jan", yearPrefixFormat: "None", controllingScope: "Vessel wise controlling", companyColor: "#065f46", vesselCount: 2, userCount: 6, status: "active" },
];

export const mockVessels: Vessel[] = [
  { id: "v1", name: "Ameerat Al Behar", shortName: "AAB", imo: "9876543", callSign: "A5AB1", officialNo: "OM-1234", mmsi: "461000001", portOfRegistry: "Muscat", type: "Bulk Carrier", company: "Khimji's Sparkle Marine Services. SAOC", flag: "Oman", nationality: "Oman", fuelType: "Heavy Fuel Oil (HFO)", lengthOverall: "189.9", lengthPerpendicular: "182.0", deckMainArea: "2400", deckArea: "2200", designDraft: "12.5", deadWeight: "56000", grossTonnage: "32500", netTonnage: "18200", cargoDeckArea: "2100", deckStrength: "15", vesselEmail: "ameerat@ksms.com", status: "active", crew: 22 },
  { id: "v2", name: "Dorat Al Behar", shortName: "DAB", imo: "9876544", callSign: "A5DB2", officialNo: "OM-1235", mmsi: "461000002", portOfRegistry: "Muscat", type: "Tanker", company: "Khimji's Sparkle Marine Services. SAOC", flag: "Oman", nationality: "Oman", fuelType: "Marine Diesel Oil (MDO)", lengthOverall: "174.0", lengthPerpendicular: "166.0", deckMainArea: "2100", deckArea: "1900", designDraft: "11.2", deadWeight: "45000", grossTonnage: "28000", netTonnage: "15500", cargoDeckArea: "1800", deckStrength: "14", vesselEmail: "dorat@ksms.com", status: "active", crew: 20 },
  { id: "v3", name: "Zaharat Al Behar", shortName: "ZAB", imo: "9876545", callSign: "A5ZB3", officialNo: "OM-1236", mmsi: "461000003", portOfRegistry: "Muscat", type: "Container", company: "Khimji's Sparkle Marine Services. SAOC", flag: "Oman", nationality: "Oman", fuelType: "Heavy Fuel Oil (HFO)", lengthOverall: "200.0", lengthPerpendicular: "192.0", deckMainArea: "2800", deckArea: "2500", designDraft: "13.0", deadWeight: "62000", grossTonnage: "38000", netTonnage: "21000", cargoDeckArea: "2400", deckStrength: "18", vesselEmail: "zaharat@ksms.com", status: "dry-dock", crew: 0 },
  { id: "v4", name: "Tahid Mahaweli", shortName: "TM", imo: "9876546", callSign: "4SLM1", officialNo: "SL-5001", mmsi: "417000001", portOfRegistry: "Colombo", type: "Tug", company: "SLSC", flag: "Sri Lanka", nationality: "Sri Lanka", fuelType: "Marine Diesel Oil (MDO)", lengthOverall: "45.0", lengthPerpendicular: "42.0", deckMainArea: "320", deckArea: "280", designDraft: "4.5", deadWeight: "800", grossTonnage: "450", netTonnage: "135", cargoDeckArea: "", deckStrength: "", vesselEmail: "mahaweli@slsc.com", status: "active", crew: 8 },
  { id: "v5", name: "Tug Dolphin #33", shortName: "TD33", imo: "9876547", callSign: "4SLD2", officialNo: "SL-5002", mmsi: "417000002", portOfRegistry: "Colombo", type: "Tug", company: "SLSC", flag: "Sri Lanka", nationality: "Sri Lanka", fuelType: "Marine Diesel Oil (MDO)", lengthOverall: "38.0", lengthPerpendicular: "35.0", deckMainArea: "250", deckArea: "220", designDraft: "3.8", deadWeight: "600", grossTonnage: "350", netTonnage: "105", cargoDeckArea: "", deckStrength: "", vesselEmail: "dolphin33@slsc.com", status: "active", crew: 6 },
  { id: "v6", name: "Tahid Narmada", shortName: "TN", imo: "9876548", callSign: "VTBN1", officialNo: "IN-8001", mmsi: "419000001", portOfRegistry: "Mumbai", type: "Bulk Carrier", company: "The Adani Harbour International DMCC", flag: "India", nationality: "India", fuelType: "Heavy Fuel Oil (HFO)", lengthOverall: "199.9", lengthPerpendicular: "190.0", deckMainArea: "2600", deckArea: "2350", designDraft: "13.2", deadWeight: "58000", grossTonnage: "34000", netTonnage: "19500", cargoDeckArea: "2250", deckStrength: "16", vesselEmail: "narmada@ahid.com", status: "active", crew: 24 },
  { id: "v7", name: "Tahid Sabarmati", shortName: "TS", imo: "9876549", callSign: "VTBS2", officialNo: "IN-8002", mmsi: "419000002", portOfRegistry: "Mumbai", type: "Tanker", company: "The Adani Harbour International DMCC", flag: "India", nationality: "India", fuelType: "Marine Diesel Oil (MDO)", lengthOverall: "183.0", lengthPerpendicular: "175.0", deckMainArea: "2200", deckArea: "2000", designDraft: "11.8", deadWeight: "48000", grossTonnage: "30000", netTonnage: "16800", cargoDeckArea: "1900", deckStrength: "14", vesselEmail: "sabarmati@ahid.com", status: "active", crew: 22 },
  { id: "v8", name: "Tahid Verde Island", shortName: "TVI", imo: "9876550", callSign: "3FVI3", officialNo: "PA-3001", mmsi: "352000001", portOfRegistry: "Panama City", type: "Container", company: "The Adani Harbour International DMCC", flag: "Panama", nationality: "India", fuelType: "Very Low Sulphur Fuel Oil (VLSFO)", lengthOverall: "210.0", lengthPerpendicular: "200.0", deckMainArea: "3000", deckArea: "2700", designDraft: "13.5", deadWeight: "65000", grossTonnage: "42000", netTonnage: "23500", cargoDeckArea: "2600", deckStrength: "20", vesselEmail: "verde@ahid.com", status: "active", crew: 25 },
  { id: "v9", name: "Dubai Office", shortName: "DXB", imo: "N/A", callSign: "", officialNo: "", mmsi: "", portOfRegistry: "", type: "Shore Office", company: "The Adani Harbour International DMCC", flag: "UAE", nationality: "UAE", fuelType: "", lengthOverall: "", lengthPerpendicular: "", deckMainArea: "", deckArea: "", designDraft: "", deadWeight: "", grossTonnage: "", netTonnage: "", cargoDeckArea: "", deckStrength: "", vesselEmail: "office@ahid.com", status: "active", crew: 0 },
  { id: "v10", name: "Tahid Dela Paz", shortName: "TDP", imo: "9876551", callSign: "DUP1", officialNo: "PH-2001", mmsi: "548000001", portOfRegistry: "Manila", type: "Bulk Carrier", company: "Trident Maritime Corporation", flag: "Philippines", nationality: "Philippines", fuelType: "Heavy Fuel Oil (HFO)", lengthOverall: "185.0", lengthPerpendicular: "177.0", deckMainArea: "2300", deckArea: "2100", designDraft: "12.0", deadWeight: "52000", grossTonnage: "30500", netTonnage: "17000", cargoDeckArea: "2000", deckStrength: "15", vesselEmail: "delapaz@tmc.com", status: "active", crew: 21 },
  { id: "v11", name: "Tahid Ilijan", shortName: "TI", imo: "9876552", callSign: "DUI2", officialNo: "PH-2002", mmsi: "548000002", portOfRegistry: "Manila", type: "Tanker", company: "Trident Maritime Corporation", flag: "Philippines", nationality: "Philippines", fuelType: "Marine Diesel Oil (MDO)", lengthOverall: "170.0", lengthPerpendicular: "162.0", deckMainArea: "2000", deckArea: "1800", designDraft: "10.8", deadWeight: "42000", grossTonnage: "26000", netTonnage: "14500", cargoDeckArea: "1700", deckStrength: "13", vesselEmail: "ilijan@tmc.com", status: "laid-up", crew: 0 },
];

export const vesselTypes = [
  "Bulk Carrier", "Tanker", "Container", "Tug", "MPSV", "AHTS", "PSV", "Barge",
  "General Cargo", "Ro-Ro", "LPG Carrier", "LNG Carrier", "Chemical Tanker", "Shore Office",
];

export const flags = [
  "India", "Oman", "UAE", "Sri Lanka", "Philippines", "Panama", "Marshall Islands",
  "Liberia", "Singapore", "Hong Kong", "Malta", "Bahamas", "Cyprus", "Greece",
];

export const fuelTypes = [
  "Heavy Fuel Oil (HFO)", "Marine Diesel Oil (MDO)", "Marine Gas Oil (MGO)",
  "Very Low Sulphur Fuel Oil (VLSFO)", "LNG", "Methanol", "Biofuel",
];

export const mockSAUsers: SAUser[] = [
  { id: "u1", name: "Salim Mohammed Salmeen Al Alawi", email: "salim@ksms.com", username: "salim.alawi", designation: "Director", department: "Directors", userType: "On-Shore", role: "Admin", company: "Khimji's Sparkle Marine Services. SAOC", country: "Oman", status: "active", assignedVessels: ["v1", "v2", "v3"], lastLogin: "2026-04-01T08:30:00", createdAt: "2025-01-15" },
  { id: "u2", name: "Rajesh Kumar", email: "rajesh@ahid.com", username: "rajesh.k", designation: "Fleet Manager", department: "Operations", userType: "On-Shore", role: "Fleet Manager", company: "The Adani Harbour International DMCC", country: "India", status: "active", assignedVessels: ["v6", "v7", "v8", "v9"], lastLogin: "2026-03-31T14:20:00", createdAt: "2025-02-10" },
  { id: "u3", name: "Capt. Ahmed Hassan", email: "ahmed@ksms.com", username: "ahmed.hassan", designation: "Master", department: "Deck", userType: "On-Board", role: "Vessel Master", company: "Khimji's Sparkle Marine Services. SAOC", country: "Egypt", status: "active", assignedVessels: ["v1"], lastLogin: "2026-04-01T06:00:00", createdAt: "2025-02-15" },
  { id: "u4", name: "Maria Santos", email: "maria@tmc.com", username: "maria.s", designation: "Procurement Head", department: "Procurement", userType: "On-Shore", role: "Procurement Officer", company: "Trident Maritime Corporation", country: "Philippines", status: "active", assignedVessels: ["v10", "v11"], lastLogin: "2026-03-30T10:15:00", createdAt: "2025-03-01" },
  { id: "u5", name: "Vikram Patel", email: "vikram@ahid.com", username: "vikram.p", designation: "Crew Manager", department: "Crewing", userType: "On-Shore", role: "Crew Manager", company: "The Adani Harbour International DMCC", country: "India", status: "active", assignedVessels: ["v6", "v7", "v8"], lastLogin: "2026-03-29T16:45:00", createdAt: "2025-03-15" },
  { id: "u6", name: "Capt. John De Silva", email: "john@slsc.com", username: "john.ds", designation: "Master", department: "Deck", userType: "On-Board", role: "Vessel Master", company: "SLSC", country: "Sri Lanka", status: "active", assignedVessels: ["v4"], lastLogin: "2026-04-01T05:30:00", createdAt: "2025-04-01" },
  { id: "u7", name: "Fatima Al Rashid", email: "fatima@ksms.com", username: "fatima.r", designation: "HR Officer", department: "HR", userType: "On-Shore", role: "Viewer", company: "Khimji's Sparkle Marine Services. SAOC", country: "Oman", status: "inactive", assignedVessels: [], lastLogin: "2026-02-15T09:00:00", createdAt: "2025-05-01" },
  { id: "u8", name: "Chen Wei", email: "chen@tmc.com", username: "chen.w", designation: "Chief Engineer", department: "Engine", userType: "On-Board", role: "Vessel Master", company: "Trident Maritime Corporation", country: "China", status: "active", assignedVessels: ["v10"], lastLogin: "2026-03-31T07:00:00", createdAt: "2025-05-15" },
];

export const designations = [
  "Director", "CEO", "COO", "CFO", "Fleet Manager", "Operations Manager",
  "Procurement Head", "Procurement Officer", "Crew Manager", "HR Officer",
  "Client Support", "Technical Superintendent", "QHSE Manager",
  "Master", "Chief Officer", "2nd Officer", "3rd Officer", "Bosun",
  "Chief Engineer", "2nd Engineer", "3rd Engineer", "4th Engineer",
  "Electrical Officer", "Fitter", "AB Seaman", "OS Seaman",
  "Chief Cook", "Messman",
];

export const departments = [
  "Directors", "Operations", "Procurement", "Crewing", "HR", "Technical",
  "QHSE", "Finance", "IT", "Deck", "Engine", "Catering",
];

export const countries = [
  "India", "Oman", "UAE", "Sri Lanka", "Philippines", "Egypt", "China",
  "Bangladesh", "Myanmar", "Indonesia", "Pakistan", "Nepal",
];
