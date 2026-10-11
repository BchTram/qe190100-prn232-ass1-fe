"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/services/authApi";
import { decodeToken, getRoleFromToken, getToken, isTokenExpired, removeToken, saveToken } from "@/lib/token";
import type { Account, LoginRequest, RegisterRequest } from "@/types/auth";

export type AuthContextValue = {
  currentUser: Account | null;
  role: number | null;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<Account>;
  logout: () => void;
  register: (payload: RegisterRequest) => Promise<Account>;
};

const ACCOUNT_KEY = "tasktrack.account";
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAccount(token: string): Account | null {
  try {
    const saved = window.localStorage.getItem(ACCOUNT_KEY);
    const account = saved ? (JSON.parse(saved) as Account) : null;
    const claims = decodeToken(token);
    const role = getRoleFromToken(token);
    if (role === null) return null;

    return {
      accountId: account?.accountId ?? Number(claims?.AccountID ?? 0),
      fullName: account?.fullName ?? String(claims?.FullName ?? claims?.Email ?? "User"),
      email: account?.email ?? String(claims?.Email ?? ""),
      role,
      createdDate: account?.createdDate ?? "",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      setCurrentUser(readStoredAccount(token));
    } else {
      removeToken();
      window.localStorage.removeItem(ACCOUNT_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (payload: LoginRequest) => {
    const response = await authApi.login(payload);
    saveToken(response.token);
    window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(response.account));
    setCurrentUser(response.account);
    return response.account;
  };

  const register = async (payload: RegisterRequest) => authApi.register(payload);

  const logout = () => {
    removeToken();
    window.localStorage.removeItem(ACCOUNT_KEY);
    setCurrentUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, role: currentUser?.role ?? null, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}
