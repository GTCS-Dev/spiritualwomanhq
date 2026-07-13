"use client";

import { useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import UnderlineExtension from "@tiptap/extension-underline";
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from "lucide-react";

type RichTextEditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

type MenuButtonProps = {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
};

function MenuButton({ onClick, active = false, title, children }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded-lg p-2 text-xs transition-all duration-200 ${
        active
          ? "bg-[#980140] text-white shadow-[0_2px_8px_-4px_rgba(152,1,64,0.4)]"
          : "text-white/70 hover:bg-[#980140]/15 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#E19508] underline underline-offset-2 hover:text-[#f0a820]",
        },
      }),
      ImageExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-xl my-4 mx-auto",
        },
      }),
      UnderlineExtension,
    ],
    content: content || "",
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-4 text-sm leading-relaxed text-white/90",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL", "https://");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Create a temporary URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      editor.chain().focus().setImage({ src: dataUrl }).run();
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = "";
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-[#E19508]/15 bg-[#001233]/50 p-4">
        <p className="text-sm text-white/50">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#E19508]/15 bg-[#001233]/50 overflow-hidden">
      {/* ── EDITOR TOOLBAR ── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E19508]/10 bg-[#001946]/60 px-3 py-2">
        <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
          <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">
            <Bold size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">
            <Italic size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">
            <Underline size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
            <Heading1 size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
            <Heading2 size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
            <Heading3 size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
            <List size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
            <ListOrdered size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
          <MenuButton onClick={setLink} active={editor.isActive("link")} title="Insert Link">
            <LinkIcon size={16} />
          </MenuButton>
          <MenuButton onClick={() => fileInputRef.current?.click()} title="Insert Image">
            <ImageIcon size={16} />
          </MenuButton>
        </div>

        <div className="flex items-center gap-0.5">
          <MenuButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo size={16} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo size={16} />
          </MenuButton>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* ── EDITOR BODY ── */}
      <EditorContent editor={editor} />
    </div>
  );
}