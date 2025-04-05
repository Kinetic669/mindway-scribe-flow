
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
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

type TimelinePointProps = {
  note: Note;
  showMinutes: boolean;
  timeKey: string;
  onNoteClick: (noteId: string) => void;
};

export const TimelinePoint = ({ note, showMinutes, timeKey, onNoteClick }: TimelinePointProps) => {
  const isDrawing = note.content.startsWith("data:image") || note.type.name.toLowerCase().includes("rysunek");
  const isExercise = note.type.name.toLowerCase().includes("ćwiczenie") || 
                    note.type.name.toLowerCase().includes("zadanie");
  const isPlanning = note.type.name.toLowerCase().includes("planowanie");
  const isReflection = note.type.name.toLowerCase().includes("refleksja");
  
  // Get icon based on note type
  const getIcon = () => {
    if (isDrawing) return <Pencil className="h-3 w-3" />;
    if (isExercise) return <Brain className="h-3 w-3" />;
    if (isPlanning) return <Calendar className="h-3 w-3" />;
    if (isReflection) return <Brain className="h-3 w-3" />;
    
    const typeName = note.type.name.toLowerCase();
    
    if (typeName.includes('wypowiedź')) return <MessageSquare className="h-3 w-3" />;
    if (typeName.includes('spostrzeżenie')) return <Lightbulb className="h-3 w-3" />;
    if (typeName.includes('obserwacja')) return <Eye className="h-3 w-3" />;
    
    return null;
  };

  const isSpecialType = isDrawing || isExercise || isPlanning || isReflection;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            style={{ 
              backgroundColor: isSpecialType ? 'transparent' : note.type.color,
              borderColor: note.type.color,
            }}
            className={cn(
              "w-5 h-5 rounded-full flex-shrink-0 transform transition-transform duration-200 hover:scale-125 flex items-center justify-center",
              isSpecialType ? "border-2" : "",
              "cursor-pointer"
            )}
            onClick={() => onNoteClick(note.id)}
          >
            {isSpecialType && (
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
