
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Note, NoteType, Tool } from "@/types";
import { mockNotes, mockTools, noteTypes } from "@/data/mockData";
import { DrawingCanvas } from "@/components/session/DrawingCanvas";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { SessionTabs } from "@/components/session/SessionTabs";
import { MinimalTimeline } from "@/components/session/MinimalTimeline";
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

const DemoSession = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [showMinimalTimeline, setShowMinimalTimeline] = useState(true);
  const [plannedExercises, setPlannedExercises] = useState<string[]>([]);
  const [sessionGoals, setSessionGoals] = useState<string[]>([]);
  const [sessionNotes, setSessionNotes] = useState<string>("");

  // Get session prep data from sessionStorage
  useEffect(() => {
    const sessionPrepData = sessionStorage.getItem('sessionPrepData');
    if (sessionPrepData) {
      const data = JSON.parse(sessionPrepData);
      if (data.plannedExercises) setPlannedExercises(data.plannedExercises);
      if (data.sessionGoals) setSessionGoals(data.sessionGoals);
      if (data.sessionNotes) setSessionNotes(data.sessionNotes);
    }
  }, []);

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
    const drawingNote: Note = {
      id: uuidv4(),
      content: imageData,
      type: noteTypes.find(t => t.name === "Spostrzeżenie terapeuty") || noteTypes[0],
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [drawingNote, ...prev]);
    setIsDrawingMode(false);
    toast.success("Rysunek dodany do osi czasu");
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
        {/* Session Header */}
        <Card className="mb-6 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button asChild size="icon" variant="ghost">
              <Link to="/demo/session/prep">
                <ChevronLeft size={18} />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Sesja demonstracyjna</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>{formatSessionDuration(sessionDuration)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowMinimalTimeline(!showMinimalTimeline)}
            >
              {showMinimalTimeline ? "Ukryj oś czasu" : "Pokaż oś czasu"}
            </Button>
            <Button size="icon" variant="ghost">
              <MoreHorizontal size={18} />
            </Button>
          </div>
        </Card>
        
        {/* Session goals and notes */}
        {(sessionGoals.length > 0 || sessionNotes) && (
          <Card className="mb-6 p-4">
            {sessionGoals.length > 0 && (
              <div className="mb-3">
                <h2 className="text-sm font-medium text-gray-500">Cele sesji:</h2>
                <ul className="list-disc list-inside mt-1">
                  {sessionGoals.map((goal, index) => (
                    <li key={index} className="text-sm">{goal}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {sessionNotes && (
              <div>
                <h2 className="text-sm font-medium text-gray-500">Notatki do sesji:</h2>
                <p className="text-sm mt-1">{sessionNotes}</p>
              </div>
            )}
          </Card>
        )}
        
        {/* Planned exercises */}
        {plannedExercises.length > 0 && (
          <Card className="mb-6 p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Zaplanowane ćwiczenia:</h2>
            <div className="flex flex-wrap gap-2">
              {plannedExercises.map((exercise, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAssignExercise(exercise)}
                >
                  {exercise === "emotion-wheel" && "Koło emocji"}
                  {exercise === "breathing" && "Ćwiczenie oddechowe"}
                  {exercise === "reflection" && "Refleksja"}
                  {exercise === "cognitive-restructuring" && "Restrukturyzacja poznawcza"}
                  {exercise === "goal-setting" && "Cele terapii"}
                  {exercise === "grounding" && "Uziemienie 5-4-3-2-1"}
                </Button>
              ))}
            </div>
          </Card>
        )}
        
        {/* Minimal Timeline */}
        <MinimalTimeline 
          notes={notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())} 
          visible={showMinimalTimeline}
          onToggleVisibility={() => setShowMinimalTimeline(!showMinimalTimeline)}
        />
        
        {/* Tabs Interface */}
        <SessionTabs 
          notes={notes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
          onToggleDrawing={() => setIsDrawingMode(true)}
          onAssignExercise={handleAssignExercise}
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
};

export default DemoSession;
