'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, UserCircle, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import CreateArtistModal from './CreateArtistModal';

export default function UserDropdown() {
  const { user, logout } = useAuth();
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

  if (!user) return null;

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 pl-1.5 pr-4 py-1.5 transition-all duration-300 rounded-full border ${
            isOpen 
              ? 'bg-white/20 border-white/60 shadow-inner' 
              : 'bg-white/10 border-white/30 hover:border-white/50 hover:bg-white/20 shadow-glass backdrop-blur-md'
          } focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-indigo-900`}
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-400 to-accent-light shrink-0 shadow-sm relative group-hover:shadow-md transition-shadow">
            {user.avatar_url ? (
              <Image 
                src={user.avatar_url} 
                alt={`${user.username} avatar`} 
                width={32} 
                height={32} 
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            {user.reputation_score} RS
          </span>
        </button>

        {isOpen && (
          <div 
            role="menu"
            className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl py-2 animate-in fade-in zoom-in-95 duration-200 z-50 overflow-hidden origin-top-right"
          >
            <div className="px-4 py-3 mb-2 border-b border-slate-200/60 bg-gradient-to-br from-indigo-50/50 to-sky-50/50">
              <p className="text-sm font-bold text-slate-800 truncate">
                {user.username}
              </p>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {user.email}
              </p>
            </div>
            
            <Link
              href={`/user/${user.user_id}`}
              role="menuitem"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-indigo-100 hover:text-indigo-800 transition-colors"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <UserCircle className="w-5 h-5 text-indigo-500" />
              Profile
            </Link>

            {user.role === 'moderator' && (
              <button
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  setIsArtistModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors"
              >
                <UserPlus className="w-5 h-5 text-emerald-500" />
                Create Artist
              </button>
            )}
            
            <button
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              Logout
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
