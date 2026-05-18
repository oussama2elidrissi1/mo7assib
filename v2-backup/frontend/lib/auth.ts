import Cookies from "js-cookie";
import api from "./api";
import type { User } from "./types";

export async function login(email: string, password: string): Promise<User> {
  const res = await api.post("/auth/login", { email, password });
  const { access_token, user } = res.data;
  Cookies.set("access_token", access_token, { expires: 1, sameSite: "strict" });
  return user;
}

export function logout() {
  Cookies.remove("access_token");
  window.location.href = "/login";
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
}

export function getToken(): string | undefined {
  return Cookies.get("access_token");
}
