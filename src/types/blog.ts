export type PostCategory =
  | "devotional"
  | "testimony"
  | "events"
  | "leadership"
  | "family"
  | "prayer";

export type PostBlockType = "heading2" | "heading3" | "paragraph" | "image";

export type PostBlock = {
  id: string;
  type: PostBlockType;
  text?: string;
  imageUrl?: string;
  bold?: boolean;
  italic?: boolean;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: PostCategory;
  coverImage: string;
  content: string;
  blocks: PostBlock[];
  isPublished: boolean;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export const categoryLabels: Record<PostCategory, string> = {
  devotional: "Devotional",
  testimony: "Testimony",
  events: "Events",
  leadership: "Leadership",
  family: "Family",
  prayer: "Prayer",
};
