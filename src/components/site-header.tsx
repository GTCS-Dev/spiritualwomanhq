"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, MoonStar, Sun, X } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/competitions", label: "Competitions" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sw_theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", isDarkTheme);
    document.documentElement.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
    localStorage.setItem("sw_theme", isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  function toggleTheme() {
    const nextThemeIsDark = !isDarkTheme;
    setIsDarkTheme(nextThemeIsDark);
    document.documentElement.classList.toggle("theme-dark", nextThemeIsDark);
    document.documentElement.setAttribute("data-theme", nextThemeIsDark ? "dark" : "light");
    localStorage.setItem("sw_theme", nextThemeIsDark ? "dark" : "light");
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-(--ash) bg-(--container)/96 shadow-[0_8px_24px_-18px_rgba(31,24,34,0.28)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-4 py-3.5 sm:px-6">
        {/* Logo — always visible */}
        <SiteLogo />

        {/* Desktop nav — centred, fills space, links flush right */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium tracking-wide transition-colors ${
                isActive(item.href)
                  ? "bg-(--blush) font-semibold text-(--rose)"
                  : "text-(--stone) hover:bg-(--blush) hover:text-(--rose)"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Separator */}
          <span className="mx-1.5 h-5 w-px bg-(--ash)" aria-hidden />

          {/* Actions */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-(--stone) transition-colors hover:bg-(--blush) hover:text-(--rose)"
            aria-label="Toggle dark theme"
          >
            {isDarkTheme ? <Sun size={17} /> : <MoonStar size={17} />}
          </button>

          <Link
            href="/admin"
            className="ml-1 rounded-full bg-(--rose) px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-(--rose-dark)"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile actions */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark theme"
            className="rounded-full p-2 text-(--stone) hover:bg-(--blush)"
          >
            {isDarkTheme ? <Sun size={20} /> : <MoonStar size={20} />}
          </button>
          <button
            aria-label="Toggle navigation menu"
            className="rounded-lg border border-(--ash) p-2 text-(--ink)"
            onClick={() => setIsOpen((prev) => !prev)}
            type="button"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="border-t border-(--ash) bg-(--container) px-4 py-3 lg:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              className="mx-auto grid max-w-6xl grid-cols-2 gap-1 sm:grid-cols-3"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isActive(item.href)
                        ? "bg-(--blush) text-(--rose)"
                        : "text-(--ink) hover:bg-(--blush) hover:text-(--rose)"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.2 }} className="col-span-2 sm:col-span-3">
                <Link
                  href="/admin"
                  className="mt-1 block rounded-xl bg-(--rose) px-4 py-2.5 text-center text-sm font-bold text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
