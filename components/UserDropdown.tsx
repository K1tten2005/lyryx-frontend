'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 pl-1 pr-4 py-1 transition-all rounded-full border border-white/50 ${
          isOpen 
            ? 'bg-white/80 shadow-inner-glow' 
            : 'bg-surface shadow-glass hover:bg-white/90'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-accent to-accent-light shrink-0 border-2 border-white shadow-sm">
          {user.avatar_url ? (
            <Image 
              src={user.avatar_url} 
              alt={`${user.username} avatar`} 
              width={40} 
              height={40} 
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
        <span className="text-sm font-bold tracking-widest uppercase font-sans">
          {user.reputation_score} RS
        </span>
      </button>

      {isOpen && (
        <div 
          role="menu"
          className="absolute right-0 mt-2 w-56 bg-surface border-4 border-border shadow-brutal py-0 animate-in fade-in slide-in-from-top-2 duration-150 z-50 overflow-hidden"
        >
          <div className="px-4 py-4 border-b-4 border-border bg-accent text-white mb-0">
            <p className="text-sm font-black truncate uppercase tracking-widest font-sans">
              {user.username}
            </p>
            <p className="text-xs text-white/80 truncate font-bold mt-1">
              {user.email}
            </p>
          </div>
          
          <Link
            href={`/user/${user.user_id}`}
            role="menuitem"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-white transition-colors border-b-2 border-border"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <UserCircle className="w-5 h-5" />
            Profile
          </Link>
          
          <button
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
