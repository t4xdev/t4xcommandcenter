// ─── Designation Master Settings ───
export interface DesignationWage {
  designation: string;
  category: "seafarer" | "shore";
  department: string;
  wages: {
    year: number;
    basic: number;
    hra: number;
    seaAllowance: number;
    leavePay: number;
    specialAllowance: number;
    totalMonthly: number;
  }[];
}

export const designationMaster: DesignationWage[] = [
  // Seafarer designations
  {
    designation: "Master", category: "seafarer", department: "Operations",
    wages: [
      { year: 2026, basic: 150000, hra: 0, seaAllowance: 60000, leavePay: 35000, specialAllowance: 25000, totalMonthly: 270000 },
      { year: 2027, basic: 157500, hra: 0, seaAllowance: 63000, leavePay: 36750, specialAllowance: 26250, totalMonthly: 283500 },
      { year: 2028, basic: 165375, hra: 0, seaAllowance: 66150, leavePay: 38588, specialAllowance: 27563, totalMonthly: 297676 },
    ],
  },
  {
    designation: "Chief Engineer", category: "seafarer", department: "Engineering",
    wages: [
      { year: 2026, basic: 130000, hra: 0, seaAllowance: 52000, leavePay: 30000, specialAllowance: 22000, totalMonthly: 234000 },
      { year: 2027, basic: 136500, hra: 0, seaAllowance: 54600, leavePay: 31500, specialAllowance: 23100, totalMonthly: 245700 },
      { year: 2028, basic: 143325, hra: 0, seaAllowance: 57330, leavePay: 33075, specialAllowance: 24255, totalMonthly: 257985 },
    ],
  },
  {
    designation: "Chief Officer", category: "seafarer", department: "Operations",
    wages: [
      { year: 2026, basic: 110000, hra: 0, seaAllowance: 44000, leavePay: 26000, specialAllowance: 20000, totalMonthly: 200000 },
      { year: 2027, basic: 115500, hra: 0, seaAllowance: 46200, leavePay: 27300, specialAllowance: 21000, totalMonthly: 210000 },
      { year: 2028, basic: 121275, hra: 0, seaAllowance: 48510, leavePay: 28665, specialAllowance: 22050, totalMonthly: 220500 },
    ],
  },
  {
    designation: "2nd Engineer", category: "seafarer", department: "Engineering",
    wages: [
      { year: 2026, basic: 95000, hra: 0, seaAllowance: 38000, leavePay: 22000, specialAllowance: 18000, totalMonthly: 173000 },
      { year: 2027, basic: 99750, hra: 0, seaAllowance: 39900, leavePay: 23100, specialAllowance: 18900, totalMonthly: 181650 },
      { year: 2028, basic: 104738, hra: 0, seaAllowance: 41895, leavePay: 24255, specialAllowance: 19845, totalMonthly: 190733 },
    ],
  },
  {
    designation: "2nd Officer", category: "seafarer", department: "Operations",
    wages: [
      { year: 2026, basic: 75000, hra: 0, seaAllowance: 30000, leavePay: 18000, specialAllowance: 15000, totalMonthly: 138000 },
      { year: 2027, basic: 78750, hra: 0, seaAllowance: 31500, leavePay: 18900, specialAllowance: 15750, totalMonthly: 144900 },
      { year: 2028, basic: 82688, hra: 0, seaAllowance: 33075, leavePay: 19845, specialAllowance: 16538, totalMonthly: 152146 },
    ],
  },
  {
    designation: "3rd Officer", category: "seafarer", department: "Operations",
    wages: [
      { year: 2026, basic: 60000, hra: 0, seaAllowance: 24000, leavePay: 14000, specialAllowance: 12000, totalMonthly: 110000 },
      { year: 2027, basic: 63000, hra: 0, seaAllowance: 25200, leavePay: 14700, specialAllowance: 12600, totalMonthly: 115500 },
      { year: 2028, basic: 66150, hra: 0, seaAllowance: 26460, leavePay: 15435, specialAllowance: 13230, totalMonthly: 121275 },
    ],
  },
  {
    designation: "Safety Officer", category: "seafarer", department: "QHSE",
    wages: [
      { year: 2026, basic: 85000, hra: 0, seaAllowance: 34000, leavePay: 20000, specialAllowance: 16000, totalMonthly: 155000 },
      { year: 2027, basic: 89250, hra: 0, seaAllowance: 35700, leavePay: 21000, specialAllowance: 16800, totalMonthly: 162750 },
      { year: 2028, basic: 93713, hra: 0, seaAllowance: 37485, leavePay: 22050, specialAllowance: 17640, totalMonthly: 170888 },
    ],
  },
  {
    designation: "Junior Engineer", category: "seafarer", department: "Engineering",
    wages: [
      { year: 2026, basic: 35000, hra: 0, seaAllowance: 14000, leavePay: 8000, specialAllowance: 8000, totalMonthly: 65000 },
      { year: 2027, basic: 36750, hra: 0, seaAllowance: 14700, leavePay: 8400, specialAllowance: 8400, totalMonthly: 68250 },
      { year: 2028, basic: 38588, hra: 0, seaAllowance: 15435, leavePay: 8820, specialAllowance: 8820, totalMonthly: 71663 },
    ],
  },
  {
    designation: "Bosun", category: "seafarer", department: "Operations",
    wages: [
      { year: 2026, basic: 30000, hra: 0, seaAllowance: 12000, leavePay: 7000, specialAllowance: 6000, totalMonthly: 55000 },
      { year: 2027, basic: 31500, hra: 0, seaAllowance: 12600, leavePay: 7350, specialAllowance: 6300, totalMonthly: 57750 },
      { year: 2028, basic: 33075, hra: 0, seaAllowance: 13230, leavePay: 7718, specialAllowance: 6615, totalMonthly: 60638 },
    ],
  },
  {
    designation: "AB Seaman", category: "seafarer", department: "Operations",
    wages: [
      { year: 2026, basic: 25000, hra: 0, seaAllowance: 10000, leavePay: 6000, specialAllowance: 5000, totalMonthly: 46000 },
      { year: 2027, basic: 26250, hra: 0, seaAllowance: 10500, leavePay: 6300, specialAllowance: 5250, totalMonthly: 48300 },
      { year: 2028, basic: 27563, hra: 0, seaAllowance: 11025, leavePay: 6615, specialAllowance: 5513, totalMonthly: 50716 },
    ],
  },
  {
    designation: "Oiler", category: "seafarer", department: "Engineering",
    wages: [
      { year: 2026, basic: 22000, hra: 0, seaAllowance: 8800, leavePay: 5000, specialAllowance: 4200, totalMonthly: 40000 },
      { year: 2027, basic: 23100, hra: 0, seaAllowance: 9240, leavePay: 5250, specialAllowance: 4410, totalMonthly: 42000 },
      { year: 2028, basic: 24255, hra: 0, seaAllowance: 9702, leavePay: 5513, specialAllowance: 4631, totalMonthly: 44101 },
    ],
  },
  // Shore designations
  {
    designation: "General Manager", category: "shore", department: "Management",
    wages: [
      { year: 2026, basic: 100000, hra: 50000, seaAllowance: 0, leavePay: 0, specialAllowance: 50000, totalMonthly: 200000 },
      { year: 2027, basic: 110000, hra: 55000, seaAllowance: 0, leavePay: 0, specialAllowance: 55000, totalMonthly: 220000 },
      { year: 2028, basic: 121000, hra: 60500, seaAllowance: 0, leavePay: 0, specialAllowance: 60500, totalMonthly: 242000 },
    ],
  },
  {
    designation: "Manager", category: "shore", department: "Management",
    wages: [
      { year: 2026, basic: 60000, hra: 30000, seaAllowance: 0, leavePay: 0, specialAllowance: 30000, totalMonthly: 120000 },
      { year: 2027, basic: 63000, hra: 31500, seaAllowance: 0, leavePay: 0, specialAllowance: 31500, totalMonthly: 126000 },
      { year: 2028, basic: 66150, hra: 33075, seaAllowance: 0, leavePay: 0, specialAllowance: 33075, totalMonthly: 132300 },
    ],
  },
  {
    designation: "HR Executive", category: "shore", department: "HR",
    wages: [
      { year: 2026, basic: 35000, hra: 17500, seaAllowance: 0, leavePay: 0, specialAllowance: 17500, totalMonthly: 70000 },
      { year: 2027, basic: 36750, hra: 18375, seaAllowance: 0, leavePay: 0, specialAllowance: 18375, totalMonthly: 73500 },
      { year: 2028, basic: 38588, hra: 19294, seaAllowance: 0, leavePay: 0, specialAllowance: 19294, totalMonthly: 77176 },
    ],
  },
  {
    designation: "Accounts Officer", category: "shore", department: "Finance",
    wages: [
      { year: 2026, basic: 40000, hra: 20000, seaAllowance: 0, leavePay: 0, specialAllowance: 20000, totalMonthly: 80000 },
      { year: 2027, basic: 42000, hra: 21000, seaAllowance: 0, leavePay: 0, specialAllowance: 21000, totalMonthly: 84000 },
      { year: 2028, basic: 44100, hra: 22050, seaAllowance: 0, leavePay: 0, specialAllowance: 22050, totalMonthly: 88200 },
    ],
  },
  {
    designation: "Technical Superintendent", category: "shore", department: "Engineering",
    wages: [
      { year: 2026, basic: 80000, hra: 40000, seaAllowance: 0, leavePay: 0, specialAllowance: 35000, totalMonthly: 155000 },
      { year: 2027, basic: 84000, hra: 42000, seaAllowance: 0, leavePay: 0, specialAllowance: 36750, totalMonthly: 162750 },
      { year: 2028, basic: 88200, hra: 44100, seaAllowance: 0, leavePay: 0, specialAllowance: 38588, totalMonthly: 170888 },
    ],
  },
];

