import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <p className="text-8xl font-bold gradient-text">404</p>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Page not found</h1>
        <p className="text-[var(--muted)] max-w-xs mx-auto">
          This page does not exist. Head back to the portfolio.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
