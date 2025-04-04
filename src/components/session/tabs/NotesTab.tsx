
"use client";

import { Note, NoteType } from "@/types";
import { Notepad } from "../notepad/Notepad";
import { Timeline } from "../timeline/Timeline";

type NotesTabProps = {
  notes: Note[];
  onAddNote: (content: string, type: NoteType) => void;
  onDeleteNote: (id: string) => void;
  onToggleDrawing: () => void;
};

export const NotesTab = ({ 
  notes, 
  onAddNote, 
  onDeleteNote, 
  onToggleDrawing 
}: NotesTabProps) => {
  return (
    <div className="space-y-4">
      <Notepad 
        onAddNote={onAddNote} 
        onToggleDrawing={onToggleDrawing} 
      />
      <Timeline 
        notes={notes} 
        onDeleteNote={onDeleteNote} 
      />
    </div>
  );
};
