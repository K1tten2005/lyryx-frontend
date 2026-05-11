'use client';

import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h2 className="text-xl font-semibold text-zinc-900">
            {view === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {view === 'login' ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <RegisterForm onSuccess={onClose} />
          )}

          <div className="mt-6 text-center text-sm text-zinc-600">
            {view === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setView('register')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setView('login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
