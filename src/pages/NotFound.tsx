
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-quiz-primary mb-4">404</h1>
      <p className="text-2xl font-semibold mb-6">Page not found</p>
      <p className="text-gray-600 max-w-md text-center mb-8">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button className="bg-quiz-primary hover:bg-quiz-secondary">
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
