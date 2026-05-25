import { BlogPost, PostBlock, PostBlockType, PostCategory, categoryLabels } from "@/types/blog";
import { blogCoverImages } from "@/lib/site-images";

export type Tab = "blog" | "verse" | "testimonials" | "competitions" | "messages";

export type DraftPost = {
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

export type Verse = {
  _id: string;
  text: string;
  reference: string;
  period: string;
  isActive: boolean;
};

export type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role: string;
  isPublished: boolean;
};

export type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
};

export type AdminTabProps = {
  token: string;
  onUnauthorized: () => void;
  onStatus: (message: string) => void;
};

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").trim();
const normalizedApiUrl = /^https?:\/\//i.test(rawApiUrl) ? rawApiUrl : `https://${rawApiUrl}`;
export const apiUrl = normalizedApiUrl.replace(/\/+$/, "");

export const initialPost: DraftPost = {
  title: "",
  excerpt: "",
  category: "devotional",
  coverImage: blogCoverImages[0],
  content: "",
  blocks: [{ id: crypto.randomUUID(), type: "paragraph", text: "", bold: false, italic: false }],
  isPublished: true,
  author: "Admin",
};

export const coverOptions = [...blogCoverImages];

export const MAX_TESTIMONIAL_WORDS = 23;

export async function parseApiError(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { message?: string | string[]; error?: string };
    if (Array.isArray(data.message)) return data.message.join(" | ");
    if (typeof data.message === "string" && data.message.trim()) return data.message;
    if (typeof data.error === "string" && data.error.trim()) return data.error;
  } catch {
    // Ignore invalid JSON error payloads.
  }
  return fallback;
}

export function buildApiUrlCandidates(path: string) {
  const trimmedBase = apiUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const candidates = [`${trimmedBase}${normalizedPath}`];

  if (trimmedBase.endsWith("/api")) {
    candidates.push(`${trimmedBase.slice(0, -4)}${normalizedPath}`);
  } else {
    candidates.push(`${trimmedBase}/api${normalizedPath}`);
  }

  return Array.from(new Set(candidates));
}

export async function fetchWithApiFallback(path: string, init?: RequestInit) {
  const urls = buildApiUrlCandidates(path);
  let lastError: unknown;

  for (let i = 0; i < urls.length; i += 1) {
    try {
      const response = await fetch(urls[i], init);
      if (response.status !== 404 || i === urls.length - 1) return response;
    } catch (error) {
      lastError = error;
      if (i === urls.length - 1) throw error;
    }
  }

  throw lastError ?? new Error("Request failed");
}

export function countWords(value: string) {
  if (!value.trim()) return 0;
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function clampToMaxWords(value: string, maxWords: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return value;
  return words.slice(0, maxWords).join(" ");
}

export { categoryLabels };
export type { BlogPost, PostBlock, PostBlockType, PostCategory };
