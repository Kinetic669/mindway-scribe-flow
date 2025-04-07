
"use client";

import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { TimelinePoint } from "./TimelinePoint";
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
    return null;
  }

  // Helper to get the time key based on current format preference
  const getTimeKey = (timestamp: Date) => {
    if (showMinutes) {
      // Get minutes since session start
      const minutesSinceStart = Math.floor(
        (timestamp.getTime() - sessionStartTime.getTime()) / 60000
      );
      return minutesSinceStart.toString();
    } else {
      // Format as HH:MM
      return timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Group notes by time key
  const groupedNotes: Record<string, Note[]> = {};
  notes.forEach((note) => {
    const timeKey = getTimeKey(note.timestamp);
    if (!groupedNotes[timeKey]) {
      groupedNotes[timeKey] = [];
    }
    groupedNotes[timeKey].push(note);
  });

  // Get sorted time keys
  const sortedTimes = Object.keys(groupedNotes).sort((a, b) => {
    // If showing minutes, compare as numbers
    if (showMinutes) {
      return parseInt(a) - parseInt(b);
    }
    
    // Otherwise compare as time strings
    const timeA = a.split(':').map(Number);
    const timeB = b.split(':').map(Number);
    
    // Compare hours first
    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0];
    }
    
    // Then compare minutes
    return timeA[1] - timeB[1];
  });

  // Filter out duplicate "Rozpoczęto ćwiczenie" notes that have the same exercise type
  // We only want to show one note per exercise start
  const filteredGroups: Record<string, Note[]> = {};
  
  sortedTimes.forEach(time => {
    const uniqueExerciseTypes = new Set<string>();
    
    filteredGroups[time] = groupedNotes[time].filter(note => {
      // If it's an exercise start note
      if (note.content.toLowerCase().includes('rozpoczęto ćwiczenie:')) {
        // Extract exercise type from content
        const exerciseType = note.content.split(':')[1]?.trim();
        
        // If we've seen this exercise type before, filter it out
        if (exerciseType && uniqueExerciseTypes.has(exerciseType)) {
          return false;
        }
        
        // Otherwise, mark it as seen and keep it
        if (exerciseType) {
          uniqueExerciseTypes.add(exerciseType);
        }
      }
      
      return true;
    });
  });

  const handleFormatToggle = () => {
    setShowMinutes(!showMinutes);
  };

  return (
    <div className="w-full mb-2">
      <MiniTimelineHeader 
        onToggleVisibility={onToggleVisibility} 
        showTimeFormat={showMinutes}
        onTimeFormatChange={handleFormatToggle}
      />
      
      <div className="overflow-x-auto w-full scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex items-center gap-3 py-3 px-1" 
             style={{ 
               display: 'flex',
               flexWrap: 'nowrap',
               width: 'max-content'
             }}>
          {sortedTimes.map(time => (
            <div key={time} className="flex flex-col items-center" style={{ flexShrink: 0 }}>
              <div className="flex flex-col items-center gap-1.5">
                {filteredGroups[time].map(note => (
                  <TimelinePoint
                    key={note.id}
                    note={note}
                    timeKey={time}
                    showMinutes={showMinutes}
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
