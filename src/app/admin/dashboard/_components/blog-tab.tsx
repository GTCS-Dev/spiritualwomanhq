"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Check, Pencil, Plus, Trash2, X, Eye, Search, Clock,
  FileText, Settings, Globe, Tag, BookOpen
} from "lucide-react";
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
import { BlogContentRenderer } from "@/components/blog-content-renderer";
import type { TipTapDocument } from "@/types/blog";

export function BlogTab({ token, onUnauthorized, onStatus }: AdminTabProps) {
  const [post, setPost] = useState<DraftPost>({
    ...initialPost,
    blocks: [],
  });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "seo">("editor");
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

  // ── Word count & reading time ────────────────────────────────────
  const wordCount = useMemo(() => {
    if (post.jsonContent) {
      const text = extractTextFromJson(post.jsonContent as TipTapDocument);
      return text.trim().split(/\s+/).filter(Boolean).length;
    }
    const text = post.content.replace(/<[^>]*>/g, "").trim();
    return text.trim().split(/\s+/).filter(Boolean).length;
  }, [post.jsonContent, post.content]);

  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 200)), [wordCount]);

  function extractTextFromJson(node: TipTapDocument | Record<string, unknown>): string {
    let text = "";
    if (node.content && Array.isArray(node.content)) {
      for (const child of node.content) {
        if (child && typeof child === "object") {
          text += extractTextFromJson(child as Record<string, unknown>) + " ";
        }
      }
    }
    if ("type" in node && node.type === "text" && "text" in node) {
      text += (node as { text: string }).text;
    }
    return text;
  }

  /** Auto-generate excerpt from the first paragraph of content */
  function generateExcerpt(html: string, json?: Record<string, unknown> | null): string {
    let plainText = "";

    if (json && json.content && Array.isArray(json.content)) {
      // Extract from JSON
      for (const block of json.content) {
        const b = block as Record<string, unknown>;
        if (b.type === "paragraph" && b.content && Array.isArray(b.content)) {
          for (const inline of b.content) {
            const i = inline as Record<string, unknown>;
            if (i.type === "text" && typeof i.text === "string") {
              plainText += i.text + " ";
            }
          }
          if (plainText.trim()) break;
        }
      }
    }

    if (!plainText.trim()) {
      plainText = html.replace(/<[^>]*>/g, "").trim();
    }

    if (!plainText) return "";
    if (plainText.length <= 150) return plainText;
    return plainText.slice(0, 147).trimEnd() + "...";
  }

  function resetDraft() {
    setPost({
      ...initialPost,
      blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }],
    });
    setShowPreview(false);
    setActiveTab("editor");
  }

  function validateDraft(input: DraftPost) {
    if (input.title.trim().length < 4) return "Title must be at least 4 characters.";
    if (input.coverImage.trim().length < 4) return "Cover image is required.";
    if (input.author.trim().length < 2) return "Author must be at least 2 characters.";
    const hasContent = input.jsonContent || (input.content && input.content.replace(/<[^>]*>/g, "").trim().length >= 10);
    if (!hasContent) return "Content must have at least 10 characters of text.";
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
      const excerpt = generateExcerpt(post.content, post.jsonContent);
      if (!excerpt) {
        onStatus("Add at least one paragraph with text to generate the excerpt.");
        return;
      }

      const endpoint = post.id ? `${apiUrl}/posts/${post.id}` : `${apiUrl}/posts`;
      const payload: Record<string, unknown> = {
        title: post.title,
        excerpt,
        category: post.category,
        coverImage: post.coverImage,
        content: post.content || "<p></p>",
        jsonContent: post.jsonContent || null,
        isPublished: post.isPublished,
        author: post.author,
        wordCount,
        readingTime,
      };

      if (post.seo) {
        payload.seo = post.seo;
      }

      if (post.blocks && post.blocks.length > 0) {
        // Only send blocks that have actual content (non-empty text or an image URL)
        const validBlocks = post.blocks.filter(
          (block) => (block.text && block.text.trim().length > 0) || (block.imageUrl && block.imageUrl.trim().length > 0),
        );
        if (validBlocks.length > 0) {
          payload.blocks = validBlocks;
        }
      }

      const response = await fetch(endpoint, {
        method: post.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
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
      jsonContent: target.jsonContent as Record<string, unknown> | null | undefined,
      blocks: target.blocks,
      isPublished: target.isPublished,
      author: target.author,
      seo: target.seo,
      readingTime: target.readingTime,
      wordCount: target.wordCount,
    });
    setShowPreview(false);
    setActiveTab("editor");
    onStatus(`Editing: "${target.title}"`);
  }

  // ── Handle editor content changes ────────────────────────────────
  const handleEditorChange = useCallback(
    (json: TipTapDocument | null, html: string) => {
      setPost((current) => ({
        ...current,
        jsonContent: json as unknown as Record<string, unknown>,
        content: html,
      }));
    },
    [],
  );

  // ── Filter posts by search ───────────────────────────────────────
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [posts, searchQuery]);

  const inputCls = "w-full rounded-xl border border-[#E19508]/15 bg-[#001233]/80 px-4 py-2.5 text-sm text-white outline-none focus:border-[#E19508]/60 focus:ring-2 focus:ring-[#E19508]/15 placeholder:text-white/40";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]/80 mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* ── Main Editor Column ───────────────────────────────────── */}
      <div className="lg:col-span-8 space-y-6">
        <form onSubmit={onPublish}>
          <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E19508]/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-extrabold text-white">
                  {post.id ? "Edit Post" : "New Post"}
                </h2>
                {post.id && (
                  <span className="rounded-full bg-[#980140]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E19508]">
                    Editing
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 rounded-full border border-[#E19508]/20 bg-[#E19508]/10 px-3 py-1.5 text-xs font-bold text-[#E19508] transition-all hover:bg-[#E19508]/20"
                >
                  <Eye size={13} />
                  {showPreview ? "Edit" : "Preview"}
                </button>
                {post.id && (
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="flex items-center gap-1.5 rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-3 py-1.5 text-xs font-semibold text-white/70 transition-all hover:border-[#E19508]/30 hover:text-[#E19508]"
                  >
                    <X size={12} /> New
                  </button>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#E19508]/10 bg-[#001946]/40">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "editor"
                    ? "border-b-2 border-[#E19508] text-[#E19508]"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <BookOpen size={13} />
                Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === "seo"
                    ? "border-b-2 border-[#E19508] text-[#E19508]"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <Search size={13} />
                SEO
              </button>
            </div>

            <div className="p-6">
              {activeTab === "editor" ? (
                <div className="grid gap-5">
                  {/* Title */}
                  <div>
                    <label className={labelCls}>Title</label>
                    <input
                      className={inputCls}
                      placeholder="Post title"
                      value={post.title}
                      onChange={(event) =>
                        setPost((current) => ({ ...current, title: event.target.value }))
                      }
                    />
                  </div>

                  {/* Category + Author */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Category</label>
                      <select
                        className={inputCls}
                        value={post.category}
                        onChange={(event) =>
                          setPost((current) => ({
                            ...current,
                            category: event.target.value as PostCategory,
                          }))
                        }
                      >
                        {(Object.keys(categoryLabels) as PostCategory[]).map((cat) => (
                          <option key={cat} value={cat} className="bg-[#001233] text-white">
                            {categoryLabels[cat]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Author</label>
                      <input
                        className={inputCls}
                        placeholder="Author name"
                        value={post.author}
                        onChange={(event) =>
                          setPost((current) => ({ ...current, author: event.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Rich Text Content */}
                  <div>
                    <label className={labelCls}>Content</label>
                    <RichTextEditor
                      initialJson={
                        post.jsonContent
                          ? (post.jsonContent as TipTapDocument)
                          : undefined
                      }
                      initialHtml={post.content}
                      onChange={handleEditorChange}
                      placeholder="Start writing your article..."
                      minHeight={500}
                    />
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-white/40">
                      <span className="flex items-center gap-1">
                        <FileText size={11} />
                        {wordCount} words
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {readingTime} min read
                      </span>
                    </div>
                  </div>

                  {/* Publish */}
                  <div className="flex items-center justify-between border-t border-[#E19508]/10 pt-5">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-white/80">
                      <input
                        type="checkbox"
                        className="accent-[#E19508]"
                        checked={post.isPublished}
                        onChange={(event) =>
                          setPost((current) => ({
                            ...current,
                            isPublished: event.target.checked,
                          }))
                        }
                      />
                      Publish immediately
                    </label>
                    <button
                      type="submit"
                      disabled={!canPublish}
                      className="rounded-full bg-[#980140] px-6 py-2.5 font-bold text-white transition-all duration-300 hover:bg-[#7c0134] hover:shadow-[0_6px_20px_-8px_rgba(152,1,64,0.5)] disabled:opacity-40"
                    >
                      {post.id ? "Update Post" : "Publish Post"}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── SEO Tab ─────────────────────────────────────── */
                <div className="grid gap-5">
                  <div>
                    <label className={labelCls}>SEO Title</label>
                    <input
                      className={inputCls}
                      placeholder="Custom SEO title (leave empty to use post title)"
                      value={post.seo?.seoTitle || ""}
                      onChange={(event) =>
                        setPost((current) => ({
                          ...current,
                          seo: { ...current.seo, seoTitle: event.target.value },
                        }))
                      }
                    />
                    <p className="mt-1 text-[11px] text-white/40">
                      Recommended: 50-60 characters. Currently: {(post.seo?.seoTitle || post.title).length} chars
                    </p>
                  </div>
                  <div>
                    <label className={labelCls}>SEO Description</label>
                    <textarea
                      className={`${inputCls} min-h-[80px] resize-y`}
                      placeholder="Meta description for search engines"
                      value={post.seo?.seoDescription || ""}
                      onChange={(event) =>
                        setPost((current) => ({
                          ...current,
                          seo: { ...current.seo, seoDescription: event.target.value },
                        }))
                      }
                    />
                    <p className="mt-1 text-[11px] text-white/40">
                      Recommended: 150-160 characters. Currently: {(post.seo?.seoDescription || "").length} chars
                    </p>
                  </div>
                  <div>
                    <label className={labelCls}>Focus Keyword</label>
                    <input
                      className={inputCls}
                      placeholder="Main keyword for this article"
                      value={post.seo?.focusKeyword || ""}
                      onChange={(event) =>
                        setPost((current) => ({
                          ...current,
                          seo: { ...current.seo, focusKeyword: event.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>OG Image URL</label>
                    <input
                      className={inputCls}
                      placeholder="Custom Open Graph image URL"
                      value={post.seo?.ogImage || ""}
                      onChange={(event) =>
                        setPost((current) => ({
                          ...current,
                          seo: { ...current.seo, ogImage: event.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* ── Preview Panel ──────────────────────────────────────── */}
        {showPreview && (
          <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-6 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#E19508]">
                <Eye size={14} className="inline mr-1.5" />
                Preview
              </h3>
              <span className="text-[11px] text-white/40">
                {wordCount} words · {readingTime} min read
              </span>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#001946]/40 p-6">
              <h1 className="text-3xl font-serif font-bold text-white mb-2">
                {post.title || "Untitled Post"}
              </h1>
              <p className="text-sm text-white/50 mb-6">
                By {post.author || "Author"} · {readingTime} min read
              </p>
              <BlogContentRenderer
                blocks={post.blocks}
                htmlContent={post.content}
                jsonContent={
                  post.jsonContent
                    ? (post.jsonContent as TipTapDocument)
                    : null
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Right Sidebar ────────────────────────────────────────── */}
      <aside className="lg:col-span-4 space-y-6">
        {/* Cover Image */}
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-5 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]/80">
            <Image src="/images/icon-image.svg" alt="" width={14} height={14} className="opacity-60" />
            Featured Image
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {coverOptions.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setPost((current) => ({ ...current, coverImage: src }))}
                className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  post.coverImage === src
                    ? "border-[#E19508] shadow-[0_0_0_2px_rgba(225,149,8,0.2)]"
                    : "border-[#E19508]/10 hover:border-[#E19508]/30"
                }`}
              >
                <Image src={src} alt="" width={120} height={75} className="h-14 w-full object-cover" />
                {post.coverImage === src && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#980140]/40 backdrop-blur-[2px]">
                    <Check size={14} className="text-[#E19508]" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Or upload custom
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 text-xs text-white/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#980140] file:px-3 file:py-1 file:text-[10px] file:font-bold file:text-white"
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

        {/* Post Stats */}
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-5 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]/80">
            <FileText size={13} />
            Post Stats
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Word Count</span>
              <span className="font-semibold text-white">{wordCount}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Reading Time</span>
              <span className="font-semibold text-white">{readingTime} min</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Status</span>
              <span
                className={`font-semibold ${
                  post.isPublished ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {post.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>

        {/* All Posts List */}
        <div className="rounded-2xl border border-[#E19508]/15 bg-[#001233]/70 backdrop-blur-sm p-5 shadow-[0_16px_40px_-20px_rgba(0,25,70,0.3)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E19508]/80">
              <Globe size={13} />
              All Posts ({posts.length})
            </h3>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#E19508]/10 bg-[#001233]/60 pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-[#E19508]/30 placeholder:text-white/30"
            />
          </div>

          <div className="grid max-h-[500px] gap-2 overflow-auto pr-1">
            {filteredPosts.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-3 transition-all duration-300 ${
                  post.id === item.id
                    ? "border-[#E19508]/30 bg-[#E19508]/5"
                    : "border-[#E19508]/10 bg-[#001233]/50 hover:border-[#E19508]/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#E19508]">
                      {categoryLabels[item.category]}
                      {item.isPublished ? (
                        <span className="ml-2 text-emerald-400">Published</span>
                      ) : (
                        <span className="ml-2 text-amber-400">Draft</span>
                      )}
                    </p>
                    <p className="mt-1 text-sm font-bold leading-snug text-white truncate">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/40">
                      {new Date(item.createdAt).toLocaleDateString()} · {item.readingTime || "?"} min read
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => editPost(item)}
                    className="flex items-center gap-1 rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-2.5 py-1 text-[10px] font-semibold text-white/80 transition-all hover:border-[#E19508]/30 hover:text-[#E19508]"
                  >
                    <Pencil size={10} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(item)}
                    className="rounded-full border border-[#E19508]/15 bg-[#001233]/50 px-2.5 py-1 text-[10px] font-semibold text-white/80 transition-all hover:border-[#E19508]/30"
                  >
                    {item.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(item.id)}
                    className="rounded-full border border-red-500/30 bg-[#001233]/50 px-2.5 py-1 text-[10px] font-semibold text-red-400 transition-all hover:bg-red-500/10"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <p className="text-sm text-white/50">
                {searchQuery ? "No posts match your search." : "No posts yet. Create your first one."}
              </p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}