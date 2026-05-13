import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AskAIPromptProps {
  onClick: () => void;
}

export function AskAIPrompt({ onClick }: AskAIPromptProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "group relative flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap",
        "bg-indigo-500/90 text-white shadow-glass-hover hover:scale-105 active:scale-95 transition-all duration-300",
        "border-2 border-white/60 font-black uppercase tracking-widest text-xs",
        "backdrop-blur-md pointer-events-auto cursor-pointer animate-fade-zoom overflow-hidden"
      )}
      aria-label="Спросить ИИ"
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-2xl pointer-events-none"></div>
      
      {/* Animated shimmer */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>

      <div className="bg-white/20 p-1.5 rounded-lg pointer-events-none relative z-10">
        <Sparkles className="w-4 h-4 relative z-10 text-yellow-200 fill-yellow-200/20" />
      </div>
      <span className="relative z-10 drop-shadow-md pointer-events-none">Спросить ИИ</span>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-indigo-400/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full -z-10"></div>
    </button>
  );
}
