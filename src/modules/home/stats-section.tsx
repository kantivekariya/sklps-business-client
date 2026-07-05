import { motion } from "framer-motion";
import { Briefcase, Building2, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface StatsSectionProps {
  stats: {
    totalMembers: number;
    totalBusinesses: number;
    totalCategories: number;
  };
  loading?: boolean;
}

const STAT_CONFIG = [
  {
    key: "totalMembers" as const,
    label: "Community Members",
    desc: "Active members across the community network",
    suffix: "+",
    icon: Users,
    accent: "#FF385C",
  },
  {
    key: "totalBusinesses" as const,
    label: "Listed Businesses",
    desc: "Verified businesses ready to connect",
    suffix: "",
    icon: Building2,
    accent: "#00A699",
  },
  {
    key: "totalCategories" as const,
    label: "Business Categories",
    desc: "Industries represented in our directory",
    suffix: "",
    icon: Briefcase,
    accent: "#3D71F8",
  },
];

export function StatsSection({ stats, loading }: StatsSectionProps) {
  return (
    <section className="bg-white py-12 border-b border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <p className="text-center text-[11px] font-bold tracking-[0.22em] uppercase text-muted-foreground/50 mb-8">
          Community at a glance
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STAT_CONFIG.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-border/60 bg-white overflow-hidden p-6 flex items-start gap-4 hover:shadow-md transition-shadow duration-300 group"
            >
              {/* Left accent strip */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                style={{ background: s.accent }}
              />

              {/* Icon */}
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${s.accent}15` }}
              >
                <s.icon className="h-5 w-5" style={{ color: s.accent }} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div className="min-w-0">
                {loading ? (
                  <>
                    <div className="h-8 w-24 rounded-lg bg-muted animate-pulse mb-2" />
                    <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-40 rounded bg-muted animate-pulse mt-1.5" />
                  </>
                ) : (
                  <>
                    <p
                      className="text-3xl sm:text-[2rem] font-black leading-none"
                      style={{ color: s.accent }}
                    >
                      <AnimatedCounter value={stats[s.key]} />
                      {s.suffix}
                    </p>
                    <p className="text-sm font-bold text-foreground mt-1.5">{s.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                      {s.desc}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
