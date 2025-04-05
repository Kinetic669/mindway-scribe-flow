
"use client";

import { Button } from "@/components/ui/button";
import { EyeOff, Clock, Calendar } from "lucide-react";
import { SessionTimer } from "../SessionTimer";

type MiniTimelineHeaderProps = {
  onToggleVisibility: () => void;
  showTimeFormat: boolean;
  onTimeFormatChange: () => void;
  sessionStartTime: Date;
  sessionDuration: number;
};

export const MiniTimelineHeader = ({
  onToggleVisibility,
  showTimeFormat,
  onTimeFormatChange,
  sessionStartTime,
  sessionDuration
}: MiniTimelineHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium">Oś czasu sesji</h3>
      <div className="flex items-center gap-2">
        <SessionTimer 
          sessionDuration={sessionDuration} 
          sessionStartTime={sessionStartTime}
        />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onTimeFormatChange}
          className="h-6 w-6 p-0"
        >
          {showTimeFormat ? <Clock size={14} /> : <Calendar size={14} />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleVisibility}
          className="h-6 w-6 p-0"
        >
          <EyeOff size={14} />
        </Button>
      </div>
    </div>
  );
};
