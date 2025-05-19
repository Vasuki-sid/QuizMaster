
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      console.log("Login successful, redirecting...");
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else {
        setError(err.message || 'Failed to log in');
      }
    }
  };

  // Demo accounts for quick testing
  const useDemoAccount = (type: 'student' | 'teacher') => {
    if (type === 'student') {
      setEmail('student@example.com');
      setPassword('password123');
    } else {
      setEmail('teacher@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-600 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link to="#" className="text-sm text-quiz-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-quiz-primary hover:bg-quiz-secondary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-500">Don't have an account?</span>{' '}
              <Link to="/signup" className="text-quiz-primary hover:underline">
                Sign up
              </Link>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-center text-gray-500">Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => useDemoAccount('student')}
                >
                  Use Student Demo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => useDemoAccount('teacher')}
                >
                  Use Teacher Demo
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <div className="w-full text-center text-xs text-gray-500">
            <p>Note: New accounts will be created and stored in Supabase when you sign up.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
