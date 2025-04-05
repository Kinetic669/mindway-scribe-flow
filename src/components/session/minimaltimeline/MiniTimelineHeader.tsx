
"use client";

import { Note } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EyeOff, Clock, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
          size="sm" 
          onClick={onTimeFormatChange}
          className="h-6 px-2 text-xs"
        >
          {showTimeFormat ? <Clock size={14} className="mr-1" /> : <Calendar size={14} className="mr-1" />}
          {showTimeFormat ? "Pokaż godziny" : "Pokaż minuty sesji"}
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
  );
};
