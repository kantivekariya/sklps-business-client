"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
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
import Link from "next/link";

const categories = [
  { name: "Agriculture", icon: Tractor, className: "bg-green-500/10 text-green-600 dark:text-green-400" },
  { name: "Art & Design", icon: Palette, className: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400" },
  { name: "Automotive", icon: Car, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  { name: "Beauty & Care", icon: Sparkles, className: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
  { name: "Construction", icon: Building, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { name: "Diamond", icon: Gem, className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { name: "Education", icon: BookOpen, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { name: "Electronics", icon: Cpu, className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  { name: "Event Planning", icon: CalendarDays, className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { name: "Finance", icon: DollarSign, className: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  { name: "Food & Beverage", icon: Utensils, className: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { name: "Health", icon: HeartPulse, className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  { name: "Hospitality", icon: Coffee, className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" },
  { name: "IT Services", icon: Briefcase, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { name: "Legal Services", icon: Scale, className: "bg-stone-500/10 text-stone-600 dark:text-stone-400" },
  { name: "Manufacturing", icon: Hammer, className: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400" },
  { name: "Marketing", icon: Megaphone, className: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { name: "Media", icon: Film, className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { name: "Real Estate", icon: Home, className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { name: "Retail", icon: ShoppingBag, className: "bg-lime-500/10 text-lime-600 dark:text-lime-400" },
  { name: "Textile", icon: Shirt, className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
  { name: "Trading", icon: Store, className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { name: "Transportation", icon: Truck, className: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
  { name: "Professional", icon: Briefcase, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  { name: "Other", icon: MoreHorizontal, className: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400" },
];

export function CategoryFilter() {
  return (
    <div className="bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Explore Categories</h2>
            <p className="mt-1 text-muted-foreground">Find businesses across different industries.</p>
          </div>
          <Link
            href="/directory"
            className="hidden shrink-0 items-center text-sm font-medium text-primary hover:underline md:flex"
          >
            View All <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((cat, index) => (
            <Link href={`/directory?category=${cat.name}`} key={cat.name} className="group">
              <motion.div
                className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 text-center shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md group-hover:bg-muted/50 sm:p-5"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                viewport={{ once: true }}
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${cat.className}`}
                >
                  <cat.icon size={24} />
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {cat.name}
                </h3>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/directory"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            View All Categories <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
