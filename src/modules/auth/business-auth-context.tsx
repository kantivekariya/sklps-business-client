import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Business } from "@/types";
import { authService } from "./auth.service";

interface BusinessAuthContextType {
  business: Business | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

export function BusinessAuthProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("businessToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("businessToken");
    if (stored) {
      authService
        .getBusinessMe()
        .then(({ business: b }) => setBusiness(b))
        .catch(() => {
          localStorage.removeItem("businessToken");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token: t, business: b } = await authService.businessLogin(email, password);
    localStorage.setItem("businessToken", t);
    setToken(t);
    setBusiness(b);
  };

  const logout = () => {
    localStorage.removeItem("businessToken");
    setToken(null);
    setBusiness(null);
  };

  return (
    <BusinessAuthContext.Provider value={{ business, token, loading, login, logout }}>
      {children}
    </BusinessAuthContext.Provider>
  );
}

export function useBusinessAuth() {
  const ctx = useContext(BusinessAuthContext);
  if (!ctx) throw new Error("useBusinessAuth must be used within BusinessAuthProvider");
  return ctx;
}
