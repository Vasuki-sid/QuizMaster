
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import LevelCard from '../components/LevelCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResultSummary from '../components/ResultSummary';
import { QuizLevel } from '../types/quiz';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { startQuiz, levelLocked, userProgress } = useQuiz();
  const navigate = useNavigate();
  
  // If no user is logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If user is a teacher, redirect to admin dashboard
  if (currentUser.role === 'teacher') {
    return <Navigate to="/admin" />;
  }

  // Handler for starting a quiz
  const handleStartQuiz = (level: QuizLevel) => {
    startQuiz(level);
    navigate('/quiz'); // Ensure we navigate to the quiz page when starting
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome, {currentUser.name}</p>
      
      <Tabs defaultValue="levels" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="levels">Quiz Levels</TabsTrigger>
          <TabsTrigger value="results">My Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="levels">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LevelCard
              level={1}
              title="Level 1: Easy"
              description="Basic general knowledge questions suitable for beginners."
              isLocked={false}
              completedScore={userProgress.results[1]?.score}
              totalQuestions={10}
              onStart={() => handleStartQuiz(1)}
            />
            
            <LevelCard
              level={2}
              title="Level 2: Medium"
              description="Intermediate questions that require broader knowledge."
              isLocked={false} {/* Always unlocked */}
              completedScore={userProgress.results[2]?.score}
              totalQuestions={10}
              onStart={() => handleStartQuiz(2)}
            />
            
            <LevelCard
              level={3}
              title="Level 3: Hard"
              description="Advanced questions that challenge even knowledgeable participants."
              isLocked={false} {/* Always unlocked */}
              completedScore={userProgress.results[3]?.score}
              totalQuestions={10}
              onStart={() => handleStartQuiz(3)}
            />
          </div>
          
          <Card className="mt-8 bg-gray-50 border-dashed">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">All Levels Unlocked</h3>
              <p className="text-gray-600">
                All quiz levels are now available. Choose any level to test your knowledge!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-6">Your Quiz Results</h2>
            
            {(userProgress.results[1] || userProgress.results[2] || userProgress.results[3]) ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2, 3].map((level) => {
                  const result = userProgress.results[level as QuizLevel];
                  if (!result) return null;
                  
                  return (
                    <div key={level} className="max-w-xl">
                      <ResultSummary result={result} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-12 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Results Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't completed any quizzes yet. Take a quiz to see your results here.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
