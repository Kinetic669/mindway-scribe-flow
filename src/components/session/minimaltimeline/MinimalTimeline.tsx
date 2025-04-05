
import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Clock, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MiniTimelineHeader } from "./MiniTimelineHeader";
import { TimelinePoint } from "./TimelinePoint";

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
        <span>Pokaż oś czasu</span>
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
      <MiniTimelineHeader
        onToggleVisibility={onToggleVisibility}
        showTimeFormat={showMinutes}
        onTimeFormatChange={handleFormatToggle}
      />
      
      <div className="overflow-x-auto">
        <div className="flex items-center overflow-x-auto py-3 px-1 no-scrollbar">
          {sortedTimes.map(time => (
            <div key={time} className="flex flex-col items-center min-w-6 mx-0.5">
              {/* Time label */}
              <div className="flex flex-col items-center space-y-1.5">
                {groupedNotes[time].map(note => (
                  <TimelinePoint 
                    key={note.id}
                    note={note}
                    showMinutes={showMinutes}
                    timeKey={time}
                    onNoteClick={onNoteClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
