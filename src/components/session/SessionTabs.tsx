
"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Note, NoteType } from "@/types";
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
} from "lucide-react";
import { NotesTab } from "./tabs/NotesTab";
import { ExercisesTab } from "./tabs/ExercisesTab";
import { DetailsTab } from "./tabs/DetailsTab";

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

  const handleChangeNoteType = (noteId: string, typeId: string) => {
    // This is a placeholder - in a real app we would update the note type
    console.log(`Changing note ${noteId} to type ${typeId}`);
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
            {plannedExercises.length > 0 && (
              <Badge className="absolute -right-1 -top-1 bg-amber-500 h-4 w-4 p-0 flex items-center justify-center">
                {plannedExercises.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="szczegoly" className="flex items-center gap-2">
            <History size={16} />
            <span>Szczegóły</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notatki" className="space-y-4">
          <NotesTab
            notes={notes}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            onToggleDrawing={onToggleDrawing}
          />
        </TabsContent>
        
        <TabsContent value="cwiczenia" className="space-y-4">
          <ExercisesTab 
            exercises={exercises}
            plannedExercises={plannedExercises}
            onAssignExercise={(exerciseId) => {
              onAssignExercise(exerciseId);
              setActiveTab("notatki");
            }}
          />
        </TabsContent>
        
        <TabsContent value="szczegoly" className="space-y-4">
          <DetailsTab 
            notes={notes}
            onDeleteNote={onDeleteNote}
            onChangeNoteType={handleChangeNoteType}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Przesuń w lewo lub prawo aby przełączać między zakładkami</p>
      </div>
    </div>
  );
}
