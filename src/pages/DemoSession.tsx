
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Note, NoteType, Tool } from "@/types";
import { mockNotes, mockTools, noteTypes } from "@/data/mockData";
import { Notepad } from "@/components/session/Notepad";
import { Timeline } from "@/components/session/Timeline";
import { ToolDrawer } from "@/components/session/ToolDrawer";
import { DrawingCanvas } from "@/components/session/DrawingCanvas";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, MoreHorizontal, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const DemoSession = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isToolDrawerOpen, setIsToolDrawerOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    // Update session duration every minute
    const interval = setInterval(() => {
      const now = new Date();
      const durationInMinutes = Math.floor((now.getTime() - sessionStartTime.getTime()) / 60000);
      setSessionDuration(durationInMinutes);
    }, 60000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const addNote = (content: string, type: NoteType) => {
    const newNote: Note = {
      id: uuidv4(),
      content,
      type,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [newNote, ...prev]);
    toast.success("Note added to timeline");
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success("Note deleted");
  };

  const handleToolSelected = (tool: Tool) => {
    const toolNote: Note = {
      id: uuidv4(),
      content: `Tool assigned: ${tool.name}`,
      type: noteTypes.find(t => t.name === "Action Item") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [toolNote, ...prev]);
    toast.success(`${tool.name} assigned`);
  };

  const handleDrawingSave = (imageData: string) => {
    const drawingNote: Note = {
      id: uuidv4(),
      content: imageData,
      type: noteTypes.find(t => t.name === "Therapist Insight") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [drawingNote, ...prev]);
    setIsDrawingMode(false);
    toast.success("Drawing added to timeline");
  };

  return (
    <div className="min-h-screen flex flex-col pb-6">
      <NavBar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-20">
        {/* Session Header */}
        <Card className="mb-6 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button asChild size="icon" variant="ghost">
              <Link to="/">
                <ChevronLeft size={18} />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Demo Session</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>
                  {sessionDuration > 0 
                    ? `${sessionDuration} ${sessionDuration === 1 ? 'minute' : 'minutes'}`
                    : 'Just started'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsToolDrawerOpen(true)}
              className="flex items-center gap-1"
            >
              <Package size={16} /> Tools
            </Button>
            <Button size="icon" variant="ghost">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </Card>
        
        {/* Notepad Component */}
        <Notepad 
          onAddNote={addNote} 
          onToggleDrawing={() => setIsDrawingMode(true)} 
        />
        
        {/* Timeline Component */}
        <Timeline 
          notes={notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())} 
          onDeleteNote={deleteNote}
        />
      </main>
      
      {/* Tool Drawer */}
      <ToolDrawer
        isOpen={isToolDrawerOpen}
        onClose={() => setIsToolDrawerOpen(false)}
        tools={mockTools}
        onToolSelected={handleToolSelected}
      />
      
      {/* Drawing Canvas */}
      {isDrawingMode && (
        <DrawingCanvas
          onClose={() => setIsDrawingMode(false)}
          onSave={handleDrawingSave}
        />
      )}
    </div>
  );
};

export default DemoSession;
