// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceRecord = {
  id: string;
  date: string;
  markedBy: string;
  status: "present" | "absent";
  notes: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const HISTORY: AttendanceRecord[] = [
  {
    id: "1",
    date: "Mar 24, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Bible study",
  },
  {
    id: "2",
    date: "Mar 17, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Weekly check-in",
  },
  {
    id: "3",
    date: "Mar 10, 2026",
    markedBy: "Ama Owusu",
    status: "absent",
    notes: "",
  },
  {
    id: "4",
    date: "Mar 3, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Prayer meeting",
  },
  {
    id: "5",
    date: "Feb 24, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Weekly check-in",
  },
  {
    id: "6",
    date: "Feb 17, 2026",
    markedBy: "Ama Owusu",
    status: "absent",
    notes: "Exams week",
  },
  {
    id: "7",
    date: "Feb 10, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Bible study",
  },
  {
    id: "8",
    date: "Feb 3, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Weekly check-in",
  },
  {
    id: "9",
    date: "Jan 27, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Prayer meeting",
  },
  {
    id: "10",
    date: "Jan 20, 2026",
    markedBy: "Ama Owusu",
    status: "absent",
    notes: "",
  },
  {
    id: "11",
    date: "Jan 13, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Bible study",
  },
  {
    id: "12",
    date: "Jan 6, 2026",
    markedBy: "Ama Owusu",
    status: "present",
    notes: "Weekly check-in",
  },
];

// ─── Derived stats ────────────────────────────────────────────────────────────

export const presentCount = HISTORY.filter(
  (r) => r.status === "present",
).length;
export const attendanceRate = Math.round((presentCount / HISTORY.length) * 100);
