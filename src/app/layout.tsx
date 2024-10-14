import '../styles/index.css';

import type { PropsWithChildren } from 'react';
import { Metadata, Viewport } from 'next';

import { seo } from '~/seo';

export const metadata: Metadata = {
  metadataBase: seo.url,
  title: {
    template: '%s | zhw',
    default: seo.title,
  },
  description: seo.description,
  keywords: 'zhw blog',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  // manifest: '/site.webmanifest', //pwa
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
  }, //爬虫
  openGraph: {
    title: {
      default: seo.title,
      template: '%s | zhw',
    },
    description: seo.description,
    siteName: 'zhw blog',
    locale: 'zh_CN',
    type: 'website',
    url: 'http://localhost:3000',
  }, //分享到其他媒体
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000212' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  minimumScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
