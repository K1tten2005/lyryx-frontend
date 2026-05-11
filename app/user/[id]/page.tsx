'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, getUserAnnotations, UserProfile, GetUserAnnotationsOut } from '@/lib/api/user';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UserProfileHeader from '@/components/UserProfileHeader';
import UserAnnotationsTab from '@/components/UserAnnotationsTab';
import UserProfileSkeleton from '@/components/UserProfileSkeleton';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [annotations, setAnnotations] = useState<GetUserAnnotationsOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'annotations'>('annotations');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, annotationsData] = await Promise.all([
          getUserProfile(parseInt(params.id)),
          getUserAnnotations(parseInt(params.id))
        ]);
        setUser(userData);
        setAnnotations(annotationsData);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <UserProfileSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md w-full text-center">
            <h1 className="text-2xl font-black text-red-600 mb-2 uppercase tracking-tight">Error</h1>
            <p className="text-red-700">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        {user && (
          <div className="max-w-4xl mx-auto">
            <UserProfileHeader user={user} />

            <div className="border-b border-zinc-100 mb-8">
              <nav className="-mb-px flex gap-8">
                <button 
                  onClick={() => setActiveTab('annotations')}
                  className={`py-4 px-2 text-sm font-black uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === 'annotations' 
                      ? 'border-indigo-600 text-indigo-600' 
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Annotations ({annotations?.total || 0})
                </button>
              </nav>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'annotations' && annotations && (
                <UserAnnotationsTab annotations={annotations.annotations} />
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
