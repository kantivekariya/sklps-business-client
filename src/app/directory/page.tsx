import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { DirectoryContent } from "@/components/directory/directory-content";

export const metadata = {
  title: "Business Directory",
  description:
    "Find trusted businesses and services within our community. Browse by category and location.",
};

export default function DirectoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen bg-muted/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Business Directory
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Find trusted businesses and services within our community.
              </p>
            </div>

            <DirectoryContent />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
