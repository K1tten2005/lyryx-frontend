import Link from "next/link";
import { SearchResultItem } from "@/lib/api/search";
import { Music, User, Mic2 } from "lucide-react";

export function ArtistCard({ artist }: { artist: SearchResultItem }) {
  return (
    <Link href={`/artist/${artist.id}`} className="group block">
      <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-transparent hover:border-indigo-200 shadow-sm hover:shadow-md transition-all">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 mr-4 shadow-inner relative group-hover:shadow-lg transition-shadow">
          {artist.cover_url ? (
            <img src={artist.cover_url} alt={artist.name || "Artist"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Mic2 size={32} />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
            {artist.name}
          </h3>
          <p className="text-sm text-slate-500">Artist</p>
        </div>
      </div>
    </Link>
  );
}

export function SongCard({ song, showSnippet = false }: { song: SearchResultItem, showSnippet?: boolean }) {
  // If lyrics snippet contains HTML (like <mark>), we need to render it safely
  const renderLyricsSnippet = () => {
    if (!showSnippet || !song.lyrics_snippet) return null;
    return (
      <div 
        className="text-sm text-slate-500 italic mt-1 line-clamp-2"
        dangerouslySetInnerHTML={{ __html: `"...${song.lyrics_snippet}..."` }}
      />
    );
  };

  return (
    <Link href={`/song/${song.id}`} className="group block">
      <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-transparent hover:border-indigo-200 shadow-sm hover:shadow-md transition-all">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 mr-4 shadow-sm group-hover:shadow-md transition-shadow">
          {song.cover_url ? (
            <img src={song.cover_url} alt={song.title || "Song"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <Music size={32} />
            </div>
          )}
        </div>
        <div className="flex-grow overflow-hidden">
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
            {song.title}
          </h3>
          <p className="text-sm text-slate-600 truncate">{song.artist?.name || song.artist_name}</p>
          {renderLyricsSnippet()}
        </div>
      </div>
    </Link>
  );
}

export function UserCard({ user }: { user: SearchResultItem }) {
  return (
    <Link href={`/user/${user.id}`} className="group block">
      <div className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-transparent hover:border-indigo-200 shadow-sm hover:shadow-md transition-all">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 mr-4 shadow-inner">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name || user.username || "User"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <User size={24} />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {user.name || user.username}
          </h3>
          {user.username && <p className="text-sm text-slate-500">@{user.username}</p>}
        </div>
      </div>
    </Link>
  );
}
