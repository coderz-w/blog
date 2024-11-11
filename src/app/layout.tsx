import '../styles/index.css';

import type { PropsWithChildren } from 'react';
import { Metadata, Viewport } from 'next';

import WebAppProviders from '@/components/providers/root';
import AccentColorStyleInjector from '@/components/modules/shared/AccentColorStyleInjector';
import Root from '@/components/layout/Root';
import { seo } from '~/index';
import { sansFont, serifFont } from '@/lib/fonts';

export const metadata: Metadata = {
  metadataBase: seo.url,
  title: {
    template: seo.template,
    default: seo.title,
  },
  description: seo.description,
  keywords: seo.keywords,
  verification: { google: seo.googleVerification },
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
  },
  openGraph: {
    title: {
      default: seo.title,
      template: '%s | zhw',
    },
    images: [
      {
        url: '/api/og',
        alt: 'zhw blog',
      },
    ],
    description: seo.description,
    siteName: 'zhw blog',
    locale: 'zh_CN',
    type: 'website',
    url: 'https://blog-rbtb.vercel.app/',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000212' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh-CN" className=" noise" suppressHydrationWarning>
      <head>
        <SayHi />
        <AccentColorStyleInjector />
      </head>
      <body className={`${sansFont.variable} ${serifFont.variable} m-0 h-full p-0 font-sans`}>
        <WebAppProviders>
          <div data-theme>
            <Root>{children}</Root>
          </div>
        </WebAppProviders>
      </body>
    </html>
  );
}

const SayHi = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
    (${function () {
      console.log(
        '%c Welcome my blog %c https://github.com/coderz-w/blog',
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      );
      console.log('%c', 'color: #000; margin: 1em 0; padding: 5px 0; background: #efefef;');
    }.toString()})();`,
      }}
    />
  );
};
