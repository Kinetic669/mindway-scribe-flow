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
  // Sort notes by timestamp (newest first)
  const sortedNotes = [...notes].sort((a, b) => {
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="space-y-5">
      <Notepad 
        onAddNote={onAddNote} 
        onToggleDrawing={onToggleDrawing} 
      />
      <Timeline 
        notes={sortedNotes} 
        onDeleteNote={onDeleteNote}
        title="Oś czasu sesji"
      />
    </div>
  );
};
