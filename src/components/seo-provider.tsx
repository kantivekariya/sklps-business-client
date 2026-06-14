"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface SeoSettings {
  siteName: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  twitterHandle: string;
  favicon: string;
}

export function SeoProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<SeoSettings | null>(null);

  useEffect(() => {
    api.get<SeoSettings>("/seo").then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!settings) return;
    document.title = settings.title || "SKLPS – Community Job Portal";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", settings.description || "");
    const kw = document.querySelector('meta[name="keywords"]');
    if (kw) kw.setAttribute("content", settings.keywords || "");
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", settings.title || "");
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", settings.description || "");
    if (settings.ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute("content", settings.ogImage);
    }
  }, [settings, pathname]);

  return <>{children}</>;
}
