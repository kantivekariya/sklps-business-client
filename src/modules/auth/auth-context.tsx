import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Admin } from "@/types";
import { authService } from "./auth.service";

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      authService
        .getAdminMe()
        .then(({ admin: a }) => setAdmin(a))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token: t, admin: a } = await authService.adminLogin(email, password);
    localStorage.setItem("token", t);
    setToken(t);
    setAdmin(a);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
