
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { Note } from "@/types";
import { Timeline } from "../timeline/Timeline";

type DetailsTabProps = {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onChangeNoteType?: (id: string, newType: string) => void;
  sessionDuration?: number;
  sessionGoals?: string[];
};

export const DetailsTab = ({ 
  notes, 
  onDeleteNote, 
  onChangeNoteType,
  sessionDuration = 50,
  sessionGoals = []
}: DetailsTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Szczegóły sesji</h2>
      
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Czas trwania</h3>
            <p className="font-medium">{sessionDuration} minut</p>
          </div>
          
          {sessionGoals.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Cele sesji</h3>
              <ul className="list-disc list-inside space-y-1">
                {sessionGoals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Statystyki sesji</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500">Notatki</span>
                <p className="font-medium">{notes.length}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <span className="text-xs text-gray-500">Ćwiczenia</span>
                <p className="font-medium">0</p>
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
          onChangeNoteType={onChangeNoteType}
        />
      </div>
    </div>
  );
};
