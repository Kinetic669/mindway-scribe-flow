"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Changed from next/navigation to react-router-dom
import { v4 as uuidv4 } from "uuid";
import { Note, NoteType } from "@/types";
import { mockNotes, noteTypes } from "@/data/mockData";
import { DrawingCanvas } from "@/components/session/DrawingCanvas";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { SessionTabs } from "@/components/session/SessionTabs";
import { MinimalTimelineNew } from "@/components/session/MinimalTimelineNew";
import { SessionTimer } from "@/components/session/SessionTimer";
import { 
  Clock, 
  MoreHorizontal,
  Eye
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EmotionWheel } from "@/components/exercises/EmotionWheel";
import { BreathingExercise } from "@/components/exercises/BreathingExercise";
import { ReflectionPrompt } from "@/components/exercises/ReflectionPrompt";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DemoSession() {
  const navigate = useNavigate(); // Changed from router to navigate
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(50); // Default 50 minutes
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showMinimalTimeline, setShowMinimalTimeline] = useState(true);
  const [plannedExercises, setPlannedExercises] = useState<string[]>([]);
  const [sessionGoals, setSessionGoals] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [selectedDrawingType, setSelectedDrawingType] = useState<NoteType>(
    noteTypes.find(t => t.name === "Rysunek") || 
    noteTypes.find(t => t.name.toLowerCase().includes("rysun")) || 
    noteTypes.find(t => t.name === "Spostrzeżenie terapeuty") || 
    noteTypes[0]
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
      let preSessionNoteType: NoteType;
      const existingType = noteTypes.find(t => t.name === "Notatka z planowania");
      
      if (existingType) {
        preSessionNoteType = existingType;
      } else {
        preSessionNoteType = {
          id: "pre-session",
          name: "Notatka z planowania",
          color: "#9B59B6", // Purple color for pre-session notes
          visible: true
        };
      }

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

  // Get exercise note type
  const getExerciseNoteType = () => {
    return noteTypes.find(t => t.name === "Ćwiczenie") || {
      id: "exercise",
      name: "Ćwiczenie",
      color: "#8e44ad", // Purple color for exercises
      visible: true
    };
  };

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
    
    // We don't need to create the "started exercise" note anymore
    // Just remember which exercise is active
  };

  const handleDrawingSave = (imageData: string) => {
    // Use the drawing note type
    const drawingType = noteTypes.find(t => 
      t.name === "Rysunek" || 
      t.name.toLowerCase().includes("rysun")
    ) || {
      id: "drawing",
      name: "Rysunek",
      color: "#3498db", // Blue color for drawings
      visible: true
    };

    const drawingNote: Note = {
      id: uuidv4(),
      content: imageData,
      type: drawingType,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [drawingNote, ...prev]);
    setIsDrawingMode(false);
    toast(`Rysunek dodany do notatek`);
  };

  const handleEmotionWheelSave = (data: { emotion: string; intensity: number; notes: string }) => {
    const exerciseType = getExerciseNoteType();
    
    const emotionNote: Note = {
      id: uuidv4(),
      content: `Klient zidentyfikował emocję: ${data.emotion} (${data.intensity}/10)\n\nNotatki: ${data.notes}`,
      type: exerciseType,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [emotionNote, ...prev]);
    setActiveExercise(null);
    toast("Wyniki koła emocji dodane do osi czasu");
  };

  const handleBreathingExerciseSave = (data: { completed: boolean; duration: number }) => {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const exerciseType = getExerciseNoteType();

    const breathingNote: Note = {
      id: uuidv4(),
      content: `Klient wykonał ćwiczenie oddechowe.\nCzas trwania: ${formatTime(data.duration)}\nStatus: ${data.completed ? 'Ukończone' : 'Częściowe'}`,
      type: exerciseType,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [breathingNote, ...prev]);
    setActiveExercise(null);
    toast("Wyniki ćwiczenia oddechowego dodane do osi czasu");
  };

  const handleReflectionSave = (data: { responses: Record<string, string> }) => {
    const { responses } = data;
    
    const formattedContent = `Refleksja klienta:\n\nSytuacja: ${responses.situation}\n\nMyśli: ${responses.thoughts}\n\nEmocje: ${responses.emotions}\n\nZachowanie: ${responses.behavior}\n\nAlternatywna perspektywa: ${responses.alternative}`;
    
    const exerciseType = getExerciseNoteType();

    const reflectionNote: Note = {
      id: uuidv4(),
      content: formattedContent,
      type: exerciseType,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [reflectionNote, ...prev]);
    setActiveExercise(null);
    toast("Refleksje dodane do osi czasu");
  };

  const handleNoteClick = (noteId: string) => {
    // Find the note in the list
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    // Scroll to the note in the timeline
    const timelineElement = document.getElementById(`note-${noteId}`);
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth' });
      // Add highlight effect matching note color
      timelineElement.style.backgroundColor = `${note.type.color}15`; // Very light version of the color
      setTimeout(() => {
        timelineElement.style.backgroundColor = '';
      }, 2000);
    }
  };

  const handleEndSession = () => {
    setShowEndSessionDialog(true);
  };

  const confirmEndSession = () => {
    // In a real app, save session data, etc.
    toast("Sesja została zakończona");
    navigate('/'); // Changed from router.push to navigate
  };

  return (
    <div className="min-h-screen flex flex-col pb-6">
      <NavBar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-20">
        {/* Session Header with MinimalTimeline integrated */}
        <Card className="mb-6">
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-3">
              <SessionTimer 
                sessionDuration={sessionDuration} 
                sessionStartTime={sessionStartTime}
              />
              <div>
                <h1 className="text-xl font-semibold">Sesja z Janem Kowalskim</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{sessionDuration} min</span>
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEndSession} className="text-red-500 focus:text-red-500">
                  Zakończ sesję
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Integrated MinimalTimeline */}
          <div className="px-4 py-3">
            {showMinimalTimeline ? (
              <MinimalTimelineNew
                notes={notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())} 
                visible={showMinimalTimeline}
                onToggleVisibility={() => setShowMinimalTimeline(!showMinimalTimeline)}
                onNoteClick={handleNoteClick}
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
            } else {
              // If no type is selected, use the drawing type
              const drawingType = noteTypes.find(t => t.name === "Rysunek") || noteTypes[0];
              setSelectedDrawingType(drawingType);
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

      {/* End Session Dialog */}
      <AlertDialog open={showEndSessionDialog} onOpenChange={setShowEndSessionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zakończyć sesję?</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz zakończyć sesję? Wszystkie nieopublikowane notatki zostaną zapisane.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndSession}>
              Zakończ sesję
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
