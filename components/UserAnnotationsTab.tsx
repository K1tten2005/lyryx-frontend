'use client';

import { UserAnnotation } from '@/lib/api/user';
import Image from 'next/image';
import Link from 'next/link';

interface UserAnnotationsTabProps {
  annotations: UserAnnotation[];
}

export default function UserAnnotationsTab({ annotations }: UserAnnotationsTabProps) {
  if (annotations.length === 0) {
    return (
      <div className="text-center py-24 bg-surface bg-glass-panel backdrop-blur-md rounded-3xl border border-white/50 shadow-glass">
        <div className="w-16 h-16 bg-white/50 shadow-inner-glow rounded-full flex items-center justify-center mx-auto mb-4 border border-white/40">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2 drop-shadow-sm">No annotations yet</h3>
        <p className="text-slate-600 max-w-xs mx-auto font-medium">This user hasn't shared their insights on any lyrics yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {annotations.map((annotation) => (
        <div 
          key={annotation.id} 
          className="group bg-surface bg-glass-panel backdrop-blur-md rounded-3xl overflow-hidden border border-white/50 shadow-glass transition-all hover:shadow-lg hover:border-white/80"
        >
          {/* Song Header */}
          <div className="px-6 py-4 bg-white/30 border-b border-white/40 flex items-center gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-inner-glow border-2 border-white/60 relative shrink-0">
              <Image 
                src={annotation.song.cover_url} 
                alt={`${annotation.song.title} cover`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow min-w-0">
              <Link href={`/song/${annotation.song.id}`} className="block text-lg font-bold text-slate-800 truncate hover:text-accent transition-colors drop-shadow-sm">
                {annotation.song.title}
              </Link>
              <Link href={`/artist/${annotation.song.artist.id}`} className="block text-xs font-bold text-slate-500 truncate hover:text-accent transition-colors uppercase tracking-widest mt-0.5">
                {annotation.song.artist.name}
              </Link>
            </div>
            <div className="shrink-0 text-right">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 drop-shadow-sm">Rating</div>
               <div className="px-2 py-0.5 bg-gradient-to-r from-accent to-accent-light text-white text-xs font-bold rounded-full tabular-nums shadow-sm border border-white/40">
                {annotation.rating}
               </div>
            </div>
          </div>

          {/* Annotation Body */}
          <div className="p-8 relative">
            <div className="absolute top-6 left-6 text-white/50 select-none drop-shadow-sm">
               <svg className="w-12 h-12 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8v8h4v8h-8v-8h2v-8h2zm12 0v8h4v8h-8v-8h2v-8h2z"></path>
               </svg>
            </div>
            
            {annotation.snippet && (
              <div className="mb-6 relative z-10 pl-6 border-l-4 border-white/60">
                <p className="text-slate-600 font-bold italic text-lg leading-relaxed drop-shadow-sm">
                  "{annotation.snippet}"
                </p>
              </div>
            )}

            <p className="text-slate-800 text-xl font-bold leading-relaxed relative z-10 pl-6 border-l-4 border-accent shadow-white">
              {annotation.content}
            </p>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest drop-shadow-sm">
                Annotated on {new Date(annotation.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              
              <Link href={`/song/${annotation.song.id}`} className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 group/link px-5 py-2.5 bg-accent border border-white/20 shadow-md rounded-full hover:bg-accent-hover active:scale-95 transition-all">
                Full Song
                <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}