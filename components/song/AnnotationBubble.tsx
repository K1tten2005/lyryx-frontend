import React, { useEffect, useRef } from 'react';
import { Annotation } from '@/lib/api/song';
import Link from 'next/link';

interface AnnotationBubbleProps {
  annotation: Annotation | null;
  onClose: () => void;
}

export function AnnotationBubble({ annotation, onClose }: AnnotationBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Delay adding the event listener to prevent immediate closing when clicking the highlight
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!annotation) return null;

  return (
    <div 
      ref={bubbleRef}
      className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-glass border border-white/60 relative text-slate-800 animate-in fade-in zoom-in-95 duration-300 w-full min-h-[150px] flex flex-col"
    >
      {/* Glossy Pointer/Tail */}
      <div className="absolute top-10 -left-4 w-8 h-8 bg-white/60 backdrop-blur-xl border-l border-t border-white/60 rotate-[-45deg] hidden lg:block z-0 shadow-[-4px_-4px_10px_-4px_rgba(0,0,0,0.1)]"></div>
      
      <div className="relative z-10">
        {/* User Info at Top */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href={annotation.user?.user_id ? `/user/${annotation.user.user_id}` : '#'}
            className="flex items-center gap-3 group"
          >
            {annotation.user?.avatar_url ? (
              <img 
                src={annotation.user.avatar_url} 
                alt={annotation.user.username} 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent/40 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">
                {annotation.user?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 group-hover:text-accent transition-colors">
                {annotation.user?.username || 'Anonymous'}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {annotation.user?.reputation_score || 0} RS
              </span>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="text-base md:text-lg font-bold leading-relaxed text-slate-700 whitespace-pre-wrap break-words mb-4">
          {annotation.content}
        </div>

        {/* Rating After Content */}
        <div className="flex items-center gap-2 bg-accent/10 w-fit px-3 py-1.5 rounded-xl border border-accent/20">
          <span className="text-accent text-base">★</span>
          <span className="text-sm font-black text-accent">{annotation.rating || 0}</span>
        </div>
      </div>

      {/* Frutiger Aero Glossy Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-[2.5rem] pointer-events-none"></div>
    </div>
  );
}

