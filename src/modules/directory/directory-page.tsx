import { DirectoryContent } from "./directory-content";

export default function DirectoryPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* ── Page header ── */}
      <div className="bg-[#1a1a2e] pb-16 pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-[11px] font-semibold text-white/80 tracking-wider uppercase mb-5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            SKLPS Community
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Business Directory
          </h1>
          <p className="text-white/55 text-base max-w-xl mx-auto leading-relaxed">
            Discover and connect with verified businesses trusted by our community.
          </p>
        </div>
      </div>

      {/* ── Content pulled up to overlap header ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <DirectoryContent />
      </div>
    </div>
  );
}
