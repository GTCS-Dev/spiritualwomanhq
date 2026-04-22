"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays, HeartHandshake, Mic2 } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroSlider } from "@/components/hero-slider";
import { SiteFooter } from "@/components/site-footer";
import { BlogPost } from "@/types/blog";

const highlights = [
  { icon: HeartHandshake, title: "Women Fellowship", text: "Weekly circle for prayer, mentoring, and real life support." },
  { icon: Mic2, title: "Sunday Messages", text: "Strong Bible-centered teachings for growth and clarity." },
  { icon: CalendarDays, title: "Events & Retreats", text: "Monthly gatherings, worship nights, and outreach projects." },
];

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const quickLinks = [
  { href: "/watch", title: "Watch", text: "Live worship services and on-demand encouragement messages." },
  { href: "/visit", title: "Visit", text: "Plan your first visit and see service times before you arrive." },
  { href: "/connect", title: "Connect", text: "Join groups, serve in ministry, and stay spiritually supported." },
  { href: "/about", title: "About", text: "Learn our mission, beliefs, and community vision." },
];

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${baseApiUrl}/posts?limit=3`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Could not load posts"))))
      .then((data: BlogPost[]) => setPosts(data))
      .catch(() => {
        setPosts([]);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen text-(--ink)" id="home">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <HeroSlider />

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="elevated rounded-2xl border border-(--ash) bg-white px-5 py-5 transition-transform hover:-translate-y-1"
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-(--rose)">{item.title}</p>
              <p className="mt-3 text-sm leading-7 text-(--stone)">{item.text}</p>
            </Link>
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
              <div className="rounded-xl bg-white/7 px-5 py-4">
                <p className="font-bold text-(--rose)">Tuesday | 6:30 PM</p>
                <p className="mt-1 text-white/85">Online Bible study and reflection.</p>
              </div>
              <div className="rounded-xl bg-white/7 px-5 py-4">
                <p className="font-bold text-(--rose)">Saturday | 7:00 AM</p>
                <p className="mt-1 text-white/85">Prayer and accountability session.</p>
              </div>
              <div className="rounded-xl bg-white/7 px-5 py-4">
                <p className="font-bold text-(--rose)">Sunday | 9:30 AM</p>
                <p className="mt-1 text-white/85">Live worship service and message.</p>
              </div>
            </div>
          </div>
        </section>

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
                className="group elevated overflow-hidden rounded-2xl border border-white/70 bg-white"
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
            <div className="flex items-center gap-4">
              <Link href="/blog" className="text-sm font-semibold text-(--rose) hover:text-(--rose-dark)">
                View All Posts →
              </Link>
              <a href="/admin" className="text-sm font-semibold text-(--stone) hover:text-(--ink)">
                Manage Blog
              </a>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="elevated rounded-2xl border border-(--ash) bg-white px-5 py-6">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold leading-tight text-(--ink)">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-(--stone)">{post.excerpt}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-(--stone)">
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
              <p className="mt-1 text-sm text-(--stone)">
                Use the admin dashboard to publish your first article.
              </p>
            </div>
          )}
        </section>

        <section id="contact" className="mt-14 rounded-3xl bg-(--blush) px-6 py-12 text-center sm:px-10">
          <h2 className="text-3xl font-bold text-(--ink)">Let&apos;s Walk This Journey Together</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-(--stone) sm:text-base">
            Join a growing community of women committed to faith, purpose, and transformation through Christ.
          </p>
          <a
            href="mailto:hello@spiritualwoman.org"
            className="mt-8 inline-block rounded-full bg-(--rose) px-7 py-3 font-bold text-white transition-colors hover:bg-(--rose-dark)"
          >
            Contact Fellowship Team
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
