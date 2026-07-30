import React from "react";
import Image from "next/image";
import type { TipTapDocument, TipTapContentNode, TipTapTextNode, BlogPost } from "@/types/blog";

// ─── Props ─────────────────────────────────────────────────────────

type BlogContentRendererProps = {
  blocks?: BlogPost["blocks"];
  htmlContent?: string;
  jsonContent?: TipTapDocument | null;
};

// ─── XSS Sanitizer Helper (simple HTML stripping for legacy content) ──

function stripXSS(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data:\s*text\/html/gi, "");
}

// ─── Render Inline Content ────────────────────────────────────────

function renderInlineContent(content?: TipTapTextNode[]): React.ReactNode {
  if (!content) return null;

  return content.map((node, index) => {
    if (!node.marks || node.marks.length === 0) {
      return node.text;
    }

    let element: React.ReactNode = node.text;

    // Apply marks in order for correct nesting
    for (const mark of node.marks) {
      switch (mark.type) {
        case "bold":
          element = <strong key={`bold-${index}`}>{element}</strong>;
          break;
        case "italic":
          element = <em key={`italic-${index}`}>{element}</em>;
          break;
        case "underline":
          element = <u key={`underline-${index}`}>{element}</u>;
          break;
        case "strike":
          element = <s key={`strike-${index}`}>{element}</s>;
          break;
        case "code":
          element = <code key={`code-${index}`} className="bg-[#E19508]/10 text-[#E19508] px-1.5 py-0.5 rounded text-sm font-mono">{element}</code>;
          break;
        case "link":
          element = (
            <a
              key={`link-${index}`}
              href={mark.attrs?.href || "#"}
              target={mark.attrs?.target || "_blank"}
              rel="noopener noreferrer"
              className="text-[#E19508] underline underline-offset-2 hover:text-[#f0a820] transition-colors"
            >
              {element}
            </a>
          );
          break;
        case "highlight":
          element = (
            <span
              key={`highlight-${index}`}
              className="bg-[#E19508]/20 px-1 rounded"
              style={mark.attrs?.color ? { backgroundColor: mark.attrs.color } : undefined}
            >
              {element}
            </span>
          );
          break;
      }
    }

    return <span key={index}>{element}</span>;
  });
}

// ─── Render Content Node ───────────────────────────────────────────

