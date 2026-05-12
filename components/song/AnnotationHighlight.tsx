import React from 'react';
import { cn } from '@/lib/utils'; // Assuming standard shadcn/tailwind class merger exists

interface AnnotationHighlightProps {
  id: number;
  children: React.ReactNode;
  onClick: (id: number) => void;
  isActive?: boolean;
  index?: number;
}

export function AnnotationHighlight({ id, children, onClick, isActive = false }: AnnotationHighlightProps) {
  return (
    <span
      data-annotation-id={id}
      className={cn(
        "cursor-pointer transition-colors duration-200 rounded-sm shadow-[inset_1px_0_0_rgba(255,255,255,0.4),inset_-1px_0_0_rgba(255,255,255,0.4)]",
        isActive ? "bg-yellow-200" : "bg-gray-200 hover:bg-gray-300"
      )}
      onClick={() => onClick(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(id);
        }
      }}
    >
      {children}
    </span>
  );
}
