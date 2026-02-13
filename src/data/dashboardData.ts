import { TrendingUp, TrendingDown } from "lucide-react";

export type Severity = "high" | "medium" | "low";
export type TrendDirection = "up" | "down";

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: TrendDirection;
  severity: Severity;
  unit?: string;
}

export interface InsightItem {
  id: string;
  title: string;
  severity: Severity;
  explanation: string;
  action: string;
  category: "ops" | "finance" | "sales" | "product";
  date: string;
  metric?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface PredefinedQuestion {
  id: string;
  question: string;
  category: "operations" | "finance" | "sales" | "leadership";
}

// KPI mock data
export const kpiCards: KpiItem[] = [
  { id: "revenue", title: "Total Revenue (This Month)", value: "₹4.82 Cr", change: 12.4, trend: "up", severity: "low" },
  { id: "tickets", title: "Ticket Backlog (Open Tickets)", value: "247", change: 18, trend: "up", severity: "high" },
  { id: "sla", title: "SLA Breach Risk", value: "14%", change: 5.2, trend: "up", severity: "medium" },
  { id: "customers", title: "Active Customers", value: "1,284", change: 3.1, trend: "up", severity: "low" },
  { id: "cost", title: "Cost Anomaly Alerts", value: "7", change: 40, trend: "up", severity: "high" },
  { id: "delivery", title: "Delivery Performance Score", value: "92%", change: 1.8, trend: "down", severity: "low" },
];

// Revenue trend data
export const revenueTrendData = [
  { month: "Jul", revenue: 320, target: 340 },
  { month: "Aug", revenue: 380, target: 350 },
  { month: "Sep", revenue: 340, target: 360 },
  { month: "Oct", revenue: 420, target: 370 },
  { month: "Nov", revenue: 390, target: 380 },
  { month: "Dec", revenue: 460, target: 400 },
  { month: "Jan", revenue: 440, target: 420 },
  { month: "Feb", revenue: 482, target: 430 },
];

// Ticket backlog data
export const ticketBacklogData = [
  { week: "W1", open: 180, closed: 165 },
  { week: "W2", open: 210, closed: 190 },
  { week: "W3", open: 195, closed: 205 },
  { week: "W4", open: 230, closed: 200 },
  { week: "W5", open: 220, closed: 215 },
  { week: "W6", open: 247, closed: 210 },
];

// SLA breakdown data
export const slaBreakdownData = [
  { name: "On Track", value: 62, fill: "hsl(152, 55%, 42%)" },
  { name: "At Risk", value: 24, fill: "hsl(38, 92%, 50%)" },
  { name: "Breached", value: 14, fill: "hsl(0, 72%, 55%)" },
];

// Cost spike data
export const costSpikeData = [
  { day: "Mon", actual: 42, baseline: 38 },
  { day: "Tue", actual: 39, baseline: 38 },
  { day: "Wed", actual: 55, baseline: 40 },
  { day: "Thu", actual: 48, baseline: 39 },
  { day: "Fri", actual: 62, baseline: 41 },
  { day: "Sat", actual: 38, baseline: 35 },
  { day: "Sun", actual: 35, baseline: 34 },
];

// Insights
export const insightsData: InsightItem[] = [
  {
    id: "i1",
    title: "Ticket Backlog Surge",
    severity: "high",
    explanation: "Ticket backlog increased 18% WoW. At current resolution rate, SLA breach risk in 5 days.",
    action: "Escalate to operations lead",
    category: "ops",
    date: "2026-02-13",
    metric: "247 open tickets",
  },
  {
    id: "i2",
    title: "Cost Anomaly Detected",
    severity: "high",
    explanation: "Procurement costs spiked 40% on Friday. Potential duplicate PO entries from Vessel MV-Adani-9.",
    action: "Review PO entries",
    category: "finance",
    date: "2026-02-12",
    metric: "₹12.4L over budget",
  },
  {
    id: "i3",
    title: "Revenue Growth Positive",
    severity: "low",
    explanation: "Monthly revenue trending 12.4% above target. Key driver: increased charter rates in Q4.",
    action: "View revenue breakdown",
    category: "sales",
    date: "2026-02-13",
    metric: "₹4.82 Cr",
  },
  {
    id: "i4",
    title: "SLA Compliance Declining",
    severity: "medium",
    explanation: "SLA compliance dropped from 91% to 86% over last 2 weeks. Documents module most affected.",
    action: "Review SLA metrics",
    category: "ops",
    date: "2026-02-11",
    metric: "86% compliance",
  },
  {
    id: "i5",
    title: "Vessel Certificate Renewal Risk",
    severity: "medium",
    explanation: "3 vessel certificates expiring within 15 days. Auto-renewal alerts sent but no acknowledgement.",
    action: "Notify vessel managers",
    category: "ops",
    date: "2026-02-10",
    metric: "3 certificates at risk",
  },
  {
    id: "i6",
    title: "Inventory Stockout Warning",
    severity: "high",
    explanation: "Spare parts inventory for 2 critical components below minimum threshold. Lead time: 21 days.",
    action: "Create emergency requisition",
    category: "ops",
    date: "2026-02-09",
    metric: "2 items critical",
  },
  {
    id: "i7",
    title: "Customer Retention Stable",
    severity: "low",
    explanation: "Active customer count grew 3.1% MoM. Churn rate at historic low of 1.2%.",
    action: "View customer analytics",
    category: "sales",
    date: "2026-02-13",
    metric: "1,284 active",
  },
  {
    id: "i8",
    title: "Budget Utilization on Track",
    severity: "low",
    explanation: "Overall budget utilization at 78% through month 11. Projected to finish at 95% of annual allocation.",
    action: "View budget report",
    category: "finance",
    date: "2026-02-08",
    metric: "78% utilized",
  },
];

// Predefined chat questions
export const predefinedQuestions: PredefinedQuestion[] = [
  { id: "q1", question: "What is the current ticket backlog?", category: "operations" },
  { id: "q2", question: "Are SLA breaches increasing?", category: "operations" },
  { id: "q3", question: "Which module has most escalations?", category: "operations" },
  { id: "q4", question: "Any cost anomalies this week?", category: "finance" },
  { id: "q5", question: "What is burn rate vs budget?", category: "finance" },
  { id: "q6", question: "How is revenue trending this month?", category: "sales" },
  { id: "q7", question: "Top 5 customers by revenue", category: "sales" },
  { id: "q8", question: "Top 3 risks for next 30 days", category: "leadership" },
  { id: "q9", question: "What changed since last week?", category: "leadership" },
];

// Mock AI responses
export const aiResponses: Record<string, string> = {
  "q1": "**Current Ticket Backlog: 247 Open Tickets**\n\nBreakdown by module:\n- Documents: 89 tickets (36%)\n- Procurement: 72 tickets (29%)\n- Maintenance: 54 tickets (22%)\n- Reports: 32 tickets (13%)\n\n📈 The backlog has increased by 18% week-over-week. At current resolution rates, we project a potential SLA breach within 5 business days.\n\n**Recommendation:** Allocate additional resources to the Documents module, which has the highest volume.",
  "q2": "**SLA Breach Trend: Increasing ⚠️**\n\nCurrent SLA compliance: **86%** (down from 91% two weeks ago)\n\nBreakdown:\n- ✅ On Track: 62%\n- ⚠️ At Risk: 24%\n- ❌ Breached: 14%\n\nThe Documents module accounts for 60% of at-risk tickets. Primary causes:\n1. Delayed certificate renewals\n2. Increased statutory compliance workload\n3. Pending acknowledgements on mandatory reads\n\n**Action Required:** Immediate review of Documents module SLAs and resource allocation.",
  "q3": "**Module Escalation Analysis**\n\nTop escalation sources (Last 30 days):\n\n| Module | Escalations | % Change |\n|--------|-------------|----------|\n| Documents | 42 | +15% |\n| Procurement | 28 | +8% |\n| Maintenance | 19 | -3% |\n| Reports | 11 | +2% |\n\nDocuments module leads with **42 escalations**, primarily from:\n- Vessel certificate renewals (18)\n- Statutory compliance delays (14)\n- SOP update failures (10)",
  "q4": "**Cost Anomaly Report - This Week**\n\n🔴 **7 anomalies detected** (40% increase from last week)\n\nTop anomalies:\n1. **Procurement PO Spike** - ₹12.4L over budget on Friday. Duplicate PO entries suspected from Vessel MV-Adani-9.\n2. **Maintenance Parts** - Emergency spare parts order 3x normal cost due to expedited shipping.\n3. **Fuel Costs** - 22% above baseline for fleet segment B.\n\nTotal excess spend: **₹18.7L** above projected baseline.\n\n**Immediate Action:** Review procurement entries for MV-Adani-9 and verify fuel consumption logs.",
  "q5": "**Burn Rate vs Budget Analysis**\n\n📊 **Current Fiscal Year Progress: Month 11 of 12**\n\n| Category | Budget | Spent | Utilization |\n|----------|--------|-------|------------|\n| Operations | ₹24.5 Cr | ₹19.1 Cr | 78% |\n| Procurement | ₹18.2 Cr | ₹15.4 Cr | 85% |\n| Maintenance | ₹12.8 Cr | ₹10.2 Cr | 80% |\n| Admin | ₹3.5 Cr | ₹2.8 Cr | 80% |\n\n**Overall: 78% utilized** — on track to finish at ~95% of annual allocation.\n\n✅ No budget overruns projected for current fiscal year.",
  "q6": "**Revenue Trend - February 2026**\n\n📈 **₹4.82 Cr** (12.4% above target)\n\nMonthly progression:\n- October: ₹4.20 Cr\n- November: ₹3.90 Cr\n- December: ₹4.60 Cr\n- January: ₹4.40 Cr\n- **February (MTD): ₹4.82 Cr**\n\nKey drivers:\n1. Charter rate increase (+8% avg)\n2. New customer onboarding (12 accounts)\n3. Reduced operational downtime\n\nProjected end-of-quarter: **₹14.6 Cr** (vs target ₹13.2 Cr)",
  "q7": "**Top 5 Customers by Revenue (FY 2025-26)**\n\n| Rank | Customer | Revenue | % of Total |\n|------|----------|---------|------------|\n| 1 | Adani Ports | ₹8.4 Cr | 18.2% |\n| 2 | JSW Infrastructure | ₹6.2 Cr | 13.4% |\n| 3 | DP World | ₹5.1 Cr | 11.0% |\n| 4 | APM Terminals | ₹4.8 Cr | 10.4% |\n| 5 | Mundra Port | ₹3.9 Cr | 8.5% |\n\nTop 5 contribute **61.5%** of total revenue.\n\n⚠️ Concentration risk: 31.6% from top 2 customers alone.",
  "q8": "**Top 3 Risks - Next 30 Days**\n\n🔴 **1. SLA Breach Cascade (Probability: HIGH)**\nTicket backlog at 247 with 18% WoW growth. If unaddressed, 14% breach rate could reach 25% within 3 weeks.\n\n🟡 **2. Vessel Certification Lapse (Probability: MEDIUM)**\n3 vessel certificates expiring without acknowledgement. Regulatory non-compliance risk if not renewed.\n\n🟡 **3. Spare Parts Stockout (Probability: MEDIUM)**\n2 critical components below minimum stock. 21-day lead time means potential maintenance delays.\n\n**Executive Summary:** Prioritize ticket backlog resolution and certificate renewals immediately.",
  "q9": "**Weekly Change Summary (Feb 6 → Feb 13)**\n\n📊 **Key Metrics Movement:**\n\n| Metric | Last Week | This Week | Change |\n|--------|-----------|-----------|--------|\n| Open Tickets | 209 | 247 | +18% ⬆️ |\n| SLA Compliance | 89% | 86% | -3% ⬇️ |\n| Revenue (MTD) | ₹2.1 Cr | ₹4.82 Cr | +130% ⬆️ |\n| Cost Anomalies | 5 | 7 | +40% ⬆️ |\n| Active Customers | 1,245 | 1,284 | +3.1% ⬆️ |\n\n🔑 **Notable Changes:**\n1. Ticket backlog spike driven by Documents module\n2. Revenue ahead of projections\n3. New cost anomalies in procurement need review",
};

// Drill-down metrics data
export const drillDownMetrics = [
  { id: 1, module: "Documents", feature: "Vessel Certificates", metric: "Renewal Rate", value: "87%", trend: -3.2, region: "West", department: "Operations" },
  { id: 2, module: "Documents", feature: "SOPs", metric: "Adherence", value: "92%", trend: 1.5, region: "North", department: "Compliance" },
  { id: 3, module: "Procurement", feature: "Create PO", metric: "Cycle Time", value: "4.2 days", trend: -8, region: "West", department: "Procurement" },
  { id: 4, module: "Procurement", feature: "Invoice Integration", metric: "Processing Time", value: "2.1 days", trend: 12, region: "South", department: "Finance" },
  { id: 5, module: "Reports", feature: "Vessel Daily Report", metric: "Submission Rate", value: "96%", trend: 2.1, region: "East", department: "Operations" },
  { id: 6, module: "Maintenance", feature: "PMS Assignment", metric: "Completion Rate", value: "78%", trend: -5.4, region: "North", department: "Maintenance" },
  { id: 7, module: "Maintenance", feature: "Inventory", metric: "Stockout Rate", value: "8%", trend: 15, region: "West", department: "Procurement" },
  { id: 8, module: "Documents", feature: "Statutory Compliance", metric: "Audit Pass Rate", value: "94%", trend: 0.5, region: "South", department: "Compliance" },
  { id: 9, module: "Reports", feature: "Rest Hours", metric: "Compliance", value: "98%", trend: 1.0, region: "East", department: "HR" },
  { id: 10, module: "Procurement", feature: "Vetting", metric: "Vendor Approval Time", value: "6.5 days", trend: -12, region: "North", department: "Procurement" },
];

// Admin intent config data
export interface AdminIntent {
  id: string;
  question: string;
  insightId: string;
  enabled: boolean;
  threshold?: string;
  category: string;
}

export const adminIntents: AdminIntent[] = [
  { id: "ai1", question: "What is the current ticket backlog?", insightId: "i1", enabled: true, threshold: "Backlog > 200 triggers HIGH", category: "Operations" },
  { id: "ai2", question: "Are SLA breaches increasing?", insightId: "i4", enabled: true, threshold: "Compliance < 85% triggers HIGH", category: "Operations" },
  { id: "ai3", question: "Any cost anomalies this week?", insightId: "i2", enabled: true, threshold: "Anomaly count > 5 triggers HIGH", category: "Finance" },
  { id: "ai4", question: "How is revenue trending?", insightId: "i3", enabled: true, threshold: "Revenue < target triggers MEDIUM", category: "Sales" },
  { id: "ai5", question: "Top 3 risks for next 30 days", insightId: "i8", enabled: true, category: "Leadership" },
  { id: "ai6", question: "Which module has most escalations?", insightId: "i1", enabled: false, category: "Operations" },
  { id: "ai7", question: "What is burn rate vs budget?", insightId: "i8", enabled: true, threshold: "Utilization > 90% triggers HIGH", category: "Finance" },
  { id: "ai8", question: "Top 5 customers by revenue", insightId: "i7", enabled: true, category: "Sales" },
];
