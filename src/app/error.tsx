"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-6 text-center">
        <p className="gradient-text text-8xl font-bold">!</p>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Something went wrong</h1>
        <p className="mx-auto max-w-xs text-[var(--muted)]">
          An unexpected error occurred. Try reloading the page.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
