import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'supermirage',
  description: 'Personal photo site',
  keywords: ['photography', 'photos', 'gallery'],
  authors: [{ name: 'supermirage' }],
  icons: {
    icon: [
      { url: '/assets/icons/spiral.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon.png', type: 'image/png', sizes: '180x180' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/assets/icons/cursor1.png" />
        <link rel="preload" as="image" href="/assets/icons/cursor2.png" />
        <link rel="preload" as="image" href="/assets/icons/cursor3.png" />
        <link rel="preload" as="image" href="/assets/icons/muteAudio.png" />
        <link rel="preload" as="image" href="/assets/icons/playAudio.png" />
        <link rel="preload" as="image" href="/assets/icons/dove.png" />
        <link rel="preload" as="image" href="/assets/icons/heart.png" />
      </head>
      <body>
        {children}
        <Script
          src="https://plausible.io/js/script.js"
          data-domain="supermirage.pics"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
} 