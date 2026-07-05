import clsx from "clsx";
import { Menu, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Directory", path: "/directory" },
  { name: "Jobs", path: "/jobs" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      {/* Primary colour accent strip at top */}
      <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #FF385C 0%, #FC642D 100%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ minHeight: 88 }}>

          {/* ── Logo — full SVG, no clip, large enough to read detail ── */}
          <Link to="/" className="flex items-center gap-3 shrink-0 py-2">
            <img
              src="/images/home/SKLPS%20LOGO-04.svg"
              alt="SKLPS logo"
              style={{ height: 80, width: "auto" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex flex-col leading-none">
              <span className="text-[19px] font-extrabold tracking-tight" style={{ color: "#1a1a2e" }}>
                SKLPS
              </span>
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase mt-1" style={{ color: "#FF385C" }}>
                Community Directory
              </span>
            </div>
          </Link>

          {/* ── Desktop nav links — center ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "px-4 py-2.5 rounded-full text-[13.5px] font-medium transition-all",
                  isActive(link.path)
                    ? "text-primary bg-primary/8 font-semibold"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ── Desktop action buttons ── */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link to="/business-login">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full font-medium text-[13px] h-9 px-4 text-foreground/65 hover:text-foreground"
              >
                Business Login
              </Button>
            </Link>
            <Link to="/add-business">
              <Button
                size="sm"
                className="rounded-full font-semibold text-[13px] px-5 h-9 gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Add Business
              </Button>
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {isOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={clsx(
                "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive(link.path)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/65 hover:bg-muted hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/business-login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full rounded-xl">
                Business Login
              </Button>
            </Link>
            <Link to="/add-business" onClick={() => setIsOpen(false)}>
              <Button className="w-full rounded-xl">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your Business
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
