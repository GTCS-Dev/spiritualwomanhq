import Image from "next/image";
import { PostBlock } from "@/types/blog";

type BlogContentRendererProps = {
  blocks: PostBlock[];
};

export function BlogContentRenderer({ blocks }: BlogContentRendererProps) {
  return (
    <div className="grid gap-5">
      {blocks.map((block) => {
        if (block.type === "image" && block.imageUrl) {
          return (
            <div key={block.id} className="overflow-hidden rounded-2xl border border-(--ash)">
              <Image
                src={block.imageUrl}
                alt="Blog visual"
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
              />
            </div>
          );
        }

        if (!block.text) {
          return null;
        }

        const className = `${block.bold ? "font-bold" : ""} ${block.italic ? "italic" : ""}`.trim();

        if (block.type === "heading2") {
          return (
            <h2 key={block.id} className={`text-3xl font-bold leading-tight text-(--ink) ${className}`}>
              {block.text}
            </h2>
          );
        }

        if (block.type === "heading3") {
          return (
            <h3 key={block.id} className={`text-2xl font-bold leading-tight text-(--ink) ${className}`}>
              {block.text}
            </h3>
          );
        }

        return (
          <p key={block.id} className={`text-base leading-8 text-(--stone) ${className}`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
