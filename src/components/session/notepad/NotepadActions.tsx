
"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Clock, Plus } from "lucide-react";
import { NoteType } from "@/types";

type NotepadActionsProps = {
  selectedType: NoteType;
  onToggleDrawing: () => void;
};

export const NotepadActions = ({ selectedType, onToggleDrawing }: NotepadActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onToggleDrawing}
        style={{ 
          borderColor: `${selectedType.color}40`,
          color: selectedType.color
        }}
      >
        <Pencil size={14} className="mr-1" /> Rysuj
      </Button>
      
      <Button variant="outline" size="sm">
        <Clock size={14} className="mr-1" /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Button>

      <Button variant="outline" size="sm" className="ml-auto">
        <Plus size={14} className="mr-1" /> Dodaj
      </Button>
    </div>
  );
};
