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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-surface bg-glass-panel backdrop-blur-md rounded-3xl border border-white/50 shadow-glass overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/40">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight drop-shadow-sm">
            {view === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/50 text-slate-500 transition-all shadow-inner-glow"
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
                Don&apos;t have an account?{' '}                <button
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
                  className="font-bold text-accent hover:text-accent-hover hover:underline transition-colors uppercase tracking-widest text-xs"
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
