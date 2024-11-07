'use client';

import type { Spring } from 'framer-motion';
import { animateValue } from 'framer-motion';

const spring: Spring = {
  type: 'spring',
  stiffness: 1000,
  damping: 250,
};

export const springScrollTo = (y: number) => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  const stopSpringScrollHandler = () => {
    animation.stop();
  };
  const animation = animateValue({
    keyframes: [scrollTop + 1, y],
    autoplay: true,
    ...spring,
    onPlay() {
      window.addEventListener('wheel', stopSpringScrollHandler);
      window.addEventListener('touchmove', stopSpringScrollHandler);
    },

    onUpdate(latest) {
      if (latest <= 0) {
        animation.stop();
      }

      window.scrollTo(0, latest);
    },
  });

  animation.then(() => {
    window.removeEventListener('wheel', stopSpringScrollHandler);
    window.removeEventListener('touchmove', stopSpringScrollHandler);
  });

  return animation;
};

export const springScrollToTop = () => {
  return springScrollTo(0);
};

export const springScrollToElement = (element: HTMLElement, delta = 40) => {
  const y = calculateElementTop(element);

  const to = y + delta;

  return springScrollTo(to);
};

const calculateElementTop = (el: HTMLElement) => {
  let top = 0;

  while (el) {
    top += el.offsetTop;
    el = el.offsetParent as HTMLElement;
  }

  return top;
};