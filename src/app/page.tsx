"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, HeartHandshake, Mic2, Quote } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroSlider } from "@/components/hero-slider";
import { SiteFooter } from "@/components/site-footer";
import { ministryGalleryImages } from "@/lib/site-images";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { BlogPost } from "@/types/blog";

type Verse = {
  _id: string;
  text: string;
  reference: string;
  period: string;
};

type DisplayVerse = {
  text: string;
  reference: string;
  period: string;
};

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
};

const highlights = [
  { icon: HeartHandshake, title: "Women Fellowship", text: "Weekly circle for prayer, mentoring, and real life support." },
  { icon: Mic2, title: "Sunday Messages", text: "Strong Bible-centered teachings for growth and clarity." },
  { icon: CalendarDays, title: "Events & Retreats", text: "Monthly gatherings, worship nights, and outreach projects." },
];

const stats = [
  { value: "500+", label: "Women Empowered" },
  { value: "8", label: "Years of Ministry" },
  { value: "12", label: "Active Groups" },
  { value: "3K+", label: "Lives Touched" },
];

const baseApiUrl = getApiBaseUrl();

const quickLinks = [
  { href: "/watch", title: "Watch", text: "Live worship services and on-demand encouragement messages." },
  { href: "/visit", title: "Visit", text: "Plan your first visit and see service times before you arrive." },
  { href: "/connect", title: "Connect", text: "Join groups, serve in ministry, and stay spiritually supported." },
  { href: "/about", title: "About", text: "Learn our mission, beliefs, and community vision." },
];

const fallbackVerse = {
  text: "She is clothed with strength and dignity, and she laughs without fear of the future.",
  reference: "Proverbs 31:25",
  period: "week",
};

function buildApiCandidates(path: string) {
  const trimmedBase = baseApiUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const candidates = [`${trimmedBase}${normalizedPath}`];

  if (trimmedBase.endsWith("/api")) {
    candidates.push(`${trimmedBase.slice(0, -4)}${normalizedPath}`);
  } else {
    candidates.push(`${trimmedBase}/api${normalizedPath}`);
  }

  return Array.from(new Set(candidates));
}

