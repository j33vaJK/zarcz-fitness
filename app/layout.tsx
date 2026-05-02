import type { Metadata, Viewport } from 'next';
import { Oswald } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { Toaster } from '@/components/ui/sonner';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { MobileBottomNav } from '@/components/layout/main-nav';

const oswald = Oswald({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://zarczfitness.in'),
  title: {
    default: 'ZarcZ Fitness Solutions | Premium Gym Gear & Supplements',
    template: '%s | ZarcZ Fitness',
  },
  description: 'Shop premium gym equipment, reliable supplements, and essential fitness accessories at ZarcZ Fitness. Empowering your journey with quality gear at affordable prices.',
  keywords: ['gym equipment', 'fitness accessories', 'supplements', 'bodybuilding gear', 'ZarcZ Fitness', 'home gym india', 'workout gear'],
  authors: [{ name: 'ZarcZ Team' }],
  creator: 'ZarcZ Fitness',
  publisher: 'ZarcZ Fitness',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://zarczfitness.in',
    siteName: 'ZarcZ Fitness',
    title: 'ZarcZ Fitness Solutions | Premium Gym Gear & Supplements',
    description: 'Transform your fitness journey with high-performance equipment and supplements from ZarcZ.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ZarcZ Fitness Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZarcZ Fitness Solutions',
    description: 'Premium gym gear and supplements for the modern athlete.',
    images: ['/og-image.png'],
    creator: '@zarczfitness',
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${oswald.variable} font-sans`}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              <div className="relative flex min-h-screen flex-col pb-16 lg:pb-0">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
                <MobileBottomNav />
              </div>
              <Toaster />
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}