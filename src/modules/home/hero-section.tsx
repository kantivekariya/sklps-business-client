import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Building2, Search, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const POPULAR = ["Food & Beverage", "IT Services", "Health", "Real Estate", "Finance"];

const FEATURE_PILLS = [
  { icon: Building2, label: "500+ Businesses" },
  { icon: Users, label: "Community Verified" },
  { icon: Briefcase, label: "Job Listings" },
];

export function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/directory${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <div className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
      {/* Background gradient — project themed, no external image dependency */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)",
        }}
      />

      {/* Coral glow blobs */}
      <div
        className="absolute -top-32 -right-32 w-[640px] h-[640px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,56,92,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 -left-24 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,56,92,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Decorative floating cards — desktop only */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 pointer-events-none">
        {[
          { label: "New Business", sub: "TechSolutions Ltd", color: "#FF385C" },
          { label: "Job Posted", sub: "Software Engineer", color: "#00A699" },
          { label: "Community", sub: "1,200+ Members", color: "#FC642D" },
        ].map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3.5 w-52"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: card.color }}
              />
              <div>
                <p className="text-white text-xs font-semibold">{card.label}</p>
                <p className="text-white/55 text-[11px]">{card.sub}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[90vh] px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="w-full max-w-3xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-5 py-2 mb-7"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shrink-0" />
            SKLPS Community Business Directory
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            Find & Connect with
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, #FF385C 0%, #FC642D 100%)",
              }}
            >
              Local Businesses
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Browse hundreds of verified community businesses, find job opportunities, and grow
            together in the SKLPS network.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden p-1.5 mb-8"
          >
            <div className="flex items-center flex-1 px-4 gap-3">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search businesses, categories, or city…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2.5"
              />
            </div>
            <Button
              type="submit"
              className="rounded-xl px-6 py-3 font-semibold text-sm shrink-0 h-auto gap-1.5"
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Popular tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <span className="text-white/40 text-xs font-medium">Popular:</span>
            {POPULAR.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => navigate(`/directory?category=${encodeURIComponent(cat)}`)}
                className="text-xs text-white/75 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 hover:border-white/30 rounded-full px-3.5 py-1.5 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {FEATURE_PILLS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/50 text-sm">
                <Icon className="h-4 w-4 text-primary/70" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade to white/background */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
