
"use client";

import { useState } from "react";
import { Note } from "@/types";
import { TimelineHeader } from "./TimelineHeader";
import { FilterBadge } from "./FilterBadge";
import { NoteCard } from "./NoteCard";

type TimelineProps = {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onChangeNoteType?: (id: string, newType: string) => void;
  title?: string;
};

export const Timeline = ({ 
  notes, 
  onDeleteNote, 
  onChangeNoteType,
  title = "Oś czasu sesji"
}: TimelineProps) => {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showTimeAsMinutes, setShowTimeAsMinutes] = useState(true);

  // Calculate session start time based on the earliest note
  const sessionStartTime = notes.length > 0 ? 
    Math.min(...notes.map(note => note.timestamp.getTime())) : 
    new Date().getTime();

  // Get minutes since session start
  const getMinutesSinceStart = (timestamp: Date) => {
    return Math.floor((timestamp.getTime() - sessionStartTime) / 60000);
  };

  // Get unique note types for filtering
  const noteTypesList = Array.from(new Set(notes.map(note => note.type.name)));

  // Sort and filter notes
  const filteredNotes = notes
    .filter(note => filterType ? note.type.name === filterType : true)
    .sort((a, b) => {
      const dateA = a.timestamp.getTime();
      const dateB = b.timestamp.getTime();
      return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="py-4">
      <TimelineHeader 
        title={title}
        sortDirection={sortDirection}
        onSortChange={() => setSortDirection(sortDirection === "desc" ? "asc" : "desc")}
        showTimeAsMinutes={showTimeAsMinutes}
        onTimeFormatChange={() => setShowTimeAsMinutes(!showTimeAsMinutes)}
        noteTypesList={noteTypesList}
        onFilterChange={setFilterType}
      />
      
      <FilterBadge 
        filterType={filterType} 
        onClearFilter={() => setFilterType(null)} 
      />
      
      {filteredNotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Brak notatek. Zacznij pisać w notatniku powyżej.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id}
              note={note}
              showTimeAsMinutes={showTimeAsMinutes}
              getMinutesSinceStart={getMinutesSinceStart}
              onDeleteNote={onDeleteNote}
              onChangeNoteType={onChangeNoteType}
            />
          ))}
        </div>
      )}
    </div>
  );
};
