"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      className="p-2 rounded border"
      onClick={() =>
        setTheme(currentTheme === "dark" ? "light" : "dark")
      }
      aria-label="Toggle dark mode"
    >
      {currentTheme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}