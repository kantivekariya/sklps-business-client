"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

export interface BusinessUser {
  _id: string;
  email: string;
  businessName: string;
  name: string;
  status: string;
  tempPassword?: boolean;
}

interface BusinessAuthContextType {
  business: BusinessUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | null>(null);

export const BusinessAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [business, setBusiness] = useState<BusinessUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("businessToken");
      const savedBusiness = localStorage.getItem("businessUser");

      if (token && savedBusiness) {
        try {
          const parsed = JSON.parse(savedBusiness) as BusinessUser;
          setBusiness(parsed);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
        } catch {
          /* invalid stored data */
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string } & BusinessUser>(
        "/auth/business/login",
        { email, password }
      );
      const data = response.data;
      if (data?.token) {
        localStorage.setItem("businessToken", data.token);
        localStorage.setItem("businessUser", JSON.stringify(data));
        setBusiness(data);
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
        return true;
      }
    } catch (error) {
      console.error("Business login failed", error);
      throw error;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("businessToken");
      localStorage.removeItem("businessUser");
    }
    setBusiness(null);
    delete api.defaults.headers.common.Authorization;
  }, []);

  return (
    <BusinessAuthContext.Provider value={{ business, login, logout, loading }}>
      {children}
    </BusinessAuthContext.Provider>
  );
};

export const useBusinessAuth = () => {
  const ctx = useContext(BusinessAuthContext);
  if (!ctx) {
    throw new Error("useBusinessAuth must be used within BusinessAuthProvider");
  }
  return ctx;
};
