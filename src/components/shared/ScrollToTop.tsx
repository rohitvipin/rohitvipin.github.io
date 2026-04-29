"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed right-6 bottom-6 z-40 flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] shadow-lg transition-opacity hover:opacity-90"
    >
      <FiArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
