"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface AnimateOnScrollProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
}

export function AnimateOnScroll({ sectionId, children, className }: AnimateOnScrollProps) {
  const storageKey = `anim:${sectionId}`;
  // Always false on SSR so server/client HTML matches (fixes hydration mismatch)
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setVisible(true);
        return;
      }
    } catch {
      // matchMedia unavailable
    }
    try {
      if (sessionStorage.getItem(storageKey)) {
        setVisible(true);
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        // ignore
      }
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          try {
            sessionStorage.setItem(storageKey, "1");
          } catch {
            // ignore
          }
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [storageKey]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
