import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  Building,
  CalendarDays,
  Car,
  Coffee,
  Cpu,
  DollarSign,
  Film,
  Gem,
  Hammer,
  HeartPulse,
  Home,
  Megaphone,
  MoreHorizontal,
  Palette,
  Scale,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Tractor,
  Truck,
  Utensils,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Briefcase,
  Building,
  CalendarDays,
  Car,
  Coffee,
  Cpu,
  DollarSign,
  Film,
  Gem,
  Hammer,
  HeartPulse,
  Home,
  Megaphone,
  MoreHorizontal,
  Palette,
  Scale,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Tractor,
  Truck,
  Utensils,
};

export function CategoryFilter() {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white border-b py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Browse by Category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore businesses across every industry
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/directory")}
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline hidden sm:block"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden pb-2">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
              <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="h-14 w-14 rounded-2xl bg-muted animate-pulse" />
                <div className="h-3 w-12 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat, i) => {
              const Icon = ICON_MAP[cat.icon] ?? Store;
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.3 }}
                  viewport={{ once: true }}
                  onClick={() => navigate(`/directory?category=${encodeURIComponent(cat.name)}`)}
                  className="group flex flex-col items-center gap-2 min-w-[72px] snap-start"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-200 group-hover:scale-105"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: cat.color }} />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground text-center leading-tight transition-colors w-16 line-clamp-2">
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
