import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lyryx Frontend',
  description: 'Genius-like lyrics platform frontend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
