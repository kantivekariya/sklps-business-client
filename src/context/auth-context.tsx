"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as User;
          setUser(parsed);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
        } catch {
          // Invalid stored data
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string } & User>("/auth/login", { email, password });
      const data = response.data;
      if (data?.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
        return true;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
