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
    <div className="grid gap-6">
      {annotations.map((annotation) => (
        <div 
          key={annotation.id} 
          className="group bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Song Context Panel */}
            <div className="sm:w-1/3 bg-zinc-50 p-4 flex sm:flex-col gap-4 border-b sm:border-b-0 sm:border-r border-zinc-100 transition-colors group-hover:bg-indigo-50/30">
              <div className="w-20 h-20 sm:w-full sm:aspect-square rounded-lg overflow-hidden shadow-sm border-2 border-white relative">
                <Image 
                  src={annotation.song.cover_url} 
                  alt={`${annotation.song.title} cover`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center sm:justify-start">
                <Link href={`/song/${annotation.song.id}`} className="text-sm font-black text-zinc-900 line-clamp-1 hover:text-indigo-600 transition-colors tracking-tight">
                  {annotation.song.title}
                </Link>
                <Link href={`/artist/${annotation.song.artist.id}`} className="text-xs font-bold text-zinc-500 line-clamp-1 hover:text-indigo-500 transition-colors uppercase tracking-widest mt-0.5">
                  {annotation.song.artist.name}
                </Link>
              </div>
            </div>

            {/* Annotation Content Panel */}
            <div className="flex-grow p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-tighter rounded">
                      Annotation
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {new Date(annotation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Rating</span>
                    <span className="px-2 py-0.5 bg-zinc-900 text-white text-xs font-black rounded tabular-nums">
                      {annotation.rating}
                    </span>
                  </div>
                </div>
                
                <blockquote className="relative">
                  <svg className="absolute -top-2 -left-2 w-8 h-8 text-indigo-50 opacity-50 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8v8h4v8h-8v-8h2v-8h2zm12 0v8h4v8h-8v-8h2v-8h2z"></path>
                  </svg>
                  <p className="text-zinc-800 text-lg leading-relaxed relative z-10 pl-2">
                    {annotation.content}
                  </p>
                </blockquote>
              </div>
              
              <div className="mt-6 pt-4 border-t border-zinc-50 flex items-center justify-end">
                <Link href={`/song/${annotation.song.id}`} className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 group/link">
                  View Full Song 
                  <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
