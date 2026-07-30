// ─── Category Types ───────────────────────────────────────────────
export type PostCategory =
  | "devotional"
  | "testimony"
  | "events"
  | "leadership"
  | "family"
  | "prayer"
  | "article"
  | "blog"
  | "post";

// ─── Legacy Block Types (for migration) ────────────────────────────
export type PostBlockType = "heading2" | "heading3" | "paragraph" | "image";

export type PostBlock = {
  id: string;
  type: PostBlockType;
  text?: string;
  imageUrl?: string;
  bold?: boolean;
  italic?: boolean;
};

// ─── Structured JSON Content (Tiptap/ProseMirror format) ──────────

/** Marks that can be applied to inline text */
export type TipTapMark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "underline" }
  | { type: "strike" }
  | { type: "code" }
  | { type: "link"; attrs: { href: string; target?: string } }
  | { type: "highlight"; attrs?: { color?: string } }
  | { type: "textStyle"; attrs?: Record<string, string> };

/** Inline text node with optional marks */
export type TipTapTextNode = {
  type: "text";
  text: string;
  marks?: TipTapMark[];
};

/** Paragraph block */
export type TipTapParagraphNode = {
  type: "paragraph";
  content?: TipTapTextNode[];
  attrs?: {
    textAlign?: "left" | "center" | "right" | "justify";
  };
};

/** Heading block */
export type TipTapHeadingNode = {
  type: "heading";
  attrs: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    textAlign?: "left" | "center" | "right" | "justify";
  };
  content?: TipTapTextNode[];
};

/** Blockquote node (can contain paragraphs inside) */
export type TipTapBlockquoteNode = {
  type: "blockquote";
  content?: TipTapContentNode[];
};

/** Bullet list */
export type TipTapBulletListNode = {
  type: "bulletList";
  content?: TipTapListItemNode[];
};

/** Ordered list */
export type TipTapOrderedListNode = {
  type: "orderedList";
  attrs?: {
    start?: number;
  };
  content?: TipTapListItemNode[];
};

/** List item */
export type TipTapListItemNode = {
  type: "listItem";
  content?: TipTapContentNode[];
};

/** Horizontal rule */
export type TipTapHorizontalRuleNode = {
  type: "horizontalRule";
};

/** Image */
export type TipTapImageNode = {
  type: "image";
  attrs: {
    src: string;
    alt?: string;
    title?: string;
    width?: string | number;
    height?: string | number;
  };
};

/** Hard break */
export type TipTapHardBreakNode = {
  type: "hardBreak";
};

/** Code block */
export type TipTapCodeBlockNode = {
  type: "codeBlock";
  content?: TipTapTextNode[];
  attrs?: {
    language?: string;
  };
};

/** Callout / custom block - we'll render as a styled div */
export type TipTapCalloutNode = {
  type: "callout";
  attrs?: {
    variant?: "info" | "warning" | "tip" | "bible" | "prayer";
  };
  content?: TipTapContentNode[];
};

/** Text alignment wrapper */
export type TipTapTextAlignNode = {
  type: "paragraph" | "heading";
  attrs?: {
    textAlign?: "left" | "center" | "right" | "justify";
  };
  content?: TipTapTextNode[];
};

/** Union of all possible content nodes */
export type TipTapContentNode =
  | TipTapParagraphNode
  | TipTapHeadingNode
  | TipTapBlockquoteNode
  | TipTapBulletListNode
  | TipTapOrderedListNode
  | TipTapListItemNode
  | TipTapHorizontalRuleNode
  | TipTapImageNode
  | TipTapHardBreakNode
  | TipTapCodeBlockNode
  | TipTapCalloutNode;

/** Top-level TipTap document */
export type TipTapDocument = {
  type: "doc";
  content: TipTapContentNode[];
};

// ─── SEO & Publishing Fields ───────────────────────────────────────

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
};

export type PublishStatus = "draft" | "published" | "scheduled";

// ─── Blog Post Main Type ──────────────────────────────────────────

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: PostCategory;
  coverImage: string;
  /** HTML string (legacy) or empty; prefer jsonContent */
  content: string;
  /** Structured JSON content from Tiptap editor */
  jsonContent?: TipTapDocument | null;
  /** Legacy blocks fallback */
  blocks: PostBlock[];
  isPublished: boolean;
  author: string;
  seo?: SeoFields;
  readingTime?: number;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
};

// ─── Draft Post (for admin editor) ────────────────────────────────

export type DraftPost = {
  id?: number;
  title: string;
  excerpt: string;
  category: PostCategory;
  coverImage: string;
  /** HTML string (legacy) */
  content: string;
  /** Structured JSON content from Tiptap */
  jsonContent?: TipTapDocument | null;
  /** Legacy blocks */
  blocks: PostBlock[];
  isPublished: boolean;
  author: string;
  seo?: SeoFields;
};

// ─── Labels Map ────────────────────────────────────────────────────

export const categoryLabels: Record<PostCategory, string> = {
  devotional: "Devotional",
  testimony: "Testimony",
  events: "Events",
  leadership: "Leadership",
  family: "Family",
  prayer: "Prayer",
  article: "Article",
  blog: "Blog",
  post: "Post",
};

// ─── Reading Time & Word Count Helpers ─────────────────────────────

export function calculateWordCount(jsonContent: TipTapDocument | null | undefined, htmlContent: string): number {
  if (jsonContent?.content) {
    const text = extractTextFromJson(jsonContent);
    return text.trim().split(/\s+/).filter(Boolean).length;
  }
  // Fallback to HTML
  const text = htmlContent.replace(/<[^>]*>/g, "").trim();
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function calculateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

function extractTextFromJson(node: TipTapDocument | TipTapContentNode | TipTapTextNode): string {
  let text = "";
  if ("content" in node && node.content) {
    for (const child of node.content) {
      text += extractTextFromJson(child) + " ";
    }
  }
  if ("type" in node && node.type === ("text" as string)) {
    text += (node as unknown as TipTapTextNode).text || "";
  }
  return text;
}
