import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateAnnotationPromptProps {
  onClick: () => void;
}

export function CreateAnnotationPrompt({ onClick }: CreateAnnotationPromptProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap",
        "bg-accent/90 text-white shadow-glass-hover hover:scale-105 active:scale-95 transition-all duration-300",
        "border-2 border-white/60 font-black uppercase tracking-widest text-xs",
        "backdrop-blur-md pointer-events-auto cursor-pointer animate-fade-zoom"
      )}
      aria-label="Add annotation"
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl pointer-events-none"></div>
      <div className="bg-white/20 p-1.5 rounded-lg pointer-events-none">
        <Plus className="w-4 h-4 relative z-10" />
      </div>
      <span className="relative z-10 drop-shadow-sm pointer-events-none">Добавить аннотацию</span>
    </button>
  );
}
