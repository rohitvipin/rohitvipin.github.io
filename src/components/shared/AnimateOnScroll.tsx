"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export interface AnimateOnScrollProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
}

export function AnimateOnScroll({ sectionId, children, className }: AnimateOnScrollProps) {
  const storageKey = `anim:${sectionId}`;
  const [visible, setVisible] = useState(() => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return true;
      }
      return !!sessionStorage.getItem(storageKey);
    } catch {
      return false;
    }
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) {
      setVisible(true);
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        // sessionStorage unavailable — fail open
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
            // sessionStorage unavailable — fail open
          }
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [sectionId, storageKey, visible]);

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
