
"use client";

import { Note } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  MessageSquare, 
  Brain, 
  Pencil,
  FileText, 
  Eye, 
  CheckSquare,
  Calendar,
  Lightbulb,
  Circle,
  Dumbbell,
  Book,
  Heart,
  Activity,
  AlertTriangle,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

type TimelinePointProps = {
  note: Note;
  showMinutes: boolean;
  timeKey: string;
  onNoteClick: (noteId: string) => void;
};

export const TimelinePoint = ({ note, showMinutes, timeKey, onNoteClick }: TimelinePointProps) => {
  // Special note type detection
  const isDrawing = note.content.startsWith("data:image") || note.type.name.toLowerCase().includes("rysunek");
  const isExercise = note.type.name.toLowerCase().includes("ćwiczenie") || note.content.toLowerCase().includes("rozpoczęto ćwiczenie");
  const isPlanningNote = note.type.name.toLowerCase().includes("planowanie");
  
  // Get icon based on note type
  const getIcon = () => {
    if (isDrawing) return <Pencil className="h-3 w-3" />;
    if (isExercise) return <Brain className="h-3 w-3" />;
    if (isPlanningNote) return <Calendar className="h-3 w-3" />;
    
    return null;
  };

  // Only special types should be displayed with an icon
  const shouldShowIcon = isDrawing || isExercise || isPlanningNote;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            style={{ 
              backgroundColor: shouldShowIcon ? 'transparent' : note.type.color,
              borderColor: note.type.color,
            }}
            className={cn(
              "w-5 h-5 rounded-full flex-shrink-0 transform transition-transform duration-200 hover:scale-125 flex items-center justify-center",
              shouldShowIcon ? "border-2" : "",
              "cursor-pointer"
            )}
            onClick={() => onNoteClick(note.id)}
          >
            {shouldShowIcon && (
              <div className="text-[10px] text-center" style={{ color: note.type.color }}>
                {getIcon()}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {showMinutes ? `Minuta sesji: ${timeKey}` : `Czas: ${timeKey}`}
          </p>
          <p>Typ: {note.type.name}</p>
          {isDrawing ? 
            <p>Rysunek</p> : 
            note.content.length > 30 ? `${note.content.substring(0, 30)}...` : note.content
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
