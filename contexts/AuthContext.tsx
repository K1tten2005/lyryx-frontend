'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signUp, signOut, UserInfo } from '@/lib/api/auth';
import { getUserMe } from '@/lib/api/user';

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

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
      
      // Sync with backend to get latest info (like avatar)
      getUserMe(storedToken)
        .then((latestUser) => {
          setUser(latestUser);
          localStorage.setItem('user', JSON.stringify(latestUser));
        })
        .catch((err) => {
          console.error('Failed to sync user profile', err);
        })
        .finally(() => {
          setIsInitialized(true);
        });
    } else {
      setIsInitialized(true);
    }
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
    // We intentionally do NOT call setToken(null) or setUser(null) here.
    // Doing so causes the UI to re-render in a "logged out" state for a split 
    // second before the window.location.reload() takes effect, creating a flicker.
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.reload();
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
