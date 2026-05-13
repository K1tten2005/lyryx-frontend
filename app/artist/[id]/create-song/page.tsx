'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { createSong } from '@/lib/api/song';
import { getArtistById, ArtistProfile } from '@/lib/api/artist';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, Music } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  release_date: z.string().min(1, 'Release date is required'),
  lyrics: z.string().min(1, 'Lyrics are required'),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateSongPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, token, isAuthenticated, refreshAuth } = useAuth();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    const fetchArtist = async () => {
      try {
        const data = await getArtistById(parseInt(params.id), 1, 0);
        setArtist(data);
      } catch (err) {
        toast.error('Failed to load artist');
      } finally {
        setLoading(false);
      }
    };
    fetchArtist();
  }, [params.id, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'moderator') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-glass text-center">
            <h1 className="text-2xl font-black text-red-500 mb-2">Access Denied</h1>
            <p className="text-slate-600 mb-6">Only moderators can create songs.</p>
            <Link href="/" className="px-6 py-2 bg-accent text-white rounded-xl font-bold hover:bg-accent-hover transition-colors">
              Go Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const onSubmit = async (data: FormData) => {
    let currentToken = token;
    if (!currentToken) return;
    
    try {
      setIsSubmitting(true);
      let newSong;
      
      try {
        newSong = await createSong(currentToken, {
          artist_id: parseInt(params.id),
          title: data.title,
          release_date: data.release_date || '',
          lyrics: data.lyrics,
        });
      } catch (err: any) {
        if (err.status === 401 || err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('jwt') || err.message.toLowerCase().includes('expired')) {
          currentToken = await refreshAuth() || '';
          if (!currentToken) throw new Error('Session expired. Please log in again.');
          
          newSong = await createSong(currentToken, {
            artist_id: parseInt(params.id),
            title: data.title,
            release_date: data.release_date || '',
            lyrics: data.lyrics,
          });
        } else {
          throw err;
        }
      }
      
      toast.success('Song created successfully');
      router.push(`/song/${newSong.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create song');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-accent font-bold mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Artist
          </button>
          
          <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-white/50 shadow-glass">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-800">Add New Song</h1>
                {artist && <p className="text-slate-500 font-medium">for {artist.name}</p>}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Song Title
                </label>
                <input
                  id="title"
                  {...register('title')}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-medium text-slate-800 transition-all"
                  placeholder="e.g., Bohemian Rhapsody"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="release_date" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Release Date
                </label>
                <input
                  id="release_date"
                  type="date"
                  {...register('release_date')}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-medium text-slate-800 transition-all"
                />
                {errors.release_date && (
                  <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                    {errors.release_date.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lyrics" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Lyrics
                </label>
                <textarea
                  id="lyrics"
                  rows={15}
                  {...register('lyrics')}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-medium text-slate-800 resize-y transition-all font-mono text-sm leading-relaxed"
                  placeholder="Paste lyrics here..."
                />
                {errors.lyrics && (
                  <p className="mt-2 text-sm text-red-500 font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
                    {errors.lyrics.message}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Song'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}