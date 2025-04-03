
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Note, NoteType, Tool } from "@/types";
import { mockNotes, mockTools, noteTypes } from "@/data/mockData";
import { Notepad } from "@/components/session/Notepad";
import { Timeline } from "@/components/session/Timeline";
import { ToolDrawer } from "@/components/session/ToolDrawer";
import { DrawingCanvas } from "@/components/session/DrawingCanvas";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Clock, 
  MoreHorizontal, 
  Package, 
  Heart,
  Wind,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { EmotionWheel } from "@/components/exercises/EmotionWheel";
import { BreathingExercise } from "@/components/exercises/BreathingExercise";
import { ReflectionPrompt } from "@/components/exercises/ReflectionPrompt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DemoSession = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isToolDrawerOpen, setIsToolDrawerOpen] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [quickToolsOpen, setQuickToolsOpen] = useState(false);

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
    // Determine which exercise to show based on tool
    if (tool.name === "Emotion Wheel") {
      setActiveExercise("emotion-wheel");
    } else if (tool.name === "Breathing Exercise") {
      setActiveExercise("breathing");
    } else if (tool.name === "Thought Record") {
      setActiveExercise("reflection");
    } else {
      // For other tools, just add a note
      const toolNote: Note = {
        id: uuidv4(),
        content: `Tool assigned: ${tool.name}`,
        type: noteTypes.find(t => t.name === "Action Item") || noteTypes[0],
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
  
      setNotes(prev => [toolNote, ...prev]);
    }
    
    setIsToolDrawerOpen(false);
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

  const handleEmotionWheelSave = (data: { emotion: string; intensity: number; notes: string }) => {
    const emotionNote: Note = {
      id: uuidv4(),
      content: `Client identified feeling: ${data.emotion} (${data.intensity}/10)\n\nNotes: ${data.notes}`,
      type: noteTypes.find(t => t.name === "Client Quote") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [emotionNote, ...prev]);
    setActiveExercise(null);
    toast.success("Emotion wheel results added to timeline");
  };

  const handleBreathingExerciseSave = (data: { completed: boolean; duration: number }) => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const breathingNote: Note = {
      id: uuidv4(),
      content: `Client completed breathing exercise.\nDuration: ${formatTime(data.duration)}\nStatus: ${data.completed ? 'Completed' : 'Partial'}`,
      type: noteTypes.find(t => t.name === "Observation") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [breathingNote, ...prev]);
    setActiveExercise(null);
    toast.success("Breathing exercise results added to timeline");
  };

  const handleReflectionSave = (data: { responses: Record<string, string> }) => {
    const { responses } = data;
    
    const formattedContent = `Client Reflection:\n\nSituation: ${responses.situation}\n\nThoughts: ${responses.thoughts}\n\nEmotions: ${responses.emotions}\n\nBehavior: ${responses.behavior}\n\nAlternative Perspective: ${responses.alternative}`;
    
    const reflectionNote: Note = {
      id: uuidv4(),
      content: formattedContent,
      type: noteTypes.find(t => t.name === "Reflection") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [reflectionNote, ...prev]);
    setActiveExercise(null);
    toast.success("Reflection responses added to timeline");
  };

  // Quick access tools
  const quickTools = [
    {
      name: "Emotion Wheel",
      icon: <Heart size={18} />,
      color: "#F43F5E",
      onClick: () => setActiveExercise("emotion-wheel")
    },
    {
      name: "Breathing",
      icon: <Wind size={18} />,
      color: "#10B981",
      onClick: () => setActiveExercise("breathing")
    },
    {
      name: "Reflection",
      icon: <FileText size={18} />,
      color: "#6366F1",
      onClick: () => setActiveExercise("reflection")
    }
  ];

  return (
    <div className="min-h-screen flex flex-col pb-6">
      <NavBar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-20">
        {/* Session Header */}
        <Card className="mb-6 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button asChild size="icon" variant="ghost">
              <Link to="/demo/session/prep">
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
              onClick={() => setQuickToolsOpen(!quickToolsOpen)}
              className="flex items-center gap-1"
            >
              <Package size={16} /> Quick Tools
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsToolDrawerOpen(true)}
              className="flex items-center gap-1"
            >
              Full Library
            </Button>
            <Button size="icon" variant="ghost">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </Card>
        
        {/* Quick Tools Floating Menu */}
        {quickToolsOpen && (
          <div className="fixed bottom-24 right-8 z-30 bg-white rounded-lg shadow-lg border p-2 animate-fade-in">
            <div className="flex flex-col gap-2">
              {quickTools.map((tool) => (
                <Button
                  key={tool.name}
                  variant="outline"
                  className="flex justify-start gap-2 px-3"
                  onClick={() => {
                    tool.onClick();
                    setQuickToolsOpen(false);
                  }}
                >
                  <div 
                    className="p-1 rounded-md"
                    style={{ backgroundColor: `${tool.color}20` }}
                  >
                    {tool.icon}
                  </div>
                  <span>{tool.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
        
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

      {/* Exercise Components */}
      {activeExercise === "emotion-wheel" && (
        <EmotionWheel 
          onClose={() => setActiveExercise(null)} 
          onSave={handleEmotionWheelSave}
        />
      )}
      
      {activeExercise === "breathing" && (
        <BreathingExercise
          onClose={() => setActiveExercise(null)} 
          onSave={handleBreathingExerciseSave}
        />
      )}
      
      {activeExercise === "reflection" && (
        <ReflectionPrompt
          onClose={() => setActiveExercise(null)} 
          onSave={handleReflectionSave}
        />
      )}
    </div>
  );
};

export default DemoSession;
