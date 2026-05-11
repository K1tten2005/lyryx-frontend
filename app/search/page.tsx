'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-sky-900 drop-shadow-sm">Search Results</h1>
      
      {!query ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
          <p className="text-lg text-sky-800">Please enter a search query.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
            <p className="text-xl text-sky-900 mb-4">
              Results for &quot;<span className="font-semibold">{query}</span>&quot;
            </p>
            
            {/* Placeholder for results */}
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-sky-300 rounded-xl text-sky-400">
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
    <div className="min-h-screen flex flex-col bg-sky-100">
      <Navbar />
      <Suspense fallback={
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-sky-900 drop-shadow-sm">Search Results</h1>
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl animate-pulse">
            <div className="h-8 bg-sky-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-sky-50 rounded-xl"></div>
          </div>
        </main>
      }>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}
