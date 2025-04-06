
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

type SessionTimerProps = {
  sessionDuration: number; // in minutes
  sessionStartTime: Date;
};

export const SessionTimer = ({ sessionDuration, sessionStartTime }: SessionTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(sessionDuration * 60); // Convert minutes to seconds
  const [progress, setProgress] = useState<number>(100); // 100%
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsedSeconds = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
      const totalSeconds = sessionDuration * 60;
      const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
      
      setTimeLeft(remainingSeconds);
      setProgress((remainingSeconds / totalSeconds) * 100);
      
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
  
  // Use the blue color as requested
  const primaryBlue = "#4c6fff"; // Same blue as used for buttons
  
  // Determine color based on time left
  const getTimerColor = (): string => {
    const totalSessionTime = sessionDuration * 60;
    const percentLeft = (timeLeft / totalSessionTime) * 100;
    
    if (percentLeft < 10) return 'text-red-500 stroke-red-500';
    if (percentLeft < 25) return 'text-amber-500 stroke-amber-500';
    return `text-[${primaryBlue}] stroke-[${primaryBlue}]`;
  };

  // Calculate stroke dash array and offset for circle progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth="3"
        />
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="transparent"
          stroke={primaryBlue}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-xl font-medium text-[${primaryBlue}]`}>
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};
