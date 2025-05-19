
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserProfile } from '../types/quiz';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => Promise<void>;
  updateUserProgress: (progress: any) => void;
  isLoading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  // Initialize auth state and set up listener
  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        } else if (event === 'SIGNED_IN' && currentSession) {
          // Defer fetching additional data to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (profile) {
        // Convert Supabase profile to our app's UserProfile format
        setCurrentUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as 'student' | 'teacher',
          progress: {
            highestLevel: 1,
            results: {}
          }
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: 'student' | 'teacher') => {
    setIsLoading(true);
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Sign up with email/password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out
      await supabase.auth.signOut();
      
      setCurrentUser(null);
      toast.info('Logged out');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      console.error(error);
    }
  };

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Update user progress
  const updateUserProgress = async (progress: any) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      progress
    };
    
    setCurrentUser(updatedUser);
    
    // In a real implementation, we would save this to the database
    // For now, we'll just track quiz attempts
    if (progress.results && Object.keys(progress.results).length > 0) {
      try {
        // Get the latest quiz result
        const levelKey = Object.keys(progress.results).pop() || "";
        const levelNum = parseInt(levelKey.replace("level", ""));
        const result = progress.results[levelKey];
        
        if (levelNum && result && session?.user) {
          await supabase.from('quiz_attempts').insert({
            user_id: session.user.id,
            level: levelNum,
            score: result.score,
            total_questions: result.total
          });
        }
      } catch (error) {
        console.error('Error saving quiz attempt:', error);
      }
    }
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
