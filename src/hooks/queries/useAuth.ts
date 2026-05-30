import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login, register, registerShepherd } from "@/api/auth.api";
import type { LoginPayload, RegisterPayload } from "@/types/auth.types";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { initializeCsrf } from "@/api/base.api";

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AxiosError
          ? (error?.response?.data?.message ??
            "Registration failed. Try again.")
          : "Registration failed. Try again.";
      toast.error(message);
    },
  });
};

export const useRegisterShepherd = (token: string) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerShepherd(token, payload),
    onSuccess: () => {
      toast.success("Account created successfully");
      setTimeout(() => navigate("/login"), 1200);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AxiosError
          ? (error?.response?.data?.message ??
            "Registration failed. Try again.")
          : "Registration failed. Try again.";
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      await initializeCsrf();

      toast.success("Welcome back!");
      setUser(data);

      switch (data.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "shepherd":
          navigate("/dashboard/shepherd");
          break;
        case "sheep":
          navigate("/dashboard/sheep");
          break;
        default:
          navigate("/login");
          break;
      }
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AxiosError
          ? error.message
          : "Something went wrong. Try again.";
      toast.error(message);
    },
  });
};
