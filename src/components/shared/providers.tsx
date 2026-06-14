"use client";

import { SeoProvider } from "@/components/seo-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { BusinessAuthProvider } from "@/context/business-auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SeoProvider>
      <AuthProvider>
        <BusinessAuthProvider>
          {children}
          <Toaster />
        </BusinessAuthProvider>
      </AuthProvider>
      </SeoProvider>
    </ThemeProvider>
  );
}
