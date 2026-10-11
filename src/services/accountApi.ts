import api from "@/services/api";
import type { Account, UpdateAccountRequest } from "@/types/auth";

export const accountApi = {
  getAll: async (): Promise<Account[]> => {
    const { data } = await api.get<Account[]>("/accounts");
    return data;
  },
  getById: async (id: number): Promise<Account> => {
    const { data } = await api.get<Account>(`/accounts/${id}`);
    return data;
  },
  update: async (id: number, payload: UpdateAccountRequest): Promise<Account> => {
    const { data } = await api.put<Account>(`/accounts/${id}`, payload);
    return data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
};
