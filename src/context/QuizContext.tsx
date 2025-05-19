
import React, { createContext, useState, useContext } from 'react';
import { QuizLevel, QuizQuestion, QuizAnswer, QuizResult, UserQuizProgress } from '../types/quiz';
import { getQuestionsByLevel } from '../data/quizData';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface QuizContextType {
  currentLevel: QuizLevel;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: QuizAnswer | null;
  timeLeft: number;
  isReviewing: boolean;
  userAnswers: (QuizAnswer | null)[];
  startQuiz: (level: QuizLevel) => void;
  selectAnswer: (answer: QuizAnswer) => void;
  nextQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  results: QuizResult | null;
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  userProgress: UserQuizProgress;
  levelLocked: (level: QuizLevel) => boolean;
}

const QuizContext = createContext<QuizContextType | null>(null);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateUserProgress } = useAuth();
  
  const [currentLevel, setCurrentLevel] = useState<QuizLevel>(1);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<QuizAnswer | null>(null);
  const [userAnswers, setUserAnswers] = useState<(QuizAnswer | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds per question
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [userProgress, setUserProgress] = useState<UserQuizProgress>(
    currentUser?.progress || { highestLevel: 1, results: {} }
  );
  
  // Update user progress when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setUserProgress(currentUser.progress);
    } else {
      setUserProgress({ highestLevel: 1, results: {} });
    }
  }, [currentUser]);

  // Start a new quiz
  const startQuiz = (level: QuizLevel) => {
    const levelQuestions = getQuestionsByLevel(level);
    setQuestions(levelQuestions);
    setCurrentLevel(level);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers(new Array(levelQuestions.length).fill(null));
    setTimeLeft(60);
    setStartTime(Date.now());
    setIsReviewing(false);
    setResults(null);
    setIsQuizActive(true);
    setIsQuizCompleted(false);
    
    toast.info(`Level ${level} quiz started!`);
  };

  // Select an answer for the current question
  const selectAnswer = (answer: QuizAnswer) => {
    if (isReviewing) return;
    
    setSelectedAnswer(answer);
    
    // Update userAnswers
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
  };

  // Move to the next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1]);
      setTimeLeft(60);
    } else {
      // If it's the last question, show results
      submitQuiz();
    }
  };

  // Submit the quiz and calculate results
  const submitQuiz = () => {
    if (!startTime) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Calculate results
    let correctCount = 0;
    const answerDetails = questions.map((q, index) => {
      const isCorrect = userAnswers[index] === q.correctAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: q.id,
        userAnswer: userAnswers[index],
        isCorrect
      };
    });
    
    const quizResult: QuizResult = {
      level: currentLevel,
      score: correctCount,
      totalQuestions: questions.length,
      answers: answerDetails,
      timeSpent,
      completedAt: new Date().toISOString()
    };
    
    setResults(quizResult);
    setIsQuizActive(false);
    setIsQuizCompleted(true);
    setIsReviewing(true);
    
    // Update user progress if user is logged in
    if (currentUser) {
      const newProgress = { ...userProgress };
      
      // Update results for this level
      newProgress.results[currentLevel] = quizResult;
      
      // Update highest level if user passed (70% or better)
      const passScore = questions.length * 0.7;
      if (correctCount >= passScore && currentLevel < 3 && currentLevel >= newProgress.highestLevel) {
        newProgress.highestLevel = (currentLevel + 1) as QuizLevel;
        toast.success(`You've unlocked Level ${newProgress.highestLevel}!`);
      }
      
      setUserProgress(newProgress);
      updateUserProgress(newProgress);
    }
  };

  // Reset the quiz state
  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setTimeLeft(60);
    setStartTime(null);
    setIsReviewing(false);
    setResults(null);
    setIsQuizActive(false);
    setIsQuizCompleted(false);
  };

  // Check if a level is locked for the current user
  const levelLocked = (level: QuizLevel): boolean => {
    if (!currentUser) return level > 1;
    return level > userProgress.highestLevel;
  };

  return (
    <QuizContext.Provider value={{
      currentLevel,
      questions,
      currentQuestionIndex,
      selectedAnswer,
      timeLeft,
      isReviewing,
      userAnswers,
      startQuiz,
      selectAnswer,
      nextQuestion,
      submitQuiz,
      resetQuiz,
      results,
      isQuizActive,
      isQuizCompleted,
      userProgress,
      levelLocked
    }}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
