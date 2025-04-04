
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { mockClients, mockNotes } from "@/data/mockData";
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartContainer } from "@/components/ui/chart";
import { 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from "recharts";
import { 
  ChevronRight, 
  Clock, 
  Target, 
  Calendar, 
  User, 
  FileText, 
  List, 
  Activity,
  X,
  Brain,
  HeartPulse,
  Wind,
  Target as TargetIcon,
  FileText as FileTextIcon,
  Zap
} from "lucide-react";

export default function SessionPrep() {
  const router = useRouter();
  const [sessionGoals, setSessionGoals] = useState<string[]>(["Eksploracja czynników wywołujących lęk", "Ćwiczenie techniki uważności"]);
  const [newGoal, setNewGoal] = useState("");
  const [sessionDuration, setSessionDuration] = useState(50);
  const [sessionNotes, setSessionNotes] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  
  // Get demo client (first client in the mock data)
  const client = mockClients[0];
  
  // Available exercises
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
      icon: <FileTextIcon size={24} />,
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
      icon: <TargetIcon size={24} />,
    },
    {
      id: "grounding",
      name: "Uziemienie 5-4-3-2-1",
      description: "Technika uważności oparta na zmysłach",
      color: "#3B82F6",
      icon: <Zap size={24} />,
    },
  ];
  
  // Mock attendance data for the chart
  const attendanceData = [
    { month: "Sie", count: 4, sessions: 4 },
    { month: "Wrz", count: 3, sessions: 4 },
    { month: "Paź", count: 4, sessions: 4 },
    { month: "Lis", count: 3, sessions: 4 },
    { month: "Gru", count: 4, sessions: 4 },
    { month: "Sty", count: 4, sessions: 4 },
  ];
  
  // Generate weekly attendance data for the small chart
  const weeklyData = Array.from({ length: 20 }, (_, i) => ({
    week: i + 1,
    attended: Math.random() > 0.2 // 80% attendance probability
  }));
  
  const addGoal = () => {
    if (newGoal.trim() === "") return;
    setSessionGoals([...sessionGoals, newGoal.trim()]);
    setNewGoal("");
  };
  
  const removeGoal = (index: number) => {
    setSessionGoals(goals => goals.filter((_, i) => i !== index));
  };
  
  const handleExerciseToggle = (exerciseId: string) => {
    setSelectedExercises(prev => {
      if (prev.includes(exerciseId)) {
        return prev.filter(id => id !== exerciseId);
      } else {
        return [...prev, exerciseId];
      }
    });
  };
  
  const startSession = () => {
    // Save session prep data to sessionStorage
    const sessionPrepData = {
      sessionGoals,
      sessionDuration,
      sessionNotes,
      plannedExercises: selectedExercises,
    };
    
    if (typeof window !== "undefined") {
      sessionStorage.setItem('sessionPrepData', JSON.stringify(sessionPrepData));
    }
    toast.success("Dane sesji zapisane pomyślnie");
    
    // Navigate to the session
    router.push("/demo/session");
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-6">
      <NavBar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-20">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <User size={28} />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{client.name}</h1>
                <p className="text-sm text-gray-500">Przygotowanie sesji</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance overview */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Przegląd obecności</span>
                </h2>
                
                <Card className="p-4 h-44">
                  <div className="text-xs text-gray-500 mb-1">Cotygodniowe sesje</div>
                  <div className="h-full w-full">
                    <ChartContainer
                      config={{
                        attended: {
                          label: "Obecny",
                          color: "#4c6fff"
                        },
                        missed: {
                          label: "Nieobecny",
                          color: "#f1f1f1"
                        }
                      }}
                    >
                      <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          domain={[0, 5]}
                          ticks={[0, 1, 2, 3, 4]}
                        />
                        <Tooltip content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                                <p className="text-xs">{`${payload[0].payload.month}: ${payload[0].value} / ${payload[0].payload.sessions} sesji`}</p>
                              </div>
                            );
                          }
                          return null;
                        }} />
                        <Bar dataKey="count" fill="var(--color-attended)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </Card>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Kalendarz obecności</span>
                    <span className="text-xs text-gray-500">Ostatnie 20 tygodni</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {weeklyData.map((week, i) => (
                      <div 
                        key={i}
                        className="w-5 h-5 rounded-sm"
                        style={{ 
                          backgroundColor: week.attended ? "#4c6fff33" : "#f1f1f1",
                          border: week.attended ? "1px solid #4c6fff" : "1px solid #e5e7eb"
                        }}
                        title={`Tydzień ${week.week}: ${week.attended ? "Obecny" : "Nieobecny"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Previous notes */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <FileText size={18} />
                  <span>Notatki z poprzednich sesji</span>
                </h2>
                
                <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                  {mockNotes.map(note => (
                    <Card key={note.id} className="p-3">
                      <div className="flex items-start gap-2">
                        <div 
                          className="w-3 h-3 rounded-full mt-1.5"
                          style={{ backgroundColor: note.type.color }}
                        />
                        <div>
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                            <span>{note.type.name}</span>
                            <span>•</span>
                            <span>{note.timestamp.toLocaleDateString('pl-PL')}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Session preparation */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Przygotowanie sesji</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Clock size={16} />
                    <span>Czas trwania sesji (minuty)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[30, 45, 50, 60, 90].map(duration => (
                      <Button
                        key={duration}
                        type="button"
                        variant={sessionDuration === duration ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSessionDuration(duration)}
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Target size={16} />
                    <span>Cele sesji</span>
                  </label>
                  <div className="space-y-2 mb-3">
                    {sessionGoals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-md p-2">
                        <span className="text-sm flex-1">{goal}</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeGoal(index)}
                        >
                          Usuń
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Dodaj nowy cel..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                    />
                    <Button type="button" onClick={addGoal}>Dodaj</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-2">
                  <List size={16} />
                  <span>Notatki do sesji</span>
                </label>
                <Textarea
                  placeholder="Dodaj notatkę lub przypomnienie na tę sesję..."
                  className="min-h-36"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>
            </div>
          </Card>
          
          {/* Exercises library */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Activity size={18} />
              <span>Wybierz ćwiczenia na sesję</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exercises.map(exercise => (
                <Card 
                  key={exercise.id} 
                  className={`overflow-hidden border-2 ${
                    selectedExercises.includes(exercise.id) 
                      ? "border-gray-400" 
                      : 'border-gray-100'
                  }`}
                  style={{
                    borderColor: selectedExercises.includes(exercise.id) ? exercise.color : undefined 
                  }}
                >
                  <div 
                    className="p-4 flex justify-between items-start"
                    style={{ 
                      backgroundColor: selectedExercises.includes(exercise.id) 
                        ? `${exercise.color}20` 
                        : 'transparent' 
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
                        <p className="text-sm text-gray-600">{exercise.description}</p>
                      </div>
                    </div>
                    <Checkbox 
                      checked={selectedExercises.includes(exercise.id)}
                      onCheckedChange={() => handleExerciseToggle(exercise.id)}
                      className="mt-1"
                    />
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Wybrane ćwiczenia ({selectedExercises.length})</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExercises.length === 0 ? (
                  <p className="text-sm text-gray-500">Nie wybrano żadnych ćwiczeń</p>
                ) : (
                  exercises
                    .filter(ex => selectedExercises.includes(ex.id))
                    .map(ex => (
                      <div 
                        key={ex.id} 
                        className="flex items-center px-2 py-1 bg-white rounded border gap-2"
                      >
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: ex.color }}  
                        />
                        <span className="text-sm">{ex.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0 ml-1" 
                          onClick={() => handleExerciseToggle(ex.id)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end">
        <Button 
          size="lg" 
          onClick={startSession}
          className="gap-2"
        >
          <span>Rozpocznij sesję</span>
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
