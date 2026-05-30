import type { NupsgEvent, Presbytery, Region } from "@/types/event.types";

const REGIONS: Region[] = [
  { id: "r1", name: "Ashanti" },
  { id: "r2", name: "Greater Accra" },
  { id: "r3", name: "Central" },
];

const PRESBYTERIES: Presbytery[] = [
  { id: "p1", name: "Kumasi Presbytery", regionId: "r1" },
  { id: "p2", name: "Sunyani Presbytery", regionId: "r1" },
  { id: "p3", name: "Accra Presbytery", regionId: "r2" },
  { id: "p4", name: "Cape Coast Presbytery", regionId: "r3" },
];

const MOCK_EVENTS: NupsgEvent[] = [
  {
    id: "1",
    title: "National Delegates Conference",
    type: "conference",
    status: "upcoming",
    description:
      "Annual delegates conference bringing together student leaders from all regions.",
    date: "Aug 12, 2026",
    time: "9:00 AM",
    location: "KNUST, Kumasi",
    regionId: "r1",
    presbyteryId: "p1",
    attendanceCap: 300,
    registered: 214,
  },
  {
    id: "2",
    title: "National Prayer Summit",
    type: "prayer",
    status: "upcoming",
    description:
      "A national gathering focused on prayer and spiritual renewal for all members.",
    date: "Oct 5, 2026",
    time: "10:00 AM",
    location: "Legon, Accra",
    regionId: "r2",
    presbyteryId: "p3",
    attendanceCap: 500,
    registered: 178,
  },
  {
    id: "3",
    title: "Zonal Leadership Rally",
    type: "rally",
    status: "upcoming",
    description:
      "Leadership training and development rally for zone executives.",
    date: "Mar 3, 2027",
    time: "8:00 AM",
    location: "UCC, Cape Coast",
    regionId: "r3",
    presbyteryId: "p4",
    attendanceCap: 150,
    registered: 89,
  },
  {
    id: "4",
    title: "Ashanti Bible Study Weekend",
    type: "bible-study",
    status: "completed",
    description: "Intensive weekend bible study for Ashanti region members.",
    date: "Jan 20, 2026",
    time: "7:30 AM",
    location: "KNUST, Kumasi",
    regionId: "r1",
    presbyteryId: "p1",
    attendanceCap: 100,
    registered: 100,
  },
  {
    id: "5",
    title: "Accra Regional Prayer Meeting",
    type: "prayer",
    status: "completed",
    description: "Regional prayer meeting for Greater Accra members.",
    date: "Feb 14, 2026",
    time: "6:00 PM",
    location: "Legon, Accra",
    regionId: "r2",
    presbyteryId: "p3",
    attendanceCap: 200,
    registered: 163,
  },
];

export { REGIONS, PRESBYTERIES, MOCK_EVENTS };
