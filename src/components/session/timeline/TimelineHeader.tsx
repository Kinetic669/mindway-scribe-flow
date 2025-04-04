
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
          size="sm"
          onClick={onTimeFormatChange}
          className="flex items-center gap-1"
        >
          {showTimeAsMinutes ? <Calendar size={14} /> : <Clock size={14} />}
          <span>{showTimeAsMinutes ? "Pokaż godziny" : "Pokaż minuty sesji"}</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSortChange}
          className="flex items-center gap-1"
        >
          {sortDirection === "desc" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
          <span>Sortuj</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter size={14} />
              <span>Filtruj</span>
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
