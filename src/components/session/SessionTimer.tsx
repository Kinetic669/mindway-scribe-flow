
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

type SessionTimerProps = {
  sessionDuration: number; // in minutes
  sessionStartTime: Date;
};

export const SessionTimer = ({ sessionDuration, sessionStartTime }: SessionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(sessionDuration * 60); // Convert minutes to seconds
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      const remainingSeconds = Math.max(0, sessionDuration * 60 - elapsedSeconds);
      setTimeLeft(remainingSeconds);
      
      if (remainingSeconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionDuration, sessionStartTime]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Determine color based on time left
  const getTimerColor = (): string => {
    const totalSessionTime = sessionDuration * 60;
    const percentLeft = (timeLeft / totalSessionTime) * 100;
    
    if (percentLeft < 10) return 'text-red-500';
    if (percentLeft < 25) return 'text-amber-500';
    return 'text-gray-700';
  };
  
  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${getTimerColor()}`}>
      <Clock size={14} />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};
