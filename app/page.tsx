import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-black pointer-events-none" />
        
        <div className="z-10 w-full text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
            Understand the Music.
          </h1>
          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            Search for lyrics, read annotations, and explore the meaning behind your favorite songs with AI.
          </p>
          
          <SearchBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}