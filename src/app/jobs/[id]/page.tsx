import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { JobDetails } from "@/components/jobs/job-details";
import { JobJsonLd } from "@/components/jobs/job-json-ld";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getJob(id: string) {
  try {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) {
    return { title: "Job Not Found" };
  }
  const description = job.description?.slice(0, 160) || `${job.jobTitle} at ${job.companyName}`;
  return {
    title: `${job.jobTitle} at ${job.companyName}`,
    description,
    openGraph: {
      title: `${job.jobTitle} at ${job.companyName}`,
      description,
    },
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sklps.example.com";

  return (
    <div className="flex flex-col min-h-screen">
      <JobJsonLd job={job} baseUrl={baseUrl} />
      <Navbar />
      <main className="flex-grow">
        <JobDetails job={job} />
      </main>
      <Footer />
    </div>
  );
}
