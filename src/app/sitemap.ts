import type { MetadataRoute } from "next";
import { API_URL, SITE_URL } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/directory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/add`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/jobs/post`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/admin/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const [businessesRes, jobsRes] = await Promise.all([
      fetch(`${API_URL}/business`),
      fetch(`${API_URL}/jobs?status=Approved`),
    ]);

    const businesses = await businessesRes.json().catch(() => []);
    const jobs = await jobsRes.json().catch(() => []);

    const businessPages: MetadataRoute.Sitemap = businesses.map((b: { _id: string }) => ({
      url: `${SITE_URL}/business/${b._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const jobPages: MetadataRoute.Sitemap = jobs.map((j: { _id: string }) => ({
      url: `${SITE_URL}/jobs/${j._id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...businessPages, ...jobPages];
  } catch {
    return staticRoutes;
  }
}
