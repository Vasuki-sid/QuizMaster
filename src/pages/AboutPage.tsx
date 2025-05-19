
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About QuizMaster</h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            QuizMaster is dedicated to making learning engaging and effective through interactive quizzes 
            that challenge students at every level of knowledge. We believe that testing knowledge in a 
            structured, progressive way helps students retain information better and builds confidence.
          </p>
          <p className="text-gray-700">
            Our platform is designed to help students track their progress while giving teachers valuable 
            insights into their students' performance, making assessment more efficient and informative.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">For Students</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Three difficulty levels to progressively build your knowledge</span>
              </li>
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Track your performance and see detailed results</span>
              </li>
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Challenge yourself with timed quizzes</span>
              </li>
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Unlock higher levels as you improve</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">For Teachers</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Monitor student progress with detailed analytics</span>
              </li>
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Export data for assessment and record-keeping</span>
              </li>
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Track class performance across different levels</span>
              </li>
              <li className="flex items-start">
                <span className="text-quiz-primary mr-2">•</span>
                <span>Identify knowledge gaps to address in teaching</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-quiz-primary mb-2">1. Register an Account</h3>
              <p className="text-gray-700">
                Sign up as a student or teacher to access the platform. Students can track their progress,
                while teachers get access to the admin dashboard.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-quiz-primary mb-2">2. Take Quizzes by Level</h3>
              <p className="text-gray-700">
                Students start with Level 1 (Easy) quizzes. Each level has 10 multiple-choice questions.
                Score at least 70% to unlock the next level.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-quiz-primary mb-2">3. View Your Results</h3>
              <p className="text-gray-700">
                After completing a quiz, students see detailed results including score, time taken,
                and correct/incorrect answers.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-quiz-primary mb-2">4. Track Progress</h3>
              <p className="text-gray-700">
                Students can view their progress across all levels, while teachers can monitor
                performance of all students through the admin dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
