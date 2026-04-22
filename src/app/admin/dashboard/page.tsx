"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";
import { BlogPost, PostBlock, PostBlockType, PostCategory, categoryLabels } from "@/types/blog";

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

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const initialPost: DraftPost = {
  title: "",
  excerpt: "",
  category: "devotional",
  coverImage: "/images/blog-prayer-rhythm.jpg",
  content: "",
  blocks: [
    {
      id: crypto.randomUUID(),
      type: "paragraph",
      text: "",
      bold: false,
      italic: false,
    },
  ],
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState("Preparing dashboard...");
  const [post, setPost] = useState<DraftPost>(initialPost);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeBlockType, setActiveBlockType] = useState<PostBlockType>("paragraph");

  const canPublish = useMemo(() => token.length > 0, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_access_token");

    if (!storedToken) {
      router.replace("/admin");
      return;
    }

    setToken(storedToken);
    setIsReady(true);
  }, [router]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchPosts(token);
  }, [token]);

  function handleUnauthorized() {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    setMessage("Session expired. Please login again.");
    router.replace("/admin");
  }

  async function parseApiError(response: Response, fallback: string) {
    try {
      const data = (await response.json()) as {
        message?: string | string[];
        error?: string;
      };

      if (Array.isArray(data.message)) {
        return data.message.join(" | ");
      }

      if (typeof data.message === "string" && data.message.trim().length > 0) {
        return data.message;
      }

      if (typeof data.error === "string" && data.error.trim().length > 0) {
        return data.error;
      }
    } catch {
      return fallback;
    }

    return fallback;
  }

  function validateDraft(input: DraftPost) {
    if (input.title.trim().length < 4) {
      return "Title must be at least 4 characters.";
    }

    if (input.excerpt.trim().length < 10) {
      return "Excerpt must be at least 10 characters.";
    }

    if (input.content.trim().length < 10) {
      return "Summary content must be at least 10 characters.";
    }

    if (input.coverImage.trim().length < 4) {
      return "Cover image is required.";
    }

    if (input.author.trim().length < 2) {
      return "Author must be at least 2 characters.";
    }

    if (input.blocks.length < 1) {
      return "Add at least one content block.";
    }

    for (const block of input.blocks) {
      if (block.type === "image") {
        if (!block.imageUrl || block.imageUrl.trim().length < 4) {
          return "Each image block must include an image URL.";
        }
      } else if (!block.text || block.text.trim().length < 1) {
        return `Block ${block.type} requires text.`;
      }
    }

    return null;
  }

  async function fetchPosts(authToken: string) {
    try {
      const response = await fetch(`${apiUrl}/posts/admin/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const errorMessage = await parseApiError(response, "Could not load posts list.");
        setMessage(errorMessage);
        return;
      }

      const data = (await response.json()) as BlogPost[];
      setPosts(data);
      setMessage("Dashboard ready.");
    } catch {
      setMessage("Unable to load posts list.");
    }
  }

  function resetDraft() {
    setPost({
      ...initialPost,
      blocks: [
        {
          id: crypto.randomUUID(),
          type: "paragraph",
          text: "",
          bold: false,
          italic: false,
        },
      ],
    });
  }

  function addBlock() {
    setPost((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          id: crypto.randomUUID(),
          type: activeBlockType,
          text: activeBlockType === "image" ? undefined : "",
          imageUrl: activeBlockType === "image" ? "/images/blog-prayer-rhythm.jpg" : undefined,
          bold: false,
          italic: false,
        },
      ],
    }));
  }

  function updateBlock(blockId: string, updater: (block: PostBlock) => PostBlock) {
    setPost((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) => (block.id === blockId ? updater(block) : block)),
    }));
  }

  function removeBlock(blockId: string) {
    setPost((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== blockId),
    }));
  }

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${apiUrl}/uploads/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = (await response.json()) as { url: string };
    return data.url;
  }

  function logout() {
    localStorage.removeItem("admin_access_token");
    document.cookie = "admin_session=; path=/; max-age=0; samesite=lax";
    router.push("/admin");
    router.refresh();
  }

  async function onPublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationMessage = validateDraft(post);
    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    try {
      const endpoint = post.id ? `${apiUrl}/posts/${post.id}` : `${apiUrl}/posts`;
      const method = post.id ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
          handleUnauthorized();
          return;
        }

        const errorMessage = await parseApiError(response, "Publishing failed. Verify token or fields.");
        setMessage(errorMessage);
        return;
      }

      resetDraft();
      setMessage(post.id ? "Post updated successfully." : "Post published successfully.");
      await fetchPosts(token);
    } catch {
      setMessage("Publishing failed due to network error.");
    }
  }

  async function togglePublish(target: BlogPost) {
    try {
      const route = target.isPublished ? "unpublish" : "publish";
      const response = await fetch(`${apiUrl}/posts/${target.id}/${route}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const errorMessage = await parseApiError(response, "Unable to change publish status.");
        setMessage(errorMessage);
        return;
      }

      setMessage(target.isPublished ? "Post moved to draft." : "Post published.");
      await fetchPosts(token);
    } catch {
      setMessage("Unable to change publish status.");
    }
  }

  async function deletePost(id: number) {
    try {
      const response = await fetch(`${apiUrl}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        const errorMessage = await parseApiError(response, "Unable to delete post.");
        setMessage(errorMessage);
        return;
      }

      setMessage("Post deleted.");
      await fetchPosts(token);
      if (post.id === id) {
        resetDraft();
      }
    } catch {
      setMessage("Unable to delete post.");
    }
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
    setMessage(`Editing: ${target.title}`);
  }

  if (!isReady) {
    return <main className="p-10 text-sm text-(--stone)">Loading admin dashboard...</main>;
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SiteLogo compact />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-(--rose)">Admin Dashboard</p>
            <h1 className="text-3xl font-extrabold text-(--ink)">Blog Management</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="rounded-full border border-(--stone)/25 px-5 py-2 text-sm font-semibold text-(--ink)">
            View Website
          </Link>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-(--ink) px-5 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-(--ash) bg-white px-4 py-3 text-sm text-(--stone)">{message}</p>

      <section className="grid gap-6 lg:grid-cols-12">
        <form onSubmit={onPublish} className="rounded-2xl border border-(--ash) bg-white p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-(--ink)">{post.id ? "Edit Post" : "Create Post"}</h2>
            {post.id ? (
              <button
                type="button"
                onClick={resetDraft}
                className="rounded-full border border-(--ash) px-4 py-2 text-sm font-semibold"
              >
                New Post
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3">
            <input
              value={post.title}
              onChange={(event) => setPost((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
              placeholder="Post title"
            />
            <input
              value={post.excerpt}
              onChange={(event) => setPost((prev) => ({ ...prev, excerpt: event.target.value }))}
              className="rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
              placeholder="Short excerpt"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={post.category}
                onChange={(event) =>
                  setPost((prev) => ({
                    ...prev,
                    category: event.target.value as PostCategory,
                  }))
                }
                className="rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
              >
                {(Object.keys(categoryLabels) as PostCategory[]).map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
              <label className="inline-flex items-center gap-2 rounded-lg border border-(--ash) px-3 py-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={post.isPublished}
                  onChange={(event) =>
                    setPost((prev) => ({
                      ...prev,
                      isPublished: event.target.checked,
                    }))
                  }
                />
                Publish Immediately
              </label>
            </div>

            <select
              value={post.coverImage}
              onChange={(event) => setPost((prev) => ({ ...prev, coverImage: event.target.value }))}
              className="rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
            >
              {coverOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label className="rounded-lg border border-dashed border-(--ash) px-3 py-3 text-sm text-(--stone)">
              Upload Cover Image
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) {
                    return;
                  }

                  try {
                    const imageUrl = await uploadFile(file);
                    setPost((prev) => ({ ...prev, coverImage: imageUrl }));
                    setMessage("Cover image uploaded successfully.");
                  } catch {
                    setMessage("Cover upload failed. Configure Cloudinary credentials in backend env.");
                  }
                }}
              />
            </label>

            {post.coverImage ? (
              <div className="overflow-hidden rounded-xl border border-(--ash)">
                <Image src={post.coverImage} alt="Cover preview" width={900} height={460} className="h-52 w-full object-cover" />
              </div>
            ) : null}

            <input
              value={post.author}
              onChange={(event) => setPost((prev) => ({ ...prev, author: event.target.value }))}
              className="rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
              placeholder="Author"
            />

            <textarea
              value={post.content}
              onChange={(event) => setPost((prev) => ({ ...prev, content: event.target.value }))}
              className="min-h-24 rounded-lg border border-(--ash) px-3 py-2 outline-none focus:border-(--rose)"
              placeholder="Post summary content"
            />

            <div className="rounded-xl border border-(--ash) p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">Content Blocks</h3>
                <select
                  value={activeBlockType}
                  onChange={(event) => setActiveBlockType(event.target.value as PostBlockType)}
                  className="rounded-lg border border-(--ash) px-3 py-1 text-sm"
                >
                  <option value="paragraph">Paragraph</option>
                  <option value="heading2">Heading 2</option>
                  <option value="heading3">Heading 3</option>
                  <option value="image">Image</option>
                </select>
                <button type="button" onClick={addBlock} className="rounded-full bg-(--ink) px-4 py-1 text-sm font-bold text-white">
                  Add Block
                </button>
              </div>

              <div className="grid gap-4">
                {post.blocks.map((block, index) => (
                  <div key={block.id} className="rounded-lg border border-(--ash) p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--stone)">
                        Block {index + 1} - {block.type}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>

                    {block.type === "image" ? (
                      <div className="grid gap-2">
                        <input
                          value={block.imageUrl ?? ""}
                          onChange={(event) =>
                            updateBlock(block.id, (current) => ({
                              ...current,
                              imageUrl: event.target.value,
                            }))
                          }
                          className="rounded-lg border border-(--ash) px-3 py-2 text-sm outline-none focus:border-(--rose)"
                          placeholder="Image URL"
                        />
                        <label className="rounded-lg border border-dashed border-(--ash) px-3 py-2 text-sm text-(--stone)">
                          Upload Block Image
                          <input
                            type="file"
                            accept="image/*"
                            className="mt-2 block w-full text-sm"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (!file) {
                                return;
                              }

                              try {
                                const imageUrl = await uploadFile(file);
                                updateBlock(block.id, (current) => ({
                                  ...current,
                                  imageUrl,
                                }));
                                setMessage("Block image uploaded successfully.");
                              } catch {
                                setMessage("Block image upload failed. Check Cloudinary config.");
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <textarea
                          value={block.text ?? ""}
                          onChange={(event) =>
                            updateBlock(block.id, (current) => ({
                              ...current,
                              text: event.target.value,
                            }))
                          }
                          className="min-h-20 rounded-lg border border-(--ash) px-3 py-2 text-sm outline-none focus:border-(--rose)"
                          placeholder="Text content"
                        />
                        <div className="flex items-center gap-4 text-sm">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={Boolean(block.bold)}
                              onChange={(event) =>
                                updateBlock(block.id, (current) => ({
                                  ...current,
                                  bold: event.target.checked,
                                }))
                              }
                            />
                            Bold
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={Boolean(block.italic)}
                              onChange={(event) =>
                                updateBlock(block.id, (current) => ({
                                  ...current,
                                  italic: event.target.checked,
                                }))
                              }
                            />
                            Italic
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="rounded-full bg-(--ink) px-5 py-2 font-bold text-white disabled:cursor-not-allowed disabled:bg-(--stone)"
              disabled={!canPublish}
              type="submit"
            >
              {post.id ? "Update Post" : "Publish"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl border border-(--ash) bg-white p-6 lg:col-span-4">
          <h2 className="text-2xl font-bold">Existing Posts</h2>
          <div className="mt-4 grid max-h-225 gap-3 overflow-auto pr-1">
            {posts.map((item) => (
              <article key={item.id} className="rounded-xl border border-(--ash) p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-(--rose)">
                  {categoryLabels[item.category]} - {item.isPublished ? "Published" : "Draft"}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-snug">{item.title}</h3>
                <p className="mt-2 text-xs text-(--stone)">{new Date(item.createdAt).toLocaleDateString()}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => editPost(item)}
                    className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePublish(item)}
                    className="rounded-full border border-(--ash) px-3 py-1 text-xs font-semibold"
                  >
                    {item.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePost(item.id)}
                    className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
