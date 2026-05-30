// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "conference"
  | "rally"
  | "prayer"
  | "bible-study"
  | "other";
export type EventStatus = "upcoming" | "completed";

export type ShepherdEvent = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string;
  dateISO: string;
  time: string;
  location: string;
  region: string;
  attendanceCap: number;
  registered: number;
  image?: string;
  isRegistered: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const TYPE_CONFIG: Record<
  EventType,
  { label: string; badge: string; gradient: string; dot: string }
> = {
  conference: {
    label: "Conference",
    badge: "bg-blue-500 text-white",
    gradient: "from-[#0C447C] to-blue-800",
    dot: "bg-blue-500",
  },
  rally: {
    label: "Rally",
    badge: "bg-orange-500 text-white",
    gradient: "from-orange-800 to-red-900",
    dot: "bg-orange-500",
  },
  prayer: {
    label: "Prayer",
    badge: "bg-amber-500 text-white",
    gradient: "from-amber-800 to-yellow-900",
    dot: "bg-amber-500",
  },
  "bible-study": {
    label: "Bible Study",
    badge: "bg-green-600 text-white",
    gradient: "from-green-800 to-emerald-900",
    dot: "bg-green-600",
  },
  other: {
    label: "Other",
    badge: "bg-slate-600 text-white",
    gradient: "from-slate-700 to-slate-900",
    dot: "bg-slate-500",
  },
};

export const STATUS_TABS = ["All", "upcoming", "completed"] as const;
export type StatusTab = (typeof STATUS_TABS)[number];

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

export const EVENTS: ShepherdEvent[] = [
  {
    id: "1",
    title: "National Delegates Conference",
    type: "conference",
    status: "upcoming",
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
  },
  {
    id: "2",
    title: "National Prayer Summit",
    type: "prayer",
    status: "upcoming",
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
  },
  {
    id: "3",
    title: "Zonal Leadership Rally",
    type: "rally",
    status: "upcoming",
    description: "Leadership training and development for zone executives.",
    date: "Mar 3, 2027",
    dateISO: "2027-03-03",
    time: "8:00 AM",
    location: "UCC, Cape Coast",
    region: "Central",
    attendanceCap: 150,
    registered: 89,
    isRegistered: false,
  },
  {
    id: "4",
    title: "Ashanti Bible Study Weekend",
    type: "bible-study",
    status: "completed",
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
  },
];
