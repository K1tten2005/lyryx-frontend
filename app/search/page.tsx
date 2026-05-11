'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import useSWR from 'swr';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchSearchResults, SearchResultItem } from '@/lib/api/search';
import { Loader2, Music2, AlertCircle, Search } from 'lucide-react';
import SearchCategory from '@/components/search/SearchCategory';
import { ArtistCard, SongCard, UserCard } from '@/components/search/ResultCards';
import SeeAllModal from '@/components/search/SeeAllModal';

type CategoryType = 'artists' | 'songs' | 'lyrics_matched_songs' | 'users' | null;

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const { data: results, error, isLoading } = useSWR(
    query ? ['search', query] : null,
    ([, q]) => fetchSearchResults(q)
  );

  // Modal State
  const [activeCategory, setActiveCategory] = useState<CategoryType>(null);
  const [modalItems, setModalItems] = useState<SearchResultItem[]>([]);
  const [modalOffset, setModalOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Reset modal state when query changes
  useEffect(() => {
    setActiveCategory(null);
  }, [query]);

  // Handle opening the modal and initializing its data
  const handleOpenModal = (category: CategoryType) => {
    setActiveCategory(category);
    setModalOffset(0);
    setHasMore(true);
    
    // We already have the first 20 items from the initial fetch
    if (results && category) {
      setModalItems(results[category]);
      // If we got exactly 20 items, there might be more. If less, we know there aren't.
      setHasMore(results[category].length === 20);
    }
  };

  const handleCloseModal = () => {
    setActiveCategory(null);
  };

  const handleLoadMore = async () => {
    if (!query || !activeCategory || isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const limit = 20;
      const nextOffset = modalOffset + limit;
      
      // We pass the new limit to our fetch function to simulate pagination 
      const moreResults = await fetchSearchResults(query, nextOffset + limit);
      
      const newItems = moreResults[activeCategory] || [];
      
      if (newItems.length > modalItems.length) {
         setModalItems(newItems);
         setModalOffset(nextOffset);
         setHasMore(newItems.length >= nextOffset + limit);
      } else {
         setHasMore(false);
      }
      
    } catch (err) {
      console.error("Failed to load more results", err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!query) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <h1 className="text-4xl font-black mb-8 text-slate-800 drop-shadow-sm">Search Results</h1>
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-glass flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Music2 className="mx-auto h-16 w-16 text-slate-400/80 mb-4 drop-shadow-sm" />
            <p className="text-xl text-slate-700 font-bold">Please enter a search query.</p>
          </div>
        </div>
      </main>
    );
  }

  const isEmpty = results && 
    results.artists.length === 0 && 
    results.songs.length === 0 && 
    results.lyrics_matched_songs.length === 0 && 
    results.users.length === 0;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 relative z-10 max-w-4xl">
      <h1 className="text-4xl font-black mb-8 text-slate-800 drop-shadow-sm">Search Results</h1>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-glass" data-testid="loading-spinner">
          <Loader2 className="h-12 w-12 text-accent animate-spin mb-4 drop-shadow-sm" />
          <p className="text-lg text-slate-700 font-bold animate-pulse">Searching for &quot;{query}&quot;...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50/60 backdrop-blur-xl rounded-3xl p-8 border border-red-200/60 shadow-glass flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500/80 mb-4 drop-shadow-sm" />
            <p className="text-xl text-red-800 font-bold">An error occurred while fetching results.</p>
            <p className="text-red-600/80 mt-2 font-medium">Please try again later.</p>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-glass flex items-center justify-center min-h-[300px]">
           <div className="text-center">
            <Search className="mx-auto h-16 w-16 text-slate-400/80 mb-4 drop-shadow-sm" />
            <p className="text-2xl text-slate-800 font-bold mb-2">No results found</p>
            <p className="text-slate-600 font-medium">
              We couldn&apos;t find anything matching &quot;<span className="font-bold text-accent">{query}</span>&quot;
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <p className="text-xl text-slate-600 mb-6 px-2">
            Showing results for &quot;<span className="font-bold text-indigo-600">{query}</span>&quot;
          </p>
          
          <SearchCategory 
            title="Artists" 
            items={results?.artists || []} 
            renderItem={(artist) => <ArtistCard key={artist.id} artist={artist} />} 
            onSeeAll={() => handleOpenModal('artists')}
          />
          
          <SearchCategory 
            title="Songs" 
            items={results?.songs || []} 
            renderItem={(song) => <SongCard key={song.id} song={song} />} 
            onSeeAll={() => handleOpenModal('songs')}
          />

          <SearchCategory 
            title="Lyrics Matches" 
            items={results?.lyrics_matched_songs || []} 
            renderItem={(song) => <SongCard key={`lyric-${song.id}`} song={song} showSnippet={true} />} 
            onSeeAll={() => handleOpenModal('lyrics_matched_songs')}
          />
          
          <SearchCategory 
            title="Users" 
            items={results?.users || []} 
            renderItem={(user) => <UserCard key={user.id} user={user} />} 
            onSeeAll={() => handleOpenModal('users')}
          />
        </div>
      )}

      <SeeAllModal
        isOpen={activeCategory !== null}
        onClose={handleCloseModal}
        title={
          activeCategory === 'artists' ? 'Artists' :
          activeCategory === 'songs' ? 'Songs' :
          activeCategory === 'lyrics_matched_songs' ? 'Lyrics Matches' :
          activeCategory === 'users' ? 'Users' : ''
        }
        items={modalItems}
        renderItem={(item, index) => {
          if (activeCategory === 'artists') return <ArtistCard key={`modal-${item.id}-${index}`} artist={item} />;
          if (activeCategory === 'songs') return <SongCard key={`modal-${item.id}-${index}`} song={item} />;
          if (activeCategory === 'lyrics_matched_songs') return <SongCard key={`modal-${item.id}-${index}`} song={item} showSnippet={true} />;
          if (activeCategory === 'users') return <UserCard key={`modal-${item.id}-${index}`} user={item} />;
          return <div key={`empty-${index}`} />;
        }}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      <Suspense fallback={
        <main className="flex-grow container mx-auto px-4 py-8 relative z-10 max-w-4xl">
          <h1 className="text-4xl font-black mb-8 text-slate-800 drop-shadow-sm">Search Results</h1>
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-glass animate-pulse" data-testid="loading-spinner">
            <div className="h-8 bg-slate-300/40 rounded-full w-1/3 mb-10"></div>
            <div className="space-y-6">
              <div className="h-24 bg-white/50 rounded-2xl"></div>
              <div className="h-24 bg-white/50 rounded-2xl"></div>
              <div className="h-24 bg-white/50 rounded-2xl"></div>
            </div>
          </div>
        </main>
      }>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}


