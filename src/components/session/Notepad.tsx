
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  Plus, 
  Send, 
  Pencil, 
  Clock, 
  Type
} from "lucide-react";
import { NoteType } from "@/types";
import { noteTypes } from "@/data/mockData";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotepadProps = {
  onAddNote: (content: string, type: NoteType) => void;
  onToggleDrawing: () => void;
};

export const Notepad = ({ onAddNote, onToggleDrawing }: NotepadProps) => {
  const [noteContent, setNoteContent] = useState("");
  const [selectedType, setSelectedType] = useState<NoteType>(noteTypes[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus textarea on component mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (noteContent.trim() === "") return;
    
    onAddNote(noteContent, selectedType);
    setNoteContent("");
    
    // Re-focus textarea after submission
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="p-4 mb-4 border rounded-lg shadow-sm">
      <div className="flex gap-2 mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-1 items-center"
              style={{ borderColor: selectedType.color, color: selectedType.color }}
            >
              <Type size={14} />
              <span>{selectedType.name}</span>
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {noteTypes.map((type) => (
              <DropdownMenuItem
                key={type.id}
                onClick={() => setSelectedType(type)}
                className="flex gap-2 items-center cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span>{type.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          size="sm"
          onClick={onToggleDrawing}
        >
          <Pencil size={14} className="mr-1" /> Draw
        </Button>
        
        <Button variant="outline" size="sm">
          <Clock size={14} className="mr-1" /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Button>

        <Button variant="outline" size="sm">
          <Plus size={14} className="mr-1" /> Add
        </Button>
      </div>
      
      <div className="relative">
        <Textarea 
          ref={textareaRef}
          placeholder="Type your notes here..."
          className="min-h-[100px] resize-none p-3"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button 
          className="absolute right-3 bottom-3"
          size="sm"
          onClick={handleSubmit}
          disabled={noteContent.trim() === ""}
        >
          <Send size={16} className="mr-1" /> Send
        </Button>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex justify-between px-1">
        <span>Tip: Type / to quickly select note type</span>
        <span>Press Ctrl+Enter to send</span>
      </div>
    </Card>
  );
};
