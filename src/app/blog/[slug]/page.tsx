import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BlogPost, categoryLabels } from "@/types/blog";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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
    <div className="min-h-screen text-(--ink)">
      <SiteHeader />
      <main className="w-full pb-20">
        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-(--ash)">
          <Image src={post.coverImage} alt={post.title} width={2200} height={980} className="h-[52vh] min-h-[380px] w-full object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-r from-[#231227]/75 via-[#3c2141]/34 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8 lg:pb-14">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#ffbfd1]">{categoryLabels[post.category]}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">{post.title}</h1>
            <p className="mt-4 text-sm text-white/85">
              {new Date(post.createdAt).toLocaleDateString()} • By {post.author}
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 pt-10 sm:px-6">
          <Link href="/blog" className="inline-block text-sm font-bold text-(--rose)">
            ← Back To Blog
          </Link>

          <article className="mt-4 overflow-hidden rounded-3xl border border-(--ash) bg-white">
            <div className="px-6 py-8 sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">{categoryLabels[post.category]}</p>
              <p className="mt-5 text-lg leading-8 text-(--stone)">{post.excerpt}</p>

              <div className="mt-8 border-t border-(--ash) pt-8">
                <BlogContentRenderer blocks={post.blocks} />
              </div>
            </div>
          </article>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
