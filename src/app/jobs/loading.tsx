export default function JobsLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="mt-4 text-muted-foreground">Loading jobs...</p>
    </div>
  );
}
