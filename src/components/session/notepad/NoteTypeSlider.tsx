
"use client";

import { useState, useRef, useEffect } from "react";
import { NoteType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageSquare, Lightbulb, Eye, CheckSquare, Brain, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

type NoteTypeSelectorProps = {
  noteTypes: NoteType[];
  selectedType: NoteType;
  onTypeChange: (type: NoteType) => void;
};

export const NoteTypeSlider = ({ 
  noteTypes, 
  selectedType, 
  onTypeChange 
}: NoteTypeSelectorProps) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const sliderRef = useRef<HTMLDivElement>(null);

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

  const handleSlideLeft = () => {
    if (visibleRange.start > 0) {
      setVisibleRange({
        start: visibleRange.start - 1,
        end: visibleRange.end - 1
      });
    }
  };

  const handleSlideRight = () => {
    if (visibleRange.end < noteTypes.length) {
      setVisibleRange({
        start: visibleRange.start + 1,
        end: visibleRange.end + 1
      });
    }
  };

  // Adjust visible items based on container width
  useEffect(() => {
    const updateVisibleItems = () => {
      if (!sliderRef.current) return;
      const containerWidth = sliderRef.current.offsetWidth;
      const buttonWidth = 120; // Approximate width of a button
      const visibleItems = Math.max(1, Math.floor((containerWidth - 80) / buttonWidth)); // 80px for arrows
      
      setVisibleRange(prev => ({
        start: prev.start,
        end: Math.min(prev.start + visibleItems, noteTypes.length)
      }));
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    
    return () => {
      window.removeEventListener('resize', updateVisibleItems);
    };
  }, [noteTypes.length]);

  return (
    <div className="flex items-center gap-2 w-full my-2">
      <Button
        variant="outline"
        size="icon"
        className="flex-shrink-0"
        onClick={handleSlideLeft}
        disabled={visibleRange.start === 0}
      >
        <ChevronLeft size={16} />
      </Button>
      
      <div 
        ref={sliderRef}
        className="flex gap-2 overflow-hidden transition-all duration-300 flex-1"
      >
        {noteTypes.slice(visibleRange.start, visibleRange.end).map((type) => (
          <Button
            key={type.id}
            variant={selectedType.id === type.id ? "default" : "outline"}
            size="sm"
            className="flex gap-1 items-center flex-1 min-w-0"
            style={{ 
              backgroundColor: selectedType.id === type.id ? type.color : 'transparent',
              borderColor: type.color, 
              color: selectedType.id === type.id ? "#fff" : type.color 
            }}
            data-note-type-id={type.id}
            onClick={() => {
              onTypeChange(type);
              toast(`Typ notatki: ${type.name}`);
            }}
          >
            {getIconForType(type.name)}
            <span className="truncate">{type.name}</span>
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="flex-shrink-0"
        onClick={handleSlideRight}
        disabled={visibleRange.end >= noteTypes.length}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
