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
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Business } from "@/types";
import { businessService } from "./business.service";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    businessService
      .getById(id)
      .then(setBusiness)
      .catch(() => navigate("/directory", { replace: true }))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/directory"
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
                <img
                  src={business.logoUrl}
                  alt={business.businessName}
                  className="h-full w-full object-contain p-2 rounded-xl"
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
  );
}
