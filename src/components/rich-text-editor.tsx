"use client";

import { useCallback, useRef, useMemo, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import UnderlineExtension from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extensions/placeholder";
import {
  Bold, Italic, Underline, List, ListOrdered,
  Heading1, Heading2, Heading3, Quote,
  Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, Minus, Code, Strikethrough,
  FileText, Type
} from "lucide-react";
import type { TipTapDocument } from "@/types/blog";

// ─── Types ─────────────────────────────────────────────────────────

type RichTextEditorProps = {
  initialJson?: TipTapDocument | null;
  initialHtml?: string;
  onChange: (json: TipTapDocument | null, html: string) => void;
  placeholder?: string;
  minHeight?: number;
};

// ─── Toolbar Button ────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  active = false,
  title,
  children,
  disabled = false,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      title={title}
      disabled={disabled}
      className={`rounded-lg p-2 text-xs transition-all duration-200 ${
        active
          ? "bg-[#980140] text-white shadow-[0_2px_8px_-4px_rgba(152,1,64,0.4)]"
          : "text-white/70 hover:bg-[#980140]/15 hover:text-white"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

// ─── Toolbar Divider ───────────────────────────────────────────────

function ToolbarDivider() {
  return <div className="h-5 w-px bg-white/10 mx-1" />;
}

// ─── Main Component ────────────────────────────────────────────────

export function RichTextEditor({
  initialJson,
  initialHtml,
  onChange,
  placeholder = "Start writing...",
  minHeight = 400,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // ── Parse initial content ──────────────────────────────────────
  const initialContent = useMemo(() => {
    if (initialJson) return initialJson;
    if (initialHtml && initialHtml !== "<p></p>") {
      try {
        const parsed = JSON.parse(initialHtml) as TipTapDocument;
        if (parsed.type === "doc") return parsed;
      } catch {
        return initialHtml;
      }
    }
    return { type: "doc" as const, content: [] };
  }, [initialJson, initialHtml]);

  // ── Editor Instance ────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        blockquote: {} as Record<string, unknown>,
        horizontalRule: {} as Record<string, unknown>,
        code: {} as Record<string, unknown>,
        codeBlock: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#E19508] underline underline-offset-2 hover:text-[#f0a820] cursor-pointer",
        },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-xl my-4 mx-auto",
        },
      }),
      UnderlineExtension,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON() as TipTapDocument;
      const html = ed.getHTML();
      onChange(json, html);

      const text = ed.state.doc.textContent;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      setCharCount(text.length);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-5 text-base leading-relaxed text-white/90",
      },
    },
  });

  // ── Sync external content changes ──────────────────────────────
  useEffect(() => {
    if (!editor) return;
    const currentJson = JSON.stringify(editor.getJSON());
    const newJson = JSON.stringify(initialContent);
    if (currentJson !== newJson && typeof initialContent !== "string") {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // ── Handlers ───────────────────────────────────────────────────

  const handleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const handleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const handleUnderline = useCallback(() => {
    editor?.chain().focus().toggleUnderline().run();
  }, [editor]);

  const handleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
  }, [editor]);

  const handleCode = useCallback(() => {
    editor?.chain().focus().toggleCode().run();
  }, [editor]);

  const handleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      editor?.chain().focus().toggleHeading({ level }).run();
    },
    [editor],
  );

  const handleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
  }, [editor]);

  const handleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const handleBlockquote = useCallback(() => {
    editor?.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const handleHorizontalRule = useCallback(() => {
    editor?.chain().focus().setHorizontalRule().run();
  }, [editor]);

  const handleLinkOpen = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setIsLinkDialogOpen(true);
  }, [editor]);

  const handleLinkSet = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const handleLinkRemove = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  }, [editor]);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || !editor) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        editor.chain().focus().setImage({ src: dataUrl }).run();
      };
      reader.readAsDataURL(file);
      event.target.value = "";
    },
    [editor],
  );

  const handleClearFormatting = useCallback(() => {
    editor?.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  // ── Loading State ──────────────────────────────────────────────
  if (!editor) {
    return (
      <div
        className="rounded-xl border border-[#E19508]/15 bg-[#001233]/50 p-8 flex items-center justify-center"
        style={{ minHeight }}
      >
        <div className="flex items-center gap-3 text-white/50">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#E19508] border-t-transparent" />
          <span className="text-sm">Loading editor...</span>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div
      className="rounded-xl border border-[#E19508]/15 bg-[#001233]/50 overflow-hidden"
      style={{ minHeight }}
    >
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E19508]/10 bg-[#001946]/60 px-3 py-2 sticky top-0 z-10">
        {/* Text Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={handleBold} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={handleItalic} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={handleUnderline} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
            <Underline size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={handleStrike} active={editor.isActive("strike")} title="Strikethrough">
            <Strikethrough size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={handleCode} active={editor.isActive("code")} title="Inline Code">
            <Code size={15} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => handleHeading(1)}
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleHeading(2)}
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleHeading(3)}
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={15} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Lists & Block Elements */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={handleBulletList} active={editor.isActive("bulletList")} title="Bullet List">
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={handleOrderedList} active={editor.isActive("orderedList")} title="Numbered List">
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={handleBlockquote} active={editor.isActive("blockquote")} title="Blockquote">
            <Quote size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={handleHorizontalRule} title="Horizontal Rule">
            <Minus size={15} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Links & Media */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={handleLinkOpen} active={editor.isActive("link")} title="Insert Link">
            <LinkIcon size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Insert Image">
            <ImageIcon size={15} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo (Ctrl+Z)">
            <Undo size={15} />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo (Ctrl+Y)">
            <Redo size={15} />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        {/* Clear Formatting */}
        <ToolbarButton onClick={handleClearFormatting} title="Clear Formatting">
          <Type size={15} />
        </ToolbarButton>

        {/* Word Count Badge */}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <FileText size={11} />
            {wordCount} words
          </span>
          <span>{charCount} chars</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* ── Link Dialog ─────────────────────────────────────────── */}
      {isLinkDialogOpen && (
        <div className="border-b border-[#E19508]/10 bg-[#001946]/80 px-4 py-3">
          <div className="flex items-center gap-3">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 rounded-lg border border-[#E19508]/20 bg-[#001233]/80 px-3 py-1.5 text-sm text-white outline-none focus:border-[#E19508]/60 placeholder:text-white/40"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLinkSet();
                if (e.key === "Escape") setIsLinkDialogOpen(false);
              }}
            />
            <button
              type="button"
              onClick={handleLinkSet}
              className="rounded-lg bg-[#980140] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#7c0134]"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleLinkRemove}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/10"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={() => setIsLinkDialogOpen(false)}
              className="rounded-lg px-3 py-1.5 text-xs text-white/60 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Editor Content ──────────────────────────────────────── */}
      <div className="relative">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}