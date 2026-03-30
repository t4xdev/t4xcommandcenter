import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import t4xLogo from "@/assets/t4x_logo.png";
import {
  Users, UserPlus, Search, ChevronRight, ChevronLeft, Edit2, X, Check,
  Calendar, CreditCard, IndianRupee, FileText, AlertTriangle, Plus,
  Wallet, Bell, User, Award, Upload, Download, Clock, Shield, Receipt,
  Landmark, BarChart3, Settings, HelpCircle, CheckSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Types ───
interface Employee {
  id: string; employeeId: string; firstName: string; middleName?: string; lastName: string;
  email: string; mobile?: string; gender: "Male" | "Female" | "Other";
  dateOfJoining: string; designation: string; department: string; workLocation: string;
  status: "Active" | "Inactive" | "On Leave"; portalAccess: boolean;
  employmentType: "shore" | "seafarer"; rank?: string; vessel?: string; contractPeriod?: string;
  dob?: string; fatherName?: string; pan?: string; personalEmail?: string;
  address?: { line1: string; line2?: string; city: string; state: string; pin: string };
  epf: boolean; esi: boolean; lwf: boolean; pfAccountNumber?: string; uan?: string;
  annualCTC: number;
  salaryComponents: { name: string; type: string; monthlyAmount: number; annualAmount: number }[];
  bankName?: string; accountNumber?: string; ifsc?: string; accountType?: "Current" | "Savings";
  accountHolderName?: string; paymentMode: "Bank Transfer" | "Cheque" | "Cash";
  certificates?: { name: string; number: string; issueDate: string; expiryDate: string; status: "Valid" | "Expiring" | "Expired" }[];
}

// ─── Mock Data ───
const mockEmployees: Employee[] = [
  {
    id: "1", employeeId: "EMP001", firstName: "Rajesh", middleName: "Kumar", lastName: "Sharma",
    email: "rajesh.sharma@company.com", mobile: "+91 98765 43210", gender: "Male",
    dateOfJoining: "15/01/2022", designation: "Chief Engineer", department: "Engineering",
    workLocation: "Vessel - MV Dolphin 7", status: "Active", portalAccess: true,
    employmentType: "seafarer", rank: "Chief Engineer", vessel: "MV Dolphin 7", contractPeriod: "01/2022 - 12/2024",
    dob: "12/05/1985", fatherName: "Suresh Sharma", pan: "ABCDE1234F",
    epf: true, esi: false, lwf: true, pfAccountNumber: "MH/BOM/12345/678", uan: "100987654321",
    annualCTC: 1800000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 75000, annualAmount: 900000 },
      { name: "HRA", type: "% of Basic", monthlyAmount: 37500, annualAmount: 450000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 37500, annualAmount: 450000 },
    ],
    bankName: "State Bank of India", accountNumber: "XXXX6789", ifsc: "SBIN0001234",
    accountType: "Savings", accountHolderName: "Rajesh Kumar Sharma", paymentMode: "Bank Transfer",
    certificates: [
      { name: "Certificate of Competency", number: "COC-2019-4567", issueDate: "15/03/2019", expiryDate: "14/03/2025", status: "Expiring" },
      { name: "STCW Certificate", number: "STCW-2020-1234", issueDate: "01/06/2020", expiryDate: "31/05/2026", status: "Valid" },
      { name: "Medical Fitness", number: "MED-2024-8901", issueDate: "10/01/2024", expiryDate: "09/01/2026", status: "Valid" },
    ],
  },
  {
    id: "2", employeeId: "EMP002", firstName: "Priya", lastName: "Patel",
    email: "priya.patel@company.com", mobile: "+91 87654 32109", gender: "Female",
    dateOfJoining: "01/03/2023", designation: "Navigation Officer", department: "Operations",
    workLocation: "Vessel - MV Baitarani", status: "Active", portalAccess: true,
    employmentType: "seafarer", rank: "2nd Officer", vessel: "MV Baitarani",
    epf: true, esi: true, lwf: false, annualCTC: 1200000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 50000, annualAmount: 600000 },
      { name: "HRA", type: "% of Basic", monthlyAmount: 25000, annualAmount: 300000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 25000, annualAmount: 300000 },
    ],
    bankName: "HDFC Bank", accountNumber: "XXXX4567", ifsc: "HDFC0005678",
    accountType: "Savings", accountHolderName: "Priya Patel", paymentMode: "Bank Transfer",
    certificates: [
      { name: "Certificate of Competency", number: "COC-2021-7890", issueDate: "10/02/2021", expiryDate: "09/02/2027", status: "Valid" },
      { name: "GMDSS Certificate", number: "GMDSS-2022-3456", issueDate: "15/08/2022", expiryDate: "14/08/2027", status: "Valid" },
    ],
  },
  {
    id: "3", employeeId: "EMP003", firstName: "Arun", lastName: "Nair",
    email: "arun.nair@company.com", gender: "Male",
    dateOfJoining: "10/06/2021", designation: "Deck Officer", department: "Operations",
    workLocation: "Head Office - Mumbai", status: "On Leave", portalAccess: false,
    employmentType: "seafarer", rank: "3rd Officer",
    epf: true, esi: false, lwf: true, annualCTC: 960000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 40000, annualAmount: 480000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 40000, annualAmount: 480000 },
    ],
    bankName: "ICICI Bank", accountNumber: "XXXX8901", ifsc: "ICIC0002345",
    accountType: "Current", accountHolderName: "Arun Nair", paymentMode: "Bank Transfer",
    certificates: [
      { name: "Medical Fitness", number: "MED-2023-5678", issueDate: "05/04/2023", expiryDate: "04/04/2025", status: "Expired" },
    ],
  },
  {
    id: "4", employeeId: "EMP004", firstName: "Sunita", lastName: "Reddy",
    email: "sunita.reddy@company.com", mobile: "+91 76543 21098", gender: "Female",
    dateOfJoining: "20/09/2020", designation: "Safety Officer", department: "QHSE",
    workLocation: "Vessel - MV Kaveri", status: "Active", portalAccess: true,
    employmentType: "seafarer", rank: "Safety Officer", vessel: "MV Kaveri",
    epf: true, esi: true, lwf: true, annualCTC: 1500000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 62500, annualAmount: 750000 },
      { name: "HRA", type: "% of Basic", monthlyAmount: 31250, annualAmount: 375000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 31250, annualAmount: 375000 },
    ],
    bankName: "Axis Bank", accountNumber: "XXXX2345", ifsc: "UTIB0003456",
    accountType: "Savings", accountHolderName: "Sunita Reddy", paymentMode: "Bank Transfer",
    certificates: [
      { name: "STCW Certificate", number: "STCW-2020-9999", issueDate: "20/09/2020", expiryDate: "19/09/2025", status: "Expiring" },
      { name: "Certificate of Competency", number: "COC-2018-1111", issueDate: "01/01/2018", expiryDate: "31/12/2027", status: "Valid" },
    ],
  },
  {
    id: "5", employeeId: "EMP005", firstName: "Mohammed", lastName: "Khan",
    email: "mohammed.khan@company.com", mobile: "+91 65432 10987", gender: "Male",
    dateOfJoining: "05/11/2019", designation: "General Manager", department: "Management",
    workLocation: "Head Office - Mumbai", status: "Active", portalAccess: true,
    employmentType: "shore", pan: "KLMNO9012P",
    epf: true, esi: false, lwf: true, annualCTC: 2400000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 100000, annualAmount: 1200000 },
      { name: "HRA", type: "% of Basic", monthlyAmount: 50000, annualAmount: 600000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 50000, annualAmount: 600000 },
    ],
    bankName: "Kotak Bank", accountNumber: "XXXX5678", ifsc: "KKBK0004567",
    accountType: "Savings", accountHolderName: "Mohammed Khan", paymentMode: "Bank Transfer",
  },
  {
    id: "6", employeeId: "EMP006", firstName: "Deepak", lastName: "Verma",
    email: "deepak.verma@company.com", gender: "Male",
    dateOfJoining: "14/02/2024", designation: "Junior Engineer", department: "Engineering",
    workLocation: "Vessel - MV Dolphin 7", status: "Active", portalAccess: false,
    employmentType: "seafarer", rank: "Junior Engineer", vessel: "MV Dolphin 7",
    epf: true, esi: true, lwf: false, annualCTC: 600000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 25000, annualAmount: 300000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 25000, annualAmount: 300000 },
    ],
    paymentMode: "Bank Transfer",
    certificates: [
      { name: "STCW Certificate", number: "STCW-2024-5555", issueDate: "01/02/2024", expiryDate: "31/01/2029", status: "Valid" },
    ],
  },
];

