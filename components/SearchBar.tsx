import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-32 mb-32 px-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-zinc-400 group-focus-within:text-yellow-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-16 pr-6 py-5 bg-zinc-900 border border-zinc-700 rounded-full text-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all shadow-lg shadow-black/20"
          placeholder="Search for songs, artists, or lyrics..."
        />
      </div>
    </div>
  );
}