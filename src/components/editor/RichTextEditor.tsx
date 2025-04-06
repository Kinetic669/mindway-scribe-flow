"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot } from 'lexical';
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function RichTextEditor({
  content,
  onChange,
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
    <div className={cn("relative min-h-[100px] rounded-md border", className)} style={style}>
      <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[100px] px-3 py-2 focus:outline-none w-full"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                ...style,
              }}
            />
          }
          placeholder={
            <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
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