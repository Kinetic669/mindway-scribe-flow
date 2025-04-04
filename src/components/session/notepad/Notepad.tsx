
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { NoteType } from "@/types";
import { noteTypes } from "@/data/mockData";
import { NoteTypeSelector } from "./NoteTypeSelector";
import { NoteInput } from "./NoteInput";
import { NotepadActions } from "./NotepadActions";

type NotepadProps = {
  onAddNote: (content: string, type: NoteType) => void;
  onToggleDrawing: () => void;
};

export const Notepad = ({ onAddNote, onToggleDrawing }: NotepadProps) => {
  const [noteContent, setNoteContent] = useState("");
  const [selectedType, setSelectedType] = useState<NoteType>(noteTypes[0]);

  const handleSubmit = () => {
    if (noteContent.trim() === "") return;
    
    onAddNote(noteContent, selectedType);
    setNoteContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "/" && noteContent === "") {
      // Open type selector on / key when textarea is empty
      e.preventDefault();
      const dropdownTrigger = document.querySelector("[data-note-type-selector]") as HTMLButtonElement;
      if (dropdownTrigger) dropdownTrigger.click();
    }
  };

  return (
    <Card className="p-4 mb-4 border rounded-lg shadow-sm">
      <NoteTypeSelector 
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
        <span>Wskazówka: Wpisz / aby szybko wybrać typ notatki</span>
        <span>Naciśnij Ctrl+Enter aby wysłać</span>
      </div>
    </Card>
  );
};
