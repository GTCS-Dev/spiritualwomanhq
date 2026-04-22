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
      <main className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6">
        <Link href="/blog" className="mt-8 inline-block text-sm font-bold text-(--rose)">
          ← Back To Blog
        </Link>

        <article className="mt-4 overflow-hidden rounded-3xl border border-(--ash) bg-white">
          <Image src={post.coverImage} alt={post.title} width={1300} height={740} className="h-[320px] w-full object-cover" />
          <div className="px-6 py-8 sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-(--rose)">{categoryLabels[post.category]}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight">{post.title}</h1>
            <p className="mt-4 text-sm text-(--stone)">
              {new Date(post.createdAt).toLocaleDateString()} • By {post.author}
            </p>
            <p className="mt-6 text-lg leading-8 text-(--stone)">{post.excerpt}</p>

            <div className="mt-8 border-t border-(--ash) pt-8">
              <BlogContentRenderer blocks={post.blocks} />
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
