
"use client";

import { Badge } from "@/components/ui/badge";
import { ExerciseCard } from "./ExerciseCard";
import { ReactNode } from "react";

type Exercise = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: ReactNode;
};

type ExercisesTabProps = {
  exercises: Exercise[];
  plannedExercises: string[];
  onAssignExercise: (exerciseId: string) => void;
};

export const ExercisesTab = ({ 
  exercises, 
  plannedExercises, 
  onAssignExercise 
}: ExercisesTabProps) => {
  // Split exercises into planned and other
  const plannedExercisesList = exercises.filter(ex => plannedExercises.includes(ex.id));
  const otherExercises = exercises.filter(ex => !plannedExercises.includes(ex.id));

  return (
    <div className="space-y-4">
      {plannedExercisesList.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-medium">Zaplanowane ćwiczenia</h2>
            <Badge variant="secondary">Zaplanowane przed sesją</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {plannedExercisesList.map((exercise) => (
              <ExerciseCard 
                key={exercise.id}
                id={exercise.id}
                name={exercise.name}
                description={exercise.description}
                color={exercise.color}
                icon={exercise.icon}
                isPlanned={true}
                onClick={onAssignExercise}
              />
            ))}
          </div>
        </>
      )}
      
      <h2 className="text-lg font-medium mb-4">Wszystkie ćwiczenia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {otherExercises.map((exercise) => (
          <ExerciseCard 
            key={exercise.id}
            id={exercise.id}
            name={exercise.name}
            description={exercise.description}
            color={exercise.color}
            icon={exercise.icon}
            onClick={onAssignExercise}
          />
        ))}
      </div>
    </div>
  );
};
