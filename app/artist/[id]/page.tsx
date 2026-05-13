'use client';

import { useEffect, useState, useRef } from 'react';
import { getArtistById, updateArtist, updateArtistAvatar, ArtistProfile } from '@/lib/api/artist';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Music, Calendar, Eye, User, Edit2, Upload, Loader2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ArtistPage({ params }: { params: { id: string } }) {
  const { user, token, refreshAuth } = useAuth();
  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 20;

  // Editing state
  const isModerator = user?.role === 'moderator';
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const artistId = parseInt(params.id);
        const data = await getArtistById(artistId, limit, 0);
        if (!data) {
          notFound();
          return;
        }
        setArtist(data);
        setEditName(data.name);
        setEditBio(data.bio || '');
        if (!data.songs || data.songs.length < limit) {
          setHasMore(false);
        }
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

  const handleSaveEdit = async () => {
    let currentToken = token;
    if (!currentToken || !artist) return;

    try {
      setIsSaving(true);
      let updatedArtist;
      
      try {
        updatedArtist = await updateArtist(currentToken, artist.id, {
          name: editName,
          bio: editBio,
        });
      } catch (err: any) {
        if (err.status === 401 || err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('jwt') || err.message.toLowerCase().includes('expired')) {
          currentToken = await refreshAuth() || '';
          if (!currentToken) throw new Error('Session expired. Please log in again.');
          
          updatedArtist = await updateArtist(currentToken, artist.id, {
            name: editName,
            bio: editBio,
          });
        } else {
          throw err;
        }
      }
      
      setArtist({ ...artist, ...updatedArtist });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    let currentToken = token;
    if (!file || !currentToken || !artist) return;

    try {
      setIsUploadingAvatar(true);
      let data;
      
      try {
        data = await updateArtistAvatar(currentToken, artist.id, file);
      } catch (err: any) {
        if (err.status === 401 || err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('jwt') || err.message.toLowerCase().includes('expired')) {
          currentToken = await refreshAuth() || '';
          if (!currentToken) throw new Error('Session expired. Please log in again.');
          
          data = await updateArtistAvatar(currentToken, artist.id, file);
        } else {
          throw err;
        }
      }
      
      setArtist({ ...artist, avatar_url: data.avatar_url });
      toast.success('Avatar updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update avatar');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLoadMore = async () => {
    if (!artist || !hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextOffset = artist.songs.length;
      const data = await getArtistById(artist.id, limit, nextOffset);
      
      if (data && data.songs) {
        setArtist({
          ...artist,
          songs: [...artist.songs, ...data.songs]
        });
        
        if (data.songs.length < limit) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Failed to load more songs:', err);
    } finally {
      setLoadingMore(false);
    }
  };

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
                
                {/* Avatar Upload Overlay (Moderator only) */}
                {isModerator && (
                  <label 
                    htmlFor="avatar-upload" 
                    data-testid="avatar-upload-overlay"
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-white mb-2 drop-shadow-md" />
                        <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-md">Upload</span>
                      </>
                    )}
                    <input 
                      id="avatar-upload" 
                      data-testid="avatar-upload-input"
                      type="file" 
                      accept="image/jpeg, image/png, image/webp" 
                      className="hidden" 
                      onChange={handleAvatarUpload}
                      ref={fileInputRef}
                      disabled={isUploadingAvatar}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {/* Artist Details Section */}
            <div className="relative max-w-3xl w-full flex flex-col items-center">
              {/* Single Edit Button (Moderator only) */}
              {isModerator && !isEditing && (
                <button 
                  data-testid="edit-name-btn"
                  onClick={() => setIsEditing(true)}
                  className="absolute -right-4 sm:-right-16 top-0 p-3 bg-white/80 hover:bg-white text-accent hover:scale-110 rounded-2xl shadow-glass border border-white/50 transition-all duration-300 z-20 group"
                  title="Edit Profile"
                >
                  <Edit2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              )}

              {isEditing ? (
                <div className="w-full bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-glass mb-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="space-y-4 text-left">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Имя</label>
                      <input 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-black text-slate-800 text-2xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">О себе</label>
                      <textarea 
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 font-medium text-slate-700 resize-none"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(artist.name);
                          setEditBio(artist.bio || '');
                        }}
                        className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                        disabled={isSaving}
                      >
                        Отмена
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        disabled={isSaving || !editName.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Сохранить
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight drop-shadow-sm mb-6">
                    {artist.name}
                  </h1>
                  
                  <div className="w-full bg-white/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/50 shadow-glass">
                    {artist.bio ? (
                      <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                        {artist.bio}
                      </p>
                    ) : (
                      <p className="text-lg md:text-xl text-slate-400 italic font-medium">
                        Информация "О себе" отсутствует
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Songs Vertical List Section */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-1.5 bg-gradient-to-r from-accent to-purple-400 rounded-full"></div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-slate-800">
                  Дискография
                </h2>
              </div>
              
              {isModerator && (
                <Link
                  href={`/artist/${artist.id}/create-song`}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-accent font-bold rounded-xl shadow-sm border border-white/50 transition-all hover:-translate-y-0.5"
                >
                  <Music className="w-4 h-4" />
                  Добавить песню
                </Link>
              )}
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
                
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-8 py-4 bg-white/80 backdrop-blur-md border border-white/50 shadow-glass-sm hover:shadow-glass text-slate-800 font-black uppercase tracking-widest rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0"
                    >
                      {loadingMore ? 'Загрузка...' : 'Загрузить еще'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-glass p-16 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/10 mb-6">
                  <Music className="w-10 h-10 text-accent/50" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Песни не найдены</h3>
                <p className="text-slate-500 font-medium text-lg">Этот артист еще не добавил ни одной песни.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
