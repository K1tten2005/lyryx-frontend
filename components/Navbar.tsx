'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';
import UserDropdown from './UserDropdown';

export default function Navbar() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-b from-indigo-900 to-indigo-950 sticky top-0 z-50 border-b border-indigo-800 shadow-glass">
        <div className="w-1/3">
          {/* Placeholder for left-side navigation if needed */}
        </div>

        <div className="w-1/3 flex justify-center">
          <Link href="/" className="text-3xl font-bold tracking-tight text-white drop-shadow-md hover:text-indigo-200 transition-colors">
            LYRYX
          </Link>
        </div>

        <div className="w-1/3 flex justify-end h-10">
          {!isInitialized ? null : isAuthenticated ? (
            <UserDropdown />
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-primary py-2"
            >
              Log In
            </button>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
