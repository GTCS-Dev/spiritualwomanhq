"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  AdminTabProps,
  BlogPost,
  DraftPost,
  PostBlock,
  PostBlockType,
  PostCategory,
  apiUrl,
  categoryLabels,
  coverOptions,
  initialPost,
  parseApiError,
} from "./shared";
import { blogCoverImages } from "@/lib/site-images";
import { RichTextEditor } from "@/components/rich-text-editor";

export function BlogTab({ token, onUnauthorized, onStatus }: AdminTabProps) {
const [post, setPost] = useState<DraftPost>({
    ...initialPost,
    blocks: [],
  });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeBlockType, setActiveBlockType] = useState<PostBlockType>("paragraph");
  const canPublish = token.length > 0;

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/posts/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) {
        if (response.status === 401) onUnauthorized();
        return;
      }
      setPosts((await response.json()) as BlogPost[]);
    } catch {
      // Keep current state when the request fails.
    }
  }, [token, onUnauthorized]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (token) fetchPosts();
  }, [token, fetchPosts]);

  /** Auto-generate excerpt from the first paragraph of HTML content */
  function generateExcerpt(html: string): string {
    // Strip HTML tags and get plain text
    const plainText = html.replace(/<[^>]*>/g, "").trim();
    if (!plainText) return "";
    if (plainText.length <= 150) return plainText;
    return plainText.slice(0, 147).trimEnd() + "...";
  }

  function resetDraft() {
    setPost({
      ...initialPost,
      blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }],
    });
  }

  function validateDraft(input: DraftPost) {
    if (input.title.trim().length < 4) return "Title must be at least 4 characters.";
    if (input.coverImage.trim().length < 4) return "Cover image is required.";
    if (input.author.trim().length < 2) return "Author must be at least 2 characters.";
    if (!input.content || input.content.replace(/<[^>]*>/g, "").trim().length < 10) return "Content must have at least 10 characters of text.";
    return null;
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${apiUrl}/uploads/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    return ((await response.json()) as { url: string }).url;
  }

  async function onPublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateDraft(post);
    if (error) {
      onStatus(error);
      return;
    }
    try {
      // Auto-generate excerpt from HTML content
      const excerpt = generateExcerpt(post.content);
      if (!excerpt) {
        onStatus("Add at least one paragraph with text to generate the excerpt.");
        return;
      }

      const endpoint = post.id ? `${apiUrl}/posts/${post.id}` : `${apiUrl}/posts`;
      const response = await fetch(endpoint, {
        method: post.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: post.title,
          excerpt,
          category: post.category,
          coverImage: post.coverImage,
          content: post.content,
          blocks: post.blocks,
          isPublished: post.isPublished,
          author: post.author,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized();
          return;
        }
        onStatus(await parseApiError(response, "Publishing failed."));
        return;
      }

      resetDraft();
      onStatus(post.id ? "Post updated." : "Post published.");
      await fetchPosts();
    } catch {
      onStatus("Network error.");
    }
  }

  async function togglePublish(target: BlogPost) {
    const route = target.isPublished ? "unpublish" : "publish";
    const response = await fetch(`${apiUrl}/posts/${target.id}/${route}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      return;
    }
    onStatus(target.isPublished ? "Moved to draft." : "Published.");
    await fetchPosts();
  }

  async function deletePost(id: number) {
    if (!confirm("Delete this post permanently?")) return;
    const response = await fetch(`${apiUrl}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      if (response.status === 401) onUnauthorized();
      return;
    }
    onStatus("Post deleted.");
    await fetchPosts();
    if (post.id === id) resetDraft();
  }

  function editPost(target: BlogPost) {
    setPost({
      id: target.id,
      title: target.title,
      excerpt: target.excerpt,
      category: target.category,
      coverImage: target.coverImage,
      content: target.content,
      blocks: target.blocks,
      isPublished: target.isPublished,
      author: target.author,
    });
    onStatus(`Editing: "${target.title}"`);
  }

  const inputCls = "w-full rounded-xl border border-[#E19508]/15 bg-[#001233]/80 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E19508]/60 focus:ring-2 focus:ring-[#E19508]/15 placeholder:text-white/40";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]/80 mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={onPublish} className="lg:col-span-8">
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-6 sm:p-8 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">{post.id ? "Edit Post" : "New Post"}</h2>
            {post.id && (
              <button type="button" onClick={resetDraft} className="flex items-center gap-1.5 rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-3 py-1.5 text-xs font-semibold text-white/70 transition-all duration-300 hover:border-[#E19508]/30 hover:text-[#E19508]">
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="grid gap-5">
            {/* Title */}
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} placeholder="Post title" value={post.title} onChange={(event) => setPost((current) => ({ ...current, title: event.target.value }))} />
            </div>

            {/* Category + Author */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={post.category} onChange={(event) => setPost((current) => ({ ...current, category: event.target.value as PostCategory }))}>
                  {(Object.keys(categoryLabels) as PostCategory[]).map((category) => (
                    <option key={category} value={category} className="bg-[#001233] text-white">{categoryLabels[category]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Author</label>
                <input className={inputCls} placeholder="Author name" value={post.author} onChange={(event) => setPost((current) => ({ ...current, author: event.target.value }))} />
              </div>
            </div>

            {/* Cover Image - simplified */}
            <div>
              <label className={labelCls}>Cover Image</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {coverOptions.map((src) => (
                  <button key={src} type="button" onClick={() => setPost((current) => ({ ...current, coverImage: src }))} className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${post.coverImage === src ? "border-[#E19508] shadow-[0_0_0_2px_rgba(225,149,8,0.2)]" : "border-[#E19508]/10 hover:border-[#E19508]/30"}`}>
                    <Image src={src} alt="" width={120} height={75} className="h-14 w-full object-cover" />
                    {post.coverImage === src && <div className="absolute inset-0 flex items-center justify-center bg-[#980140]/40 backdrop-blur-[2px]"><Check size={14} className="text-[#E19508]" /></div>}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <label className={`${labelCls} mt-3`}>Or upload</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#980140] file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadFile(file);
                      setPost((current) => ({ ...current, coverImage: url }));
                      onStatus("Cover image uploaded.");
                    } catch {
                      onStatus("Cover upload failed.");
                    }
                  }}
                />
              </div>
            </div>

            {/* Rich Text Content */}
            <div>
              <label className={labelCls}>Content</label>
              <RichTextEditor
                content={post.content}
                onChange={(html) => setPost((current) => ({ ...current, content: html }))}
              />
              <p className="mt-2 text-xs text-white/50">Excerpt is auto-generated from the first paragraph. Max 150 characters.</p>
            </div>

            {/* Publish */}
            <div className="flex items-center justify-between border-t border-[#E19508]/10 pt-5">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white/80">
                <input type="checkbox" className="accent-[#E19508]" checked={post.isPublished} onChange={(event) => setPost((current) => ({ ...current, isPublished: event.target.checked }))} />
                Publish immediately
              </label>
              <button type="submit" disabled={!canPublish} className="rounded-full bg-[#980140] px-6 py-2.5 font-bold text-white transition-all duration-300 hover:bg-[#7c0134] hover:shadow-[0_6px_20px_-8px_rgba(152,1,64,0.5)] disabled:opacity-40">
                {post.id ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <aside className="lg:col-span-4">
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-5 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <h2 className="mb-4 text-base font-extrabold text-white">All Posts ({posts.length})</h2>
          <div className="grid max-h-[800px] gap-3 overflow-auto pr-1">
            {posts.map((item) => (
              <div key={item.id} className="rounded-xl border border-[#E19508]/10 bg-[#001233]/50 p-4 transition-all duration-300 hover:border-[#E19508]/20">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E19508]">{categoryLabels[item.category]} — {item.isPublished ? "Published" : "Draft"}</p>
                <p className="mt-1.5 text-sm font-bold leading-snug text-white">{item.title}</p>
                <p className="mt-1 text-xs text-white/50">{new Date(item.createdAt).toLocaleDateString()}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => editPost(item)} className="flex items-center gap-1 rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-[#E19508]/30 hover:text-[#E19508]">
                    <Pencil size={11} /> Edit
                  </button>
                  <button type="button" onClick={() => togglePublish(item)} className="rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-white/80 transition-all duration-300 hover:border-[#E19508]/30">
                    {item.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" onClick={() => deletePost(item.id)} className="rounded-full border border-red-500/30 bg-[#001233]/50 px-3 py-1 text-xs font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/10">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-sm text-white/50">No posts yet. Create your first one.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}