import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Figtree } from 'next/font/google';
import Script from 'next/script';

const figtree = Figtree({
  subsets: ['latin'],
});

const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://docs.plytix.com'),
  title: 'Plytix Docs',
  description: 'Developer documentation for the Plytix PIM API and onboarding materials.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={figtree.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
        {umamiSrc && umamiWebsiteId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  );
}
