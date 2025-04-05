
import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Clock, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type MinimalTimelineProps = {
  notes: Note[];
  visible: boolean;
  onToggleVisibility: () => void;
  onNoteClick: (noteId: string) => void;
  sessionDuration: number;
  sessionStartTime: Date;
};

export const MinimalTimeline = ({ 
  notes, 
  visible, 
  onToggleVisibility, 
  onNoteClick,
  sessionDuration,
  sessionStartTime
}: MinimalTimelineProps) => {
  const [showMinutes, setShowMinutes] = useState(true);

  if (!visible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToggleVisibility}
      >
        <Eye size={16} className="mr-2" />
        <span>Pokaż mini oś czasu</span>
      </Button>
    );
  }
  
  // Calculate minutes since session start
  const sessionStartTimeMs = notes.length > 0 ? 
    Math.min(...notes.map(note => note.timestamp.getTime())) : 
    sessionStartTime.getTime();
  
  const getMinutesSinceStart = (timestamp: Date) => {
    return Math.floor((timestamp.getTime() - sessionStartTimeMs) / 60000);
  };

  // Group notes by hour or minutes
  const groupedNotes: Record<string, Note[]> = {};
  
  notes.forEach(note => {
    let key;
    if (showMinutes) {
      const minutes = getMinutesSinceStart(note.timestamp);
      key = `${minutes} min`;
    } else {
      const hour = note.timestamp.getHours();
      const minute = note.timestamp.getMinutes();
      key = `${hour}:${minute < 10 ? '0' + minute : minute}`;
    }
    
    if (!groupedNotes[key]) {
      groupedNotes[key] = [];
    }
    
    groupedNotes[key].push(note);
  });

  // Sort times
  const sortedTimes = Object.keys(groupedNotes).sort((a, b) => {
    if (showMinutes) {
      const minutesA = parseInt(a.split(' ')[0]);
      const minutesB = parseInt(b.split(' ')[0]);
      return minutesA - minutesB;
    } else {
      const [hourA, minuteA] = a.split(':').map(Number);
      const [hourB, minuteB] = b.split(':').map(Number);
      if (hourA !== hourB) return hourA - hourB;
      return minuteA - minuteB;
    }
  });

  const handleFormatToggle = () => {
    setShowMinutes(!showMinutes);
  };

  return (
    <div className="bg-white shadow-sm rounded-md p-2 mb-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Mini oś czasu</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleFormatToggle}
            className="h-6 px-2 text-xs"
          >
            {showMinutes ? <Clock size={14} className="mr-1" /> : <Calendar size={14} className="mr-1" />}
            {showMinutes ? "Pokaż godziny" : "Pokaż minuty sesji"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleVisibility}
            className="h-6 w-6 p-0"
          >
            <EyeOff size={14} />
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar">
          {sortedTimes.map(time => (
            <div key={time} className="flex flex-col items-center">
              {/* Time label omitted as requested */}
              <div className="flex flex-col items-center space-y-1">
                {groupedNotes[time].map(note => (
                  <TooltipProvider key={note.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          style={{ 
                            backgroundColor: note.type.color,
                            cursor: 'pointer'
                          }}
                          className="w-4 h-4 rounded-full flex-shrink-0 hover:scale-125 transition-transform"
                          onClick={() => onNoteClick(note.id)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {showMinutes ? `Minuta sesji: ${getMinutesSinceStart(note.timestamp)}` : 
                            `Czas: ${note.timestamp.getHours()}:${note.timestamp.getMinutes() < 10 ? '0' : ''}${note.timestamp.getMinutes()}`}
                        </p>
                        <p>Typ: {note.type.name}</p>
                        {note.content.length > 30 ? `${note.content.substring(0, 30)}...` : note.content}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
