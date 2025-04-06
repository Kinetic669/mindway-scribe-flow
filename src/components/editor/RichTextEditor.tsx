"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode } from 'lexical';
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type RichTextEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
};

function EditorContent({ content, onKeyDown }: { content?: string, onKeyDown?: (e: React.KeyboardEvent) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content === "") {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        root.append($createParagraphNode());
      });
    }
  }, [content, editor]);

  return (
    <ContentEditable
      className="min-h-[100px] w-full rounded-md border px-3 py-2 focus:outline-none focus-visible:ring-0"
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        paddingLeft: "2.5rem",
        paddingRight: "4rem",
        paddingBottom: "2.5rem",
      }}
      onKeyDown={onKeyDown}
    />
  );
}

export function RichTextEditor({
  content,
  onChange,
  onKeyDown,
  placeholder = "Start typing...",
  className = "",
  style = {},
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    onError: (error: Error) => {
      console.error(error);
    },
  };

  return (
    <div className={cn("relative", className)} style={style}>
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <EditorContent content={content} onKeyDown={onKeyDown} />
          }
          placeholder={
            <div className="absolute top-[11px] left-[2.5rem] text-muted-foreground pointer-events-none">
              {placeholder}
            </div>
          }
          ErrorBoundary={() => null}
        />
        <OnChangePlugin
          onChange={(editorState) => {
            if (onChange) {
              editorState.read(() => {
                const root = $getRoot();
                const text = root.getTextContent();
                onChange(text);
              });
            }
          }}
        />
      </LexicalComposer>
    </div>
  );
} 