// ─── Salary Adjustment Types ───
export interface SalaryAdjustment {
  id: string;
  employeeId: string;
  month: string; // e.g. "Mar 2026"
  type: "bonus_withheld" | "bonus_added" | "deduction" | "carried_forward" | "reimbursement";
  label: string;
  amount: number;
  reason: string;
  createdBy: string;
  createdAt: string;
  status: "pending" | "applied" | "reversed";
}

export const mockAdjustments: SalaryAdjustment[] = [
  { id: "adj1", employeeId: "1", month: "Mar 2026", type: "bonus_withheld", label: "Performance Bonus Withheld", amount: 15000, reason: "Pending performance review completion", createdBy: "Admin", createdAt: "2026-03-20", status: "applied" },
  { id: "adj2", employeeId: "2", month: "Mar 2026", type: "deduction", label: "Uniform Cost Deduction", amount: 3500, reason: "New safety gear issued", createdBy: "Admin", createdAt: "2026-03-18", status: "applied" },
  { id: "adj3", employeeId: "4", month: "Mar 2026", type: "bonus_added", label: "Spot Bonus", amount: 10000, reason: "Outstanding safety inspection record", createdBy: "Admin", createdAt: "2026-03-22", status: "applied" },
  { id: "adj4", employeeId: "1", month: "Apr 2026", type: "carried_forward", label: "Withheld Bonus (from Mar)", amount: 15000, reason: "Carried forward from March — pending review", createdBy: "System", createdAt: "2026-04-01", status: "pending" },
  { id: "adj5", employeeId: "3", month: "Mar 2026", type: "deduction", label: "Leave Without Pay", amount: 8000, reason: "5 days LWP", createdBy: "Admin", createdAt: "2026-03-25", status: "applied" },
  { id: "adj6", employeeId: "6", month: "Mar 2026", type: "reimbursement", label: "Travel Reimbursement", amount: -5000, reason: "Joining travel expense", createdBy: "Admin", createdAt: "2026-03-15", status: "applied" },
];

// Helper to get designation wages for a given year
export function getDesignationWage(designation: string, year: number = 2026) {
  const d = designationMaster.find(dm => dm.designation === designation);
  if (!d) return null;
  return d.wages.find(w => w.year === year) || d.wages[0];
}

export function getDesignationInfo(designation: string) {
  return designationMaster.find(dm => dm.designation === designation) || null;
}
