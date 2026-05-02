import type { Metadata } from 'next';
import { Baloo_2, DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import './globals.css';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-baloo',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'StreetEats Enterprise App',
  description: 'Apna Khana. Apna Dukaan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased font-sans bg-[#0F0F1A] text-white flex items-center justify-center min-h-screen overflow-hidden m-0 p-0" suppressHydrationWarning>
        <div className="relative w-full max-w-[390px] h-[100dvh] md:h-[844px] md:max-h-[90vh] bg-[#0A0A0F] shadow-[0_40px_100px_rgba(0,0,0,0.6),inset_0_0_0_8px_rgba(255,255,255,0.05)] md:border-[4px] md:border-[#222] md:rounded-[44px] overflow-hidden flex flex-col mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
