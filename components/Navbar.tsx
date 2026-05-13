'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AuthModal from './AuthModal';
import UserDropdown from './UserDropdown';
import CreateDropdown from './CreateDropdown';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';

  return (
    <>
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-b from-indigo-900 to-indigo-950 sticky top-0 z-50 border-b border-indigo-800 shadow-lg">
        <div className="w-1/3 flex items-center">
          {!isHomePage && (
            <div className="hidden md:block w-full">
              <SearchBar variant="nav" />
            </div>
          )}
        </div>

        <div className="w-1/3 flex justify-center">
          <Link href="/" className="text-3xl font-bold tracking-tight text-white drop-shadow-md hover:text-indigo-200 transition-colors">
            LYRYX
          </Link>
        </div>

        <div className="w-1/3 flex justify-end items-center h-10">
          {!isInitialized ? null : isAuthenticated ? (
            <>
              <CreateDropdown />
              <UserDropdown />
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-white font-semibold rounded-full shadow-glass backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-indigo-900"
            >
              Войти
            </button>
          )}
        </div>
      </nav>

      {/* Mobile search bar for non-home pages */}
      {!isHomePage && (
        <div className="md:hidden px-4 py-3 bg-indigo-950 border-b border-indigo-900">
           <SearchBar variant="nav" />
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

