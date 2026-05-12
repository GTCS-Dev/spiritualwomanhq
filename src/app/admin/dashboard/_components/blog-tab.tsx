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

export function BlogTab({ token, onUnauthorized, onStatus }: AdminTabProps) {
  const [post, setPost] = useState<DraftPost>({
    ...initialPost,
    blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }],
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
    if (token) fetchPosts();
  }, [token, fetchPosts]);

  function resetDraft() {
    setPost({
      ...initialPost,
      blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }],
    });
  }

  function validateDraft(input: DraftPost) {
    if (input.title.trim().length < 4) return "Title must be at least 4 characters.";
    if (input.excerpt.trim().length < 10) return "Excerpt must be at least 10 characters.";
    if (input.content.trim().length < 10) return "Summary content must be at least 10 characters.";
    if (input.coverImage.trim().length < 4) return "Cover image is required.";
    if (input.author.trim().length < 2) return "Author must be at least 2 characters.";
    if (input.blocks.length < 1) return "Add at least one content block.";
    for (const block of input.blocks) {
      if (block.type === "image") {
        if (!block.imageUrl?.trim()) return "Each image block must include an image URL.";
      } else if (!block.text?.trim()) {
        return `Block "${block.type}" requires text.`;
      }
    }
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
      const endpoint = post.id ? `${apiUrl}/posts/${post.id}` : `${apiUrl}/posts`;
      const response = await fetch(endpoint, {
        method: post.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt,
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

  function addBlock() {
    setPost((current) => ({
      ...current,
      blocks: [
        ...current.blocks,
        {
          id: crypto.randomUUID(),
          type: activeBlockType,
          text: activeBlockType === "image" ? undefined : "",
          imageUrl: activeBlockType === "image" ? blogCoverImages[0] : undefined,
          bold: false,
          italic: false,
        },
      ],
    }));
  }

  function updateBlock(blockId: string, updater: (block: PostBlock) => PostBlock) {
    setPost((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === blockId ? updater(block) : block)),
    }));
  }

  function removeBlock(blockId: string) {
    setPost((current) => ({
      ...current,
      blocks: current.blocks.filter((block) => block.id !== blockId),
    }));
  }

  const inputCls = "w-full rounded-xl border border-(--ash) bg-white px-4 py-2.5 text-sm outline-none focus:border-(--rose)/60 focus:ring-2 focus:ring-(--rose)/15";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-(--stone) mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={onPublish} className="lg:col-span-8">
        <div className="rounded-2xl border border-(--ash) bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-(--ink)">{post.id ? "Edit Post" : "New Post"}</h2>
            {post.id && (
              <button type="button" onClick={resetDraft} className="flex items-center gap-1.5 rounded-full border border-(--ash) px-3 py-1.5 text-xs font-semibold text-(--stone) hover:text-(--rose)">
                <X size={12} /> Clear
              </button>
            )}
          </div>

          <div className="grid gap-5">
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} placeholder="Post title" value={post.title} onChange={(event) => setPost((current) => ({ ...current, title: event.target.value }))} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={post.category} onChange={(event) => setPost((current) => ({ ...current, category: event.target.value as PostCategory }))}>
                  {(Object.keys(categoryLabels) as PostCategory[]).map((category) => (
                    <option key={category} value={category}>{categoryLabels[category]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Author</label>
                <input className={inputCls} placeholder="Author name" value={post.author} onChange={(event) => setPost((current) => ({ ...current, author: event.target.value }))} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Excerpt (shown in cards)</label>
              <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Brief description" value={post.excerpt} onChange={(event) => setPost((current) => ({ ...current, excerpt: event.target.value }))} />
            </div>

            <div>
              <label className={labelCls}>Summary Content</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Opening paragraph" value={post.content} onChange={(event) => setPost((current) => ({ ...current, content: event.target.value }))} />
            </div>

            <div>
              <label className={labelCls}>Cover Image</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {coverOptions.map((src) => (
                  <button key={src} type="button" onClick={() => setPost((current) => ({ ...current, coverImage: src }))} className={`relative overflow-hidden rounded-xl border-2 transition ${post.coverImage === src ? "border-(--rose)" : "border-transparent"}`}>
                    <Image src={src} alt="" width={120} height={75} className="h-14 w-full object-cover" />
                    {post.coverImage === src && <div className="absolute inset-0 flex items-center justify-center bg-(--rose)/20"><Check size={14} className="text-(--rose)" /></div>}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <label className={`${labelCls} mt-3`}>Or upload cover image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="text-sm"
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

            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className={labelCls}>Content Blocks</label>
                <div className="flex items-center gap-2">
                  <select value={activeBlockType} onChange={(event) => setActiveBlockType(event.target.value as PostBlockType)} className="rounded-lg border border-(--ash) bg-white px-2 py-1 text-xs">
                    <option value="paragraph">Paragraph</option>
                    <option value="heading2">Heading 2</option>
                    <option value="heading3">Heading 3</option>
                    <option value="image">Image</option>
                  </select>
                  <button type="button" onClick={addBlock} className="flex items-center gap-1 rounded-full bg-(--rose) px-3 py-1 text-xs font-bold text-white">
                    <Plus size={12} /> Add Block
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                {post.blocks.map((block, index) => (
                  <div key={block.id} className="rounded-xl border border-(--ash) bg-(--blush)/40 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--rose)">Block {index + 1} — {block.type}</p>
                      <button type="button" onClick={() => removeBlock(block.id)} className="text-(--stone) hover:text-red-500"><Trash2 size={14} /></button>
                    </div>

                    {block.type === "image" ? (
                      <div>
                        <input className={inputCls} placeholder="Image URL" value={block.imageUrl ?? ""} onChange={(event) => updateBlock(block.id, (current) => ({ ...current, imageUrl: event.target.value }))} />
                        <input
                          type="file"
                          accept="image/*"
                          className="mt-2 text-sm"
                          onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadFile(file);
                              updateBlock(block.id, (current) => ({ ...current, imageUrl: url }));
                              onStatus("Block image uploaded.");
                            } catch {
                              onStatus("Block image upload failed.");
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div>
                        <textarea className={`${inputCls} resize-none`} rows={3} value={block.text ?? ""} onChange={(event) => updateBlock(block.id, (current) => ({ ...current, text: event.target.value }))} />
                        {block.type === "paragraph" && (
                          <div className="mt-2 flex gap-4 text-xs">
                            <label className="flex items-center gap-1.5 font-semibold">
                              <input type="checkbox" checked={Boolean(block.bold)} onChange={(event) => updateBlock(block.id, (current) => ({ ...current, bold: event.target.checked }))} /> Bold
                            </label>
                            <label className="flex items-center gap-1.5 font-semibold">
                              <input type="checkbox" checked={Boolean(block.italic)} onChange={(event) => updateBlock(block.id, (current) => ({ ...current, italic: event.target.checked }))} /> Italic
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-(--ash) pt-5">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={post.isPublished} onChange={(event) => setPost((current) => ({ ...current, isPublished: event.target.checked }))} />
                Publish immediately
              </label>
              <button type="submit" disabled={!canPublish} className="rounded-full bg-(--rose) px-6 py-2.5 font-bold text-white transition-colors hover:bg-(--rose-dark) disabled:opacity-40">
                {post.id ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <aside className="lg:col-span-4">
        <div className="rounded-2xl border border-(--ash) bg-white p-5">
          <h2 className="mb-4 text-base font-extrabold text-(--ink)">All Posts ({posts.length})</h2>
          <div className="grid max-h-[800px] gap-3 overflow-auto pr-1">
            {posts.map((item) => (
              <div key={item.id} className="rounded-xl border border-(--ash) p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--rose)">{categoryLabels[item.category]} — {item.isPublished ? "Published" : "Draft"}</p>
                <p className="mt-1.5 text-sm font-bold leading-snug text-(--ink)">{item.title}</p>
                <p className="mt-1 text-xs text-(--stone)">{new Date(item.createdAt).toLocaleDateString()}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => editPost(item)} className="flex items-center gap-1 rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:border-(--rose)/40 hover:text-(--rose)">
                    <Pencil size={11} /> Edit
                  </button>
                  <button type="button" onClick={() => togglePublish(item)} className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:border-(--rose)/40">
                    {item.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" onClick={() => deletePost(item.id)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p className="text-sm text-(--stone)">No posts yet. Create your first one.</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
