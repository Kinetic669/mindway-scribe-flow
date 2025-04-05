
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { Note, NoteType } from "@/types";
import { mockNotes, noteTypes } from "@/data/mockData";
import { DrawingCanvas } from "@/components/session/DrawingCanvas";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { SessionTabs } from "@/components/session/SessionTabs";
import { MinimalTimeline } from "@/components/session/minimaltimeline/MinimalTimeline";
import { 
  ChevronLeft, 
  Clock, 
  MoreHorizontal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { EmotionWheel } from "@/components/exercises/EmotionWheel";
import { BreathingExercise } from "@/components/exercises/BreathingExercise";
import { ReflectionPrompt } from "@/components/exercises/ReflectionPrompt";

export default function DemoSession() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(50); // Default 50 minutes
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showMinimalTimeline, setShowMinimalTimeline] = useState(true);
  const [plannedExercises, setPlannedExercises] = useState<string[]>([]);
  const [sessionGoals, setSessionGoals] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const [selectedDrawingType, setSelectedDrawingType] = useState<NoteType>(
    noteTypes.find(t => t.name === "Spostrzeżenie terapeuty") || noteTypes[0]
  );
  const timelineRef = useRef<HTMLDivElement>(null);

  // Get session prep data from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionPrepData = sessionStorage.getItem('sessionPrepData');
      if (sessionPrepData) {
        const data = JSON.parse(sessionPrepData);
        if (data.plannedExercises) setPlannedExercises(data.plannedExercises);
        if (data.sessionGoals) setSessionGoals(data.sessionGoals);
        if (data.sessionNotes) setSessionNotes(data.sessionNotes);
        if (data.sessionDuration) setSessionDuration(data.sessionDuration);
      }
    }
  }, []);

  // Update session duration every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const durationInMinutes = Math.floor((now.getTime() - sessionStartTime.getTime()) / 60000);
      // We don't update sessionDuration here anymore as it's fixed from session prep
    }, 60000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Add a pre-session note if there are notes from session planning
  useEffect(() => {
    if (sessionNotes && sessionNotes.trim() !== "") {
      // Create a pre-session note type if it doesn't exist
      const preSessionNoteType = noteTypes.find(t => t.name === "Notatka z planowania") || 
        {
          id: "pre-session",
          name: "Notatka z planowania",
          color: "#9B59B6", // Purple color for pre-session notes
          description: "Notatki przygotowane przed sesją"
        };

      // Create a note from session planning notes
      const planningNote: Note = {
        id: uuidv4(),
        content: sessionNotes,
        type: preSessionNoteType,
        timestamp: new Date(sessionStartTime.getTime() - 3600000), // 1 hour before session
        createdAt: new Date(sessionStartTime.getTime() - 3600000),
        updatedAt: new Date(sessionStartTime.getTime() - 3600000),
      };
      setNotes(prev => [planningNote, ...prev]);
    }
  }, [sessionNotes, sessionStartTime]);

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
    toast.success("Notatka dodana do osi czasu");
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast.success("Notatka usunięta");
  };

  const handleAssignExercise = (exerciseType: string) => {
    setActiveExercise(exerciseType);
    toast.success(`Ćwiczenie wybrane: ${exerciseType}`);
  };

  const handleDrawingSave = (imageData: string) => {
    // Use the selected drawing type when saving the drawing
    const drawingNote: Note = {
      id: uuidv4(),
      content: imageData,
      type: selectedDrawingType, // This will now properly use the selected type
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [drawingNote, ...prev]);
    setIsDrawingMode(false);
    toast.success(`Rysunek dodany jako ${selectedDrawingType.name}`);
  };

  const handleEmotionWheelSave = (data: { emotion: string; intensity: number; notes: string }) => {
    const emotionNote: Note = {
      id: uuidv4(),
      content: `Klient zidentyfikował emocję: ${data.emotion} (${data.intensity}/10)\n\nNotatki: ${data.notes}`,
      type: noteTypes.find(t => t.name === "Wypowiedź klienta") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [emotionNote, ...prev]);
    setActiveExercise(null);
    toast.success("Wyniki koła emocji dodane do osi czasu");
  };

  const handleBreathingExerciseSave = (data: { completed: boolean; duration: number }) => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const breathingNote: Note = {
      id: uuidv4(),
      content: `Klient wykonał ćwiczenie oddechowe.\nCzas trwania: ${formatTime(data.duration)}\nStatus: ${data.completed ? 'Ukończone' : 'Częściowe'}`,
      type: noteTypes.find(t => t.name === "Obserwacja") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [breathingNote, ...prev]);
    setActiveExercise(null);
    toast.success("Wyniki ćwiczenia oddechowego dodane do osi czasu");
  };

  const handleReflectionSave = (data: { responses: Record<string, string> }) => {
    const { responses } = data;
    
    const formattedContent = `Refleksja klienta:\n\nSytuacja: ${responses.situation}\n\nMyśli: ${responses.thoughts}\n\nEmocje: ${responses.emotions}\n\nZachowanie: ${responses.behavior}\n\nAlternatywna perspektywa: ${responses.alternative}`;
    
    const reflectionNote: Note = {
      id: uuidv4(),
      content: formattedContent,
      type: noteTypes.find(t => t.name === "Refleksja") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [reflectionNote, ...prev]);
    setActiveExercise(null);
    toast.success("Refleksje dodane do osi czasu");
  };

  const handleNoteClick = (noteId: string) => {
    // Find the note in the list
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Scroll to the note in the timeline
    const timelineElement = document.getElementById(`note-${noteId}`);
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth' });
      // Add highlight effect
      timelineElement.classList.add('bg-yellow-50');
      setTimeout(() => {
        timelineElement.classList.remove('bg-yellow-50');
      }, 2000);
    }
  };

  // Format session duration in Polish
  const formatSessionDuration = (minutes: number) => {
    if (minutes === 0) return "Rozpoczęta przed chwilą";
    
    if (minutes === 1) return "1 minuta";
    if (minutes < 5) return `${minutes} minuty`;
    return `${minutes} minut`;
  };

  return (
    <div className="min-h-screen flex flex-col pb-6">
      <NavBar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-20">
        {/* Session Header with MinimalTimeline integrated */}
        <Card className="mb-6">
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-3">
              <Button asChild size="icon" variant="ghost">
                <Link href="/demo/session/prep">
                  <ChevronLeft size={18} />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Sesja demonstracyjna</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>Zaplanowana na {sessionDuration} minut</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <MoreHorizontal size={18} />
            </Button>
          </div>
          
          {/* Integrated MinimalTimeline */}
          <div className="px-4 py-3">
            {showMinimalTimeline ? (
              <MinimalTimeline 
                notes={notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())} 
                visible={showMinimalTimeline}
                onToggleVisibility={() => setShowMinimalTimeline(!showMinimalTimeline)}
                onNoteClick={handleNoteClick}
                sessionDuration={sessionDuration}
                sessionStartTime={sessionStartTime}
              />
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowMinimalTimeline(true)}
              >
                <Eye size={16} className="mr-2" />
                <span>Pokaż oś czasu</span>
              </Button>
            )}
          </div>
        </Card>
        
        {/* Session goals */}
        {sessionGoals.length > 0 && (
          <Card className="mb-6 p-4">
            <div className="mb-3">
              <h2 className="text-sm font-medium text-gray-500">Cele sesji:</h2>
              <ul className="list-disc list-inside mt-1">
                {sessionGoals.map((goal, index) => (
                  <li key={index} className="text-sm">{goal}</li>
                ))}
              </ul>
            </div>
          </Card>
        )}
        
        {/* Tabs Interface */}
        <SessionTabs 
          notes={notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
          onToggleDrawing={() => {
            // Save the currently selected note type when toggling drawing mode
            const selectedNoteTypeButton = document.querySelector('[data-note-type-id]') as HTMLButtonElement;
            if (selectedNoteTypeButton) {
              const typeId = selectedNoteTypeButton.getAttribute('data-note-type-id');
              const type = noteTypes.find(t => t.id === typeId);
              if (type) {
                setSelectedDrawingType(type);
                console.log(`Selected type for drawing: ${type.name}`);
              }
            }
            setIsDrawingMode(true);
          }}
          onAssignExercise={handleAssignExercise}
          plannedExercises={plannedExercises}
        />
      </main>
      
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
}

// Format session duration in Polish
function formatSessionDuration(minutes: number) {
  if (minutes === 0) return "Rozpoczęta przed chwilą";
  
  if (minutes === 1) return "1 minuta";
  if (minutes < 5) return `${minutes} minuty`;
  return `${minutes} minut`;
}
