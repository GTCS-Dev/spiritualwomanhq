"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, HeartHandshake, Mic2, Quote } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroSlider } from "@/components/hero-slider";
import { SiteFooter } from "@/components/site-footer";
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

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <HeroSlider />

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`home-accent-card elevated group rounded-2xl border border-(--ash) bg-white px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-(--rose)/40 ${
                index % 2 === 1 ? "ink-rose-card" : ""
              }`}
            >
              <p className={`text-sm font-bold uppercase tracking-[0.2em] ${index % 2 === 1 ? "ink-rose-title" : "text-(--rose)"}`}>{item.title}</p>
              <p className={`mt-3 text-sm leading-7 ${index % 2 === 1 ? "text-white/85" : "text-(--stone)"}`}>{item.text}</p>
              <p className={`mt-4 text-xs font-bold uppercase tracking-[0.18em] opacity-0 transition-opacity group-hover:opacity-100 ${index % 2 === 1 ? "ink-rose-link" : "text-(--rose)"}`}>
                Explore now →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-5 py-6 text-center"
            >
              <p className="text-3xl font-extrabold text-(--rose)">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-(--stone)">{s.label}</p>
            </motion.div>
          ))}
        </section>

        <section id="about" className="mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card elevated rounded-2xl px-6 py-7"
                initial={{ opacity: 0, y: 14 }}
                transition={{ delay: index * 0.12, duration: 0.45 }}
              >
                <div className="mb-4 inline-flex rounded-full bg-(--blush) p-3 text-(--rose)">
                  <Icon size={22} />
                </div>
                <h3 className="text-2xl font-bold text-(--ink)">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-(--stone)">{item.text}</p>
              </motion.article>
            );
          })}
        </section>

        <section className="mt-14 flex items-start gap-5 rounded-3xl border border-(--rose)/20 bg-(--blush) px-8 py-10 sm:items-center sm:px-12">
          <BookOpen className="mt-1 shrink-0 text-(--rose) sm:mt-0" size={36} />
          {verses.length > 1 ? (
            <div className="verse-marquee w-full overflow-hidden">
              <div className="verse-marquee-track">
                {[...verses, ...verses].map((v, index) => (
                  <div key={`${v.reference}-${index}`} className="verse-marquee-item rounded-2xl border border-(--rose)/25 bg-white/55 px-6 py-4">
                    <p className="text-base font-bold italic leading-7 text-(--ink)">&ldquo;{v.text}&rdquo;</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-(--rose)">
                      {v.reference} &#8212; Verse of the {v.period === "day" ? "Day" : "Week"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold italic leading-8 text-(--ink) sm:text-xl">
                &ldquo;{verses[0]?.text ?? fallbackVerse.text}&rdquo;
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-(--rose)">
                {(verses[0]?.reference ?? fallbackVerse.reference)}&nbsp;&nbsp;&#8212;&nbsp;&nbsp;Verse of the {(verses[0]?.period ?? fallbackVerse.period) === "day" ? "Day" : "Week"}
              </p>
            </div>
          )}
        </section>

        <section id="fellowship" className="mt-14 overflow-hidden rounded-3xl bg-[#1f2126] px-6 py-12 text-white sm:px-10">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.23em] text-(--rose)">Fellowship Rhythm</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Build A Consistent Faith Routine</h2>
              <p className="mt-4 text-sm leading-8 text-white/80 sm:text-base">
                Connect every week through Bible study, worship devotion, and guided prayer sessions that keep your
                spiritual growth intentional and sustainable.
              </p>
            </div>
            <div className="grid gap-4 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/7 px-5 py-4">
                <p className="font-bold text-(--rose)">Tuesday | 6:30 PM</p>
                <p className="mt-1 text-(--ink) opacity-85">Online Bible study and reflection.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/7 px-5 py-4">
                <p className="font-bold text-(--rose)">Saturday | 7:00 AM</p>
                <p className="mt-1 text-(--ink) opacity-85">Prayer and accountability session.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/7 px-5 py-4">
                <p className="font-bold text-(--rose)">Sunday | 9:30 AM</p>
                <p className="mt-1 text-(--ink) opacity-85">Live worship service and message.</p>
              </div>
            </div>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section className="mt-14">
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-(--rose)">Testimonies</p>
              <h2 className="mt-2 text-3xl font-bold text-(--ink)">Words From Our Sisterhood</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.article
                  key={t._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-6 py-7"
                >
                  <Quote size={28} className="text-(--rose) opacity-70" />
                  <p className="mt-3 text-sm italic leading-7 text-(--stone)">{t.quote}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--blush) text-sm font-bold text-(--rose)">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-(--ink)">{t.name}</p>
                      <p className="text-xs text-(--stone)">{t.role}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14" aria-label="Ministry gallery">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-(--rose)">Ministry Life</p>
              <h2 className="mt-2 text-3xl font-bold text-(--ink)">Moments From Our Community</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {["/images/hero-slide-1.jpg", "/images/hero-slide-2.jpg", "/images/hero-slide-3.jpg"].map((image, index) => (
              <motion.article
                key={image}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.12, duration: 0.4 }}
                className="home-accent-card group elevated overflow-hidden rounded-2xl border border-white/70 bg-white"
              >
                <div className="overflow-hidden">
                  <Image
                    src={image}
                    alt="SpiritualWoman community moment"
                    width={650}
                    height={400}
                    className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm font-semibold text-(--rose)">Faith Story {index + 1}</p>
                  <p className="mt-2 text-sm leading-7 text-(--stone)">
                    Real testimonies of women growing in prayer, purpose, leadership, and compassion.
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="blog" className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-(--rose)">Latest Articles</p>
              <h2 className="mt-2 text-3xl font-bold text-(--ink)">Encouragement For Your Journey</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-(--rose) hover:text-(--rose-dark)">
              View All Posts →
            </Link>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="home-accent-card elevated rounded-2xl border border-(--ash) bg-white px-5 py-6 transition duration-300 hover:-translate-y-1 hover:border-(--rose)/40"
                >
                  <h3 className="mt-3 text-2xl font-bold leading-tight text-(--ink)">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-(--stone)">{post.excerpt}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-(--stone)">
                    by {post.author}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm font-bold text-(--rose)">
                    Read More →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-(--stone)/40 bg-white/70 px-6 py-8 text-center">
              <p className="font-semibold text-(--ink)">No posts yet.</p>
              <p className="mt-1 text-sm text-(--stone)">Check back soon for encouragement articles.</p>
            </div>
          )}
        </section>

        <section id="contact" className="mt-14 rounded-3xl bg-[#1f2126] px-6 py-12 text-center text-white sm:px-10">
          <h2 className="text-3xl font-bold">Let&apos;s Walk This Journey Together</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/75 sm:text-base">
            Join a growing community of women committed to faith, purpose, and transformation through Christ.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-(--rose) px-7 py-3 font-bold text-white transition-colors hover:bg-(--rose-dark)"
            >
              Contact Fellowship Team
            </Link>
            <a
              href="mailto:hello@spiritualwoman.org"
              className="inline-block rounded-full border border-white/20 px-7 py-3 font-bold text-white/90 transition-colors hover:border-white/50"
            >
              Email Directly
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}