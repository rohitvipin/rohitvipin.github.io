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
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        <p className="text-8xl font-bold gradient-text">!</p>
        <h1 className="text-2xl font-semibold text-[var(--text)]">Something went wrong</h1>
        <p className="text-[var(--muted)] max-w-xs mx-auto">
          An unexpected error occurred. Try reloading the page.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