function renderNode(node: TipTapContentNode, index: number): React.ReactNode {
  switch (node.type) {
    case "paragraph": {
      const textAlign = node.attrs?.textAlign || "left";
      return (
        <p
          key={index}
          className="text-base leading-[1.8] text-white/70 mb-6"
          style={{ textAlign }}
        >
          {renderInlineContent(node.content)}
        </p>
      );
    }

    case "heading": {
      const textAlign = node.attrs?.textAlign || "left";
      const level = node.attrs.level;
      const styles: Record<number, string> = {
        1: "text-4xl sm:text-5xl font-serif font-bold text-white mt-12 mb-6 tracking-tight leading-tight",
        2: "text-3xl sm:text-4xl font-serif font-bold text-white mt-10 mb-5 tracking-tight",
        3: "text-2xl sm:text-3xl font-serif font-semibold text-white mt-8 mb-4",
        4: "text-xl sm:text-2xl font-serif font-semibold text-white mt-6 mb-3",
        5: "text-lg sm:text-xl font-serif font-semibold text-white mt-4 mb-2",
        6: "text-base sm:text-lg font-serif font-semibold text-[#E19508] mt-4 mb-2 uppercase tracking-wider",
      };
      const className = styles[level] || styles[2];
      const inlineStyle: React.CSSProperties = { textAlign };

      return React.createElement(
        `h${level}`,
        { key: index, className, style: inlineStyle },
        renderInlineContent(node.content)
      );
    }

    case "blockquote": {
      return (
        <blockquote
          key={index}
          className="relative border-l-4 border-[#E19508] pl-6 py-3 my-8 bg-[#E19508]/5 rounded-r-xl italic text-white/80 text-lg leading-relaxed"
        >
          <span className="absolute -top-2 -left-2 text-4xl text-[#E19508]/30 font-serif leading-none">&ldquo;</span>
          <div className="space-y-3">
            {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
          </div>
        </blockquote>
      );
    }

    case "bulletList": {
      return (
        <ul key={index} className="list-disc pl-6 mb-6 space-y-2 text-white/70 text-base leading-relaxed">
          {node.content?.map((item, itemIndex) => {
            if (item.type === "listItem") {
              return (
                <li key={itemIndex} className="pl-1">
                  {item.content?.map((child, childIndex) => renderNode(child, childIndex))}
                </li>
              );
            }
            return null;
          })}
        </ul>
      );
    }

    case "orderedList": {
      return (
        <ol key={index} className="list-decimal pl-6 mb-6 space-y-2 text-white/70 text-base leading-relaxed">
          {node.content?.map((item, itemIndex) => {
            if (item.type === "listItem") {
              return (
                <li key={itemIndex} className="pl-1">
                  {item.content?.map((child, childIndex) => renderNode(child, childIndex))}
                </li>
              );
            }
            return null;
          })}
        </ol>
      );
    }

    case "horizontalRule": {
      return (
        <hr
          key={index}
          className="my-10 border-t border-[#E19508]/15"
        />
      );
    }

    case "image": {
      return (
        <figure key={index} className="my-8 mx-auto">
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#001233]/70 backdrop-blur-sm shadow-xl">
            <Image
              src={node.attrs.src}
              alt={node.attrs.alt || "Blog image"}
              width={node.attrs.width ? Number(node.attrs.width) : 1200}
              height={node.attrs.height ? Number(node.attrs.height) : 700}
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>
          {node.attrs.alt && (
            <figcaption className="mt-2 text-center text-sm text-white/40 italic">
              {node.attrs.alt}
            </figcaption>
          )}
        </figure>
      );
    }

    case "hardBreak": {
      return <br key={index} />;
    }

    case "codeBlock": {
      return (
        <pre
          key={index}
          className="bg-[#001233] border border-[#E19508]/10 rounded-xl p-4 my-6 overflow-x-auto"
        >
          <code className="text-sm font-mono text-white/80 leading-relaxed block">
            {renderInlineContent(node.content)}
          </code>
        </pre>
      );
    }

    case "callout": {
      const variant = node.attrs?.variant || "info";
      const variantStyles: Record<string, string> = {
        info: "border-[#E19508]/30 bg-[#E19508]/5",
        warning: "border-orange-500/30 bg-orange-500/5",
        tip: "border-emerald-500/30 bg-emerald-500/5",
        bible: "border-[#980140]/30 bg-[#980140]/5",
        prayer: "border-purple-500/30 bg-purple-500/5",
      };
      const variantIcons: Record<string, string> = {
        info: "💡",
        warning: "⚠️",
        tip: "💭",
        bible: "📖",
        prayer: "🙏",
      };

      return (
        <div
          key={index}
          className={`relative rounded-xl border-l-4 p-5 my-6 backdrop-blur-sm ${variantStyles[variant] || variantStyles.info}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl leading-none mt-0.5">{variantIcons[variant] || variantIcons.info}</span>
            <div className="space-y-2 flex-1 text-white/80 text-base leading-relaxed">
              {node.content?.map((child, childIndex) => renderNode(child, childIndex))}
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Main Renderer ─────────────────────────────────────────────────

export function BlogContentRenderer({ blocks, htmlContent, jsonContent }: BlogContentRendererProps) {
  // ── Priority 1: Structured JSON content ──────────────────────────
  if (jsonContent?.content && jsonContent.content.length > 0) {
    return (
      <div className="mx-auto max-w-[800px] text-white antialiased selection:bg-[#980140]/40 selection:text-white">
        <div className="space-y-1">
          {jsonContent.content.map((node, index) => renderNode(node, index))}
        </div>
      </div>
    );
  }

  // ── Priority 2: HTML content (from Tiptap editor) ────────────────
  if (htmlContent && htmlContent.trim().length > 0 && htmlContent !== "<p></p>") {
    const cleanHtml = stripXSS(htmlContent);
    return (
      <div
        className="mx-auto max-w-[800px] text-white antialiased selection:bg-[#980140]/40 selection:text-white prose prose-invert prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6 prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-base prose-p:leading-[1.8] prose-p:text-white/70 prose-p:mb-6 prose-a:text-[#E19508] prose-a:underline prose-a:underline-offset-2 prose-a:hover:text-[#f0a820] prose-img:rounded-xl prose-img:my-8 prose-img:mx-auto prose-img:max-w-full prose-img:h-auto prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-li:text-white/70 prose-li:leading-relaxed prose-li:mb-2 prose-strong:text-white prose-strong:font-bold prose-em:text-white/90 prose-blockquote:border-l-[#E19508] prose-blockquote:bg-[#E19508]/5 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-white/80 prose-blockquote:text-lg prose-hr:border-[#E19508]/15 prose-hr:my-10"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    );
  }

  // ── Priority 3: Legacy blocks (migration fallback) ───────────────
  if (blocks && blocks.length > 0) {
    return (
      <div className="mx-auto max-w-[800px] space-y-6 text-white antialiased selection:bg-[#980140]/40 selection:text-white">
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

          if (!block.text) return null;

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
            <p key={block.id} className={`text-base leading-[1.8] text-white/70 ${structuralStyle}`}>
              {block.text}
            </p>
          );
        })}
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────
  return null;
}