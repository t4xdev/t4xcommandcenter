// Survey Planner Data — extracted from SSIDL Legal Register

export type SurveyType =
  | "Annual Survey"
  | "Intermediate Docking Survey"
  | "Docking Survey"
  | "Direction Propeller"
  | "CSM/CSH"
  | "FSI";

export interface SurveyDate {
  month: string; // e.g. "Apr-25"
  date: string;  // e.g. "16-04-25"
}

export interface VesselSurvey {
  type: SurveyType;
  dates: SurveyDate[];
}

export interface SurveyVessel {
  name: string;
  imo: string;
  surveys: VesselSurvey[];
}

export const surveyMonths = [
  "Apr-25","May-25","Jun-25","Jul-25","Aug-25","Sep-25","Oct-25","Nov-25","Dec-25",
  "Jan-26","Feb-26","Mar-26","Apr-26","May-26","Jun-26","Jul-26","Aug-26","Sep-26",
  "Oct-26","Nov-26","Dec-26","Jan-27","Feb-27","Mar-27","Apr-27","May-27","Jun-27",
  "Jul-27","Aug-27","Sep-27","Oct-27","Nov-27","Dec-27","Jan-28","Feb-28","Mar-28",
  "Apr-28","May-28","Jun-28","Jul-28","Aug-28","Sep-28","Oct-28","Nov-28","Dec-28",
  "Jan-29","Feb-29","Mar-29","Apr-29","May-29","Jun-29","Jul-29","Aug-29","Sep-29",
  "Oct-29","Nov-29","Dec-29","Jan-30","Feb-30","Mar-30","Apr-30","May-30","Jun-30",
  "Jul-30","Aug-30","Sep-30","Oct-30","Nov-30","Dec-30",
];

