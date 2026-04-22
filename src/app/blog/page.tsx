"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BlogPost, PostCategory, categoryLabels } from "@/types/blog";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

  return (
    <div className="min-h-screen text-(--ink)">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <section className="section-gradient elevated mt-8 rounded-3xl border border-white/70 px-6 py-12 sm:px-10">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-(--rose)">Blog</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">Stories, Teachings, And Encouragement</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-(--stone)">
            Explore modern faith articles across categories including prayer, testimony, leadership, family, and events.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activeCategory === category ? "bg-(--rose) text-white" : "bg-white text-(--ink) hover:text-(--rose)"
                }`}
              >
                {category === "all" ? "All" : categoryLabels[category]}
              </button>
            ))}
          </div>
        </section>

        {heroPost ? (
          <article className="elevated mt-10 grid overflow-hidden rounded-3xl border border-(--ash) bg-white lg:grid-cols-2">
            <Image
              src={heroPost.coverImage}
              alt={heroPost.title}
              width={1200}
              height={700}
              loading="eager"
              className="h-full w-full object-cover"
            />
            <div className="p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">{categoryLabels[heroPost.category]}</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight">{heroPost.title}</h2>
              <p className="mt-4 text-sm leading-7 text-(--stone)">{heroPost.excerpt}</p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-(--stone)">
                {new Date(heroPost.createdAt).toLocaleDateString()} • {heroPost.author}
              </p>
              <Link
                href={`/blog/${heroPost.slug}`}
                className="mt-7 inline-block rounded-full bg-(--rose) px-6 py-3 text-sm font-bold text-white hover:bg-(--rose-dark)"
              >
                Read Article
              </Link>
            </div>
          </article>
        ) : null}

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => (
            <article key={post.id} className="elevated overflow-hidden rounded-2xl border border-(--ash) bg-white">
              <Image src={post.coverImage} alt={post.title} width={700} height={420} className="h-48 w-full object-cover" />
              <div className="px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-(--rose)">{categoryLabels[post.category]}</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight">{post.title}</h3>
                <p className="mt-3 text-sm leading-7 text-(--stone)">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="mt-5 inline-block text-sm font-bold text-(--rose)">
                  Continue Reading →
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
