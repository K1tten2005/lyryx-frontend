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
  const { token } = useAuth();
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
    if (!token) return;

    try {
      setIsSubmitting(true);
      const newArtist = await createArtist(token, {
        name: data.name,
        bio: data.bio || '',
      });
      
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
      
      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-glass overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-accent/20 to-purple-400/20 -z-10" />
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/60 shadow-glass-sm flex items-center justify-center border border-white/50">
                <UserPlus className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-black text-slate-800">Create Artist</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-500 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Artist Name
              </label>
              <input
                id="name"
                {...register('name')}
                className="w-full px-5 py-4 bg-white/50 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium text-slate-800 shadow-sm placeholder:text-slate-400"
                placeholder="Enter artist name"
              />
              {errors.name && (
                <p className="mt-2 text-sm font-bold text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Biography
              </label>
              <textarea
                id="bio"
                {...register('bio')}
                rows={4}
                className="w-full px-5 py-4 bg-white/50 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium text-slate-800 shadow-sm placeholder:text-slate-400 resize-none"
                placeholder="Enter artist biography (optional)"
              />
              {errors.bio && (
                <p className="mt-2 text-sm font-bold text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 font-bold text-slate-600 hover:text-slate-800 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-glass hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
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
