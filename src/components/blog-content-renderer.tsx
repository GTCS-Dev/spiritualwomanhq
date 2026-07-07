import Image from "next/image";
import { PostBlock } from "@/types/blog";

type BlogContentRendererProps = {
  blocks: PostBlock[];
};

export function BlogContentRenderer({ blocks }: BlogContentRendererProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 text-white antialiased selection:bg-[#980140]/40 selection:text-white">
      {blocks.map((block) => {
        if (block.type === "image" && block.imageUrl) {
          return (
            <div key={block.id} className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#001233]/70 backdrop-blur-sm shadow-xl transition-all duration-300">
              <Image
                src={block.imageUrl}
                alt="Editorial illustration"
                width={1200}
                height={700}
                className="h-auto w-full object-cover"
                priority={false}
              />
            </div>
          );
        }

        if (!block.text) {
          return null;
        }

        const structuralStyle = `${block.bold ? "font-bold" : ""} ${block.italic ? "italic" : ""}`.trim();

        if (block.type === "heading2") {
          return (
            <h2 key={block.id} className={`font-serif text-2xl font-extrabold tracking-tight text-white pt-4 leading-tight sm:text-3xl ${structuralStyle}`}>
              {block.text}
            </h2>
          );
        }

        if (block.type === "heading3") {
          return (
            <h3 key={block.id} className={`text-xs font-bold uppercase tracking-[0.2em] text-[#E19508] pt-2 ${structuralStyle}`}>
              {block.text}
            </h3>
          );
        }

        return (
          <p key={block.id} className={`text-sm leading-relaxed text-white/70 sm:text-base sm:leading-8 ${structuralStyle}`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}