const payrollHistory = [
  { id: "1", date: "27/02/2026", type: "Regular Payroll", details: "01/02/2026 - 28/02/2026", status: "Paid", payrollCost: 1107594.07, netPay: 1050960, employees: 16 },
  { id: "2", date: "27/02/2026", type: "Bulk Final Settlement", details: "01/02/2026 - 28/02/2026", status: "Paid", payrollCost: 245000, netPay: 232000, employees: 3 },
  { id: "3", date: "30/01/2026", type: "Regular Payroll", details: "01/01/2026 - 31/01/2026", status: "Paid", payrollCost: 1085000, netPay: 1028000, employees: 16 },
  { id: "4", date: "31/12/2025", type: "Regular Payroll", details: "01/12/2025 - 31/12/2025", status: "Paid", payrollCost: 1072000, netPay: 1015000, employees: 15 },
  { id: "5", date: "29/12/2025", type: "Final Settlement", details: "01/12/2025 - 29/12/2025\nEmployee: Rajendra Mouli", status: "Paid", payrollCost: 180000, netPay: 165000, employees: 1 },
  { id: "6", date: "28/11/2025", type: "Regular Payroll", details: "01/11/2025 - 30/11/2025", status: "Paid", payrollCost: 1065000, netPay: 1010000, employees: 15 },
];

const payrollCostData = [
  { month: "Apr", cost: 0 }, { month: "May", cost: 0 }, { month: "Jun", cost: 0 },
  { month: "Jul", cost: 0 }, { month: "Aug", cost: 0 }, { month: "Sep", cost: 0 },
  { month: "Oct", cost: 0 }, { month: "Nov", cost: 680000 }, { month: "Dec", cost: 750000 },
  { month: "Jan", cost: 920000 }, { month: "Feb", cost: 1050000 }, { month: "Mar", cost: 1107000 },
];

const departments = ["All", "Engineering", "Operations", "QHSE", "Management"];
const statuses = ["All", "Active", "Inactive", "On Leave"];
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

type SidebarPage = "dashboard" | "employees" | "pay-runs" | "approvals" | "taxes" | "loans" | "reports" | "settings";

const sidebarItems: { id: SidebarPage; label: string; path: string }[] = [
  { id: "dashboard", label: "Dashboard", path: "/payroll" },
  { id: "employees", label: "Employees", path: "/payroll/employees" },
  { id: "pay-runs", label: "Pay Runs", path: "/payroll/pay-runs" },
  { id: "approvals", label: "Approvals", path: "/payroll/approvals" },
  { id: "taxes", label: "Taxes & Forms", path: "/payroll/taxes" },
  { id: "loans", label: "Loans", path: "/payroll/loans" },
  { id: "reports", label: "Reports", path: "/payroll/reports" },
  { id: "settings", label: "Settings", path: "/payroll/settings" },
];

