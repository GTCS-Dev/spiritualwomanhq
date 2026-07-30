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
    <div className="min-h-screen bg-[#001946] text-white antialiased selection:bg-[#980140]/40 selection:text-white relative">
      {/* ── ATMOSPHERIC BRAND GLOWS ── */}
      <div className="absolute top-[15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#980140]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[45%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E19508]/5 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#980140]/8 blur-[100px] pointer-events-none z-0" />

      <div className="bg-[#001233]/90 backdrop-blur-md border-b border-white/10 relative z-50">
        <SiteHeader />
      </div>

      <main className="w-full overflow-x-hidden relative z-10">
        {/* ── HERO SECTION ── */}
        <section className="group relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-white/[0.06]">
          <Image
            src="/new/blogspirit.jpg"
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
          <div className="flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-[#001233]/80 backdrop-blur-md p-6 sm:p-8 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.3)] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#E19508]">Current View</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{activeCategoryLabel}</h2>
              <p className="mt-1 text-sm text-white/60">{posts.length} article{posts.length === 1 ? "" : "s"} available right now.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-[#980140] to-[#A2014A] text-white shadow-[0_4px_14px_-6px_rgba(152,1,64,0.5)] scale-105"
                    : "bg-[#001233]/60 text-white/80 hover:bg-[#980140]/15 hover:text-[#E19508] border border-white/[0.08]"
                }`}
              >
                {category === "all" ? "All" : categoryLabels[category]}
              </button>
            ))}
              </div>
          </div>
        </section>

        {/* ── FEATURED / LATEST POST ── */}
        {heroPost ? (
          <section className="mx-auto mt-12 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-[#E19508]/40 to-transparent" />
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E19508]/20 bg-[#E19508]/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#E19508]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E19508] animate-pulse" />
                Featured Article
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#E19508]/40 to-transparent" />
            </div>

            <article className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#001233]/80 backdrop-blur-sm shadow-[0_24px_50px_-28px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-[0_32px_70px_-28px_rgba(152,1,64,0.25)] lg:grid lg:grid-cols-[1.15fr_0.85fr]">
              {/* Featured Image - fixed professional 16:9 aspect ratio */}
              <div className="relative overflow-hidden">
                <div className="aspect-[16/9] max-h-[400px]">
                  <Image
                    src={heroPost.coverImage}
                    alt={heroPost.title}
                    width={1200}
                    height={675}
                    loading="eager"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/70 via-transparent to-transparent lg:hidden" />
                {/* Category badge overlay on image */}
                <div className="absolute left-5 top-5 rounded-full bg-[#001946]/90 px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#E19508] backdrop-blur-md border border-[#E19508]/20 shadow-lg">
                  {categoryLabels[heroPost.category]}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-12">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {heroPost.author}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(heroPost.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {heroPost.readingTime && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {heroPost.readingTime} min read
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.2rem]">
                  {heroPost.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm leading-7 text-white/70 sm:text-[0.95rem] sm:leading-8 line-clamp-3">
                  {heroPost.excerpt}
                </p>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    href={`/blog/${heroPost.slug}`}
                    className="group/btn inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#980140] to-[#A2014A] px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:shadow-[0_8px_25px_-8px_rgba(152,1,64,0.5)] hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Read Full Article
                    <svg className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          </section>
        ) : null}

        {/* ── GRID POSTS ── */}
        <section className="mx-auto mt-16 w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          {/* Section header */}
          {gridPosts.length > 0 && (
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/40">
                {heroPost ? "More Articles" : "All Articles"}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post, index) => (
              <article
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#001233]/80 backdrop-blur-sm shadow-[0_12px_30px_-20px_rgba(0,0,0,0.3)] transition-all duration-400 hover:-translate-y-2 hover:border-[#E19508]/25 hover:shadow-[0_24px_50px_-20px_rgba(152,1,64,0.2)]"
              >
                {/* Image container - fixed 16:9 aspect ratio */}
                <div className="relative overflow-hidden">
                  <div className="aspect-video">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={700}
                      height={394}
                      loading={index < 3 ? "eager" : "lazy"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Category badge */}
                  <div className="absolute left-4 top-4 rounded-full bg-[#001946]/90 px-3.5 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#E19508] backdrop-blur-sm border border-[#E19508]/20 shadow-sm">
                    {categoryLabels[post.category]}
                  </div>
                  {/* Gradient overlay at bottom of image for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#001233]/60 to-transparent" />
                </div>

                {/* Card content */}
                <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                  {/* Meta: date + reading time */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {post.readingTime && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span>{post.readingTime} min read</span>
                      </>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-[#E19508]">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-2.5 flex-1 text-sm leading-7 text-white/60 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Author + CTA */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-xs font-semibold text-white/40">
                      {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E19508] transition-all duration-300 hover:gap-2.5 group/link"
                    >
                      Read More
                      <span className="transition-transform duration-300 group-hover/link:translate-x-1" aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty state */}
          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#980140]/10 border border-[#980140]/20">
                <svg className="h-10 w-10 text-[#E19508]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white/80">No articles found</h3>
              <p className="mt-2 max-w-sm text-sm text-white/50">
                {activeCategory === "all"
                  ? "There are no published articles yet. Check back soon for new content."
                  : `No articles in the "${activeCategoryLabel}" category yet.`}
              </p>
            </div>
          )}
        </section>
      </main>

      <div className="bg-[#001233] border-t border-white/10 relative z-20">
        <SiteFooter />
      </div>
    </div>
  );
}