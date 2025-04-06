"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Underline as UnderlineIcon,
  Strikethrough
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Alignment from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect } from "react";

type RichTextEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  color?: string;
  shouldClear?: boolean;
};

export function RichTextEditor({
  content,
  onChange,
  onKeyDown,
  placeholder = "Start typing...",
  className = "",
  color,
  shouldClear = false
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 my-4',
          },
        },
      }),
      Alignment.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
      }),
      Underline
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none px-4 pb-14 pt-3 min-h-[100px] prose prose-sm max-w-none prose-headings:mt-4 prose-headings:mb-2",
      },
    }
  });

  useEffect(() => {
    if (editor && content === "") {
      editor.commands.clearContent();
    }
  }, [content, editor]);

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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive("underline") && "bg-opacity-20"
          )}
          style={editor.isActive("underline") ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive("strike") && "bg-opacity-20"
          )}
          style={editor.isActive("strike") ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-5 w-5" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive("heading", { level: 1 }) && "bg-opacity-20"
          )}
          style={editor.isActive("heading", { level: 1 }) ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive("heading", { level: 2 }) && "bg-opacity-20"
          )}
          style={editor.isActive("heading", { level: 2 }) ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive("heading", { level: 3 }) && "bg-opacity-20"
          )}
          style={editor.isActive("heading", { level: 3 }) ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-5 w-5" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 hover:bg-transparent",
            editor.isActive("blockquote") && "bg-opacity-20"
          )}
          style={editor.isActive("blockquote") ? { backgroundColor: `${color}20` } : undefined}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-5 w-5" />
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