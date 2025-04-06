"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { NoteType } from "@/types";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

type NoteInputProps = {
  noteContent: string;
  selectedType: NoteType;
  onContentChange: (content: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
};

export const NoteInput = ({ 
  noteContent, 
  selectedType, 
  onContentChange, 
  onSubmit, 
  onKeyDown 
}: NoteInputProps) => {
  return (
    <div className="relative">
      <div 
        className="absolute left-3 top-3 p-1 rounded-md z-10"
        style={{ backgroundColor: `${selectedType.color}20` }}
      >
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: selectedType.color }}
        />
      </div>
      <RichTextEditor
        content={noteContent}
        onChange={onContentChange}
        placeholder={`Wpisz swoje ${selectedType.name.toLowerCase()} tutaj...`}
        className="pl-10 pr-16"
        style={{ 
          borderColor: `${selectedType.color}40`,
          outlineColor: selectedType.color, 
          boxShadow: `0 0 0 1px ${selectedType.color}20`,
        }}
      />
      <Button 
        className="absolute right-3 bottom-3 z-10"
        size="sm"
        onClick={onSubmit}
        disabled={noteContent.trim() === ""}
        style={{ 
          backgroundColor: selectedType.color,
          borderColor: selectedType.color
        }}
      >
        <Send size={16} className="mr-1" /> Wyślij
      </Button>
    </div>
  );
};
