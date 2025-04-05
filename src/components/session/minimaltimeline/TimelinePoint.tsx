
"use client";

import { Note } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type TimelinePointProps = {
  note: Note;
  showMinutes: boolean;
  timeKey: string;
  onNoteClick: (noteId: string) => void;
};

export const TimelinePoint = ({ note, showMinutes, timeKey, onNoteClick }: TimelinePointProps) => {
  const isImage = note.content.includes("data:image");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            style={{ 
              backgroundColor: note.type.color,
              cursor: 'pointer'
            }}
            className="w-5 h-5 rounded-full flex-shrink-0 hover:scale-125 transition-transform"
            onClick={() => onNoteClick(note.id)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {showMinutes ? `Minuta sesji: ${timeKey}` : `Czas: ${timeKey}`}
          </p>
          <p>Typ: {note.type.name}</p>
          {isImage ? 
            <p>Rysunek</p> : 
            note.content.length > 30 ? `${note.content.substring(0, 30)}...` : note.content
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
