"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GB } from "country-flag-icons/react/3x2";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes.js";

const nav_items = [
  { label: "Home", href: routes.home },
  { label: "Roadmap", href: routes.roadmap.root },
  { label: "Flashcards", href: routes.flashcards.root },
  { label: "Vocabulary", href: routes.vocabulary.root },
  { label: "Practice", href: routes.practice.root },
];

function DarkModeToggle() {
  const { isDark, toggleDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-12 sm:w-14 h-7 sm:h-8 rounded-full shrink-0 transition-colors duration-300 ${
        isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"
      }`}
    >
      <span
        className={`absolute inset-0 flex items-center ${
          isDark ? "justify-end pr-2" : "justify-start pl-2"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-gray-300" fill="currentColor" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
        )}
      </span>

      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={`absolute top-0.5 sm:top-1 w-5 sm:w-6 h-5 sm:h-6 rounded-full shadow-md ${
          isDark ? "left-1 bg-white" : "right-1 bg-gray-900"
        }`}
      />
    </button>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        <Link href="/" className="flex items-center gap-2 select-none shrink-0">
          <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
            字
          </div>
          <span className="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-100 whitespace-nowrap">
            hanzi<span className="text-brand-500">-study</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center bg-gray-50/80 dark:bg-gray-800/60 p-1 rounded-full border border-gray-100 dark:border-gray-700">
          {nav_items.map((item) => {
            const isActive = item.href === routes.home
              ? pathName === routes.home
              : pathName === item.href || pathName.startsWith(item.href + "/");
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-4 py-1.5 text-sm font-medium transition-colors rounded-full ${
                  isActive
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute inset-0 bg-brand-500 rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            aria-label="Select language"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-xs"
          >
            <GB className="w-4 h-auto rounded-[2px]" />
            <span>EN</span>
          </button>

          <DarkModeToggle />
          <Link
            href={routes.auth.login}
            className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-brand-500 transition-colors ml-1"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-current" />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f172a]"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              <Link
                href={routes.auth.login}
                className="w-full text-left px-4 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm mb-2"
              >
                Sign In
              </Link>

              {nav_items.map((item) => {
                const isActive = item.href === routes.home
                  ? pathName === routes.home
                  : pathName === item.href || pathName.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-brand-500 dark:text-emerald-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <button
                type="button"
                aria-label="Select language"
                className="w-full flex items-center gap-2 px-4 py-3 mt-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                <GB className="w-4 h-auto rounded-[2px]" />
                <span>English</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}