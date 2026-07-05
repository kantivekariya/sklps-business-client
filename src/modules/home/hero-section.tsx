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
    <div className="relative overflow-hidden" style={{ minHeight: "92vh" }}>

      {/* Background */}
      <div className="absolute inset-0" style={{ background: "#1a1a2e" }} />

      {/* Centered content */}
      <div className="relative z-10 flex items-center justify-center min-h-[92vh] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* CENTER CONTENT */}
        <div className="flex flex-col items-center justify-center text-center py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 backdrop-blur-sm text-white text-xs font-semibold px-5 py-2 mb-7 tracking-wide"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
              SKLPS Community Business Directory
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.08] tracking-tight mb-5">
              Find & Connect with
              <br />
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #FF385C 0%, #FC642D 100%)" }}>
                Local Businesses
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/60 mb-9 max-w-md mx-auto leading-relaxed">
              Browse verified community businesses, discover job opportunities, and grow
              together inside the SKLPS network.
            </p>

            <form onSubmit={handleSearch}
              className="flex items-center bg-white rounded-2xl overflow-hidden p-1.5 mb-7 w-full"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.22)" }}
            >
              <div className="flex items-center flex-1 px-4 gap-3">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search businesses, categories, or city…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2.5" />
              </div>
              <Button type="submit" className="rounded-xl px-5 py-2.5 font-semibold text-sm shrink-0 h-auto gap-1.5">
                Search <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="text-white/35 text-[11px] font-medium">Popular:</span>
              {POPULAR.map((cat) => (
                <button key={cat} type="button"
                  onClick={() => navigate(`/directory?category=${encodeURIComponent(cat)}`)}
                  className="text-[11px] text-white/65 hover:text-white bg-white/8 hover:bg-white/15 border border-white/12 hover:border-white/25 rounded-full px-3 py-1.5 transition-all">
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              {FEATURE_PILLS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/38 text-xs">
                  <Icon className="h-3.5 w-3.5 text-primary/50" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
}
