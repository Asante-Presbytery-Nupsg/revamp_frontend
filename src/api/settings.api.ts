import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";

export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
}
export interface OrgSettings {
  name: string;
  shortName: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  website: string;
}
export interface NotifSettings {
  newMember: boolean;
  pendingShepherd: boolean;
  lowAttendance: boolean;
  eventReminder: boolean;
  weeklyDigest: boolean;
  emailNotifs: boolean;
  inAppNotifs: boolean;
}
export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}
export interface RoleSummary {
  admin: number;
  shepherd: number;
  sheep: number;
}

const get = async <T>(url: string): Promise<T> =>
  (await BASE_API.get<ApiResponse<T>>(url)).data.data;
const patch = async <T>(url: string, d: unknown): Promise<T> =>
  (await BASE_API.patch<ApiResponse<T>>(url, d)).data.data;

export const getAdminProfile = () => get<AdminProfile>("/settings/profile");
export const updateAdminProfile = (
  d: Partial<Pick<AdminProfile, "firstName" | "lastName" | "phoneNumber">>,
) => patch<AdminProfile>("/settings/profile", d);
export const getOrgSettings = () => get<OrgSettings>("/settings/org");
export const updateOrgSettings = (d: Partial<OrgSettings>) =>
  patch<OrgSettings>("/settings/org", d);
export const getNotifSettings = () =>
  get<NotifSettings>("/settings/notifications");
export const updateNotifSettings = (d: Partial<NotifSettings>) =>
  patch<NotifSettings>("/settings/notifications", d);
export const getSessions = () => get<AcademicSession[]>("/settings/sessions");
export const getAdmins = () => get<AdminUser[]>("/settings/admins");
export const getRoleSummary = () => get<RoleSummary>("/settings/roles");

export const createSession = (d: {
  name: string;
  startDate: string;
  endDate: string;
}) =>
  BASE_API.post<ApiResponse<AcademicSession>>("/settings/sessions", d).then(
    (r) => r.data.data,
  );
export const activateSession = (id: string) =>
  patch<AcademicSession>(`/settings/sessions/${id}/activate`, {});
export const archiveAndStart = (newName: string) =>
  patch<AcademicSession>("/settings/sessions/archive-and-start", { newName });
export const deleteSession = (id: string) =>
  BASE_API.delete(`/settings/sessions/${id}`);
export const removeAdmin = (id: string) =>
  BASE_API.delete(`/settings/admins/${id}`);
export const deactivateUnassigned = () =>
  BASE_API.post<ApiResponse<{ affected: number }>>(
    "/settings/danger/deactivate-unassigned",
  ).then((r) => r.data.data);

export const sendPasswordReset = (email: string) =>
  BASE_API.post("/auth/forgot-password", { email });

export const inviteAdmin = (email: string, role: string) =>
  BASE_API.post("/admin-invite/invite", { email, role });
