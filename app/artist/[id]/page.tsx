'use client';

import { useEffect, useState } from 'react';
import { getArtistById, ArtistProfile } from '@/lib/api/artist';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Music, Calendar, Eye, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ArtistPage({ params }: { params: { id: string } }) {
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const artistId = parseInt(params.id);
        const data = await getArtistById(artistId);
        if (!data) {
          notFound();
          return;
        }
        setArtist(data);
      } catch (err: any) {
        if (err.message === 'NEXT_NOT_FOUND') {
          notFound();
        } else {
          setError(err.message || 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-48 h-48 rounded-full bg-white/50 shadow-glass"></div>
          <div className="h-10 w-64 bg-white/50 rounded-2xl"></div>
          <div className="h-6 w-96 bg-white/40 rounded-xl"></div>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-glass text-center">
          <h1 className="text-2xl font-black text-red-500 mb-2">Error</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (!artist) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 md:py-20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          {/* Centered Header Section */}
          <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-top-8 duration-700">
            <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent to-purple-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-glass border-4 border-white/80 flex items-center justify-center bg-white/40 backdrop-blur-md">
                {artist.avatar_url ? (
                  <Image 
                    src={artist.avatar_url} 
                    alt={`${artist.name} avatar`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <User className="w-20 h-20 text-accent/50" />
                )}
                <div className="absolute inset-0 bg-glossy-button opacity-20 pointer-events-none rounded-full"></div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-6">
              {artist.name}
            </h1>
            
            <div className="max-w-2xl bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-glass">
              {artist.bio ? (
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                  {artist.bio}
                </p>
              ) : (
                <p className="text-lg md:text-xl text-slate-400 italic font-medium">
                  Biography not provided
                </p>
              )}
            </div>
          </div>

          {/* Songs Vertical List Section */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1.5 bg-gradient-to-r from-accent to-purple-400 rounded-full"></div>
              <h2 className="text-3xl font-black uppercase tracking-widest text-slate-800">
                Discography
              </h2>
            </div>

            {artist.songs && artist.songs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {artist.songs.map((song) => (
                  <Link 
                    href={`/song/${song.id}`} 
                    key={song.id}
                    className="group flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-3xl border border-white/50 shadow-glass-sm hover:shadow-glass transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm">
                      {song.cover_url ? (
                        <Image 
                          src={song.cover_url} 
                          alt={`${song.title} cover`} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                          <Music className="w-10 h-10 text-accent/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-center text-center sm:text-left w-full">
                      <h3 className="text-2xl font-black text-slate-800 group-hover:text-accent transition-colors mb-4 line-clamp-1">
                        {song.title}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-white/30 text-slate-600 font-bold text-sm shadow-sm">
                          <Calendar className="w-4 h-4 text-accent" />
                          <span>{song.release_date ? new Date(song.release_date).toLocaleDateString() : 'Unknown Date'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-white/30 text-slate-600 font-bold text-sm shadow-sm">
                          <Eye className="w-4 h-4 text-accent" />
                          <span>{song.views ? song.views.toLocaleString() : '0'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-glass p-16 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-6">
                  <Music className="w-10 h-10 text-accent/50" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">No songs found</h3>
                <p className="text-slate-500 font-medium text-lg">This artist hasn't added any songs yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
