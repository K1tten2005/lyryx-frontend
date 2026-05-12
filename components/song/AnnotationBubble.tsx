import React, { useEffect, useRef, useState } from 'react';
import { Annotation, updateAnnotation, deleteAnnotation, voteAnnotation, deleteVote } from '@/lib/api/song';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ThumbsUp, ThumbsDown, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';

interface AnnotationBubbleProps {
  annotation: Annotation | null;
  isCreateMode?: boolean;
  onClose: () => void;
  onSubmit?: (content: string) => Promise<void>;
  onDeleted?: () => void;
  onUpdated?: () => void;
}

export function AnnotationBubble({ annotation, isCreateMode = false, onClose, onSubmit, onDeleted, onUpdated }: AnnotationBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { user, token, refreshAuth } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      // Don't close if clicking on an annotation highlight (let handleAnnotationClick handle it)
      if (target.closest('[data-annotation-id]')) {
        return;
      }
      
      // Don't close if the confirmation modal is currently open
      if (isDeleteModalOpen) {
        return;
      }

      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    // Delay adding the event listener to prevent immediate closing when clicking the highlight
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isDeleteModalOpen]);

  useEffect(() => {
    if (annotation && !isCreateMode) {
      setEditContent(annotation.content || '');
      setIsEditing(false);
    }
  }, [annotation, isCreateMode]);

  // Helper to retry authenticated requests
  const withAuthRetry = async <T,>(action: (authToken: string) => Promise<T>): Promise<T> => {
    try {
      return await action(token || '');
    } catch (err: any) {
      if (err.message.toLowerCase().includes('401') || err.message.toLowerCase().includes('unauthorized') || err.message.toLowerCase().includes('failed')) {
        const newToken = await refreshAuth();
        if (newToken) {
          return await action(newToken);
        }
      }
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content);
    } catch (error) {
      console.error("Failed to submit annotation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!annotation || !editContent.trim()) return;
    try {
      setIsSubmitting(true);
      await withAuthRetry((authToken) => updateAnnotation(annotation.id, editContent, authToken));
      toast.success('Annotation updated successfully');
      setIsEditing(false);
      if (onUpdated) onUpdated();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update annotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!annotation) return;
    try {
      setIsSubmitting(true);
      await withAuthRetry((authToken) => deleteAnnotation(annotation.id, authToken));
      toast.success('Annotation deleted');
      setIsDeleteModalOpen(false);
      if (onDeleted) onDeleted();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete annotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (value: number) => {
    if (!user) {
      toast.error('Please log in to vote');
      return;
    }
    if (!annotation) return;

    try {
      if (annotation.my_vote === value) {
        // Toggle off
        await withAuthRetry((authToken) => deleteVote(annotation.id, authToken));
      } else {
        await withAuthRetry((authToken) => voteAnnotation(annotation.id, value, authToken));
      }
      if (onUpdated) onUpdated(); // trigger re-fetch
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit vote');
    }
  };

  if (!annotation && !isCreateMode) return null;

  const isAuthor = user && annotation?.user?.user_id === user.user_id;
  const isModerator = user && (user.role === 'moderator' || user.role === 'admin');
  const canEdit = isAuthor;
  const canDelete = isAuthor || isModerator;

  return (
    <div 
      ref={bubbleRef}
      className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-glass border border-white/60 relative text-slate-800 w-full min-h-[150px] flex flex-col animate-fade-zoom"
    >
      {/* Glossy Pointer/Tail */}
      <div className="absolute top-10 -left-4 w-8 h-8 bg-white/60 backdrop-blur-xl border-l border-t border-white/60 rotate-[-45deg] hidden lg:block z-0 shadow-[-4px_-4px_10px_-4px_rgba(0,0,0,0.1)]"></div>
      
      <div className="relative z-10 flex-grow flex flex-col">
        {isCreateMode ? (
          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent mb-4">New Annotation</h3>
            <textarea
              autoFocus
              className="w-full bg-white/60 border-2 border-white/80 rounded-2xl p-4 text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-accent/30 min-h-[160px] transition-all resize-none mb-6 shadow-inset-heavy"
              placeholder="Explain these lyrics..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full flex items-center justify-center py-2.5 px-8 bg-accent text-white font-bold rounded-full shadow-md border border-white/20 hover:bg-accent-hover active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Annotation'
              )}
            </button>
          </form>
        ) : annotation && (
          <>
            {/* User Info & Actions at Top */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link 
                href={annotation.user?.user_id ? `/user/${annotation.user.user_id}` : '#'}
                className="flex items-center gap-3 group"
              >
                {annotation.user?.avatar_url ? (
                  <img 
                    src={annotation.user.avatar_url} 
                    alt={annotation.user.username} 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-accent/40 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">
                    {annotation.user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-800 group-hover:text-accent transition-colors">
                    {annotation.user?.username || 'Anonymous'}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {annotation.user?.reputation_score || 0} RS
                  </span>
                </div>
              </Link>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {canEdit && !isEditing && (
                  <button onClick={() => setIsEditing(true)} className="p-2 text-slate-400 hover:text-accent transition-colors" title="Edit">
                    <Edit2 size={18} />
                  </button>
                )}
                {canDelete && !isEditing && (
                  <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="flex flex-col flex-grow mb-4">
                <textarea
                  autoFocus
                  className="w-full bg-white/60 border-2 border-white/80 rounded-2xl p-4 text-slate-800 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-accent/30 min-h-[160px] transition-all resize-none mb-4 shadow-inset-heavy"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSubmit}
                    disabled={isSubmitting || !editContent.trim()}
                    className="flex-1 py-2 bg-accent text-white font-bold rounded-full hover:bg-accent-hover transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditContent(annotation.content || ''); }}
                    className="flex-1 py-2 bg-white/50 text-slate-600 font-bold rounded-full hover:bg-white/80 transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-base md:text-lg font-bold leading-relaxed text-slate-700 whitespace-pre-wrap break-words mb-4 flex-grow">
                {annotation.content}
              </div>
            )}

            {/* Voting Component */}
            {!isEditing && (
              <div className="flex items-center gap-1 bg-white/40 w-fit px-2 py-1 rounded-full border border-white/60 shadow-sm mt-auto">
                <button 
                  onClick={() => handleVote(1)}
                  className={`p-1.5 rounded-full transition-colors ${annotation.my_vote === 1 ? 'bg-accent text-white' : 'text-slate-500 hover:bg-accent/20 hover:text-accent'}`}
                >
                  <ThumbsUp size={16} />
                </button>
                <span className={`text-sm font-black px-2 ${annotation.rating > 0 ? 'text-accent' : annotation.rating < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  {annotation.rating || 0}
                </span>
                <button 
                  onClick={() => handleVote(-1)}
                  className={`p-1.5 rounded-full transition-colors ${annotation.my_vote === -1 ? 'bg-red-500 text-white' : 'text-slate-500 hover:bg-red-500/20 hover:text-red-500'}`}
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Frutiger Aero Glossy Overlay */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent rounded-t-[2.5rem] pointer-events-none"></div>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Annotation"
        message="Are you sure you want to delete this annotation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={isSubmitting}
      />
    </div>
  );
}


