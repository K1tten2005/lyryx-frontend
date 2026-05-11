'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SearchBarProps {
  variant?: 'hero' | 'nav';
}

export default function SearchBar({ variant = 'hero' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (variant === 'nav') {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-indigo-300 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-indigo-950/50 border border-indigo-700/50 rounded-full text-sm text-white placeholder-indigo-300/70 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-indigo-900/80 transition-all backdrop-blur-sm"
            placeholder="Search..."
          />
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-0 mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-muted group-focus-within:text-accent transition-colors drop-shadow-md" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-16 pr-6 py-5 bg-white/80 border-2 border-white rounded-full text-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-accent/40 focus:border-accent transition-all shadow-glass font-sans backdrop-blur-md"
          placeholder="Search for songs, artists, or lyrics..."
        />
      </div>
    </form>
  );
}

