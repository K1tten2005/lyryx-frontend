export default function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-zinc-200 flex flex-col items-center justify-center text-zinc-600 text-sm">
      <p>© {new Date().getFullYear()} Lyryx. All rights reserved.</p>
    </footer>
  );
}