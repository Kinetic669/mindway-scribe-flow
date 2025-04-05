
"use client";

import { useState } from "react";
import { Note } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical, Clock, Calendar, MessageSquare, Lightbulb, Eye, CheckSquare, Brain, Pencil } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { noteTypes } from "@/data/mockData";

type NoteCardProps = {
  note: Note;
  showTimeAsMinutes: boolean;
  getMinutesSinceStart: (timestamp: Date) => number;
  onDeleteNote: (id: string) => void;
  onChangeNoteType?: (id: string, newType: string) => void;
};

export const NoteCard = ({ 
  note, 
  showTimeAsMinutes, 
  getMinutesSinceStart,
  onDeleteNote,
  onChangeNoteType 
}: NoteCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getIconForType = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "wypowiedź klienta": return <MessageSquare size={16} />;
      case "spostrzeżenie terapeuty": return <Lightbulb size={16} />;
      case "obserwacja": return <Eye size={16} />;
      case "zadanie": return <CheckSquare size={16} />;
      case "refleksja": return <Brain size={16} />;
      case "rysunek": return <Pencil size={16} />;
      case "ćwiczenie": return <CheckSquare size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const isPlanningNote = (note: Note) => {
    // Determine if a note was created during planning
    // This is a mock - in a real app we'd have a proper flag
    const currentTime = new Date();
    const diff = currentTime.getTime() - note.createdAt.getTime();
    const hoursDiff = diff / (1000 * 60 * 60);
    return hoursDiff > 1 || note.type.name.toLowerCase().includes("planowanie"); // If created more than an hour ago or has planning in the name
  };

  const formatTime = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
  };

  return (
    <div className="timeline-item" id={`note-${note.id}`}>
      <div 
        className="timeline-dot" 
        style={{ backgroundColor: note.type.color }}
      />
      
      <div className="ml-2">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
          <div className="flex items-center gap-2">
            <span 
              className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1" 
              style={{ 
                backgroundColor: `${note.type.color}20`, 
                color: note.type.color 
              }}
            >
              {getIconForType(note.type.name)}
              {note.type.name}
            </span>
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              {showTimeAsMinutes 
                ? `${getMinutesSinceStart(note.timestamp)} min` 
                : formatTime(note.timestamp)
              }
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setExpanded(!expanded)}>
                {expanded ? "Zwiń" : "Rozwiń"}
              </DropdownMenuItem>
              {onChangeNoteType && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    Zmień typ notatki:
                  </DropdownMenuItem>
                  {noteTypes.map(type => (
                    <DropdownMenuItem 
                      key={type.id} 
                      onClick={() => onChangeNoteType(note.id, type.id)}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: type.color }}></div>
                      {type.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDeleteNote(note.id)} className="text-red-500">
                Usuń notatkę
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {isPlanningNote(note) && (
          <div className="text-xs text-amber-600 mb-1 flex items-center">
            <Calendar size={12} className="mr-1" />
            Notatka z planowania sesji
          </div>
        )}
        
        <Card 
          className={`note-card relative ${expanded ? 'border-mindway-primary' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          {note.content.includes("data:image") ? (
            <div className="note-card-content">
              <img 
                src={note.content} 
                alt="Odręczna notatka" 
                className="max-w-full rounded"
              />
            </div>
          ) : (
            <div className={`note-card-content ${expanded ? '' : 'line-clamp-3'}`}>
              {note.content}
            </div>
          )}
          
          {expanded && (
            <div className="mt-4 pt-3 border-t flex justify-end gap-2">
              <Button variant="outline" size="sm">
                <Edit size={14} className="mr-1" /> Edytuj
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
              >
                <Trash2 size={14} className="mr-1" /> Usuń
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