async function fetchJsonWithFallback<T>(path: string, signal: AbortSignal): Promise<T> {
  const urls = buildApiCandidates(path);

  for (let i = 0; i < urls.length; i += 1) {
    try {
      const response = await fetch(urls[i], { signal });
      if (response.ok) return (await response.json()) as T;
      if (response.status !== 404 || i === urls.length - 1) throw new Error(`Request failed: ${response.status}`);
    } catch (error) {
      if (i === urls.length - 1) throw error;
    }
  }

  throw new Error("Request failed");
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [verses, setVerses] = useState<DisplayVerse[]>([fallbackVerse]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const ctrl = new AbortController();

    fetchJsonWithFallback<BlogPost[]>(`/posts?limit=3`, ctrl.signal)
      .then((d: BlogPost[]) => setPosts(d))
      .catch(() => setPosts([]));

    fetchJsonWithFallback<Verse[]>(`/verses/active/list?limit=20`, ctrl.signal)
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setVerses(list.map((v) => ({ text: v.text, reference: v.reference, period: v.period })));
          return;
        }
        return fetchJsonWithFallback<Verse | null>(`/verses/active`, ctrl.signal).then((single) => {
          if (single) setVerses([{ text: single.text, reference: single.reference, period: single.period }]);
        });
      })
      .catch(() => {
        setVerses([fallbackVerse]);
      });

    fetchJsonWithFallback<Testimonial[]>(`/testimonials`, ctrl.signal)
      .then((d: Testimonial[]) => setTestimonials(d))
      .catch(() => setTestimonials([]));

    return () => ctrl.abort();
  }, []);

  return (
    <div className="min-h-screen text-(--ink)" id="home">
      <SiteHeader />

      <main className="w-full overflow-x-hidden pb-20">
        <HeroSlider />

        {/* ── STATS BAND ── full-width stripe, no cards */}
        <div className="border-b border-(--ash) bg-(--surface)">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-x divide-(--ash) md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center">
                <p className="text-4xl font-extrabold tracking-tight text-(--rose)">{s.value}</p>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-(--stone)">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── INTRO + QUICK LINKS ── editorial split */}
        <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Welcome</p>
              <h2 className="mt-3 text-5xl font-semibold leading-[1.12] text-(--ink)">
                A Place Built<br />For Women<br />Of Faith.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-(--stone)">
                SpiritualWoman Fellowship is a safe, empowering community where women grow in faith, connect with purpose, and serve with strength.
              </p>
              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-(--rose) hover:text-(--rose-dark)"
              >
                Learn our story →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex flex-col justify-between rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                    index === 1
                      ? "bg-(--rose) text-white"
                      : index === 3
                        ? "border border-(--ash) bg-(--ink) text-white"
                        : "border border-(--ash) bg-white"
                  }`}
                >
                  <p className={`text-sm font-bold uppercase tracking-[0.2em] ${index === 1 || index === 3 ? "text-white/70" : "text-(--rose)"}`}>
                    {item.title}
                  </p>
                  <p className={`mt-3 text-sm leading-6 ${index === 1 || index === 3 ? "text-white/85" : "text-(--stone)"}`}>
                    {item.text}
                  </p>
                  <span className={`mt-4 text-xs font-bold uppercase tracking-[0.18em] ${index === 1 || index === 3 ? "text-white/90" : "text-(--rose)"}`}>
                    Go →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── HIGHLIGHTS ── horizontal list, no duplicate cards */}
        <section id="about" className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="divide-y divide-(--ash) rounded-3xl border border-(--ash) bg-white">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-6 px-6 py-7 sm:items-center sm:px-8"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--blush) text-(--rose)">
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-(--ink)">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-(--stone)">{item.text}</p>
                  </div>
                  <span className="hidden shrink-0 text-2xl font-light text-(--ash) sm:block">
                    0{index + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── VERSE ── full-width editorial pull-quote, no card box */}
        <section className="mt-14 bg-(--blush) py-10 sm:py-12">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <BookOpen className="mx-auto text-(--rose)" size={32} />
            {verses.length > 1 ? (
              <div className="mt-6 overflow-hidden">
                <div className="verse-marquee-track">
                  {[...verses, ...verses].map((v, index) => (
                    <div key={`${v.reference}-${index}`} className="verse-marquee-item px-4">
                      <p className="text-xl font-medium italic leading-8 text-(--ink) sm:text-[1.65rem] sm:leading-10">
                        &ldquo;{v.text}&rdquo;
                      </p>
                      <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-(--rose)">
                        {v.reference} — Verse of the {v.period === "day" ? "Day" : "Week"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p className="mt-6 text-xl font-medium italic leading-8 text-(--ink) sm:text-[1.65rem] sm:leading-10">
                  &ldquo;{verses[0]?.text ?? fallbackVerse.text}&rdquo;
                </p>
                <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-(--rose)">
                  {verses[0]?.reference ?? fallbackVerse.reference} — Verse of the{" "}
                  {(verses[0]?.period ?? fallbackVerse.period) === "day" ? "Day" : "Week"}
                </p>
              </>
            )}
          </div>
        </section>

        {/* ── FELLOWSHIP SCHEDULE ── two-column, left text right timeline */}
        <section id="fellowship" className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-(--ink)">
            <div className="grid gap-0 md:grid-cols-2">
              {/* Left: text */}
              <div className="px-8 py-12 sm:px-12">
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Fellowship Rhythm</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">
                  Build a Consistent Faith Routine
                </h2>
                <p className="mt-5 text-sm leading-8 text-white/70">
                  Join a weekly rhythm of worship, study, and prayer that keeps your spiritual growth grounded and intentional.
                </p>
                <Link
                  href="/connect"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Join a group →
                </Link>
              </div>

              {/* Right: schedule cards */}
              <div className="flex flex-col justify-center gap-3 border-t border-white/10 px-8 py-12 sm:px-10 md:border-l md:border-t-0">
                {[
                  { day: "Tuesday", time: "6:30 PM", label: "Online Bible Study" },
                  { day: "Saturday", time: "7:00 AM", label: "Prayer & Accountability" },
                  { day: "Sunday", time: "9:30 AM", label: "Live Worship Service" },
                ].map((item) => (
                  <div key={item.day} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/8 px-5 py-4">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-(--rose)" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="mt-0.5 text-xs text-white/55">{item.day} · {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── if present */}
        {testimonials.length > 0 && (
          <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Testimonies</p>
                <h2 className="mt-3 text-4xl font-semibold text-(--ink)">Words From Our Sisterhood</h2>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.article
                  key={t._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className={`rounded-2xl px-6 py-7 ${i === 1 ? "bg-(--rose) text-white" : "border border-(--ash) bg-white"}`}
                >
                  <Quote size={24} className={i === 1 ? "text-white/60" : "text-(--rose) opacity-60"} />
                  <p className={`mt-3 text-sm italic leading-7 ${i === 1 ? "text-white/90" : "text-(--stone)"}`}>{t.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i === 1 ? "bg-white/20 text-white" : "bg-(--blush) text-(--rose)"}`}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${i === 1 ? "text-white" : "text-(--ink)"}`}>{t.name}</p>
                      <p className={`text-xs ${i === 1 ? "text-white/70" : "text-(--stone)"}`}>{t.role}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* ── GALLERY ── full bleed, no text below images */}
        <section className="mt-20" aria-label="Ministry gallery">
          <div className="mx-auto mb-8 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Ministry Life</p>
            <h2 className="mt-3 text-4xl font-semibold text-(--ink)">Moments From Our Community</h2>
          </div>
          <div className="mx-auto grid w-full max-w-6xl gap-3 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            {ministryGalleryImages.map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className={`group overflow-hidden rounded-2xl ${index === 1 ? "lg:row-span-1 lg:mt-6" : ""}`}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={image}
                    alt="SpiritualWoman community moment"
                    width={650}
                    height={400}
                    className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${index === 1 ? "h-64" : "h-56"}`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-5 text-sm font-bold text-white">Faith Story {index + 1}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BLOG ── list layout, not card grid */}
        <section id="blog" className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Latest Articles</p>
              <h2 className="mt-3 text-4xl font-semibold text-(--ink)">Encouragement For Your Journey</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-(--rose) hover:text-(--rose-dark)">
              View All Posts →
            </Link>
          </div>
          {posts.length > 0 ? (
            <div className="divide-y divide-(--ash) rounded-3xl border border-(--ash) bg-white">
              {posts.map((post, i) => (
                <article
                  key={post.id}
                  className="flex flex-col gap-4 px-6 py-6 transition-colors hover:bg-(--blush)/40 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
                >
                  <span className="shrink-0 text-3xl font-extrabold text-(--ash)">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--rose)">
                      {new Date(post.createdAt).toLocaleDateString()} · {post.author}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-(--ink)">{post.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-(--stone)">{post.excerpt}</p>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="shrink-0 rounded-full border border-(--rose)/40 px-5 py-2 text-sm font-bold text-(--rose) hover:bg-(--blush)"
                  >
                    Read →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-(--stone)/30 px-6 py-10 text-center">
              <p className="font-semibold text-(--ink)">No posts yet.</p>
              <p className="mt-1 text-sm text-(--stone)">Check back soon for encouragement articles.</p>
            </div>
          )}
        </section>

        {/* ── CTA ── clean centred band */}
        <section id="contact" className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center rounded-3xl border border-(--rose)/25 bg-(--blush) px-8 py-10 text-center sm:px-14 sm:py-12">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Join Us</p>
            <h2 className="mt-4 max-w-xl text-4xl font-semibold text-(--ink)">
              Let&apos;s Walk This Journey Together
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-(--stone)">
              Join a growing community of women committed to faith, purpose, and transformation through Christ.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-(--rose) px-8 py-3 font-bold text-white hover:bg-(--rose-dark)"
              >
                Contact Fellowship Team
              </Link>
              <a
                href="mailto:hello@spiritualwoman.org"
                className="rounded-full border border-(--rose)/40 px-8 py-3 font-bold text-(--rose) hover:bg-white"
              >
                Email Directly
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}