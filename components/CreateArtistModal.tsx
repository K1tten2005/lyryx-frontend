'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createArtist } from '@/lib/api/artist';
import { useAuth } from '@/contexts/AuthContext';
import { X, Loader2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const artistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
});

type ArtistFormData = z.infer<typeof artistSchema>;

interface CreateArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateArtistModal({ isOpen, onClose }: CreateArtistModalProps) {
  const { token, refreshAuth } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
  });

  const onSubmit = async (data: ArtistFormData) => {
    let currentToken = token;
    if (!currentToken) return;

    try {
      setIsSubmitting(true);
      let newArtist;
      
      try {
        newArtist = await createArtist(currentToken, {
          name: data.name,
          bio: data.bio || '',
        });
      } catch (err: any) {
        if (
          err.status === 401 || 
          err.message.toLowerCase().includes('unauthorized') || 
          err.message.toLowerCase().includes('jwt') ||
          err.message.toLowerCase().includes('expired')
        ) {
          try {
            currentToken = await refreshAuth() || '';
            if (!currentToken) throw new Error('Session expired. Please log in again.');
            
            newArtist = await createArtist(currentToken, {
              name: data.name,
              bio: data.bio || '',
            });
          } catch (refreshErr: any) {
            throw refreshErr;
          }
        } else {
          throw err;
        }
      }
      
      toast.success('Artist created successfully!');
      reset();
      onClose();
      router.push(`/artist/${newArtist.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create artist');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/10 to-purple-400/10 flex items-center justify-center border border-white/50 shadow-inner">
                <UserPlus className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">New Artist</h2>
                <p className="text-slate-500 font-medium mt-1">Add an artist to the database</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Artist Name <span className="text-accent">*</span>
              </label>
              <input
                id="name"
                {...register('name')}
                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white transition-all font-medium text-slate-800 shadow-sm placeholder:text-slate-400"
                placeholder="e.g. Radiohead"
              />
              {errors.name && (
                <p className="mt-2 text-sm font-bold text-red-500 flex items-center gap-1">
                  <span>•</span> {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Biography
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                rows={5}
                className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white transition-all font-medium text-slate-800 shadow-sm placeholder:text-slate-400 resize-none"
                placeholder="Enter a short biography..."
              />
              {errors.bio && (
                <p className="mt-2 text-sm font-bold text-red-500 flex items-center gap-1">
                  <span>•</span> {errors.bio.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3.5 font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center min-w-[120px] gap-2 px-8 py-3.5 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-glass hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
