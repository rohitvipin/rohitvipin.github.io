"use client";

import { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./ThemeToggle";
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

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveSection(topmost.target.id);
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
        <a
          href="#"
          aria-label="Home"
          className="shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg border border-[var(--accent)] text-[var(--accent)] text-sm font-bold font-mono hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all"
        >
          {initials}
        </a>

        <nav
          className="hidden lg:flex items-center gap-4 flex-1 justify-center"
          aria-label="Main navigation"
        >
          {navLinks.map((l) => {
            const isActive = activeSection === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className={`min-h-[48px] flex items-center text-sm transition-colors duration-150 relative ${
                  isActive
                    ? "text-[var(--accent)] font-medium"
                    : "text-[var(--muted)] hover:text-[var(--text)] active:opacity-70"
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-[4px] left-0 right-0 h-[2px] bg-[var(--accent)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <ThemeToggle />
          <button
            ref={toggleRef}
            className="lg:hidden min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <FiX size={16} aria-hidden="true" />
            ) : (
              <FiMenu size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-[var(--border)] bg-[var(--bg)]"
        >
          <nav className="px-6 py-4 flex flex-col gap-2" aria-label="Mobile navigation links">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  toggleRef.current?.focus();
                  setMobileOpen(false);
                }}
                aria-current={activeSection === l.href.slice(1) ? "location" : undefined}
                className={`min-h-[48px] flex items-center text-sm transition-colors ${
                  activeSection === l.href.slice(1)
                    ? "text-[var(--accent)] font-medium"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="px-6 pb-4 flex justify-end border-t border-[var(--border)]">
            <button
              onClick={() => {
                setMobileOpen(false);
                toggleRef.current?.focus();
              }}
              aria-label="Close navigation menu"
              className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
            >
              <FiX size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
