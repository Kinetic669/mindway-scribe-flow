
"use client";

import { NoteType } from "@/types";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

type NotepadActionsProps = {
  selectedType: NoteType;
  onToggleDrawing: () => void;
};

export const NotepadActions = ({ 
  selectedType, 
  onToggleDrawing
}: NotepadActionsProps) => {
  return (
    <div className="flex gap-2 mt-2 mb-1 flex-wrap">
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

      <Button variant="outline" size="sm" className="ml-auto">
        <Plus size={14} className="mr-1" /> Dodaj
      </Button>
    </div>
  );
};
