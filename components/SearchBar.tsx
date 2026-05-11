import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="w-full max-w-3xl mx-auto mt-0 mb-12">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-16 pr-6 py-5 bg-white border border-zinc-300 rounded-full text-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-md"
          placeholder="Search for songs, artists, or lyrics..."
        />
      </div>
    </div>
  );
}