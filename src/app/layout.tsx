import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Annu Beauty Salon — AI Voice Receptionist Demo',
  description: 'AI Voice Receptionist demo for Annu Beauty Salon. Multilingual voice booking in English, Hindi, and Telugu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased bg-salon-50/40 text-salon-950`}>
        <Navigation />
        <main className="flex-1">{children}</main>
        
        {/* Subtle Footer */}
        <footer className="border-t border-roseGold-200/60 bg-white py-6 text-center text-xs text-salon-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>&copy; {new Date().getFullYear()} Annu Beauty Salon &bull; Virtual Receptionist Prototype (DEMO)</p>
            <p className="text-[11px] text-salon-400">
              Built for demonstration &bull; English &bull; हिंदी &bull; తెలుగు
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
