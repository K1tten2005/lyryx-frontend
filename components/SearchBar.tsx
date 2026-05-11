'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

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
