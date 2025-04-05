
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

type SessionTimerProps = {
  sessionDuration: number; // in minutes
  sessionStartTime: Date;
};

export const SessionTimer = ({ sessionDuration, sessionStartTime }: SessionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(sessionDuration * 60); // Convert to seconds
  const [isOvertime, setIsOvertime] = useState(false);
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const sessionEndTime = new Date(sessionStartTime.getTime() + sessionDuration * 60 * 1000);
      const diff = Math.floor((sessionEndTime.getTime() - now.getTime()) / 1000);
      
      if (diff <= 0) {
        setIsOvertime(true);
        setTimeLeft(Math.abs(diff)); // Time past the session end
      } else {
        setTimeLeft(diff);
      }
    };

    // Calculate initially
    calculateTimeLeft();
    
    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [sessionDuration, sessionStartTime]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 px-2 py-1 ${
        isOvertime ? 'bg-red-50 text-red-600 border-red-300' : 'bg-blue-50 text-blue-600 border-blue-300'
      }`}
    >
      <Clock size={12} />
      {isOvertime ? (
        <span>Przekroczony czas: {formatTime(timeLeft)}</span>
      ) : (
        <span>Pozostało: {formatTime(timeLeft)}</span>
      )}
    </Badge>
  );
};
