
"use client";

import { useRef, useState, useEffect } from "react";
import { NoteType } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type NoteTypeSliderProps = {
  noteTypes: NoteType[];
  selectedType: NoteType;
  onTypeChange: (type: NoteType) => void;
};

export const NoteTypeSlider = ({ noteTypes, selectedType, onTypeChange }: NoteTypeSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Check if arrows should be visible
  const checkOverflow = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
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

  // Mouse/Touch event handlers for drag scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
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
        className="flex overflow-x-auto scrollbar-hide space-x-2 px-2 py-1 w-full scroll-smooth" 
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {noteTypes.map((type) => (
          <Button
            key={type.id}
            variant={selectedType.id === type.id ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap min-w-fit flex-shrink-0"
            style={{ 
              backgroundColor: selectedType.id === type.id ? type.color : 'transparent',
              color: selectedType.id === type.id ? '#fff' : type.color,
              borderColor: type.color
            }}
            onClick={() => onTypeChange(type)}
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
