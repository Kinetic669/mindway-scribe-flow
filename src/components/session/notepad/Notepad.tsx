
"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { NoteType } from "@/types";
import { noteTypes } from "@/data/mockData";
import { NoteInput } from "./NoteInput";
import { NotepadActions } from "./NotepadActions";
import { NoteTypeSlider } from "./NoteTypeSlider";

type NotepadProps = {
  onAddNote: (content: string, type: NoteType) => void;
  onToggleDrawing: () => void;
};

export const Notepad = ({ onAddNote, onToggleDrawing }: NotepadProps) => {
  const [noteContent, setNoteContent] = useState("");
  const [selectedType, setSelectedType] = useState<NoteType>(noteTypes[0]);
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

  const handleSubmit = () => {
    if (noteContent.trim() === "") return;
    
    onAddNote(noteContent, selectedType);
    setNoteContent("");
    
    // Re-focus textarea after submission
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "/" && noteContent === "") {
      // Open type selector on / key when textarea is empty
      e.preventDefault();
      // Since we're using the slider now, we could do something else here
    }
  };

  return (
    <Card className="p-4 mb-4 border rounded-lg shadow-sm">
      <NoteTypeSlider 
        noteTypes={noteTypes} 
        selectedType={selectedType} 
        onTypeChange={setSelectedType} 
      />
      
      <NotepadActions 
        selectedType={selectedType} 
        onToggleDrawing={onToggleDrawing} 
      />
      
      <div className="mt-3">
        <NoteInput 
          noteContent={noteContent}
          selectedType={selectedType}
          onContentChange={setNoteContent}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex justify-between px-1">
        <span>Wskazówka: Przesuń w lewo/prawo aby wybrać typ notatki</span>
        <span>Naciśnij Ctrl+Enter aby wysłać</span>
      </div>
    </Card>
  );
};
