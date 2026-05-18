'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
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
  refreshAuth: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use a ref to track and deduplicate concurrent refresh calls
  const refreshPromise = useRef<Promise<string | undefined> | null>(null);

  const refreshAuth = async (): Promise<string | undefined> => {
    // If a refresh is already in progress, return the existing promise
    if (refreshPromise.current) {
      return refreshPromise.current;
    }

    refreshPromise.current = (async () => {
      try {
        const { access_token } = await refreshToken();
        setToken(access_token);
        localStorage.setItem('access_token', access_token);
        
        const latestUser = await getUserMe(access_token);
        setUser(latestUser);
        localStorage.setItem('user', JSON.stringify(latestUser));
        return access_token;
      } catch (error: any) {
        console.error('Refresh failed', error);
        
        if (error.message.toLowerCase().includes('unauthorized') || error.message.toLowerCase().includes('failed to fetch')) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
        throw error;
      } finally {
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  };

  useEffect(() => {
    const initAuth = async () => {
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
        
        try {
          // Confirm current token validity
          const latestUser = await getUserMe(storedToken);
          setUser(latestUser);
          localStorage.setItem('user', JSON.stringify(latestUser));
        } catch (error: any) {
          if (error.message.toLowerCase().includes('expired') || error.message.toLowerCase().includes('unauthorized')) {
            try {
              await refreshAuth();
            } catch (refreshError) {
              // Handled in refreshAuth
            }
          }
        }
      }
      
      setIsInitialized(true);
    };

    initAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        setToken(e.newValue);
      }
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Failed to parse user from storage event', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { access_token, user } = await signIn(email, password);
    setToken(access_token);
    setUser(user);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (username: string, email: string, password: string) => {
    const { access_token, user } = await signUp(username, email, password);
    setToken(access_token);
    setUser(user);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    const currentToken = token;
    if (currentToken) {
      try {
        await signOut(currentToken);
      } catch (error) {
        console.error('Failed to sign out from backend', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    if (currentToken) {
      window.location.reload();
    }
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
    refreshAuth: async () => { 
      return await refreshAuth(); 
    },
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
