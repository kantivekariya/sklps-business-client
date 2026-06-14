import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { JobsList } from "@/components/jobs/jobs-list";

export const metadata: Metadata = {
  title: "Global Job Portal",
  description:
    "Find verified job opportunities across India, Kenya, Middle East, and beyond. Browse approved job listings.",
  keywords: ["jobs", "Kenya jobs", "India jobs", "verified jobs", "careers"],
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getJobs() {
  try {
    const res = await fetch(`${API_URL}/jobs?status=Approved`, {
      next: { revalidate: 60 },
    });
    return res.json();
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen bg-muted/30">
          <div className="bg-primary py-16 text-primary-foreground">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">Global Job Portal</h1>
                <p className="mx-auto mb-8 max-w-2xl text-xl text-primary-foreground/90">
                  Find verified job opportunities across India, Kenya, Middle East, and beyond
                </p>
              </div>
            </div>
          </div>

          <JobsList initialJobs={jobs} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
