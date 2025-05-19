
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { QuizResult } from '../types/quiz';
import { Check, X } from 'lucide-react';

interface ResultSummaryProps {
  result: QuizResult;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  const { score, totalQuestions, timeSpent } = result;
  const percentageScore = Math.round((score / totalQuestions) * 100);
  
  // Performance message based on percentage
  const getPerformanceMessage = () => {
    if (percentageScore >= 90) return "Excellent!";
    if (percentageScore >= 70) return "Good job!";
    if (percentageScore >= 50) return "Nice try!";
    return "Keep practicing!";
  };
  
  // Format time spent
  const formatTimeSpent = () => {
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    return `${minutes}m ${seconds}s`;
  };
  
  return (
    <Card className="border-2 border-quiz-primary/20 shadow-lg animate-fade-in">
      <CardHeader className="text-center bg-gradient-to-r from-quiz-primary/10 to-quiz-secondary/10">
        <CardTitle className="text-2xl font-bold">Quiz Results</CardTitle>
        <CardDescription>
          Level {result.level} - {getPerformanceMessage()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">Score</span>
            <div className="text-3xl font-bold text-quiz-primary mt-1">
              {score}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {percentageScore}%
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">Time Spent</span>
            <div className="text-3xl font-bold text-quiz-secondary mt-1">
              {formatTimeSpent()}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ~{Math.round(timeSpent / totalQuestions)}s per question
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-500">Accuracy</span>
            <div className="flex items-center mt-1">
              <div className="mr-2">
                <Check size={20} className="text-quiz-correct" />
              </div>
              <span className="font-bold text-xl text-quiz-correct">{score}</span>
              <span className="mx-2 text-gray-400">:</span>
              <div className="mr-2">
                <X size={20} className="text-quiz-incorrect" />
              </div>
              <span className="font-bold text-xl text-quiz-incorrect">{totalQuestions - score}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div 
                className="bg-quiz-primary h-3 rounded-full" 
                style={{ width: `${percentageScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Question Summary</h4>
          <div className="space-y-2">
            {result.answers.map((answer, index) => (
              <div key={index} className="flex items-center p-3 rounded-md bg-gray-50">
                <div className="mr-3">
                  {answer.isCorrect ? (
                    <div className="w-6 h-6 rounded-full bg-quiz-correct/20 flex items-center justify-center">
                      <Check size={14} className="text-quiz-correct" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-quiz-incorrect/20 flex items-center justify-center">
                      <X size={14} className="text-quiz-incorrect" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-gray-700">Question {index + 1}</p>
                  <p className="text-xs text-gray-500">
                    {answer.userAnswer ? `Your answer: ${answer.userAnswer.toUpperCase()}` : 'Not answered'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultSummary;
