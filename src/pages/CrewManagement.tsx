import { useState, useMemo } from "react";
import {
  Users, UserPlus, Search, ChevronRight, ChevronLeft, Edit2, X, Check,
  Phone, Mail, MapPin, Building2, Calendar, CreditCard, Shield, IndianRupee,
  FileText, AlertTriangle, Eye, EyeOff, Plus, Trash2, Filter,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ─── Types ───
interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobile?: string;
  gender: "Male" | "Female" | "Other";
  dateOfJoining: string;
  designation: string;
  department: string;
  workLocation: string;
  status: "Active" | "Inactive" | "On Leave";
  portalAccess: boolean;
  dob?: string;
  fatherName?: string;
  pan?: string;
  personalEmail?: string;
  address?: { line1: string; line2?: string; city: string; state: string; pin: string };
  epf: boolean;
  esi: boolean;
  lwf: boolean;
  pfAccountNumber?: string;
  uan?: string;
  annualCTC: number;
  salaryComponents: { name: string; type: string; monthlyAmount: number; annualAmount: number }[];
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  accountType?: "Current" | "Savings";
  accountHolderName?: string;
  paymentMode: "Bank Transfer" | "Cheque" | "Cash";
}

// ─── Mock Data ───
const mockEmployees: Employee[] = [
  {
    id: "1", employeeId: "EMP001", firstName: "Rajesh", middleName: "Kumar", lastName: "Sharma",
    email: "rajesh.sharma@company.com", mobile: "+91 98765 43210", gender: "Male",
    dateOfJoining: "15/01/2022", designation: "Chief Engineer", department: "Engineering",
    workLocation: "Vessel - MV Dolphin 7", status: "Active", portalAccess: true,
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
  },
  {
    id: "2", employeeId: "EMP002", firstName: "Priya", lastName: "Patel",
    email: "priya.patel@company.com", mobile: "+91 87654 32109", gender: "Female",
    dateOfJoining: "01/03/2023", designation: "Navigation Officer", department: "Operations",
    workLocation: "Vessel - MV Baitarani", status: "Active", portalAccess: true,
    dob: "22/08/1990", fatherName: "Amit Patel", pan: "FGHIJ5678K",
    epf: true, esi: true, lwf: false,
    annualCTC: 1200000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 50000, annualAmount: 600000 },
      { name: "HRA", type: "% of Basic", monthlyAmount: 25000, annualAmount: 300000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 25000, annualAmount: 300000 },
    ],
    bankName: "HDFC Bank", accountNumber: "XXXX4567", ifsc: "HDFC0005678",
    accountType: "Savings", accountHolderName: "Priya Patel", paymentMode: "Bank Transfer",
  },
  {
    id: "3", employeeId: "EMP003", firstName: "Arun", lastName: "Nair",
    email: "arun.nair@company.com", gender: "Male",
    dateOfJoining: "10/06/2021", designation: "Deck Officer", department: "Operations",
    workLocation: "Head Office - Mumbai", status: "On Leave", portalAccess: false,
    epf: true, esi: false, lwf: true,
    annualCTC: 960000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 40000, annualAmount: 480000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 40000, annualAmount: 480000 },
    ],
    bankName: "ICICI Bank", accountNumber: "XXXX8901", ifsc: "ICIC0002345",
    accountType: "Current", accountHolderName: "Arun Nair", paymentMode: "Bank Transfer",
  },
  {
    id: "4", employeeId: "EMP004", firstName: "Sunita", lastName: "Reddy",
    email: "sunita.reddy@company.com", mobile: "+91 76543 21098", gender: "Female",
    dateOfJoining: "20/09/2020", designation: "Safety Officer", department: "QHSE",
    workLocation: "Vessel - MV Kaveri", status: "Active", portalAccess: true,
    epf: true, esi: true, lwf: true,
    annualCTC: 1500000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 62500, annualAmount: 750000 },
      { name: "HRA", type: "% of Basic", monthlyAmount: 31250, annualAmount: 375000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 31250, annualAmount: 375000 },
    ],
    bankName: "Axis Bank", accountNumber: "XXXX2345", ifsc: "UTIB0003456",
    accountType: "Savings", accountHolderName: "Sunita Reddy", paymentMode: "Bank Transfer",
  },
  {
    id: "5", employeeId: "EMP005", firstName: "Mohammed", lastName: "Khan",
    email: "mohammed.khan@company.com", mobile: "+91 65432 10987", gender: "Male",
    dateOfJoining: "05/11/2019", designation: "General Manager", department: "Management",
    workLocation: "Head Office - Mumbai", status: "Active", portalAccess: true,
    epf: true, esi: false, lwf: true, pan: "KLMNO9012P",
    annualCTC: 2400000,
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
    epf: true, esi: true, lwf: false,
    annualCTC: 600000,
    salaryComponents: [
      { name: "Basic", type: "Fixed amount", monthlyAmount: 25000, annualAmount: 300000 },
      { name: "Special Allowance", type: "Fixed amount", monthlyAmount: 25000, annualAmount: 300000 },
    ],
    paymentMode: "Bank Transfer",
  },
];

