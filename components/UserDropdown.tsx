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
        className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all border ${
          isOpen 
            ? 'bg-indigo-900 border-indigo-700 text-white shadow-inner' 
            : 'bg-indigo-900/40 border-indigo-800/40 text-zinc-300 hover:bg-indigo-900/80 hover:text-white hover:border-indigo-700/60 shadow-sm'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-indigo-950 shrink-0">
          {user.avatar_url ? (
            <Image 
              src={user.avatar_url} 
              alt={`${user.username} avatar`} 
              width={32} 
              height={32} 
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-5 h-5 text-indigo-400" />
          )}
        </div>
        <span className="text-sm font-medium tracking-wide">
          {user.reputation_score} RS
        </span>
      </button>

      {isOpen && (
        <div 
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 border border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
        >
          <div className="px-4 py-2 border-b border-zinc-100 mb-1">
            <p className="text-sm font-semibold text-zinc-900 truncate">
              {user.username}
            </p>
            <p className="text-xs text-zinc-500 truncate">
              {user.email}
            </p>
          </div>
          
          <Link
            href={`/user/${user.user_id}`}
            role="menuitem"
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <UserCircle className="w-4 h-4" />
            Profile
          </Link>
          
          <button
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
