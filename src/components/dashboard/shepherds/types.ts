export type Sheep = {
  id: string;
  firstName: string;
  lastName: string;
  institution: string | null;
  programme: string | null;
  phoneNumber: string | null;
  attendanceRate: number | null;
};

export type Shepherd = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  isActive: boolean;
  createdAt: string;
  institutionName: string | null;
  shortName: string | null;
  programme: string | null;
  level: string | null;
  position: string | null;
  region: string | null;
  sheep: Sheep[];
};

export type PendingShepherd = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  institutionName: string | null;
  shortName: string | null;
  programme: string | null;
  level: string | null;
  region: string | null;
};

export type DrawerContent =
  | { kind: "sheep"; data: Sheep }
  | { kind: "shepherd"; data: Shepherd }
  | { kind: "pending"; data: PendingShepherd };