export const surveyVessels: SurveyVessel[] = [
  {
    name: "Dolphin No. 7", imo: "9439565",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Apr-25", date: "16-04-25" },{ month: "Jul-25", date: "16-07-25" },{ month: "Apr-26", date: "16-04-26" },{ month: "Jul-26", date: "16-07-26" },{ month: "Apr-27", date: "16-04-27" }] },
      { type: "Intermediate Docking Survey", dates: [] },
      { type: "Docking Survey", dates: [{ month: "Apr-27", date: "16-04-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Apr-27", date: "16-04-27" }] },
      { type: "CSM/CSH", dates: [{ month: "Apr-27", date: "16-04-27" }] },
      { type: "FSI", dates: [{ month: "Oct-26", date: "16-10-2026" }] },
    ],
  },
  {
    name: "Dolphin No. 20", imo: "9626780",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Mar-26", date: "06-03-26" },{ month: "May-26", date: "27-05-26" },{ month: "Mar-27", date: "06-03-27" }] },
      { type: "Intermediate Docking Survey", dates: [] },
      { type: "Docking Survey", dates: [{ month: "Feb-27", date: "27-02-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Feb-27", date: "27-02-27" }] },
      { type: "CSM/CSH", dates: [{ month: "Feb-27", date: "27-02-27" }] },
      { type: "FSI", dates: [{ month: "Aug-26", date: "27-08-2026" }] },
    ],
  },
  {
    name: "Dolphin No. 21", imo: "9626792",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Apr-26", date: "12-04-26" },{ month: "Jul-26", date: "12-07-26" },{ month: "Apr-27", date: "12-04-27" }] },
      { type: "Intermediate Docking Survey", dates: [] },
      { type: "Docking Survey", dates: [{ month: "Apr-27", date: "12-04-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Apr-27", date: "12-04-27" }] },
      { type: "CSM/CSH", dates: [{ month: "Apr-27", date: "12-04-27" }] },
      { type: "FSI", dates: [{ month: "Aug-26", date: "27-08-2026" }] },
    ],
  },
  {
    name: "Dolphin No. 23", imo: "9644873",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Dec-25", date: "18-12-25" },{ month: "Mar-26", date: "18-03-26" },{ month: "Dec-26", date: "18-12-26" },{ month: "Mar-27", date: "18-03-27" },{ month: "Dec-27", date: "18-12-27" }] },
      { type: "Intermediate Docking Survey", dates: [] },
      { type: "Docking Survey", dates: [{ month: "Dec-27", date: "12-12-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Dec-27", date: "12-12-27" }] },
      { type: "CSM/CSH", dates: [{ month: "Dec-27", date: "12-12-27" }] },
      { type: "FSI", dates: [{ month: "Jun-26", date: "18-06-2026" }] },
    ],
  },
  {
    name: "Dolphin No. 38", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Dec-25", date: "24-12-25" },{ month: "Mar-26", date: "24-03-26" },{ month: "Dec-26", date: "24-12-26" },{ month: "Mar-27", date: "24-03-27" },{ month: "Dec-27", date: "24-12-27" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Dec-25", date: "24-12-25" },{ month: "Mar-26", date: "24-03-26" }] },
      { type: "Docking Survey", dates: [{ month: "Dec-27", date: "24-12-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Dec-27", date: "24-12-27" }] },
      { type: "CSM/CSH", dates: [{ month: "Dec-27", date: "24-12-27" }] },
      { type: "FSI", dates: [{ month: "Jun-26", date: "01-06-26" }] },
    ],
  },
  {
    name: "Dolphin No. 4", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Sep-25", date: "20-09-25" },{ month: "Dec-25", date: "20-12-25" },{ month: "Sep-26", date: "20-09-26" },{ month: "Dec-26", date: "20-12-26" },{ month: "Sep-27", date: "20-09-27" },{ month: "Dec-27", date: "20-12-27" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Sep-27", date: "20-09-27" },{ month: "Dec-27", date: "20-12-27" }] },
      { type: "Docking Survey", dates: [{ month: "Dec-27", date: "13-12-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Dec-29", date: "13-12-29" }] },
      { type: "CSM/CSH", dates: [{ month: "Dec-29", date: "13-12-29" }] },
      { type: "FSI", dates: [{ month: "Mar-28", date: "20-03-28" }] },
    ],
  },
  {
    name: "Dolphin No. 10", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Mar-26", date: "30-03-26" },{ month: "Jun-26", date: "30-06-26" },{ month: "Mar-27", date: "30-03-27" },{ month: "Jun-27", date: "30-06-27" },{ month: "Mar-28", date: "30-03-28" },{ month: "Jun-28", date: "30-06-28" },{ month: "Mar-29", date: "30-03-29" },{ month: "Jun-29", date: "30-06-29" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Mar-27", date: "30-03-27" },{ month: "Jun-27", date: "30-06-27" }] },
      { type: "Docking Survey", dates: [{ month: "Feb-27", date: "25-02-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Feb-29", date: "25-02-29" }] },
      { type: "CSM/CSH", dates: [{ month: "Feb-29", date: "25-02-29" }] },
      { type: "FSI", dates: [{ month: "Jun-27", date: "30-06-27" }] },
    ],
  },
  {
    name: "Dolphin No. 11", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Jun-25", date: "09-06-25" },{ month: "Sep-25", date: "09-09-25" },{ month: "Jun-26", date: "09-06-26" },{ month: "Sep-26", date: "09-09-26" },{ month: "Jun-27", date: "09-06-27" },{ month: "Sep-27", date: "09-09-27" },{ month: "Jun-28", date: "09-06-28" },{ month: "Sep-28", date: "09-09-28" },{ month: "Jun-29", date: "09-06-29" },{ month: "Sep-29", date: "09-09-29" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Jun-27", date: "09-06-27" },{ month: "Sep-27", date: "09-09-27" }] },
      { type: "Docking Survey", dates: [{ month: "Jun-27", date: "13-06-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Jun-29", date: "09-06-29" }] },
      { type: "CSM/CSH", dates: [{ month: "Jun-29", date: "13-06-29" }] },
      { type: "FSI", dates: [{ month: "Sep-27", date: "09-09-27" }] },
    ],
  },
  {
    name: "Dolphin No. 15", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Nov-25", date: "07-11-25" },{ month: "Feb-26", date: "07-02-26" },{ month: "Nov-26", date: "07-11-26" },{ month: "Feb-27", date: "07-02-27" },{ month: "Nov-27", date: "07-11-27" },{ month: "Feb-28", date: "07-02-28" },{ month: "Nov-28", date: "07-11-28" },{ month: "Feb-29", date: "07-02-29" },{ month: "Nov-29", date: "07-11-29" },{ month: "Feb-30", date: "07-02-30" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Nov-28", date: "07-11-28" },{ month: "Feb-29", date: "07-02-29" }] },
      { type: "Docking Survey", dates: [{ month: "Oct-28", date: "28-10-28" }] },
      { type: "Direction Propeller", dates: [{ month: "Nov-30", date: "07-11-30" }] },
      { type: "CSM/CSH", dates: [{ month: "Oct-30", date: "28-10-30" }] },
      { type: "FSI", dates: [{ month: "Jul-28", date: "02-07-28" }] },
    ],
  },
  {
    name: "Dolphin No. 16", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Mar-26", date: "22-03-26" },{ month: "Jun-26", date: "22-06-26" },{ month: "Mar-27", date: "22-03-27" },{ month: "Jun-27", date: "22-06-27" },{ month: "Mar-28", date: "22-03-28" },{ month: "Jun-28", date: "22-06-28" },{ month: "Mar-29", date: "22-03-29" },{ month: "Jun-29", date: "22-06-29" },{ month: "Mar-30", date: "22-03-30" },{ month: "Jun-30", date: "22-06-30" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Mar-27", date: "22-03-27" },{ month: "Jun-27", date: "22-06-27" }] },
      { type: "Docking Survey", dates: [{ month: "Dec-28", date: "26-12-28" }] },
      { type: "Direction Propeller", dates: [{ month: "Dec-30", date: "26-12-30" }] },
      { type: "CSM/CSH", dates: [{ month: "Dec-30", date: "26-12-30" }] },
      { type: "FSI", dates: [{ month: "Sep-27", date: "22-09-27" }] },
    ],
  },
  {
    name: "Dolphin No. 17", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Apr-25", date: "19-04-25" },{ month: "Jul-25", date: "19-07-25" },{ month: "Apr-26", date: "19-04-26" },{ month: "Jul-26", date: "19-07-26" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Apr-26", date: "19-04-26" },{ month: "Jul-26", date: "19-07-26" }] },
      { type: "Docking Survey", dates: [{ month: "Jul-26", date: "19-07-26" }] },
      { type: "Direction Propeller", dates: [{ month: "Aug-26", date: "02-08-26" }] },
      { type: "CSM/CSH", dates: [{ month: "Jul-26", date: "19-07-26" }] },
      { type: "FSI", dates: [] },
    ],
  },
  {
    name: "Dolphin No. 18", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Sep-25", date: "26-09-25" },{ month: "Dec-25", date: "26-12-25" },{ month: "Sep-26", date: "26-09-26" },{ month: "Dec-26", date: "26-12-26" }] },
      { type: "Intermediate Docking Survey", dates: [] },
      { type: "Docking Survey", dates: [{ month: "Sep-26", date: "26-09-26" }] },
      { type: "Direction Propeller", dates: [{ month: "Sep-26", date: "26-09-26" }] },
      { type: "CSM/CSH", dates: [{ month: "Sep-26", date: "13-09-26" }] },
      { type: "FSI", dates: [] },
    ],
  },
  {
    name: "Dolphin No. 33", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Sep-25", date: "06-09-25" },{ month: "Dec-25", date: "06-12-25" },{ month: "Sep-26", date: "06-09-26" },{ month: "Dec-26", date: "06-12-26" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Sep-26", date: "06-09-26" }] },
      { type: "Docking Survey", dates: [{ month: "Sep-26", date: "06-09-26" }] },
      { type: "Direction Propeller", dates: [{ month: "Sep-26", date: "06-09-26" }] },
      { type: "CSM/CSH", dates: [{ month: "Sep-26", date: "06-09-26" }] },
      { type: "FSI", dates: [] },
    ],
  },
  {
    name: "Dolphin No. 37", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Oct-25", date: "13-10-25" },{ month: "Jan-26", date: "13-01-26" },{ month: "Oct-26", date: "13-10-26" },{ month: "Jan-27", date: "13-01-27" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Jan-27", date: "13-01-27" }] },
      { type: "Docking Survey", dates: [{ month: "Oct-27", date: "13-10-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Oct-27", date: "13-10-27" }] },
      { type: "CSM/CSH", dates: [{ month: "Oct-27", date: "13-10-27" }] },
      { type: "FSI", dates: [] },
    ],
  },
  {
    name: "Dolphin No. 42", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Jun-25", date: "09-06-25" },{ month: "Sep-25", date: "09-09-25" },{ month: "Jun-26", date: "09-06-26" },{ month: "Sep-26", date: "09-09-26" },{ month: "Jun-27", date: "09-06-27" },{ month: "Sep-27", date: "09-09-27" },{ month: "Jun-28", date: "09-06-28" },{ month: "Sep-28", date: "09-09-28" },{ month: "Jun-29", date: "09-06-29" },{ month: "Sep-29", date: "09-09-29" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Jun-27", date: "09-06-27" },{ month: "Sep-27", date: "09-09-27" }] },
      { type: "Docking Survey", dates: [{ month: "Jun-27", date: "09-06-27" }] },
      { type: "Direction Propeller", dates: [{ month: "Jun-29", date: "09-06-29" }] },
      { type: "CSM/CSH", dates: [{ month: "Jun-29", date: "09-06-29" }] },
      { type: "FSI", dates: [] },
    ],
  },
  {
    name: "Baitarani", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "May-25", date: "16-05-25" },{ month: "Aug-25", date: "16-08-25" },{ month: "May-26", date: "16-05-26" },{ month: "Aug-26", date: "16-08-26" },{ month: "May-27", date: "16-05-27" },{ month: "Aug-27", date: "16-08-27" },{ month: "May-28", date: "16-05-28" },{ month: "Aug-28", date: "16-08-28" },{ month: "May-29", date: "16-05-29" },{ month: "Aug-29", date: "16-08-29" },{ month: "May-30", date: "16-05-30" },{ month: "Aug-30", date: "16-08-30" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "May-28", date: "16-05-28" },{ month: "Aug-28", date: "16-08-28" }] },
      { type: "Docking Survey", dates: [{ month: "May-28", date: "22-05-28" }] },
      { type: "Direction Propeller", dates: [{ month: "May-30", date: "22-05-30" }] },
      { type: "CSM/CSH", dates: [{ month: "May-30", date: "16-05-30" }] },
      { type: "FSI", dates: [{ month: "Nov-27", date: "16-11-27" },{ month: "Nov-29", date: "16-11-29" }] },
    ],
  },
  {
    name: "Brahmani", imo: "",
    surveys: [
      { type: "Annual Survey", dates: [{ month: "Jun-25", date: "28-06-25" },{ month: "Mar-26", date: "28-03-26" },{ month: "Jun-26", date: "28-06-26" },{ month: "Mar-27", date: "28-03-27" },{ month: "Jun-27", date: "28-06-27" },{ month: "Mar-28", date: "28-03-28" },{ month: "Jun-28", date: "28-06-28" },{ month: "Mar-29", date: "28-03-29" },{ month: "Jun-29", date: "28-06-29" },{ month: "Mar-30", date: "28-03-30" },{ month: "Jun-30", date: "28-06-30" }] },
      { type: "Intermediate Docking Survey", dates: [{ month: "Mar-28", date: "28-03-28" },{ month: "Jun-28", date: "28-06-28" }] },
      { type: "Docking Survey", dates: [{ month: "Mar-30", date: "28-03-30" }] },
      { type: "Direction Propeller", dates: [{ month: "Mar-30", date: "14-03-30" }] },
      { type: "CSM/CSH", dates: [{ month: "Mar-30", date: "28-03-30" }] },
      { type: "FSI", dates: [{ month: "Sep-27", date: "28-09-27" },{ month: "Sep-29", date: "28-09-29" }] },
    ],
  },
];

export const surveyTypeColors: Record<SurveyType, string> = {
  "Annual Survey": "hsl(210, 80%, 55%)",
  "Intermediate Docking Survey": "hsl(168, 70%, 42%)",
  "Docking Survey": "hsl(38, 92%, 50%)",
  "Direction Propeller": "hsl(280, 60%, 55%)",
  "CSM/CSH": "hsl(340, 70%, 55%)",
  "FSI": "hsl(15, 80%, 52%)",
};

export const surveyTypeBgClasses: Record<SurveyType, string> = {
  "Annual Survey": "bg-info/15 text-info border-info/30",
  "Intermediate Docking Survey": "bg-success/15 text-success border-success/30",
  "Docking Survey": "bg-warning/15 text-warning border-warning/30",
  "Direction Propeller": "bg-purple-500/15 text-purple-600 border-purple-500/30",
  "CSM/CSH": "bg-pink-500/15 text-pink-600 border-pink-500/30",
  "FSI": "bg-orange-500/15 text-orange-600 border-orange-500/30",
};