const tip = { backgroundColor: "hsl(0, 0%, 100%)", border: "1px solid hsl(220, 15%, 90%)", borderRadius: "8px", fontSize: "12px", color: "hsl(222, 52%, 15%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT — with its own header & sidebar layout
// ═══════════════════════════════════════════════════════
export default function CrewManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage = (() => {
    const p = location.pathname.replace("/payroll", "").replace(/^\//, "");
    if (!p || p === "") return "dashboard";
    const base = p.split("/")[0];
    return (sidebarItems.find(s => s.id === base)?.id || "dashboard") as SidebarPage;
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — consistent with main dashboard */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={t4xLogo} alt="Twenty4X Logo" className="h-10 w-auto object-contain" />
            <div className="border-l border-border pl-3">
              <h1 className="text-sm font-bold text-foreground">Payroll</h1>
              <p className="text-[10px] text-muted-foreground">Payroll Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors">
              ← Back to Dashboard
            </Link>
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input placeholder="Search in Employee" className="pl-9 pr-3 py-1.5 text-xs border border-border rounded-lg bg-transparent w-56 focus:ring-2 focus:ring-ring outline-none" />
              </div>
            </div>
            <button onClick={() => toast.info("Notifications", { description: "You have 2 pending approvals and 1 certificate expiring soon." })} className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground"><Bell className="w-4 h-4" /><span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" /></button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><User className="w-4 h-4 text-primary-foreground" /></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — text-only, no icons */}
        <aside className="w-48 shrink-0 bg-primary border-r border-primary/80 flex flex-col">
          <div className="px-4 py-4 border-b border-primary-foreground/10">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-bold text-primary-foreground">Payroll</span>
            </div>
          </div>
          <nav className="flex-1 py-2 px-2 space-y-0.5">
            {sidebarItems.map(item => {
              const active = currentPage === item.id;
              return (
                <Link key={item.id} to={item.path}
                  className={`block w-full px-3 py-2 rounded-md text-xs font-medium transition-colors ${active ? "bg-primary-foreground text-primary" : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-primary-foreground/10">
            <button onClick={() => toast.info("Support", { description: "Contact us at support@twenty4x.com or call +91-22-4567-8900." })} className="text-[11px] text-primary-foreground/50 hover:text-primary-foreground/80">Contact Support ›</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index element={<PayrollDashboard employees={employees} />} />
            <Route path="employees" element={<EmployeeList employees={employees} />} />
            <Route path="employees/add" element={<AddEmployeeWizard onSave={emp => { setEmployees(p => [...p, emp]); navigate("/payroll/employees"); }} />} />
            <Route path="employees/:id" element={<EmployeeProfileRoute employees={employees} />} />
            <Route path="pay-runs" element={<PayRunsPage />} />
            <Route path="pay-runs/:id" element={<PayRunDetailRoute />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="taxes" element={<TaxesFormsPage />} />
            <Route path="taxes/:tab" element={<TaxesFormsPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PAYROLL DASHBOARD
// ═══════════════════════════════════════════════════════
function PayrollDashboard({ employees }: { employees: Employee[] }) {
  const activeCount = employees.filter(e => e.status === "Active").length;
  return (
    <div className="space-y-5 animate-fade-in-up">
      <h2 className="text-lg font-bold text-foreground">Welcome!</h2>

      <div className="card-elevated p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Upcoming Payrun</p>
        <div className="rounded-lg border border-border p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-bold text-foreground">Process Pay Run for March 2026</p>
              <Badge variant="secondary" className="text-[10px]">DRAFT</Badge>
            </div>
            <div className="flex items-center gap-6">
              <div><p className="text-[10px] text-primary uppercase font-semibold">Employees' Net Pay</p><p className="text-base font-bold font-mono">{fmt(1173528)}</p></div>
              <div><p className="text-[10px] text-muted-foreground uppercase">Payment Date</p><p className="text-sm font-semibold">31/03/2026</p></div>
              <div><p className="text-[10px] text-muted-foreground uppercase">No. of Employees</p><p className="text-sm font-semibold">16</p></div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Please approve this payroll on or before 31/03/2026.</p>
          </div>
          <Link to="/payroll/pay-runs" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90">View Details</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card-elevated p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-foreground">Benefits and Deductions</p>
            <span className="text-xs text-muted-foreground">Previous Month ▾</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "EPF", value: fmt(49554.07), color: "border-primary/20 bg-primary/5" },
              { label: "ESI", value: "—", color: "border-success/20 bg-success/5" },
              { label: "TDS", value: fmt(0), color: "border-warning/20 bg-warning/5" },
            ].map((item, i) => (
              <div key={i} className={`rounded-lg border p-4 ${item.color}`}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-base font-bold font-mono text-foreground mt-1">{item.value}</p>
                <button onClick={() => toast.info(`${item.label} Details`, { description: `Showing detailed breakdown for ${item.label}. Amount: ${item.value}` })} className="text-[10px] text-primary font-medium mt-2">View Details</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-5 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-bold text-foreground mb-1">Employee Summary</p>
          <p className="text-[10px] text-warning uppercase font-bold tracking-wider">ACTIVE EMPLOYEES</p>
          <p className="text-5xl font-bold text-primary my-3 font-mono">{activeCount}</p>
          <Link to="/payroll/employees" className="text-xs text-primary font-medium hover:underline">View Employees</Link>
        </div>
      </div>

      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-foreground">Payroll Cost Summary</p>
          <span className="text-xs text-muted-foreground">This Year ▾</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={payrollCostData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(220,15%,70%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(220,15%,70%)" tickFormatter={v => v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={tip} formatter={(v: number) => fmt(v)} />
            <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
              {payrollCostData.map((_, i) => <Cell key={i} fill={`hsl(215, 50%, ${i >= 10 ? "23%" : "40%"})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EMPLOYEE LIST
// ═══════════════════════════════════════════════════════
function EmployeeList({ employees }: { employees: Employee[] }) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => employees.filter(e => {
    const q = search.toLowerCase();
    const m = !q || e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q);
    return m && (deptFilter === "All" || e.department === deptFilter) && (statusFilter === "All" || e.status === statusFilter);
  }), [employees, search, deptFilter, statusFilter]);

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Active Employees ▾</h2>
        <Link to="/payroll/employees/add" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90">
          <UserPlus className="w-3.5 h-3.5" /> Add Employee
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search in Employee" className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-transparent focus:ring-2 focus:ring-ring outline-none" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2 text-xs border border-border rounded-lg bg-transparent">
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-xs border border-border rounded-lg bg-transparent">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card-elevated overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider w-8"><input type="checkbox" className="rounded border-border" /></th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Employee Name</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Work Email</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => {
              const fullName = [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(" ");
              const colors = ["bg-primary/20 text-primary", "bg-success/20 text-success", "bg-warning/20 text-warning", "bg-info/20 text-info"];
              const cIdx = emp.firstName.charCodeAt(0) % colors.length;
              return (
                <tr key={emp.id} className="border-b border-border hover:bg-accent/50 cursor-pointer">
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-border" onClick={e => e.stopPropagation()} /></td>
                  <td className="px-4 py-3">
                    <Link to={`/payroll/employees/${emp.id}`} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${colors[cIdx]}`}>{emp.firstName[0]}</div>
                      <div>
                        <p className="font-semibold text-primary hover:underline">{fullName} - {emp.employeeId}</p>
                        <p className="text-[10px] text-muted-foreground">{emp.designation}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3"><Badge variant={emp.employmentType === "seafarer" ? "default" : "secondary"} className="text-[10px]">{emp.employmentType === "seafarer" ? "Seafarer" : "Shore"}</Badge></td>
                  <td className="px-4 py-3 text-primary">{emp.email}</td>
                  <td className="px-4 py-3"><Badge variant={emp.status === "Active" ? "default" : emp.status === "On Leave" ? "secondary" : "destructive"} className="text-[10px]">{emp.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// EMPLOYEE PROFILE ROUTE
// ═══════════════════════════════════════════════════════
function EmployeeProfileRoute({ employees }: { employees: Employee[] }) {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const emp = employees.find(e => e.id === id);
  if (!emp) return <PlaceholderPage title="Employee Not Found" description="The requested employee could not be found." />;
  return <EmployeeProfile employee={emp} />;
}

function EmployeeProfile({ employee }: { employee: Employee }) {
  const [tab, setTab] = useState<"overview" | "salary" | "seafarer" | "investments" | "payslips" | "loans">("overview");
  const fullName = [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(" ");
  const tabs = employee.employmentType === "seafarer"
    ? ["overview", "salary", "seafarer", "investments", "payslips", "loans"] as const
    : ["overview", "salary", "investments", "payslips", "loans"] as const;
  const tabLabels: Record<string, string> = { overview: "Overview", salary: "Salary Details", seafarer: "Seafarer Details", investments: "Investments", payslips: "Payslips & Forms", loans: "Loans" };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="card-elevated p-5">
        <div className="flex items-center gap-4">
          <Link to="/payroll/employees" className="p-1.5 rounded-lg hover:bg-accent"><ChevronLeft className="w-4 h-4" /></Link>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{employee.firstName[0]}</div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">{employee.employeeId} - {fullName}</h2>
              <Badge variant={employee.status === "Active" ? "default" : employee.status === "On Leave" ? "secondary" : "destructive"} className="text-[10px]">{employee.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{employee.designation}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-4 border-b border-border">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tabLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {(!employee.dob || !employee.fatherName) && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-2.5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
          <p className="text-xs text-warning">This employee's profile is incomplete. <button onClick={() => toast.info("Complete Profile", { description: "Navigate to the relevant section to fill in missing details." })} className="font-semibold text-primary hover:underline">Complete now</button></p>
        </div>
      )}

      {tab === "overview" && (
        <div className="space-y-4">
          <InfoSection title="Basic Information" icon={<Edit2 className="w-3.5 h-3.5" />}>
            <InfoGrid items={[
              { label: "Name", value: fullName }, { label: "Work Location", value: employee.workLocation },
              { label: "Email Address", value: employee.email }, { label: "Designation", value: employee.designation },
              { label: "Mobile Number", value: employee.mobile || "—" }, { label: "Departments", value: employee.department },
              { label: "Date of Joining", value: employee.dateOfJoining }, { label: "Portal Access", value: employee.portalAccess ? "✓ Enabled" : "✗ Disabled" },
              { label: "Gender", value: employee.gender }, { label: "Employment Type", value: employee.employmentType === "seafarer" ? "Seafarer" : "Shore Staff" },
            ]} />
          </InfoSection>
          <InfoSection title="Statutory Information" icon={<Edit2 className="w-3.5 h-3.5" />}>
            <InfoGrid items={[
              { label: "EPF", value: employee.epf ? "✓ Enabled" : "✗ Disabled", highlight: !employee.epf },
              { label: "Labour Welfare Fund", value: employee.lwf ? "✓ Enabled" : "✗ Disabled", highlight: !employee.lwf },
              { label: "ESI", value: employee.esi ? "✓ Enabled" : "✗ Disabled", highlight: !employee.esi },
            ]} />
          </InfoSection>
          <InfoSection title="Personal Information">
            <InfoGrid items={[
              { label: "Date of Birth", value: employee.dob || "—" }, { label: "Email Address", value: employee.personalEmail || "—" },
              { label: "Father's Name", value: employee.fatherName || "—" }, { label: "Residential Address", value: employee.address ? `${employee.address.line1}, ${employee.address.city}` : "—" },
              { label: "PAN", value: employee.pan || "—" },
            ]} />
          </InfoSection>
          <InfoSection title="Payment Information" icon={<Edit2 className="w-3.5 h-3.5" />}>
            <InfoGrid items={[
              { label: "Payment Mode", value: employee.paymentMode }, { label: "Bank Name", value: employee.bankName || "—" },
              { label: "Account Number", value: employee.accountNumber || "—" }, { label: "IFSC", value: employee.ifsc || "—" },
              { label: "Account Holder Name", value: employee.accountHolderName || "—" }, { label: "Account Type", value: employee.accountType || "—" },
            ]} />
          </InfoSection>
        </div>
      )}

      {tab === "salary" && (
        <div className="space-y-4">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 mb-3"><h3 className="text-sm font-bold text-foreground">Salary Details</h3><Edit2 className="w-3.5 h-3.5 text-muted-foreground" /></div>
            <div className="flex gap-6 p-4 rounded-lg border border-border bg-muted/30">
              <div><p className="text-[10px] text-primary uppercase font-semibold">Annual CTC</p><p className="text-base font-bold font-mono">{fmt(employee.annualCTC)} per year</p></div>
              <div><p className="text-[10px] text-primary uppercase font-semibold">Monthly CTC</p><p className="text-base font-bold font-mono">{fmt(Math.round(employee.annualCTC / 12))} per month</p></div>
            </div>
          </div>
          <div className="card-elevated p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Salary Structure</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-muted px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Salary Components</span><span className="text-right">Monthly Amount</span><span className="text-right">Annual Amount</span>
              </div>
              <div className="px-4 py-2 border-t border-border">
                <p className="text-xs font-bold text-foreground mb-2">Earnings</p>
                {employee.salaryComponents.map((c, i) => (
                  <div key={i} className="grid grid-cols-3 py-1.5">
                    <span className="text-xs text-primary">{c.name}</span>
                    <span className="text-xs text-right font-mono">{fmt(c.monthlyAmount)}</span>
                    <span className="text-xs text-right font-mono">{fmt(c.annualAmount)}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 px-4 py-2 bg-primary/5 border-t border-border">
                <span className="text-xs font-bold">Cost to Company</span>
                <span className="text-xs font-bold text-right font-mono">{fmt(Math.round(employee.annualCTC / 12))}</span>
                <span className="text-xs font-bold text-right font-mono">{fmt(employee.annualCTC)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "seafarer" && (
        <div className="space-y-4">
          <InfoSection title="Seafarer Details" icon={<Edit2 className="w-3.5 h-3.5" />}>
            <InfoGrid items={[
              { label: "Rank", value: employee.rank || "—" },
              { label: "Current Vessel", value: employee.vessel || "Not Assigned" },
              { label: "Contract Period", value: employee.contractPeriod || "—" },
              { label: "Wage Structure", value: "Rank-linked (Auto)" },
            ]} />
          </InfoSection>
          {employee.certificates && employee.certificates.length > 0 && (
            <div className="card-elevated p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Certificates & Documents</h3>
              <div className="space-y-2">
                {employee.certificates.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">{cert.name}</p>
                        <p className="text-[10px] text-muted-foreground">{cert.number} · Expires: {cert.expiryDate}</p>
                      </div>
                    </div>
                    <Badge variant={cert.status === "Valid" ? "default" : cert.status === "Expiring" ? "secondary" : "destructive"} className="text-[10px]">{cert.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "investments" && (
        <div className="space-y-4">
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">IT Declaration - FY 2025-26</h3>
              <Badge variant="default" className="text-[10px]">Submitted</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { section: "Section 80C", items: [{ name: "PPF", declared: 150000, approved: 150000 }, { name: "ELSS Mutual Funds", declared: 50000, approved: 50000 }, { name: "Life Insurance Premium", declared: 25000, approved: 25000 }] },
                { section: "Section 80D", items: [{ name: "Medical Insurance (Self)", declared: 25000, approved: 25000 }, { name: "Medical Insurance (Parents)", declared: 50000, approved: 50000 }] },
              ].map((sec, si) => (
                <div key={si} className="border border-border rounded-lg p-4">
                  <p className="text-xs font-bold text-foreground mb-3">{sec.section}</p>
                  <div className="space-y-2">
                    {sec.items.map((item, ii) => (
                      <div key={ii} className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{item.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono">{fmt(item.declared)}</span>
                          <Badge variant={item.approved === item.declared ? "default" : "secondary"} className="text-[9px]">Approved</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-foreground">Total Tax Savings Declared</p>
                <p className="text-[10px] text-muted-foreground">Based on approved declarations</p>
              </div>
              <p className="text-base font-bold font-mono text-primary">{fmt(300000)}</p>
            </div>
          </div>
          <div className="card-elevated p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">HRA Exemption</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><p className="text-[10px] text-muted-foreground">Monthly Rent Paid</p><p className="text-xs font-bold font-mono">{fmt(15000)}</p></div>
              <div><p className="text-[10px] text-muted-foreground">HRA Exemption (Annual)</p><p className="text-xs font-bold font-mono">{fmt(180000)}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Landlord PAN</p><p className="text-xs font-bold">ABCDE1234F</p></div>
            </div>
          </div>
        </div>
      )}

      {tab === "payslips" && (
        <div className="space-y-4">
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">Payslips - FY 2025-26</h3>
              <button onClick={() => toast.success("Download Started", { description: "All payslips for FY 2025-26 are being downloaded as a ZIP file." })} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg"><Download className="w-3 h-3" /> Download All</button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="bg-muted border-b border-border">
                  <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Month</th>
                  <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Gross Earnings</th>
                  <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Deductions</th>
                  <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Net Pay</th>
                  <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Paid Days</th>
                  <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr></thead>
                <tbody>
                  {[
                    { month: "Mar 2026", gross: 150000, ded: 18000, net: 132000, days: 31 },
                    { month: "Feb 2026", gross: 150000, ded: 18000, net: 132000, days: 28 },
                    { month: "Jan 2026", gross: 150000, ded: 18000, net: 132000, days: 31 },
                    { month: "Dec 2025", gross: 150000, ded: 18000, net: 132000, days: 31 },
                    { month: "Nov 2025", gross: 150000, ded: 18000, net: 132000, days: 30 },
                    { month: "Oct 2025", gross: 150000, ded: 18000, net: 132000, days: 31 },
                  ].map((ps, i) => (
                    <tr key={i} className="border-b border-border hover:bg-accent/50">
                      <td className="px-4 py-2.5 font-medium text-foreground">{ps.month}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{fmt(ps.gross)}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-destructive">{fmt(ps.ded)}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold">{fmt(ps.net)}</td>
                      <td className="px-4 py-2.5 text-center">{ps.days}</td>
                      <td className="px-4 py-2.5 text-center"><button onClick={() => toast.info("Payslip Preview", { description: `Viewing payslip for ${ps.month}` })} className="text-primary hover:underline">View</button> · <button onClick={() => toast.success("PDF Downloaded", { description: `Payslip PDF for ${ps.month} downloaded.` })} className="text-primary hover:underline">PDF</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-elevated p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Tax Forms</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Form 16 - FY 2024-25", status: "Available", date: "15/06/2025" },
                { name: "Form 16 - FY 2023-24", status: "Available", date: "12/06/2024" },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground">Generated on {f.date}</p>
                    </div>
                  </div>
                  <button onClick={() => toast.success("Downloaded", { description: `${f.name} downloaded successfully.` })} className="flex items-center gap-1 text-xs text-primary font-medium"><Download className="w-3 h-3" /> Download</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "loans" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Employee Loans</h3>
            <button onClick={() => toast.info("Create Loan", { description: "Loan creation form will open. Select employee, loan type, and amount." })} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg"><Plus className="w-3 h-3" /> Create Loan</button>
          </div>
          <div className="card-elevated overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Loan Type</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Loan Amount</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Outstanding</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">EMI</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Tenure</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr></thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 font-medium text-foreground">Salary Advance</td>
                  <td className="px-4 py-2.5 text-right font-mono">{fmt(100000)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{fmt(40000)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{fmt(10000)}</td>
                  <td className="px-4 py-2.5 text-center">10 months</td>
                  <td className="px-4 py-2.5 text-center"><Badge variant="default" className="text-[10px]">Active</Badge></td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 font-medium text-foreground">Personal Loan</td>
                  <td className="px-4 py-2.5 text-right font-mono">{fmt(200000)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{fmt(0)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{fmt(16667)}</td>
                  <td className="px-4 py-2.5 text-center">12 months</td>
                  <td className="px-4 py-2.5 text-center"><Badge variant="secondary" className="text-[10px]">Closed</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PAY RUNS
// ═══════════════════════════════════════════════════════
function PayRunsPage() {
  const [tab, setTab] = useState<"run" | "history">("run");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleProcessPayroll = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success("Payroll Processed", { description: "March 2026 payroll has been submitted for approval." });
    }, 1500);
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center gap-4 border-b border-border pb-3">
        <button onClick={() => setTab("run")} className={`text-sm font-medium pb-2 border-b-2 -mb-[13px] ${tab === "run" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>Run Payroll</button>
        <button onClick={() => setTab("history")} className={`text-sm font-medium pb-2 border-b-2 -mb-[13px] ${tab === "history" ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}>Payroll History</button>
      </div>

      {tab === "run" && (
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-bold text-foreground">Process Pay Run for March 2026</p>
                <Badge variant="secondary" className="text-[10px]">DRAFT</Badge>
              </div>
              <div className="flex items-center gap-6">
                <div><p className="text-[10px] text-primary uppercase font-semibold">Employees' Net Pay</p><p className="text-base font-bold font-mono">{fmt(1173528)}</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase">Payment Date</p><p className="text-sm font-semibold">31/03/2026</p></div>
                <div><p className="text-[10px] text-muted-foreground uppercase">No. of Employees</p><p className="text-sm font-semibold">16</p></div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Please approve this payroll on or before 31/03/2026.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleProcessPayroll} disabled={processing} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50">
                {processing ? "Processing..." : "Process Payroll"}
              </button>
              <button onClick={() => navigate("/payroll/pay-runs/1")} className="px-4 py-2 border border-border text-xs font-medium rounded-lg hover:bg-accent">View Details</button>
            </div>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="card-elevated overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs text-muted-foreground">Payroll Type: All ▾</span>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Payment Date</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Payroll Type</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Details</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Payroll Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollHistory.map(run => (
                <tr key={run.id} className="border-b border-border hover:bg-accent/50 cursor-pointer" onClick={() => navigate(`/payroll/pay-runs/${run.id}`)}>
                  <td className="px-4 py-3 text-foreground">
                    <Link to={`/payroll/pay-runs/${run.id}`} className="hover:underline">{run.date}</Link>
                  </td>
                  <td className="px-4 py-3 text-primary font-medium">{run.type}</td>
                  <td className="px-4 py-3 text-primary">{run.details.split("\n").map((l, i) => <span key={i} className={i > 0 ? "block text-muted-foreground" : ""}>{l}</span>)}</td>
                  <td className="px-4 py-3"><span className="text-success font-medium">{run.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// PAY RUN DETAIL
function PayRunDetailRoute() {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const run = payrollHistory.find(r => r.id === id);
  if (!run) return <PlaceholderPage title="Pay Run Not Found" description="The requested pay run could not be found." />;

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Link to="/payroll/pay-runs" className="p-1.5 rounded-lg hover:bg-accent"><ChevronLeft className="w-4 h-4" /></Link>
        <h2 className="text-lg font-bold text-foreground">{run.type}</h2>
        <Badge className="text-[10px] bg-success/10 text-success border-success/30">{run.status}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card-elevated p-4">
          <p className="text-[10px] text-primary uppercase font-semibold">Period</p>
          <p className="text-xs text-muted-foreground">28 Base Days</p>
          <div className="flex gap-6 mt-2">
            <div><p className="text-base font-bold font-mono">{fmt(run.payrollCost)}</p><p className="text-[9px] text-muted-foreground uppercase">Payroll Cost</p></div>
            <div><p className="text-base font-bold font-mono">{fmt(run.netPay)}</p><p className="text-[9px] text-muted-foreground uppercase">Total Net Pay</p></div>
          </div>
          <button onClick={() => toast.success("Bank Advice Downloaded", { description: "Bank advice file for this pay run has been downloaded." })} className="text-[10px] text-primary font-medium mt-2 flex items-center gap-1"><Download className="w-3 h-3" /> Download Bank Advice</button>
        </div>
        <div className="card-elevated p-4 flex flex-col items-center justify-center text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Pay Day</p>
          <p className="text-3xl font-bold text-foreground">{run.date.split("/")[0]}</p>
          <p className="text-xs text-muted-foreground">{run.date.split("/").slice(1).join("/")}</p>
          <p className="text-xs text-foreground mt-2">{run.employees} Employees</p>
        </div>
        <div className="card-elevated p-4">
          <p className="text-sm font-bold text-foreground mb-2">Taxes & Deductions</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Taxes</span><span className="font-mono">{fmt(0)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Benefits</span><span className="font-mono">{fmt(49554.07)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total Deductions</span><span className="font-mono">{fmt(7080)}</span></div>
          </div>
        </div>
      </div>

      <PayRunDetailTabs run={run} />
    </div>
  );
}

function PayRunDetailTabs({ run }: { run: typeof payrollHistory[0] }) {
  const [activeTab, setActiveTab] = useState<"summary" | "taxes" | "insights">("summary");
  const employees = [
    { name: "Sujit Kumar Jha (0007)", days: 28, net: 90000 },
    { name: "Kajal Shrivas (0003)", days: 28, net: 76400 },
    { name: "Ankita Sharma (0004)", days: 28, net: 17400 },
    { name: "Mandeep Kaur (0005)", days: 28, net: 21000 },
    { name: "Shubham Singh (0006)", days: 28, net: 76400 },
    { name: "Sneha Kanojia (0008)", days: 28, net: 56400 },
  ];

  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-4">
        {([["summary", "Employee Summary"], ["taxes", "Taxes & Deductions"], ["insights", "Overall Insights"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`text-xs font-medium pb-1 border-b-2 ${activeTab === key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{label}</button>
        ))}
      </div>
      {activeTab === "summary" && (
        <table className="w-full text-xs">
          <thead><tr className="bg-muted border-b border-border">
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider w-8"><input type="checkbox" className="rounded border-border" /></th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Employee Name</th>
            <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Paid Days</th>
            <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Net Pay</th>
            <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Payslip</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Payment Mode</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Payment Status</th>
          </tr></thead>
          <tbody>
            {employees.map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-accent/50">
                <td className="px-4 py-2.5"><input type="checkbox" className="rounded border-border" /></td>
                <td className="px-4 py-2.5 text-foreground">{row.name}</td>
                <td className="px-4 py-2.5 text-center">{row.days}</td>
                <td className="px-4 py-2.5 text-right font-mono font-semibold">{fmt(row.net)}</td>
                <td className="px-4 py-2.5 text-center">
                  <button onClick={() => toast.info("Payslip Preview", { description: `Viewing payslip for ${row.name}` })} className="text-primary hover:underline">View</button>
                  {" · "}
                  <button onClick={() => toast.success("Email Sent", { description: `Payslip emailed to ${row.name}` })} className="text-primary hover:underline">📧</button>
                </td>
                <td className="px-4 py-2.5">Manual Bank Transfer</td>
                <td className="px-4 py-2.5 text-success text-[10px]">Paid on {run.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {activeTab === "taxes" && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "Total TDS", value: fmt(0) }, { label: "EPF Contribution", value: fmt(49554.07) }, { label: "ESI Contribution", value: fmt(0) }].map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                <p className="text-base font-bold font-mono text-foreground mt-1">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">TDS</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">EPF (EE)</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">EPF (ER)</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Prof. Tax</th>
              </tr></thead>
              <tbody>
                {employees.slice(0, 4).map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-2.5 text-foreground">{row.name}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(0)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.net * 0.12)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.net * 0.12)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(200)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {activeTab === "insights" && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Total Payroll Cost", value: fmt(run.payrollCost), change: "+2.1% from last month" },
              { label: "Total Net Pay", value: fmt(run.netPay), change: "+1.8% from last month" },
              { label: "Avg. Pay Per Employee", value: fmt(Math.round(run.netPay / run.employees)), change: "Stable" },
              { label: "Total Employees Paid", value: String(run.employees), change: "+1 from last month" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-4">
                <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                <p className="text-lg font-bold font-mono text-foreground mt-1">{item.value}</p>
                <p className="text-[10px] text-primary mt-1">{item.change}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
function TaxesFormsPage() {
  const location = useLocation();
  const tabFromUrl = location.pathname.split("/").pop();
  const [subPage, setSubPage] = useState<string>(["tds", "challans", "form24q", "form16"].includes(tabFromUrl || "") ? tabFromUrl! : "tds");
  const subItems = [
    { id: "tds", label: "TDS Liabilities" },
    { id: "challans", label: "Challans" },
    { id: "form24q", label: "Form 24Q" },
    { id: "form16", label: "Form 16" },
  ];

  return (
    <div className="space-y-5 animate-fade-in-up">
      <h2 className="text-lg font-bold text-foreground">Taxes & Forms</h2>
      <div className="flex items-center gap-1 border-b border-border">
        {subItems.map(s => (
          <Link key={s.id} to={`/payroll/taxes/${s.id}`} onClick={() => setSubPage(s.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 -mb-px ${subPage === s.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {s.label}
          </Link>
        ))}
      </div>

      {subPage === "tds" && (
        <div className="card-elevated p-5">
          <h3 className="text-sm font-bold mb-3">TDS Liabilities Summary</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Month</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">TDS Payable</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">TDS Deposited</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr></thead>
              <tbody>
                {["Feb 2026", "Jan 2026", "Dec 2025", "Nov 2025"].map((m, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-2.5 text-foreground">{m}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(0)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(0)}</td>
                    <td className="px-4 py-2.5 text-center"><Badge variant="default" className="text-[10px]">Filed</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {subPage === "challans" && (
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Challan History</h3>
            <button onClick={() => toast.info("Recording Challan", { description: "Enter BSR code, challan number, and payment details." })} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg"><Plus className="w-3 h-3" /> Record Challan</button>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">BSR Code</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Challan No.</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Date of Payment</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Section</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr></thead>
              <tbody>
                {[
                  { bsr: "0510086", challan: "CHN-20260228-001", date: "28/02/2026", amount: 42500, section: "192", status: "Verified" },
                  { bsr: "0510086", challan: "CHN-20260131-002", date: "31/01/2026", amount: 38000, section: "192", status: "Verified" },
                  { bsr: "0510086", challan: "CHN-20251231-003", date: "31/12/2025", amount: 35600, section: "192", status: "Verified" },
                  { bsr: "0510086", challan: "CHN-20251130-004", date: "30/11/2025", amount: 33200, section: "192", status: "Pending" },
                ].map((ch, i) => (
                  <tr key={i} className="border-b border-border hover:bg-accent/50">
                    <td className="px-4 py-2.5 text-foreground">{ch.bsr}</td>
                    <td className="px-4 py-2.5 text-primary font-medium">{ch.challan}</td>
                    <td className="px-4 py-2.5">{ch.date}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(ch.amount)}</td>
                    <td className="px-4 py-2.5">{ch.section}</td>
                    <td className="px-4 py-2.5 text-center"><Badge variant={ch.status === "Verified" ? "default" : "secondary"} className="text-[10px]">{ch.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {subPage === "form24q" && (
        <div className="card-elevated p-5">
          <h3 className="text-sm font-bold mb-3">Form 24Q - Quarterly TDS Returns</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Quarter</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Period</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">TDS Amount</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">No. of Employees</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr></thead>
              <tbody>
                {[
                  { q: "Q4", period: "Jan - Mar 2026", tds: 116100, emps: 16, due: "31/05/2026", status: "Pending" },
                  { q: "Q3", period: "Oct - Dec 2025", tds: 102800, emps: 15, due: "31/01/2026", status: "Filed" },
                  { q: "Q2", period: "Jul - Sep 2025", tds: 89400, emps: 14, due: "31/10/2025", status: "Filed" },
                  { q: "Q1", period: "Apr - Jun 2025", tds: 76200, emps: 13, due: "31/07/2025", status: "Filed" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-accent/50">
                    <td className="px-4 py-2.5 font-bold text-foreground">{row.q}</td>
                    <td className="px-4 py-2.5">{row.period}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.tds)}</td>
                    <td className="px-4 py-2.5 text-center">{row.emps}</td>
                    <td className="px-4 py-2.5">{row.due}</td>
                    <td className="px-4 py-2.5 text-center"><Badge variant={row.status === "Filed" ? "default" : "secondary"} className="text-[10px]">{row.status}</Badge></td>
                    <td className="px-4 py-2.5 text-center"><button onClick={() => { if (row.status === "Pending") { toast.info("Filing Form 24Q", { description: `Initiating filing for ${row.q} (${row.period})` }); } else { toast.info("Viewing Filed Return", { description: `${row.q} return for ${row.period} — TDS: ${fmt(row.tds)}` }); } }} className="text-primary hover:underline text-xs">{row.status === "Pending" ? "File Now" : "View"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {subPage === "form16" && (
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Form 16 - Employee Tax Certificates</h3>
            <button onClick={() => { toast.success("Generating Form 16", { description: "Form 16 certificates are being generated for all eligible employees." }); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg"><Download className="w-3 h-3" /> Generate All Form 16</button>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">PAN</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Total Income</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">TDS Deducted</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr></thead>
              <tbody>
                {[
                  { name: "Rajesh Kumar Sharma", pan: "ABCDE1234F", income: 1800000, tds: 156000, status: "Generated" },
                  { name: "Priya Patel", pan: "FGHIJ5678K", income: 1200000, tds: 78000, status: "Generated" },
                  { name: "Mohammed Khan", pan: "KLMNO9012P", income: 2400000, tds: 312000, status: "Generated" },
                  { name: "Sunita Reddy", pan: "PQRST3456U", income: 1500000, tds: 117000, status: "Pending" },
                  { name: "Deepak Verma", pan: "UVWXY7890Z", income: 600000, tds: 0, status: "No TDS" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-accent/50">
                    <td className="px-4 py-2.5 font-medium text-foreground">{row.name}</td>
                    <td className="px-4 py-2.5 font-mono">{row.pan}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.income)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.tds)}</td>
                    <td className="px-4 py-2.5 text-center"><Badge variant={row.status === "Generated" ? "default" : row.status === "Pending" ? "secondary" : "outline"} className="text-[10px]">{row.status}</Badge></td>
                    <td className="px-4 py-2.5 text-center">{row.status === "Generated" ? <button onClick={() => toast.success("Downloaded", { description: `Form 16 for ${row.name} downloaded.` })} className="text-primary hover:underline text-xs">Download</button> : <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LOANS
// ═══════════════════════════════════════════════════════
function LoansPage() {
  const [showForm, setShowForm] = useState(false);
  const [loanForm, setLoanForm] = useState({ employee: "", type: "Salary Advance", amount: "" });

  const handleCreateLoan = () => {
    if (!loanForm.employee || !loanForm.amount) { toast.error("Missing Fields", { description: "Please fill in employee and amount." }); return; }
    toast.success("Loan Created", { description: `${loanForm.type} of ${fmt(Number(loanForm.amount))} created for ${loanForm.employee}.` });
    setShowForm(false);
    setLoanForm({ employee: "", type: "Salary Advance", amount: "" });
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Loans</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg"><Plus className="w-3.5 h-3.5" /> Create Loan</button>
      </div>

      {showForm && (
        <div className="card-elevated p-5 border-2 border-primary/20 space-y-4">
          <h3 className="text-sm font-bold text-foreground">New Loan</h3>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-[10px] text-muted-foreground uppercase font-semibold">Employee *</label>
              <select value={loanForm.employee} onChange={e => setLoanForm(p => ({ ...p, employee: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs border border-border rounded-lg bg-transparent">
                <option value="">Select Employee</option>
                <option>Rajesh Sharma (EMP001)</option><option>Priya Patel (EMP002)</option><option>Arun Nair (EMP003)</option><option>Deepak Verma (EMP006)</option>
              </select>
            </div>
            <div><label className="text-[10px] text-muted-foreground uppercase font-semibold">Loan Type *</label>
              <select value={loanForm.type} onChange={e => setLoanForm(p => ({ ...p, type: e.target.value }))} className="w-full mt-1 px-3 py-2 text-xs border border-border rounded-lg bg-transparent">
                <option>Salary Advance</option><option>Personal Loan</option><option>Emergency Advance</option>
              </select>
            </div>
            <div><label className="text-[10px] text-muted-foreground uppercase font-semibold">Amount (₹) *</label>
              <input type="number" value={loanForm.amount} onChange={e => setLoanForm(p => ({ ...p, amount: e.target.value }))} placeholder="0" className="w-full mt-1 px-3 py-2 text-xs border border-border rounded-lg bg-transparent" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreateLoan} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg">Create Loan</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-border text-xs font-medium rounded-lg hover:bg-accent">Cancel</button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Loans", value: "4", color: "border-primary/20 bg-primary/5" },
          { label: "Total Disbursed", value: fmt(850000), color: "border-success/20 bg-success/5" },
          { label: "Outstanding Balance", value: fmt(340000), color: "border-warning/20 bg-warning/5" },
        ].map((kpi, i) => (
          <div key={i} className={`rounded-lg border p-4 ${kpi.color}`}>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="text-lg font-bold font-mono text-foreground mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="card-elevated overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted border-b border-border">
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Loan Type</th>
            <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
            <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Outstanding</th>
            <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">EMI</th>
            <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Remaining</th>
            <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
          </tr></thead>
          <tbody>
            {[
              { emp: "Rajesh Sharma (EMP001)", type: "Salary Advance", amount: 200000, outstanding: 80000, emi: 20000, remaining: "4 months", status: "Active" },
              { emp: "Priya Patel (EMP002)", type: "Personal Loan", amount: 150000, outstanding: 100000, emi: 12500, remaining: "8 months", status: "Active" },
              { emp: "Arun Nair (EMP003)", type: "Emergency Advance", amount: 50000, outstanding: 10000, emi: 10000, remaining: "1 month", status: "Active" },
              { emp: "Deepak Verma (EMP006)", type: "Salary Advance", amount: 100000, outstanding: 100000, emi: 10000, remaining: "10 months", status: "Active" },
              { emp: "Mohammed Khan (EMP005)", type: "Personal Loan", amount: 350000, outstanding: 0, emi: 29167, remaining: "—", status: "Closed" },
            ].map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-accent/50">
                <td className="px-4 py-2.5 font-medium text-foreground">{row.emp}</td>
                <td className="px-4 py-2.5">{row.type}</td>
                <td className="px-4 py-2.5 text-right font-mono">{fmt(row.amount)}</td>
                <td className="px-4 py-2.5 text-right font-mono">{fmt(row.outstanding)}</td>
                <td className="px-4 py-2.5 text-right font-mono">{fmt(row.emi)}</td>
                <td className="px-4 py-2.5 text-center">{row.remaining}</td>
                <td className="px-4 py-2.5 text-center"><Badge variant={row.status === "Active" ? "default" : "secondary"} className="text-[10px]">{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// APPROVALS
// ═══════════════════════════════════════════════════════
function ApprovalsPage() {
  const [approvals, setApprovals] = useState([
    { req: "APR-2026-015", emp: "Rajesh Sharma", type: "Salary Revision", date: "25/03/2026", status: "Pending" },
    { req: "APR-2026-014", emp: "Priya Patel", type: "Loan Request", date: "22/03/2026", status: "Pending" },
    { req: "APR-2026-013", emp: "Deepak Verma", type: "IT Declaration", date: "20/03/2026", status: "Pending" },
    { req: "APR-2026-012", emp: "Sunita Reddy", type: "Reimbursement", date: "18/03/2026", status: "Approved" },
    { req: "APR-2026-011", emp: "Mohammed Khan", type: "Bonus Payout", date: "15/03/2026", status: "Approved" },
    { req: "APR-2026-010", emp: "Arun Nair", type: "Leave Encashment", date: "12/03/2026", status: "Rejected" },
  ]);

  const handleAction = (req: string, action: "Approved" | "Rejected") => {
    setApprovals(prev => prev.map(a => a.req === req ? { ...a, status: action } : a));
    toast.success(`Request ${action}`, { description: `${req} has been ${action.toLowerCase()}.` });
  };

  const pendingCount = approvals.filter(a => a.status === "Pending").length;
  const approvedCount = approvals.filter(a => a.status === "Approved").length;
  const rejectedCount = approvals.filter(a => a.status === "Rejected").length;

  return (
    <div className="space-y-5 animate-fade-in-up">
      <h2 className="text-lg font-bold text-foreground">Pending Approvals</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: String(pendingCount), color: "border-warning/20 bg-warning/5" },
          { label: "Approved This Month", value: String(approvedCount), color: "border-success/20 bg-success/5" },
          { label: "Rejected", value: String(rejectedCount), color: "border-destructive/20 bg-destructive/5" },
        ].map((kpi, i) => (
          <div key={i} className={`rounded-lg border p-4 ${kpi.color}`}>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className="text-lg font-bold font-mono text-foreground mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="card-elevated overflow-hidden">
        <table className="w-full text-xs">
          <thead><tr className="bg-muted border-b border-border">
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Request</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
            <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Submitted</th>
            <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="text-center px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
          </tr></thead>
          <tbody>
            {approvals.map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-accent/50">
                <td className="px-4 py-2.5 text-primary font-medium">{row.req}</td>
                <td className="px-4 py-2.5 font-medium text-foreground">{row.emp}</td>
                <td className="px-4 py-2.5">{row.type}</td>
                <td className="px-4 py-2.5">{row.date}</td>
                <td className="px-4 py-2.5 text-center"><Badge variant={row.status === "Approved" ? "default" : row.status === "Pending" ? "secondary" : "destructive"} className="text-[10px]">{row.status}</Badge></td>
                <td className="px-4 py-2.5 text-center">
                  {row.status === "Pending" ? (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleAction(row.req, "Approved")} className="px-2 py-1 bg-primary text-primary-foreground rounded text-[10px]">Approve</button>
                      <button onClick={() => handleAction(row.req, "Rejected")} className="px-2 py-1 border border-border rounded text-[10px] hover:bg-accent">Reject</button>
                    </div>
                  ) : <span className="text-muted-foreground">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════════════════
function ReportsPage() {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <h2 className="text-lg font-bold text-foreground">Reports</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { name: "Payroll Register", desc: "Monthly payroll summary with earnings, deductions, and net pay for all employees.", lastGenerated: "28/02/2026", icon: <Receipt className="w-5 h-5 text-primary" /> },
          { name: "PF Report (ECR)", desc: "EPF contribution report in ECR format for EPFO portal upload.", lastGenerated: "28/02/2026", icon: <Shield className="w-5 h-5 text-primary" /> },
          { name: "ESI Report", desc: "Monthly ESI contribution statement for all applicable employees.", lastGenerated: "28/02/2026", icon: <Shield className="w-5 h-5 text-primary" /> },
          { name: "TDS Report", desc: "Quarter-wise TDS deduction and deposit summary for income tax filing.", lastGenerated: "31/01/2026", icon: <Landmark className="w-5 h-5 text-primary" /> },
          { name: "Rank-wise Wage Report", desc: "Seafarer wage analysis grouped by rank with vessel-wise breakdown.", lastGenerated: "28/02/2026", icon: <BarChart3 className="w-5 h-5 text-primary" /> },
          { name: "Vessel-wise Payroll", desc: "Payroll cost summary per vessel including crew wages and allowances.", lastGenerated: "28/02/2026", icon: <BarChart3 className="w-5 h-5 text-primary" /> },
          { name: "Bank Advice Statement", desc: "Bank transfer details for salary disbursement processing.", lastGenerated: "28/02/2026", icon: <CreditCard className="w-5 h-5 text-primary" /> },
          { name: "Leave & Attendance", desc: "Monthly attendance, leave balances, and LOP deduction summary.", lastGenerated: "28/02/2026", icon: <Calendar className="w-5 h-5 text-primary" /> },
        ].map((report, i) => (
          <div key={i} className="card-elevated p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">{report.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{report.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{report.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-2">Last generated: {report.lastGenerated}</p>
            </div>
            <button onClick={() => { toast.loading(`Generating ${report.name}...`, { id: report.name }); setTimeout(() => toast.success(`${report.name} Ready`, { id: report.name, description: "Report generated successfully. Click to download." }), 1500); }} className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-accent shrink-0"><Download className="w-3 h-3" /> Generate</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════
function SettingsPage() {
  const [paymentModes, setPaymentModes] = useState([
    { mode: "Bank Transfer (Manual)", enabled: true, desc: "Download bank advice and process manually" },
    { mode: "NEFT/RTGS", enabled: true, desc: "Direct bank integration for salary credit" },
    { mode: "Cheque", enabled: false, desc: "Generate cheques for salary payment" },
    { mode: "Cash", enabled: false, desc: "Cash disbursement with receipt tracking" },
  ]);

  const togglePaymentMode = (mode: string) => {
    setPaymentModes(prev => prev.map(pm => pm.mode === mode ? { ...pm, enabled: !pm.enabled } : pm));
    const pm = paymentModes.find(p => p.mode === mode);
    toast.success(`${mode} ${pm?.enabled ? "Disabled" : "Enabled"}`, { description: `Payment mode has been ${pm?.enabled ? "disabled" : "enabled"}.` });
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <h2 className="text-lg font-bold text-foreground">Payroll Settings</h2>
      <div className="space-y-4">
        <div className="card-elevated p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Payroll Cycle</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              { label: "Pay Frequency", value: "Monthly" },
              { label: "Pay Day", value: "Last working day of the month" },
              { label: "Payroll Processing", value: "25th of every month" },
              { label: "Financial Year Start", value: "April" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => toast.info("Edit Payroll Cycle", { description: "Configuration editor opened. Modify pay frequency, pay day, and processing date." })} className="mt-4 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5">Edit Configuration</button>
        </div>
        <div className="card-elevated p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Statutory Rates</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {[
              { label: "EPF Employee Contribution", value: "12% of Basic" },
              { label: "EPF Employer Contribution", value: "12% of Basic" },
              { label: "ESI Employee", value: "0.75% of Gross" },
              { label: "ESI Employer", value: "3.25% of Gross" },
              { label: "Professional Tax (max)", value: "₹200/month" },
              { label: "LWF Employee", value: "₹12/half-year" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className="text-xs font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
          <button onClick={() => toast.info("Update Statutory Rates", { description: "Rate editor opened. Modify EPF, ESI, PT, and LWF contribution rates." })} className="mt-4 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5">Update Rates</button>
        </div>
        <div className="card-elevated p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Rank & Wage Master</h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Base Wage (Monthly)</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Sea Allowance</th>
                <th className="text-right px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">Leave Pay</th>
              </tr></thead>
              <tbody>
                {[
                  { rank: "Master", base: 250000, sea: 50000, leave: 30000 },
                  { rank: "Chief Engineer", base: 220000, sea: 45000, leave: 28000 },
                  { rank: "Chief Officer", base: 180000, sea: 38000, leave: 24000 },
                  { rank: "2nd Engineer", base: 150000, sea: 32000, leave: 20000 },
                  { rank: "2nd Officer", base: 120000, sea: 25000, leave: 16000 },
                  { rank: "3rd Officer", base: 100000, sea: 20000, leave: 12000 },
                  { rank: "Junior Engineer", base: 60000, sea: 12000, leave: 8000 },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium text-foreground">{row.rank}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.base)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.sea)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{fmt(row.leave)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => toast.info("Edit Wage Master", { description: "Wage master editor opened. Modify base wages, sea allowances, and leave pay by rank." })} className="mt-4 px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5">Edit Wage Master</button>
        </div>
        <div className="card-elevated p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Payment Modes</h3>
          <div className="space-y-2">
            {paymentModes.map((pm, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer hover:bg-accent/30" onClick={() => togglePaymentMode(pm.mode)}>
                <div>
                  <p className="text-xs font-semibold text-foreground">{pm.mode}</p>
                  <p className="text-[10px] text-muted-foreground">{pm.desc}</p>
                </div>
                <Badge variant={pm.enabled ? "default" : "secondary"} className="text-[10px]">{pm.enabled ? "Enabled" : "Disabled"}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ADD EMPLOYEE WIZARD
// ═══════════════════════════════════════════════════════
type WizardStep = 1 | 2 | 3 | 4;
const stepLabels = ["Basic Details", "Salary Details", "Personal Details", "Payment Information"];

function AddEmployeeWizard({ onSave }: { onSave: (e: Employee) => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState({
    firstName: "", middleName: "", lastName: "", employeeId: "", dateOfJoining: "",
    email: "", mobile: "", gender: "Male" as "Male" | "Female" | "Other",
    workLocation: "Head Office - Mumbai", designation: "", department: "Operations",
    portalAccess: false, employmentType: "shore" as "shore" | "seafarer",
    rank: "", vessel: "",
    epf: true, pfAccountNumber: "", uan: "", esi: false, lwf: false,
    annualCTC: 0, basicMonthly: 0,
    dob: "", fatherName: "", pan: "", personalEmail: "",
    addressLine1: "", addressLine2: "", city: "", state: "", pin: "",
    differentlyAbled: "None",
    paymentMode: "Bank Transfer" as "Bank Transfer" | "Cheque" | "Cash",
    accountHolderName: "", bankName: "", accountNumber: "", reAccountNumber: "",
    ifsc: "", accountType: "Savings" as "Current" | "Savings",
  });

  const u = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));
  const canNext = () => {
    if (step === 1) return form.firstName && form.employeeId && form.dateOfJoining && form.email && form.designation;
    return true;
  };

  const handleSave = () => {
    const emp: Employee = {
      id: crypto.randomUUID(), employeeId: form.employeeId,
      firstName: form.firstName, middleName: form.middleName || undefined, lastName: form.lastName,
      email: form.email, mobile: form.mobile || undefined, gender: form.gender,
      dateOfJoining: form.dateOfJoining, designation: form.designation, department: form.department,
      workLocation: form.workLocation, status: "Active", portalAccess: form.portalAccess,
      employmentType: form.employmentType, rank: form.rank || undefined, vessel: form.vessel || undefined,
      dob: form.dob || undefined, fatherName: form.fatherName || undefined, pan: form.pan || undefined,
      epf: form.epf, esi: form.esi, lwf: form.lwf, annualCTC: form.annualCTC,
      salaryComponents: [
        { name: "Basic", type: "Fixed amount", monthlyAmount: form.basicMonthly, annualAmount: form.basicMonthly * 12 },
        { name: "Special Allowance", type: "Fixed amount", monthlyAmount: (form.annualCTC / 12) - form.basicMonthly, annualAmount: form.annualCTC - (form.basicMonthly * 12) },
      ],
      bankName: form.bankName || undefined, accountNumber: form.accountNumber || undefined,
      ifsc: form.ifsc || undefined, accountType: form.accountType,
      accountHolderName: form.accountHolderName || undefined, paymentMode: form.paymentMode,
    };
    onSave(emp);
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Add Employee</h2>
        <Link to="/payroll/employees" className="p-1.5 rounded-lg hover:bg-accent"><X className="w-4 h-4" /></Link>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between px-4">
        {stepLabels.map((label, i) => {
          const s = (i + 1) as WizardStep;
          const done = step > s;
          const active = step === s;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${done ? "bg-primary border-primary text-primary-foreground" : active ? "border-primary text-primary bg-primary/10" : "border-muted-foreground/30 text-muted-foreground"}`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : s}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 mx-3 rounded ${done ? "bg-primary" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      <div className="card-elevated p-6 space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Field label="First Name" required value={form.firstName} onChange={v => u("firstName", v)} placeholder="First Name" />
              <Field label="Middle Name" value={form.middleName} onChange={v => u("middleName", v)} placeholder="Middle Name" />
              <Field label="Last Name" value={form.lastName} onChange={v => u("lastName", v)} placeholder="Last Name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Employee ID" required value={form.employeeId} onChange={v => u("employeeId", v)} placeholder="EMP001" />
              <Field label="Date of Joining" required value={form.dateOfJoining} onChange={v => u("dateOfJoining", v)} placeholder="dd/MM/yyyy" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Work Email" required value={form.email} onChange={v => u("email", v)} placeholder="email@company.com" />
              <Field label="Mobile Number" value={form.mobile} onChange={v => u("mobile", v)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Gender" required value={form.gender} options={["Male", "Female", "Other"]} onChange={v => u("gender", v)} />
              <SelectField label="Employment Type" required value={form.employmentType} options={["shore", "seafarer"]} onChange={v => u("employmentType", v)} />
            </div>
            {form.employmentType === "seafarer" && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Rank" value={form.rank} onChange={v => u("rank", v)} placeholder="e.g. Chief Engineer" />
                <Field label="Vessel" value={form.vessel} onChange={v => u("vessel", v)} placeholder="e.g. MV Dolphin 7" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Designation" required value={form.designation} onChange={v => u("designation", v)} placeholder="e.g. Chief Engineer" />
              <SelectField label="Department" required value={form.department} options={["Engineering", "Operations", "QHSE", "Management", "Finance", "HR"]} onChange={v => u("department", v)} />
            </div>
            <Field label="Work Location" required value={form.workLocation} onChange={v => u("workLocation", v)} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="rounded-xl border border-border p-5 space-y-4">
              <div><h3 className="text-sm font-bold text-foreground">Statutory Components</h3><p className="text-xs text-muted-foreground mt-0.5">Enable the necessary benefits and tax applicable.</p></div>
              <ToggleItem label="Employees' Provident Fund" checked={form.epf} onChange={v => u("epf", v)}>
                {form.epf && (
                  <div className="grid grid-cols-2 gap-3 mt-3 ml-6">
                    <Field label="PF Account Number" value={form.pfAccountNumber} onChange={v => u("pfAccountNumber", v)} placeholder="AA/AAA/0000000/XXX/0000000" />
                    <Field label="UAN" value={form.uan} onChange={v => u("uan", v)} placeholder="000000000000" />
                  </div>
                )}
              </ToggleItem>
              <ToggleItem label="Employees' State Insurance" checked={form.esi} onChange={v => u("esi", v)} />
              <ToggleItem label="Labour Welfare Fund" checked={form.lwf} onChange={v => u("lwf", v)} />
            </div>
            <div className="rounded-xl border border-border p-5 space-y-4">
              <div><h3 className="text-sm font-bold text-foreground">Salary Structure</h3></div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-destructive">Annual CTC *</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <span className="px-2 py-1.5 bg-muted text-xs font-medium">₹</span>
                  <input type="number" value={form.annualCTC || ""} onChange={e => u("annualCTC", Number(e.target.value))} className="px-3 py-1.5 text-sm bg-transparent outline-none w-40" placeholder="0" />
                  <span className="px-2 py-1.5 text-xs text-muted-foreground">per year</span>
                </div>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-muted px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Components</span><span>Calc Type</span><span className="text-right">Monthly</span><span className="text-right">Annual</span>
                </div>
                <div className="px-4 py-2 border-t border-border space-y-2">
                  <p className="text-xs font-bold text-foreground">Earnings</p>
                  <div className="grid grid-cols-4 items-center">
                    <span className="text-xs">Basic</span><span className="text-xs text-muted-foreground">Fixed amount</span>
                    <div className="text-right"><input type="number" value={form.basicMonthly || ""} onChange={e => u("basicMonthly", Number(e.target.value))} className="w-24 text-right px-2 py-1 text-xs border border-border rounded bg-transparent" /></div>
                    <span className="text-xs text-right font-mono">{fmt(form.basicMonthly * 12)}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center">
                    <span className="text-xs">Special Allowance</span><span className="text-xs text-muted-foreground">Fixed amount</span>
                    <span className="text-xs text-right text-muted-foreground">System Calc</span><span className="text-xs text-right text-muted-foreground">System Calc</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 px-4 py-2 bg-primary/5 border-t border-border">
                  <span className="text-xs font-bold col-span-2">Cost to Company</span>
                  <span className="text-xs font-bold text-right font-mono">{fmt(form.annualCTC / 12)}</span>
                  <span className="text-xs font-bold text-right font-mono">{fmt(form.annualCTC)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Birth" value={form.dob} onChange={v => u("dob", v)} placeholder="dd/MM/yyyy" />
              <Field label="Age" value="" disabled />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Father's Name" value={form.fatherName} onChange={v => u("fatherName", v)} />
              <Field label="PAN" value={form.pan} onChange={v => u("pan", v)} placeholder="AAAAA0000A" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Differently Abled Type" value={form.differentlyAbled} options={["None", "Visual", "Hearing", "Locomotor", "Other"]} onChange={v => u("differentlyAbled", v)} />
              <Field label="Personal Email" value={form.personalEmail} onChange={v => u("personalEmail", v)} placeholder="abc@xyz.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Residential Address</label>
              <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-transparent" placeholder="Address Line 1" value={form.addressLine1} onChange={e => u("addressLine1", e.target.value)} />
              <input className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-transparent" placeholder="Address Line 2" value={form.addressLine2} onChange={e => u("addressLine2", e.target.value)} />
              <div className="grid grid-cols-3 gap-3">
                <input className="px-3 py-2 text-sm border border-border rounded-lg bg-transparent" placeholder="City" value={form.city} onChange={e => u("city", e.target.value)} />
                <input className="px-3 py-2 text-sm border border-border rounded-lg bg-transparent" placeholder="State" value={form.state} onChange={e => u("state", e.target.value)} />
                <input className="px-3 py-2 text-sm border border-border rounded-lg bg-transparent" placeholder="PIN Code" value={form.pin} onChange={e => u("pin", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-foreground">How would you like to pay this employee? *</h3>
            <div className="space-y-3">
              {(["Bank Transfer", "Cheque", "Cash"] as const).map(mode => (
                <label key={mode} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${form.paymentMode === mode ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"}`}>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{mode === "Bank Transfer" ? "Bank Transfer (Manual Process)" : mode}</p>
                      {mode === "Bank Transfer" && <p className="text-[10px] text-primary">Download Bank Advice and process the payment</p>}
                    </div>
                  </div>
                  <input type="radio" checked={form.paymentMode === mode} onChange={() => u("paymentMode", mode)} className="accent-primary" />
                </label>
              ))}
            </div>
            {form.paymentMode === "Bank Transfer" && (
              <div className="space-y-4">
                <Field label="Account Holder Name" required value={form.accountHolderName} onChange={v => u("accountHolderName", v)} />
                <Field label="Bank Name" required value={form.bankName} onChange={v => u("bankName", v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Account Number" required value={form.accountNumber} onChange={v => u("accountNumber", v)} type="password" />
                  <Field label="Re-enter Account Number" required value={form.reAccountNumber} onChange={v => u("reAccountNumber", v)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="IFSC" required value={form.ifsc} onChange={v => u("ifsc", v)} placeholder="AAAA0000000" />
                  <div>
                    <label className="text-xs font-medium text-foreground">Account Type *</label>
                    <div className="flex items-center gap-4 mt-2">
                      {(["Current", "Savings"] as const).map(t => (
                        <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                          <input type="radio" checked={form.accountType === t} onChange={() => u("accountType", t)} className="accent-primary" />
                          <span className="text-xs">{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>{step > 1 && <button onClick={() => setStep((step - 1) as WizardStep)} className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-accent"><ChevronLeft className="w-3 h-3 inline mr-1" />Back</button>}</div>
        <div className="flex items-center gap-2">
          <Link to="/payroll/employees" className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-accent">Cancel</Link>
          {step < 4 ? (
            <button onClick={() => canNext() && setStep((step + 1) as WizardStep)} disabled={!canNext()} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">Save and Continue</button>
          ) : (
            <button onClick={handleSave} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save and Continue</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PLACEHOLDER
// ═══════════════════════════════════════════════════════
function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
      <h2 className="text-lg font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SHARED FORM COMPONENTS
// ═══════════════════════════════════════════════════════
function Field({ label, value, onChange, placeholder, required, type, disabled }: {
  label: string; value?: string; onChange?: (v: string) => void; placeholder?: string; required?: boolean; type?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground">{label}{required && <span className="text-destructive"> *</span>}</label>
      <input type={type || "text"} value={value || ""} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        disabled={disabled} className="w-full mt-1 px-3 py-2 text-sm border border-border rounded-lg bg-transparent focus:ring-2 focus:ring-ring focus:border-primary outline-none disabled:opacity-50" />
    </div>
  );
}

function SelectField({ label, value, options, onChange, required }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground">{label}{required && <span className="text-destructive"> *</span>}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full mt-1 px-3 py-2 text-sm border border-border rounded-lg bg-transparent focus:ring-2 focus:ring-ring outline-none">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function ToggleItem({ label, checked, onChange, children }: { label: string; checked: boolean; onChange: (v: boolean) => void; children?: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded border-border accent-primary" />
        <span className="text-xs font-semibold text-foreground">{label}</span>
      </label>
      {children}
    </div>
  );
}

function InfoSection({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {icon && <button className="text-muted-foreground hover:text-foreground">{icon}</button>}
      </div>
      {children}
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string; highlight?: boolean }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
      {items.map((item, i) => (
        <div key={i}>
          <p className="text-[10px] text-primary font-medium">{item.label}</p>
          <p className={`text-xs font-semibold ${item.highlight ? "text-destructive" : "text-foreground"}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
