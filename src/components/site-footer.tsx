"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Mail, Send } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const linkCls = (href: string) =>
    `flex items-center gap-2 py-1 text-sm transition-colors ${
      isActive(href) ? "font-semibold text-(--rose)" : "text-(--stone) hover:text-(--rose)"
    }`;

  return (
    <footer className="mt-24 border-t-2 border-(--rose)/18 bg-(--container)">
      {/* Main columns */}
      <div className="mx-auto grid w-full max-w-6xl gap-14 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 xl:grid-cols-[1.35fr_0.9fr_1fr_1fr] xl:gap-20">
        {/* Brand */}
        <div className="xl:col-span-1">
          <SiteLogo />
          <p className="mt-5 text-sm leading-7 text-(--stone)">
            Building women of faith through worship, teaching, mentoring, and purpose-driven community impact across every season of life.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--ash) text-(--stone) transition-colors hover:border-(--rose) hover:text-(--rose)"
              href="mailto:hello@spiritualwoman.org"
              aria-label="Email us"
            >
              <Mail size={15} />
            </a>
            <a
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--ash) text-(--stone) transition-colors hover:border-(--rose) hover:text-(--rose)"
              href="mailto:prayer@spiritualwoman.org"
              aria-label="Prayer requests"
            >
              <Heart size={15} />
            </a>
            <a
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--ash) text-(--stone) transition-colors hover:border-(--rose) hover:text-(--rose)"
              href="/contact"
              aria-label="Contact page"
            >
              <Send size={15} />
            </a>
          </div>
        </div>

        {/* Service Hours */}
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">Service Times</p>
          <div className="grid gap-3">
            <div className="rounded-xl border border-(--ash) px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-(--stone)">Bible Study</p>
              <p className="mt-1 font-semibold text-(--ink)">Tuesday · 6:30 PM</p>
            </div>
            <div className="rounded-xl border border-(--ash) px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-(--stone)">Prayer Session</p>
              <p className="mt-1 font-semibold text-(--ink)">Saturday · 7:00 AM</p>
            </div>
            <div className="rounded-xl border border-(--ash) px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-(--stone)">Sunday Worship</p>
              <p className="mt-1 font-semibold text-(--ink)">Sunday · 9:30 AM</p>
            </div>
          </div>
        </div>

        {/* Explore */}
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">Explore</p>
          <nav className="grid gap-0.5">
            <Link href="/about" className={linkCls("/about")}>About Us</Link>
            <Link href="/connect" className={linkCls("/connect")}>Fellowship Groups</Link>
            <Link href="/blog" className={linkCls("/blog")}>Blog &amp; Articles</Link>
            <Link href="/competitions" className={linkCls("/competitions")}>Competitions</Link>
            <Link href="/watch" className={linkCls("/watch")}>Watch Online</Link>
            <Link href="/visit" className={linkCls("/visit")}>Plan a Visit</Link>
            <Link href="/contact" className={linkCls("/contact")}>Contact Us</Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">Get In Touch</p>
          <p className="text-sm text-(--stone)">We would love to hear from you and welcome you into our community.</p>
          <a
            href="mailto:hello@spiritualwoman.org"
            className="mt-4 block text-sm font-semibold text-(--ink) hover:text-(--rose)"
          >
            hello@spiritualwoman.org
          </a>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--rose) px-5 py-2.5 text-sm font-bold text-white hover:bg-(--rose-dark)"
          >
            Send a Message
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-(--ash)">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-(--stone) sm:px-6 lg:flex-row lg:items-center">
          <p>© 2026 Layo Obidike · Powered by LOPLATFORMS · All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy-policy" className="hover:text-(--rose)">Privacy Policy</Link>
            <Link href="/terms-of-use" className="hover:text-(--rose)">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
