export interface KpiMeasurement {
  module: string;
  feature: string;
  kpi: string;
  howToMeasure: string;
  formula: string;
}

export const kpiMeasurements: KpiMeasurement[] = [
  {
    module: "Documents",
    feature: "Company Documents (Adani standard)",
    kpi: "Document retrieval time",
    howToMeasure: "Converting the PDF opening to HTML viewer will reduce the retrieval time",
    formula: "",
  },
  {
    module: "Documents",
    feature: "Company Documents (Adani standard)",
    kpi: "Compliance rate",
    howToMeasure: "Can be calculated from the date of expiry to time taken to re-validate the same certificate",
    formula: "Compliance Rate (%) = (No. of certificates revalidated on or before expiry / Total expired certificates) × 100",
  },
  {
    module: "Documents",
    feature: "Company Documents (Adani standard)",
    kpi: "User adoption",
    howToMeasure: "Assign certificates to users and extract when they joined as crew per crew scheduling and when they viewed",
    formula: "User Adoption Rate (%) = (No. of users who completed required document actions / Total targeted users) × 100",
  },
  {
    module: "Documents",
    feature: "Vessel Certificates (Expiry alerts & Renewal)",
    kpi: "% certificates renewed on time",
    howToMeasure: "Calculated from the date of expiry to time taken to re-validate the same certificate",
    formula: "Compliance Rate (%) = (No. of certificates revalidated on or before expiry / Total expired certificates) × 100",
  },
  {
    module: "Documents",
    feature: "Vessel Certificates (Expiry alerts & Renewal)",
    kpi: "Alert response time",
    howToMeasure: "Alert sent time and when the concerned person completed the action",
    formula: "",
  },
  {
    module: "Documents",
    feature: "Circulars / Tips",
    kpi: "Read / acknowledge rate",
    howToMeasure: "Assign certificates to users and extract when they joined as crew and when they viewed",
    formula: "User Adoption Rate (%) = (No. of users who completed required document actions / Total targeted users) × 100",
  },
  {
    module: "Documents",
    feature: "Circulars / Tips",
    kpi: "Time to dissemination",
    howToMeasure: "",
    formula: "",
  },
  {
    module: "Documents",
    feature: "Manuals (Vessel / Technical)",
    kpi: "Access frequency",
    howToMeasure: "How frequently the vessel and technical manuals are accessed by the crew. Segregated between vessel manuals and technical manuals separately",
    formula: "Access Frequency Index = Actual Access Count in Period / (Total documents & manuals × total crew assigned for the period)",
  },
  {
    module: "Documents",
    feature: "Manuals (Vessel / Technical)",
    kpi: "Update cycle time",
    howToMeasure: "",
    formula: "",
  },
  {
    module: "Documents",
    feature: "Defect",
    kpi: "Defect closure rate",
    howToMeasure: "Count from the reporting of defect to closure of report",
    formula: "",
  },
  {
    module: "Documents",
    feature: "Defect",
    kpi: "Reporting lag",
    howToMeasure: "Count from occurrence of defect to actual date of reporting",
    formula: "",
  },
  {
    module: "Documents",
    feature: "Statutory Compliance",
    kpi: "Audit pass rate",
    howToMeasure: "Proportion of statutory audits that are successfully passed. Calculated from the number of compliances audited and how many were passed by Audit team",
    formula: "(Number of audits passed / Total Number of Statutory Audits Conducted) × 100",
  },
  {
    module: "Documents",
    feature: "Statutory Compliance",
    kpi: "Non-compliance incidents",
    howToMeasure: "Calculated from the number of compliances audited and how many were considered as not-passed by Audit team",
    formula: "",
  },
];

export function getMeasurement(feature: string, kpi: string): KpiMeasurement | undefined {
  return kpiMeasurements.find(
    (m) => m.feature === feature || (m.kpi.toLowerCase() === kpi.toLowerCase())
  );
}

export function getMeasurementsByModule(module: string): KpiMeasurement[] {
  return kpiMeasurements.filter((m) => m.module === module);
}
