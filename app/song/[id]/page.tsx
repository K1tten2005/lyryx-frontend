'use client';

import { useEffect, useState, useMemo, Fragment, useRef, useCallback } from 'react';
import { getSongById, getSongAnnotations, createAnnotation, getAiAnnotation, getAiTranslation, Song, Annotation } from '@/lib/api/song';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Music, Languages, ChevronDown, Loader2, X, Edit2 } from 'lucide-react';
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
  const { isAuthenticated, token, user, refreshAuth } = useAuth();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { selection, setSelection, handleSelection } = useTextSelection(lyricsContainerRef);
  const [song, setSong] = useState<Song | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [activeAnnotationId, setActiveAnnotationId] = useState<number | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'loading' | 'result' | 'error'>('idle');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiError, setAiError] = useState('');
  const [bubbleTop, setBubbleTop] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Translation State
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [translatedLyrics, setTranslatedLyrics] = useState<string | null>(null);
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isTranslationVisible, setIsTranslationVisible] = useState(false);

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
          setError(err.message || 'Произошла ошибка');
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
      
      // Handle translation dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setShowLangDropdown(false);
      }

      // Don't clear if clicking on something interactive
      if (target.closest('.pointer-events-auto')) return;
      
      // Clear selection if clicking outside the lyrics container
      // or if we are not in an active mode (to hide the prompts)
      if (lyricsContainerRef.current && !lyricsContainerRef.current.contains(event.target as Node)) {
        setSelection(null);
        setIsAiMode(false);
        setIsCreateMode(false);
      } else if (!isAiMode && !isCreateMode) {
        // If clicking inside container but no mode is active, 
        // we might want to clear the prompt if it's a simple click
        const sel = window.getSelection();
        if (sel?.isCollapsed) {
          setSelection(null);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSelection, isAiMode, isCreateMode]);

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
    setAiStatus('idle');
    setAiResponse('');
    setAiError('');
    if (selection?.lastRelativeRect) {
      const lineCenter = (selection.lastRelativeRect.top + selection.lastRelativeRect.bottom) / 2;
      setBubbleTop(lineCenter);
    }
  };

  const handleTranslate = async (lang: string) => {
    if (lang === targetLanguage && translatedLyrics) {
      setIsTranslationVisible(true);
      setShowLangDropdown(false);
      return;
    }
    try {
      setIsTranslationLoading(true);
      setShowLangDropdown(false);
      const result = await withAuthRetry((authToken) => 
        getAiTranslation(parseInt(params.id), lang, authToken)
      );
      setTranslatedLyrics(result.response);
      setTargetLanguage(lang);
      setIsTranslationVisible(true);
      toast.success(`Переведено на ${lang === 'en' ? 'Английский' : lang === 'ru' ? 'Русский' : lang}`);
      } catch (err: any) {
      console.error('Translation error:', err);
      toast.error(err.message || 'Ошибка перевода текста');
      } finally {
      setIsTranslationLoading(false);
    }
  };

  const handleAiSubmit = async (question: string) => {
    if (!selection) {
      setAiError("Текст не выбран");
      setAiStatus('error');
      return;
    }
    
    try {
      setAiStatus('loading');
      const result = await withAuthRetry((authToken) => 
        getAiAnnotation(parseInt(params.id), question, selection.startIndex, selection.endIndex, authToken)
      );
      setAiResponse(result.response);
      setAiStatus('result');
    } catch (err: any) {
      console.error("AI Annotation failed:", err);
      setAiError(err.message || 'Ошибка при получении объяснения');
      setAiStatus('error');
    }
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
      toast.error(error.message || 'Ошибка при сохранении аннотации');
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
    if ((isCreateMode || isAiMode) && selection) {
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
    
    const sortedAnnotations = displayAnnotations.sort((a, b) => a.start_index - b.start_index);

    if (translatedLyrics && targetLanguage && isTranslationVisible) {
      const originalLines = song.lyrics.split('\n');
      const translatedLines = translatedLyrics.split('\n');
      let cumulativeIndex = 0;

      return originalLines.map((lineText, lineIdx) => {
        const lineStart = cumulativeIndex;
        const lineEnd = lineStart + lineText.length;
        cumulativeIndex = lineEnd + 1; // +1 for the newline character

        const lineElements: React.ReactNode[] = [];
        let lineCurrentIndex = lineStart;

        // Find annotations that overlap with this line
        const relevantAnnotations = sortedAnnotations.filter(a => 
          (a.start_index < lineEnd && a.end_index > lineStart)
        );

        relevantAnnotations.forEach(a => {
          // Part before annotation
          if (a.start_index > lineCurrentIndex) {
            lineElements.push(
              <Fragment key={`text-${lineCurrentIndex}`}>
                {lineText.slice(lineCurrentIndex - lineStart, a.start_index - lineStart)}
              </Fragment>
            );
            lineCurrentIndex = a.start_index;
          }
          
          // Annotation part (possibly partial)
          const start = Math.max(a.start_index, lineCurrentIndex);
          const end = Math.min(a.end_index, lineEnd);
          if (start < end) {
            lineElements.push(
              <AnnotationHighlight
                key={a.id === -1 ? 'current-selection' : `annotation-${a.id}-${lineIdx}`}
                id={a.id}
                isActive={activeAnnotationId === a.id || a.id === -1}
                onClick={a.id === -1 ? () => {} : handleAnnotationClick}
              >
                {lineText.slice(start - lineStart, end - lineStart)}
              </AnnotationHighlight>
            );
            lineCurrentIndex = end;
          }
        });

        // Remaining part of the line
        if (lineCurrentIndex < lineEnd) {
          lineElements.push(
            <Fragment key={`text-${lineCurrentIndex}`}>
              {lineText.slice(lineCurrentIndex - lineStart)}
            </Fragment>
          );
        }

        return (
          <div key={`line-group-${lineIdx}`} className="mb-4 last:mb-0">
            <div className="relative min-h-[1.5em]">{lineElements || '\u00A0'}</div>
            {translatedLines[lineIdx] && (
              <div className="text-sm italic text-slate-500 mt-1 animate-in fade-in slide-in-from-left-2 duration-300">
                {translatedLines[lineIdx]}
              </div>
            )}
          </div>
        );
      });
    }

    // Default rendering
    if (displayAnnotations.length === 0) return song.lyrics;
    
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
          <h1 className="text-2xl font-black text-red-500 mb-2">Ошибка</h1>
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
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-4xl md:text-6xl font-black text-slate-800 drop-shadow-sm">{song.title}</h1>
                {user?.role === 'moderator' && (
                  <Link
                    href={`/song/${song.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-accent font-bold rounded-xl shadow-sm border border-white/50 transition-all hover:-translate-y-0.5"
                  >
                    <Edit2 className="w-4 h-4" />
                    Редактировать
                  </Link>
                )}
              </div>
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
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-widest text-accent flex items-center gap-3">
                  <span className="w-10 h-1.5 bg-accent rounded-full"></span> Текст песни
                </h2>                
                <div className="flex items-center gap-3">
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error('Только авторизованные пользователи могут переводить тексты');
                          return;
                        }
                        setShowLangDropdown(!showLangDropdown);
                      }}
                      disabled={isTranslationLoading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-glass-sm hover:bg-white/80 transition-all font-bold text-slate-700 disabled:opacity-50"
                    >
                      {isTranslationLoading ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : <Languages className="w-4 h-4 text-accent" />}
                      {targetLanguage ? (targetLanguage === 'ru' ? 'Russian' : 'English') : 'Перевести'}
                      <ChevronDown className={cn("w-4 h-4 transition-transform", showLangDropdown && "rotate-180")} />
                    </button>

                    {showLangDropdown && (
                      <div className="absolute right-0 top-full mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-glass overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => handleTranslate('ru')}
                          className="w-full px-5 py-3 text-left hover:bg-accent/10 transition-colors font-bold text-slate-700"
                        >
                          Russian
                        </button>
                        <button 
                          onClick={() => handleTranslate('en')}
                          className="w-full px-5 py-3 text-left hover:bg-accent/10 transition-colors font-bold text-slate-700 border-t border-slate-100/50"
                        >
                          English
                        </button>
                      </div>
                    )}
                  </div>

                  {translatedLyrics && (
                    <button 
                      onClick={() => setIsTranslationVisible(!isTranslationVisible)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-2.5 backdrop-blur-md rounded-2xl border shadow-glass-sm transition-all font-bold",
                        isTranslationVisible 
                          ? "bg-accent/10 hover:bg-accent/20 border-accent/20 text-accent" 
                          : "bg-white/60 hover:bg-white/80 border-white/50 text-slate-700"
                      )}
                    >
                      {isTranslationVisible ? <X className="w-4 h-4" /> : <Languages className="w-4 h-4" />}
                      {isTranslationVisible ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
              </div>

              <div ref={lyricsContainerRef} className="bg-white/70 backdrop-blur-xl p-10 md:p-14 rounded-[2.5rem] border border-white/50 shadow-glass relative w-fit min-w-[90%]">
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
                <div className={cn(
                  "text-lg md:text-xl leading-relaxed text-slate-700 font-semibold whitespace-pre-wrap font-sans relative z-10 tracking-tight select-text",
                  (translatedLyrics && isTranslationVisible) && "whitespace-normal"
                )}>
                  {renderLyricsWithAnnotations()}
                </div>
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
                  "absolute w-full transition-opacity duration-300 ease-out pointer-events-auto",
                  (activeAnnotation || isCreateMode || isAiMode) ? "opacity-100" : "pointer-events-none opacity-0"
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
                    status={aiStatus}
                    aiResponse={aiResponse}
                    errorMessage={aiError}
                    question={aiQuestion}
                    setQuestion={setAiQuestion}
                    onReset={() => {
                      setAiStatus('idle');
                      setAiResponse('');
                      setAiError('');
                    }}
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
