"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, FileText, MessageSquare, Quote, Trash2, Pencil, Plus, Check, X } from "lucide-react";
import { SiteLogo } from "@/components/site-logo";
import { BlogPost, PostBlock, PostBlockType, PostCategory, categoryLabels } from "@/types/blog";

/* ─── Types ─────────────────────────────────────────── */
type Tab = "blog" | "verse" | "testimonials" | "messages";

type DraftPost = {
  id?: number;
  title: string;
  excerpt: string;
  category: PostCategory;
  coverImage: string;
  content: string;
  blocks: PostBlock[];
  isPublished: boolean;
  author: string;
};

type Verse = {
  _id: string;
  text: string;
  reference: string;
  period: string;
  isActive: boolean;
};

type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
  isPublished: boolean;
};

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
};

/* ─── Constants ──────────────────────────────────────── */
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const initialPost: DraftPost = {
  title: "",
  excerpt: "",
  category: "devotional",
  coverImage: "/images/blog-prayer-rhythm.jpg",
  content: "",
  blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }],
  isPublished: true,
  author: "Admin",
};

const coverOptions = [
  "/images/blog-prayer-rhythm.jpg",
  "/images/blog-testimony-light.jpg",
  "/images/blog-events-gathering.jpg",
  "/images/blog-leadership-deborah.jpg",
  "/images/blog-devotional-peace.jpg",
];

const tabs: { id: Tab; label: string; icon: typeof FileText }[] = [
  { id: "blog",         label: "Blog",           icon: FileText },
  { id: "verse",        label: "Verse of Week",  icon: BookOpen },
  { id: "testimonials", label: "Testimonials",   icon: Quote },
  { id: "messages",     label: "Messages",       icon: MessageSquare },
];

const MAX_TESTIMONIAL_WORDS = 23;

/* ─── Helpers ────────────────────────────────────────── */
async function parseApiError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { message?: string | string[]; error?: string };
    if (Array.isArray(data.message)) return data.message.join(" | ");
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof data.error === "string" && data.error.trim()) return data.error;
  } catch { /* empty */ }
  return fallback;
}

