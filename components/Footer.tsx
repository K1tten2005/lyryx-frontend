export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto bg-white border-t border-zinc-200 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-zinc-500 text-sm">
      <p className="font-medium">© {new Date().getFullYear()} Lyryx. All rights reserved.</p>
    </footer>
  );
}