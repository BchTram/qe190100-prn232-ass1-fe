export type JwtPayload = {
  AccountID?: string;
  Email?: string;
  Role?: string | number;
  exp?: number;
  [claim: string]: unknown;
};

const TOKEN_KEY = "tasktrack.accessToken";

export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

export function getRoleFromToken(token = getToken()): number | null {
  if (!token) return null;
  const payload = decodeToken(token);
  const role = payload?.Role ?? payload?.role;
  const parsedRole = Number(role);
  return Number.isInteger(parsedRole) ? parsedRole : null;
}

export function isTokenExpired(token: string): boolean {
  const expiration = decodeToken(token)?.exp;
  return typeof expiration === "number" && expiration * 1000 <= Date.now();
}
