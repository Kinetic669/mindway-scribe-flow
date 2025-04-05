
"use client";

import { Button } from "@/components/ui/button";
import { 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  Clock, 
  Filter 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

type TimelineHeaderProps = {
  title: string;
  sortDirection: "asc" | "desc";
  onSortChange: () => void;
  showTimeAsMinutes: boolean;
  onTimeFormatChange: () => void;
  noteTypesList: string[];
  onFilterChange: (type: string | null) => void;
};

export const TimelineHeader = ({
  title,
  sortDirection,
  onSortChange,
  showTimeAsMinutes,
  onTimeFormatChange,
  noteTypesList,
  onFilterChange
}: TimelineHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={onTimeFormatChange}
          className="h-8 w-8"
        >
          {showTimeAsMinutes ? <Calendar size={16} /> : <Clock size={16} />}
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          onClick={onSortChange}
          className="h-8 w-8"
        >
          {sortDirection === "desc" ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Filter size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterChange(null)}>
              Wszystkie notatki
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {noteTypesList.map(type => (
              <DropdownMenuItem key={type} onClick={() => onFilterChange(type)}>
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
