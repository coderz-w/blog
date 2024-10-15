'use client';

import { useEffect, useState } from 'react';
import Chroma from 'chroma-js';

import { createPngNoiseBackground } from '@/lib/noise';

const hexToOklchString = (hex: string) => {
  const color = Chroma(hex);
  const oklab = color.oklab();

  return oklab.map((value: any) => value.toFixed(2)).join(' ');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const convertHexToRgbString = (hex: string): string => {
  const color = Chroma(hex);
  const [r, g, b] = color.rgb();

  return `${r} ${g} ${b}`;
};

const accentColorLight = [
  // 浅葱
  '#33A6B8',
  '#FF6666',
  '#26A69A',
  '#fb7287',
  '#69a6cc',
];

const accentColorDark = [
  // 桃
  '#F596AA',
  '#A0A7D4',
  '#ff7b7b',
  '#99D8CF',
  '#838BC6',
];

const defaultAccentColor = { light: accentColorLight, dark: accentColorDark };

const lightBg = 'rgb(250, 250, 250)';
const darkBg = 'rgb(0, 2, 18)';

const AccentColorStyleInjector = () => {
  const [, setCurrentAccentColorLRef] = useState<string>('');
  const [, setCurrentAccentColorDRef] = useState<string>('');

  useEffect(() => {
    const initializeStyles = async () => {
      const { light, dark } = defaultAccentColor;

      const lightColors = light;
      const darkColors = dark;

      const Length = Math.max(lightColors.length ?? 0, darkColors.length ?? 0);
      const randomSeedRef = (Math.random() * Length) | 0;
      const lightColor = lightColors[randomSeedRef];
      const darkColor = darkColors[randomSeedRef];

      setCurrentAccentColorLRef(lightColor);
      setCurrentAccentColorDRef(darkColor);

      const lightOklch = hexToOklchString(lightColor);
      const darkOklch = hexToOklchString(darkColor);

      const [hl, sl, ll] = lightOklch.split(' ');
      const [hd, sd, ld] = darkOklch.split(' ');

      const [lightBgImage, darkBgImage] = await Promise.all([
        createPngNoiseBackground(lightColor),
        createPngNoiseBackground(darkColor),
      ]);

      const lightMixColor = Chroma(lightBg).mix(Chroma(lightColor), 0.05).hex();
      const darkMixColor = Chroma(darkBg).mix(Chroma(darkColor), 0.12).hex();

      const styleContent = `
        html[data-theme='light'] .noise body::before {
          position: fixed;
          inset: 0;
          content: '';
          opacity: 0.04;
          background-repeat: repeat;
          background-image: url(${lightBgImage});
        }
        html[data-theme='dark'].noise body::before {
          position: fixed;
          inset: 0;
          content: '';
          opacity: 0.01;
          background-repeat: repeat;
          background-image: url(${darkBgImage});
        }
        html {
          --a: ${hl} ${sl} ${ll};
          --accent-color: ${lightColor};
        }
        html[data-theme='dark'] {
          --a: ${hd} ${sd} ${ld};
          --accent-color: ${darkColor};
        }
        html[data-theme='light'] {
          --root-bg: ${lightMixColor};
          background-color: var(--root-bg) !important;
        }
        html[data-theme='dark'] {
          --root-bg: ${darkMixColor};
        }
      `;

      const styleElement = document.createElement('style');
      styleElement.id = 'accent-color-style';
      styleElement.setAttribute('data-light', lightColor);
      styleElement.setAttribute('data-dark', darkColor);
      styleElement.innerHTML = styleContent;
      document.head.appendChild(styleElement);

      return () => {
        const existingStyle = document.getElementById('accent-color-style');

        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    };

    initializeStyles();
  }, []);

  return null;
};

export default AccentColorStyleInjector;