function countWords(value: string) {
  if (!value.trim()) return 0;
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function clampToMaxWords(value: string, maxWords: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return value;
  return words.slice(0, maxWords).join(" ");
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [status, setStatus] = useState("Dashboard ready.");

  useEffect(() => {
    const stored = localStorage.getItem("admin_access_token");
    if (!stored) { router.replace("/admin"); return; }
    setToken(stored);
    setIsReady(true);
  }, [router]);

  function handleUnauthorized() {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    router.replace("/admin");
  }

  function logout() {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    router.push("/admin");
  }

  if (!isReady) return <main className="p-10 text-sm text-(--stone)">Loading dashboard…</main>;

  return (
    <div className="min-h-screen bg-(--background) text-(--ink)">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 border-b border-(--ash) bg-(--background)/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-y-2 px-4 py-3 sm:flex-nowrap sm:px-6">
          <div className="flex items-center gap-3">
            <SiteLogo compact />
            <span className="hidden text-xs font-bold uppercase tracking-[0.22em] text-(--rose) sm:block">Admin</span>
          </div>

          {/* Tabs */}
          <nav className="order-3 flex w-full items-center justify-center gap-1 sm:order-2 sm:w-auto sm:justify-start">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:text-sm ${
                  activeTab === id
                    ? "bg-(--rose) text-white shadow-sm"
                    : "border border-transparent text-(--stone) hover:border-(--rose)/30 hover:bg-(--blush) hover:text-(--rose)"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>

          <div className="order-2 flex items-center gap-2 sm:order-3">
            <Link
              href="/"
              className="rounded-full border border-(--ash) bg-white px-3 py-1.5 text-xs font-semibold text-(--ink) transition-colors hover:border-(--rose)/40 hover:text-(--rose)"
            >
              View Site
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-(--rose) px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-(--rose-dark)"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Status bar ── */}
      <div className="border-b border-(--ash) bg-(--blush) px-4 py-2 text-center text-xs font-semibold tracking-wide text-(--rose) sm:px-6">
        {status}
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "blog" && (
          <BlogTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}
        {activeTab === "verse" && (
          <VerseTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}
        {activeTab === "testimonials" && (
          <TestimonialsTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}
        {activeTab === "messages" && (
          <MessagesTab token={token} onUnauthorized={handleUnauthorized} onStatus={setStatus} />
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BLOG TAB
═══════════════════════════════════════════════════════ */
function BlogTab({ token, onUnauthorized, onStatus }: { token: string; onUnauthorized: () => void; onStatus: (m: string) => void }) {
  const [post, setPost] = useState<DraftPost>({ ...initialPost, blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }] });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeBlockType, setActiveBlockType] = useState<PostBlockType>("paragraph");
  const canPublish = token.length > 0;

  const fetchPosts = useCallback(async () => {
    try {
      const r = await fetch(`${apiUrl}/posts/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
      setPosts(await r.json() as BlogPost[]);
    } catch { /* empty */ }
  }, [token, onUnauthorized]);

  useEffect(() => { if (token) fetchPosts(); }, [token, fetchPosts]);

  function resetDraft() {
    setPost({ ...initialPost, blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }] });
  }

  function validateDraft(input: DraftPost) {
    if (input.title.trim().length < 4) return "Title must be at least 4 characters.";
    if (input.excerpt.trim().length < 10) return "Excerpt must be at least 10 characters.";
    if (input.content.trim().length < 10) return "Summary content must be at least 10 characters.";
    if (input.coverImage.trim().length < 4) return "Cover image is required.";
    if (input.author.trim().length < 2) return "Author must be at least 2 characters.";
    if (input.blocks.length < 1) return "Add at least one content block.";
    for (const block of input.blocks) {
      if (block.type === "image") { if (!block.imageUrl?.trim()) return "Each image block must include an image URL."; }
      else if (!block.text?.trim()) return `Block "${block.type}" requires text.`;
    }
    return null;
  }

  async function uploadFile(file: File) {
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch(`${apiUrl}/uploads/image`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!r.ok) throw new Error("Upload failed");
    return ((await r.json()) as { url: string }).url;
  }

  async function onPublish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validateDraft(post);
    if (err) { onStatus(err); return; }
    try {
      const endpoint = post.id ? `${apiUrl}/posts/${post.id}` : `${apiUrl}/posts`;
      const r = await fetch(endpoint, {
        method: post.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: post.title, excerpt: post.excerpt, category: post.category, coverImage: post.coverImage, content: post.content, blocks: post.blocks, isPublished: post.isPublished, author: post.author }),
      });
      if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } onStatus(await parseApiError(r, "Publishing failed.")); return; }
      resetDraft(); onStatus(post.id ? "Post updated." : "Post published."); await fetchPosts();
    } catch { onStatus("Network error."); }
  }

  async function togglePublish(target: BlogPost) {
    const route = target.isPublished ? "unpublish" : "publish";
    const r = await fetch(`${apiUrl}/posts/${target.id}/${route}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
    onStatus(target.isPublished ? "Moved to draft." : "Published."); await fetchPosts();
  }

  async function deletePost(id: number) {
    if (!confirm("Delete this post permanently?")) return;
    const r = await fetch(`${apiUrl}/posts/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
    onStatus("Post deleted."); await fetchPosts();
    if (post.id === id) resetDraft();
  }

  function editPost(target: BlogPost) {
    setPost({ id: target.id, title: target.title, excerpt: target.excerpt, category: target.category, coverImage: target.coverImage, content: target.content, blocks: target.blocks, isPublished: target.isPublished, author: target.author });
    onStatus(`Editing: "${target.title}"`);
  }

  function addBlock() {
    setPost((p) => ({ ...p, blocks: [...p.blocks, { id: crypto.randomUUID(), type: activeBlockType, text: activeBlockType === "image" ? undefined : "", imageUrl: activeBlockType === "image" ? "/images/blog-prayer-rhythm.jpg" : undefined, bold: false, italic: false }] }));
  }

  function updateBlock(blockId: string, updater: (b: PostBlock) => PostBlock) {
    setPost((p) => ({ ...p, blocks: p.blocks.map((b) => (b.id === blockId ? updater(b) : b)) }));
  }

  function removeBlock(blockId: string) {
    setPost((p) => ({ ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }));
  }

  const inputCls = "w-full rounded-xl border border-(--ash) bg-white px-4 py-2.5 text-sm outline-none focus:border-(--rose)/60 focus:ring-2 focus:ring-(--rose)/15";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-(--stone) mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* ── Form (8 cols) ── */}
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
              <input className={inputCls} placeholder="Post title" value={post.title} onChange={(e) => setPost((p) => ({ ...p, title: e.target.value }))} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={post.category} onChange={(e) => setPost((p) => ({ ...p, category: e.target.value as PostCategory }))}>
                  {(Object.keys(categoryLabels) as PostCategory[]).map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Author</label>
                <input className={inputCls} placeholder="Author name" value={post.author} onChange={(e) => setPost((p) => ({ ...p, author: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Excerpt (shown in cards)</label>
              <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Brief description" value={post.excerpt} onChange={(e) => setPost((p) => ({ ...p, excerpt: e.target.value }))} />
            </div>

            <div>
              <label className={labelCls}>Summary Content</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Opening paragraph" value={post.content} onChange={(e) => setPost((p) => ({ ...p, content: e.target.value }))} />
            </div>

            <div>
              <label className={labelCls}>Cover Image</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {coverOptions.map((src) => (
                  <button key={src} type="button" onClick={() => setPost((p) => ({ ...p, coverImage: src }))}
                    className={`relative overflow-hidden rounded-xl border-2 transition ${post.coverImage === src ? "border-(--rose)" : "border-transparent"}`}>
                    <Image src={src} alt="" width={120} height={75} className="h-14 w-full object-cover" />
                    {post.coverImage === src && <div className="absolute inset-0 flex items-center justify-center bg-(--rose)/20"><Check size={14} className="text-(--rose)" /></div>}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <label className={`${labelCls} mt-3`}>Or upload cover image</label>
                <input type="file" accept="image/*" className="text-sm" onChange={async (e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  try { const url = await uploadFile(f); setPost((p) => ({ ...p, coverImage: url })); onStatus("Cover image uploaded."); }
                  catch { onStatus("Cover upload failed."); }
                }} />
              </div>
            </div>

            {/* Content blocks */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className={labelCls}>Content Blocks</label>
                <div className="flex items-center gap-2">
                  <select value={activeBlockType} onChange={(e) => setActiveBlockType(e.target.value as PostBlockType)} className="rounded-lg border border-(--ash) bg-white px-2 py-1 text-xs">
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
                        <input className={inputCls} placeholder="Image URL" value={block.imageUrl ?? ""} onChange={(e) => updateBlock(block.id, (b) => ({ ...b, imageUrl: e.target.value }))} />
                        <input type="file" accept="image/*" className="mt-2 text-sm" onChange={async (e) => {
                          const f = e.target.files?.[0]; if (!f) return;
                          try { const url = await uploadFile(f); updateBlock(block.id, (b) => ({ ...b, imageUrl: url })); onStatus("Block image uploaded."); }
                          catch { onStatus("Block image upload failed."); }
                        }} />
                      </div>
                    ) : (
                      <div>
                        <textarea className={`${inputCls} resize-none`} rows={3} value={block.text ?? ""} onChange={(e) => updateBlock(block.id, (b) => ({ ...b, text: e.target.value }))} />
                        {(block.type === "paragraph") && (
                          <div className="mt-2 flex gap-4 text-xs">
                            <label className="flex items-center gap-1.5 font-semibold">
                              <input type="checkbox" checked={Boolean(block.bold)} onChange={(e) => updateBlock(block.id, (b) => ({ ...b, bold: e.target.checked }))} /> Bold
                            </label>
                            <label className="flex items-center gap-1.5 font-semibold">
                              <input type="checkbox" checked={Boolean(block.italic)} onChange={(e) => updateBlock(block.id, (b) => ({ ...b, italic: e.target.checked }))} /> Italic
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
                <input type="checkbox" checked={post.isPublished} onChange={(e) => setPost((p) => ({ ...p, isPublished: e.target.checked }))} />
                Publish immediately
              </label>
              <button type="submit" disabled={!canPublish} className="rounded-full bg-(--rose) px-6 py-2.5 font-bold text-white transition-colors hover:bg-(--rose-dark) disabled:opacity-40">
                {post.id ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ── Post list (4 cols) ── */}
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

/* ═══════════════════════════════════════════════════════
   VERSE TAB
═══════════════════════════════════════════════════════ */
function VerseTab({ token, onUnauthorized, onStatus }: { token: string; onUnauthorized: () => void; onStatus: (m: string) => void }) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [text, setText] = useState("");
  const [reference, setReference] = useState("");
  const [period, setPeriod] = useState("week");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchVerses = useCallback(async () => {
    try {
      const r = await fetch(`${apiUrl}/verses/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
      setVerses(await r.json() as Verse[]);
    } catch { /* empty */ }
  }, [token, onUnauthorized]);

  useEffect(() => { if (token) fetchVerses(); }, [token, fetchVerses]);

  function startEdit(v: Verse) {
    setEditingId(v._id); setText(v.text); setReference(v.reference); setPeriod(v.period);
  }

  function cancelEdit() {
    setEditingId(null); setText(""); setReference(""); setPeriod("week");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !reference.trim()) { onStatus("Verse text and reference are required."); return; }
    try {
      const isEdit = Boolean(editingId);
      const url = isEdit ? `${apiUrl}/verses/${editingId}` : `${apiUrl}/verses`;
      const r = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text, reference, period, isActive: true }),
      });
      if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } onStatus(await parseApiError(r, "Save failed.")); return; }
      onStatus(isEdit ? "Verse updated." : "Verse saved."); cancelEdit(); await fetchVerses();
    } catch { onStatus("Network error."); }
  }

  async function setActive(id: string) {
    const r = await fetch(`${apiUrl}/verses/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ isActive: true }) });
    if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
    await fetchVerses(); onStatus("Verse set as active.");
  }

  async function deleteVerse(id: string) {
    if (!confirm("Delete this verse?")) return;
    const r = await fetch(`${apiUrl}/verses/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
    onStatus("Verse deleted."); await fetchVerses();
  }

  const inputCls = "w-full rounded-xl border border-(--ash) bg-white px-4 py-2.5 text-sm outline-none focus:border-(--rose)/60 focus:ring-2 focus:ring-(--rose)/15";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-(--stone) mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={save} className="lg:col-span-5">
        <div className="rounded-2xl border border-(--ash) bg-white p-6">
          <h2 className="mb-5 text-xl font-extrabold text-(--ink)">{editingId ? "Edit Verse" : "Add Verse"}</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Verse Text</label>
              <textarea className={`${inputCls} resize-none`} rows={4} placeholder="Full verse text…" value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Reference (e.g. Proverbs 31:25)</label>
              <input className={inputCls} placeholder="Book Chapter:Verse" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Period</label>
              <select className={inputCls} value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="week">Verse of the Week</option>
                <option value="day">Verse of the Day</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="rounded-full bg-(--rose) px-6 py-2.5 font-bold text-white hover:bg-(--rose-dark)">
                {editingId ? "Update Verse" : "Save Verse"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="rounded-full border border-(--ash) px-5 py-2.5 text-sm font-semibold text-(--stone) hover:text-(--ink)">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-(--ash) bg-white p-5">
          <h2 className="mb-4 text-base font-extrabold text-(--ink)">Saved Verses ({verses.length})</h2>
          <div className="grid gap-4">
            {verses.map((v) => (
              <div key={v._id} className={`rounded-xl border p-4 ${v.isActive ? "border-(--rose)/40 bg-(--blush)" : "border-(--ash)"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {v.isActive && <span className="mb-2 inline-block rounded-full bg-(--rose) px-2.5 py-0.5 text-xs font-bold text-white">Active</span>}
                    <p className="text-sm font-semibold italic text-(--ink)">"{v.text}"</p>
                    <p className="mt-1 text-xs font-bold text-(--rose)">{v.reference} — {v.period === "day" ? "Day" : "Week"}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!v.isActive && (
                    <button type="button" onClick={() => setActive(v._id)} className="rounded-full bg-(--rose) px-3 py-1 text-xs font-bold text-white">
                      Set Active
                    </button>
                  )}
                  <button type="button" onClick={() => startEdit(v)} className="flex items-center gap-1 rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:text-(--rose)">
                    <Pencil size={11} /> Edit
                  </button>
                  <button type="button" onClick={() => deleteVerse(v._id)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {verses.length === 0 && <p className="text-sm text-(--stone)">No verses yet. Add one to display on the home page.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TESTIMONIALS TAB
═══════════════════════════════════════════════════════ */
function TestimonialsTab({ token, onUnauthorized, onStatus }: { token: string; onUnauthorized: () => void; onStatus: (m: string) => void }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const quoteWordCount = useMemo(() => countWords(quote), [quote]);

  const fetchAll = useCallback(async () => {
    try {
      const r = await fetch(`${apiUrl}/testimonials/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
      setTestimonials(await r.json() as Testimonial[]);
    } catch { /* empty */ }
  }, [token, onUnauthorized]);

  useEffect(() => { if (token) fetchAll(); }, [token, fetchAll]);

  function startEdit(t: Testimonial) {
    setEditingId(t._id); setQuote(t.quote); setName(t.name); setRole(t.role);
  }

  function cancelEdit() {
    setEditingId(null); setQuote(""); setName(""); setRole("");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!quote.trim()) { onStatus("Quote is required."); return; }
    if (quoteWordCount > MAX_TESTIMONIAL_WORDS) {
      onStatus(`Quote must be ${MAX_TESTIMONIAL_WORDS} words or less.`);
      return;
    }
    if (name.trim().length < 2) { onStatus("Name is required."); return; }
    if (role.trim().length < 2) { onStatus("Role is required."); return; }
    try {
      const isEdit = Boolean(editingId);
      const url = isEdit ? `${apiUrl}/testimonials/${editingId}` : `${apiUrl}/testimonials`;
      const r = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quote, name, role, isPublished: true }),
      });
      if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } onStatus(await parseApiError(r, "Save failed.")); return; }
      onStatus(isEdit ? "Testimonial updated." : "Testimonial saved."); cancelEdit(); await fetchAll();
    } catch { onStatus("Network error."); }
  }

  async function togglePublish(t: Testimonial) {
    const r = await fetch(`${apiUrl}/testimonials/${t._id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ isPublished: !t.isPublished }) });
    if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
    onStatus(t.isPublished ? "Hidden from site." : "Visible on site."); await fetchAll();
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const r = await fetch(`${apiUrl}/testimonials/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
    onStatus("Testimonial deleted."); await fetchAll();
  }

  const inputCls = "w-full rounded-xl border border-(--ash) bg-white px-4 py-2.5 text-sm outline-none focus:border-(--rose)/60 focus:ring-2 focus:ring-(--rose)/15";
  const labelCls = "block text-xs font-bold uppercase tracking-[0.16em] text-(--stone) mb-1.5";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={save} className="lg:col-span-5">
        <div className="rounded-2xl border border-(--ash) bg-white p-6">
          <h2 className="mb-5 text-xl font-extrabold text-(--ink)">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls}>Quote</label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={4}
                placeholder="Their story in their words..."
                value={quote}
                onChange={(e) => setQuote(clampToMaxWords(e.target.value, MAX_TESTIMONIAL_WORDS))}
              />
              <p className="mt-1 text-xs font-semibold text-(--stone)">
                {quoteWordCount}/{MAX_TESTIMONIAL_WORDS} words
              </p>
            </div>
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} placeholder="e.g. Amara O." value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Role or Title</label>
              <input className={inputCls} placeholder="e.g. Member since 2022" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="rounded-full bg-(--rose) px-6 py-2.5 font-bold text-white hover:bg-(--rose-dark)">
                {editingId ? "Update" : "Save Testimonial"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="rounded-full border border-(--ash) px-5 py-2.5 text-sm font-semibold text-(--stone) hover:text-(--ink)">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-(--ash) bg-white p-5">
          <h2 className="mb-4 text-base font-extrabold text-(--ink)">All Testimonials ({testimonials.length})</h2>
          <div className="grid gap-4">
            {testimonials.map((t) => (
              <div key={t._id} className={`rounded-xl border p-4 ${t.isPublished ? "border-(--ash)" : "border-dashed border-(--stone)/40 opacity-70"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--blush) text-sm font-bold text-(--rose)">{t.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-(--ink)">{t.name}</p>
                      <p className="text-xs text-(--stone)">{t.role}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${t.isPublished ? "bg-green-100 text-green-700" : "bg-(--ash) text-(--stone)"}`}>
                    {t.isPublished ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="mt-3 text-sm italic text-(--stone)">"{t.quote}"</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => startEdit(t)} className="flex items-center gap-1 rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:text-(--rose)">
                    <Pencil size={11} /> Edit
                  </button>
                  <button type="button" onClick={() => togglePublish(t)} className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:border-(--rose)/40">
                    {t.isPublished ? "Hide" : "Show"}
                  </button>
                  <button type="button" onClick={() => deleteTestimonial(t._id)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && <p className="text-sm text-(--stone)">No testimonials yet. Add one to feature stories on the home page.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MESSAGES TAB
═══════════════════════════════════════════════════════ */
function MessagesTab({ token, onUnauthorized, onStatus }: { token: string; onUnauthorized: () => void; onStatus: (m: string) => void }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const r = await fetch(`${apiUrl}/contact-messages/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) { if (r.status === 401) { onUnauthorized(); return; } return; }
        setMessages(await r.json() as ContactMessage[]);
        onStatus("Messages loaded.");
      } catch { onStatus("Could not load messages."); }
    })();
  }, [token, onUnauthorized, onStatus]);

  return (
    <div className="rounded-2xl border border-(--ash) bg-white p-6">
      <h2 className="mb-5 text-xl font-extrabold text-(--ink)">Contact Messages ({messages.length})</h2>
      {messages.length === 0 ? (
        <p className="text-sm text-(--stone)">No messages yet.</p>
      ) : (
        <div className="grid gap-3">
          {messages.map((m) => (
            <div key={m._id} className="rounded-xl border border-(--ash) p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-(--ink)">{m.name}</p>
                  <p className="text-xs text-(--stone)">{m.email} — {new Date(m.createdAt).toLocaleDateString()}</p>
                  {m.subject && <p className="mt-1 text-xs font-semibold text-(--rose)">{m.subject}</p>}
                </div>
                <button type="button" onClick={() => setExpanded(expanded === m._id ? null : m._id)} className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold hover:text-(--rose)">
                  {expanded === m._id ? "Collapse" : "Read"}
                </button>
              </div>
              {expanded === m._id && (
                <p className="mt-3 rounded-lg bg-(--blush) px-4 py-3 text-sm leading-7 text-(--stone)">{m.message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}