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
  { href: "/blog", label: "Blog" },
  { href: "/watch", label: "Watch" },
  { href: "/contact", label: "Contact" },
  { href: "/visit", label: "Visit" },
  { href: "/connect", label: "Connect" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("sw_theme");
    // Default is always light; only switch dark if user explicitly chose it
    const shouldUseDark = storedTheme === "dark";

    document.documentElement.classList.toggle("theme-dark", shouldUseDark);
    document.documentElement.setAttribute("data-theme", shouldUseDark ? "dark" : "light");
    setIsDarkTheme(shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextThemeIsDark = !isDarkTheme;
    setIsDarkTheme(nextThemeIsDark);
    document.documentElement.classList.toggle("theme-dark", nextThemeIsDark);
    document.documentElement.setAttribute("data-theme", nextThemeIsDark ? "dark" : "light");
    localStorage.setItem("sw_theme", nextThemeIsDark ? "dark" : "light");
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-(--ash) bg-(--container)/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <SiteLogo />

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold tracking-wide transition-colors ${
                isActive(item.href)
                  ? "text-(--rose) border-b-2 border-(--rose)"
                  : "text-(--ink) hover:text-(--rose)"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="rounded-full bg-(--rose) px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-(--rose-dark)"
          >
            Admin
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-full border border-(--ash) bg-(--blush) px-4 py-2 text-sm font-semibold text-(--ink) transition-colors hover:border-(--rose)"
            aria-label="Toggle dark theme"
          >
            {isDarkTheme ? <Sun size={16} /> : <MoonStar size={16} />}
            {isDarkTheme ? "Light" : "Dark"}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark theme"
            className="rounded-lg border border-(--ash) p-2 text-(--ink)"
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
            className="border-t border-(--ash) bg-(--container) px-4 py-3 md:hidden"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              className="mx-auto flex max-w-6xl flex-col gap-2"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 font-semibold text-(--ink) hover:bg-(--blush) hover:text-(--rose)"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0, y: -8 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.2 }}>
                <Link
                  href="/admin"
                  className="mt-1 block rounded-md bg-(--rose) px-3 py-2 text-center font-semibold text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
