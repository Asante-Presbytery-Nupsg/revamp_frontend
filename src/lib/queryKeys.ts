import type { MemberQuery } from "@/api/members.api";

export const queryKeys = {
  // auth
  auth: {
    me: ["auth", "me"] as const,
  },

  // members
  members: {
    all: (query?: MemberQuery) => ["members", "all", query ?? {}] as const,
    detail: (id: string) => ["members", "detail", id] as const,
  },

  // shepherds
  shepherds: {
    all: (query: Record<string, unknown> = {}) =>
      ["shepherds", "list", query] as const,
    detail: (id: string) => ["shepherds", "detail", id] as const,
    stats: () => ["shepherds", "stats"] as const,
    pending: () => ["shepherds", "pending"] as const,
    myProfile: () => ["shepherds", "me"] as const,
    mySheep: (params: Record<string, unknown> = {}) =>
      ["shepherds", "my-sheep", params] as const,
  },

  // regions
  regions: {
    all: (query?: object) => ["regions", query] as const,
    detail: (id: string) => ["regions", id] as const,
    presbyteries: (regionId: string) =>
      ["regions", regionId, "presbyteries"] as const,
  },

  // institutions
  institutions: {
    all: (query?: object) => ["institutions", query] as const,
    detail: (id: string) => ["institutions", id] as const,
    flat: (type?: string) => ["institutions", "flat", type] as const,
  },

  // programmes
  programmes: {
    all: (query?: object) => ["programmes", query] as const,
    flat: ["programmes", "flat"] as const,
  },

  // events
  events: {
    all: (query?: unknown) =>
      query ? (["events", query] as const) : (["events"] as const),
    detail: (id: string) => ["events", "detail", id] as const,
    registrations: (eventId: string) =>
      ["events", "registrations", eventId] as const,
  },

  // attendance
  attendance: {
    all: (query?: unknown) =>
      query ? (["attendance", query] as const) : (["attendance"] as const),
    detail: (id: string) => ["attendance", "detail", id] as const,
    grouped: (query?: unknown) =>
      query
        ? (["attendance", "grouped", query] as const)
        : (["attendance", "grouped"] as const),
    stats: (params?: unknown) =>
      params
        ? (["attendance", "stats", params] as const)
        : (["attendance", "stats"] as const),
  },

  // invites
  invites: {
    all: (query?: unknown) =>
      query ? (["invites", query] as const) : (["invites"] as const),
    detail: (id: string) => ["invites", "detail", id] as const,
    byToken: (token: string) => ["invites", "token", token] as const,
  },
} as const;
