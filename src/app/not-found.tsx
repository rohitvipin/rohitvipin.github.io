import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-6 text-center">
        <p className="gradient-text text-8xl font-bold">404</p>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Page not found</h1>
        <p className="mx-auto max-w-xs text-[var(--muted)]">
          This page does not exist. Head back to the portfolio.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
