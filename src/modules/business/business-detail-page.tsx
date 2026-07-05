import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
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

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Beverage": "#FF5A5F",
  Health: "#FF385C",
  "IT Services": "#3D71F8",
  "Real Estate": "#00A699",
  Finance: "#FC642D",
  Education: "#00A699",
  Retail: "#8CE071",
  "Beauty & Care": "#FFC857",
  Automotive: "#565A5C",
  Construction: "#FC642D",
  Diamond: "#3D71F8",
  Agriculture: "#8CE071",
  "Art & Design": "#FF5A5F",
  "Event Planning": "#B4A0E5",
  Hospitality: "#FFC857",
  "Legal Services": "#565A5C",
  Manufacturing: "#9B9B9B",
  Marketing: "#FF385C",
  Media: "#3D71F8",
  Textile: "#B4A0E5",
  Trading: "#00A699",
  Transportation: "#565A5C",
  Professional: "#3D71F8",
};

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

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

  const color = CATEGORY_COLORS[business.category] ?? "#FF385C";
  const showPlaceholder = !business.logoUrl || imgError;

  return (
    <div className="min-h-screen bg-muted/20">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden" style={{ background: "#0f0c29" }}>
        {/* Blurred cover image as bg */}
        {!showPlaceholder && (
          <img
            src={business.logoUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-20 blur-2xl scale-110"
          />
        )}
        {/* Category colour glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 70% 50%, ${color}22 0%, transparent 65%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-14">
          {/* Back link */}
          <Link
            to="/directory"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-medium transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Logo / image */}
            <div
              className="h-28 w-28 sm:h-36 sm:w-36 shrink-0 rounded-2xl border-4 border-white/20 overflow-hidden shadow-2xl"
              style={{ background: showPlaceholder ? `linear-gradient(135deg, ${color}33, ${color}66)` : undefined }}
            >
              {showPlaceholder ? (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-5xl font-black uppercase" style={{ color: `${color}cc` }}>
                    {business.businessName.charAt(0)}
                  </span>
                </div>
              ) : (
                <img
                  src={business.logoUrl}
                  alt={business.businessName}
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold text-white"
                  style={{ backgroundColor: color }}
                >
                  <Briefcase className="h-3 w-3" />
                  {business.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
                  <BadgeCheck className="h-3 w-3" />
                  Verified Listing
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">
                {business.businessName}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> {business.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {business.city}
                  {business.nativePlace ? `, ${business.nativePlace}` : ""}
                </span>
                {business.yearsInBusiness && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {business.yearsInBusiness} years in business
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: main content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: color }}
                >
                  <Building2 className="h-4 w-4" />
                </span>
                About {business.businessName}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground whitespace-pre-wrap">
                {business.description || "No description provided."}
              </p>
            </div>

            {/* Business details */}
            <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: color }}
                >
                  <MapPin className="h-4 w-4" />
                </span>
                Business Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoRow icon={MapPin} label="Address" value={business.address} />
                <InfoRow icon={Globe} label="Website" value={business.website} />
                <InfoRow icon={MapPin} label="Native Place" value={business.nativePlace} />
                <InfoRow icon={Calendar} label="Years in Business" value={business.yearsInBusiness ? `${business.yearsInBusiness} years` : null} />
                <InfoRow icon={BadgeCheck} label="Registration No." value={business.registrationNumber} />
                <InfoRow icon={User} label="Reference" value={business.referenceName} />
              </div>
              {business.website && (
                <div className="mt-6 pt-5 border-t">
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: contact sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">

              {/* Contact card */}
              <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                {/* Coloured top strip */}
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
                <div className="p-6">
                  <h3 className="text-base font-bold text-foreground mb-5">Contact Business</h3>
                  <div className="space-y-3">
                    <a
                      href={`tel:${business.mobile}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-[0.98]"
                      style={{ backgroundColor: color }}
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                    {business.whatsapp && (
                      <a
                        href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md active:scale-[0.98]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                    {business.email && (
                      <a
                        href={`mailto:${business.email}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                      >
                        <Mail className="h-4 w-4" />
                        Send Email
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick info card */}
              <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Category</p>
                      <p className="font-medium text-foreground">{business.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Location</p>
                      <p className="font-medium text-foreground">{business.city}</p>
                    </div>
                  </div>
                  {business.yearsInBusiness && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Experience</p>
                        <p className="font-medium text-foreground">{business.yearsInBusiness} years</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">Status</p>
                      <p className="font-semibold text-emerald-600">Verified Listing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back link */}
              <Link
                to="/directory"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
