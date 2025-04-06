import { useState } from "react";
import { Note } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { 
  Clock, 
  Edit, 
  Trash2, 
  Filter, 
  ArrowUp, 
  ArrowDown, 
  Calendar,
  MoreVertical,
  MessageSquare,
  Lightbulb,
  Eye,
  CheckSquare,
  Brain,
  Pencil
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { noteTypes } from "@/data/mockData";

type TimelineProps = {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onChangeNoteType?: (id: string, newType: string) => void;
};

export const Timeline = ({ notes, onDeleteNote, onChangeNoteType }: TimelineProps) => {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showTimeAsMinutes, setShowTimeAsMinutes] = useState(true);

  const toggleExpand = (id: string) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  const formatTime = (date: Date) => {
    return format(date, "H:mm", { locale: pl });
  };

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: pl });
  };

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

  // Get icon for note type
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
    return hoursDiff > 1; // If created more than an hour ago, consider it a planning note
  };

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Oś czasu sesji</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowTimeAsMinutes(!showTimeAsMinutes)}
            className="flex items-center gap-1"
          >
            {showTimeAsMinutes ? <Calendar size={14} /> : <Clock size={14} />}
            <span>{showTimeAsMinutes ? "Pokaż godziny" : "Pokaż minuty sesji"}</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSortDirection(sortDirection === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1"
          >
            {sortDirection === "desc" ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
            <span>Sortuj</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={14} />
                <span>Filtruj</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType(null)}>
                Wszystkie notatki
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {noteTypesList.map(type => (
                <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filterType && (
        <div className="mb-4 px-3 py-1.5 bg-gray-100 rounded-md text-sm flex justify-between items-center">
          <span>Filtrowanie: {filterType}</span>
          <Button variant="ghost" size="sm" onClick={() => setFilterType(null)}>
            Wyczyść
          </Button>
        </div>
      )}
      
      {filteredNotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Brak notatek. Zacznij pisać w notatniku powyżej.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => {
            const shouldShowSpecialIcon = note.type.name === "wypowiedź klienta" || note.type.name === "spostrzeżenie terapeuty";
            return (
              <div 
                key={note.id} 
                className={`timeline-item ${shouldShowSpecialIcon ? 'has-icon' : ''}`} 
                id={`note-${note.id}`}
              >
                {shouldShowSpecialIcon ? (
                  <div 
                    className="timeline-dot has-icon" 
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <span style={{ color: note.type.color }}>
                      {getIconForType(note.type.name)}
                    </span>
                  </div>
                ) : (
                  <div 
                    className="timeline-dot"
                    style={{ backgroundColor: note.type.color }}
                  />
                )}
                
                <div className="ml-4">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1" 
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
                        <DropdownMenuItem onClick={() => toggleExpand(note.id)}>
                          {expandedNote === note.id ? "Zwiń" : "Rozwiń"}
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
                    className={`note-card relative ${expandedNote === note.id ? 'border-mindway-primary' : ''}`}
                    onClick={() => toggleExpand(note.id)}
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
                      <div className={`note-card-content ${expandedNote === note.id ? '' : 'line-clamp-3'}`}>
                        {note.content}
                      </div>
                    )}
                    
                    {expandedNote === note.id && (
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
          })}
        </div>
      )}
    </div>
  );
};

@layer components {
  .mindway-container {
    @apply w-full max-w-7xl mx-auto px-4 md:px-6;
  }

  .note-input {
    @apply w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-mindway-primary/30 transition-all;
  }
  
  .timeline-item {
    @apply relative pl-6 pr-4 pb-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border;
  }
  
  .timeline-item:before {
    content: '';
  }
  
  .timeline-dot {
    @apply absolute left-0 top-2 w-3 h-3 rounded-full -translate-x-1/2 z-10;
  }

  .note-card {
    @apply p-4 rounded-lg border border-border bg-white shadow-sm;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
