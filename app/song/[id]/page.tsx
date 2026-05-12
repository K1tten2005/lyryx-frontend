'use client';

import { useEffect, useState, useMemo, Fragment, useRef, useCallback } from 'react';
import { getSongById, getSongAnnotations, createAnnotation, getAiAnnotation, Song, Annotation } from '@/lib/api/song';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Music } from 'lucide-react';
import { AnnotationHighlight } from '@/components/song/AnnotationHighlight';
import { AnnotationBubble } from '@/components/song/AnnotationBubble';
import { useTextSelection } from '@/hooks/useTextSelection';
import { CreateAnnotationPrompt } from '@/components/song/CreateAnnotationPrompt';
import { AskAIPrompt } from '@/components/song/AskAIPrompt';
import { AIBubble } from '@/components/song/AIBubble';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SongPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, token, refreshAuth } = useAuth();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const { selection, setSelection, handleSelection } = useTextSelection(lyricsContainerRef.current);
  const [song, setSong] = useState<Song | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeAnnotationId, setActiveAnnotationId] = useState<number | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [bubbleTop, setBubbleTop] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnotations = useCallback(async () => {
    try {
      const songId = parseInt(params.id);
      const annotationsData = await getSongAnnotations(songId, token || undefined).catch((e) => {
        console.error("Failed to fetch annotations:", e);
        return [];
      });
      setAnnotations(annotationsData);
    } catch (err) {
      console.error("Error refreshing annotations:", err);
    }
  }, [params.id, token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const songId = parseInt(params.id);
        const [songData] = await Promise.all([
          getSongById(songId),
          fetchAnnotations()
        ]);
        if (!songData) {
          notFound();
          return;
        }
        setSong(songData);
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
  }, [params.id, fetchAnnotations]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest('.pointer-events-auto')) return;
      if (lyricsContainerRef.current && !lyricsContainerRef.current.contains(event.target as Node)) {
        setSelection(null);
        setIsAiMode(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSelection]);

  const activeAnnotation = useMemo(() => {
    return annotations.find(a => a.id === activeAnnotationId) || null;
  }, [annotations, activeAnnotationId]);

  const isOverlap = useMemo(() => {
    if (!selection) return false;
    return annotations.some(a => 
      (selection.startIndex >= a.start_index && selection.startIndex < a.end_index) ||
      (selection.endIndex > a.start_index && selection.endIndex <= a.end_index) ||
      (a.start_index >= selection.startIndex && a.start_index < selection.endIndex)
    );
  }, [selection, annotations]);

  const showPrompt = isAuthenticated && selection && !isOverlap && !isCreateMode && !isAiMode;

  const handleCreateAnnotation = () => {
    setIsCreateMode(true);
    setIsAiMode(false);
    setActiveAnnotationId(null);
    if (selection?.lastRelativeRect) {
      const lineCenter = (selection.lastRelativeRect.top + selection.lastRelativeRect.bottom) / 2;
      setBubbleTop(lineCenter);
    }
  };

  const handleAskAI = () => {
    setIsAiMode(true);
    setIsCreateMode(false);
    setActiveAnnotationId(null);
    if (selection?.lastRelativeRect) {
      const lineCenter = (selection.lastRelativeRect.top + selection.lastRelativeRect.bottom) / 2;
      setBubbleTop(lineCenter);
    }
  };

  const handleAiSubmit = async (question: string) => {
    if (!selection) throw new Error("No text selected");
    const songId = parseInt(params.id);
    return await getAiAnnotation(songId, question, selection.startIndex, selection.endIndex);
  };

  // Helper to retry authenticated requests
  const withAuthRetry = async <T,>(action: (authToken: string) => Promise<T>): Promise<T> => {
    try {
      return await action(token || '');
    } catch (err: any) {
      if (err.message.toLowerCase().includes('401') || err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('failed') || err.message.toLowerCase().includes('invalid')) {
        const newToken = await refreshAuth();
        if (newToken) {
          return await action(newToken);
        }
      }
      throw err;
    }
  };

  const handleAnnotationSubmit = async (content: string) => {
    if (!selection) return;

    try {
      await withAuthRetry((authToken) => {
        const songId = parseInt(params.id);
        return createAnnotation(songId, content, selection.startIndex, selection.endIndex, authToken);
      });
      toast.success('Annotation saved!');
      await fetchAnnotations();
      setIsCreateMode(false);
      setSelection(null);
    } catch (error: any) {
      console.error("Failed to create annotation:", error);
      toast.error(error.message || 'Failed to save annotation');
      throw error;
    }
  };

  const handleAnnotationClick = (id: number) => {
    setIsCreateMode(false);
    setIsAiMode(false);
    const isClosing = activeAnnotationId === id;
    setActiveAnnotationId(prevId => prevId === id ? null : id);
    if (!isClosing) {
      setTimeout(() => {
        const element = document.querySelector(`[data-annotation-id="${id}"]`) as HTMLElement;
        if (element) {
          const container = element.closest('.grid') as HTMLElement;
          if (container) {
            const rect = element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            setBubbleTop(rect.top - containerRect.top + (rect.height / 2));
          }
        }
      }, 0);
    }
  };

  const renderLyricsWithAnnotations = () => {
    if (!song) return null;
    const displayAnnotations = [...annotations];
    if (isCreateMode && selection) {
      displayAnnotations.push({
        id: -1,
        content: '',
        start_index: selection.startIndex,
        end_index: selection.endIndex,
        rating: 0,
        created_at: new Date().toISOString(),
        user: undefined
      } as any);
    }
    if (displayAnnotations.length === 0) return song.lyrics;
    const sortedAnnotations = displayAnnotations.sort((a, b) => a.start_index - b.start_index);
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;
    sortedAnnotations.forEach((annotation) => {
      if (annotation.start_index < currentIndex) return;
      if (currentIndex < annotation.start_index) {
        elements.push(<Fragment key={`text-${currentIndex}`}>{song.lyrics.slice(currentIndex, annotation.start_index)}</Fragment>);
      }
      if (annotation.start_index < song.lyrics.length) {
        const endIndex = Math.min(annotation.end_index, song.lyrics.length);
        elements.push(
          <AnnotationHighlight
            key={annotation.id === -1 ? 'current-selection' : `annotation-${annotation.id}`}
            id={annotation.id}
            isActive={activeAnnotationId === annotation.id || annotation.id === -1}
            onClick={annotation.id === -1 ? () => {} : handleAnnotationClick}
          >
            {song.lyrics.slice(annotation.start_index, endIndex)}
          </AnnotationHighlight>
        );
        currentIndex = endIndex;
      }
    });
    if (currentIndex < song.lyrics.length) {
      elements.push(<Fragment key={`text-${currentIndex}`}>{song.lyrics.slice(currentIndex)}</Fragment>);
    }
    return elements;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const parts = dateString.split('T')[0].split('-');
    return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : dateString;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-64 bg-white/50 rounded-2xl mb-8 shadow-glass"></div>
          <div className="h-8 w-48 bg-white/50 rounded-lg mb-4"></div>
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

  if (!song) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-10 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden shadow-glass border-4 border-white/80 group flex-shrink-0">
              {song.cover_url ? (
                <Image src={song.cover_url} alt={`${song.title} cover`} fill className="object-cover transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <Music className="w-24 h-24 text-accent/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-glossy-button opacity-30 pointer-events-none"></div>
            </div>
            <div className="flex-grow flex flex-col justify-end py-2">
              <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 drop-shadow-sm">{song.title}</h1>
              <div className="flex flex-wrap gap-6 items-center text-slate-600 font-bold">
                <Link href={`/artist/${song.artist.id}`} className="text-2xl text-accent hover:text-accent-hover transition-colors">{song.artist.name}</Link>
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span data-testid="release-date" className="text-sm uppercase tracking-wider">{formatDate(song.release_date)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm">
                  <Eye className="w-4 h-4 text-accent" />
                  <span className="text-sm uppercase tracking-wider">{song.views?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 relative z-20">
              <h2 className="text-2xl font-black uppercase tracking-widest text-accent mb-8 flex items-center gap-3">
                <span className="w-10 h-1.5 bg-accent rounded-full"></span> Lyrics
              </h2>
              <div ref={lyricsContainerRef} className="bg-white/70 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] border border-white/50 shadow-glass relative w-fit min-w-[90%]">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                <pre onMouseUp={handleSelection} className="text-lg md:text-xl leading-relaxed text-slate-700 font-semibold whitespace-pre-wrap font-sans relative z-10 tracking-tight select-text">
                  {renderLyricsWithAnnotations()}
                </pre>
                {showPrompt && selection?.lastRelativeRect && (
                  <div 
                    className="absolute z-[200] pointer-events-auto animate-fade-zoom flex flex-col gap-3"
                    style={{ 
                      top: `${(selection.lastRelativeRect.top + selection.lastRelativeRect.bottom) / 2}px`, 
                      left: 'calc(100% + 24px)',
                      transform: 'translateY(-50%)' 
                    }}
                  >
                    <CreateAnnotationPrompt onClick={handleCreateAnnotation} />
                    <AskAIPrompt onClick={handleAskAI} />
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-5 relative mt-16 lg:mt-0">
              <div 
                className={cn(
                  "absolute w-full transition-opacity duration-300 ease-out",
                  (activeAnnotation || isCreateMode || isAiMode) ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                )}
                style={{ top: `${bubbleTop - 40}px` }}
              >
                {(activeAnnotation || isCreateMode) && (
                  <AnnotationBubble 
                    key={isCreateMode ? 'create-bubble' : `bubble-${activeAnnotation?.id}`}
                    annotation={activeAnnotation} 
                    isCreateMode={isCreateMode}
                    onClose={() => { setActiveAnnotationId(null); setIsCreateMode(false); }} 
                    onSubmit={handleAnnotationSubmit}
                    onUpdated={fetchAnnotations}
                    onDeleted={() => { setActiveAnnotationId(null); fetchAnnotations(); }}
                  />
                )}
                {isAiMode && (
                  <AIBubble 
                    onClose={() => setIsAiMode(false)}
                    onSubmit={handleAiSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
