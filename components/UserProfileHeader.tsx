'use client';

import { UserProfile } from '@/lib/api/user';
import Image from 'next/image';

interface UserProfileHeaderProps {
  user: UserProfile;
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-50 mb-8 overflow-hidden relative group transition-all hover:shadow-xl hover:border-indigo-100">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        <div className="relative group/avatar">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md border-4 border-white transition-transform duration-300 group-hover/avatar:scale-105">
            {user.avatar_url ? (
              <Image 
                src={user.avatar_url} 
                alt={user.username} 
                width={128} 
                height={128} 
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-5xl font-black italic tracking-tighter">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-lg shadow-md border border-indigo-50">
             <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Lv. {Math.floor(user.reputation_score / 1000) + 1}</span>
          </div>
        </div>

        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-1">{user.username}</h1>
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest border border-indigo-100">
                {user.role}
              </span>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">Reputation</div>
              <div className="text-4xl font-black text-indigo-600 leading-none tabular-nums">
                {user.reputation_score.toLocaleString()}
              </div>
            </div>
          </div>

          {user.bio ? (
            <div className="bg-zinc-50/50 p-4 rounded-xl border border-zinc-100/50">
              <p className="text-zinc-600 leading-relaxed italic">
                "{user.bio}"
              </p>
            </div>
          ) : (
            <p className="text-zinc-400 italic">No bio provided yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
