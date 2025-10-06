import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@/components/Analytics';
import { PostHogProvider } from '@/components/PostHogProvider';
import TrackingScript from '@/components/TrackingScript';
import HiddenHoneypot from '@/components/HiddenHoneypot';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Kendall Greeven - Machine Learning & Solutions Engineering',
  description: 'Personal portfolio of Kendall Greeven - Machine Learning Engineer and Solutions Engineer based in San Diego.',
  keywords: ['Machine Learning', 'Solutions Engineering', 'Portfolio', 'Software Engineer', 'CompTIA Security+'],
  authors: [{ name: 'Kendall Greeven' }],
  creator: 'Kendall Greeven',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://greeventech.com',
    title: 'Kendall Greeven - Machine Learning & Solutions Engineering',
    description: 'Personal portfolio of Kendall Greeven - Machine Learning Engineer and Solutions Engineer.',
    siteName: 'GreevenTech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kendall Greeven - Machine Learning & Solutions Engineering',
    description: 'Personal portfolio of Kendall Greeven - Machine Learning Engineer and Solutions Engineer.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <PostHogProvider>
            <TrackingScript />
            <HiddenHoneypot />
            {children}
            <Analytics />
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
