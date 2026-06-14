import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoryFilter } from "@/components/home/category-filter";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { HomeContent } from "@/components/home/home-content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getHomeData() {
  try {
    const [businessesRes, statsRes] = await Promise.all([
      fetch(`${API_URL}/business`, { next: { revalidate: 60 } }),
      fetch(`${API_URL}/business/stats/summary`, { next: { revalidate: 60 } }),
    ]);

    const businesses = await businessesRes.json();
    const stats = await statsRes.json();

    return { businesses, stats };
  } catch {
    return {
      businesses: [],
      stats: { totalMembers: 500, totalBusinesses: 0, totalCategories: 0 },
    };
  }
}

export default async function HomePage() {
  const { businesses, stats } = await getHomeData();
  const latestBusinesses = businesses.length > 0 ? businesses.slice(0, 4) : [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="flex flex-col">
          <HeroSection />
          <StatsSection stats={stats} />
          <CategoryFilter />

          {/* Latest Businesses Section */}
          <section className="border-t bg-muted/20 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                    Latest Additions
                  </h2>
                  <p className="mt-1 max-w-2xl text-muted-foreground">
                    Discover the newest businesses joining our community network.
                  </p>
                </div>
                <Link
                  href="/directory"
                  className="hidden shrink-0 items-center text-sm font-medium text-primary hover:underline md:inline-flex"
                >
                  View Directory
                  <ArrowRight size={18} className="ml-1" />
                </Link>
              </div>

              <HomeContent latestBusinesses={latestBusinesses} latestJobs={[]} />

              <div className="mt-10 text-center md:hidden">
                <Link
                  href="/directory"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  View All Businesses <ArrowRight size={18} className="ml-1" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
