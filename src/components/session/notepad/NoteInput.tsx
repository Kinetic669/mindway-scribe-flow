
"use client";

import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { NoteType } from "@/types";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus textarea on component mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Focus textarea when note type changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selectedType]);

  return (
    <div className="relative">
      <div 
        className="absolute left-3 top-3 p-1 rounded-md"
        style={{ backgroundColor: `${selectedType.color}20` }}
      >
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: selectedType.color }}
        />
      </div>
      <Textarea 
        ref={textareaRef}
        placeholder={`Wpisz swoje ${selectedType.name.toLowerCase()} tutaj...`}
        className="min-h-[100px] resize-none pl-10 pr-16 py-3 focus-visible:ring-2"
        style={{ 
          borderColor: `${selectedType.color}40`,
          outlineColor: selectedType.color, 
          boxShadow: `0 0 0 1px ${selectedType.color}20`,
        }}
        value={noteContent}
        onChange={(e) => onContentChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button 
        className="absolute right-3 bottom-3"
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
