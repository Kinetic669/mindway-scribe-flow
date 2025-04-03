
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
  MessageSquare,
  Lightbulb,
  Eye,
  CheckSquare,
  Brain,
  Sparkles
} from "lucide-react";
import { NoteType } from "@/types";
import { noteTypes } from "@/data/mockData";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
    } else if (e.key === "/" && noteContent === "") {
      // Open type selector on / key when textarea is empty
      e.preventDefault();
      const dropdownTrigger = document.querySelector("[data-note-type-selector]") as HTMLButtonElement;
      if (dropdownTrigger) dropdownTrigger.click();
    }
  };

  const getIconForType = (typeName: string) => {
    switch (typeName.toLowerCase()) {
      case "client quote": return <MessageSquare size={14} />;
      case "therapist insight": return <Lightbulb size={14} />;
      case "observation": return <Eye size={14} />;
      case "action item": return <CheckSquare size={14} />;
      case "reflection": return <Brain size={14} />;
      default: return <Sparkles size={14} />;
    }
  };

  // Quick type selection buttons
  const quickTypeButtons = noteTypes.slice(0, 3); // Show only first 3 for quick access

  return (
    <Card className="p-4 mb-4 border rounded-lg shadow-sm">
      <div className="flex gap-2 mb-3 flex-wrap">
        {/* Quick Type Selection */}
        <div className="flex flex-wrap gap-1 mr-2">
          {quickTypeButtons.map((type) => (
            <Button
              key={type.id}
              variant={selectedType.id === type.id ? "default" : "outline"}
              size="sm"
              className="flex gap-1 items-center"
              style={{ 
                backgroundColor: selectedType.id === type.id ? type.color : 'transparent',
                borderColor: type.color, 
                color: selectedType.id === type.id ? "#fff" : type.color 
              }}
              onClick={() => {
                setSelectedType(type);
                toast.success(`Note type set to ${type.name}`);
              }}
            >
              {getIconForType(type.name)}
              <span className="truncate max-w-24">{type.name}</span>
            </Button>
          ))}
        </div>

        {/* Full Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex gap-1 items-center"
              data-note-type-selector
            >
              <span>More Types</span>
              <ChevronDown size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {noteTypes.map((type) => (
              <DropdownMenuItem
                key={type.id}
                onClick={() => {
                  setSelectedType(type);
                  toast.success(`Note type set to ${type.name}`);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
                className="flex gap-2 items-center cursor-pointer py-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                <span>{type.name}</span>
                {selectedType.id === type.id && (
                  <span className="ml-auto text-xs text-muted-foreground">Selected</span>
                )}
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

        <Button variant="outline" size="sm" className="ml-auto">
          <Plus size={14} className="mr-1" /> Add
        </Button>
      </div>
      
      <div className="relative">
        <div 
          className="absolute left-3 top-3 p-1 rounded-md"
          style={{ backgroundColor: `${selectedType.color}20` }}
        >
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: selectedType.color }}
          />
        </div>
        <Textarea 
          ref={textareaRef}
          placeholder={`Type your ${selectedType.name.toLowerCase()} here...`}
          className="min-h-[100px] resize-none pl-10 pr-16 py-3"
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
