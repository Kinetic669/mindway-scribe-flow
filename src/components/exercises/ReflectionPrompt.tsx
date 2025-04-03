
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Save, AlertCircle } from "lucide-react";

type ReflectionPromptProps = {
  onClose: () => void;
  onSave: (data: { responses: Record<string, string> }) => void;
};

export const ReflectionPrompt = ({ onClose, onSave }: ReflectionPromptProps) => {
  const [responses, setResponses] = useState<Record<string, string>>({
    situation: "",
    thoughts: "",
    emotions: "",
    behavior: "",
    alternative: ""
  });
  
  const prompts = [
    {
      id: "situation",
      question: "What situation are you reflecting on?",
      placeholder: "Describe the specific event or situation..."
    },
    {
      id: "thoughts",
      question: "What thoughts went through your mind?",
      placeholder: "What were you thinking when this happened?"
    },
    {
      id: "emotions",
      question: "What emotions did you experience?",
      placeholder: "How did you feel? How intense was it (1-10)?"
    },
    {
      id: "behavior",
      question: "How did you respond or behave?",
      placeholder: "What did you do or not do as a result?"
    },
    {
      id: "alternative",
      question: "What's an alternative perspective?",
      placeholder: "Is there another way to look at this situation?"
    }
  ];
  
  const handleInputChange = (id: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = () => {
    onSave({ responses });
  };
  
  const isComplete = Object.values(responses).every(val => val.trim().length > 0);
  
  return (
    <Card className="fixed inset-0 z-50 flex flex-col bg-white overflow-auto">
      <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="text-lg font-medium">Self-Reflection Exercise</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800 flex items-start">
            <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>
              This exercise helps you process situations by examining your thoughts, emotions, and behaviors.
              Take your time with each question and answer honestly.
            </span>
          </p>
        </div>
        
        <div className="space-y-8">
          {prompts.map((prompt, index) => (
            <div key={prompt.id} className="space-y-2">
              <h3 className="font-medium">
                {index + 1}. {prompt.question}
              </h3>
              <textarea
                className="w-full p-3 border rounded-md min-h-24 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder={prompt.placeholder}
                value={responses[prompt.id]}
                onChange={(e) => handleInputChange(prompt.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t sticky bottom-0 bg-white flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {!isComplete && "Please complete all questions to continue"}
          {isComplete && "All questions completed! Ready to save."}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isComplete}
          >
            <Save size={16} className="mr-1" /> Save Responses
          </Button>
        </div>
      </div>
    </Card>
  );
};
