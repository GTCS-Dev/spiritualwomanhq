"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const linkCls = (href: string) =>
    `flex items-center gap-2 py-1 text-sm transition-colors ${
      isActive(href) ? "font-semibold text-[#E19508]" : "text-white/60 hover:text-[#E19508]"
    }`;

  return (
    <footer className="relative mt-24 border-t-2 border-[#E19508]/25 bg-gradient-to-br from-[#001946] via-[#05193B] to-[#001946] overflow-hidden">
      {/* Gold decorative circles */}
      <div className="pointer-events-none absolute left-[10%] top-10 h-64 w-64 rounded-full border-2 border-[#E19508]/8" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#980140]/10 blur-[100px]" />
      
      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-14 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 xl:grid-cols-[1.35fr_0.9fr_1fr_1fr] xl:gap-20">
        {/* Brand */}
        <div className="xl:col-span-1">
          <SiteLogo lightMode />
          <p className="mt-5 text-sm leading-7 text-white/60">
            Building women of faith through worship, teaching, mentoring, and purpose-driven community impact across every season of life.
          </p>
        </div>

        {/* Service Hours */}
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#E19508]">Service Times</p>
          <div className="grid gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Bible Study</p>
              <p className="mt-1 font-semibold text-white">Tuesday · 6:30 PM</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Prayer Session</p>
              <p className="mt-1 font-semibold text-white">Saturday · 7:00 AM</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Sunday Worship</p>
              <p className="mt-1 font-semibold text-white">Sunday · 9:30 AM</p>
            </div>
          </div>
        </div>

        {/* Explore */}
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#E19508]">Explore</p>
          <nav className="grid gap-0.5">
            <Link href="/about" className={linkCls("/about")}>About Us</Link>
            <Link href="/blog" className={linkCls("/blog")}>Blog & Articles</Link>
            <Link href="/competitions" className={linkCls("/competitions")}>Competitions</Link>
            <Link href="/contact" className={linkCls("/contact")}>Contact Us</Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#E19508]">Get In Touch</p>
          <p className="text-sm text-white/60">We would love to hear from you and welcome you into our community.</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#980140] to-[#E19508] px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            Send a Message
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-white/50 sm:px-6 lg:flex-row lg:items-center">
          <p>© {new Date().getFullYear()} Spiritual Woman Fellowship · Powered by <a href="https://loplatforms.com/" target="_blank" rel="noopener noreferrer" className="text-[#E19508] hover:text-white">LOPLATFORMS</a> · All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy-policy" className="text-white/50 hover:text-[#E19508]">Privacy Policy</Link>
            <Link href="/terms-of-use" className="text-white/50 hover:text-[#E19508]">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}