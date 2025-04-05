
"use client";

import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MiniTimelineHeader } from "./MiniTimelineHeader";

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
  const getMinutesSinceStart = (timestamp: Date) => {
    return Math.floor((timestamp.getTime() - sessionStartTime.getTime()) / 60000);
  };

  // Group notes by hour or minutes
  const groupedNotes: Record<string, Note[]> = {};
  
  notes.forEach(note => {
    let key;
    if (showMinutes) {
      const minutes = getMinutesSinceStart(note.timestamp);
      key = `${minutes}`;
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
      const minutesA = parseInt(a);
      const minutesB = parseInt(b);
      return minutesA - minutesB;
    } else {
      const [hourA, minuteA] = a.split(':').map(Number);
      const [hourB, minuteB] = b.split(':').map(Number);
      if (hourA !== hourB) return hourA - hourB;
      return minuteA - minuteB;
    }
  });

  return (
    <div className="bg-white shadow-sm rounded-md p-2 mb-4 w-full">
      <MiniTimelineHeader 
        onToggleVisibility={onToggleVisibility}
        showTimeFormat={showMinutes}
        onTimeFormatChange={() => setShowMinutes(!showMinutes)}
        sessionStartTime={sessionStartTime}
        sessionDuration={sessionDuration}
      />
      
      <div className="overflow-x-auto">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 no-scrollbar">
          {sortedTimes.map(time => (
            <div key={time} className="flex flex-col items-center">
              <div className="flex flex-wrap gap-1 mt-1">
                {groupedNotes[time].map(note => (
                  <TooltipProvider key={note.id}>
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
                          {showMinutes ? `Minuta sesji: ${time}` : 
                            `Czas: ${time}`}
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
