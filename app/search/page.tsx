'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
      <h1 className="text-4xl font-black mb-8 text-slate-800 drop-shadow-sm">Search Results</h1>
      
      {!query ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
          <p className="text-lg text-slate-700">Please enter a search query.</p>
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
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl animate-pulse">
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

