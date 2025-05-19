
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { QuizLevel } from '../types/quiz';
import { LockIcon, UnlockIcon } from 'lucide-react';

interface LevelCardProps {
  level: QuizLevel;
  title: string;
  description: string;
  isLocked: boolean;
  completedScore?: number;
  totalQuestions?: number;
  onStart: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({
  level,
  title,
  description,
  isLocked,
  completedScore,
  totalQuestions,
  onStart
}) => {
  const getDifficultyColor = () => {
    switch(level) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-md ${isLocked ? 'opacity-80' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className={`text-xs font-medium py-1 px-3 rounded-full ${getDifficultyColor()}`}>
            {level === 1 ? 'Easy' : level === 2 ? 'Medium' : 'Hard'}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500">
          {totalQuestions && (
            <p>{totalQuestions} questions</p>
          )}
          {completedScore !== undefined && totalQuestions && (
            <div className="mt-2">
              <p className="mb-1">Your score: {completedScore}/{totalQuestions}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-quiz-primary h-2 rounded-full" 
                  style={{ width: `${(completedScore / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isLocked ? (
          <Button disabled className="w-full bg-gray-300 hover:bg-gray-300 cursor-not-allowed">
            <LockIcon size={16} className="mr-2" />
            Locked
          </Button>
        ) : (
          <Button 
            onClick={onStart} 
            className="w-full bg-quiz-primary hover:bg-quiz-secondary"
          >
            <UnlockIcon size={16} className="mr-2" />
            {completedScore !== undefined ? 'Restart' : 'Start'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default LevelCard;
