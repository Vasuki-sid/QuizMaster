
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-quiz-primary hover:text-quiz-secondary transition-colors">
          QuizMaster
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-quiz-primary transition-colors">
            Home
          </Link>
          {currentUser && (
            <>
              {currentUser.role === 'student' && (
                <Link to="/dashboard" className="text-gray-700 hover:text-quiz-primary transition-colors">
                  My Dashboard
                </Link>
              )}
              {currentUser.role === 'teacher' && (
                <Link to="/admin" className="text-gray-700 hover:text-quiz-primary transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
          <Link to="/about" className="text-gray-700 hover:text-quiz-primary transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                Hi, {currentUser.name}
              </span>
              <Button 
                variant="outline" 
                onClick={logout} 
                className="border-quiz-primary text-quiz-primary hover:bg-quiz-primary hover:text-white"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="border-quiz-primary text-quiz-primary hover:bg-quiz-primary hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-quiz-primary text-white hover:bg-quiz-secondary">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
