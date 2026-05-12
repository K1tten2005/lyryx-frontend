import React from 'react';
import { Annotation } from '@/lib/api/song';

interface AnnotationBubbleProps {
  annotation: Annotation | null;
  onClose: () => void;
}

export function AnnotationBubble({ annotation, onClose }: AnnotationBubbleProps) {
  if (!annotation) return null;

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/50 relative text-black">
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close annotation"
      >
        ×
      </button>
      
      <div className="mb-4 text-sm font-medium leading-relaxed">
        {annotation.content}
      </div>

      <div className="flex items-center gap-2 border-t border-white/30 pt-3">
        {annotation.user.avatar_url ? (
          <img 
            src={annotation.user.avatar_url} 
            alt={annotation.user.username} 
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-500/50" />
        )}
        <span className="text-xs font-semibold text-blue-900">{annotation.user.username}</span>
        <span className="text-xs text-blue-800/80 ml-auto flex items-center gap-1">
          <span>★</span> {annotation.user.reputation_score}
        </span>
      </div>
    </div>
  );
}
