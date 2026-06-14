"use client";

import { motion } from "framer-motion";
import { Briefcase, Tag, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
interface StatsSectionProps {
  stats: {
    totalMembers: number;
    totalBusinesses: number;
    totalCategories: number;
  };
  loading?: boolean;
}

export function StatsSection({ stats, loading }: StatsSectionProps) {
  const statItems = [
    {
      label: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      className: "bg-primary/10 text-primary",
    },
    {
      label: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Briefcase,
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      className: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="border-y bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.className}`}>
                <stat.icon size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">
                  {loading ? (
                    "..."
                  ) : (
                    <AnimatedCounter value={stat.value} />
                  )}
                  {stat.label === "Total Members" ? "+" : ""}
                </p>
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
