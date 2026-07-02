"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, HeartHandshake, Mic2, Quote } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroSlider } from "@/components/hero-slider";
import { SiteFooter } from "@/components/site-footer";
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
  {
    icon: HeartHandshake,
    title: "Women's Fellowship",
    text: "Join our weekly community of Christian women for prayer, mentorship, spiritual growth, and real-life support. Build meaningful relationships while growing deeper in faith and purpose.",
  },
  {
    icon: Mic2,
    title: "Sunday Messages",
    text: "Access powerful Bible-centered teachings designed to strengthen your faith, provide spiritual clarity, and equip you for victorious Christian living.",
  },
  {
    icon: CalendarDays,
    title: "Events & Prayer Retreats",
    text: "Experience transformative gatherings through our weekly and monthly events, prayer meetings, fasting retreats, and community programs that inspire faith and foster connection.",
  },
];

const stats = [
  { value: "500+", label: "Women Empowered" },
  { value: "8", label: "Years of Ministry" },
  { value: "12", label: "Active Groups" },
  { value: "3K+", label: "Lives Touched" },
];

const baseApiUrl = getApiBaseUrl();

const fallbackVerse = {
  text: "She is clothed with strength and dignity, and she laughs without fear of the future.",
  reference: "Proverbs 31:25",
  period: "week",
};

const bibleVersesForGrowth = [
  { text: "But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be glory both now and forever! Amen.", reference: "2 Peter 3:18" },
  { text: "So then, just as you received Christ Jesus as Lord, continue to live your lives in him, rooted and built up in him, strengthened in the faith as you were taught, and overflowing with thankfulness.", reference: "Colossians 2:6-7" },
  { text: "Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it. Then you will be prosperous and successful.", reference: "Joshua 1:8" },
  { text: "But solid food is for the mature, who by constant use have trained themselves to distinguish good from evil.", reference: "Hebrews 5:14" },
  { text: "Instead, speaking the truth in love, we will grow to become in every respect the mature body of him who is the head, that is, Christ.", reference: "Ephesians 4:15" },
];

