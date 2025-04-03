
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Save, Info } from "lucide-react";

type EmotionWheelProps = {
  onClose: () => void;
  onSave: (data: { emotion: string; intensity: number; notes: string }) => void;
};

export const EmotionWheel = ({ onClose, onSave }: EmotionWheelProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  
  // Primary emotions with their secondary emotions
  const emotionGroups = [
    {
      primary: "Joy",
      color: "#FEF7CD", // Soft yellow
      secondaries: ["Happiness", "Contentment", "Proud", "Optimistic", "Excited", "Grateful"]
    },
    {
      primary: "Sadness",
      color: "#D3E4FD", // Soft blue
      secondaries: ["Lonely", "Disappointed", "Hopeless", "Grief", "Depressed", "Hurt"]
    },
    {
      primary: "Fear",
      color: "#E5DEFF", // Soft purple
      secondaries: ["Scared", "Anxious", "Insecure", "Nervous", "Worried", "Overwhelmed"]
    },
    {
      primary: "Anger",
      color: "#FFDEE2", // Soft pink
      secondaries: ["Frustrated", "Irritated", "Resentful", "Enraged", "Annoyed", "Jealous"]
    },
    {
      primary: "Disgust",
      color: "#F2FCE2", // Soft green
      secondaries: ["Disapproval", "Disrespect", "Revulsion", "Aversion", "Distaste", "Judgmental"]
    },
    {
      primary: "Surprise",
      color: "#FDE1D3", // Soft peach
      secondaries: ["Amazed", "Confused", "Stunned", "Shocked", "Astonished", "Perplexed"]
    }
  ];

  const handleSubmit = () => {
    if (!selectedEmotion) return;
    
    onSave({
      emotion: selectedEmotion,
      intensity,
      notes
    });
  };

  return (
    <Card className="fixed inset-0 z-50 flex flex-col bg-white overflow-auto">
      <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="text-lg font-medium">Emotion Wheel Exercise</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <Info size={16} className="mr-1" />
            Select the emotion that best describes how you're feeling right now.
          </p>
        </div>

        {/* Emotion wheel visualization */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 mb-8">
          {emotionGroups.map((group) => (
            <div key={group.primary} className="flex flex-col">
              <button
                className="w-full py-3 px-2 rounded-lg mb-2 font-medium text-center transition-colors hover:opacity-90"
                style={{ 
                  backgroundColor: group.color,
                  border: selectedEmotion === group.primary ? '2px solid #4c6fff' : '1px solid #e2e8f0'
                }}
                onClick={() => setSelectedEmotion(group.primary)}
              >
                {group.primary}
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                {group.secondaries.map(emotion => (
                  <button
                    key={emotion}
                    className="py-2 px-1 rounded-md text-sm text-center transition-colors"
                    style={{ 
                      backgroundColor: `${group.color}80`,
                      border: selectedEmotion === emotion ? '2px solid #4c6fff' : '1px solid #e2e8f0'
                    }}
                    onClick={() => setSelectedEmotion(emotion)}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Intensity slider */}
        {selectedEmotion && (
          <>
            <div className="mb-6">
              <h3 className="font-medium mb-2">How intense is this feeling?</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-8">Low</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="flex-1 mx-2"
                />
                <span className="text-sm text-gray-500 w-8">High</span>
                <span className="ml-2 font-medium">{intensity}/10</span>
              </div>
            </div>
            
            {/* Notes */}
            <div className="mb-8">
              <h3 className="font-medium mb-2">Notes</h3>
              <textarea
                className="w-full p-3 border rounded-md min-h-24"
                placeholder="Add any additional thoughts about this emotion..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      
      <div className="p-4 border-t sticky bottom-0 bg-white flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!selectedEmotion}
        >
          <Save size={16} className="mr-1" /> Save Response
        </Button>
      </div>
    </Card>
  );
};
