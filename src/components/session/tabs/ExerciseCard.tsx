
"use client";

import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

type ExerciseCardProps = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: ReactNode;
  isPlanned?: boolean;
  onClick: (id: string) => void;
};

export const ExerciseCard = ({ 
  id, 
  name, 
  description, 
  color, 
  icon, 
  isPlanned = false,
  onClick 
}: ExerciseCardProps) => {
  return (
    <Card 
      key={id}
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${isPlanned ? "border-amber-200" : ""}`}
      onClick={() => onClick(id)}
    >
      <div className="flex items-start gap-3">
        <div 
          className="p-2 rounded-md"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Card>
  );
};
