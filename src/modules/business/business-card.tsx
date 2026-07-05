import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Business } from "@/types";

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

interface BusinessCardProps {
  business: Business;
  index?: number;
}

export function BusinessCard({ business, index = 0 }: BusinessCardProps) {
  const { _id, businessName, name, category, city, description, logoUrl, mobile, whatsapp, yearsInBusiness } =
    business;
  const [imgError, setImgError] = useState(false);
  const color = CATEGORY_COLORS[category] ?? "#FF385C";
  const showPlaceholder = !logoUrl || imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
      viewport={{ once: true }}
      className="group flex flex-col bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* ── Cover image ── */}
      <Link to={`/directory/${_id}`} className="block relative overflow-hidden shrink-0" style={{ aspectRatio: "16/9" }}>
        {showPlaceholder ? (
          <div
            className="h-full w-full flex flex-col items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${color}18 0%, ${color}35 100%)` }}
          >
            <span
              className="text-5xl font-black uppercase select-none"
              style={{ color: `${color}70` }}
            >
              {businessName?.charAt(0) ?? "B"}
            </span>
          </div>
        ) : (
          <img
            src={logoUrl}
            alt={businessName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Bottom gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        <span
          className="absolute top-3 left-3 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {category}
        </span>

        {/* Years in business */}
        {yearsInBusiness && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/90">
            <Clock className="h-2.5 w-2.5" />
            {yearsInBusiness}y
          </span>
        )}
      </Link>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/directory/${_id}`} className="block mb-3">
          <h3 className="font-bold text-[15px] text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {businessName}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" style={{ color }} />
            <span className="truncate">{city || "Location N/A"}</span>
            {name && (
              <>
                <span className="mx-1 text-border">·</span>
                <span className="truncate">{name}</span>
              </>
            )}
          </div>
        </Link>

        <p className="text-[12.5px] text-muted-foreground line-clamp-2 leading-relaxed flex-1 mb-4">
          {description || "No description available."}
        </p>

        {/* ── Action buttons ── */}
        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </a>
          ) : (
            <a
              href={`tel:${mobile}`}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          )}
          {whatsapp && (
            <a
              href={`tel:${mobile}`}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-semibold transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <Phone className="h-3.5 w-3.5" />
              Call
            </a>
          )}
          <Link
            to={`/directory/${_id}`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
