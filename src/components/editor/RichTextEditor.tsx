"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Alignment from '@tiptap/extension-text-align';

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
      StarterKit,
      Alignment.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none px-4 pb-14 pt-3 min-h-[100px]",
      },
    }
  });

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={cn("relative rounded-md border focus-within:outline focus-within:outline-2 focus-within:outline-offset-2", className)} 
      style={{ 
        borderColor: color ? `${color}40` : undefined,
        boxShadow: color ? `0 0 0 1px ${color}20` : undefined,
        outlineColor: color ? `${color}40` : undefined
      }}
    >
      <div className="flex items-center gap-2 p-2 pl-11 border-b toolbar">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent", 
            editor.isActive("bold") && "bg-opacity-20"
          )}
          style={editor.isActive("bold") ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive("italic") && "bg-opacity-20"
          )}
          style={editor.isActive("italic") ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-5 w-5" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive({ textAlign: 'left' }) && "bg-opacity-20"
          )}
          style={editor.isActive({ textAlign: 'left' }) ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive({ textAlign: 'center' }) && "bg-opacity-20"
          )}
          style={editor.isActive({ textAlign: 'center' }) ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive({ textAlign: 'right' }) && "bg-opacity-20"
          )}
          style={editor.isActive({ textAlign: 'right' }) ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-5 w-5" />
        </Button>
      </div>
      <EditorContent editor={editor} onKeyDown={onKeyDown} />
    </div>
  );
} 