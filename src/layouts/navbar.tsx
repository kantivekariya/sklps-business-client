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
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/images/home/SKLPS%20LOGO-04.svg"
              alt="SKLPS"
              className="h-11 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <span className="text-lg font-extrabold text-foreground tracking-tight">SKLPS</span>
          </Link>

          {/* Desktop nav links — center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  isActive(link.path)
                    ? "text-primary font-semibold"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/business-login">
              <Button variant="ghost" size="sm" className="rounded-full font-medium text-sm">
                Business Login
              </Button>
            </Link>
            <Link to="/add-business">
              <Button size="sm" className="rounded-full font-semibold px-5">
                <PlusCircle className="mr-1.5 h-4 w-4" />
                Add Business
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
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
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
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
