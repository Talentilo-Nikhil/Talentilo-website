import type { Metadata, Viewport } from 'next';
import { Albert_Sans, EB_Garamond } from 'next/font/google';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { JsonLd } from '@/components/ui/JsonLd';
import { ORGANIZATION_ID, site } from '@/config/site';
import './globals.css';

const albertSans = Albert_Sans({
  variable: '--font-albert-sans',
  subsets: ['latin'],
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  variable: '--font-eb-garamond',
  subsets: ['latin'],
  display: 'swap',
  // The file sets one word per heading in italic ("Everything Else", "Human") — without this,
  // font-style: italic falls back to the browser's synthetic slant instead of the real face.
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#0c0a10',
  colorScheme: 'light',
};

/** The one description of the company as an entity, emitted on every page. */
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: site.name,
  url: site.url,
  logo: `${site.url}/figma/creatives/logo-color.png`,
  description: site.description,
  sameAs: [site.social.linkedin, site.social.x, site.social.instagram],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: site.email.sales,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${ebGaramond.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={organizationJsonLd} />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
