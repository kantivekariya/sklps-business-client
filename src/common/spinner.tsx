export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent ${className}`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner />
    </div>
  );
}
