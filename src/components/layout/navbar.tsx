"use client";

import clsx from "clsx";
import { Menu, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Directory", path: "/directory" },
    { name: "Jobs", path: "/jobs" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-background border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-foreground">SKLPS Directory</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}

            <ThemeToggle />

            <Link href="/add">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Business
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-foreground focus:outline-none p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "block px-3 py-2.5 rounded-lg text-base font-medium transition-colors",
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}

            <Link href="/add" onClick={() => setIsOpen(false)} className="block mt-4">
              <Button className="w-full">Add Your Business</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
