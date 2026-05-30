// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "conference"
  | "rally"
  | "prayer"
  | "bible-study"
  | "other";

export type SheepAttendee = {
  id: string;
  initials: string;
};

export type SheepEvent = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  dateISO: string;
  time: string;
  location: string;
  region: string;
  attendanceCap: number;
  registered: number;
  image?: string;
  isRegistered?: boolean;
  attendees?: SheepAttendee[];
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  from: string;
  date: string;
  unread: boolean;
  priority: "normal" | "urgent";
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const TYPE_CONFIG: Record<
  EventType,
  { label: string; badge: string; gradient: string; dot: string; pill: string }
> = {
  conference: {
    label: "Conference",
    badge: "bg-blue-500 text-white",
    gradient: "bg-[#B5D4F4]",
    dot: "bg-blue-500",
    pill: "bg-[#E6F1FB] text-[#0C447C]",
  },
  rally: {
    label: "Rally",
    badge: "bg-orange-500 text-white",
    gradient: "bg-[#F5C4B3]",
    dot: "bg-orange-500",
    pill: "bg-[#FAECE7] text-[#712B13]",
  },
  prayer: {
    label: "Prayer",
    badge: "bg-amber-500 text-white",
    gradient: "bg-[#FAC775]",
    dot: "bg-amber-500",
    pill: "bg-[#FAEEDA] text-[#633806]",
  },
  "bible-study": {
    label: "Bible Study",
    badge: "bg-green-600 text-white",
    gradient: "bg-[#C0DD97]",
    dot: "bg-green-600",
    pill: "bg-[#EAF3DE] text-[#27500A]",
  },
  other: {
    label: "Other",
    badge: "bg-slate-600 text-white",
    gradient: "bg-[#D3D1C7]",
    dot: "bg-slate-500",
    pill: "bg-[#F1EFE8] text-[#444441]",
  },
};

export const TABS = ["Events", "Notices"] as const;
export type Tab = (typeof TABS)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const isPast = (dateISO: string) => new Date(dateISO) < new Date();

export const formatDate = (dateISO: string, display: string) => {
  if (isPast(dateISO)) return display;
  const days = Math.ceil(
    (new Date(dateISO).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `In ${days} days`;
  return display;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const INIT_EVENTS: SheepEvent[] = [
  {
    id: "1",
    title: "National Delegates Conference",
    type: "conference",
    description:
      "Annual conference bringing student leaders from every region together for strategy, worship and fellowship.",
    date: "Aug 12, 2026",
    dateISO: "2026-08-12",
    time: "9:00 AM",
    location: "KNUST, Kumasi",
    region: "Ashanti",
    attendanceCap: 300,
    registered: 214,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    isRegistered: true,
    attendees: [
      { id: "a1", initials: "AO" },
      { id: "a2", initials: "BK" },
      { id: "a3", initials: "EA" },
    ],
  },
  {
    id: "2",
    title: "National Prayer Summit",
    type: "prayer",
    description:
      "A national gathering focused on prayer and spiritual renewal for all members.",
    date: "Oct 5, 2026",
    dateISO: "2026-10-05",
    time: "10:00 AM",
    location: "Legon, Accra",
    region: "Greater Accra",
    attendanceCap: 500,
    registered: 178,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    isRegistered: false,
    attendees: [
      { id: "b1", initials: "KM" },
      { id: "b2", initials: "SA" },
      { id: "b3", initials: "FO" },
    ],
  },
  {
    id: "3",
    title: "Zonal Leadership Rally",
    type: "rally",
    description:
      "Leadership training and development rally for zone executives and student leaders.",
    date: "Mar 3, 2027",
    dateISO: "2027-03-03",
    time: "8:00 AM",
    location: "UCC, Cape Coast",
    region: "Central",
    attendanceCap: 150,
    registered: 89,
    isRegistered: false,
    attendees: [
      { id: "c1", initials: "NA" },
      { id: "c2", initials: "JB" },
      { id: "c3", initials: "PK" },
    ],
  },
  {
    id: "4",
    title: "Ashanti Bible Study Weekend",
    type: "bible-study",
    description: "Intensive weekend bible study for Ashanti region members.",
    date: "Jan 20, 2026",
    dateISO: "2026-01-20",
    time: "7:30 AM",
    location: "KNUST, Kumasi",
    region: "Ashanti",
    attendanceCap: 100,
    registered: 100,
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80",
    isRegistered: true,
    attendees: [
      { id: "d1", initials: "AO" },
      { id: "d2", initials: "EM" },
      { id: "d3", initials: "GY" },
    ],
  },
];

export const INIT_NOTICES: Notice[] = [
  {
    id: "n1",
    unread: true,
    priority: "normal",
    title: "Bible Study this Saturday",
    body: "Reminder that our weekly bible study holds this Saturday at 8am in the Unity Hall common room. Please come with your Bible.",
    from: "Ama Owusu (Shepherd)",
    date: "2 hours ago",
  },
  {
    id: "n2",
    unread: true,
    priority: "urgent",
    title: "Urgent: Change of venue for Prayer Summit",
    body: "Please note that the National Prayer Summit venue has been changed from Legon to the KNUST Jubilee Church Hall. All other details remain the same.",
    from: "NUPS-G Admin",
    date: "Yesterday",
  },
  {
    id: "n3",
    unread: false,
    priority: "normal",
    title: "New session registration open",
    body: "Registration for the 2026/2027 academic session is now open. Your membership automatically carries over — no action needed.",
    from: "NUPS-G Admin",
    date: "3 days ago",
  },
  {
    id: "n4",
    unread: false,
    priority: "normal",
    title: "Monthly check-in reminder",
    body: "Your shepherd Ama Owusu will be checking in with you this week. Please make yourself available for a brief catch-up session.",
    from: "Ama Owusu (Shepherd)",
    date: "1 week ago",
  },
];
