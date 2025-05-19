
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-quiz-primary/10 to-quiz-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Test Your Knowledge
              <span className="block text-quiz-primary">with QuizMaster</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Challenge yourself with our multi-level quizzes and track your progress over time.
              From beginners to experts, we have quizzes for every level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {currentUser ? (
                <Link to="/dashboard">
                  <Button className="quiz-btn quiz-btn-primary text-lg px-8 py-4">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button className="quiz-btn quiz-btn-primary text-lg px-8 py-4">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="text-lg px-8 py-4 border-quiz-primary text-quiz-primary hover:bg-quiz-primary hover:text-white">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-quiz-primary/15 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-quiz-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Level</h3>
              <p className="text-gray-600">
                Start with Easy quizzes and progress to more challenging levels as you improve.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-quiz-primary/15 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-quiz-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Test Your Knowledge</h3>
              <p className="text-gray-600">
                Answer multiple-choice questions, track your time, and see instant results.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-quiz-primary/15 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-quiz-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Your Progress</h3>
              <p className="text-gray-600">
                Review detailed performance analytics and unlock new challenges as you improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Student Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-quiz-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Amit Sharma</h4>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "QuizMaster helped me prepare for my general knowledge exams. The difficulty progression is perfect for building confidence."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-quiz-secondary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  P
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Priya Patel</h4>
                  <p className="text-sm text-gray-500">Teacher</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a teacher, I love how I can track all my students' progress in one place. It saves me so much time on assessments."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-quiz-tertiary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  R
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Rahul Verma</h4>
                  <p className="text-sm text-gray-500">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The timed quizzes have helped me improve my speed and accuracy. I've seen a marked improvement in my test scores."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-quiz-primary to-quiz-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Test Your Knowledge?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who are improving their knowledge and skills with QuizMaster.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={currentUser ? "/dashboard" : "/signup"}>
              <Button className="bg-white text-quiz-primary hover:bg-gray-100 text-lg px-8 py-4">
                {currentUser ? "Go to Dashboard" : "Start Now"}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 text-lg px-8 py-4">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
