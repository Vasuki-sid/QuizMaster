
export type QuizLevel = 1 | 2 | 3;

export type QuizAnswer = 'a' | 'b' | 'c' | 'd';

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: QuizAnswer;
  level: QuizLevel;
}

export interface QuizResult {
  level: QuizLevel;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: number;
    userAnswer: QuizAnswer | null;
    isCorrect: boolean;
  }[];
  timeSpent: number; // in seconds
  completedAt: string;
}

export interface UserQuizProgress {
  highestLevel: QuizLevel;
  results: {
    [key in QuizLevel]?: QuizResult;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  progress: UserQuizProgress;
}
