
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import LevelCard from '../components/LevelCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResultSummary from '../components/ResultSummary';
import { QuizLevel } from '../types/quiz';
import { supabase } from "@/integrations/supabase/client";

interface StudentResult {
  level1_score: number;
  level2_score: number;
  level3_score: number;
  total_score: number;
  last_attempt: string;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { startQuiz, levelLocked, userProgress } = useQuiz();
  const navigate = useNavigate();
  const [studentPerformance, setStudentPerformance] = useState<StudentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // If no user is logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // If user is a teacher, redirect to admin dashboard
  if (currentUser.role === 'teacher') {
    return <Navigate to="/admin" />;
  }
  
  // Fetch user's performance from Supabase
  useEffect(() => {
    const fetchStudentPerformance = async () => {
      if (!currentUser || !currentUser.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('student_performance')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
          
        if (error) {
          console.error('Error fetching student performance:', error);
        } else if (data) {
          setStudentPerformance(data);
        }
      } catch (error) {
        console.error('Exception fetching student performance:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentPerformance();
  }, [currentUser]);

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
              completedScore={studentPerformance?.level1_score || userProgress.results[1]?.score}
              totalQuestions={10}
              onStart={() => handleStartQuiz(1)}
            />
            
            <LevelCard
              level={2}
              title="Level 2: Medium"
              description="Intermediate questions that require broader knowledge."
              isLocked={false}
              completedScore={studentPerformance?.level2_score || userProgress.results[2]?.score}
              totalQuestions={10}
              onStart={() => handleStartQuiz(2)}
            />
            
            <LevelCard
              level={3}
              title="Level 3: Hard"
              description="Advanced questions that challenge even knowledgeable participants."
              isLocked={false}
              completedScore={studentPerformance?.level3_score || userProgress.results[3]?.score}
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
            
            {isLoading ? (
              <div className="text-center">
                <p>Loading your results...</p>
              </div>
            ) : studentPerformance ? (
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Performance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Test Scores</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span>Level 1:</span>
                            <span className="font-medium">{studentPerformance.level1_score}/10</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Level 2:</span>
                            <span className="font-medium">{studentPerformance.level2_score}/10</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Level 3:</span>
                            <span className="font-medium">{studentPerformance.level3_score}/10</span>
                          </li>
                          <li className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold">{studentPerformance.total_score}/30</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Last Attempt</h3>
                        <p>
                          {studentPerformance.last_attempt 
                            ? new Date(studentPerformance.last_attempt).toLocaleDateString() 
                            : 'No attempts yet'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
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
              </div>
            ) : (userProgress.results[1] || userProgress.results[2] || userProgress.results[3]) ? (
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
                  You haven&apos;t completed any quizzes yet. Take a quiz to see your results here.
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
