import { ImageResponse } from 'next/og';
import { ImageResponseOptions, NextRequest } from 'next/server';

import { seo } from '~/index';
import { buildPostData } from '@/core';

export const runtime = 'edge';

const { postDataMap } = buildPostData();

const resOptions = {
  width: 1200,
  height: 600,
  emoji: 'twemoji',
  headers: new Headers([
    ['cache-control', 'max-age=3600, s-maxage=3600, stale-while-revalidate=600'],
    ['cdn-cache-control', 'max-age=3600, stale-while-revalidate=600'],
  ]),
} as ImageResponseOptions;
const HomeOGImage = () => {
  const seed = Math.random().toString(36).substring(7);
  const bgAccent = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [60, 70],
  }).color;

  const bgAccentLight = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [80, 90],
  }).color;

  const bgAccentUltraLight = uniqolor(seed, {
    saturation: [30, 35],
    lightness: [95, 96],
  }).color;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',

        background: `linear-gradient(37deg, ${bgAccent} 27.82%, ${bgAccentLight} 79.68%, ${bgAccentUltraLight} 100%)`,

        fontFamily: 'Noto Sans, Inter, "Material Icons"',

        padding: '80px 15rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <img
        src="/image/owner.jpg"
        style={{
          borderRadius: '50%',
        }}
        height={256}
        width={256}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '3rem',
          width: '500px',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h3
          style={{
            color: '#ffffff99',
            fontSize: '3.5rem',
            whiteSpace: 'nowrap',
          }}
        >
          {seo.ogTitle}
        </h3>
        <p
          style={{
            fontSize: '1.8rem',
            height: '5.2rem',
            overflow: 'hidden',
            lineClamp: 2,
            color: '#ffffff89',
          }}
        >
          {seo.description}
        </p>
      </div>
    </div>
  );
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = req.nextUrl;

    const dataString = searchParams.get('nid') as string;

    if (!dataString) {
      return new ImageResponse(<HomeOGImage />, resOptions);
    }

    try {
      if (!(dataString in postDataMap)) {
        throw new Error('No such post');
      }
    } catch {
      return new Response('Failed to parse the data.', { status: 400 });
    }

    const postName = postDataMap[dataString].title;

    const bgAccent = uniqolor(postName, {
      saturation: [30, 35],
      lightness: [60, 70],
    }).color;

    const bgAccentLight = uniqolor(postName, {
      saturation: [30, 35],
      lightness: [80, 90],
    }).color;

    const bgAccentUltraLight = uniqolor(postName, {
      saturation: [30, 35],
      lightness: [95, 96],
    }).color;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',

            background: `linear-gradient(37deg, ${bgAccent} 27.82%, ${bgAccentLight} 79.68%, ${bgAccentUltraLight} 100%)`,

            fontFamily: 'Inter, Noto Sans, Inter, "Material Icons"',

            padding: '80px',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',

              position: 'absolute',
              left: '5rem',
              top: '5rem',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/image/owner.jpg"
              style={{
                borderRadius: '50%',
              }}
              height={128}
              width={128}
            />

            <span
              style={{
                marginLeft: '3rem',
                color: '#ffffff99',
                fontSize: '2rem',
              }}
            >
              <h3>{seo.ogTitle}</h3>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'column',
              textAlign: 'right',
            }}
          >
            <h1
              style={{
                color: 'rgba(255, 255, 255, 0.92)',
                fontSize: '50px',
                overflow: 'hidden',
                maxHeight: '150px',
                fontWeight: 'bold',
              }}
            >
              {postName}
            </h1>
            <h2
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '38px',
                fontWeight: 'lighter',
              }}
            >
              {seo.word}
            </h2>
          </div>
        </div>
      ),
      resOptions,
    );
  } catch (e: any) {
    return new Response(`Failed to generate the OG image. Error ${e.message}`, {
      status: 500,
    });
  }
};
