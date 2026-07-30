import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { BlogPost, categoryLabels } from "@/types/blog";

const apiUrl = getApiBaseUrl();

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const response = await fetch(`${apiUrl}/posts/slug/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const post = (await response.json()) as BlogPost;

  return (
    <div className="min-h-screen bg-[#001946] text-white antialiased selection:bg-[#980140]/40 selection:text-white relative">
      {/* ── ATMOSPHERIC BRAND GLOWS ── */}
      <div className="absolute top-[15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#980140]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[45%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#E19508]/5 blur-[150px] pointer-events-none z-0" />

      <div className="bg-[#001233]/90 backdrop-blur-md border-b border-white/10 relative z-50">
        <SiteHeader />
      </div>

      <main className="w-full overflow-x-hidden relative z-10 pb-20">
        {/* ── HERO BANNER ── */}
        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-white/[0.06]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#001946]/85 via-[#05193B]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001946]/50 via-transparent to-transparent z-10" />

          <Image src={post.coverImage} alt={post.title} width={2200} height={980} className="h-[52vh] min-h-[380px] w-full object-cover" priority />

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border-2 border-[#E19508]/12" />
          <div className="pointer-events-none absolute left-[30%] top-[40%] h-24 w-24 rounded-full border-2 border-[#E19508]/10" />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-14 z-20">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.26em] text-[#E19508]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E19508]" />
              {categoryLabels[post.category]}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-white/80">
              {new Date(post.createdAt).toLocaleDateString()} • By {post.author}
            </p>
          </div>
        </section>

        {/* ── ARTICLE BODY ── */}
        <section className="mx-auto w-full max-w-4xl px-4 pt-10 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[#E19508]/25 bg-[#E19508]/10 px-5 py-2.5 text-sm font-bold text-[#E19508] transition-all hover:bg-[#E19508]/20 hover:gap-3"
          >
            ← Back To Blog
          </Link>

          <article className="mt-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#001233]/80 backdrop-blur-sm shadow-[0_20px_40px_-28px_rgba(0,0,0,0.4)]">
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#980140]/20 text-xs font-bold text-[#E19508]">
                  {post.category[0].toUpperCase()}
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#E19508]">
                  {categoryLabels[post.category]}
                </p>
              </div>

              <div className="border-t border-white/[0.08] pt-8">
                <BlogContentRenderer blocks={post.blocks} htmlContent={post.content} jsonContent={post.jsonContent} />
              </div>

              {/* ── POST FOOTER ── */}
              <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#E19508]/15 bg-[#001946]/60 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/60">
                  <span className="font-semibold text-white">{post.author}</span> &middot; Published{" "}
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#980140] to-[#A2014A] px-5 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_6px_20px_-8px_rgba(152,1,64,0.5)]"
                >
                  More Articles →
                </Link>
              </div>
            </div>
          </article>
        </section>
      </main>

      <div className="bg-[#001233] border-t border-white/10 relative z-20">
        <SiteFooter />
      </div>
    </div>
  );
}