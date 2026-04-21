"use client";

import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { FiMenu, FiX, FiSearch } from "react-icons/fi";
import type { SearchResult, SearchIndex } from "@/lib/search";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Leadership", href: "#leadership" },
  { label: "Skills", href: "#skills" },
  { label: "Community", href: "#community" },
  { label: "Awards", href: "#awards" },
  { label: "Education", href: "#education" },
];

export interface NavProps {
  initials: string;
}

export default function Nav({ initials }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const searchIndexRef = useRef<SearchIndex | null>(null);
  const searchModuleRef = useRef<typeof import("@/lib/search") | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sectionIds = links.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      }
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(handleIntersect, {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      });
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || !searchIndexRef.current || !searchModuleRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = searchQuery.trim();
      if (trimmed) {
        setActiveResultIndex(-1);
        const idx = searchIndexRef.current;
        const mod = searchModuleRef.current;
        if (idx && mod) setSearchResults(mod.queryIndex(idx, trimmed));
      } else {
        setSearchResults([]);
      }
    }, 175);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const panel = document.getElementById("search-panel");
      const triggerEl = searchTriggerRef.current;
      const insidePanel = panel?.contains(target) ?? false;
      const insideTrigger = triggerEl?.contains(target) ?? false;
      if (!insidePanel && !insideTrigger) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setActiveResultIndex(-1);
        searchTriggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [searchOpen]);

  function closeSearch() {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setActiveResultIndex(-1);
    searchTriggerRef.current?.focus();
  }

  async function activateSearch() {
    if (mobileOpen) setMobileOpen(false);
    if (searchError) setSearchError(false);
    setSearchOpen(true);
    if (searchIndexRef.current) return;
    setSearchLoading(true);
    try {
      const mod = await import("@/lib/search");
      searchModuleRef.current = mod;
      const data = await import("@/lib/data");
      searchIndexRef.current = mod.buildSearchIndex({
        experience: data.experience,
        projects: data.projects,
        skills: data.skills,
        awards: data.awards,
        community: data.community,
        education: data.education,
        leadership: data.leadership,
      });
    } catch (err) {
      console.error("[Search] Failed to load search module:", err);
      setSearchError(true);
      setSearchOpen(false);
    } finally {
      setSearchLoading(false);
    }
  }

  function selectResult(result: SearchResult) {
    const el = document.querySelector(result.scrollAnchor);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    closeSearch();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveResultIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveResultIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeResultIndex >= 0) {
      e.preventDefault();
      selectResult(searchResults[activeResultIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSearch();
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 will-change-transform${
        isScrolling ? "" : " backdrop-blur-md"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#"
          className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded border border-[var(--accent)] text-[var(--accent)] text-sm font-bold hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-all"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
          aria-label="Home"
        >
          {initials}
        </a>

        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {links.map((l) => {
            const isActive = activeSection === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors duration-150 relative ${
                  isActive
                    ? "text-[var(--accent)] font-medium"
                    : "text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-[var(--accent)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            ref={searchTriggerRef}
            onClick={activateSearch}
            disabled={searchError}
            aria-expanded={searchOpen}
            aria-label="Search site"
            className={`min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg border border-[var(--border)] transition-all${
              searchError
                ? " opacity-50 cursor-not-allowed text-[var(--muted)]"
                : " text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)]"
            }`}
          >
            <FiSearch size={16} aria-hidden="true" />
          </button>

          <button
            className="md:hidden min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-all"
            onClick={() => {
              if (searchOpen) {
                setSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
                setActiveResultIndex(-1);
              }
              setMobileOpen((v) => !v);
            }}
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

      {searchOpen && (
        <div
          id="search-panel"
          role="search"
          className="border-t border-[var(--border)] bg-[var(--bg)] px-6 py-3 shadow-lg"
        >
          <div className="max-w-6xl mx-auto">
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {searchResults.length > 0
                ? `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for ${searchQuery}`
                : ""}
            </span>

            <input
              ref={searchInputRef}
              id="search-input"
              role="combobox"
              aria-label="Search site"
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-activedescendant={
                activeResultIndex >= 0 ? `search-result-${activeResultIndex}` : undefined
              }
              aria-expanded={searchResults.length > 0}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search..."
              className="w-full bg-transparent text-[var(--text)] placeholder:text-[var(--muted)] text-sm outline-none py-1"
            />

            {searchLoading && (
              <p role="status" className="text-xs text-[var(--muted)] mt-2">
                Loading...
              </p>
            )}

            {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
              <p className="text-xs text-[var(--muted)] mt-2">No results found.</p>
            )}

            {searchResults.length > 0 && (
              <ul
                id="search-results"
                role="listbox"
                aria-label="Search results"
                className="mt-2 space-y-1 max-h-64 overflow-y-auto"
              >
                {searchResults.map((r, i) => (
                  <li
                    key={`${r.sectionId}-${i}`}
                    id={`search-result-${i}`}
                    role="option"
                    aria-selected={activeResultIndex === i}
                    onMouseDown={() => selectResult(r)}
                    className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                      activeResultIndex === i
                        ? "bg-[var(--accent)] text-white"
                        : "hover:bg-[var(--surface)] text-[var(--text)]"
                    }`}
                  >
                    <span className="font-medium block">{r.title}</span>
                    <span className="text-xs opacity-70 block truncate">{r.snippet}</span>
                    <span className="text-xs opacity-50">{r.sectionLabel}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav
          className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-6 py-4 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
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
      )}
    </header>
  );
}
