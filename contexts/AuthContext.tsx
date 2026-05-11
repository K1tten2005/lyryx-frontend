'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signUp, signOut, refreshToken, UserInfo } from '@/lib/api/auth';
import { getUserMe } from '@/lib/api/user';

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (...args: Parameters<typeof signIn>) => Promise<void>;
  register: (...args: Parameters<typeof signUp>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: UserInfo) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const refreshAuth = async () => {
    try {
      const { access_token } = await refreshToken();
      setToken(access_token);
      localStorage.setItem('access_token', access_token);
      
      const latestUser = await getUserMe(access_token);
      setUser(latestUser);
      localStorage.setItem('user', JSON.stringify(latestUser));
      return access_token;
    } catch (error) {
      console.error('Refresh failed', error);
      // If we had a session but refresh failed, it might mean the refresh token is also expired
      if (token) {
        logout();
      }
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
        
        try {
          // Attempt refresh on mount to ensure we have a valid access token
          await refreshAuth();
        } catch (error) {
          // refreshAuth handles logout on failure if token was present
        }
      } else {
        // Try refreshing even if no stored token (cookie-based refresh)
        try {
          await refreshAuth();
        } catch (error) {
          // No session
        }
      }
      setIsInitialized(true);
    };

    initAuth();
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    // We intentionally do NOT call setToken(null) or setUser(null) here.
    // Doing so causes the UI to re-render in a "logged out" state for a split 
    // second before the window.location.reload() takes effect, creating a flicker.
    window.location.reload();
  };

  const updateUser = (updatedUser: UserInfo) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isInitialized,
    login,
    register,
    logout,
    updateUser,
    refreshAuth: async () => { await refreshAuth(); },
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
