
"use client";

import { useState } from "react";
import { NoteType } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  MessageSquare, 
  Lightbulb, 
  Eye, 
  CheckSquare, 
  Brain, 
  Pencil 
} from "lucide-react";

type NoteTypeSelectorProps = {
  noteTypes: NoteType[];
  selectedType: NoteType;
  onChange: (type: NoteType) => void;
};

export const NoteTypeSelector = ({ noteTypes, selectedType, onChange }: NoteTypeSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIconForType = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "wypowiedź klienta": return <MessageSquare size={14} />;
      case "spostrzeżenie terapeuty": return <Lightbulb size={14} />;
      case "obserwacja": return <Eye size={14} />;
      case "zadanie": return <CheckSquare size={14} />;
      case "refleksja": return <Brain size={14} />;
      case "rysunek": return <Pencil size={14} />;
      default: return <MessageSquare size={14} />;
    }
  };

  const handleChange = (type: NoteType) => {
    onChange(type);
    // Don't show toast when changing note type
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 mb-2">
        <Button 
          type="button"
          size="sm"
          variant="outline"
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 h-auto", 
            isExpanded ? "bg-gray-100" : ""
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: selectedType.color }}  
          />
          <span className="text-xs">{selectedType.name}</span>
        </Button>

        <div className={`flex flex-wrap gap-1 ${isExpanded ? '' : 'hidden'}`}>
          {noteTypes.map(type => (
            <Button
              key={type.id}
              type="button"
              size="sm"
              variant="ghost"
              data-note-type-id={type.id}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 h-auto",
                selectedType.id === type.id ? "bg-gray-100" : "hover:bg-gray-50"
              )}
              onClick={() => handleChange(type)}
            >
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: type.color }}  
              />
              <span className="text-xs">{type.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
