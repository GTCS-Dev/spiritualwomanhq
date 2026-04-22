"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Mail, Send } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <footer className="mt-16 border-t border-(--ash) bg-(--container)/90">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4">
        <div>
          <SiteLogo />
          <p className="mt-4 text-sm leading-7 text-(--stone)">
            Building women of faith through worship, teaching, mentoring, and purpose-driven community impact.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-(--ink)">Quick Links</h3>
          <div className="mt-4 grid gap-2 text-sm text-(--stone)">
            <Link href="/about" className={isActive("/about") ? "font-semibold text-(--rose)" : "hover:text-(--rose)"}>About</Link>
            <Link href="/connect" className={isActive("/connect") ? "font-semibold text-(--rose)" : "hover:text-(--rose)"}>Fellowship</Link>
            <Link href="/blog" className={isActive("/blog") ? "font-semibold text-(--rose)" : "hover:text-(--rose)"}>Blog</Link>
            <Link href="/contact" className={isActive("/contact") ? "font-semibold text-(--rose)" : "hover:text-(--rose)"}>Contact</Link>
            <Link href="/privacy-policy" className={isActive("/privacy-policy") ? "font-semibold text-(--rose)" : "hover:text-(--rose)"}>Privacy Policy</Link>
            <Link href="/terms-of-use" className={isActive("/terms-of-use") ? "font-semibold text-(--rose)" : "hover:text-(--rose)"}>Terms of Use</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-(--ink)">Service Hours</h3>
          <div className="mt-4 grid gap-2 text-sm text-(--stone)">
            <p>Tue: 6:30 PM Bible Study</p>
            <p>Sat: 7:00 AM Prayer</p>
            <p>Sun: 9:30 AM Worship</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.18em] text-(--ink)">Connect</h3>
          <p className="mt-4 text-sm text-(--stone)">hello@spiritualwoman.org</p>
          <div className="mt-4 flex items-center gap-2">
            <a className="rounded-full border border-(--ash) p-2 text-(--stone) hover:text-(--rose)" href="mailto:hello@spiritualwoman.org" aria-label="Email us">
              <Mail size={16} />
            </a>
            <a className="rounded-full border border-(--ash) p-2 text-(--stone) hover:text-(--rose)" href="mailto:prayer@spiritualwoman.org" aria-label="Prayer requests">
              <Heart size={16} />
            </a>
            <a className="rounded-full border border-(--ash) p-2 text-(--stone) hover:text-(--rose)" href="/contact" aria-label="Contact us">
              <Send size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-(--ash)">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-(--stone) sm:px-6">
          <p>Copyright © Layo Obidike 2026. Powered by LOPLATFORMS. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-(--rose)">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-(--rose)">
              Terms of Use
            </Link>
            <p>Designed for worship, fellowship, and impact.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
