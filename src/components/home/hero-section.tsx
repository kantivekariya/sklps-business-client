"use client";

import { motion } from "framer-motion";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground">
      <div className="absolute inset-0 bg-pattern opacity-10">
        <svg fill="currentColor" viewBox="0 0 100 100" className="w-full h-full text-white">
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          SKLPS Business Directory
        </motion.h1>

        <motion.p
          className="mb-10 max-w-2xl text-base text-primary-foreground/90 sm:text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Connect, collaborate, and grow with businesses within our community.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex-1 sm:flex-initial">
            <Link
              href="/directory"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary-foreground/20 bg-background px-6 py-3 text-base font-medium text-foreground shadow-lg transition-all hover:bg-background/95 hover:shadow-xl active:scale-[0.98] sm:w-auto"
            >
              <Search className="mr-2" size={20} />
              View Directory
            </Link>
          </div>
          <div className="flex-1 sm:flex-initial">
            <Link
              href="/add"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-primary-foreground px-6 py-3 text-base font-medium text-primary shadow-lg transition-all hover:bg-primary-foreground/95 hover:shadow-xl active:scale-[0.98] sm:w-auto"
            >
              <PlusCircle className="mr-2" size={20} />
              Add Your Business
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
