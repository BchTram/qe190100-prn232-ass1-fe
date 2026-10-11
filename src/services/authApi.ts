import api from "@/services/api";
import type { Account, LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
  },
  register: async (payload: RegisterRequest): Promise<Account> => {
    const { data } = await api.post<Account>("/auth/register", payload);
    return data;
  },
};
