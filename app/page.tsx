import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Subtle light background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-zinc-100 pointer-events-none" />
        
        <div className="z-10 w-full text-center px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600">
            Understand the Music.
          </h1>
          <p className="text-xl text-zinc-600 mb-10 max-w-2xl mx-auto">
            Search for lyrics, read annotations, and explore the meaning behind your favorite songs with AI.
          </p>
          
          <SearchBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}