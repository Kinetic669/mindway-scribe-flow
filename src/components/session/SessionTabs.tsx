
import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Note, NoteType, Tool } from "@/types";
import { Notepad } from "./Notepad";
import { Timeline } from "./Timeline";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  HeartPulse, 
  Wind, 
  FileText, 
  Brain, 
  Target, 
  Zap,
  History,
  Info
} from "lucide-react";

type SessionTabsProps = {
  notes: Note[];
  onAddNote: (content: string, type: NoteType) => void;
  onDeleteNote: (id: string) => void;
  onToggleDrawing: () => void;
  onAssignExercise: (exerciseType: string) => void;
  plannedExercises: string[];
};

export function SessionTabs({ 
  notes, 
  onAddNote, 
  onDeleteNote, 
  onToggleDrawing,
  onAssignExercise,
  plannedExercises
}: SessionTabsProps) {
  const [activeTab, setActiveTab] = useState("notatki");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  
  const exercises = [
    {
      id: "emotion-wheel",
      name: "Koło emocji",
      description: "Pomaga klientowi zidentyfikować i nazwać swoje emocje",
      color: "#F43F5E",
      icon: <HeartPulse size={24} />,
    },
    {
      id: "breathing",
      name: "Ćwiczenie oddechowe",
      description: "Technika relaksacyjna oparta na kontrolowanym oddychaniu",
      color: "#10B981",
      icon: <Wind size={24} />,
    },
    {
      id: "reflection",
      name: "Refleksja",
      description: "Strukturyzowany formularz do refleksji nad sytuacją",
      color: "#6366F1",
      icon: <FileText size={24} />,
    },
    {
      id: "cognitive-restructuring",
      name: "Restrukturyzacja poznawcza",
      description: "Identyfikacja i zmiana negatywnych schematów myślenia",
      color: "#8B5CF6",
      icon: <Brain size={24} />,
    },
    {
      id: "goal-setting",
      name: "Cele terapii",
      description: "Ustalanie celów SMART na kolejne sesje",
      color: "#F59E0B",
      icon: <Target size={24} />,
    },
    {
      id: "grounding",
      name: "Uziemienie 5-4-3-2-1",
      description: "Technika uważności oparta na zmysłach",
      color: "#3B82F6",
      icon: <Zap size={24} />,
    },
  ];

  // Handle swipe for tab switching
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (!touchStartX || !touchEndX) return;
      
      const diff = touchStartX - touchEndX;
      const threshold = 50; // minimum distance for swipe

      if (Math.abs(diff) > threshold) {
        // Right to left swipe (next tab)
        if (diff > 0) {
          if (activeTab === "notatki") setActiveTab("cwiczenia");
          else if (activeTab === "cwiczenia") setActiveTab("szczegoly");
        } 
        // Left to right swipe (previous tab)
        else {
          if (activeTab === "szczegoly") setActiveTab("cwiczenia");
          else if (activeTab === "cwiczenia") setActiveTab("notatki");
        }
      }

      setTouchStartX(null);
      setTouchEndX(null);
    };

    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener('touchstart', handleTouchStart);
      tabsElement.addEventListener('touchmove', handleTouchMove);
      tabsElement.addEventListener('touchend', handleTouchEnd);

      return () => {
        tabsElement.removeEventListener('touchstart', handleTouchStart);
        tabsElement.removeEventListener('touchmove', handleTouchMove);
        tabsElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchStartX, touchEndX, activeTab]);

  // Split exercises into planned and other
  const plannedExercisesList = exercises.filter(ex => plannedExercises.includes(ex.id));
  const otherExercises = exercises.filter(ex => !plannedExercises.includes(ex.id));

  const handleChangeNoteType = (noteId: string, typeId: string) => {
    // This is a placeholder - in a real app we would update the note type
    console.log(`Changing note ${noteId} to type ${typeId}`);
  };

  const scrollToNote = (noteId: string) => {
    setActiveTab("szczegoly");
    setTimeout(() => {
      const noteElement = document.getElementById(`note-${noteId}`);
      if (noteElement) {
        noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a highlight effect
        noteElement.classList.add('bg-yellow-50');
        setTimeout(() => {
          noteElement.classList.remove('bg-yellow-50');
        }, 2000);
      }
    }, 100);
  };

  return (
    <div ref={tabsRef} className="w-full touch-pan-y">
      <Tabs 
        defaultValue="notatki" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full mb-4 grid grid-cols-3">
          <TabsTrigger value="notatki" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Notatki</span>
          </TabsTrigger>
          <TabsTrigger value="cwiczenia" className="flex items-center gap-2 relative">
            <Brain size={16} />
            <span>Ćwiczenia</span>
            {plannedExercisesList.length > 0 && (
              <Badge className="absolute -right-1 -top-1 bg-amber-500 h-4 w-4 p-0 flex items-center justify-center">
                {plannedExercisesList.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="szczegoly" className="flex items-center gap-2">
            <History size={16} />
            <span>Szczegóły</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notatki" className="space-y-4">
          <Notepad 
            onAddNote={onAddNote} 
            onToggleDrawing={onToggleDrawing} 
          />
          <Timeline 
            notes={notes} 
            onDeleteNote={onDeleteNote} 
          />
        </TabsContent>
        
        <TabsContent value="cwiczenia" className="space-y-4">
          {plannedExercisesList.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-medium">Zaplanowane ćwiczenia</h2>
                <Badge variant="secondary">Zaplanowane przed sesją</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {plannedExercisesList.map((exercise) => (
                  <Card 
                    key={exercise.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow border-amber-200"
                    onClick={() => {
                      onAssignExercise(exercise.id);
                      setActiveTab("notatki");
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-md"
                        style={{ backgroundColor: `${exercise.color}20` }}
                      >
                        {exercise.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-gray-500">{exercise.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          <h2 className="text-lg font-medium mb-4">Wszystkie ćwiczenia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherExercises.map((exercise) => (
              <Card 
                key={exercise.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  onAssignExercise(exercise.id);
                  setActiveTab("notatki");
                }}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-md"
                    style={{ backgroundColor: `${exercise.color}20` }}
                  >
                    {exercise.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-500">{exercise.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="szczegoly" className="space-y-4">
          <h2 className="text-lg font-medium mb-4">Szczegóły sesji</h2>
          
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Czas trwania</h3>
                <p className="font-medium">50 minut</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Cele sesji</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Praca nad regulacją emocji</li>
                  <li>Omówienie zadań domowych</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Statystyki sesji</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Notatki</span>
                    <p className="font-medium">{notes.length}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-xs text-gray-500">Ćwiczenia</span>
                    <p className="font-medium">{plannedExercisesList.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Pełna oś czasu</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Info size={12} />
                <span>Rozszerzona</span>
              </Badge>
            </div>
            <Timeline 
              notes={notes} 
              onDeleteNote={onDeleteNote} 
              onChangeNoteType={handleChangeNoteType}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Przesuń w lewo lub prawo aby przełączać między zakładkami</p>
      </div>
    </div>
  );
}
