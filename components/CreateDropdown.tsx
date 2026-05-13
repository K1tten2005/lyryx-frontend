'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, UserPlus, Music } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CreateArtistModal from './CreateArtistModal';

export default function CreateDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user || user.role !== 'moderator') return null;

  return (
    <>
      <div className="relative mr-4" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 rounded-full border ${
            isOpen 
              ? 'bg-emerald-500 border-emerald-400 text-white shadow-inner' 
              : 'bg-white/10 border-white/30 text-white hover:border-emerald-400 hover:bg-emerald-500/80 shadow-glass backdrop-blur-md'
          } font-bold focus:outline-none`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <Plus className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
          Создать
        </button>

        {isOpen && (
          <div 
            role="menu"
            className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl py-2 animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden origin-top-right"
          >
            <button
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                setIsArtistModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
            >
              <UserPlus className="w-5 h-5 text-emerald-500" />
              Артиста
            </button>
          </div>
        )}
      </div>

      <CreateArtistModal 
        isOpen={isArtistModalOpen} 
        onClose={() => setIsArtistModalOpen(false)} 
      />
    </>
  );
}
