import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">SKLPS Directory</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Connecting our community members through business. Discover, network, and grow together.
            </p>
          </div>
          <div>
            <h4 className="text-base font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/directory" className="transition-colors hover:text-foreground">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/add" className="transition-colors hover:text-foreground">
                  Add Business
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-foreground">Community</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>About SKLPS</li>
              <li>Contact Support</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SKLPS Business Directory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
