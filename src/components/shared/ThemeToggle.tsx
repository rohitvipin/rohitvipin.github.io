"use client";

import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import { useEffect, useState } from "react";
import { IconButton } from "./IconButton";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-[48px] min-w-[48px]" aria-hidden="true" />;

  return (
    <IconButton
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? (
        <FiSun size={16} aria-hidden="true" />
      ) : (
        <FiMoon size={16} aria-hidden="true" />
      )}
    </IconButton>
  );
}
