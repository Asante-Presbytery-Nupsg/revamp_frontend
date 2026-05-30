import type { MultiStepUserPayload } from "@/schema";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "shepherd" | "sheep";
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    role: "sheep" | "shepherd" | "admin";
  };
}

export type { MultiStepUserPayload as RegisterPayload };

export interface LoginPayload {
  identifier: string;
  password: string;
}
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
