import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
      <h2 className="mb-2 text-2xl font-bold text-foreground">Page Not Found</h2>
      <p className="mb-6 text-center text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
