
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Save, SkipBack } from "lucide-react";

type BreathingExerciseProps = {
  onClose: () => void;
  onSave: (data: { completed: boolean; duration: number }) => void;
};

export const BreathingExercise = ({ onClose, onSave }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const phaseTimeRef = useRef(0);
  
  // Phase durations in seconds
  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 1
  };
  
  // Total time for one complete cycle
  const cycleTime = phaseDurations.inhale + phaseDurations.hold + phaseDurations.exhale + phaseDurations.rest;
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
        phaseTimeRef.current += 1;
        
        // Calculate current phase based on elapsed time within cycle
        const timeInCycle = elapsedTime % cycleTime;
        
        if (timeInCycle < phaseDurations.inhale) {
          if (breathPhase !== "inhale") {
            setBreathPhase("inhale");
            phaseTimeRef.current = 0;
          }
        } else if (timeInCycle < phaseDurations.inhale + phaseDurations.hold) {
          if (breathPhase !== "hold") {
            setBreathPhase("hold");
            phaseTimeRef.current = 0;
          }
        } else if (timeInCycle < phaseDurations.inhale + phaseDurations.hold + phaseDurations.exhale) {
          if (breathPhase !== "exhale") {
            setBreathPhase("exhale");
            phaseTimeRef.current = 0;
          }
        } else {
          if (breathPhase !== "rest") {
            setBreathPhase("rest");
            phaseTimeRef.current = 0;
            
            // Increment cycle count at the end of each cycle
            setCycles(prev => prev + 1);
          }
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, elapsedTime]);
  
  const toggleExercise = () => {
    setIsActive(!isActive);
  };
  
  const resetExercise = () => {
    setIsActive(false);
    setElapsedTime(0);
    setBreathPhase("inhale");
    setCycles(0);
    phaseTimeRef.current = 0;
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const calculatePhaseProgress = () => {
    const phaseDuration = phaseDurations[breathPhase];
    return Math.min((phaseTimeRef.current / phaseDuration) * 100, 100);
  };
  
  const handleSave = () => {
    onSave({
      completed: cycles > 0,
      duration: elapsedTime
    });
  };
  
  return (
    <Card className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-medium">4-7-8 Breathing Exercise</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-10">
          <h3 className="text-lg font-medium mb-2">
            {breathPhase === "inhale" && "Inhale slowly through your nose"}
            {breathPhase === "hold" && "Hold your breath"}
            {breathPhase === "exhale" && "Exhale completely through your mouth"}
            {breathPhase === "rest" && "Prepare for next cycle"}
          </h3>
          <p className="text-sm text-gray-500">
            {breathPhase === "inhale" && "Fill your lungs for 4 seconds"}
            {breathPhase === "hold" && "Keep holding for 7 seconds"}
            {breathPhase === "exhale" && "Let all air out for 8 seconds"}
            {breathPhase === "rest" && "Prepare for next breath"}
          </p>
        </div>
        
        {/* Visual breath indicator */}
        <div className="relative w-64 h-64 mb-8">
          <div 
            className={`absolute top-0 left-0 w-full h-full rounded-full transition-all duration-1000 
              ${breathPhase === "inhale" ? "scale-100 bg-blue-100" : 
                breathPhase === "hold" ? "scale-100 bg-purple-100" : 
                breathPhase === "exhale" ? "scale-90 bg-green-100" : "scale-75 bg-gray-100"}`}
          />
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl font-light">
            {breathPhase === "inhale" && `${phaseDurations.inhale - phaseTimeRef.current}`}
            {breathPhase === "hold" && `${phaseDurations.hold - phaseTimeRef.current}`}
            {breathPhase === "exhale" && `${phaseDurations.exhale - phaseTimeRef.current}`}
            {breathPhase === "rest" && `${phaseDurations.rest - phaseTimeRef.current}`}
          </div>
        </div>
        
        {/* Progress bar for current phase */}
        <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${calculatePhaseProgress()}%`,
              backgroundColor: 
                breathPhase === "inhale" ? "#93c5fd" : 
                breathPhase === "hold" ? "#c4b5fd" : 
                breathPhase === "exhale" ? "#86efac" : "#d1d5db"
            }}
          />
        </div>
        
        <div className="flex gap-4 items-center mb-8">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetExercise}
            disabled={!elapsedTime}
          >
            <SkipBack />
          </Button>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full"
            onClick={toggleExercise}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </Button>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <div className="text-xl font-medium">{formatTime(elapsedTime)}</div>
          <div className="text-sm text-gray-500">
            Completed Cycles: {cycles}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={cycles === 0}>
          <Save size={16} className="mr-1" /> Save Progress
        </Button>
      </div>
    </Card>
  );
};
