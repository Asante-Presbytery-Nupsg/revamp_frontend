// ─── Membership ───────────────────────────────────────────────────────────────

export const memberGrowth = [
  { month: "Oct", members: 980 },
  { month: "Nov", members: 1020 },
  { month: "Dec", members: 1045 },
  { month: "Jan", members: 1102 },
  { month: "Feb", members: 1198 },
  { month: "Mar", members: 1284 },
];

export const membersByRegion = [
  { region: "Ashanti", count: 340 },
  { region: "Greater Accra", count: 290 },
  { region: "Central", count: 180 },
  { region: "Western", count: 150 },
  { region: "Eastern", count: 140 },
  { region: "Others", count: 184 },
];

export const membersByInstitution = [
  { institution: "KNUST", count: 420 },
  { institution: "UG Legon", count: 310 },
  { institution: "UCC", count: 210 },
  { institution: "Ashesi", count: 120 },
  { institution: "UMaT", count: 95 },
  { institution: "Others", count: 129 },
];

// ─── Attendance ───────────────────────────────────────────────────────────────

export const attendanceTrend = [
  { week: "Wk 1", rate: 62 },
  { week: "Wk 2", rate: 71 },
  { week: "Wk 3", rate: 58 },
  { week: "Wk 4", rate: 80 },
  { week: "Wk 5", rate: 74 },
  { week: "Wk 6", rate: 76 },
];

export const attendanceByRegion = [
  { region: "Ashanti", rate: 82 },
  { region: "Greater Accra", rate: 74 },
  { region: "Central", rate: 69 },
  { region: "Western", rate: 71 },
  { region: "Eastern", rate: 65 },
];

// ─── Shepherds ────────────────────────────────────────────────────────────────

export const shepherdPerf = [
  {
    name: "Ama Owusu",
    institution: "KNUST",
    sheep: 5,
    sessions: 12,
    rate: 85,
    lastActive: "2 days ago",
  },
  {
    name: "Kojo Mensah",
    institution: "UG Legon",
    sheep: 2,
    sessions: 10,
    rate: 78,
    lastActive: "3 days ago",
  },
  {
    name: "Joe Frimpong",
    institution: "UMaT",
    sheep: 1,
    sessions: 6,
    rate: 50,
    lastActive: "2 weeks ago",
  },
];

// ─── Events ───────────────────────────────────────────────────────────────────

export const eventReport = [
  {
    name: "National Delegates Conference",
    date: "Aug 12, 2026",
    cap: 300,
    registered: 214,
    type: "Conference",
  },
  {
    name: "National Prayer Summit",
    date: "Oct 5, 2026",
    cap: 500,
    registered: 178,
    type: "Prayer",
  },
  {
    name: "Zonal Leadership Rally",
    date: "Mar 3, 2027",
    cap: 150,
    registered: 89,
    type: "Rally",
  },
  {
    name: "Ashanti Bible Study Weekend",
    date: "Jan 20, 2026",
    cap: 100,
    registered: 100,
    type: "Bible Study",
  },
  {
    name: "Accra Regional Prayer Meeting",
    date: "Feb 14, 2026",
    cap: 200,
    registered: 163,
    type: "Prayer",
  },
];

// ─── Exports list ─────────────────────────────────────────────────────────────

export const EXPORT_ITEMS = [
  {
    label: "Members List",
    desc: "All registered members with status and shepherd",
    formats: ["CSV", "PDF"] as const,
  },
  {
    label: "Attendance Report",
    desc: "Check-in sessions grouped by shepherd and date",
    formats: ["CSV", "PDF"] as const,
  },
  {
    label: "Shepherd Performance",
    desc: "Sessions, sheep count, and attendance rates",
    formats: ["CSV", "PDF"] as const,
  },
  {
    label: "Event Summary",
    desc: "All events with registration and fill rates",
    formats: ["CSV", "PDF"] as const,
  },
  {
    label: "Regional Breakdown",
    desc: "Member counts and attendance by region",
    formats: ["CSV"] as const,
  },
];