const bibleVersesForWomen = [
  { text: "She is clothed with strength and dignity; she can laugh at the days to come.", reference: "Proverbs 31:25" },
  { text: "Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.", reference: "Proverbs 31:30" },
  { text: "Blessed is she who has believed that the Lord would fulfill his promises to her!", reference: "Luke 1:45" },
  { text: "God is within her, she will not fall; God will help her at break of day.", reference: "Psalm 46:5" },
  { text: "And who knows but that you have come to your royal position for such a time as this?", reference: "Esther 4:14" },
];

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

        {/* ── STATS BAND ── */}
        <div className="border-b border-[#E19508]/15 bg-gradient-to-r from-[#05193B] via-[#001946] to-[#05193B]">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-x divide-[#E19508]/15 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-8 text-center">
                <p className="text-4xl font-extrabold tracking-tight text-[#E19508]">{s.value}</p>
                <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── HIGHLIGHTS ── */}
        <section id="about" className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#E19508]">Our Ministries</p>
            <h2 className="mt-3 text-4xl font-semibold text-[#001946]">
              Grow In Faith & Community
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5d6068]">
              Discover meaningful ways to deepen your spiritual walk, connect with like-minded sisters, and experience God&rsquo;s love through community.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                    index === 1
                      ? "bg-gradient-to-br from-[#980140] via-[#A2014A] to-[#001946] text-white"
                      : "border-2 border-[#E19508]/15 bg-white hover:shadow-lg"
                  }`}
                >
                  {/* Gold circle accent */}
                  {index === 1 && (
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-2 border-[#E19508]/15" />
                  )}
                  {index !== 1 && (
                    <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full border-2 border-[#E19508]/8" />
                  )}
                  <div className="relative z-10">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      index === 1 ? "bg-white/20" : "bg-[#fef6f0]"
                    }`}>
                      <Icon size={24} className={index === 1 ? "text-white" : "text-[#980140]"} />
                    </div>
                    <h3 className={`mt-5 text-xl font-bold ${
                      index === 1 ? "text-white" : "text-[#001946]"
                    }`}>{item.title}</h3>
                    <p className={`mt-2 text-sm leading-7 ${
                      index === 1 ? "text-white/85" : "text-[#5d6068]"
                    }`}>{item.text}</p>
                    {index !== 1 && (
                      <div className="mt-5 h-1 w-10 rounded-full bg-[#E19508]/30" />
                    )}
                    <p className={`mt-4 text-[0.65rem] font-bold uppercase tracking-[0.18em] ${
                      index === 1 ? "text-white/70" : "text-[#E19508]"
                    }`}>
                      0{index + 1}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── VERSE ── full-width */}
        <section className="mt-14 bg-gradient-to-r from-[#fef6f0] via-[#faf5fd] to-[#fef6f0] py-10 sm:py-12">
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
                <p className="text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Meeting Times</p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight text-white">
                  Join Us In Prayer & Study
                </h2>
                <p className="mt-5 text-sm leading-8 text-white/70">
                  Dedicate time each day to seek God&rsquo;s presence through prayer, worship, Bible study, and spiritual encouragement. Strengthen your faith and grow deeper in your walk with Christ.
                </p>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Join a group →
                </Link>
              </div>

              {/* Right: schedule cards */}
              <div className="flex flex-col justify-center gap-3 border-t border-white/10 px-8 py-12 sm:px-10 md:border-l md:border-t-0">
                {[
                  { day: "Monday – Friday", time: "12:00 PM (WAT)", label: "Prayer Meeting" },
                  { day: "Monday – Friday", time: "10:00 PM (WAT)", label: "Daily Intercession & Word" },
                  { day: "Saturday", time: "6:00 AM (WAT)", label: "Weekend Charge" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/8 px-5 py-4">
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

        {/* ── 5 BIBLE VERSES FOR SPIRITUAL GROWTH ── enhanced styling */}
        <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <BookOpen className="mx-auto text-(--rose)" size={28} />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Scripture</p>
            <h2 className="mt-3 text-4xl font-semibold text-(--ink)">
              5 Bible Verses for Spiritual Growth
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-(--stone)">
              Meditate on these powerful scriptures to deepen your faith and draw closer to God.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bibleVersesForGrowth.map((v, index) => (
              <motion.div
                key={v.reference}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  index === 2
                    ? "bg-(--rose) text-white"
                    : "border border-(--ash) bg-white"
                }`}
              >
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                  index === 2 ? "bg-white/20 text-white" : "bg-(--blush) text-(--rose)"
                }`}>
                  {index + 1}
                </div>
                <p className={`text-[0.65rem] font-bold uppercase tracking-[0.18em] ${
                  index === 2 ? "text-white/70" : "text-(--rose)"
                }`}>{v.reference}</p>
                <p className={`mt-2 text-sm leading-7 italic ${
                  index === 2 ? "text-white/90" : "text-(--stone)"
                }`}>
                  &ldquo;{v.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 5 BIBLE VERSES FOR WOMEN ── */}
        <section className="mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <HeartHandshake className="mx-auto text-(--rose)" size={28} />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.26em] text-(--rose)">Scripture</p>
            <h2 className="mt-3 text-4xl font-semibold text-(--ink)">
              5 Bible Verses for Women
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bibleVersesForWomen.map((v, index) => (
              <motion.div
                key={v.reference}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
                className={`rounded-2xl px-5 py-6 ${index === 1 ? "bg-(--rose) text-white" : "border border-(--ash) bg-white"}`}
              >
                <p className={`text-[0.65rem] font-bold uppercase tracking-[0.18em] ${index === 1 ? "text-white/70" : "text-(--rose)"}`}>{v.reference}</p>
                <p className={`mt-2 text-sm leading-7 italic ${index === 1 ? "text-white/90" : "text-(--stone)"}`}>
                  &ldquo;{v.text}&rdquo;
                </p>
              </motion.div>
            ))}
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
              Let&rsquo;s Walk This Journey Together
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
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}