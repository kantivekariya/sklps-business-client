import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

const LINKS = {
  Explore: [
    { label: "Home", to: "/" },
    { label: "Business Directory", to: "/directory" },
    { label: "Jobs", to: "/jobs" },
    { label: "Add Business", to: "/add-business" },
  ],
  Business: [
    { label: "Business Login", to: "/business-login" },
    { label: "Post a Job", to: "/business-dashboard/jobs/post" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#222222] text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo variant="dark" iconSize={40} linkTo={false} />
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              Connecting the SKLPS community through business. Discover, network, and grow together
              with verified local businesses.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-neutral-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} SKLPS Business Directory. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-neutral-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-neutral-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-neutral-300 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
