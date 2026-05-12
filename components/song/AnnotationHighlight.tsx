import React from 'react';
import { cn } from '@/lib/utils'; // Assuming standard shadcn/tailwind class merger exists

interface AnnotationHighlightProps {
  id: number;
  children: React.ReactNode;
  onClick: (id: number) => void;
  isActive?: boolean;
}

export function AnnotationHighlight({ id, children, onClick, isActive = false }: AnnotationHighlightProps) {
  return (
    <span
      className={cn(
        "cursor-pointer transition-colors duration-200 rounded-sm",
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
