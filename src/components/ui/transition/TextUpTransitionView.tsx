'use client';

import { m } from 'framer-motion';
import type { FC, JSX } from 'react';
import React from 'react';

export const TextUpTransitionView: FC<
  {
    text?: string;
    children?: string;

    appear?: boolean;

    eachDelay?: number;
    initialDelay?: number;
  } & JSX.IntrinsicElements['div']
> = (props) => {
  const { appear = true, eachDelay = 0.1, initialDelay = 0, children, text, ...rest } = props;

  if (!appear) {
    return <div {...rest}>{text ?? children}</div>;
  }

  return (
    <div {...rest}>
      {Array.from(text ?? (children as string)).map((char, i) => (
        <m.span
          key={i}
          className="inline-block whitespace-pre"
          initial={{ transform: 'translateY(10px)', opacity: 0.001 }}
          animate={{
            transform: 'translateY(0px)',
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.15,
              delay: i * eachDelay + initialDelay,
            },
          }}
        >
          {char}
        </m.span>
      ))}
    </div>
  );
};
