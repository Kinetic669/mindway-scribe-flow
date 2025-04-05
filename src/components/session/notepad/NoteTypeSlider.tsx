
"use client";

import { useRef, useState, useEffect } from "react";
import { NoteType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type NoteTypeSliderProps = {
  noteTypes: NoteType[];
  selectedType: NoteType;
  onSelect: (type: NoteType) => void;
};

export const NoteTypeSlider = ({ noteTypes, selectedType, onSelect }: NoteTypeSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // Check if arrows should be visible
  const checkOverflow = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  // Scroll handler
  const handleScroll = () => {
    checkOverflow();
  };

  // Scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? sliderRef.current.scrollLeft - scrollAmount 
        : sliderRef.current.scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative flex items-center w-full py-1">
      {showLeftArrow && (
        <Button 
          variant="ghost" 
          size="sm"
          className="absolute left-0 z-10 h-8 w-8 rounded-full bg-white/80 p-0 shadow-md"
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={16} />
        </Button>
      )}
      
      <div 
        ref={sliderRef} 
        className="flex overflow-x-auto scrollbar-hide space-x-2 px-2 py-1 w-full" 
        onScroll={handleScroll}
      >
        {noteTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedType.id === type.id ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap min-w-fit"
            style={{ 
              backgroundColor: selectedType.id === type.id ? type.color : 'transparent',
              color: selectedType.id === type.id ? '#fff' : type.color,
              borderColor: type.color
            }}
            onClick={() => onSelect(type)}
            data-note-type-id={type.id}
          >
            {type.name}
          </Button>
        ))}
      </div>

      {showRightArrow && (
        <Button 
          variant="ghost" 
          size="sm"
          className="absolute right-0 z-10 h-8 w-8 rounded-full bg-white/80 p-0 shadow-md"
          onClick={() => scroll('right')}
        >
          <ChevronRight size={16} />
        </Button>
      )}
    </div>
  );
};
