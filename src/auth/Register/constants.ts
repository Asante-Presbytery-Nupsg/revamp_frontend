import type { Variants, Transition } from "framer-motion";
import { PersonalInfoSchema, EducationSchema, ChurchSchema } from "@/schema";

// ─── Step config

export const STEPS = [
  { id: 1, label: "Personal", description: "Your basic information" },
  { id: 2, label: "Education", description: "Academic background" },
  { id: 3, label: "Church", description: "Congregation & family" },
] as const;

// Per-step schemas used for partial trigger validation.
// EducationSchema has superRefine so we can't use .shape —
// we explicitly list each step's field keys instead.
export const STEP_FIELDS: Array<string[]> = [
  [
    "firstName",
    "lastName",
    "otherName",
    "email",
    "phone",
    "whatsapp",
    "birthDay",
    "birthMonth",
  ],
  [
    "programmeId",
    "programmeName",
    "institutionId",
    "institutionName",
    "residence",
    "highSchool",
  ],
  [
    "congregation",
    "regionId",
    "districtChurch",
    "presbyteryId",
    "guardianName",
    "guardianContact",
  ],
];

export const STEP_SCHEMAS = [PersonalInfoSchema, EducationSchema, ChurchSchema];

// ─── Animation variants

// custom = direction (1 → forward, -1 → back)
export const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } as Transition,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } as Transition,
  }),
};

export const fadeUp = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay,
    } as Transition,
  },
});

// ─── Dropdown data

export const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: i + 1,
}));

export const MONTH_OPTIONS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
