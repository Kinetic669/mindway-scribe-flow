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
    // Skip duplicate exercise notes - only keep summary results
    if (note.content.includes("Rozpoczęto ćwiczenie:")) {
      // Check if there's already a result note for this exercise
      const exerciseType = note.content.split(": ")[1];
      const hasResultNote = notes.some(n => 
        n.id !== note.id && 
        (n.content.includes(`wykonał ćwiczenie`) || 
         n.content.includes(`zidentyfikował emocję`) ||
         n.content.includes(`Refleksja klienta`)) &&
        n.timestamp > note.timestamp
      );
      
      // If there's a result, skip this "started exercise" note
      if (hasResultNote) return;
    }

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
      
      <div className="overflow-x-auto w-full">
        <div className="flex items-start flex-nowrap overflow-x-auto py-3 px-1 min-w-full" 
             style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {sortedTimes.map(time => (
            <div key={time} className="flex flex-col items-center min-w-[50px] mx-1 flex-shrink-0">
              <div className="text-xs text-gray-500 mb-1">{time}</div>
              <div className="flex flex-col items-center gap-1.5">
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
