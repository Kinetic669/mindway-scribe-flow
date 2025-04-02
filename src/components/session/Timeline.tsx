
import { useState } from "react";
import { Note } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Clock, Edit, Trash2 } from "lucide-react";

type TimelineProps = {
  notes: Note[];
  onDeleteNote: (id: string) => void;
};

export const Timeline = ({ notes, onDeleteNote }: TimelineProps) => {
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  const formatTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  return (
    <div className="py-4">
      <h2 className="text-lg font-medium mb-4">Session Timeline</h2>
      
      {notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No notes yet. Start by typing in the notepad above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
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
                </div>
                
                <Card 
                  className={`note-card relative ${expandedNote === note.id ? 'border-mindway-primary' : ''}`}
                  onClick={() => toggleExpand(note.id)}
                >
                  {note.content.includes("data:image") ? (
                    <div className="note-card-content">
                      <img 
                        src={note.content} 
                        alt="Handwritten note" 
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
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
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
