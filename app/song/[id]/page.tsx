'use client';

import { useEffect, useState } from 'react';
import { getSongById, Song } from '@/lib/api/song';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Music } from 'lucide-react';

export default function SongPage({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSongById(parseInt(params.id));
        if (!data) {
          notFound();
          return;
        }
        setSong(data);
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return dateString.split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-64 h-64 bg-white/50 rounded-2xl mb-8 shadow-glass"></div>
            <div className="h-8 w-48 bg-white/50 rounded-lg mb-4"></div>
            <div className="h-6 w-32 bg-white/50 rounded-lg"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-glass max-w-md w-full text-center">
            <h1 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-tight">Error</h1>
            <p className="text-slate-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!song) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Cover Image */}
            <div className="relative w-full md:w-72 h-72 rounded-3xl overflow-hidden shadow-glass border-4 border-white/80 group">
              {song.cover_url ? (
                <Image
                  src={song.cover_url}
                  alt={`${song.title} cover`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <Music className="w-24 h-24 text-accent/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-glossy-button opacity-30 pointer-events-none"></div>
            </div>

            {/* Song Info */}
            <div className="flex-grow flex flex-col justify-end py-2">
              <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-4 leading-tight">
                {song.title}
              </h1>
              <div className="flex flex-wrap gap-6 items-center text-slate-600 font-bold">
                <Link 
                  href={`/artist/${song.artist.id}`}
                  className="text-2xl text-accent hover:text-accent-hover transition-colors drop-shadow-sm"
                >
                  {song.artist.name}
                </Link>
                
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <Calendar className="w-4 h-4" />
                  <span>{song.release_date || 'Unknown'}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  <Eye className="w-4 h-4" />
                  <span>{song.views?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lyrics and Annotations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            {/* Left Column (Lyrics) */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-black uppercase tracking-widest text-accent mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-accent rounded-full"></span>
                Lyrics
              </h2>
              <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/50 shadow-glass relative overflow-hidden overflow-x-auto">
                {/* Glossy overlay */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                
                <pre className="text-xl md:text-2xl leading-relaxed text-slate-700 font-medium whitespace-pre font-sans relative z-10 min-w-max">
                  {song.lyrics}
                </pre>
              </div>
            </div>

            {/* Right Column (Placeholder for Annotations) */}
            <div className="lg:col-span-4 hidden lg:block">
              {/* This space is reserved for annotations */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
