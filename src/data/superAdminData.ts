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
  imo: string;
  type: string;
  company: string;
  flag: string;
  status: "active" | "laid-up" | "dry-dock";
  crew: number;
}

export interface Company {
  id: string;
  name: string;
  shortName: string;
  country: string;
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
  { id: "c1", name: "Khimji's Sparkle Marine Services. SAOC", shortName: "KSMS", country: "Oman", vesselCount: 3, userCount: 12, status: "active" },
  { id: "c2", name: "The Adani Harbour International DMCC", shortName: "AHID", country: "UAE", vesselCount: 4, userCount: 18, status: "active" },
  { id: "c3", name: "Trident Maritime Corporation", shortName: "TMC", country: "India", vesselCount: 2, userCount: 8, status: "active" },
  { id: "c4", name: "SLSC", shortName: "SLSC", country: "Sri Lanka", vesselCount: 2, userCount: 6, status: "active" },
];

export const mockVessels: Vessel[] = [
  { id: "v1", name: "Ameerat Al Behar", imo: "9876543", type: "Bulk Carrier", company: "Khimji's Sparkle Marine Services. SAOC", flag: "Oman", status: "active", crew: 22 },
  { id: "v2", name: "Dorat Al Behar", imo: "9876544", type: "Tanker", company: "Khimji's Sparkle Marine Services. SAOC", flag: "Oman", status: "active", crew: 20 },
  { id: "v3", name: "Zaharat Al Behar", imo: "9876545", type: "Container", company: "Khimji's Sparkle Marine Services. SAOC", flag: "Oman", status: "dry-dock", crew: 0 },
  { id: "v4", name: "Tahid Mahaweli", imo: "9876546", type: "Tug", company: "SLSC", flag: "Sri Lanka", status: "active", crew: 8 },
  { id: "v5", name: "Tug Dolphin #33", imo: "9876547", type: "Tug", company: "SLSC", flag: "Sri Lanka", status: "active", crew: 6 },
  { id: "v6", name: "Tahid Narmada", imo: "9876548", type: "Bulk Carrier", company: "The Adani Harbour International DMCC", flag: "India", status: "active", crew: 24 },
  { id: "v7", name: "Tahid Sabarmati", imo: "9876549", type: "Tanker", company: "The Adani Harbour International DMCC", flag: "India", status: "active", crew: 22 },
  { id: "v8", name: "Tahid Verde Island", imo: "9876550", type: "Container", company: "The Adani Harbour International DMCC", flag: "Panama", status: "active", crew: 25 },
  { id: "v9", name: "Dubai Office", imo: "N/A", type: "Shore Office", company: "The Adani Harbour International DMCC", flag: "UAE", status: "active", crew: 0 },
  { id: "v10", name: "Tahid Dela Paz", imo: "9876551", type: "Bulk Carrier", company: "Trident Maritime Corporation", flag: "Philippines", status: "active", crew: 21 },
  { id: "v11", name: "Tahid Ilijan", imo: "9876552", type: "Tanker", company: "Trident Maritime Corporation", flag: "Philippines", status: "laid-up", crew: 0 },
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
