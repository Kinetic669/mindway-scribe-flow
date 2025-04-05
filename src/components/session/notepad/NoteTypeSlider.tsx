
"use client";

import { useState, useRef, useEffect } from "react";
import { NoteType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageSquare, Lightbulb, Eye, CheckSquare, Brain, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef(0);

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

  // Handle mouse/touch events for slider
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      lastPosition.current = 'touches' in e 
        ? e.touches[0].clientX 
        : e.clientX;
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !scrollAreaRef.current) return;
      
      const clientX = 'touches' in e 
        ? e.touches[0].clientX 
        : e.clientX;
        
      const diff = lastPosition.current - clientX;
      scrollAreaRef.current.scrollLeft += diff;
      lastPosition.current = clientX;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('mousedown', handleMouseDown);
      scrollArea.addEventListener('touchstart', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
      
      return () => {
        scrollArea.removeEventListener('mousedown', handleMouseDown);
        scrollArea.removeEventListener('touchstart', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, []);

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
        className="flex-1 overflow-hidden"
      >
        <div 
          ref={scrollAreaRef}
          className="flex gap-2 overflow-x-auto transition-all duration-300 no-scrollbar"
          style={{ 
            cursor: 'grab', 
            scrollBehavior: 'smooth',
            touchAction: 'pan-x',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {noteTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedType.id === type.id ? "default" : "outline"}
              size="sm"
              className="flex gap-1 items-center flex-shrink-0 min-w-0"
              style={{ 
                backgroundColor: selectedType.id === type.id ? type.color : 'transparent',
                borderColor: type.color, 
                color: selectedType.id === type.id ? "#fff" : type.color 
              }}
              data-note-type-id={type.id}
              onClick={() => onTypeChange(type)}
            >
              {getIconForType(type.name)}
              <span className="truncate whitespace-nowrap">{type.name}</span>
            </Button>
          ))}
        </div>
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
