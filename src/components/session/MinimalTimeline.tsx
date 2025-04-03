
import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type MinimalTimelineProps = {
  notes: Note[];
  visible: boolean;
  onToggleVisibility: () => void;
};

export const MinimalTimeline = ({ notes, visible, onToggleVisibility }: MinimalTimelineProps) => {
  if (!visible) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className="fixed top-20 right-4 z-10"
        onClick={onToggleVisibility}
      >
        <Eye size={16} className="mr-2" />
        <span>Pokaż oś czasu</span>
      </Button>
    );
  }

  // Group notes by hour
  const groupedNotes: Record<string, Note[]> = {};
  
  notes.forEach(note => {
    const hour = note.timestamp.getHours();
    const key = `${hour}:00`;
    
    if (!groupedNotes[key]) {
      groupedNotes[key] = [];
    }
    
    groupedNotes[key].push(note);
  });

  // Sort times
  const sortedTimes = Object.keys(groupedNotes).sort((a, b) => {
    const hourA = parseInt(a.split(':')[0]);
    const hourB = parseInt(b.split(':')[0]);
    return hourA - hourB;
  });

  const handleNoteClick = (noteType: string) => {
    toast.info(`Notatka typu: ${noteType}`);
  };

  return (
    <div className="fixed top-20 right-4 bg-white shadow-md rounded-md p-3 z-10 max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Przebieg sesji</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggleVisibility}
          className="h-6 w-6 p-0"
        >
          <EyeOff size={16} />
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex flex-col space-y-1">
          {sortedTimes.map(time => (
            <div key={time} className="flex items-center">
              <span className="text-xs font-medium text-gray-500 w-10">{time}</span>
              <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                {groupedNotes[time].map(note => (
                  <div 
                    key={note.id}
                    style={{ 
                      backgroundColor: note.type.color,
                      cursor: 'pointer'
                    }}
                    className="w-4 h-4 rounded-full flex-shrink-0 hover:scale-125 transition-transform"
                    onClick={() => handleNoteClick(note.type.name)}
                    title={note.type.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t">
        <div className="text-xs text-gray-500">Legenda:</div>
        <div className="flex flex-wrap gap-2 mt-1">
          {Array.from(new Set(notes.map(note => note.type.name))).map((typeName, index) => {
            const typeColor = notes.find(note => note.type.name === typeName)?.type.color || '#ccc';
            return (
              <div key={index} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: typeColor }}
                />
                <span className="text-xs">{typeName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
