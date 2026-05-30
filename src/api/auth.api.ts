import type {
  AuthTokens,
  AuthUser,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/auth.types";
import BASE_API from "./base.api";
import type { ApiResponse } from "@/types/api.types";
import type { MultiStepUserPayload } from "@/schema";

export const register = async (
  payload: MultiStepUserPayload,
): Promise<AuthTokens> => {
  const { data } = await BASE_API.post<ApiResponse<AuthTokens>>(
    "/auth/register",
    payload,
  );
  return data.data;
};

export const registerShepherd = async (
  token: string,
  payload: RegisterPayload,
): Promise<AuthTokens> => {
  const { data } = await BASE_API.post<ApiResponse<AuthTokens>>(
    `/auth/register-shepherd/${token}`,
    payload,
  );
  return data.data;
};

export const login = async (payload: LoginPayload): Promise<AuthUser> => {
  const { data } = await BASE_API.post<ApiResponse<AuthUser>>(
    "/auth/login",
    payload,
  );
  return data.data;
};

export const logout = async (): Promise<void> => {
  await BASE_API.post("/auth/logout");
};

export const getMe = async (): Promise<AuthUser> => {
  const { data } = await BASE_API.get<ApiResponse<AuthUser>>("/auth/me");
  return data.data;
};

export const refreshToken = async (): Promise<AuthTokens> => {
  const { data } =
    await BASE_API.post<ApiResponse<AuthTokens>>("/auth/refresh");
  return data.data;
};

export const forgotPassword = async (
  payload: ForgotPasswordPayload,
): Promise<void> => {
  await BASE_API.post("/auth/forgot-password", payload);
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<void> => {
  await BASE_API.post("/auth/reset-password", payload);
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<void> => {
  await BASE_API.patch("/auth/change-password", payload);
};
