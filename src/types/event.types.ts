type EventType = "conference" | "rally" | "prayer" | "bible-study" | "other";
type EventStatus = "upcoming" | "completed" | "cancelled";

type Region = { id: string; name: string };
type Presbytery = { id: string; name: string; regionId: string };

type NupsgEvent = {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string;
  time: string;
  location: string;
  regionId: string;
  presbyteryId: string;
  attendanceCap: number;
  registered: number;
};

export type { EventType, EventStatus, Region, Presbytery, NupsgEvent };
