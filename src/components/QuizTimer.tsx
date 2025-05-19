
import React, { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

interface QuizTimerProps {
  initialTime: number;
  onTimeUp?: () => void;
  isPaused?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({ initialTime, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isPaused]);

  // Calculate the percentage of time left
  const percentageLeft = (timeLeft / initialTime) * 100;

  // Determine color based on time left percentage
  const getProgressColor = () => {
    if (percentageLeft > 60) return 'bg-green-500';
    if (percentageLeft > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Format time in MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        <span className="text-sm font-medium" style={{ color: getProgressColor().replace('bg-', 'text-') }}>
          {formatTime()}
        </span>
      </div>
      <Progress 
        className={`h-2 ${getProgressColor()}`} 
        value={percentageLeft} 
      />
    </div>
  );
};

export default QuizTimer;
