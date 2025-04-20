import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {Toaster} from '@/components/ui/toaster';
import {CustomCursor} from '@/components/CustomCursor';
import BubbleBackground from '@/components/BubbleBackground';
import {Header} from '@/components/Header';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Brain Hack',
  description: 'AI-powered productivity optimization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <CustomCursor />
        <BubbleBackground />
        <Header />
        <div className="relative z-10 pt-16">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
