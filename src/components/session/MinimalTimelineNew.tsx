import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  EyeOff, 
  Clock, 
  Quote, 
  Lightbulb, 
  CheckSquare, 
  Brain, 
  HelpCircle, 
  Activity, 
  Book, 
  Pencil,
  Calendar 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type MinimalTimelineNewProps = {
  notes: Note[];
  visible: boolean;
  onToggleVisibility: () => void;
  onNoteClick: (noteId: string) => void;
};

export function MinimalTimelineNew({ notes, visible, onToggleVisibility, onNoteClick }: MinimalTimelineNewProps) {
  const [showMinutes, setShowMinutes] = useState(true);

  if (!visible) {
    return (
      <Button variant="outline" size="sm" onClick={onToggleVisibility}>
        <Eye className="h-4 w-4 mr-2" />
        Pokaż oś czasu
      </Button>
    );
  }

  // Get session start time for relative time calculations
  const sessionStartTime = notes.length > 0 
    ? Math.min(...notes.map(note => note.timestamp.getTime())) 
    : Date.now();

  const getTimeDisplay = (timestamp: Date) => {
    if (showMinutes) {
      const minutes = Math.floor((timestamp.getTime() - sessionStartTime) / 60000);
      return `${minutes} min`;
    }
    return timestamp.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper function to determine if note is a special type and get its icon
  const getNoteDisplay = (note: Note) => {
    const type = note.type.name.toLowerCase();
    
    // Special types with forced icons
    if (type.includes('rysunek')) {
      return {
        isSpecial: true,
        icon: <Pencil className="h-5 w-5" />
      };
    }
    
    if (type.includes('przed sesją') || type.includes('planowania')) {
      return {
        isSpecial: true,
        icon: <Calendar className="h-5 w-5" />
      };
    }
    
    if (type.includes('ćwiczenie')) {
      return {
        isSpecial: true,
        icon: <Brain className="h-5 w-5" />
      };
    }

    // Regular types with icons from type definition
    let icon;
    switch (note.type.icon) {
      case 'quote':
        icon = <Quote className="h-5 w-5" />;
        break;
      case 'lightbulb':
        icon = <Lightbulb className="h-5 w-5" />;
        break;
      case 'eye':
        icon = <Eye className="h-5 w-5" />;
        break;
      case 'check-square':
        icon = <CheckSquare className="h-5 w-5" />;
        break;
      case 'brain':
        icon = <Brain className="h-5 w-5" />;
        break;
      case 'help-circle':
        icon = <HelpCircle className="h-5 w-5" />;
        break;
      case 'activity':
        icon = <Activity className="h-5 w-5" />;
        break;
      case 'book':
        icon = <Book className="h-5 w-5" />;
        break;
      default:
        icon = <Quote className="h-5 w-5" />;
    }

    return {
      isSpecial: false,
      icon
    };
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-md p-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Mini oś czasu</span>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={() => setShowMinutes(!showMinutes)}
          >
            <Clock className="h-3 w-3 mr-1" />
            {showMinutes ? "Pokaż godziny" : "Pokaż minuty"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={onToggleVisibility}
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="w-full overflow-x-auto">
        <div className="flex gap-2 min-w-max py-2 px-4">
          {notes
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            .map(note => {
              const { isSpecial, icon } = getNoteDisplay(note);
              
              return (
                <TooltipProvider key={note.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-8 h-8 rounded-full cursor-pointer hover:scale-125 transition-transform flex items-center justify-center ${isSpecial ? 'border-2' : ''}`}
                        style={{ 
                          backgroundColor: isSpecial ? 'transparent' : note.type.color,
                          borderColor: isSpecial ? note.type.color : 'transparent',
                          color: isSpecial ? note.type.color : 'white'
                        }}
                        onClick={() => onNoteClick(note.id)}
                      >
                        {icon}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{note.type.name}</p>
                      <p className="text-sm text-gray-500">{getTimeDisplay(note.timestamp)}</p>
                      <p className="text-sm max-w-[200px] truncate">{note.content}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
        </div>
      </div>
    </div>
  );
} 