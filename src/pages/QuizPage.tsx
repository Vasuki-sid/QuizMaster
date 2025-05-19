
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuiz } from '../context/QuizContext';
import QuizOption from '../components/QuizOption';
import QuizTimer from '../components/QuizTimer';
import ResultSummary from '../components/ResultSummary';
import { QuizAnswer } from '../types/quiz';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentLevel,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    isReviewing,
    userAnswers,
    selectAnswer,
    nextQuestion,
    submitQuiz,
    resetQuiz,
    results,
    isQuizActive,
    isQuizCompleted,
  } = useQuiz();
  
  // If quiz is not active and not completed, redirect to dashboard
  if (!isQuizActive && !isQuizCompleted) {
    return <Navigate to="/dashboard" />;
  }
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Handle option selection
  const handleOptionSelect = (option: QuizAnswer) => {
    if (!isReviewing) {
      selectAnswer(option);
    }
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      submitQuiz();
    }
  };
  
  // Handle quiz completion
  const handleComplete = () => {
    resetQuiz();
    navigate('/dashboard');
  };
  
  // Handle time up
  const handleTimeUp = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      submitQuiz();
    }
  };
  
  // If quiz is completed, show results
  if (isQuizCompleted && results) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Quiz Completed</h1>
        
        <ResultSummary result={results} />
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleComplete}
            className="bg-quiz-primary hover:bg-quiz-secondary"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Level {currentLevel} Quiz</h2>
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-gray-200" />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {['a', 'b', 'c', 'd'].map((option) => (
            <QuizOption
              key={option}
              label={option}
              value={option as QuizAnswer}
              content={currentQuestion.options[option as 'a' | 'b' | 'c' | 'd']}
              selected={selectedAnswer === option}
              isReviewing={isReviewing}
              isCorrect={isReviewing && option === currentQuestion.correctAnswer}
              onClick={() => handleOptionSelect(option as QuizAnswer)}
            />
          ))}
        </CardContent>
        <CardFooter className="flex-col space-y-4 pt-0">
          <QuizTimer
            initialTime={60}
            onTimeUp={handleTimeUp}
            isPaused={!!selectedAnswer}
          />
          
          <div className="flex justify-end w-full">
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className={`${selectedAnswer ? 'bg-quiz-primary hover:bg-quiz-secondary' : 'bg-gray-300'}`}
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizPage;
