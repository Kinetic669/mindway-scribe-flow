"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  color?: string;
};

export function RichTextEditor({
  content,
  onChange,
  onKeyDown,
  placeholder = "Start typing...",
  className = "",
  color
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none px-12 py-3 min-h-[100px]",
      },
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={cn("relative rounded-md border", className)} 
      style={{ 
        borderColor: color ? `${color}40` : undefined,
        boxShadow: color ? `0 0 0 1px ${color}20` : undefined
      }}
    >
      <div className="flex items-center gap-2 p-2 pl-12 border-b toolbar">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-9 w-9 p-0 hover:bg-transparent", editor.isActive("bold") && "bg-muted")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-9 w-9 p-0 hover:bg-transparent", editor.isActive("italic") && "bg-muted")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-9 w-9 p-0 hover:bg-transparent", editor.isActive("bulletList") && "bg-muted")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>
      <EditorContent editor={editor} onKeyDown={onKeyDown} />
    </div>
  );
} 