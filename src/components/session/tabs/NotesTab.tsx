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
  // Ensure pre-session notes appear first in timeline
  const sortedNotes = [...notes].sort((a, b) => {
    // Prioritize pre-session notes
    if (a.type.name === "Notatka z planowania") return -1;
    if (b.type.name === "Notatka z planowania") return 1;
    
    // Otherwise sort by timestamp (newest first)
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
