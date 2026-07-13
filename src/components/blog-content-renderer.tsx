import Image from "next/image";
import { PostBlock } from "@/types/blog";

type BlogContentRendererProps = {
  blocks: PostBlock[];
  htmlContent?: string;
};

export function BlogContentRenderer({ blocks, htmlContent }: BlogContentRendererProps) {
  // If HTML content is provided (from TipTap editor), render it directly
  if (htmlContent) {
    return (
      <div
        className="mx-auto max-w-3xl text-white antialiased selection:bg-[#980140]/40 selection:text-white prose prose-invert prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-2xl prose-h3:mt-5 prose-h3:mb-2 prose-p:text-sm prose-p:leading-relaxed prose-p:text-white/70 prose-p:mb-4 prose-a:text-[#E19508] prose-a:underline prose-a:underline-offset-2 prose-a:hover:text-[#f0a820] prose-img:rounded-xl prose-img:my-6 prose-img:mx-auto prose-img:max-w-full prose-img:h-auto prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-li:text-white/70 prose-li:leading-relaxed prose-li:mb-1 prose-strong:text-white prose-strong:font-bold prose-em:text-white/90"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  // Fallback to block-based rendering for legacy posts
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