const departments = ["All", "Engineering", "Operations", "QHSE", "Management"];
const statuses = ["All", "Active", "Inactive", "On Leave"];

const formatCurrency = (n: number) => "₹" + n.toLocaleString("en-IN");

// ─── Add Employee Wizard ───
type WizardStep = 1 | 2 | 3 | 4;
const stepLabels = ["Basic Details", "Salary Details", "Personal Details", "Payment Information"];

function AddEmployeeWizard({ onClose, onSave }: { onClose: () => void; onSave: (e: Employee) => void }) {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState({
    firstName: "", middleName: "", lastName: "", employeeId: "", dateOfJoining: "",
    email: "", mobile: "", gender: "Male" as "Male" | "Female" | "Other",
    workLocation: "Head Office - Mumbai", designation: "", department: "Operations",
    portalAccess: false, payArrears: false,
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
    if (step === 2) return true;
    if (step === 3) return true;
    return true;
  };

  const handleSave = () => {
    const emp: Employee = {
      id: crypto.randomUUID(), employeeId: form.employeeId,
      firstName: form.firstName, middleName: form.middleName || undefined, lastName: form.lastName,
      email: form.email, mobile: form.mobile || undefined, gender: form.gender,
      dateOfJoining: form.dateOfJoining, designation: form.designation, department: form.department,
      workLocation: form.workLocation, status: "Active", portalAccess: form.portalAccess,
      dob: form.dob || undefined, fatherName: form.fatherName || undefined, pan: form.pan || undefined,
      personalEmail: form.personalEmail || undefined,
      address: form.addressLine1 ? { line1: form.addressLine1, line2: form.addressLine2, city: form.city, state: form.state, pin: form.pin } : undefined,
      epf: form.epf, esi: form.esi, lwf: form.lwf,
      pfAccountNumber: form.pfAccountNumber || undefined, uan: form.uan || undefined,
      annualCTC: form.annualCTC,
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-8 overflow-y-auto">
      <div className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-3xl mb-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Add Employee</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-accent"><X className="w-4 h-4" /></button>
        </div>

        {/* Stepper */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-center justify-between">
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
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
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
              <div className="rounded-lg bg-info/5 border border-info/20 p-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-info mt-0.5 shrink-0" />
                <p className="text-xs text-info">You may pay the employee's first month salary as arrears in the upcoming pay run.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Work Email" required value={form.email} onChange={v => u("email", v)} placeholder="email@company.com" />
                <Field label="Mobile Number" value={form.mobile} onChange={v => u("mobile", v)} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Gender" required value={form.gender} options={["Male", "Female", "Other"]} onChange={v => u("gender", v)} />
                <Field label="Work Location" required value={form.workLocation} onChange={v => u("workLocation", v)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Designation" required value={form.designation} onChange={v => u("designation", v)} placeholder="e.g. Chief Engineer" />
                <SelectField label="Department" required value={form.department} options={["Engineering", "Operations", "QHSE", "Management", "Finance", "HR"]} onChange={v => u("department", v)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.portalAccess} onChange={e => u("portalAccess", e.target.checked)} className="rounded border-border" />
                <span className="text-xs font-medium text-foreground">Enable Portal Access</span>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-border p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Statutory Components</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Enable the necessary benefits and tax applicable for this employee.</p>
                </div>
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
                <div>
                  <h3 className="text-sm font-bold text-foreground">Salary Structure</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Set how the employee's salary is divided for accurate pay calculation.</p>
                </div>
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
                    <span>Salary Components</span><span>Calculation Type</span><span className="text-right">Monthly Amount</span><span className="text-right">Annual Amount</span>
                  </div>
                  <div className="px-4 py-2 border-t border-border">
                    <p className="text-xs font-bold text-foreground mb-2">Earnings</p>
                    <div className="grid grid-cols-4 items-center gap-y-3">
                      <span className="text-xs text-foreground">Basic</span>
                      <span className="text-xs text-muted-foreground">Fixed amount</span>
                      <div className="text-right">
                        <input type="number" value={form.basicMonthly || ""} onChange={e => u("basicMonthly", Number(e.target.value))} className="w-24 text-right px-2 py-1 text-xs border border-border rounded bg-transparent" placeholder="0" />
                      </div>
                      <span className="text-xs text-right font-mono">{formatCurrency(form.basicMonthly * 12)}</span>

                      <span className="text-xs text-foreground">Special Allowance</span>
                      <span className="text-xs text-muted-foreground">Fixed amount</span>
                      <span className="text-xs text-right text-muted-foreground">System Calculated</span>
                      <span className="text-xs text-right text-muted-foreground">System Calculated</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 px-4 py-2 bg-primary/5 border-t border-border">
                    <span className="text-xs font-bold col-span-2">Cost to Company</span>
                    <span className="text-xs font-bold text-right font-mono">{formatCurrency(form.annualCTC / 12)}</span>
                    <span className="text-xs font-bold text-right font-mono">{formatCurrency(form.annualCTC)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Date of Birth" value={form.dob} onChange={v => u("dob", v)} placeholder="dd/MM/yyyy" />
                <Field label="Age" value={form.dob ? "—" : ""} disabled />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Father's Name" value={form.fatherName} onChange={v => u("fatherName", v)} />
                <Field label="PAN" value={form.pan} onChange={v => u("pan", v)} placeholder="AAAAA0000A" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Differently Abled Type" value={form.differentlyAbled} options={["None", "Visual", "Hearing", "Locomotor", "Other"]} onChange={v => u("differentlyAbled", v)} />
                <Field label="Personal Email Address" value={form.personalEmail} onChange={v => u("personalEmail", v)} placeholder="abc@xyz.com" />
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
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">How would you like to pay this employee? *</h3>
                <div className="border-b border-border" />
              </div>
              <div className="space-y-3">
                {(["Bank Transfer", "Cheque", "Cash"] as const).map(mode => (
                  <label key={mode} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${form.paymentMode === mode ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50"}`}>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{mode === "Bank Transfer" ? "Bank Transfer (Manual Process)" : mode}</p>
                        {mode === "Bank Transfer" && <p className="text-[10px] text-primary">Download Bank Advice and process the payment through your bank's website</p>}
                      </div>
                    </div>
                    <input type="radio" checked={form.paymentMode === mode} onChange={() => u("paymentMode", mode)} className="accent-primary" />
                  </label>
                ))}
              </div>
              {form.paymentMode === "Bank Transfer" && (
                <div className="space-y-4 mt-4">
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={() => setStep((step - 1) as WizardStep)} className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-accent">
                <ChevronLeft className="w-3 h-3 inline mr-1" />Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-medium border border-border rounded-lg hover:bg-accent">Cancel</button>
            {step < 4 ? (
              <button onClick={() => canNext() && setStep((step + 1) as WizardStep)} disabled={!canNext()} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50">
                Save and Continue
              </button>
            ) : (
              <button onClick={handleSave} className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Save and Continue
              </button>
            )}
          </div>
          <p className="text-[10px] text-destructive">* indicates mandatory fields</p>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Profile View ───
function EmployeeProfile({ employee, onBack }: { employee: Employee; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "salary" | "investments" | "payslips" | "loans">("overview");
  const fullName = [employee.firstName, employee.middleName, employee.lastName].filter(Boolean).join(" ");
  const initial = employee.firstName[0];

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Profile Header */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-accent"><ChevronLeft className="w-4 h-4" /></button>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{initial}</div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">{employee.employeeId} - {fullName}</h2>
              <Badge variant={employee.status === "Active" ? "default" : employee.status === "On Leave" ? "secondary" : "destructive"} className="text-[10px]">{employee.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{employee.designation}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4 border-b border-border">
          {(["overview", "salary", "investments", "payslips", "loans"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab === "salary" ? "Salary Details" : tab === "payslips" ? "Payslips & Forms" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Incomplete Warning */}
      {(!employee.dob || !employee.fatherName) && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg px-4 py-2.5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
          <p className="text-xs text-warning">This employee's profile is incomplete. <button className="font-semibold text-primary hover:underline">Complete now</button></p>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="space-y-4">
          <InfoSection title="Basic Information" icon={<Edit2 className="w-3.5 h-3.5" />}>
            <InfoGrid items={[
              { label: "Name", value: fullName }, { label: "Work Location", value: employee.workLocation },
              { label: "Email Address", value: employee.email }, { label: "Designation", value: employee.designation },
              { label: "Mobile Number", value: employee.mobile || "—" }, { label: "Departments", value: employee.department },
              { label: "Date of Joining", value: employee.dateOfJoining }, { label: "Portal Access", value: employee.portalAccess ? "✓ Enabled" : "✗ Disabled" },
              { label: "Gender", value: employee.gender },
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

      {activeTab === "salary" && (
        <div className="space-y-4">
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-foreground">Salary Details</h3>
              <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex gap-6 p-4 rounded-lg border border-border bg-muted/30">
              <div><p className="text-[10px] text-primary uppercase font-semibold">Annual CTC</p><p className="text-base font-bold font-mono">{formatCurrency(employee.annualCTC)} per year</p></div>
              <div><p className="text-[10px] text-primary uppercase font-semibold">Monthly CTC</p><p className="text-base font-bold font-mono">{formatCurrency(Math.round(employee.annualCTC / 12))} per month</p></div>
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
                    <span className="text-xs text-right font-mono">{formatCurrency(c.monthlyAmount)}</span>
                    <span className="text-xs text-right font-mono">{formatCurrency(c.annualAmount)}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 px-4 py-2 bg-primary/5 border-t border-border">
                <span className="text-xs font-bold">Cost to Company</span>
                <span className="text-xs font-bold text-right font-mono">{formatCurrency(Math.round(employee.annualCTC / 12))}</span>
                <span className="text-xs font-bold text-right font-mono">{formatCurrency(employee.annualCTC)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "investments" && (
        <div className="card-elevated p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">IT Declaration submission is locked for this employee</p>
          <p className="text-xs text-muted-foreground mt-1">You can either allow the employee to submit IT Declaration through the portal or submit it on their behalf.</p>
          <button className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg">Submit Declaration</button>
        </div>
      )}

      {activeTab === "payslips" && (
        <div className="card-elevated p-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">There are no payslips for this financial year.</p>
        </div>
      )}

      {activeTab === "loans" && (
        <div className="card-elevated p-8 text-center">
          <IndianRupee className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No active loans for this employee.</p>
        </div>
      )}
    </div>
  );
}

// ─── Shared Sub-components ───
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

// ─── Main Component ───
export default function CrewManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddWizard, setShowAddWizard] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filtered = useMemo(() => employees.filter(e => {
    const q = search.toLowerCase();
    const matchesSearch = !q || e.firstName.toLowerCase().includes(q) || e.lastName.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
    const matchesDept = deptFilter === "All" || e.department === deptFilter;
    const matchesStatus = statusFilter === "All" || e.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  }), [employees, search, deptFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: employees.length,
    active: employees.filter(e => e.status === "Active").length,
    onLeave: employees.filter(e => e.status === "On Leave").length,
    avgCTC: Math.round(employees.reduce((s, e) => s + e.annualCTC, 0) / employees.length),
  }), [employees]);

  if (selectedEmployee) {
    return <EmployeeProfile employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Crew", value: stats.total.toString(), icon: Users, color: "text-primary" },
          { label: "Active", value: stats.active.toString(), icon: Check, color: "text-success" },
          { label: "On Leave", value: stats.onLeave.toString(), icon: Calendar, color: "text-warning" },
          { label: "Avg. CTC", value: formatCurrency(stats.avgCTC), icon: IndianRupee, color: "text-info" },
        ].map((kpi, i) => (
          <div key={i} className="card-elevated p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium text-muted-foreground">{kpi.label}</p>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <p className="text-xl font-bold font-mono text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card-elevated p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, or email..." className="w-full pl-9 pr-3 py-2 text-xs border border-border rounded-lg bg-transparent focus:ring-2 focus:ring-ring outline-none" />
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-2 text-xs border border-border rounded-lg bg-transparent">
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 text-xs border border-border rounded-lg bg-transparent">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={() => setShowAddWizard(true)} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 shrink-0">
          <UserPlus className="w-3.5 h-3.5" /> Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Designation</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Annual CTC</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const fullName = [emp.firstName, emp.lastName].filter(Boolean).join(" ");
                return (
                  <tr key={emp.id} className="border-b border-border hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{emp.firstName[0]}</div>
                        <div>
                          <p className="font-semibold text-foreground">{fullName}</p>
                          <p className="text-[10px] text-muted-foreground">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground">{emp.employeeId}</td>
                    <td className="px-4 py-3 text-foreground">{emp.department}</td>
                    <td className="px-4 py-3 text-foreground">{emp.designation}</td>
                    <td className="px-4 py-3 text-muted-foreground">{emp.workLocation}</td>
                    <td className="px-4 py-3">
                      <Badge variant={emp.status === "Active" ? "default" : emp.status === "On Leave" ? "secondary" : "destructive"} className="text-[10px]">{emp.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{formatCurrency(emp.annualCTC)}</td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 rounded hover:bg-accent"><ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddWizard && (
        <AddEmployeeWizard onClose={() => setShowAddWizard(false)} onSave={emp => { setEmployees(p => [...p, emp]); setShowAddWizard(false); }} />
      )}
    </div>
  );
}
