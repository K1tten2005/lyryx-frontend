import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIBubbleProps {
  onClose: () => void;
  onSubmit: (question: string) => void;
  status: 'idle' | 'loading' | 'result' | 'error';
  aiResponse: string;
  errorMessage: string;
  question: string;
  setQuestion: (q: string) => void;
  onReset: () => void;
}

export function AIBubble({ 
  onClose, 
  onSubmit, 
  status, 
  aiResponse, 
  errorMessage, 
  question, 
  setQuestion,
  onReset 
}: AIBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || status === 'loading') return;
    onSubmit(question);
  };

  return (
    <div 
      ref={bubbleRef}
      className={cn(
        "bg-indigo-50/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-glass border border-white/60 relative text-slate-800 w-full min-h-[200px] flex flex-col animate-fade-zoom overflow-hidden pointer-events-auto"
      )}
    >
      {/* Frutiger Aero Glossy Pointer/Tail */}
      <div className="absolute top-10 -left-4 w-8 h-8 bg-indigo-50/60 backdrop-blur-2xl border-l border-t border-white/60 rotate-[-45deg] hidden lg:block z-0 shadow-[-4px_-4px_10px_-4px_rgba(0,0,0,0.1)]"></div>
      
      {/* Glossy Overlays */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-[2.5rem] pointer-events-none z-0"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400/10 blur-[80px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full h-full flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/30">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">ИИ Объяснение</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white/40 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content States */}
        <div className="flex-grow flex flex-col">
          {status === 'idle' && (
            <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
              <textarea
                autoFocus
                className="w-full bg-white/40 border-2 border-white/80 rounded-2xl p-4 text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 min-h-[120px] transition-all resize-none mb-4 shadow-inset-heavy"
                placeholder="Что бы вы хотели узнать об этих словах?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button
                type="submit"
                disabled={!question.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 px-8 bg-indigo-600 text-white font-bold rounded-full shadow-lg shadow-indigo-600/30 border border-white/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send size={16} />
                <span>Спросить ИИ</span>
              </button>
            </form>
          )}

          {status === 'loading' && (
            <div className="flex flex-col items-center justify-center flex-grow py-8" data-testid="ai-loading-indicator">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500 animate-pulse" />
              </div>
              <p className="mt-4 font-black uppercase tracking-widest text-xs text-indigo-400 animate-pulse">Спрашиваем у ИИ...</p>
            </div>
          )}

          {status === 'result' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col flex-grow min-h-0">
              <div className="text-base md:text-lg font-bold leading-relaxed text-slate-700 whitespace-pre-wrap break-words mb-6 bg-white/30 p-6 rounded-3xl border border-white/40 shadow-inset-heavy overflow-y-auto max-h-[400px] custom-scrollbar">
                {aiResponse || 'The AI provided an empty response. Please try again.'}
              </div>
              <button
                onClick={onReset}
                className="mt-auto self-end text-xs font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                Задать другой вопрос
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center flex-grow py-8 text-center">
              <div className="bg-red-100 p-3 rounded-2xl mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-500 font-bold mb-6">{errorMessage}</p>
              <button
                onClick={onReset}
                className="py-2 px-6 bg-white/60 text-slate-600 font-bold rounded-full hover:bg-white/80 transition-all border border-slate-200"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
