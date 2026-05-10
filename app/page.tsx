import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-zinc-50">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Decorative background pattern/gradient to add depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-zinc-50 to-zinc-100 pointer-events-none" />
        
        <div className="z-10 w-full text-center px-6 mt-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-950 via-indigo-800 to-indigo-600 drop-shadow-sm">
            Understand the Music.
          </h1>
          <p className="text-xl text-zinc-600 mb-10 max-w-2xl mx-auto font-medium">
            Search for lyrics, read annotations, and explore the meaning behind your favorite songs with AI.
          </p>
          
          <SearchBar />
        </div>
      </main>

      <Footer />
    </div>
  );
}