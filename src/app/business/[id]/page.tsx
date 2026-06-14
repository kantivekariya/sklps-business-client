import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBusiness(id: string) {
  try {
    const res = await fetch(`${API_URL}/business/${id}`, {
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
  const business = await getBusiness(id);
  if (!business) {
    return { title: "Business Not Found" };
  }
  return {
    title: `${business.businessName} - ${business.category}`,
    description: business.description?.slice(0, 160) || business.businessName,
  };
}

export default async function BusinessDetailsPage({ params }: Props) {
  const { id } = await params;
  const business = await getBusiness(id);

  if (!business) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/directory"
              className="mb-6 inline-flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Directory
            </Link>

            <div className="relative overflow-hidden rounded-t-2xl border-b bg-card p-8 shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <div className="text-9xl font-black">{business.businessName.charAt(0)}</div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                <div className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted text-5xl font-bold text-foreground shadow-inner">
                  {business.logoUrl ? (
                    <Image
                      src={business.logoUrl}
                      alt={business.businessName}
                      fill
                      sizes="128px"
                      className="object-contain p-2 rounded-xl"
                    />
                  ) : (
                    business.businessName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{business.businessName}</h1>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {business.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User size={16} className="mr-1.5" /> {business.name}
                    </span>
                    <span className="flex items-center">
                      <MapPin size={16} className="mr-1.5" /> {business.city}
                    </span>
                    {business.yearsInBusiness && (
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1.5" /> {business.yearsInBusiness} Years Est.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2 space-y-6">
                <div className="rounded-xl bg-card p-8 shadow-sm">
                  <h2 className="mb-4 border-b pb-2 text-xl font-bold text-foreground">About Us</h2>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {business.description || "No description provided."}
                  </p>
                </div>

                <div className="rounded-xl bg-card p-8 shadow-sm">
                  <h2 className="mb-4 border-b pb-2 text-xl font-bold text-foreground">
                    More Information
                  </h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Address
                        </span>
                        <p className="text-foreground">{business.address || "N/A"}</p>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Website
                        </span>
                        {business.website ? (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center text-primary hover:underline"
                          >
                            <Globe size={14} className="mr-1" /> {business.website}
                          </a>
                        ) : (
                          <p className="text-foreground">N/A</p>
                        )}
                      </div>
                       <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Native Place
                        </span>
                        <p className="text-foreground">{business.nativePlace || "N/A"}</p>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Registration No.
                        </span>
                        <p className="text-foreground">{business.registrationNumber || "N/A"}</p>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Reference Name
                        </span>
                        <p className="text-foreground">{business.referenceName || "N/A"}</p>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Reference Contact
                        </span>
                        <p className="text-foreground">{business.referenceContact || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="sticky top-24 rounded-xl border-t-4 border-primary bg-card p-6 shadow-md">
                  <h3 className="mb-4 flex items-center text-lg font-bold text-foreground">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${business.mobile}`}
                      className="flex items-center justify-center w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground shadow-lg transition hover:bg-primary/90 hover:shadow-xl"
                    >
                      <Phone size={20} className="mr-2" /> Call Now
                    </a>

                    {business.whatsapp && (
                      <a
                        href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center w-full rounded-lg bg-emerald-500 py-3 font-medium text-white shadow-lg transition hover:bg-emerald-600 hover:shadow-xl"
                      >
                        <MessageCircle size={20} className="mr-2" /> WhatsApp
                      </a>
                    )}

                    {business.email && (
                      <a
                        href={`mailto:${business.email}`}
                        className="flex items-center justify-center w-full rounded-lg border border-input bg-muted py-3 font-medium text-foreground transition hover:bg-muted/80"
                      >
                        <Mail size={20} className="mr-2" /> Email
                      </a>
                    )}
                  </div>

                  <div className="mt-6 border-t pt-6">
                    <div className="text-center">
                      <p className="mb-1 text-xs text-muted-foreground">Business Verification Status</p>
                      <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:text-emerald-400">
                        <CheckCircle size={12} className="mr-1" /> VERIFIED LISTING
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
