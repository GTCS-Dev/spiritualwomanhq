"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { BlogPost, PostCategory, categoryLabels } from "@/types/blog";

const apiUrl = getApiBaseUrl();

const categories: Array<PostCategory | "all"> = [
  "all",
  "devotional",
  "testimony",
  "events",
  "leadership",
  "family",
  "prayer",
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<PostCategory | "all">("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const query = activeCategory === "all" ? "" : `?category=${activeCategory}`;

    fetch(`${apiUrl}/posts${query}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed loading posts"))))
      .then((data: BlogPost[]) => setPosts(data))
      .catch(() => setPosts([]));

    return () => controller.abort();
  }, [activeCategory]);

  const heroPost = useMemo(() => posts[0], [posts]);
  const gridPosts = useMemo(() => posts.slice(1), [posts]);
  const activeCategoryLabel = activeCategory === "all" ? "All Articles" : categoryLabels[activeCategory];

  return (
    <div className="min-h-screen text-(--ink)">
      <SiteHeader />

      <main className="w-full pb-20">
        {/* ── HERO SECTION ── */}
        <section className="group relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-[#E19508]/15">
          <Image
            src={heroPost?.coverImage ?? "https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=2000&q=80"}
            alt="SpiritualWoman blog"
            width={2200}
            height={960}
            className="h-[58vh] min-h-[420px] w-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001946]/85 via-[#05193B]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001946]/50 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border-2 border-[#E19508]/12" />
          <div className="pointer-events-none absolute left-[30%] top-[40%] h-24 w-24 rounded-full border-2 border-[#E19508]/10" />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
            <div className="max-w-3xl rounded-3xl border border-[#E19508]/30 bg-[#001946]/60 px-6 py-6 backdrop-blur-xl sm:px-8 sm:py-7 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E19508]/25 bg-[#E19508]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.28em] text-[#E19508]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E19508]" />
                Blog
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
                Stories, Teachings, And Encouragement
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
                Explore modern faith articles across prayer, testimony, leadership, family, and events.
              </p>
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <section className="mx-auto mt-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-3xl border border-(--ash) bg-(--container) p-6 sm:p-8 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.15)] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-(--rose)">Current View</p>
              <h2 className="mt-2 text-2xl font-semibold text-(--ink)">{activeCategoryLabel}</h2>
              <p className="mt-1 text-sm text-(--stone)">{posts.length} article{posts.length === 1 ? "" : "s"} available right now.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-(--rose) text-white shadow-[0_4px_14px_-6px_rgba(152,1,64,0.5)] scale-105"
                    : "bg-(--container) text-(--ink) hover:bg-(--blush) hover:text-(--rose) border border-[#E19508]/10"
                }`}
              >
                {category === "all" ? "All" : categoryLabels[category]}
              </button>
            ))}
              </div>
          </div>
        </section>

        {/* ── HERO POST ── */}
        {heroPost ? (
            <article className="group mx-auto mt-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-(--ash) bg-(--container) shadow-[0_20px_40px_-28px_rgba(31,24,34,0.35)] transition-all duration-500 hover:shadow-[0_28px_60px_-24px_rgba(31,24,34,0.5)] lg:grid-cols-[1.1fr_0.9fr]">
            <Image
              src={heroPost.coverImage}
              alt={heroPost.title}
              width={1200}
              height={700}
              loading="eager"
                className="h-full min-h-[360px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
              <div className="flex flex-col justify-between gap-6 p-8 sm:p-12">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#980140]/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-(--rose)">
                    <span className="h-1.5 w-1.5 rounded-full bg-(--rose)" />
                    {categoryLabels[heroPost.category]}
                  </span>
                  <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{heroPost.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-(--stone) sm:text-[0.95rem] sm:leading-8">{heroPost.excerpt}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--stone)">
                    {new Date(heroPost.createdAt).toLocaleDateString()} • {heroPost.author}
                  </p>
                  <Link
                    href={`/blog/${heroPost.slug}`}
                    className="inline-flex rounded-full bg-(--rose) px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-(--rose-dark) hover:shadow-[0_6px_20px_-8px_rgba(152,1,64,0.5)] hover:scale-105"
                  >
                    Read Article
                  </Link>
                </div>
            </div>
          </article>
        ) : null}

        {/* ── GRID POSTS ── */}
          <section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {gridPosts.map((post) => (
              <article key={post.id} className="group elevated overflow-hidden rounded-2xl border border-(--ash) bg-(--container) shadow-[0_12px_30px_-20px_rgba(0,25,70,0.12)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-20px_rgba(0,25,70,0.25)]">
                <div className="relative overflow-hidden">
                  <Image src={post.coverImage} alt={post.title} width={700} height={420} className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute left-4 top-4 rounded-full bg-(--container)/92 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-(--rose) backdrop-blur-sm border border-[#E19508]/15 shadow-sm">
                    {categoryLabels[post.category]}
                  </div>
                </div>
                <div className="px-6 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--stone)">
                    {new Date(post.createdAt).toLocaleDateString()} • {post.author}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold leading-tight text-(--ink)">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-(--stone)">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-(--rose) transition-all duration-300 hover:gap-3 group/link">
                    Continue Reading <span className="transition-transform duration-300 group-hover/link:translate-x-1" aria-hidden>→</span>
                  </Link>
              </div>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}