
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
    if (typeName.includes('zadanie')) return <CheckSquare className="h-3 w-3" />;
    if (typeName.includes('pytanie')) return <Circle className="h-3 w-3" />;
    if (typeName.includes('ćwiczenie fizyczne')) return <Dumbbell className="h-3 w-3" />;
    if (typeName.includes('notatka')) return <FileText className="h-3 w-3" />;
    if (typeName.includes('cel')) return <Bookmark className="h-3 w-3" />;
    if (typeName.includes('zagrożenie')) return <AlertTriangle className="h-3 w-3" />;
    if (typeName.includes('postęp')) return <Activity className="h-3 w-3" />;
    if (typeName.includes('zasoby')) return <Book className="h-3 w-3" />;
    if (typeName.includes('wzmocnienie')) return <Heart className="h-3 w-3" />;
    
    return <MessageSquare className="h-3 w-3" />;
  };

  // Every special type should be displayed with an icon
  const shouldShowIcon = isDrawing || isExercise || isPlanning || isReflection || 
                         note.type.name.toLowerCase().includes('cel') ||
                         note.type.name.toLowerCase().includes('zagrożenie') ||
                         note.type.name.toLowerCase().includes('postęp') ||
                         note.type.name.toLowerCase().includes('zasoby') ||
                         note.type.name.toLowerCase().includes('wzmocnienie');

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
