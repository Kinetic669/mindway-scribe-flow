
"use client";

import { Button } from "@/components/ui/button";
import { EyeOff, Clock, Calendar } from "lucide-react";

type MiniTimelineHeaderProps = {
  onToggleVisibility: () => void;
  showTimeFormat: boolean;
  onTimeFormatChange: () => void;
};

export const MiniTimelineHeader = ({
  onToggleVisibility,
  showTimeFormat,
  onTimeFormatChange
}: MiniTimelineHeaderProps) => {
  return (
    <div className="flex justify-end items-center mb-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onTimeFormatChange}
          className="h-6 w-6 p-0"
          title={showTimeFormat ? "Pokaż godziny" : "Pokaż minuty sesji"}
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
