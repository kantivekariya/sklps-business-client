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
    suffix: "+",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    key: "totalBusinesses" as const,
    label: "Listed Businesses",
    suffix: "",
    icon: Building2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "totalCategories" as const,
    label: "Business Categories",
    suffix: "",
    icon: Briefcase,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
];

export function StatsSection({ stats, loading }: StatsSectionProps) {
  return (
    <section className="bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-border">
          {STAT_CONFIG.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 py-7 px-4 sm:px-8 text-center sm:text-left"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.bg}`}
              >
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-extrabold ${s.color} leading-none`}>
                  {loading ? (
                    <span className="inline-block h-8 w-16 rounded bg-muted animate-pulse" />
                  ) : (
                    <>
                      <AnimatedCounter value={stats[s.key]} />
                      {s.suffix}
                    </>
                  )}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
