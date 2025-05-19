
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
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        } else if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && currentSession) {
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
      console.log("Fetching profile for user:", userId);
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
        console.log("Profile found:", profile);
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
      } else {
        console.log("No profile found for user:", userId);
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
      
      // Try to sign out globally first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out failed, continuing with login");
      }
      
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
      
      // Try to sign out globally first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out failed, continuing with signup");
      }
      
      console.log("Signing up with:", { name, email, role });
      
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
        console.error("Signup error:", error);
        throw error;
      }
      
      console.log("Signup successful:", data);
      
      if (data.user) {
        toast.success('Account created successfully');
        
        // Force a small delay to allow Supabase to process the signup
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // We need to wait for the trigger to create the profile
        setTimeout(async () => {
          try {
            await fetchUserProfile(data.user!.id);
          } catch (err) {
            console.error("Error fetching new user profile:", err);
          }
        }, 500);
      } else {
        toast.info('Please check your email to confirm your account');
      }
    } catch (error: any) {
      console.error("Signup error caught:", error);
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
      await supabase.auth.signOut({ scope: 'global' });
      
      setCurrentUser(null);
      toast.info('Logged out');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      console.error(error);
    }
  };

  // Helper function to clean up auth state
  const cleanupAuthState = () => {
    console.log("Cleaning up auth state");
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Also clean up sessionStorage if needed
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
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
