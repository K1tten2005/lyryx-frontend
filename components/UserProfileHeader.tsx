'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/api/user';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface UserProfileHeaderProps {
  user: UserProfile;
}

export default function UserProfileHeader({ user: initialUser }: UserProfileHeaderProps) {
  const { user: currentUser, token } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwner = !!token && currentUser?.user_id === initialUser.user_id;
  const user = isOwner ? (currentUser as UserProfile) || initialUser : initialUser;

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-50 mb-8 overflow-hidden relative group transition-all hover:shadow-xl hover:border-indigo-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md border-4 border-white transition-transform duration-300 group-hover/avatar:scale-105 bg-indigo-600 flex items-center justify-center">
              {user.avatar_url ? (
                <Image 
                  src={user.avatar_url} 
                  alt={user.username} 
                  width={128} 
                  height={128} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-white text-5xl font-black italic tracking-tighter">
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-1">
                  <h1 className="text-4xl font-black font-sans text-slate-800 tracking-tight drop-shadow-md">{user.username}</h1>
                  {isOwner && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-2 bg-white text-accent rounded-full hover:bg-white/90 transition-colors shadow-md border border-white/40 active:scale-95"
                      title="Edit Profile"
                      aria-label="Edit Profile"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-accent to-accent-light text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md border border-white/40">
                  {user.role}
                </span>
              </div>
              
              <div className="flex flex-col items-center md:items-end bg-white/40 px-5 py-3 rounded-2xl border border-white/50 shadow-inset-heavy">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 drop-shadow-sm">Reputation</div>
                <div className="text-3xl font-black text-accent leading-none tabular-nums drop-shadow-md">
                  {user.reputation_score.toLocaleString()}
                </div>
              </div>
            </div>

            {user.bio ? (
              <div className="bg-white/30 p-5 rounded-2xl border border-white/40 shadow-inner-glow">
                <p className="text-slate-700 font-semibold leading-relaxed">
                  {user.bio}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic font-semibold drop-shadow-sm">No bio provided yet.</p>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </>
  );
}
