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
      <div className="text-center py-24 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">No annotations yet</h3>
        <p className="text-zinc-500 max-w-xs mx-auto">This user hasn't shared their insights on any lyrics yet. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {annotations.map((annotation) => (
        <div 
          key={annotation.id} 
          className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-sm transition-all hover:shadow-xl hover:border-indigo-100"
        >
          {/* Song Header */}
          <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-100 flex items-center gap-4 group-hover:bg-indigo-50/30 transition-colors">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm border-2 border-white relative shrink-0">
              <Image 
                src={annotation.song.cover_url} 
                alt={`${annotation.song.title} cover`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow min-w-0">
              <Link href={`/song/${annotation.song.id}`} className="block text-base font-black text-zinc-900 truncate hover:text-indigo-600 transition-colors tracking-tight leading-tight">
                {annotation.song.title}
              </Link>
              <Link href={`/artist/${annotation.song.artist.id}`} className="block text-[10px] font-black text-zinc-400 truncate hover:text-indigo-500 transition-colors uppercase tracking-widest mt-0.5">
                {annotation.song.artist.name}
              </Link>
            </div>
            <div className="shrink-0 text-right">
               <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Rating</div>
               <div className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-black rounded-lg tabular-nums shadow-sm shadow-indigo-100">
                {annotation.rating}
               </div>
            </div>
          </div>

          {/* Annotation Body */}
          <div className="p-8 relative">
            <div className="absolute top-6 left-6 text-indigo-50/50 select-none">
               <svg className="w-12 h-12 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8v8h4v8h-8v-8h2v-8h2zm12 0v8h4v8h-8v-8h2v-8h2z"></path>
               </svg>
            </div>
            
            <p className="text-zinc-800 text-xl font-medium leading-relaxed relative z-10 pl-6 border-l-4 border-indigo-100 italic">
              {annotation.content}
            </p>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">
                Annotated on {new Date(annotation.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              
              <Link href={`/song/${annotation.song.id}`} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 group/link px-4 py-2 bg-indigo-50 rounded-full hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                Full Song
                <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
