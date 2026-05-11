import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

const nunito = Nunito({ subsets: ['latin', 'cyrillic'], variable: '--font-nunito' });

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
      <body className={`${nunito.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: '',
              style: {
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 32px 0 rgba(0, 168, 255, 0.15), inset 0 1px 0 rgba(255,255,255,1)',
                color: '#1e293b',
                fontWeight: 'bold',
                fontFamily: 'var(--font-nunito), sans-serif',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
