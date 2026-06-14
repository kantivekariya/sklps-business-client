import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, PlusCircle, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Business, HomeStats } from "@/types";
import { CategoryFilter } from "./category-filter";
import { HeroSection } from "./hero-section";
import { homeService } from "./home.service";
import { HomeContent } from "./home-content";
import { StatsSection } from "./stats-section";

const DEFAULT_STATS: HomeStats = { totalMembers: 500, totalBusinesses: 0, totalCategories: 0 };

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: PlusCircle,
    title: "List Your Business",
    desc: "Submit your business details and get listed in the community directory within 24 hours.",
    color: "#FF385C",
  },
  {
    step: "02",
    icon: Search,
    title: "Discover Businesses",
    desc: "Browse hundreds of verified community businesses across all categories.",
    color: "#00A699",
  },
  {
    step: "03",
    icon: Users,
    title: "Connect & Grow",
    desc: "Build relationships, post jobs, and collaborate with fellow community members.",
    color: "#FC642D",
  },
];

const FEATURES = ["Free to list", "Verified community", "Direct contact", "Job postings"];

export default function HomePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<HomeStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([homeService.getBusinesses(), homeService.getStats()])
      .then(([bizList, statsData]) => {
        setBusinesses(bizList);
        setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col bg-white">
      {/* Hero */}
      <HeroSection />

      {/* Stats bar */}
      <StatsSection stats={stats} loading={loading} />

      {/* Categories */}
      <CategoryFilter />

      {/* Recently Added */}
      <section className="py-14 sm:py-20 bg-[#F7F7F7]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Recently Added</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Newest businesses joining our community
              </p>
            </div>
            <Link
              to="/directory"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-2"
            >
              Show all <ArrowRight size={15} />
            </Link>
          </div>

          <HomeContent latestBusinesses={businesses.slice(0, 4)} loading={loading} />

          <div className="mt-8 text-center sm:hidden">
            <Link to="/directory">
              <Button variant="outline" className="rounded-full border-border">
                Show all businesses <ArrowRight size={15} className="ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Joining the SKLPS community directory is simple, free, and instant.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5 shadow-sm"
                  style={{ backgroundColor: `${s.color}15` }}
                >
                  <s.icon className="h-7 w-7" style={{ color: s.color }} />
                </div>
                <span
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: s.color }}
                >
                  Step {s.step}
                </span>
                <h3 className="text-base font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section
        className="py-16 sm:py-24"
        style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF5A5F 50%, #FC642D 100%)" }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
              Ready to get discovered?
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-10 max-w-lg mx-auto">
              Join thousands of community businesses already growing with SKLPS Directory.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Link to="/add-business">
                <Button
                  size="lg"
                  className="rounded-full font-semibold px-8 bg-white text-primary hover:bg-white/90 shadow-xl"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Your Business
                </Button>
              </Link>
              <Link to="/directory">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full font-semibold px-8 border-white/40 text-white hover:bg-white/10 bg-transparent"
                >
                  Browse Directory
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {FEATURES.map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-sm text-white/75">
                  <CheckCircle className="h-4 w-4 text-white/50" />
                  {f}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
