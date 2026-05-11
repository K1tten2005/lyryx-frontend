'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import useSWR from 'swr';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSearchResults } from '@/lib/api/search';
import { Loader2 } from 'lucide-react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const { data: results, error, isLoading } = useSWR(
    query ? ['search', query] : null,
    ([, q]) => fetchSearchResults(q)
  );

  if (!query) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-black mb-8 text-slate-800 drop-shadow-sm">Search Results</h1>
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
          <p className="text-lg text-slate-700">Please enter a search query.</p>
        </div>
      </main>
    );
  }

  const isEmpty = results && 
    results.artists.length === 0 && 
    results.songs.length === 0 && 
    results.lyrics.length === 0 && 
    results.users.length === 0;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
      <h1 className="text-4xl font-black mb-8 text-slate-800 drop-shadow-sm">Search Results</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20" data-testid="loading-spinner">
          <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
          <p className="text-lg text-slate-600 animate-pulse">Searching for "{query}"...</p>
        </div>
      ) : error ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-red-200 shadow-xl">
          <p className="text-lg text-red-600">An error occurred while fetching results. Please try again.</p>
        </div>
      ) : isEmpty ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
          <p className="text-xl text-slate-700">
            No results found for &quot;<span className="font-bold text-accent">{query}</span>&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
            <p className="text-xl text-slate-800 mb-4">
              Results for &quot;<span className="font-bold text-accent">{query}</span>&quot;
            </p>
            
            {/* Placeholder for results */}
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 font-medium">
              Categorized results will appear here...
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      {/* Background elements consistent with the rest of the site */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent-light/30 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      <Suspense fallback={
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <h1 className="text-4xl font-black mb-8 text-slate-800 drop-shadow-sm">Search Results</h1>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl animate-pulse" data-testid="loading-spinner">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-slate-100 rounded-xl"></div>
          </div>
        </main>
      }>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}

