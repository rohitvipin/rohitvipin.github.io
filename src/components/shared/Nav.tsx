"use client";

import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { IconButton, IconButtonLink } from "./IconButton";
import { FiMenu, FiX } from "react-icons/fi";
import type { NavLink } from "@/types";

export interface NavProps {
  initials: string;
  navLinks: NavLink[];
}

export function Nav({ initials, navLinks }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.slice(1));
    // Track each section's current intersection state so the active link
    // clears when the user scrolls back into the hero (above the first
    // observed section), not just when a new section enters the band.
    const state = new Map<string, { intersecting: boolean; top: number }>();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          state.set(e.target.id, {
            intersecting: e.isIntersecting,
            top: e.boundingClientRect.top,
          });
        }
        let pick = "";
        let bestTop = Number.POSITIVE_INFINITY;
        for (const [id, v] of state) {
          if (v.intersecting && v.top < bestTop) {
            bestTop = v.top;
            pick = id;
          }
        }
        setActiveSection(pick);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [navLinks]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prior;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main");
    if (!main) return;
    if (mobileOpen) {
      main.setAttribute("inert", "");
    } else {
      main.removeAttribute("inert");
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    drawerRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const drawer = drawerRef.current;
        if (!drawer) return;
        const focusable = Array.from(
          drawer.querySelectorAll<HTMLElement>(
            'a[href], button, input, select, textarea, [contenteditable], [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-6">
        <IconButtonLink
          variant="outline-accent"
          href="#"
          aria-label="Home"
          className="shrink-0 font-mono text-sm font-bold"
        >
          {initials}
        </IconButtonLink>

        <nav
          className="hidden flex-1 items-center justify-center gap-4 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((l) => {
            const isActive = activeSection === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative flex min-h-[48px] min-w-[48px] items-center justify-center px-2 text-sm transition-colors duration-150 ${
                  isActive
                    ? "font-medium text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--text)] active:opacity-70"
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute right-0 -bottom-[4px] left-0 h-[2px] bg-[var(--accent)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <IconButton
            variant="outline"
            buttonRef={toggleRef}
            className="lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <FiX size={16} aria-hidden="true" />
            ) : (
              <FiMenu size={16} aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </div>

      {mobileOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="border-t border-[var(--border)] bg-[var(--bg)] lg:hidden"
        >
          <nav className="flex flex-col gap-2 px-6 py-4" aria-label="Mobile navigation links">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  toggleRef.current?.focus();
                  setMobileOpen(false);
                }}
                aria-current={activeSection === l.href.slice(1) ? "location" : undefined}
                className={`flex min-h-[48px] items-center text-sm transition-colors ${
                  activeSection === l.href.slice(1)
                    ? "font-medium text-[var(--accent)]"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex justify-end border-t border-[var(--border)] px-6 pb-4">
            <IconButton
              variant="outline"
              onClick={() => {
                setMobileOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Close navigation menu"
            >
              <FiX size={16} aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      )}
    </header>
  );
}
