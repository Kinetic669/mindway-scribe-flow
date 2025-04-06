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
  variant?: 'client-quote' | 'therapist-insight' | 'observation' | 'action-item' | 'reflection' | 'question' | 'progress-note';
};

const colors = {
  'client-quote': 'rgb(59, 130, 246)',
  'therapist-insight': 'rgb(16, 185, 129)',
  'observation': 'rgb(99, 102, 241)',
  'action-item': 'rgb(239, 68, 68)',
  'reflection': 'rgb(245, 158, 11)',
  'question': 'rgb(139, 92, 246)',
  'progress-note': 'rgb(6, 182, 212)'
};

export function RichTextEditor({
  content,
  onChange,
  onKeyDown,
  placeholder = "Start typing...",
  className = "",
  variant = "therapist-insight"
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

  const color = colors[variant];

  return (
    <div 
      className={cn("relative rounded-md border", className)} 
      style={{ 
        borderColor: color.replace('rgb', 'rgba').replace(')', ', 0.4)'),
        boxShadow: `0 0 0 1px ${color.replace('rgb', 'rgba').replace(')', ', 0.2)')}`
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