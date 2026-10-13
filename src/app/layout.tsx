import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { site, profile } from '@/data/site';
import PointerEffects from '@/components/PointerEffects';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: profile.name, url: site.url }],
  keywords: [
    'Satyam Sharma',
    'reinforcement learning',
    'machine learning',
    'sparse rewards',
    'Institute of Science Tokyo',
    'Ichise Laboratory',
    'MEXT scholar',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: site.url,
    siteName: profile.name,
    title: site.title,
    description: site.description,
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: '#0b0d12',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: site.url,
  image: `${site.url}/images/headshot.jpg`,
  jobTitle: "Master's student, reinforcement learning",
  affiliation: { '@type': 'CollegeOrUniversity', name: 'Institute of Science Tokyo' },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Sant Longowal Institute of Engineering and Technology' },
  ],
  address: { '@type': 'PostalAddress', addressLocality: 'Meguro', addressRegion: 'Tokyo', addressCountry: 'JP' },
  knowsAbout: ['Reinforcement learning', 'Machine learning', 'Deep learning', 'Large language models'],
  sameAs: [profile.github, profile.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="font-sans">
        <div className="backdrop" aria-hidden="true" />
        {children}
        <PointerEffects />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
