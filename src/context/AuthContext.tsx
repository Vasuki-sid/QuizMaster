
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserProfile } from '../types/quiz';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => void;
  updateUserProgress: (progress: any) => void;
  isLoading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: UserProfile[] = [
  {
    id: '1',
    name: 'Student Demo',
    email: 'student@example.com',
    role: 'student',
    progress: {
      highestLevel: 1,
      results: {}
    }
  },
  {
    id: '2',
    name: 'Teacher Demo',
    email: 'teacher@example.com',
    role: 'teacher',
    progress: {
      highestLevel: 3,
      results: {}
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('quiz_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, just check if email matches a mock user
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (user) {
        // In real app, check password hash
        setCurrentUser(user);
        localStorage.setItem('quiz_user', JSON.stringify(user));
        toast.success('Login successful');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error('Email already in use');
        setIsLoading(false);
        return;
      }
      
      // Create new user
      const newUser: UserProfile = {
        id: `${users.length + 1}`,
        name,
        email,
        role,
        progress: {
          highestLevel: 1,
          results: {}
        }
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      localStorage.setItem('quiz_user', JSON.stringify(newUser));
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Signup failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('quiz_user');
    toast.info('Logged out');
  };

  // Update user progress
  const updateUserProgress = (progress: any) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      progress
    };
    
    setCurrentUser(updatedUser);
    
    // Update in users array
    setUsers(users.map(user => user.id === currentUser.id ? updatedUser : user));
    
    // Update in localStorage
    localStorage.setItem('quiz_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, updateUserProgress, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
