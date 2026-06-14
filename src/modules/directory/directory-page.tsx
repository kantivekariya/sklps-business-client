import { DirectoryContent } from "./directory-content";

export default function DirectoryPage() {
  return (
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
  );
}
