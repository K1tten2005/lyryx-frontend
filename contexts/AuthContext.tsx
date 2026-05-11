'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signUp, signOut, UserInfo } from '@/lib/api/auth';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (...args: Parameters<typeof signIn>) => Promise<void>;
  register: (...args: Parameters<typeof signUp>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load auth state from local storage on mount
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsInitialized(true);
  }, []);

  const login = async (...args: Parameters<typeof signIn>) => {
    const { access_token, user } = await signIn(...args);
    setToken(access_token);
    setUser(user);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (...args: Parameters<typeof signUp>) => {
    const { access_token, user } = await signUp(...args);
    setToken(access_token);
    setUser(user);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    if (token) {
      try {
        await signOut(token);
      } catch (error) {
        console.error('Failed to sign out from backend', error);
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!token,
    isInitialized,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
