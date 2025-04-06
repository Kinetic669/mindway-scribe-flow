
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
    <div className="flex justify-end items-center gap-2 py-1">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2 text-xs"
        onClick={onTimeFormatChange}
      >
        {showTimeFormat ? (
          <>
            <Calendar size={14} className="mr-1" />
            <span>Godziny</span>
          </>
        ) : (
          <>
            <Clock size={14} className="mr-1" />
            <span>Minuty</span>
          </>
        )}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-7 px-2 text-xs"
        onClick={onToggleVisibility}
      >
        <EyeOff size={14} className="mr-1" />
        <span>Ukryj</span>
      </Button>
    </div>
  );
};
