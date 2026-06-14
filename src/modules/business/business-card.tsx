import { motion } from "framer-motion";
import { MapPin, MessageCircle, Phone } from "lucide-react";
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
}

export function BusinessCard({ business }: BusinessCardProps) {
  const { _id, businessName, name, category, city, description, logoUrl, mobile, whatsapp } =
    business;
  const [imgError, setImgError] = useState(false);
  const color = CATEGORY_COLORS[category] ?? "#FF385C";
  const showPlaceholder = !logoUrl || imgError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
    >
      <Link to={`/directory/${_id}`} className="group block">
        {/* Image area — Airbnb style: no card border, rounded image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl mb-3">
          {showPlaceholder ? (
            <div
              className="h-full w-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}
            >
              <span
                className="text-6xl font-black uppercase select-none"
                style={{ color: `${color}55` }}
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

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              {category}
            </span>
          </div>

          {/* Action buttons overlay */}
          <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            )}
            <a
              href={`tel:${mobile}`}
              onClick={(e) => e.stopPropagation()}
              title="Call"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Text content — clean Airbnb style */}
        <div className="space-y-0.5 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
              {businessName}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{city || "Location N/A"}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 pt-0.5 leading-relaxed">
            {description || "No description available."}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
