import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  MapPin,
  FileBarChart2,
  UserPlus,
  Settings,
  User,
  History,
  Flag,
  LineChart,
  UserStar,
  BookOpen,
} from "lucide-react";

export type Role = "admin" | "shepherd" | "sheep";

export interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAV_CONFIG: Record<Role, NavSection[]> = {
  admin: [
    {
      items: [
        { icon: LayoutDashboard, label: "Overview", to: "/dashboard/admin" },
        { icon: Users, label: "Members", to: "/dashboard/admin/members" },
        {
          icon: UserStar,
          label: "Shepherds",
          to: "/dashboard/admin/shepherds",
        },
        {
          icon: CalendarDays,
          label: "Union Events",
          to: "/dashboard/admin/events",
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          icon: FileBarChart2,
          label: "Situational Reports",
          to: "/dashboard/admin/admin-reports",
        },
        {
          icon: LineChart,
          label: "Progress Reports",
          to: "/dashboard/admin/reports",
        },
        {
          icon: CalendarCheck,
          label: "Shepherd Attendance",
          to: "/dashboard/admin/attendance",
        },
        {
          icon: MapPin,
          label: "Regions & Presbyteries",
          to: "/dashboard/admin/regions",
        },

        {
          icon: UserPlus,
          label: "Invite Shepherds",
          to: "/dashboard/admin/invite",
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          icon: FileBarChart2,
          label: "Feedback",
          to: "/dashboard/admin/feedback",
        },
        {
          icon: BookOpen,
          label: "Diary",
          to: "/dashboard/admin/diary",
        },
        { icon: Settings, label: "Settings", to: "/dashboard/admin/settings" },
      ],
    },
  ],

  shepherd: [
    {
      items: [
        { icon: LayoutDashboard, label: "Overview", to: "/dashboard/shepherd" },
        { icon: Users, label: "My Sheep", to: "/dashboard/shepherd/sheep" },
        {
          icon: CalendarCheck,
          label: "Sheep Attendance",
          to: "/dashboard/shepherd/attendance",
        },
        {
          icon: CalendarDays,
          label: "Community Hub",
          to: "/dashboard/shepherd/events",
        },
        {
          icon: FileBarChart2,
          label: "Submit Feedback",
          to: "/dashboard/shepherd/feedback",
        },
        { icon: User, label: "My Profile", to: "/dashboard/shepherd/profile" },
      ],
    },
  ],

  sheep: [
    {
      items: [
        { icon: User, label: "My Profile", to: "/dashboard/sheep" },
        {
          icon: CalendarDays,
          label: "Community Hub",
          to: "/dashboard/sheep/events",
        },
        {
          icon: History,
          label: "Attendance History",
          to: "/dashboard/sheep/attendance",
        },

        {
          icon: Flag,
          label: "Submit Feedback",
          to: "/dashboard/sheep/feedback",
        },
      ],
    },
  ],
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrator",
  shepherd: "Shepherd",
  sheep: "Member",
};

export const ROLE_BASE: Record<Role, string> = {
  admin: "/admin",
  shepherd: "/shepherd",
  sheep: "/sheep",
};
