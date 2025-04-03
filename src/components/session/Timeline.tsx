
import { useState } from "react";
import { Note } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Clock, Edit, Trash2, Filter, ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

type TimelineProps = {
  notes: Note[];
  onDeleteNote: (id: string) => void;
};

export const Timeline = ({ notes, onDeleteNote }: TimelineProps) => {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  const formatTime = (date: Date) => {
    return format(date, "H:mm", { locale: pl });
  };

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: pl });
  };

  // Get unique note types for filtering
  const noteTypes = Array.from(new Set(notes.map(note => note.type.name)));

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Oś czasu sesji</h2>
        <div className="flex gap-2">
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
              {noteTypes.map(type => (
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
          {filteredNotes.map((note) => (
            <div key={note.id} className="timeline-item">
              <div 
                className="timeline-dot" 
                style={{ backgroundColor: note.type.color }}
              />
              
              <div className="ml-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium" 
                    style={{ 
                      backgroundColor: `${note.type.color}20`, 
                      color: note.type.color 
                    }}
                  >
                    {note.type.name}
                  </span>
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatTime(note.timestamp)}
                  </span>
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                
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
          ))}
        </div>
      )}
    </div>
  );
};
