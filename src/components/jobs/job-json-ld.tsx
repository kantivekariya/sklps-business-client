import type { Job } from "@/types";

interface JobJsonLdProps {
  job: Job;
  baseUrl: string;
}

export function JobJsonLd({ job, baseUrl }: JobJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.jobTitle,
    description: job.description,
    datePosted: new Date().toISOString(),
    employmentType: job.jobType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.city,
        addressCountry: job.country,
      },
    },
    directApply: true,
    url: `${baseUrl}/jobs/${job._id}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
