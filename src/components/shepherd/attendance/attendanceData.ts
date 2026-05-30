// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceStatus = "present" | "absent" | null;

export type Sheep = {
  id: string;
  name: string;
  institution: string;
  programme: string;
  phone: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MY_SHEEP: Sheep[] = [
  {
    id: "1",
    name: "Kwame Asante",
    institution: "KNUST",
    programme: "Computer Science",
    phone: "+233 24 123 4567",
  },
  {
    id: "2",
    name: "Ama Serwaa",
    institution: "KNUST",
    programme: "Economics",
    phone: "+233 20 987 6543",
  },
  {
    id: "3",
    name: "Abena Mensah",
    institution: "KNUST",
    programme: "Architecture",
    phone: "+233 24 345 6789",
  },
  {
    id: "4",
    name: "Akua Boateng",
    institution: "KNUST",
    programme: "Medicine",
    phone: "+233 24 567 8901",
  },
  {
    id: "5",
    name: "Adwoa Frimpong",
    institution: "KNUST",
    programme: "Pharmacy",
    phone: "+233 24 901 2345",
  },
  {
    id: "6",
    name: "Yaw Asante",
    institution: "UG Legon",
    programme: "Law",
    phone: "+233 26 234 5678",
  },
  {
    id: "7",
    name: "Kojo Boateng",
    institution: "UG Legon",
    programme: "Sociology",
    phone: "+233 20 345 6789",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

export const ini = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");
