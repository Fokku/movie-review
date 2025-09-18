import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  favoriteGenres?: string[];
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'kai',
    email: 'kai@test.com',
    bio: 'i love movies yum',
    favoriteGenres: ['Sci-Fi', 'Thriller', 'Action'],
    joinedDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('cinereviews_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('cinereviews_user');
      }
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('cinereviews_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cinereviews_user');
    }
  }, [user]);

  const login = async (email: string, password: string, name?: string): Promise<boolean> => {
    // Demo login - check against demo users
    const demoUser = DEMO_USERS.find(u => u.email === email);
    
    if (demoUser && password === 'demo123') {
      setUser(demoUser);
      return true;
    }

    // REMOVE IN PROD
    // For any other email/password combination, create a demo user
    if (email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name: name || email.split('@')[0],
        email,
        bio: 'New user',
        favoriteGenres: [],
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setUser(newUser);
      return true;
    }

    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // REMOVE IN PROD
    // For demo purposes, any valid input creates a user
    if (email && password && name) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        bio: 'New user',
        favoriteGenres: [],
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
