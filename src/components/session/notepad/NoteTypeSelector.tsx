
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MessageSquare, Lightbulb, Eye, CheckSquare, Brain, Sparkles } from "lucide-react";
import { NoteType } from "@/types";
import { toast } from "sonner";

type NoteTypeSelectorProps = {
  noteTypes: NoteType[];
  selectedType: NoteType;
  onTypeChange: (type: NoteType) => void;
};

export const NoteTypeSelector = ({ 
  noteTypes, 
  selectedType, 
  onTypeChange 
}: NoteTypeSelectorProps) => {
  const getIconForType = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "wypowiedź klienta": return <MessageSquare size={14} />;
      case "spostrzeżenie terapeuty": return <Lightbulb size={14} />;
      case "obserwacja": return <Eye size={14} />;
      case "zadanie": return <CheckSquare size={14} />;
      case "refleksja": return <Brain size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  // Quick type selection buttons (first 3 for quick access)
  const quickTypeButtons = noteTypes.slice(0, 3);

  return (
    <div className="flex gap-2 mb-3 flex-wrap">
      {/* Quick Type Selection */}
      <div className="flex flex-wrap gap-1 mr-2">
        {quickTypeButtons.map((type) => (
          <Button
            key={type.id}
            variant={selectedType.id === type.id ? "default" : "outline"}
            size="sm"
            className="flex gap-1 items-center"
            style={{ 
              backgroundColor: selectedType.id === type.id ? type.color : 'transparent',
              borderColor: type.color, 
              color: selectedType.id === type.id ? "#fff" : type.color 
            }}
            onClick={() => {
              onTypeChange(type);
              toast.success(`Typ notatki: ${type.name}`);
            }}
          >
            {getIconForType(type.name)}
            <span className="truncate max-w-24">{type.name}</span>
          </Button>
        ))}
      </div>

      {/* Full Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex gap-1 items-center"
            data-note-type-selector
          >
            <span>Więcej typów</span>
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {noteTypes.map((type) => (
            <DropdownMenuItem
              key={type.id}
              onClick={() => {
                onTypeChange(type);
                toast.success(`Typ notatki: ${type.name}`);
              }}
              className="flex gap-2 items-center cursor-pointer py-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: type.color }}
              />
              <span>{type.name}</span>
              {selectedType.id === type.id && (
                <span className="ml-auto text-xs text-muted-foreground">Wybrano</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
