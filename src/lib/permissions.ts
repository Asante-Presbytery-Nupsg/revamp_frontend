export const PERMISSIONS = [
  // members
  "members:read",
  "members:create",
  "members:update",
  "members:delete",
  "members:approve",

  // events
  "events:read",
  "events:create",
  "events:update",
  "events:delete",

  // attendance
  "attendance:read",
  "attendance:create",
  "attendance:update",

  // shepherds
  "shepherds:read",
  "shepherds:invite",
  "shepherds:assign",
  "shepherds:remove",

  // reports
  "reports:read",
  "reports:export",

  // settings
  "settings:read",
  "settings:update",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
export type Role = "admin" | "shepherd" | "sheep";
